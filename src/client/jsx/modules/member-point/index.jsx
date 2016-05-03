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
      background: "url('/img/photo.png') 0px 0px no-repeat",
      backgroundSize: 'contain',
      paddingLeft: 124,
      height: 96
    }
    return (
      <div className="ui one column grid" style={{ width: 720, margin: 'auto' }}>
        <div className="column">
          <div className="ui centered grid">
            <div className="ten wide column">
              <div style={image_logo}>
                <h1 className="ui header" style={{ textAlign: 'center' }}>
                  {tr.translate('member.title_th')}<br/>{tr.translate('member.title_en')}
                </h1>
              </div>
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
