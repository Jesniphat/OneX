var React             = require('react');
var Reflux            = require('reflux');
var system            = require('ss-system');

var infoPanelActions  = system.infoPanelActions; //require('./actions/info-panel');

var InfoPanel = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.listenTo(infoPanelActions.show,"onInfoPanelShowAction"),
    Reflux.listenTo(infoPanelActions.hide,"onInfoPanelHideAction")
  ],

  getInitialState:function() {
    return {
      isShow:false,
      content:null,
      routeName:null,
    };
  },

  onInfoPanelShowAction:function(backRouteName, content) {
    this.setState({
      isShow:true,
      content:content,
      routeName:backRouteName
    })
  },

  onInfoPanelHideAction:function(content) {
    this.setState({
      isShow:false,
      content:null
    });
  },

  handleBackClick:function() {
    if (this.state.routeName==null || this.state.routeName=='') {
      //this.props.router.back();
      return;
    }
    this.props.history.pushState(null, this.state.routeName);
  },

  render: function() {
    return (
      <div id="info-panel" className={(this.state.isShow ? 'show':'')}><div className="inner-wrap can-grow">
        <div className="act-back flex no-shrink" onClick={this.handleBackClick}>
          <span className="flaticon-go10 act-back-icon no-shrink"></span>
          <span className="label">ย้อนกลับ</span>
        </div>
        <div className="content can-grow">{this.state.content}</div>
      </div></div>
    );
  }
});

module.exports = InfoPanel;
