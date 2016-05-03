var React           = require('react');
var Reflux          = require('reflux');
var T               = require('react-translate-component');
var cn              = require('classnames');
var tr              = require('counterpart');

var system          = require('ss-system');
var widgets         = require('ss-widget');

var actions         = system.systemActions;
var storage         = system.storage;

var FlexTextInput   = widgets.FlexTextInput;
var FlexIcon        = widgets.FlexIcon;
var FlexDropdown    = widgets.FlexDropdown;

console.log('drop=', FlexDropdown);

var storageKey = 'system.printers';

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var clearMessageInterval = 10 * 1000;

var IDCardInfo = React.createClass({
  mixins: [
    Reflux.listenTo(actions.bodyClick, 'onBodyClickAction'),
    Reflux.listenTo(actions.printerList.done, 'onPrinterListDoneAction'),
    Reflux.listenTo(actions.printerList.error, 'onPrinterListErrorAction'),
    Reflux.listenTo(actions.print, 'onPrintAction'),
    Reflux.listenTo(actions.print.done, 'onPrintDoneAction'),
    Reflux.listenTo(actions.print.error, 'onPrintErrorAction')
  ],

  componentDidMount: function() {
    actions.printerList({
      url: this.state.printerLaserUrl,
      ref: 'printerLaser'
    });
    actions.printerList({
      url: this.state.printerDotUrl,
      ref: 'printerDot'
    });
  },

  componentWillUnmount: function() {
  },

  getInitialState: function() {
    var option = storage.load(storageKey, {
      printerLaserUrl: 'http://localhost:9001',
      printerDotUrl: 'http://localhost:9001',
      printerLaser: 'Foxit Reader PDF Printer',
      printerDot: 'Foxit Reader PDF Printer'
    });
    return {
      printerLaserUrl:option.printerLaserUrl,
      printerDotUrl:option.printerDotUrl,
      printerLaser:option.printerLaser,
      printerDot:option.printerDot,
      printerLaserList:[],
      printerDotList:[],
      isShow:false,
      isPrinting:false,
      isError:false,
      status:'status.printer.ready'
    }
  },

  onBodyClickAction: function() {
    this.setState({
      isShow: false
    });
  },

  savePrinter: function() {
    storage.save(storageKey, {
      printerLaserUrl: this.state.printerLaserUrl,
      printerDotUrl: this.state.printerDotUrl,
      printerLaser: this.state.printerLaser,
      printerDot: this.state.printerDot
    });
  },

  onPrinterListDoneAction: function(result) {
    this.savePrinter();
    var obj = {};
    var list = result.printers;
    var found = false;
    for (var i = 0; i < list.length; i++) {
      if (list[i].name==this.state[result.ref]) {
        found = true;
        break;
      }
    }
    if (!found) {
      list.unshift({
        value: this.state[result.ref],
        text: this.state[result.ref]
      });
    }
    obj[result.ref+'List'] = list.map(function(row) {
      return {
        value: row.name,
        text: row.name
      };
    });
    this.setState(obj);
  },

  onPrinterListErrorAction: function() {
    this.setState({
      hasReader: false,
      status: 'status.printer.noprinter'
    });
  },

  onPrintAction: function() {
    this.isPrinting = true;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.setState({
      isPrinting: true,
      isError: false,
      status: 'status.printer.printing',
      message: ''
    });
  },

  onPrintDoneAction: function(status, msg) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({
      isPrinting: false,
      isError: false,
      status: 'status.printer.ready',
      message: msg
    });
    this.timer = setTimeout(function() {
      this.setState({
        message:''
      });
    }.bind(this), clearMessageInterval);
  },

  onPrintErrorAction: function(e) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.setState({
      isPrinting: false,
      isError: true,
      status: 'status.printer.error'
    });

    this.timer = setTimeout(function() {
      this.setState({
        isPrinting: false,
        isError: false,
        status: 'status.printer.ready'
      });
    }.bind(this), clearMessageInterval);
  },

  onTogglePrinterMenu: function(e) {
    e.stopPropagation();
    console.log('togglePrinterMenu');
    this.setState({
      isShow: !this.state.isShow
    });
  },

  handleChange: function(id, value) {
    var obj = {};
    obj[id] = value;
    if (id=='printerLaser' || id=='printerDot') {
      console.log('save');
      this.savePrinter();
    }
    this.setState(obj);
  },

  onClick: function(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  listPrinter: function(ref) {
    if (this.state[ref+'Url']=='') {
      toasterActions.pop({
        type:'warning',
        message:'url empty'
      });
      return;
    }
    actions.printerList({
      url:this.state[ref+'Url'],
      ref:ref
    });
  },

  render: function() {
    var classList = cn('icon', {
      'zooming': this.state.isPrinting && !this.state.isError,
      'flaticon-printer88': !this.state.isError,
      'flaticon-warning37': this.state.isError
    });
    var title = tr.translate(this.state.status);
    return (
        <div id="printer-picker">
          <div className={classList} title={title} onClick={this.onTogglePrinterMenu}></div>
          <div id="printer-menu" className={this.state.isShow ? 'show' :null} onClick={this.onClick}>
            <div className="inner flex-form" style={{maxHeight:'400px', overflowY:'auto'}}>
              <T content="system.printer.laser_printer" component="div" className="title"/>
              <div className="flex">
                <FlexTextInput
                  field={{
                    id:'printerLaserUrl',
                    label:'system.printer.url',
                    type:'url',
                    require:true
                  }}
                  data={this.state}
                  onChange={this.handleChange}
                  className="can-grow" />
                <FlexIcon
                  icon="undo19"
                  className="no-shrink"
                  title="system.printer.list_printer"
                  onClick={function() {this.listPrinter('printerLaser')}.bind(this)} />
              </div>
              <FlexDropdown
                field={{
                  id:'printerLaser',
                  label:'system.printer.select_a_printer',
                  list:this.state.printerLaserList
                }}
                data={this.state}
                onChange={this.handleChange} />
              <T content="system.printer.dot_printer"
                component="div"
                className="title"
                style={{marginTop:'4px'}}/>
              <div className="flex">
                <FlexTextInput
                  field={{
                    id:'printerDotUrl',
                    label:'system.printer.url',
                    type:'url',
                    require:true
                  }}
                  data={this.state}
                  onChange={this.handleChange}
                  className="can-grow" />
                <FlexIcon
                  icon="undo19"
                  className="no-shrink"
                  title="system.printer.list_printer"
                  onClick={function() {this.listPrinter('printerDot')}.bind(this)} />
              </div>
              <FlexDropdown
                field={{
                  id:'printerDot',
                  label:'system.printer.select_a_printer',
                  list:this.state.printerDotList
                }}
                data={this.state}
                onChange={this.handleChange}
                />
            </div>
          </div>
        </div>
    );
  }
});

module.exports = IDCardInfo;
