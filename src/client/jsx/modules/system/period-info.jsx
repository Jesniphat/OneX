var React           = require('react');
var Reflux          = require('reflux');
var T               = require('react-translate-component');
var cn              = require('classnames');
var tr              = require('counterpart');

var system          = require('ss-system');
var sessionStore    = system.sessionStore; //require('./stores/session');

var PeriodInfo = React.createClass({
  mixins: [
    Reflux.listenTo(sessionStore, 'onSessionLoaded'),
  ],

  getInitialState: function() {
    return {
      period: '2015-05-01',
    }
  },

  onSessionLoaded: function(session) {
    //console.log('session.period=',session);
    this.setState({
      period: session.staff.cur_date
    });
  },

  render: function() {
    var date = new Date(this.state.period);
    var p = tr.localize(date, {type:'date', format:'long'});
    return (
      <div id="period-picker">
        {p}
      </div>
    );
  }
});

module.exports = PeriodInfo;
