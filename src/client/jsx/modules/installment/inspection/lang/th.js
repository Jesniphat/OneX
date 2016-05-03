module.exports = {
  installment: {
    inspection: {
      title: {
        index: 'ประวัติลูกค้าเช่าซื้อ',
        inspect: 'ตรวจสอบประวัติ'
      },
      tab: {
        cus_info:'ข้อมูลผู้เช่าซื้อ',
        co_info:'ข้อมูลผู้เช่าซื้อร่วม',
        history:'ประวัติการเช่าซื้อ'
      },
      nation_id:'บัตรประชาชน',
      home_addr:'ที่อยู่ปัจจุบัน',
      work_addr:'ที่อยู่ที่ทำงาน',
      print_form1:'พิมพ์สัญญา',
      print_form2:'พิมพ์หนังสือยินยอม',
      add_cust:'เพิ่มลูกค้า',
      prev_contract:'สัญญาเก่า',
      read_id:'อ่านบัตรประชาชน',
      contract: {
        no:'ที่',
        status:'การชำระ',
        role:'ผู้เช่าซื้อ/ร่วม',
        code:'เลขที่สัญญา',
        sign_date:'วันที่สัญญา',
        product:'สินค้า',
        payment_price:'ยอดผ่อน',
        total_paid:'ชำระแล้ว',
        balance:'คงเหลือ',
        current_status:'สถานะ',
        role_type:{
          cus:'ผู้เช่าซื้อ',
          co:'ผู้เช่าซื้อร่วม'
        },
        status_text: {
          NORMAL:'ปกติ',
          DEBT:'ค้างชำระ',
          CLOSE_CANCEL:'ปิด/ยกเลิก',
          CLOSE_NORMAL:'ปิด/ปกติ',
          CLOSE_RETURN:'ปิด/คืนของ',
          CLOSE_CONFISCATE:'ปิด/ยืดคืนของ',
          CLOSE_BAD_DEBT:'ปิด/หนี้สูญ'
        },
        view:'ดู'
      }
    }
  }
};
