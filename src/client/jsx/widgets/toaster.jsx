var React           = require('react');
var Reflux          = require('reflux');
var T               = require('react-translate-component');

var toasterActions  = require('ss-system').toasterActions;

var run = 0;

var Toaster = React.createClass({
  mixins: [
    Reflux.listenTo(toasterActions.pop, 'onPopAction'),
    Reflux.listenTo(toasterActions.dismissAll, 'onDismissAllAction')
  ],

  getInitialState: function() {
    return {
      list:[]
    };
  },

  onPopAction: function(opt) {
    var msg = {
      id: run++,
      type: opt.type,
      text: opt.message
    };
    if (opt.icon) {
      msg.icon = opt.icon;
    }
    msg.dismiss = false;
    msg.timer = null;

    opt.duration = opt.duration || 3000;
    setTimeout(function() {
      this.doDismiss(msg.id);
    }.bind(this), opt.duration);

    this.state.list.push(msg);
    this.setState({
      list: this.state.list
    });
  },

  onDismissAllAction: function() {
    this.state.list.forEach(function(item, i, items) {
      if (items[i].timer) {
        clearTimeout(items[i].timer);
      }
      items[i].timer = this.clearToastTimer(item.id);
    });
  },

  doDismiss: function(id) {
    var items = this.state.list;
    var l = items.length;
    var found = false;
    for (var i = 0; i < l; i++) {
      if (items[i].id==id) {
        items[i].gone = true;
        found = true;
        break;
      }
    }
    if (!found) {
      return;
    }

    if (items[i].timer) {
      clearTimeout(items[i].timer);
    }

    items[i].timer = this.clearToastTimer(id);

    this.setState({
      list:items
    });
  },

  clearToastTimer: function(id, duration) {
    duration = duration || 1000;
    return setTimeout(function() {
      var i;
      var j = -1;
      var items = this.state.list;
      var l = items.length;
      for (var i = 0; i < l; i++) {
        if (items[i].id==id) {
          j=i;
          break;
        }
      }
      if (j >= 0) {
        this.state.list.splice(j,1);
        this.setState({
          list: this.state.list
        });
      }
    }.bind(this), duration);
  },

  render: function() {
    var list = this.state.list.map(function(item) {
      var icon = item.icon || (item.type=='success' ? 'check52' :
        item.type=='warning' ? 'round52' :
        item.type=='error' ? 'clear5' : 'circle107');
      return (
        <div
          key={item.id}
          className={'message flex ' + item.type + (item.gone?' dismiss':'')}
          onClick={function() {
            this.doDismiss(item.id);
          }.bind(this)}>
          <div className={'flaticon-' + icon + ' icon'}></div>
          <div className="text">{item.text}</div>
        </div>
      );
    }.bind(this));

    return (
      <div className="toaster">
        {list}
      </div>
    );
  }
});

module.exports = Toaster;
