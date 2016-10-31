var React         = require('react');
var Router        = require('react-router');
var Link          = Router.Link;
var tr            = require('counterpart');
var T             = require('react-translate-component');
var FlexForm      = require('../../widgets/flex-form.jsx');
var FlexTextInput = require('../../widgets/flex-text-input.jsx');
var FlexCheckbox  = require('../../widgets/flex-checkbox.jsx');
var FlexButton    = require('../../widgets/flex-button.jsx');
//var actions       = require('./actions');
var $             = require('jquery');
var helper        = require('../../../../server/lib/helper');

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var SigninForm = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState:function() {
    return {
      data:{
        user: helper.getCookie('ss.signin.user', ''),
        pass:'',
        remember: helper.getCookie('ss.signin.remember', '0')=='1'
      },
      isValid:false,
      message:'',
      isLock:false
    };
  },

  getFields:function(){
    var flds = {
      user:{id:'user',type:'text',label:'signin.user',icon:'user158',
        required:true,autofocus:true,pattern:'.{4,}'},
      pass:{id:'pass',type:'password',label:'signin.pass',icon:'user158',
        required:true,pattern:'.{4,}'},
      signButton:{id:'signin_btn',type:'signin',label:'signin.signButton'},
      remember:{id:'remember',type:'checkbox',label:'signin.remember'}
    };

    var j = 1;
    for (var i in flds) {
      flds[i].tabIndex = j;
      j++;
    }

    return flds;
  },
  setMessage: function(msg, level) {

  },
  onClickHandler:function() {
    // TODO: change to action
    if (this.refs.form.isValid()) {
      this.setState({message:'',isLock:true}, function() {
        // lock done
        var data = this.state.data;
        var m = window.location.href.match(/signin-customer\/(.+)#/);
        if (m.length >= 2) {
          var sid = m[1];
          $.ajax({
            type:'post',
            url:'/signin-customer/api',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
              act:'signin-customer',
              user:data.user,
              hash:data.pass,
              sid:sid
            }),
            dataType:'json',
            success:function(res) {
              if (res.status===true) {
                helper.setCookie('ss.signin.remember', data.remember?'1':'0', 30*24*60*60);
                if (data.remember) {
                  helper.setCookie('ss.signin.user', data.user);
                } else {
                  helper.setCookie('ss.signin.user', '');
                }
                this.setState({
                  isLock:false,
                  message:tr('signin.signin_success')
                }, function() {
                  window.location.href='/securestock';
                });
              } else if (res.session===false){
                this.setState({
                  isLock:false,
                  message:tr('SESSION TIMEOUT')
                });
                window.location.href='/';
              } else {
                this.setState({
                  isLock:false,
                  message:res.msg
                });
              }
            }.bind(this),
            error:function(e,m) {
              this.setState({
                isLock:false,
                message:tr('signin.unknow_error')
              });
            }.bind(this)
          });
        }

      });
    }
  },

  handleChange:function(id, newValue) {
    var data = this.state.data;
    data[id]=newValue;
    this.setState({
      data:data,
      isValid: this.refs.form.isValid()
    });
  },

  didDOMReady: function(component) {
    this.setState({
      isValid: this.refs.form.isValid()
    });
  },

  render: function() {
    var flds = this.getFields();

    var styleIcon = {
      backgroundImage: "url('/img/icon2/user_group.png')",
      height: 160,
      backgroundSize: 140,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '24px 22px'
    }
    return (
      <div className="signin-form flex" ref={this.didDOMReady}>
        <div className="box2" style={{ textAlign: 'center' }}>
          <div style={styleIcon}></div>
        </div>
        <div className={'box3 lockable'+(this.state.isLock?' lock':'')}>
          <div className="lock"></div>
          <div className="panel4">
            <T content="signin.title" component="h1" className="title1"/>
          </div>
          <FlexForm ref="form" fields={flds} data={this.state.data}>
            <div className="panel3">
              <FlexTextInput ref="user" field={flds.user} data={this.state.data} onChange={this.handleChange}/>
            </div>
            <div className="panel3">
              <FlexTextInput ref="pass" field={flds.pass} data={this.state.data} onChange={this.handleChange}/>
            </div>
            <div className="box3 flex">
              <div className="panel2">
                <FlexCheckbox
                  label="signin.remember"
                  field={flds.remember}
                  data={this.state.data}
                  onChange={this.handleChange}
                  />
              </div>
              <div className="panel1">
                <Link to="signin-forget"><T content="signin.forget"/></Link>
              </div>
            </div>
            <div className="panel2">
              <FlexButton
                label="signin.act_signin"
                field={flds.signButton}
                icon="right244"
                default={true}
                onClick={this.onClickHandler}
                disabled={!this.state.isValid}
                />
            </div>
          </FlexForm>
          <div className="panel3 error">
            {this.state.message}
          </div>
        </div>
        <div className="box1"></div>
      </div>
    );
  }
});

module.exports = SigninForm;
