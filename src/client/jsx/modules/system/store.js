var Reflux          = require('reflux');
var $               = require('jquery');

var ajaxActions     = require('./actions/ajax');
var systemActions   = require('./actions');
var storage         = require('./storage');
var helper          = require('../../../../server/lib/helper');

var systemStore = Reflux.createStore({
  listenables: [systemActions],

  getMaster: function() {
    return this.masterData || null;
  },

  onGetMaster: function() {
    if (!this.masterData) {
      ajaxActions.request('/api/system/getMaster', {}, this.didGetMaster);
    } else {
      systemActions.getMaster.done(this.masterData);
    }
  },

  onIniModule: function(item) {
    systemActions.iniModule.done(item);
  },

  didGetMaster: function(res) {
    console.log('didGetMaster', res);
    if (res.status===true) {
      systemActions.getMaster.done(res.data);
      this.masterData = res.data;
      return;
    }
    systemActions.getMaster.error(res.error);
  },

  onSignout: function() {
    ajaxActions.request('/api/system/signout', {}, this.didSignout);
  },

  didSignout: function(res) {
    if (res.status===true) {
      systemActions.signout.done();
      return;
    }
    systemActions.signout.error(res.error);
  },

  onPing: function() {
    ajaxActions.request('/api/system/ping', {}, this.didPing);
  },

  didPing: function(res) {
    if (res.status===true) {
      systemActions.ping.done(res.sessionID);
      return;
    }
    systemActions.ping.error(res.error);
  },

  onGetIDCardReaders: function() {
    $.ajax({
      url:'//localhost:9001/idcard/readers',
      type:'get',
      dataType:'json',
      success: function(result) {
//        console.log('onReadIDCardReaders', result);
        if (result.status===true) {
          systemActions.getIDCardReaders.done(result.readers);
        } else {
          systemActions.getIDCardReaders.error();
        }
      },
      error: function() {
        systemActions.getIDCardReaders.error();
      }
    });
  },

  onReadIDCard: function(reader, ref) {
    $.ajax({
      url:'//localhost:9001/idcard/read' + (reader ? '/'+reader : ''),
      type:'get',
      dataType:'json',
      success: function(result) {
        //console.log('onReadIDCard', result);
        if (result.status===true) {
          systemActions.readIDCard.done(result.idcard, ref);
        } else {
          systemActions.readIDCard.error();
        }
      },
      error: function(e) {
        systemActions.readIDCard.error();
      }
    });
  },

  onReadIDCardPhoto: function(reader, ref) {
    $.ajax({
      url:'//localhost:9001/idcard/readPhoto' + (reader ? '/'+reader : ''),
      type:'get',
      dataType:'json',
      success: function(result) {
        console.log('onReadIDCardPhoto', result);
        if (result.status===true) {
          systemActions.readIDCardPhoto.done({
            nationid: result.nationid,
            photoPath: '//localhost:9001/idcard/photo/' + result.nationid + '.jpg',
            ref: ref
          });
        } else {
          systemActions.readIDCardPhoto.error();
        }
      },
      error: function(e) {
        systemActions.readIDCardPhoto.error();
      }
    });
  },
  onPrinterList: function(param) {
    $.ajax({
      url:param.url + '/printer/list',
      type:'get',
      dataType:'json',
      success: function(result) {
        systemActions.printerList.done({
          ref:param.ref,
          printers: result.printers
        });
      },
      error: function(err) {
        systemActions.printerList.error(err);
      }
    })
  },

  onPrint: function(req) {
    var option = storage.load('system.printers', {
      printerLaserUrl: 'http://localhost:9001',
      printerDotUrl: 'http://localhost:9001',
      printerLaser: 'Foxit Reader PDF Printer',
      printerDot: 'Foxit Reader PDF Printer'
    });

    var param = {
      uuid: helper.newUUID(),
      report: '',
      param: {url: req.url},
      format: 'PDFURL',
      printer: req.printer || option.printerLaser,
      numCopy: req.numCopy || 1
    };
    console.log(param);
    $.ajax({
      type:'post',
      url:option.printerLaserUrl + '/printer/submit',
      contentType: 'application/json; charset=utf-8',
      data:JSON.stringify(param),
      dataType:'json',
      success: function(result) {
        systemActions.print.done();
      },
      error: function(e) {
        systemActions.print.error(e);
      }
    });
  },

  onGetCounts: function(param) {
    ajaxActions.request(param.request, param.list, this.didGetCounts);
  },

  didGetCounts: function(res) {
    console.log(res);
    systemActions.getCounts.done(res);
    if (res.status===true) {
      systemActions.getCounts.done(res.counts);
      return;
    }
    systemActions.getCounts.error();
  },
});

module.exports = systemStore;
