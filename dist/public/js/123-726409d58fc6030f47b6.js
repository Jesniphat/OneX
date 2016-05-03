webpackJsonp([123,135],{

/***/ 1017:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var DefaultRoute = Router.DefaultRoute;
	var RouteHandler = Router.RouteHandler;
	var tr = __webpack_require__(207);
	var T = __webpack_require__(383);

	var system = __webpack_require__(356);
	var systemActions = system.systemActions; //require('../system/actions');
	var menuActions = system.menuActions; //require('../system/actions/menu');
	var infoPanelActions = system.infoPanelActions;

	tr.registerTranslations('en', __webpack_require__(1018));
	tr.registerTranslations('th', __webpack_require__(1019));

	var App = {};

	App.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.updateTopPanel({
	      code: 'approve',
	      name: 'ผู้บริหาร',
	      icon: 'user157'
	    });

	    menuActions.show([{ id: 'dashboard', route: '/manager', label: 'manager.menu.dashboard', icon: 'show6', acl: ['M_MANAGER'] }, { id: 'approve', route: '/manager/approve', label: 'manager.menu.approve', icon: 'email107', acl: ['M_MANAGER_APPROVE'] }]);
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	App.Dashboard = React.createClass({
	  displayName: 'Dashboard',

	  componentDidMount: function componentDidMount() {
	    infoPanelActions.hide();
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          React.createElement(T, { content: 'manager.title.index' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          ' '
	        )
	      )
	    );
	  }
	});

	// var Approve = require('./approve/approve.jsx');
	// App.Routes = (
	//   <Route name="manager" path="manager" handler={App.Index}>
	//     <Router.DefaultRoute name="manager.dashboard" handler={App.Dashboard}/>
	//     {Approve.Routes}
	//   </Route>
	// );

	module.exports = App;

/***/ },

/***/ 1018:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  installment: {
	    menu: {
	      dashboard: 'Dashboard',
	      staff: 'Staffs',
	      permission: 'Permissions',
	      branch: 'Branch'
	    }
	  }
	};

/***/ },

/***/ 1019:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  manager: {
	    title: {
	      index: 'ภาพรวม'
	    },
	    menu: {
	      dashboard: 'ภาพรวม',
	      sell: 'ขาย',
	      receipt: 'รับชำระค่างวด',
	      receipt_dept: 'ค้นหาประวัติชำระ',
	      product: 'เพิ่มสินค้า',
	      approve: 'ตรวจสอบเงินหน้าร้าน'
	    }
	  },
	  receipt: {
	    contract: 'สัญญา',
	    filter_shop: 'สาขา',
	    filter_current_status: 'สถานะ',
	    code: 'เลขที่',
	    sign_date: 'วันที่ทำ',
	    shop_code: 'รหัสสาขา',
	    shop_name: 'สาขา',
	    contract_status: 'สถานะ',
	    doc_send_to: 'จัดส่งเอกสารที่',
	    doc_send_to_HOME: 'บ้าน',
	    doc_send_to_WORK: 'ที่ทำงาน',
	    customer: 'ผู้เช่าซื้อ',
	    co: 'ผู้เช่าซื้อร่วม',
	    coaddress_status: 'ที่อยู่ผู้เช่าซื้อร่วม',
	    product: 'สินค้า',
	    serial: 'S/N',
	    product_detail: 'รายละเอียดสินค้า',
	    address_status: 'ที่อยู่ปัจจุบัน',
	    work_status: 'การงาน',
	    product_status: 'ข้อมูลสินค้า',
	    payment_status: 'งวดการชำระ',
	    payment_month: 'จำนวนงวด',
	    payment_on_day: 'ชำระทุกวันที่',
	    payment_price: 'ยอดจัด',
	    payment_per_month: 'ชำระเดือนละ',
	    total_paid: 'ชำระแล้ว',
	    payment_balance: 'คงเหลือ',
	    nationid: 'บัตรประชาชน',
	    pname: 'คำนำหน้า',
	    name: 'ชื่อ',
	    lname: 'นามสกุล',
	    nation_id: 'บัตรประชาชน',
	    birth: 'วันเกิด',
	    age: 'อายุ',
	    gender: 'เพศ',
	    marital_status: 'สถานภาพ',
	    cur_status: 'สถานะ',
	    pay_date: 'วันที่ชำระ',
	    pay_staff: 'พนักงาน',
	    amount: 'ยอดชำระ',
	    address: {
	      addr1: 'เลขที่/อาคาร/หมู่บ้าน',
	      addr2: 'ซอย/ถนน',
	      tambon: 'แขวง/ตำบล',
	      amphur: 'เขต/อำเภอ',
	      province: 'จังหวัด',
	      zipcode: 'รหัสไปรษณีย์',
	      tel: 'โทรศัพท์',
	      fax: 'โทรสาร',
	      year: 'ปีที่อาศัย'
	    },
	    addr_type: 'สถานภาพที่อยู่',
	    addr_with: 'อาศัยอยู่กับ',
	    addr_person: 'จำนวนผู้อาศัยด้วย',
	    addr_month: 'เดือนที่อาศัย',
	    tel: 'โทรศัพท์',
	    mobile: 'มือถือ',
	    email: 'อีเมล',
	    work_company: 'บริษัท/ห้างร้าน',
	    work_addr1: 'เลขที่/หมู่ที่/อาคาร/ชั้น',
	    work_addr2: 'ซอย/ถนน',
	    work_type: 'ประเภทธุรกิจ',
	    work_type_other: 'อื่น ๆ',
	    work_detail: 'ลักษณะงาน',
	    work_department: 'แผนก',
	    work_position: 'ตำแหน่ง',
	    work_time: 'เวลาที่สะดวก',
	    work_year: 'อายุงาน(ปี)',
	    work_salary: 'ฐานเงินเดือน',
	    work_income: 'รายได้อื่น ๆ',
	    work_income_source: 'แหล่งที่มารายได้อื่น ๆ',
	    work_prev_company: 'สถานที่ทำงานเดิม',
	    work_prev_addr: 'ที่ตั้ง',
	    work_prev_department: 'แผนก',
	    work_prev_tel: 'โทรศัพท์',
	    title: {
	      list: 'รายการสัญญาเช่าซื้อทั้งหมด',
	      deptlist: 'รายการประวัติชำระทั้งหมด'
	    },
	    action: {
	      new: 'เพิ่มสาขาใหม่'
	    },
	    person_info: 'ข้อมูลส่วนตัว',
	    work_info: 'สภานภาพการงาน',
	    card_info: 'บัตรประชาชน',
	    gen_payment: 'สร้างงวดชำระ',
	    payment: {
	      date: 'วันที่ชำระ',
	      amount: 'ยอดชำระ'
	    },
	    status: {
	      WAIT: 'รอจ่าย',
	      WAIT_PARTIAL: 'ชำระบางส่วน',
	      WAIT_PAID: 'ชำระแล้ว',
	      OVERDUE: 'เกินกำหนด',
	      OVERDUE_PARTIAL: 'เกิน, ชำระบางส่วน',
	      OVERDUE_PAID: 'เกิน, ชำระแล้ว'
	    },
	    current_status: {
	      ALL: 'ทุกสถานะ',
	      NORMAL: 'ปกติ',
	      DEBT: 'ค้างชำระ',
	      CLOSE_NORMAL: 'ปิดสัญญา ปกติ',
	      CLOSE_RETURN: 'ปิดสัญญา คืนของ',
	      CLOSE_CONFISCATE: 'ปิดสัญญา ยึดของคืน',
	      CLOSE_BAD_DEBT: 'ปิดสัญญา ตัดหนี้สูญ',
	      CLOSE_CANCEL: 'ปิดสัญญา ยกลิก'
	    },

	    view: {
	      summary: 'ภาพรวม',
	      customer: 'ข้อมูลลูกค้า',
	      payment: 'งวดชำระ',
	      call: 'การติดตาม'
	    },
	    term: {
	      num: 'งวด',
	      due_date: 'กำหนดชำระ',
	      due_amount: 'ยอดชำระ',
	      paid_date: 'วันที่ชำระ',
	      paid_amount: 'ชำระแล้ว',
	      due_status: 'เกินกำหนด',
	      paid_status: 'สถานะการชำระ',
	      ref_code: 'เลขที่ใบเสร็จอ้างอิง'
	    },
	    filter_type: 'ประเภทการคืน',
	    confirm_discount: 'จำนวนเงินส่วนลด',
	    confirm_discount_title: 'ยืนยันการปิดสัญญาแบบมีส่วนลด',
	    confirm_void_title: 'ยืนยันการยกเลิกใบเสร็จ',
	    confirm_button: 'ยืนยัน'
	  }
	};

/***/ }

});