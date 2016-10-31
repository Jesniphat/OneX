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

  componentDidMount: function(){
    // location.hash = "";
    if(this.props.params.access){
      var params = this.props.params.access.split('|')

      var user = '';
      var passwd = '';
      var page = '';
      if(params[0] =='15ad'){
        user = '0031';
        passwd = '15ad';
        page = params[1];
      }else if (params[0] =='14vi') {
        user = '0032';
        passwd ='14vi';
        page = params[1];
      }else if(params[0] =='ac-point'){
        user = '9901';
        passwd = '1234';
        page = 'preliminary/fare/import_point';
      }else if (params[0] =='ac-reword') {
        user = '9902';
        passwd ='1234';
        page = 'preliminary/fare/import_reword';
      }else{
        user = params[0];
        passwd = params[1];
        page = params[2] == undefined ? '' : params[2] ;
      }

      var data = this.state.data;
      var m = window.location.href.match(/signin\/(.+)#/);
      if (m.length >= 2) {
        var sid = m[1];
        $.ajax({
          type:'post',
          url:'/signin/api',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify({
            act:'signin',
            user:user,
            hash:helper.md5(helper.md5('ss2015'+user+passwd)+sid),
            //hash:helper.md5(helper.md5('ss2015'+data.user+data.pass)+sid),
            sid:sid
          }),
          dataType:'json',
          success:function(res) {
            console.log('params', res);
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
                window.location.href='/onex/#/' + page;
              });
            } else if (res.session===false){
              this.setState({
                isLock:false,
                message:tr('SESSION TIMEOUT')
              });
              window.location.href='/';
            } else {
              console.log("res");
              this.setState({
                isLock:false,
                message:res.error
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
    }else{
      console.log('noHaveId');
    }
  },
  getFields:function(){
    var flds = {
      user:{id:'user',type:'text',label:'signin.user',icon:'user158', autofocus:true, pattern:'.{4,}'},
      pass:{id:'pass',type:'password',label:'signin.pass',icon:'user158', pattern:'.{4,}'},
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
  onClickHandler:function(id, value) {
    // TODO: change to action
    if(id) this.handleChange(id, value);
    if (this.refs.form.isValid()) {
      this.setState({message:'',isLock:true}, function() {
        // lock done
        var data = this.state.data;
        var m = window.location.href.match(/signin\/(.+)#/);
        if (m.length >= 2) {
          var sid = m[1];
          $.ajax({
            type:'post',
            url:'/signin/api',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
              act:'signin',
              user:data.user,
              hash:helper.md5(helper.md5('ss2015'+data.user+data.pass)+sid),
              sid:sid
            }),
            dataType:'json',
            success:function(res) {
              // console.log("res = ", res);
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
                  window.location.href='/onex';
                });
              } else if (res.session===false){
                this.setState({
                  isLock:false,
                  message:'SESSION TIMEOUT'
                });
                window.location.href='/';
              } else {
                this.setState({
                  isLock:false,
                  message:tr(res.error)
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

    return (
      <div className="signin-form flex" ref={this.didDOMReady}>
        <div className="box1"></div>
        <div className={'box3 lockable'+(this.state.isLock?' lock':'')}>
          <div className="lock"></div>

          <div className="panel3">
            <T content="signin.title" component="h1" className="title1"/>
          </div>
          <FlexForm ref="form" fields={flds} data={this.state.data}>
            <div className="panel3">
              <FlexTextInput ref="user" field={flds.user} data={this.state.data} onChange={this.handleChange} onEnter={this.onClickHandler}/>
            </div>
            <div className="panel3">
              <FlexTextInput ref="pass" field={flds.pass} data={this.state.data} onChange={this.handleChange} onEnter={this.onClickHandler}/>
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
              <div className="panel2" style={{ lineHeight: '32px' }}>
                <Link to="forgot"><T content="signin.forget"/></Link>
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
