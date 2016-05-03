var Reflux        = require('reflux');
var ajaxActions   = require('../actions/ajax');
var $             = require('jquery');
var dialogActions = require('../actions/dialog');


var parseResponse = function(res) {
  if (!res.status) {
    return res;
  }

  var transform = function(res, level) {
    if (level >= 2) {
      return res;
    }
    var res2 = {};
    if (typeof res.length === 'number') {
      res2 = [];
    }
    for (var i in res) {
      if (typeof res[i]!=='object' || res[i]===null) {
        res2[i] = res[i];
        continue;
      }
      if (typeof res[i].d !== 'undefined' && typeof res[i].f !== 'undefined') {
        res2[i] = res[i].d.map(function(row) {
          var obj = {};
          res[i].f.forEach(function(fld, i) {
            obj[fld] = row[i];
          });
          return obj;
        });
      } else {
        // console.log('before transform', res[i]);
        // console.log('after transform', transform(res[i], level+1));
        res2[i] = transform(res[i], level+1);
      }
    }
    return res2;
  }
  return transform(res, 0);
};

var ajaxStore = Reflux.createStore({
  init: function() {
      this.listenTo(ajaxActions.request, this.onAjaxRequest),
      this.listenTo(ajaxActions.download, this.onAjaxDownload)
  },

  showSessionTimeout: function() {
    dialogActions.show({
      title:'dialog.title.session_timeout',
      content:'ขาดการติดต่อกับระบบนานเกินกว่าที่กำหนด กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
      actions:[
        {id:'ok', icon:'check52', label:'dialog.ok'}
      ]
    }, function() {
      
      window.location.href = '/signin';
    });
  },

  onAjaxRequest: function(path, data, cb) {
    var req = {
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
    };

    if(data instanceof File) {
      console.log(new Buffer(data.preview));
      req.data = JSON.stringify({ type: data.type, file: data.preview, name:data.name });
    }
    $.ajax({
      type:'post',
      url: '/securestock' + path,
      data: req.data,
      contentType: req.contentType,
      dataType: 'json',
      success: function(res) {
        ajaxActions.requestDone(res.status, res.msg);
        if (res.session===false) {
          this.showSessionTimeout();
        } else {
          // console.log('before', res);
          // console.log('after', parseResponse(res));
          cb(parseResponse(res));
        }
      }.bind(this),
      error: function(e) {
        ajaxActions.requestError(e);
        cb({status:false,error:e});
      }.bind(this)
    });
  },

  onAjaxDownload: function(path, data, cb) {
    // $.post('/securestock' + path, data, function(retData) {
    //   consle.log('OK');
    //   console.log(retData);
    // }, function(res) {
    //   console.log('error');
    // });
    // return;
    $.ajax({
      type: "POST",
      url: '/securestock' + path,
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'binary',
      success: function(response, status, xhr) {
        var filename = "";
        var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.toLowerCase().indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
            }
        }


        var type = xhr.getResponseHeader('Content-Type');
        console.log(type);
        var blob = new Blob([response], { type: type });

        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(blob, filename);
        } else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);

          if (filename) {
              // use HTML5 a[download] attribute to specify filename
              var a = document.createElement("a");
              // safari doesn't support this yet
              if (typeof a.download === 'undefined') {
                  window.location = downloadUrl;
              } else {
                  a.href = downloadUrl;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
              }
          } else {
              window.location = downloadUrl;
          }

          setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
        }
        cb(true);
      },
      error: function(xhr) {
        console.log(error, xhr);
      }
    });
  },
  // Callback
  output: function(flag) {
      var status = flag ? 'ONLINE' : 'OFFLINE';

      // Pass on to listeners
      this.trigger(status);
  }
});

module.exports = ajaxStore;
