var React         = require('react');
var Router        = require('react-router');
var tr            = require('counterpart');
var T             = require('react-translate-component');
var helper        = require('../../../../server/lib/helper');

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var Index = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState:function() {
    return {
      data:{
      }
    };
  },
  render: function() {
    const image_logo = {
      backgroundImage: "url('/img/icon2/user_group.png')",
      backgroundRepeat: "no-repeat",
      backgroundSize: 'contain',
      width: 410,
      height: 96,
      marginTop: 40,
      paddingLeft: 95
    }
    return (
      <div className="ui grid" style={{ padding: '0px 20px' }}>
        <div className="sixteen wide column">
          <div className="ui centered grid">
            <div className="column" style={image_logo}>
              <h1 className="ui header" style={{ textAlign: 'center' }}>
                {tr.translate('member.title_th')}<br/>{tr.translate('member.title_en')}
              </h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="column">{this.props.children}</div>
        </div>
      </div>
    );
  }
});

module.exports = Index;
