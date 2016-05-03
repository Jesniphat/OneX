var React     = require('react');
var Reflux    = require('reflux');
var Router    = require('react-router');
var Link      = Router.Link;
var T         = require('react-translate-component');

var systemActions = require('../../system/actions');
var infoPanelActions = require('../../../actions/info-panel');

var FlexButton    = require('../../../widgets/flex-button.jsx');
var FlexTab       = require('../../../widgets/flex-tab.jsx');
var FlexTextInput = require('../../../widgets/flex-text-input.jsx');
var FlexDropdown  = require('../../../widgets/flex-dropdown.jsx');


var IDCardInfo = React.createClass({
  getInitialState: function() {
    return {
      info: {
        code:'1 5205 00073 28 1',
        pnameTH:'นาย',
        nameTH:'กิตติพงษ์',
        lnameTH:'เหม็งประมูล',
        pnameEN:'Mr.',
        nameEN:'Gittipong',
        lnameEN:'Mangpramoon',
        birthTH:'12 มี.ค. 2532',
        birthEN:'12 Mar. 1989',
        addr1:'21 หมู่ที่ 7 ต.หลวงใต้',
        addr2:'อ.งาว จ.ลำปาง',
        issueDateTH:'24 ก.ย. 2551',
        issueDateEN:'24 Sep. 2008',
        expiryDateTH:'11 มี.ค. 2558',
        expiryDateEN:'11 Mar. 2015',
        photoId:0
      }
    }
  },
  render: function() {
    return (
      <div className="nationid-reader">
        <div className="nationid-card">
          <div className="code">{this.state.info.code}</div>
          <div className="name-th ellipsis">{this.state.info.pnameTH} {this.state.info.nameTH} {this.state.info.lnameTH}</div>
          <div className="name-en ellipsis">{this.state.info.pnameEN} {this.state.info.nameEN}</div>
          <div className="name2-en ellipsis">{this.state.info.lnameEN}</div>
          <div className="birth-th">{this.state.info.birthTH}</div>
          <div className="birth-en">{this.state.info.birthEN}</div>
          <div className="addr1 ellipsis">{this.state.info.addr1}</div>
          <div className="addr2 ellipsis">{this.state.info.addr2}</div>
          <div className="issue_date_th">{this.state.info.issueDateTH}</div>
          <div className="issue_date_en">{this.state.info.issueDateEN}</div>
          <div className="expiry_date_th">{this.state.info.expiryDateTH}</div>
          <div className="expiry_date_en">{this.state.info.expiryDateEN}</div>
          <div className="photo"></div>
        </div>
        <div className="ready-to-read">คลิกที่บัตรเพื่ออ่าน</div>
      </div>
    );
  }
});

var CustomerInfo = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: 'person_info',
      fields: {
        nation_id: {
          id:'nation_id',
          type:'text',
          label:'contract.nation_id',
          icon:'user158',
          required:true,
          width:464,
          tabIndex:1
        },
        pname: {
          id:'pname',
          type:'text',
          label:'contract.pname',
          required:true,
          pattern:'^.{1,}$',
          width:80,
          tabIndex: 1,
          nolabel:true
        },
        name: {
          id:'name',
          type:'text',
          label:'contract.name',
          icon:'user158',
          required:true,
          pattern:'^.{1,}$',
          width:190,
          tabIndex: 1
        },
        lname: {
          id:'lname',
          type:'text',
          label:'contract.lname',
          icon:'user158',
          required:true,
          pattern:'^.{1,}$',
          width:190,
          tabIndex: 2
        },
        birth: {
          id:'lname',
          type:'date',
          label:'contract.birth',
          icon:'user158',
          required:true,
          width:230
        },
        age: {
          id:'age',
          type:'text',
          label:'contract.age',
          icon:'user158',
          width:230,
          readonly:true
        },
        gender: {
          id:'gender',
          type:'dropdown',
          label:'contract.gender',
          width:230,
          list:[
            {value:'M', text:'ชาย'},
            {value:'F', text:'หญิง'},
            {value:'N/A', text:'ไม่ระบุ'}
          ]
        },
        marital_status: {
          id:'marital_status',
          type:'dropdown',
          label:'contract.marital_status',
          width:230,
          list:[
            {value:'SINGLE', text:'โสด'},
            {value:'MARRIED', text:'สมรส'},
            {value:'N/A', text:'ไม่ระบุ'}
          ]
        },
        addr1: {
          id:'addr1',
          type:'text',
          label:'contract.addr1',
          icon:'user158',
          width:464
        },
        addr2: {
          id:'addr2',
          type:'text',
          label:'contract.addr2',
          icon:'user158',
          width:464
        },
        addr_tambon: {
          id:'addr_tambon',
          type:'text',
          label:'contract.addr_tambon',
          icon:'user158',
          width:230
        },
        addr_amphur: {
          id:'addr_amphur',
          type:'text',
          label:'contract.addr_amphur',
          icon:'user158',
          width:230
        },
        addr_province: {
          id:'addr_province',
          type:'text',
          label:'contract.addr_province',
          icon:'user158',
          width:230
        },
        addr_zipcode: {
          id:'addr_zipcode',
          type:'text',
          label:'contract.addr_zipcode',
          icon:'user158',
          pattern:'^[0-9]{5}$',
          width:230
        },
        tel: {
          id:'tel',
          type:'text',
          label:'contract.tel',
          icon:'user158',
          pattern:'^0[0-9]{8}$',
          width:230
        },
        mobile: {
          id:'mobile',
          type:'text',
          label:'contract.mobile',
          icon:'user158',
          pattern:'^0[0-9]{9}$',
          width:230
        },
        addr_owner: {
          id:'addr_owner',
          type:'dropdown',
          label:'contract.addr_owner',
          width:230,
          list:[
            {value:'1', text:'เจ้าของบ้าน'},
            {value:'2', text:'บ้านญาติ'},
            {value:'3', text:'บ้านพักสวัสดิการ'},
            {value:'4', text:'เช่าเอกชน'},
            {value:'5', text:'เช่าการเคหะ'},
            {value:'6', text:'บ้านบิดามารดา'}
          ]
        },
        addr_with: {
          id:'addr_with',
          type:'dropdown',
          label:'contract.addr_with',
          width:230,
          list:[
            {value:'1', text:'คนเดียว'},
            {value:'2', text:'บิดามารดา'},
            {value:'3', text:'ญาติ'},
            {value:'4', text:'คู่สมรส'},
            {value:'5', text:'เพื่อน'}
          ]
        },
        addr_person: {
          id:'addr_person',
          type:'number',
          label:'contract.addr_person',
          width:152
        },
        addr_year: {
          id:'addr_year',
          type:'number',
          label:'contract.addr_year',
          width:152
        },
        addr_month: {
          id:'addr_month',
          type:'number',
          label:'contract.addr_month',
          width:152
        },
      },
      data:{}
    };
  },
  handleTabClick: function(id) {
    console.log(id, 'was clicked');
  },
  render: function() {
    var list = [
      {id:'person_info', icon:'user157', text:'contract.person_info'},
      {id:'job_info', icon:'web37', text:'contract.job_info'},
      {id:'card_info', icon:'web37', text:'contract.card_info'}
    ];

    return (
      <div className="box10 flex flex-form">
        <div className="box6" style={{borderLeft:'4px solid red'}}>
          <div className="flex">
            <div className="panel1 no-shrink"><h3>ผู้เช่าซื้อ</h3></div>
            <div className="panel5 no-shrink flex">
              <FlexTextInput field={this.state.fields.nation_id} data={this.state.data} onChange={this.handleChange}/>
            </div>
          </div>
          <div className="box6 flex no-shrink">
            <div className="panel1 no-shrink">ข้อมูลส่วนตัว</div>
            <div className="panel5 no-shrink">
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.pname} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'2px'}}></div>
                <FlexTextInput field={this.state.fields.name} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'2px'}}></div>
                <FlexTextInput field={this.state.fields.lname} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.birth} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.age} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex">
                <FlexDropdown field={this.state.fields.gender} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexDropdown field={this.state.fields.marital_status} data={this.state.data} onChange={this.handleChange}/>
              </div>
            </div>
          </div>
          <div className="box6 no-shrink flex">
            <div className="panel1 no-shrink">ที่อยู่ปัจจุบัน</div>
            <div className="panel5 no-shrink">
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.addr1} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.addr2} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.addr_tambon} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.addr_amphur} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.addr_province} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.addr_zipcode} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex">
                <FlexTextInput field={this.state.fields.tel} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.mobile} data={this.state.data} onChange={this.handleChange}/>
              </div>
            </div>
          </div>
          <div className="box6 no-shrink flex">
            <div className="panel1 no-shrink">สถานภาพ<br/>ที่อยู่</div>
            <div className="panel5 no-shrink">
              <div className="flex">
                <FlexDropdown field={this.state.fields.addr_owner} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexDropdown field={this.state.fields.addr_with} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex">
                <FlexTextInput field={this.state.fields.addr_person} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.addr_year} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.addr_month} data={this.state.data} onChange={this.handleChange}/>
              </div>
            </div>
          </div>
        </div>
        <div className="panel4 no-shrink">
          <IDCardInfo/>
        </div>
      </div>
    );
  }
});

var JobInfo = React.createClass({
  getInitialState: function() {
    return {
      fields: {
        job_company: {
          id:'job_company',
          type:'text',
          label:'contract.job_company',
          width:464
        },
        job_addr1: {
          id:'job_addr1',
          type:'text',
          label:'contract.job_addr1',
          width:464
        },
        job_addr2: {
          id:'job_addr2',
          type:'text',
          label:'contract.job_addr2',
          width:464
        },
        job_addr_tambon: {
          id:'job_addr_tambon',
          type:'text',
          label:'contract.addr_tambon',
          width:230
        },
        job_addr_amphur: {
          id:'job_addr_amphur',
          type:'text',
          label:'contract.addr_amphur',
          width:230
        },
        job_addr_province: {
          id:'job_addr_province',
          type:'text',
          label:'contract.addr_province',
          width:230
        },
        job_addr_zipcode: {
          id:'job_addr_zipcode',
          type:'text',
          label:'contract.addr_zipcode',
          width:230
        },
        job_business_type: {
          id:'job_business_type',
          type:'dropdown',
          label:'contract.job_business_type',
          width:230,
          list:[
            {value:'1',text:'บริษัทเอกชน'},
            {value:'2',text:'รับราชการ'},
            {value:'3',text:'รัฐวิสาหกิจ'},
            {value:'4',text:'ธุรกิจส่วนตัว'},
            {value:'5',text:'อาชีพอิสระ'},
            {value:'6',text:'รับจ้างชั่วคราว'},
            {value:'7',text:'อื่น ๆ'},
          ]
        },
        job_business_other: {
          id:'job_business_other',
          type:'text',
          label:'contract.job_business_other',
          width:230
        },
        job_detail: {
          id:'job_detail',
          type:'text',
          label:'contract.job_detail',
          width:230
        },
        job_department: {
          id:'job_department',
          type:'text',
          label:'contract.job_department',
          width:230
        },
        job_position: {
          id:'job_position',
          type:'text',
          label:'contract.job_position',
          width:230
        },
        job_time: {
          id:'job_time',
          type:'text',
          label:'contract.job_time',
          width:230
        },
        job_age_year: {
          id:'job_age_year',
          type:'text',
          label:'contract.job_age_year',
          width:230
        },
        job_salary: {
          id:'job_salary',
          type:'text',
          label:'contract.job_salary',
          width:230
        },
        job_income: {
          id:'job_income',
          type:'text',
          label:'contract.job_income',
          width:230
        },
        job_income_detail: {
          id:'job_income_detail',
          type:'text',
          label:'contract.job_income_detail',
          width:230
        }
      },
      data:{}
    };
  },

  render: function() {
    var list = [
      {id:'person_info', icon:'user157', text:'contract.person_info'},
      {id:'job_info', icon:'web37', text:'contract.job_info'},
      {id:'card_info', icon:'web37', text:'contract.card_info'}
    ];

    return (
      <div className="box10 flex flex-form" style={{marginTop:'8px'}}>
        <div className="box10 can-grow" style={{borderLeft:'4px solid green'}}>
          <div className="box6 no-shrink flex">
            <div className="panel1 no-shrink"><h3>สถานภาพการงาน</h3></div>
            <div className="panel5 no-shrink">
              <div style={{paddingBottom:'5px'}}>
                <FlexTextInput field={this.state.fields.job_company} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div style={{paddingBottom:'5px'}}>
                <FlexTextInput field={this.state.fields.job_addr1} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div style={{paddingBottom:'5px'}}>
                <FlexTextInput field={this.state.fields.job_addr2} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.job_addr_tambon} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.job_addr_amphur} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.job_addr_province} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.job_addr_zipcode} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex">
                <FlexDropdown field={this.state.fields.job_business_type} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.job_business_other} data={this.state.data} onChange={this.handleChange}/>
              </div>
            </div>
          </div>
        </div>
        <div className="panel4 no-shrink">
          <div className="flex">
            <FlexTextInput field={this.state.fields.job_detail} data={this.state.data} onChange={this.handleChange}/>
            <div style={{width:'4px'}}></div>
            <FlexTextInput field={this.state.fields.job_department} data={this.state.data} onChange={this.handleChange}/>
          </div>
          <div className="flex">
            <FlexTextInput field={this.state.fields.job_position} data={this.state.data} onChange={this.handleChange}/>
            <div style={{width:'4px'}}></div>
            <FlexTextInput field={this.state.fields.job_time} data={this.state.data} onChange={this.handleChange}/>
          </div>
          <div className="flex">
            <FlexTextInput field={this.state.fields.job_age_year} data={this.state.data} onChange={this.handleChange}/>
            <div style={{width:'4px'}}></div>
            <FlexTextInput field={this.state.fields.job_salary} data={this.state.data} onChange={this.handleChange}/>
          </div>
          <div className="flex">
            <FlexTextInput field={this.state.fields.job_income} data={this.state.data} onChange={this.handleChange}/>
            <div style={{width:'4px'}}></div>
            <FlexTextInput field={this.state.fields.job_income_detail} data={this.state.data} onChange={this.handleChange}/>
          </div>
        </div>
      </div>
    );
  }
});

var CustomerCoInfo = React.createClass({
  getInitialState: function() {
    return {
      fields: {
        pname: {
          id:'pname',
          type:'text',
          label:'contract.pname',
          required:true,
          pattern:'^.{1,}$',
          width:80,
          tabIndex: 1,
          nolabel:true
        },
        name: {
          id:'name',
          type:'text',
          label:'contract.name',
          icon:'user158',
          required:true,
          pattern:'^.{1,}$',
          width:190,
          tabIndex: 1
        },
        lname: {
          id:'lname',
          type:'text',
          label:'contract.lname',
          icon:'user158',
          required:true,
          pattern:'^.{1,}$',
          width:190,
          tabIndex: 2
        },
        nation_id: {
          id:'nation_id',
          type:'text',
          label:'contract.nation_id',
          icon:'user158',
          required:true,
          width:464
        },
        addr1: {
          id:'addr1',
          type:'text',
          label:'contract.addr1',
          icon:'user158',
          width:464
        },
        addr2: {
          id:'addr2',
          type:'text',
          label:'contract.addr2',
          icon:'user158',
          width:464
        },
        addr_tambon: {
          id:'addr_tambon',
          type:'text',
          label:'contract.addr_tambon',
          icon:'user158',
          width:230
        },
        addr_amphur: {
          id:'addr_amphur',
          type:'text',
          label:'contract.addr_amphur',
          icon:'user158',
          width:230
        },
        addr_province: {
          id:'addr_province',
          type:'text',
          label:'contract.addr_province',
          icon:'user158',
          width:230
        },
        addr_zipcode: {
          id:'addr_zipcode',
          type:'text',
          label:'contract.addr_zipcode',
          icon:'user158',
          pattern:'^[0-9]{5}$',
          width:230
        },
        tel: {
          id:'tel',
          type:'text',
          label:'contract.tel',
          icon:'user158',
          pattern:'^0[0-9]{8}$',
          width:230
        },
        mobile: {
          id:'mobile',
          type:'text',
          label:'contract.mobile',
          icon:'user158',
          pattern:'^0[0-9]{9}$',
          width:230
        },
        addr_year: {
          id:'addr_year',
          type:'number',
          label:'contract.addr_year',
          width:152
        },

        job_company: {
          id:'job_company',
          type:'text',
          label:'contract.job_company',
          width:464
        },
        job_business_type: {
          id:'job_business_type',
          type:'dropdown',
          label:'contract.job_business_type',
          list:[
            {value:'1',text:'บริษัทเอกชน'},
            {value:'2',text:'รับราชการ'},
            {value:'3',text:'รัฐวิสาหกิจ'},
            {value:'4',text:'ธุรกิจส่วนตัว'},
            {value:'5',text:'อาชีพอิสระ'},
            {value:'6',text:'รับจ้างชั่วคราว'},
            {value:'7',text:'อื่น ๆ'},
          ]
        },
        job_business_other: {
          id:'job_business_other',
          type:'text',
          label:'contract.job_business_other',
          width:230
        },
        job_detail: {
          id:'job_detail',
          type:'text',
          label:'contract.job_detail',
          width:230
        },
        job_department: {
          id:'job_department',
          type:'text',
          label:'contract.job_department',
          width:230
        },
        job_position: {
          id:'job_position',
          type:'text',
          label:'contract.job_position',
          width:230
        },
        job_time: {
          id:'job_time',
          type:'text',
          label:'contract.job_time',
          width:230
        },
        job_age_year: {
          id:'job_age_year',
          type:'text',
          label:'contract.job_age_year',
          width:230
        },
        job_salary: {
          id:'job_salary',
          type:'text',
          label:'contract.job_salary',
          width:230
        }
      },
      data:{}
    };
  },
  handleTabClick: function(id) {
    console.log(id, 'was clicked');
  },
  render: function() {
    var list = [
      {id:'person_info', icon:'user157', text:'contract.person_info'},
      {id:'job_info', icon:'web37', text:'contract.job_info'},
      {id:'card_info', icon:'web37', text:'contract.card_info'}
    ];

    return (
      <div className="box10 flex flex-form">
        <div className="box6" style={{borderLeft:'4px solid blue'}}>
          <div className="flex">
            <div className="panel1 no-shrink"><h3>ผู้เช่าซื้อร่วม</h3></div>
            <div className="panel5 no-shrink flex">
              <FlexTextInput field={this.state.fields.pname} data={this.state.data} onChange={this.handleChange}/>
              <div style={{width:'2px'}}></div>
              <FlexTextInput field={this.state.fields.name} data={this.state.data} onChange={this.handleChange}/>
              <div style={{width:'2px'}}></div>
              <FlexTextInput field={this.state.fields.lname} data={this.state.data} onChange={this.handleChange}/>
            </div>
          </div>
          <div className="box6 flex no-shrink">
            <div className="panel1 no-shrink">ข้อมูลส่วนตัว</div>
            <div className="panel5 no-shrink">
              <div style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.nation_id} data={this.state.data} onChange={this.handleChange}/>
              </div>
            </div>
          </div>
          <div className="box6 no-shrink flex">
            <div className="panel1 no-shrink">ที่อยู่ปัจจุบัน</div>
            <div className="panel5 no-shrink">
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.addr1} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.addr2} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.addr_tambon} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.addr_amphur} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex" style={{paddingBottom:'4px'}}>
                <FlexTextInput field={this.state.fields.addr_province} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.addr_zipcode} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex">
                <FlexTextInput field={this.state.fields.tel} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.mobile} data={this.state.data} onChange={this.handleChange}/>
              </div>
            </div>
          </div>
          <div className="box6 no-shrink flex">
            <div className="panel1 no-shrink">สถานภาพงาน</div>
            <div className="panel5 no-shrink">
              <div style={{paddingBottom:'5px'}}>
                <FlexTextInput field={this.state.fields.job_company} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex">
                <FlexTextInput field={this.state.fields.job_detail} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.job_department} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex">
                <FlexTextInput field={this.state.fields.job_position} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.job_time} data={this.state.data} onChange={this.handleChange}/>
              </div>
              <div className="flex">
                <FlexTextInput field={this.state.fields.job_age_year} data={this.state.data} onChange={this.handleChange}/>
                <div style={{width:'4px'}}></div>
                <FlexTextInput field={this.state.fields.job_salary} data={this.state.data} onChange={this.handleChange}/>
              </div>
            </div>
          </div>
        </div>
        <div className="panel4 no-shrink">
          <IDCardInfo/>
        </div>
      </div>
    );
  }
});


var ContractNew = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    var sellId = parseInt(this.context.router.getCurrentParams().sellId);
    return {
      sellId:sellId
    };
  },

  doContractSave: function() {
    console.log('save');
  },

  scrollTo: function(e, id) {
    e.preventDefault();
    if (!this.refs[id]){
      return;
    }
    this.refs[id].getDOMNode().scrollIntoView();
  },

  componentDidMount: function() {
    systemActions.setPageHeaderItems([(
      <div key="1" className="boxf flex">
        <div className="panelf can-grow">
          <T content="contract.title.new" component="h2" />
        </div>
        <div className="boxf flex no-shrink">
          <div className="panel2 no-shrink">
            <FlexButton icon="save20" label="action.save" default={true}
              onClick={this.doContractSave}/>
          </div>
        </div>
      </div>
    )]);
    infoPanelActions.show('installment.contract.bysales', (
      <div>
        <ol>
          <li><a href="#" onClick={function(e){this.scrollTo(e, 'customer')}.bind(this)}>ผู้เช่าซื้อ</a></li>
          <li><a href="#" onClick={function(e){this.scrollTo(e, 'job')}.bind(this)}>สถานภาพงาน</a></li>
          <li><a href="#" onClick={function(e){this.scrollTo(e, 'customerCo')}.bind(this)}>ผู้เช่าซื้อร่วม</a></li>
        </ol>
      </div>
    ));
  },

  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  render: function() {
    return (
      <div className="boxf">
        <CustomerInfo ref="customer"/>
        <JobInfo ref="job"/>
        <CustomerCoInfo ref="customerCo"/>
      </div>
    );
  }
});

module.exports = ContractNew;
