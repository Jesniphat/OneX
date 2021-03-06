module.exports = {
  installment: {
    contract: {
      current_status: {
        NORMAL: 'ปกติ',
        DEBT:'ค้างชำระ',
        CLOSE_CANCEL:'ปิด/ยกเลิก',
        CLOSE_NORMAL:'ปิด/ปกติ',
        CLOSE_RETURN:'ปิด/คืนของ',
        CLOSE_CONFISCATE:'ปิด/ยึดคืน',
        CLOSE_BAD_DEBT:'ปิด/หนี้สูญ',
        CLOSE_CHANGE:'ปิดเปลี่ยนของ'
      }
    }
  },
  info: {
    sell_date:'วันที่ขาย',
    receipt_no:'ใบเสร็จ',
    shop_name:'สาขา',
    contract_ref:'เลขที่สัญญา',
    company_name:'ลูกค้า',
    description:'สินค้า',
    serial:'S/N',
    price:'ราคาขาย',
    cost:'ราคาทุน',
    down_payment:'ดาวน์',
    remain_price:'ยอดจัด',
    finance_staff:'พนักงานไฟแนนซ์',
    sell_staff:'พนักงานขาย',
    flag:'*',
    flag_hint:'สดพิเศษ'
  },
  sell: {
    sell_date: 'วันที่',
    receipt_no: 'ใบเสร็จ',
    description: 'ข้อมูลสินค้า',
    serial: 'ซีเรียล',
    sales_staff: 'พนักงานขาย',
    finance_staff: 'พนักงานสินเชื่อ',
    price: 'ราคาสินค้าทั้งหมด',
    cost: 'ทุน',
    main_price:'ราคาสินค้าที่ผ่อน',
    down_payment:'ดาวน์',
    fee:'ค่าทำสัญญา',
    install_cost:'ค่าติดตั้ง',
    remain_price:'ยอดจัด'
  },
  contract: {
    contract: 'สัญญา',
    filter_shop: 'สาขา',
    filter_current_status:'สถานะ',
    filter_selltype:'สถานะขาย',
    code:'เลขที่',
    sign_date:'วันที่ทำ',
    shop_code:'รหัสสาขา',
    shop_name:'สาขา',
    contract_status:'สถานะ',
    doc_send_to:'จัดส่งเอกสารที่',
    doc_send_to_HOME:'บ้าน',
    doc_send_to_WORK:'ที่ทำงาน',
    customer:'ผู้เช่าซื้อ',
    cus_mobile:'เบอร์โทร',
    co:'ผู้เช่าซื้อร่วม',
    coaddress_status:'ที่อยู่',
    cowork_status:'การงาน',
    product:'สินค้า',
    serial:'S/N',
    product_detail:'รายละเอียดสินค้า',
    address_status:'ที่อยู่',
    work_status:'การงาน',
    product_status:'ข้อมูลสินค้า',
    payment_status:'งวดการชำระ',
    payment_month:'จำนวนงวด',
    payment_on_day:'ชำระทุกวันที่',
    payment_price:'ยอดจัด',
    fee:'ค่าทำสัญญา',
    payment_per_month:'ชำระเดือนละ',
    total_paid:'ชำระแล้ว',
    payment_balance:'คงเหลือ',
    nationid:'บัตรประชาชน',
    pname:'คำนำหน้า',
    name:'ชื่อ',
    lname:'นามสกุล',
    nation_id:'บัตรประชาชน',
    birth:'วันเกิด',
    age:'อายุ',
    gender:'เพศ',
    marital_status:'สถานภาพ',
    over_day:'เกินกำหนด',
    finance:'ไฟแนนซ์',
    last_paid:'ชำระล่าสุด',
    amount_term:'งวดค้าง',
    return_date:'วันที่ยึด',
    discount:'ส่วนลด',
    contract_ref:'เลขที่สัญญาเก่า',
    sell_date:'วันที่ขาย',
    cus_name:'ผู้เช่าซื้อ',
    address: {
      copy_from:'คัดลอกจาก',
      card_address:'ที่อยู่ตามบัตรประชาชน',
      home_address:'ที่อยู่ปัจจุบัน',
      work_address:'ที่อยู่ที่ทำงาน',
      addr1:'เลขที่/อาคาร/หมู่บ้าน',
      addr2:'ซอย/ถนน',
      tambon:'แขวง/ตำบล',
      amphur:'เขต/อำเภอ',
      province:'จังหวัด',
      zipcode:'รหัสไปรษณีย์',
      tel:'เบอร์อื่น ๆ',
      fax:'โทรสาร',
      year:'ปีที่อาศัย'
    },
    addr_type:'สถานภาพที่อยู่',
    addr_with:'อาศัยอยู่กับ',
    addr_person:'จำนวนผู้อาศัยด้วย',
    addr_month:'เดือนที่อาศัย',
    tel:'โทรศัพท์',
    mobile:'มือถือ',
    email:'อีเมล',
    co_relation:'ความสัมพันธ์',
    work_company:'บริษัท/ห้างร้าน',
    work_addr1:'เลขที่/หมู่ที่/อาคาร/ชั้น',
    work_addr2:'ซอย/ถนน',
    work_type:'ประเภทธุรกิจ',
    work_type_other:'อื่น ๆ',
    work_detail:'ลักษณะงาน',
    work_department:'แผนก',
    work_position:'ตำแหน่ง',
    work_time:'เวลาที่สะดวก',
    work_year:'อายุงาน(ปี)',
    work_salary:'ฐานเงินเดือน',
    work_income:'รายได้อื่น ๆ',
    work_income_source:'แหล่งที่มารายได้อื่น ๆ',
    work_prev_company:'สถานที่ทำงานเดิม',
    work_prev_addr:'ที่ตั้ง',
    work_prev_department:'แผนก',
    work_prev_tel:'โทรศัพท์',
    title: {
      index: 'สัญญาเช่าซื้อ',
      list_pending: 'รายการขายผ่อนรอเปิดสัญญา',
      list: 'รายการสัญญาเช่าซื้อทั้งหมด',
      view: 'รายละเอียดสัญญาเช่าซื้อ',
      new: 'ทำสัญญาใหม่',
      close:'รายการยึด/คืนสินค้าทั้งหมด',
      closediscount:'รายการสัญญารอปิดแบบมีส่วนลด',
      list_redeem:'รายการขายไถ่ถอน/เปลี่ยนของรอเปิดสัญญา'
    },
    action: {
      new: 'เพิ่มสาขาใหม่'
    },
    person_info: 'ข้อมูลส่วนตัว',
    work_info:'สภานภาพการงาน',
    card_info:'บัตรประชาชน',
    gen_payment:'สร้างงวดชำระ',
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
      ALL:'ทุกสถานะ',
      NORMAL: 'ปกติ',
      DEBT: 'ค้างชำระ',
      CLOSE_NORMAL: 'ปิดสัญญา ปกติ',
      CLOSE_CANCEL: 'ปิดสัญญา ยกเลิก',
      CLOSE_RETURN: 'ปิดสัญญา คืนของ',
      CLOSE_CONFISCATE: 'ปิดสัญญา ยึดของคืน',
      CLOSE_BAD_DEBT: 'ปิดสัญญา ตัดหนี้สูญ'
    },

    view: {
      summary:'ภาพรวม',
      customer:'ข้อมูลลูกค้า',
      payment:'งวดชำระ',
      call:'การติดตาม'
    },
    term: {
      num: 'งวด',
      due_date: 'กำหนดชำระ',
      due_amount:'ยอดชำระ',
      paid_date:'วันที่ชำระ',
      paid_amount:'ชำระแล้ว',
      term_status:'สถานะการชำระ',
      ref_code:'เลขที่ใบเสร็จอ้างอิง',
      term_status_WAIT: 'รอชำระ',
      term_status_WAIT_PARTIAL:'ชำระบางส่วน',
      term_status_WAIT_PAID:'ชำระแล้ว',
      term_status_OVERDUE:'เกินกำหนด',
      term_status_OVERDUE_PARTIAL:'ชำระบางส่วน เกินกำหนด',
      term_status_OVERDUE_PAID:'ชำระแล้ว เกินกำหนด'
    },
    filter_type:'ประเภทการคืน',
    footer:{
      special:'| * หมายถึง สดพิเศษ'
    }
  },
  close_return:{
    newcost:'ราคาทุนใหม่',
    oldcost:'ราคาทุนเดิม',
    paid:'ชำระแล้ว',
    balance:'คงเหลือ',
    contract_free:'ค่าทำสัญญา',
    install_free:'ค่าติดตั้ง',
    profit_loss:'กำไรขาดทุน',
    sell_id:'เลขที่ขาย',
    sign_date:'วันที่ขาย',
    product_serial:'Serial No',
    product_detial:'สินค้า',
    product_condition:'สภาพสินค้า',
    remark:'หมายเหตุ',
    return_date:'วันที่ยึดสินค้า',
    return_detail:{
      num:'ลำดับ',
      product:'สินค้า',
      serial:'Serial No',
      newcost:'ทุนใหม่',
      oldcost:'ทุนเดิม'
    }
  },
  collection:{
    call_date:'วันที่โทรตาม',
    call_number:'เบอร์โทร',
    call_remark:'ข้อความ',
    due_date:'วันนัดชำระ',
    call_type:'ประเภทการโทร',
    save:'บันทึกตามหนี้',
    print:'พิมพ์เอกสาร',
    print_file:'เอกสาร',
    send_print:'ส่งถึง',
    statusca:'สถานะ',
    saveca:'บันทึกแจ้งหนีหนี้ CA',
    call_name:'ชื่อผู้ซื้อ/ชื่อผู้ค้ำ',
    collection_list:{
      num:'ลำดับ',
      call_date:'วันที่โทรตาม',
      due_date:'วันนัดชำระ',
      call_number:'เบอร์โทร',
      call_type:'ประเภทการโทร',
      call_remark:'ข้อความ',
      staff_name:'พนักงาน'
    }
  },
  closeca:{
    contract_code:'เลขที่สัญญา',
    paid:'ชำระแล้ว',
    cost:'ราคาทุน',
    new_cost:'ราคาทุนใหม่',
    fee:'ค่าทำสัญญา',
    install_cost:'ค่าติดตั้ง',
    total_paid:'ชำระแล้ว',
    profit_lost:'กำไรขาดทุน',
    sell_id:'เลขที่ขาย',
    sign_date:'วันที่ขาย',
    closeca_effective:'หัก/จ่าย เดือน',
    closeca_date:'วันที่ปิด CA',
    product_serial:'Serial No',
    product_detail:'สินค้า',
    closeca_remark:'หมายเหตุ',
    nationid:'เลขที่บัตรประชาชน',
    cus_name:'ชือลูกค้า',
    over_day:'จำนวนวันเกิน',
    last_paid:'วันที่จ่ายล่าสุด',
    closeca_staffname:'พนักงานผู้รับผิดชอบ',
    closeca_staff_percent:'หักพนักงาน(%)',
    closeca_staff_amount:'หักพนักงานเป็นเงิน',
    closeca_percent:'บริษัทรับผิดชอบ(%)',
    closeca_amount:'บริษัทรับผิดชอบเป็นเงิน',
    saveca:'ปิดสัญญาหนีหนี้CA',
    total_price:'ราคาขาย'
  }
};
