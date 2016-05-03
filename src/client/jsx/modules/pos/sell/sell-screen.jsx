var React     = require('react');
var moment     = require('moment');

var system    = require('ss-system');
var widgets   = require('ss-widget');

var infoPanelActions = system.infoPanelActions;// require('../../../actions/info-panel');
var toasterActions = system.toasterActions;
var helper    = system.helper;
var systemActions = system.systemActions;
var storage   = system.storage;
var systemStore     = system.systemStore;

var tr              = require('counterpart');
var T               = require('react-translate-component');
var DatePicker       = require('react-datepicker');
var FlexForm        = widgets.FlexForm;// require('../../../widgets/flex-form.jsx');
var FlexTextInput   = widgets.FlexTextInput; //require('../../../widgets/flex-text-input.jsx');
var FlexButton      = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
var FlexDisplayTable   = widgets.FlexDisplayTable; //require('../../../widgets/flex-data-table.jsx');
var FlexIcon        = widgets.FlexIcon;
var FlexDropdown    = widgets.FlexDropdown;
var FlexRadioGroup  = widgets.FlexRadioGroup;
var FlexCheckbox    = widgets.FlexCheckbox;
  

var actions = require('./actions');
var Reflux = require('reflux');

var CustomerSection = React.createClass({
  mixins:[
    Reflux.listenTo(actions.dateChange.done, 'doneDateChange'),
    Reflux.listenTo(actions.getCustomerDetail.done, 'doneCustomerDetail')
  ],
  handleDataChange: function(id, value) {
    this.props.data[id] = value;
    this.setState({
      data: this.props.data
    });
  },
  componentDidMount: function() {
    var shop_id = system.sessionStore.getSession().shop.id;
    $('.customer.code > .ui.dropdown').dropdown({ 
      apiSettings: { 
        url: '/securestock/ui/customer/{query}'
      },
      onChange: function(value, text, choice){
        if(value != '') {
          $('.customer.code > .ui.dropdown').addClass('loading');
          actions.getCustomerDetail(value, shop_id);
        }
      }
    });
    $('.customer.staff_sell > .ui.dropdown').dropdown({ 
      apiSettings: { 
        url: '/securestock/ui/staff/{query}',
        data: { shop_id: shop_id } 
      }
    });
    $('.customer.finance_staff > .ui.dropdown').dropdown({ 
      apiSettings: { 
        url: '/securestock/ui/staff/{query}',
        data: { shop_id: shop_id } 
      }
    });
  },
  doneCustomerDetail: function(res){
    this.props.fields.cus_name.value = res.data.name;
    this.props.fields.sell_no.value = res.data.no;
    this.props.fields.tel.value = res.data.tel;
    this.props.fields.deposit.value = res.data.balance;
    this.props.fields.address.value = res.data.address;
    $('.customer.code > .ui.dropdown').removeClass('loading');
  },
  doneDateChange: function(res){
    console.log('doneDateChange', res.data);
    this.props.data.sell_date = moment(res.data.date);
    this.props.data.sell_save = res.data.flagSave;
    this.setState({ data: this.props.data }); 
  },
  onDateChange: function(date){
    var shop_id = system.sessionStore.getSession().shop.id;
    actions.dateChange({ date: date.format('YYYY/MM/DD'), shop_id: shop_id });
  },

  render: function() {
    return (
      <form className="ui form">
        <div className="inline fields">
          <div className="four wide field">
            <div className={"ui customer code "} style={{ width: '100%' }}>
              <select ref={(c) => this.props.fields.cus_code = c} className={"ui wide search dropdown "+(!this.props.data.sell_new?'disabled':'')}>
                <option value="">{tr.translate('sell.cus_code')}</option>
              </select>
            </div>
          </div>
          <div className="four wide field disabled">
            <input disabled={true} ref={(c) => this.props.fields.cus_name = c} type="text" placeholder={tr.translate('sell.cus_name')} />
          </div>
          <div className="four wide field disabled">
            <input disabled={true} ref={(c) => this.props.fields.sell_no = c} type="text" placeholder={tr.translate('sell.sell_no')} />
          </div>
          <div className={"four wide field field-date "+(!this.props.fields.flag.sell_date || !this.props.data.sell_new ?'disabled':'')}>
            <DatePicker
              placeholderText={tr.translate('sell.sell_current')}
              dateFormat="DD/MM/YYYY"
              selected={this.props.data.sell_date}
              onChange={this.onDateChange} 
            />
          </div>
        </div>
        <div className="inline fields">
          <div className="four wide field disabled">
            <input disabled={true} ref={(c) => this.props.fields.tel = c} type="text" placeholder={tr.translate('sell.tel')} />
          </div>
          <div className="four wide field disabled">
            <input disabled={true} ref={(c) => this.props.fields.deposit = c} type="text" placeholder={tr.translate('sell.deposit')} />
          </div>
          <div className="four wide field disabled">
            <input disabled={true} ref={(c) => this.props.fields.staff_save = c} type="text" placeholder={tr.translate('sell.staff_save')} />
          </div>
          <div className="four wide field disabled">
            <input disabled={true} ref={(c) => this.props.fields.stock_date = c} type="text" placeholder={tr.translate('sell.stock_date')} />
          </div>
        </div>
        <div className="inline fields">
          <div className="eight wide field disabled">
            <input disabled={true} ref={(c) => this.props.fields.address = c} type="text" placeholder={tr.translate('sell.address')} />
          </div>
          <div className="four wide field">
            <div className={"ui customer staff_sell "} style={{ width: '100%' }}>
              <select ref={(c) => this.props.fields.staff_sell = c} className={"ui wide search dropdown "+(!this.props.data.sell_new?'disabled':'')}>
                <option value="">{tr.translate('sell.staff_sell')}</option>
              </select>
            </div>
          </div>
          <div className="four wide field">
            <div className={"ui customer finance_staff "} style={{ width: '100%' }}>
              <select ref={(c) => this.props.fields.finance_staff = c} className={"ui wide search dropdown "+(!this.props.data.sell_new?'disabled':'')}>
                <option value="">{tr.translate('sell.finance_staff')}</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    );
  }
});


var ProductSection = React.createClass({
  mixins:[
    Reflux.listenTo(actions.getProductDetail.done, 'doneProductDetail')
  ],
  componentDidMount: function() {
    var shop_id = system.sessionStore.getSession().shop.id;
    $('.ui.setup_type.dropdown').dropdown({
      onChange: function(value, text){
        $('.field.setup_price').removeClass('disabled');
        $('.field.setup_price input').prop('disabled', false);
        switch(value)
        {
          case 'IN_INSTALLATION':
          case 'NO_INSTALLATION':
            $('.field.setup_price').addClass('disabled');
            $('.field.setup_price input').prop('disabled', true);
            $('.field.setup_price input').val('');
            break; 
        }

        if(this.props.data.item_product) {
          // this.props.data.item_product.
        }

      }.bind(this)
    });

    $('.field.setup_price input').InputMoney();
    $('.field.product_unit input').InputNumber();
    $('.field.product_price input').InputMoney();

    $('.ui.barcode-serial.form').form({
      on: 'blur',
      onSuccess: function(event, fields){
        var bs = $('.ui.barcode-serial.input input').val();
        if(this.props.data.item_product && (bs == this.props.data.item_product.barcode || bs == this.props.data.item_product.serial)) {
          this.addProduct();
        } else {
          if(fields.barcode_serial !== '') {
            var shop_id = system.sessionStore.getSession().shop.id;
            $('.ui.barcode-serial.input').addClass('loading');
            actions.getProductDetail({ code: fields.barcode_serial, shop_id: shop_id });
          }
        }
        return false;
      }.bind(this)
    });


  },
  doneProductDetail: function(res){
    $('.ui.barcode-serial.input').removeClass('loading');
    if(res.data.length == 1) {
      var data = res.data[0];
      this.props.data.item_product = data;
      this.props.data.item_product.installation_status = 'NO_INSTALLATION';
      this.props.fields.product_name.value = data.name;
      this.props.fields.product_style.value = data.spec;

      // if(data.installation_yn == 'Y') {
      //   $('.field.setup_price').removeClass('disabled');
      //   $('.field.setup_price input').prop('disabled', false);
      // } else {
      //   $('.field.setup_price').addClass('disabled');
      //   $('.field.setup_price input').prop('disabled', true);
      // }

      if(data.qty_yn == 'Y') {
        this.props.fields.product_unit.value = '';
        $('.field.product_unit').removeClass('disabled');
        $('.field.product_unit input').prop('disabled', false);
      } else {
        this.props.fields.product_unit.value = 1;
        $('.field.product_unit').addClass('disabled');
        $('.field.product_unit input').prop('disabled', true);
      }

    } else if(res.data.length > 1) {

    } else {

    }
  },
  addProduct: function(){
      var type = $('.ui.setup_type.dropdown').dropdown("get value") || 'NO_INSTALLATION';
      var unit = $('.field.product_unit input').val() || 1;
      var s_price = $('.field.setup_price input').val() || '0.00';
      var p_price = $('.field.product_price input').val() || '0.00';
      $('.field.setup_price, .field.product_unit').removeClass('error');

      unit = helper.toNumber(unit);  
      var qty = helper.toNumber(this.props.data.item_product.qty);  

      if(type != 'IN_INSTALLATION' && type != 'NO_INSTALLATION' && s_price == '0.00') {
        $('.field.setup_price').addClass('error');
        return false;
      }
      $('.field.product_price').removeClass('error');
      if(p_price == '0.00') {
        $('.field.product_price').addClass('error');
        return false;
      }
      var found = false, id = 0, fUnit = 0;
      for (var i = 0; i < this.props.data.product.length; i++) {
        var item = this.props.data.item_product;
        var list = this.props.data.product[i];
        if(item.barcode == list.barcode && item.serial == list.serial) {
          found = true;
          if(item.qty_yn == 'Y') {
            id = i;
            fUnit = helper.toNumber(this.props.data.product[i].unit)+unit;
          }
          break;
        }
      }

      if(isNaN(unit) || unit == 0 || fUnit > qty) {
        $('.field.product_unit').addClass('error');
        return false;
      }

      if(moment(this.props.data.item_product.date_in) > moment(this.props.data.sell_date)) {
        return false;
      }

      if(!found) {
        this.props.data.item_product.setup = type;
        this.props.data.item_product.setup_price = s_price;
        this.props.data.item_product.unit = parseInt($('.field.product_unit input').val() || 1);
        this.props.data.item_product.price = p_price;

        this.props.data.product.push(this.props.data.item_product);
      } else {
        this.props.data.product[id].unit = fUnit;
      }

      this.props.data.item_product = undefined;
      this.setState({ data: this.props.data });

      $('.field.setup_price, .field.product_unit').addClass('disabled');
      $('.field.setup_price input, .field.product_unit input').prop('disabled', true);
      $('.ui.setup_type.dropdown').dropdown('refresh').dropdown("set selected", "NO_INSTALLATION");
      this.props.fields.product_search.value = '';
      this.props.fields.product_name.value = '';
      this.props.fields.product_style.value = '';
      this.props.fields.setup_price.value = '';
      this.props.fields.product_unit.value = '';
      this.props.fields.product_price.value = '';


  },

  removeProduct: function(product_id){
    for (var i = 0; i < this.props.data.product.length; i++) {
      if(this.props.data.product[i].product_id == product_id) {
        this.props.data.product.splice(i, 1);
        break;
      }
    }
    this.setState({ data: this.props.data });
  },

  render: function() {

    this.props.data.total_product = 0;

    var ProductDetail = this.props.data.product.map(function(row){
      this.props.data.total_product += helper.toNumber(row.unit) * helper.toNumber(row.price);
      return (
        <tr>
          <td>
            {function(){
              if (row.setup != 'NO_INSTALLATION') {
                return (<i className="icon checkmark" style={{ fontSize: '20px', marginTop: '-10px' }}></i>);
              } else {
                return (null);
              }
            }.call(this)}
          </td>
          <td>{row.name}</td>
          <td style={{ textAlign:'right' }}>{row.serial}</td>
          <td>{row.barcode}</td>
          <td style={{ textAlign:'right' }}>{row.setup_price}</td>
          <td style={{ textAlign:'right' }}>{row.unit}</td>
          <td style={{ textAlign:'right' }}>{row.price}</td>
          <td>
            {function(){
              if (this.props.data.sell_new) {
                return (
                  <div onClick={this.removeProduct.bind(this, row.product_id)}>
                    <i className="remove icon" style={{ cursor:'pointer', fontSize: '20px', height: 'auto' }}></i>
                  </div>
                );
              } else {
                return (null);
              }
            }.call(this)}
          </td>
        </tr>
      );
    }.bind(this));
    // 
    if(this.props.data.product.length == 0) {
      ProductDetail = (<tr><td colSpan="8" style={{ textAlign: 'center' }}>No transection</td></tr>)
    }

    return (
      <div className="eleven wide column">
        <div className="ui form"> 
          <form className="ui barcode-serial form"> 
          <div className="inline fields">
            <div className="four wide field">
              <h3 className="ui header">
                <i className="dropbox icon"></i>
                <div className="content">{tr.translate('sell.product_text')}</div>
              </h3>
              <button className="ui icon primary button hide"></button>
            </div>
            <div className="twelve wide field">
              <div className={"ui icon barcode-serial search input "+(!this.props.data.sell_new?'disabled':'')}>
                <i className="search icon"></i>
                <input name="barcode_serial" ref={(c) => this.props.fields.product_search = c} type="text" placeholder={tr.translate('sell.product.barcode_serial')} />
              </div>
            </div>
          </div>
          </form>
          <div className="inline fields">
            <div className="ten wide field disabled">
              <input disabled={true} ref={(c) => this.props.fields.product_name = c} type="text" placeholder={tr.translate('sell.product_name')} />
            </div>
            <div className="six wide field disabled">
              <input disabled={true} ref={(c) => this.props.fields.product_style = c} type="text" placeholder={tr.translate('sell.product_style')} />
            </div>
          </div>
          <div className="inline fields">
            <div className="four wide field">
              <div className={"ui fluid selection setup_type dropdown "+(!this.props.data.sell_new?'disabled':'')} style={{ width: '100%' }}>
                <input type="hidden" name="setup_type" />
                <i className="dropdown icon"></i>
                <div className="text">
                    <i className="add user icon"></i>
                    {tr.translate('sell.setup.no')}
                </div>
                <div className="menu">
                  <div className="item active selected" data-value="NO_INSTALLATION">
                    <i className="remove user icon"></i>
                    {tr.translate('sell.setup.no')}
                  </div>
                  <div className="item" data-value="IN_INSTALLATION">
                    <i className="user icon"></i>
                    {tr.translate('sell.setup.in')}
                  </div>
                  <div className="item" data-value="OUT_INSTALLATION">
                    <i className="add user icon"></i>
                    {tr.translate('sell.setup.out')}
                  </div>
                  <div className="item" data-value="COIN_INSTALLATION">
                    <i className="add user icon"></i>
                    {tr.translate('sell.setup.coin')}
                  </div>
                </div>
              </div>
            </div>
            <div className="four wide field setup_price disabled">
              <input disabled={true} ref={(c) => this.props.fields.setup_price = c} type="text" placeholder={tr.translate('sell.setup_price')} />
            </div>
            <div className="three wide field product_unit disabled">
              <input disabled={true} ref={(c) => this.props.fields.product_unit = c} type="text" placeholder={tr.translate('sell.product_unit')} />
            </div>
            <div className={"four wide field product_price "+(!this.props.data.sell_new?'disabled':'')}>
              <input ref={(c) => this.props.fields.product_price = c} type="text" placeholder={tr.translate('sell.product_price')} />
            </div>
            <div className="one wide field">
              <div className={"ui icon primary button "+(!this.props.data.sell_new?'disabled':'')} onClick={this.addProduct} style={{ padding: '12px 11px 8px 12px' }}>
                <i className="arrow circle down icon" style={{ fontSize: '20px' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="inline fields">
          <table className="ui table">
            <thead>
              <tr>
                <th className="one wide"></th>
                <th className="two wide">{tr.translate('sell.product.name')}</th>
                <th className="three wide" style={{ textAlign:'right' }}>{tr.translate('sell.product.serial')}</th>
                <th className="three wide">{tr.translate('sell.product.barcode')}</th>
                <th className="three wide" style={{ textAlign:'right' }}>{tr.translate('sell.product.setup_price')}</th>
                <th className="two wide" style={{ textAlign:'right' }}>{tr.translate('sell.product.unit')}</th>
                <th className="two wide" style={{ textAlign:'right' }}>{tr.translate('sell.product.price')}</th>
                <th className="one wide"></th>
              </tr>
            </thead>
            <tbody>
              {ProductDetail}
            </tbody>
            <tfoot>
                <tr>
                  <th colSpan="6">{tr.translate('sell.summary_total')+this.props.data.product.length+tr.translate('sell.summary_unit')}</th>
                  <th style={{ textAlign:'right' }}>{helper.toMoney(this.props.data.total_product)}</th>
                  <th></th>
                </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
});


var itemKey = 0;
var PaymentSeciton = React.createClass({
  componentDidMount: function() {
    var shop_id = system.sessionStore.getSession().shop.id;
    $('.ui.payment_option.dropdown').dropdown();
    $('.ui.credit_option.dropdown').dropdown({
      onChange: function(id, value){
        if(this.props.data.item_payment == undefined) this.props.data.item_payment = {}
        this.props.data.item_payment.desc1 = value;
        this.props.data.item_payment.ref_id = id;
      }.bind(this)
    });

    $('.field.pay_price input').InputMoney();
    $('.remain input').InputMoney();
    // $('.remain input').bind('keyup keydown', function(){
    //   console.log(, $(this).val());
    // }.bind(this));
  },
  handleClick: function(id, value) {
    if(id == 'payment_option') {
      if(this.props.data.item_payment == undefined) this.props.data.item_payment = { desc1: null, ref_id: null }
      this.props.data.item_payment.payment_option = value;
      this.props.data.item_payment.name = value.name;
      if(value.credit_card == 'Y') {
        $('.fields.creditcard').show();
        $('.fields.pay_ref').hide();
      } else {
        $('.fields.creditcard').hide();
        $('.fields.pay_ref').show();
      }
    }

    if(id == 'credit_option') {
      this.props.data.item_payment.credit_option = value;
    }
  },
  addPayment: function(){
    $('.field.pay_by').removeClass('error');
    $('.field.pay_price').removeClass('error');

    if(this.props.fields.pay_by.value == '' ) {
      $('.field.pay_by').addClass('error');
      return false;
    }
    if(this.props.fields.pay_price.value == '') {
      $('.field.pay_price').addClass('error');
      return false;
    }
    var PayNum = helper.toNumber(this.props.fields.pay_price.value);
    if(isNaN(PayNum) || PayNum <= 0) {
      $('.field.pay_price').addClass('error');
      return false;
    }
    if(this.props.data.item_payment == undefined) return false;

    if(this.props.data.item_payment.payment_option.id == 6) {
      if(parseFloat(this.props.fields.pay_price.value) > parseFloat(this.props.fields.deposit.value)) {
        $('.field.pay_price').addClass('error');
        return false;
      }
    }

    this.props.data.item_payment.credit_option = this.props.data.item_payment.credit_option || {};
    this.props.data.item_payment.sell_id = 0;
    this.props.data.item_payment.amount = this.props.fields.pay_price.value;
    this.props.data.item_payment.desc2 = this.props.fields.pay_by.value;
    this.props.data.item_payment.id = itemKey;

    this.props.data.payment.push(this.props.data.item_payment);

    itemKey++;
    this.props.data.item_payment = undefined;
    this.props.fields.pay_price.value = "";
    this.props.fields.pay_by.value = "";
    this.props.fields.pay_ref.value = "";

    $('.ui.payment_option.dropdown').dropdown('restore defaults').dropdown('set text', 'Select Payment')
    $('.ui.credit_option.dropdown').dropdown('set value', '');
    $('.fields.creditcard').hide();
    $('.fields.pay_ref').show();
    this.setState({ data: this.props.data });
  },
  removePayment: function(id){
    for (var i = 0; i < this.props.data.payment.length; i++) {
      if(this.props.data.payment[i].id == id) {
        this.props.data.payment.splice(i, 1);
        break;
      }
    }
    this.setState({ data: this.props.data });
  },
  changeRemain: function(){
    this.props.data.total_payment = helper.toNumber($('.remain input').val());
    this.props.data.payment.map(function(row){
      this.props.data.total_payment += helper.toNumber(row.amount);
    }.bind(this));
    this.setState({ data: this.props.data });
  },
  render: function() {

    var PaymentOption = this.props.fields.payment_option.map(function(item) {
      return (
        <div className="item" data-value={item.id} onClick={function(e) {this.handleClick('payment_option', item)}.bind(this)}>
          {item.name}
        </div>
      )
    }.bind(this));

    var CreditCardOption = this.props.fields.credit_option.map(function(item) {
      return (
        <div className="item" data-value={item.id} onClick={function(e) {this.handleClick('credit_option', item)}.bind(this)}>
          {item.card_name}
        </div>
      )
    }.bind(this));
  
    this.props.data.total_payment = helper.toNumber($('.remain input').val());

    var PaymentDetail = this.props.data.payment.map(function(row){
      this.props.data.total_payment += helper.toNumber(row.amount);
      return (
        <tr>
          <td>{row.name}</td>
          <td style={{ textAlign:'right' }}>{row.amount}</td>
          <td>
            {function(){
              if (this.props.data.sell_new) {
                return (
                  <div onClick={this.removePayment.bind(this, row.id)}>
                    <i className="remove icon" style={{ cursor:'pointer', fontSize: '20px', height: 'auto' }}></i>
                  </div>
                );
              } else {
                return (null);
              }
            }.call(this)}
          </td>
        </tr>
      );
    }.bind(this));
    
    if(this.props.data.payment.length == 0) {
      PaymentDetail = (<tr><td colSpan="3" style={{ textAlign: 'center' }}>No transection</td></tr>)
    }

    return (
      <div className="five wide column">
        <div className="ui form"> 
          <div className="inline fields">
            <div className="two wide field" style={{ paddingTop: '7px', fontSize: '24px' }}>
                <i className="payment icon"></i>
            </div>
            <div className="fourteen wide field">
              <div className={"ui fluid search selection payment_option dropdown "+(!this.props.data.sell_new?'disabled':'')} style={{ width: '100%' }}>
                <input type="hidden" ref={(c) => this.props.fields.payment = c} name="payment_option" />
                <i className="dropdown icon"></i>
                <div className="default text">Select Payment</div>
                <div className="menu">
                  {PaymentOption}
                </div>
              </div>
            </div>
          </div>
          <div className="inline fields creditcard" style={{ display:'none' }}>
            <div className="two wide field" style={{ paddingTop: '7px', fontSize: '24px' }}>
                <i className="visa icon"></i>>
            </div>
            <div className={"fourteen wide field "+(!this.props.data.sell_new?'disabled':'')}>
              <div className={"ui fluid search selection credit_option dropdown "+(!this.props.data.sell_new?'disabled':'')} style={{ width: '100%' }}>
                <input type="hidden" ref={(c) => this.props.fields.credit = c} name="credit_option" />
                <i className="dropdown icon"></i>
                <div className="default text">Select CreditCard</div>
                <div className="menu">
                  {CreditCardOption}
                </div>
              </div>
            </div>
          </div>
          <div className={"inline fields pay_ref "+(!this.props.data.sell_new?'disabled':'')}>
            <input ref={(c) => this.props.fields.pay_ref = c} type="text" placeholder={tr.translate('sell.pay_ref')} />
          </div>
          <div className="inline fields">
            <div className={"seven wide field pay_by "+(!this.props.data.sell_new?'disabled':'')}>
              <input ref={(c) => this.props.fields.pay_by = c} type="text" placeholder={tr.translate('sell.pay_by')} />
            </div>
            <div className={"seven wide field pay_price "+(!this.props.data.sell_new?'disabled':'')}>
              <input ref={(c) => this.props.fields.pay_price = c} type="text" placeholder={tr.translate('sell.pay_price')} />
            </div>
            <div className="two wide field">
              <div className={"ui icon primary button "+(!this.props.data.sell_new?'disabled':'')} onClick={this.addPayment} style={{ padding: '12px 8px 8px 8px' }}>
                <i className="arrow circle down icon" style={{ fontSize: '20px' }}></i>
              </div>
            </div>
          </div>
          <div className="inline fields">
            <table className="ui table">
              <thead>
                <tr>
                  <th className="six wide">{tr.translate('sell.payment.pay_by')}</th>
                  <th className="seven wide" style={{ textAlign:'right' }}>{tr.translate('sell.payment.amount')}</th>
                  <th className="three wide"></th>
                </tr>
              </thead>
              <tbody>
                {PaymentDetail}
                <tr>
                  <td>{tr.translate('sell.summary_remain')}</td>
                  <td className="remain">
                    <input ref={(c) => this.props.fields.remain = c} onChange={this.changeRemain} type="text" placeholder={tr.translate('sell.summary_text')} style={{ marginLeft:'14px' }} />
                  </td>
                  <td></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>{tr.translate('sell.summary_total')+this.props.data.payment.length+tr.translate('sell.summary_unit')}</th>
                  <th style={{ textAlign:'right' }}>{helper.toMoney(this.props.data.total_payment)}</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }
});

var SellScreen = React.createClass({
  mixins:[
    Reflux.listenTo(actions.getInitData.done,'onInitData'),
    Reflux.listenTo(actions.saveData.done,'onSaveDone')
  ],
  getInitialState: function() {
    var sell_id = this.props.params.id;
    var fields = {
      flag: {
        sell_date: false
      },
      payment_option: [],
      credit_option: []
    };

    return {
      data: {
        sell_new: sell_id == 0 ? true : false,
        sell_save: false,
        sell_date: moment(),
        total_product: 0,
        total_payment: 0,
        item_product: undefined,
        item_payment: undefined,
        sell: { },
        payment: [ ],
        product: [ ]
      },
      fields: fields,
      // productData:[
      //   {code:'0001',name:'NAME2',qty:3,unit_price:10}
      // ],
      // paymentFields: [],
      // paymentData:[]
    }
  },

  onInitData: function(res){

    this.state.data.sell_date = moment();
    this.state.fields.flag.sell_date = res.data.sell_date;
    this.state.fields.staff_save.value = res.data.dep_code;
    this.state.fields.stock_date.value = moment().format("DD/MM/YYYY");

    this.state.fields.payment_option = res.data.payment;
    this.state.fields.credit_option = res.data.creditcard;

    $('.ui.customer.code>.dropdown').dropdown('save defaults');
    $('.ui.customer.staff_sell>.dropdown').dropdown('save defaults');
    $('.ui.customer.finance_staff>.dropdown').dropdown('save defaults');

    this.setState({ fields: this.state.fields });
  },

  handleDataChange: function(id, value) {
    this.state.data[id] = value;
    this.setState({ data: this.state.data });
  },

  onPrint: function(){
    console.log('onPrint');
    console.log(this.state.data);
  },

  onRefresh: function(){
    this.state.data.sell_new = true;
    this.props.history.pushState(null, '/pos/sell/0');
    $('.ui.customer.code>.dropdown').removeClass('disabled');
    $('.ui.customer.staff_sell>.dropdown').removeClass('disabled');
    $('.ui.customer.finance_staff>.dropdown').removeClass('disabled');

    $('.ui.customer.code>.dropdown').dropdown('restore defaults');
    $('.ui.customer.staff_sell>.dropdown').dropdown('restore defaults');
    $('.ui.customer.finance_staff>.dropdown').dropdown('restore defaults');

    // $('.customer.code > .ui.dropdown').dropdown('clear');
    // $('.customer.staff_sell > .ui.dropdown').dropdown('clear');
    // $('.customer.finance_staff > .ui.dropdown').dropdown('clear');

    this.state.data.sell_date = moment();
    this.state.fields.cus_name.value = '';
    this.state.fields.sell_no.value = '';
    this.state.fields.tel.value = '';
    this.state.fields.deposit.value = '';
    this.state.fields.address.value = '';

    $('.field.setup_price, .field.product_unit').addClass('disabled');
    $('.field.setup_price input, .field.product_unit input').prop('disabled', true);
    $('.ui.setup_type.dropdown').dropdown('refresh').dropdown("set selected", "NO_INSTALLATION");
    this.state.fields.product_search.value = '';
    this.state.fields.product_name.value = '';
    this.state.fields.product_style.value = '';
    this.state.fields.setup_price.value = '';
    this.state.fields.product_unit.value = '';
    this.state.fields.product_price.value = '';

    $('.ui.payment_option.dropdown').dropdown('restore defaults').dropdown('set text', 'Select Payment')
    $('.ui.credit_option.dropdown').dropdown('set value', '');
    $('.fields.creditcard').hide();
    $('.fields.pay_ref').show();

    this.state.fields.remark.value = '';

    this.state.data.total_product = 0;
    this.state.data.total_payment = 0;
    this.state.data.item_product = undefined;
    this.state.data.item_payment = undefined;
    this.state.data.payment = [ ];
    this.state.data.product = [ ];

    this.setState({ data: this.state.data });
  },

  onSave: function(){
    var staff_id = system.sessionStore.getSession().staff.id
    var shop_id = system.sessionStore.getSession().shop.id;

    var item = {
      product: this.state.data.product,
      payment: this.state.data.payment, 
      sell: {
        shop_id               : shop_id,
        id                    : 0,
        sell_date             : this.state.data.sell_date.format('YYYY/MM/DD'),
        sell_staff            : staff_id,
        company_id            : $('.customer.code > .ui.dropdown').dropdown('get value'),
        status                : helper.toNumber(this.state.fields.remain.value) > 0 ? 'DEBIT' : 'PASS',
        remark                : this.state.fields.remark.value,
        sell_on_cash          : '',
        sell_type             : 'NORMAL',
        balance               : this.state.fields.deposit.value,
        debit_return          : 'N',
        sales_staff_id        : $('.customer.staff_sell > .ui.dropdown').dropdown('get value'),
        finance_staff_id      : $('.customer.finance_staff > .ui.dropdown').dropdown('get value'),
        frequency             : 1,
        // receipt_no            : '',
        // contract_id           : 0,
        // contract_ref          : null,
        // recommended_price     : null,
        // po_cost               : null,
        // mysql_contract_code   : null,
        // receive_crcard_date   : null,
        // check_status_date     : null,
        // receive_transfer_date : null,
        // credit_card_name      : null,
        // net_price_charge      : null,
        // card_no               : null,
        // tranfer               : null,
        // credit_card_id        : null,
        // cash                  : null,
        // client_charge         : null,
        // bank_charge           : null,
        // cr_card               : null
      }
    }

    try
    {
      // if(this.state.data.sell_save) throw 'ex.selldate.vaild'
      if(item.sell.company_id === '') throw 'ex.customer.none';
      if(item.sell.sales_staff_id === '') throw 'ex.staff.none';

      if(item.product.length == 0) throw 'ex.product.none';
      if(item.payment.length == 0) throw 'ex.payment.none';

      if(this.state.fields.remain.value === '') throw 'ex.remain.none';

      if(helper.toNumber(this.state.fields.remain.value) > 0 && item.sell.finance_staff_id === '') {
        throw 'ex.finance_staff.none';
      }

      if(this.state.data.total_product !== this.state.data.total_payment) {
        throw 'ex.payment.notequal';
      }

      $('.app.dimmer .text').html('Saving...');
      $('.app.dimmer').transition('fade');
      actions.saveData(item);
    } catch(ex) {
      toasterActions.pop({ type: 'warning', message: ex });
    }
  },
  onSaveDone: function(res){
    $('.app.dimmer').transition('fade');
    if(res.success) {
      toasterActions.pop({ type: 'success', message: 'ex.success'});
      this.state.data.sell_new = false;

      this.props.history.pushState(null, '/pos/sell/'+res.sell_id);
    } else {
      toasterActions.pop({ type: 'warning', message: res.error });
    }
  },

  componentDidMount: function() {
    var shop_id = system.sessionStore.getSession().shop.id;

    infoPanelActions.show(null, null);
    actions.getInitData({ shop_id: shop_id});
  },
  
  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  render: function() {
    return (
      <div className="content-page">
        <div className="ui form"> 
          <div className="inline fields">
            <div className="nine wide field">
              <h2 className="ui header">
                {tr.translate('pos.menu.sell')}
                <div className="sub header">Manage your sell product.</div>
              </h2>
            </div>
            <div className="seven wide field">
              <div className="ui secondary button btn-print" onClick={this.onPrint}>
                <i className="print icon"></i>{tr.translate('btn.print')}
              </div>
              <div className="ui button btn-refresh" onClick={this.onRefresh}>
                <i className="refresh icon"></i>{tr.translate('btn.clear')}
              </div>
              <div className={"ui primary button btn-save "+(!this.state.data.sell_new ? 'disabled' : '')} onClick={this.onSave}>
                <i className="save icon"></i>{tr.translate('btn.save')}
              </div>
            </div>
          </div>
        </div>
        <div className="panelf" style={{  marginTop: 10 }}>
          <CustomerSection 
            fields={this.state.fields} 
            data={this.state.data} />
          <div className="ui divider"></div>
          <div className="ui two column grid">
            <ProductSection
              fields={this.state.fields}
              data={this.state.data} />
            <PaymentSeciton
              fields={this.state.fields}
              data={this.state.data} />
          </div>
          <div className="ui divider"></div>
          <div className="ui form" style={{ marginBottom: '10px' }}>
            <div className="fluid field">
              <input ref={(c) => this.state.fields.remark = c} type="text" placeholder={tr.translate('sell.remark')} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SellScreen;


