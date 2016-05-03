var React           = require('react');
var Reflux          = require('reflux');
var T               = require('react-translate-component');
var ajaxActions     = require('../../actions/ajax');
var cn              = require('classnames');
var tr              = require('counterpart');

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var clearMessageInterval = 10 * 1000;

var StatusInfo = React.createClass({
  mixins: [
    Reflux.listenTo(ajaxActions.request, 'onAjaxRequest'),
    Reflux.listenTo(ajaxActions.requestDone, 'onAjaxDone'),
    Reflux.listenTo(ajaxActions.requestError, 'onAjaxError')
  ],
  getInitialState: function() {
    return {
      isLoading: false,
      isError: false,
      status: 'status.ready',
      message: '',
    }
  },
  onAjaxRequest: function() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({
      isLoading: true,
      isError: false,
      status: 'status.loading',
      message: ''
    });
  },
  onAjaxDone: function(status, msg) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({
      isLoading: false,
      isError: false,
      status: 'status.ready',
      message: msg
    });
    this.timer = setTimeout(function() {
      this.setState({
        message:''
      });
    }.bind(this), clearMessageInterval);
  },
  onAjaxError: function(e) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.setState({
      isLoading: false,
      isError: true,
      status: 'status.error',
      message: e
    });

    this.timer = setTimeout(function() {
      this.setState({
        isLoading: false,
        isError: false,
        status: 'status.ready',
        message: ''
      });
    }.bind(this), clearMessageInterval);
  },
  render: function() {
    var classList = cn('icon', {
      'rotate': this.state.isLoading && !this.state.isError,
      'flaticon-synchronization3': !this.state.isError,
      'flaticon-synchronization4': this.state.isError
    });
    var title = tr.translate(this.state.status);
    return (
      <div id="status-panel" className="flex">
        <div className={classList} title={title}></div>
      </div>
    );
  }
});

module.exports = StatusInfo;
