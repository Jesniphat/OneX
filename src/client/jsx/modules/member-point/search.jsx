var React         = require('react');
var Router        = require('react-router');
var tr            = require('counterpart');
var T             = require('react-translate-component');
var helper        = require('../../../../server/lib/helper');

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var store = require('./store');
var actions = require('./actions');
var Reflux = require('reflux');

var Search = React.createClass({
  mixins:[
    Reflux.listenTo(actions.getTaxID.done, 'doneGetTaxID')
  ],
  getInitialState:function() {
    return { 
      data:{ }
    };
  },
  componentDidMount: function(){
    $('.ui.search.form').form({
      onSuccess: function(event, fields){
        if($.trim($('.search.input>input').val()) != '') {
          $('.search.input').removeClass('error');
          $('.search.input').addClass('loading');
          actions.getTaxID({ code: $('.search.input>input').val() });
        }
        return false;
      }
    });
  },
  doneGetTaxID: function(res){
    $('.search.input').removeClass('loading');
    if(res.found) {
      this.props.history.pushState(null, '/'+$('.search.input>input').val());
    } else {
      $('.search.input').addClass('error');
    }
  },
  render: function() {
    const width = {
      width: 460,
    }

    return (
      <div className="ui centered grid">
        <div className="column" style={width}>
          <form className="ui search form" >
            <div className="two fields">
              <div className="field" style={{ textAlign:'right',width:130,paddingTop:9,fontSize:18 }}>
                {tr.translate('text.search')}
              </div>
              <div className="field">
                <div className="ui icon search input" style={{ width:290 }}>
                  <input type="text" placeholder="Search..."/>
                  <i className="search icon"></i>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="ui submit blue icon button" style={{ width:130 }}>
                <i className="search icon" style={{ marginRight:10 }}></i> 
                {tr.translate('button.search')}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = Search;
