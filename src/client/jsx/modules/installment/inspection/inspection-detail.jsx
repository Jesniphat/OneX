var React         = require('react');
var Reflux        = require('reflux');
var tr            = require('counterpart');
var T             = require('react-translate-component');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var systemActions = system.systemActions;
var helper        = system.helper;

var toasterActions  = system.toasterActions;

var FlexTextInput = widgets.FlexTextInput;
var FlexButton    = widgets.FlexButton;
var FlexIcon      = widgets.FlexIcon;
var NationIDCard  = widgets.NationIDCard;
var FlexDataTable = widgets.FlexDataTable;
var FlexTab       = widgets.FlexTab;
var FlexDataTable   = widgets.FlexDataTable;
var FlexDropdown  = widgets.FlexDropdown;


var inspectionActions = require('./actions');
var inspectionStore   = require('./store');

var calcAge = function(value) {
  var today = new Date();
  var d = new Date(value);
  var age = today.getFullYear()-d.getFullYear();
  if (d.getMonth() > today.getMonth() || d.getMonth()==today.getMonth() && d.getDate() > today.getDate()) {
    age--;
  }
  return age;
};

var genPhotoNationId = function(nationid) {
  if (!nationid || nationid.length != 13) {
    return window.location.protocol + '//' + window.location.host + '/idcard/photo.png';
  }
  return window.location.protocol + '//' + window.location.host + '/idcard/photo/'
    + nationid.substr(-1) + '/' + nationid.substr(-2,1) + '/' + nationid + '.jpg';
}

var contractFields = [
  {name:'no',label:'installment.inspection.contract.no',width:'32px',render:function(row,i) {
    return i+1
  }},
  {name:'status',label:'installment.inspection.contract.status',width:'128px',render:function(row) {
    if (row.terms && row.terms.length > 0) {
      return (
        <ul className="contract_status2">{row.terms.map(function(term) {
          return (
            <li key={term.id} className={'status_' + term.term_status + (term.close_status=='NORMAL'?'':' '+term.close_status)} title={
                'DUE DATE: ' + term.due_date + '\n'
                + 'PAID DATE: ' + term.paid_date + '\n'
                + 'DUE AMOUNT: ' + helper.numberFormat(term.due_amount, 2) + '\n'
                + 'PAID AMOUNT: ' + helper.numberFormat(term.paid_amount, 2) + '\n'
                + 'STATUS: ' + term.term_status}></li>
          );
        })}</ul>
      );
    } else {
      return null;
    }
  }},
  {name:'role',label:'installment.inspection.contract.role',width:'100px',render:function(row) {
    return tr.translate('installment.inspection.contract.role_type.'+row.role_type);
  }},
  {name:'code',label:'installment.inspection.contract.code',width:'100px'},
  {name:'sign_date',label:'installment.inspection.contract.sign_date',width:'80px',render:function(row) {
    return tr.localize(new Date(row.sign_date), {type:'date',format:'short'});
  }},
  {name:'product',label:'installment.inspection.contract.product'},
  {name:'payment_price',label:'installment.inspection.contract.payment_price',width:'80px',className:'right',render:function(row) {
    return helper.numberFormat(row.payment_price,2);
  }},
  {name:'total_paid',label:'installment.inspection.contract.total_paid',width:'80px',className:'right',render:function(row) {
    return helper.numberFormat(row.total_paid,2);
  }},
  {name:'balance',label:'installment.inspection.contract.balance',width:'80px',className:'right',render:function(row) {
    return helper.numberFormat(row.balance,2);
  }},
  {name:'current_status',label:'installment.inspection.contract.current_status',width:'80px',render:function(row) {
    return tr.translate('installment.inspection.contract.status_text.'+row.current_status);
  }}
];

var genPersonFromNationId = function(info) {
  return {
    nationid: info.nationid,
    prename: info.prenameTH || info.prename,
    firstname: info.firstnameTH || info.firstname,
    lastname: info.lastnameTH || info.lastname,
    fullname: (info.prenameTH || info.prename)
      + ' ' + (info.firstnameTH || info.firstname)
      + ' ' + (info.lastnameTH || info.lastname),
    birth: info.birth,
    gender: info.gender,
    age: calcAge(info.birth)
  };
}

var InspectDetail = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [
    Reflux.listenTo(systemActions.readIDCard.done, 'onReadIDCardDoneAction'),
    Reflux.listenTo(systemActions.readIDCard.error, 'onReadIDCardErrorAction'),
    Reflux.listenTo(systemActions.readIDCardPhoto.done, 'onReadIDCardPhotoDoneAction'),
    Reflux.listenTo(systemActions.readIDCardPhoto.error, 'onReadIDCardPhotoErrorAction'),
    Reflux.listenTo(inspectionActions.inspect.done, 'onInspectDoneAction'),
    Reflux.listenTo(inspectionActions.inspect.error, 'onInspectErrorAction'),
    Reflux.listenTo(inspectionActions.genContractForm.done, 'onGenContractFormDoneAction'),
    Reflux.listenTo(inspectionActions.genContractForm.error, 'onGenContractFormErrorAction'),
    Reflux.listenTo(inspectionActions.getPersonOracle.done, 'onGetPersonOracleDoneAction')
  ],

  getInitialState: function() {
    contractFields.push(
      {name:'action',label:'installment.inspection.contract.view',width:'32px',render:function(row) {
        return (
          <span className="flaticon-right244 link" onClick={function() {
            this.context.router.transitionTo('installment.contract.edit', {id:row.id});
          }.bind(this)}></span>
        )
      }.bind(this)}
    );
    return {
      cus_nation_id:'',
      co_nation_id:'',
      currentTab: 'cus_history',
      addcust_nationid:'',
      data: {
        customer:{},
        co:{},
        cusIDCard: {},
        coIDCard: {},
        cardAddr: {},
        coCardAddr: {}
      },
      homeAddressList:[
        {value:0,text:''}
      ],
      workAddressList:[
        {value:0,text:''}
      ],
      coHomeAddressList:[
        {value:0,text:''}
      ],
      coWorkAddressList:[
        {value:0,text:''}
      ],
      cusContractList:[],
      coContractList:[],
      tabList:[
        {id:'cus_info', icon:'user157', text:'installment.inspection.tab.cus_info'},
        {id:'cus_history', icon:'work3', text:'installment.inspection.tab.history'},
        {id:'co_info', icon:'add184', text:'installment.inspection.tab.co_info'},
        {id:'co_history', icon:'work3', text:'installment.inspection.tab.history'}
      ]
    }
  },

  readIDCard: function(card) {
    this.setState({
      currentTab: card=='cusIDCard' ? 'cus_info' : 'co_info'
    }, function() {
      systemActions.readIDCard(null /* reader name */, card);
    });
  },

  onReadIDCardDoneAction: function(info, ref) {
    inspectionActions.inspect({
      id:info.nationid,
      ref:ref=='cusIDCard' ? 'cus_nation_id' : 'co_nation_id'
    });

    inspectionActions.savePerson({
      nationid:info.nationid,
      type:'PERSON',
      prename:info.prenameTH,
      firstname:info.firstnameTH,
      lastname:info.lastnameTH,
      fullname:info.prenameTH + ' ' + info.firstnameTH + ' ' + info.lastnameTH,
      idcard_info:JSON.stringify(info),
      passport:'',
      passport_info:'{}',
      nation:'THA',
      birth:info.birth,
      gender:info.gender,
      marital_status:'N/A',
      mobile:'',
      email:'',
      lineid:''
    });

    this.state.data[ref] = info;
    var addr = '';
    var ref2 = '';
    if (ref=='cusIDCard') {
      ref2 = 'cus_nation_id';
      addr = 'cardAddr';
      this.state.data.customer = genPersonFromNationId(info);

    } else if (ref=='coIDCard') {
      ref2 = 'co_nation_id';
      addr = 'coCardAddr';
      this.state.data.co = genPersonFromNationId(info);
    }

    if (!this.state.data[addr].addr1) {
      var tmp = [];
      if (info.address.houseNo) {
        tmp.push(info.address.houseNo);
      }
      if (info.address.villageNo) {
        tmp.push(info.villageNo);
      }
      this.state.data[addr].addr1 = tmp.join(' ');

      tmp = [];
      if (info.address.lane) {
        tmp.push(info.address.lane);
      }
      if (info.address.road) {
        tmp.push(info.address.road);
      }
      if (info.address.unknown) {
        tmp.push(info.address.unknown);
      }
      this.state.data[addr].addr2 = tmp.join(' ');
      this.state.data[addr].tambon = info.address.tambon;
      this.state.data[addr].amphur = info.address.amphur;
      this.state.data[addr].province = info.address.province;
    }

    var obj = {
      data: this.state.data,
    }

    obj[ref+'PhotoLoading'] = true;
    obj[ref2] = info.nationid;
    this.setState(obj);
    systemActions.readIDCardPhoto(null, ref);
  },

  onReadIDCardErrorAction: function(e) {
    toasterActions.pop({
      type:'warning',
      message:'result.idcard.error'
    });
  },

  onReadIDCardPhotoDoneAction: function(info) {
    var obj = {};
    console.log(info.photoPath);
    obj[info.ref + 'Photo'] = info.photoPath;
    obj[info.ref + 'PhotoLoading'] = false;
    obj[(info.ref == 'cusIDCard' ? 'customer' : 'co') + 'Photo'] = '';
    this.setState(obj);
  },

  onReadIDCardPhotoErrorAction: function(e) {
    toasterActions.pop({
      type:'warning',
      message:'result.idcard.photo_error'
    });
  },

  onInspectDoneAction: function(info) {
    console.log('inspection=', info);
    if (!info.person) {
      if (info.ref=='cus_nation_id' && this.state.data.cusIDCard
        && this.state.data.cusIDCard.nationid==this.state.data.cus_nation_id) {
        return;
      }
      if (info.ref=='co_nation_id' && this.state.data.coIDCard
        && this.state.data.coIDCard.nationid==this.state.data.co_nation_id) {
        return;
      }

      var obj = {
        data: this.state.data
      };
      if (info.ref=='cus_nation_id') {
        obj.data.customer = genPersonFromNationId(this.state.data.cusIDCard);
        obj.data.cardAddr = {};
      } else {
        obj.data.co = genPersonFromNationId(this.state.data.coIDCard);;
        obj.data.coCardAddr = {};
      }
      obj.homeAddressList = [{value:0,text:''}];
      obj.workAddressList = [{value:0,text:''}];
      obj.coHomeAddressList = [{value:0,text:''}];
      obj.coWorkAddressList = [{value:0,text:''}];
      this.setState(obj, function() {
        toasterActions.pop({
          type:'warning',
          message:'ไม่พบข้อมูลตามบัตรประชาชนนี้'
        });
      });
      return;
    }
    var obj = {
      data: this.state.data
    };
    if (info.ref=='cus_nation_id') {
      var ref1 = 'customer';
      var ref2 = 'cusIDCard';
      var ref3 = 'cusContractList';
      var ref4 = 1;
      var ref5 = 'homeAddressList';
      var ref6 = 'workAddressList';
      var ref7 = 'cus_history';
    } else {
      var ref1 = 'co';
      var ref2 = 'coIDCard';
      var ref3 = 'coContractList';
      var ref4 = 3;
      var ref5 = 'coHomeAddressList';
      var ref6 = 'coWorkAddressList';
      var ref7 = 'co_history';
    }
    if (info.person != null) {
      try {
        obj.data[ref2] = JSON.parse(info.person.idcard_info);
        obj.data[ref2+'Photo'] = genPhotoNationId(obj.data[ref2].nationid);
        obj.data[ref1] = genPersonFromNationId(info.person);
      } catch (e) {
        obj.data[ref2] = {};
      }

    }

    obj[ref3] = info.contracts;
    obj.tabList = this.state.tabList;
    var cnt = info.contracts.reduce(function(prev, row) {
      return prev + (row.current_status=='NORMAL' || row.current_status=='DEBT' ? 1 : 0);
    }, 0);
    obj.tabList[ref4].raw = true;
    obj.tabList[ref4].text = tr.translate('installment.inspection.tab.history') + ' (' + cnt + '/' + info.contracts.length + ')';

    var status = 1;
    if (info.contracts.length == 0) {
      status = 0;
    }
    for (var i = 0; i < info.contracts.length; i++) {
      if (info.contracts[i].current_status=='CLOSE_BAD_DEBT'
        || info.contracts[i].current_status=='CLOSE_CONFISCATE') {
        status=3;
        break;
      } else if (info.contracts[i].current_status=='NORMAL'
        || info.contracts[i].current_status=='DEBT') {
        status=2;
      }
    };
    obj.data[ref1].status=status;
    var list = info.addresses.filter(function(row) {return row.type=='HOME'}).map(function(addr) {
      return {value:addr.id, text:addr.full_address};
    });
    list.unshift({value:0, text:''});
    obj[ref5] = list;

    var list = info.addresses.filter(function(row) {return row.type=='WORK'}).map(function(addr) {
      return {value:addr.id, text:addr.full_address};
    });
    list.unshift({value:0, text:''});
    obj[ref6] = list;
    obj.currentTab = ref7;
    this.setState(obj);
    console.log('jacktest=',obj);
  },

  onInspectErrorAction: function(e) {
    toasterActions.pop({
      type:'warning',
      message:'result.inspect.error'
    });
  },

  handleChange: function(id, value) {
    if ((id=='cus_nation_id' || id=='co_nation_id') && value.trim().length==13) {
      inspectionActions.inspect({
        id:value.trim(),
        ref:id
      });
    }
    var obj = {};
    obj[id] = value;
    this.setState(obj);
  },

  handleIDCardChange: function(data) {
    if (data.photoData) {
      inspectionActions.savePersonPhoto({
        nationid: data.nationid,
        photoData: data.photoData
      });
    }
  },

  handleTabClick: function(id) {
    this.setState({
      currentTab: id
    });
  },

  doPrintForm: function(type) {
    inspectionActions.genContractForm({
      type:type,
      cus: {
        nationid:this.state.cus_nation_id,
        contract_id:this.state.contract_id || 0,
        home_addr_id:this.state.home_addr_id || 0,
        work_addr_id:this.state.work_addr_id || 0
      },
      co: {
        nationid:this.state.co_nation_id,
        home_addr_id:this.state.co_home_addr_id || 0,
        work_addr_id:this.state.co_work_addr_id || 0
      }
    });
  },

  doAddCustomer: function(){
    inspectionActions.getPersonOracle({nationid:this.state.addcust_nationid});
  },

  onGenContractFormDoneAction: function(result) {
    var prefix_url = window.location.protocol + '//' + window.location.host + '/output/';
    console.log(prefix_url);
    systemActions.print({
      url:prefix_url + result.url
    });
  },

  onGetPersonOracleDoneAction: function(result) {

    if (result.status == true){
      // console.log('jack=',result.addcust[0]);
      // console.log('jack2=',result.addcust[0].nationid);
      // console.log('jack2=',result.addcust[0].firstnameth);
      inspectionActions.savePerson({
        nationid:result.addcust[0].nationid,
        type:'PERSON',
        prename:'',
        firstname:result.addcust[0].firstnameth,
        lastname:result.addcust[0].lastnameth,
        fullname:result.addcust[0].firstnameth + ' ' + result.addcust[0].lastnameth,
        idcard_info:'{}',
        passport:'',
        passport_info:'{}',
        nation:'THA',
        birth:'',
        gender:'',
        marital_status:'N/A',
        mobile:'',
        email:'',
        lineid:''
      });
      toasterActions.pop({
        type:'success',
        message:'บันทึกข้อมูลเรียบร้อย'
      });
    }else{
      toasterActions.pop({
        type:'warning',
        message:'ไม่พบข้อมูลในระบบ หรือข้อมูลมีอยู่แล้ว'
      });
    }
  },

  render: function() {
    var cusStatus = null;
    if (typeof this.state.data.customer.status==='number') {
      if (this.state.data.customer.status==1) {
        cusStatus = (<div className="green" style={{marginLeft:'8px'}}><span className="flaticon-circle108"></span><span style={{paddingLeft:'8px'}}>ปกติ</span></div>);
      } else if (this.state.data.customer.status==2) {
        cusStatus = (<div className="orange" style={{marginLeft:'8px'}}><span className="flaticon-round54"></span><span style={{paddingLeft:'8px'}}>ติดผ่อน</span></div>);
      } else if (this.state.data.customer.status==3) {
        cusStatus = (<div className="red" style={{marginLeft:'8px'}}><span className="flaticon-round56"></span><span style={{paddingLeft:'8px'}}>ลูกหนี้เสีย</span></div>);
      } else {
        console.log('NO HISTORY');
        cusStatus = (<div className="green" style={{marginLeft:'8px'}}><span className="flaticon-circle108"></span><span style={{paddingLeft:'8px'}}>ไม่มีประวัติ</span></div>);
      }
    }
    var customerLine = (
      <div className="flex box10">
        <div className="no-shrink panel1">ผู้เช่าซื้อ</div>
        <div className="panel3 can-grow flex">
          <FlexTextInput
            field={{id:'cus_nation_id',label:'installment.inspection.nation_id',pattern:'^[0-9]{13}$'}}
            data={this.state}
            onChange={this.handleChange}
            />
          <FlexIcon icon="framed1" className="no-shrink" title="installment.inspection.read_id" onClick={
              function() {
                this.readIDCard('cusIDCard')
              }.bind(this)
            } style={{padding:'4px'}}/>
        </div>
        <div className="panel6 flex" style={{fontSize:'20px',lineHeight:'24px',height:'24px',paddingTop:'4px'}}>
          {this.state.data.customer.fullname}
          {cusStatus}
        </div>
      </div>
    );


    var coStatus = null;

    if (typeof this.state.data.co.status==='number') {
      if (this.state.data.co.status==1) {
        coStatus = (<div className="green" style={{marginLeft:'8px'}}><span className="flaticon-circle108"></span><span style={{paddingLeft:'8px'}}>ปกติ</span></div>);
      } else if (this.state.data.co.status==2) {
        coStatus = (<div className="orange" style={{marginLeft:'8px'}}><span className="flaticon-round54"></span><span style={{paddingLeft:'8px'}}>ติดผ่อน</span></div>);
      } else if (this.state.data.co.status==3) {
        coStatus = (<div className="red" style={{marginLeft:'8px'}}><span className="flaticon-round56"></span><span style={{paddingLeft:'8px'}}>ลูกหนี้เสีย</span></div>);
      } else {
        coStatus = (<div className="green" style={{marginLeft:'8px'}}><span className="flaticon-circle108"></span><span style={{paddingLeft:'8px'}}>ไม่มีประวัติ</span></div>);
      }
    }

    var coLine = (
      <div className="flex box10">
        <div className="no-shrink panel1">ผู้เช่าซื้อร่วม</div>
        <div className="panel3 can-grow flex">
          <FlexTextInput
            field={{id:'co_nation_id',label:'installment.inspection.nation_id',pattern:'^[0-9]{13}$'}}
            data={this.state}
            onChange={this.handleChange}
            />
          <FlexIcon icon="framed1" className="no-shrink" title="installment.inspection.read_id" onClick={
              function() {
                this.readIDCard('coIDCard')
              }.bind(this)
            } style={{padding:'4px'}}/>
        </div>
        <div className="panel6 flex" style={{fontSize:'20px',lineHeight:'24px',height:'24px',paddingTop:'4px'}}>
          {this.state.data.co.fullname}
          {coStatus}
        </div>
      </div>
    )

    var addCustLine = (
      <div className="flex box10">
        <div className="no-shrink panel1">เพิ่มลูกค้า</div>
        <div className="panel3 can-grow flex">
          <FlexTextInput
            field={{id:'addcust_nationid',label:'installment.inspection.nation_id',pattern:'^[0-9]{13}$'}}
            data={this.state}
            onChange={this.handleChange}
            />
        </div>
        <div className="panel2 can-grow flex">
            <FlexButton icon="add186" label="installment.inspection.add_cust" default={true}
              onClick={function() {this.doAddCustomer()}.bind(this)}/>
        </div>
        <div className="panel4 flex" style={{fontSize:'20px',lineHeight:'24px',height:'24px',paddingTop:'4px'}}>
        </div>
      </div>
    )

    var conList = this.state.cusContractList.map(function(row) {
      return {
        value:row.id,
        text:row.code + ' ' + row.sign_date + ' ' + row.product
      }
    });
    conList.unshift({valcot:''});
    var cusInfoTab = (
      <div style={{display:this.state.currentTab=='cus_info'?'block':'none'}}>
        <div className="flex">
          <div className="box6">
            <div className="panel6">
              <T content="installment.inspection.home_addr"
                component="div" style={{height:'24px',lineHeight:'24px',paddingTop:'4px'}}
                />
            </div>
            <div className="panel6">
              <FlexDropdown
                field={{
                  id:'home_addr_id',
                  list:this.state.homeAddressList
                }}
                data={this.state}
                onChange={this.handleChange}
                />
            </div>
            <div className="panel6">
              <T content="installment.inspection.work_addr"
                component="div" style={{height:'24px',lineHeight:'24px',paddingTop:'4px'}}
                />
            </div>
            <div className="panel6">
              <FlexDropdown
                field={{
                  id:'work_addr_id',
                  list:this.state.workAddressList
                }}
                data={this.state}
                onChange={this.handleChange}
                />
            </div>
            <div className="panel6">
              <T content="installment.inspection.prev_contract"
                component="div" style={{height:'24px',lineHeight:'24px',paddingTop:'4px'}}
                />
            </div>
            <div className="panel6">
              <FlexDropdown
                field={{
                  id:'contract_id',
                  list:conList
                }}
                data={this.state}
                onChange={this.handleChange}
                />
            </div>
          </div>
          <div className="panel4 no-shrink">
            <NationIDCard
              idcard={this.state.data.cusIDCard}
              photoPath={this.state.cusIDCardPhoto}
              photoLoading={this.state.cusIDCardPhotoLoading}
              onChange={function(data) {this.handleIDCardChange(data)}.bind(this)}
            />
          </div>
        </div>
      </div>
    );
    var coInfoTab = (
      <div style={{display:this.state.currentTab=='co_info'?'block':'none'}}>
        <div className="flex">
          <div className="box6">
            <div className="panel6">
              <T content="installment.inspection.home_addr"
                component="div" style={{height:'24px',lineHeight:'24px',paddingTop:'4px'}}
                />
            </div>
            <div className="panel6">
              <FlexDropdown
                field={{
                  id:'co_home_addr_id',
                  list:this.state.coHomeAddressList
                }}
                data={this.state}
                onChange={this.handleChange}
                />
            </div>

            <div className="panel6">
              <T content="installment.inspection.work_addr"
                component="div" style={{height:'24px',lineHeight:'24px',paddingTop:'4px'}}
                />
            </div>
            <div className="panel6">
              <FlexDropdown
                field={{
                  id:'co_work_addr_id',
                  list:this.state.coWorkAddressList
                }}
                data={this.state}
                onChange={this.handleChange}
                />
            </div>
          </div>

          <div className="panel4 no-shrink">
            <NationIDCard
              idcard={this.state.data.coIDCard}
              photoPath={this.state.coIDCardPhoto}
              photoLoading={this.state.coIDCardPhotoLoading}
              onChange={function(data) {this.handleIDCardChange('co', data)}.bind(this)}
            />
          </div>
        </div>
      </div>
    );
    var cusHistory = (
      <div className="panel10" style={{display:this.state.currentTab=='cus_history'?'block':'none'}}>
        <FlexDataTable
          fields={contractFields}
          data={this.state.cusContractList}
          displayRows={10}
          />
      </div>
    )
    var coHistory = (
      <div className="panel10" style={{display:this.state.currentTab=='co_history'?'block':'none'}}>
        <FlexDataTable
          fields={contractFields}
          data={this.state.coContractList}
          displayRows={10}
          />
      </div>
    );
    return (
      <div className="flex-form">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="installment.inspection.title.inspect" component="h2" />
          </div>
          <div className="panel2 no-shrink">
            <FlexButton icon="printer88" label="installment.inspection.print_form1" default={true}
              onClick={function() {this.doPrintForm('form1')}.bind(this)}/>
          </div>
          <div className="panel2 no-shrink">
            <FlexButton icon="printer88" label="installment.inspection.print_form2" default={true}
              onClick={function() {this.doPrintForm('form2')}.bind(this)}/>
          </div>
        </div>
        <div>
          {customerLine}
          {coLine}
          {addCustLine}
          <div className="panel10">
            <FlexTab list={this.state.tabList} selected={this.state.currentTab} onClick={this.handleTabClick}/>
          </div>
          {cusInfoTab}
          {cusHistory}
          {coInfoTab}
          {coHistory}
        </div>
      </div>
    )
  }
});

module.exports = InspectDetail;
