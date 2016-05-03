var React           = require('react');
var Reflux          = require('reflux');
var T               = require('react-translate-component');
var cn              = require('classnames');
var tr              = require('counterpart');
var system          = require('ss-system');
var actions         = system.systemActions;

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var clearMessageInterval = 10 * 1000;

var IDCardInfo = React.createClass({
  mixins: [
    Reflux.listenTo(actions.getIDCardReaders.done, 'onGetIDCardReadersDoneAction'),
    Reflux.listenTo(actions.getIDCardReaders.error, 'onGetIDCardReadersErrorAction'),
    Reflux.listenTo(actions.readIDCard, 'onReadIDCardAction'),
    Reflux.listenTo(actions.readIDCard.done, 'onReadIDCardDoneAction'),
    Reflux.listenTo(actions.readIDCard.error, 'onReadIDCardErrorAction')
  ],

  componentDidMount: function() {
    this.interval = setInterval(function() {
      if (!this.state.isReading) {
        actions.getIDCardReaders();
      }
    }.bind(this), 60000);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },

  getInitialState: function() {
    return {
      isReading: false,
      isError: false,
      hasReader: false,
      status: 'status.idcard.nocard',
      message: '',
    }
  },

  onGetIDCardReadersDoneAction: function(readers) {
    this.setState({
      hasReader: false,
      status: readers.length==0 ? 'status.idcard.noreader' : 'status.idcard.ready'
    });
  },

  onGetIDCardReadersErrorAction: function() {
    this.setState({
      hasReader: false,
      status: 'status.idcard.noreader'
    });
  },

  onReadIDCardAction: function() {
    this.isReading = true;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.setState({
      isReading: true,
      isError: false,
      status: 'status.idcard.reading',
      message: ''
    });
  },

  onReadIDCardDoneAction: function(status, msg) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({
      isReading: false,
      isError: false,
      status: 'status.idcard.ready',
      message: msg
    });
    this.timer = setTimeout(function() {
      this.setState({
        message:''
      });
    }.bind(this), clearMessageInterval);
  },

  onReadIDCardErrorAction: function(e) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.setState({
      isReading: false,
      isError: true,
      status: 'status.idcard.error'
    });

    this.timer = setTimeout(function() {
      this.setState({
        isReading: false,
        isError: false,
        status: 'status.idcard.ready'
      });
    }.bind(this), clearMessageInterval);
  },
  render: function() {
    var classList = cn('icon', {
      'zooming': this.state.isReading && !this.state.isError,
      'flaticon-framed1': !this.state.isError,
      'flaticon-warning37': this.state.isError
    });
    var title = tr.translate(this.state.status);
    return (
      <div className={classList} title={title}></div>
    );
  }
});

module.exports = IDCardInfo;
