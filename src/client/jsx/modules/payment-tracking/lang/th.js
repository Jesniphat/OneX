module.exports = {
  transport: {
    title: {
      index: 'Overview',
      loadfareScreen: 'Load Fare'
    },
    head: {
      headName: 'Load Fare'
    },
    menu: {
      dashboard: 'ภาพรวม',
      loadfareZone: 'อัพโหลดข้อมูลโซน',
      loadfareRate: 'อัพโหลดข้อมูลเรท',
      customer: 'ข้อมูลลูกค้า',
      bookingList:'รายการบุ๊กกิ๊ง',
      booking: 'บุ๊กกิ๊ง'
    }
  },
  page:{
    pageNumber:'Pagenumber',
    rowNumber:'Rownumber',
    perPage:'Perpage',
    rows:'Rows',
  },
  newcustomer: {
    title: {
      index: 'ภาพรวม',
      head: 'รายการลูกค้า',
      addCustomerBT:'เพิ่มลูกค้า',
      headNew: 'เพิ่ม/แก้ไข ข้อมูลลูกค้า',
      headProd: 'GROUP LIST',
      headProdEdit:'GROUP SETTING',
      saveCustomerBT: 'บันทึก',
      editCustomerBT: 'แก้ไข',
      confirm_to_delete: 'ลบข้อมูลสมาชิก',
      addProductGroupBT: 'เพิ่มกลุ่มสินค้า'
    },
    menu: {
      dashboard: 'ภาพรวม',
      customer:'ลูกค้า',
      receipt:'รับชำระค่างวด',
      receipt_dept:'ค้นหาประวัติชำระ',
      productGroup:'กลุ่มสินค้า',
      product:'เพิ่มสินค้า'
    },
    customer_code: 'รหัสลูกค้า',
    type: 'ประเภทลูกค้า',
    fullname: 'ชื่อเต็ม',
    nation: 'ประเภทสมาชิก',
    last_uses_at: 'ใช้บริการครั้งสุดท้ายเมื่อ',
    shop_name: 'ที่สาขา',
    prod_group_id: 'รหัสกลุ่มสินค้า',
    prod_group_name: 'ชื่อกลุ่มสินค้า',
    prod_group_description: 'รายละเอียดกลุ่มสินค้า',
    add_new_customer: {
      customer_code: 'รหัส',
      tax_num: 'เลขที่บัตรประชาชน',
      member_code: 'รหัสสมาชิก',
      sex:'คำนำหน้า',
      names: 'ชื่อ',
      last_name: 'นามสกุล',
      phone: 'เบอร์โทร',
      fax: 'เบอร์แฟ๊กซ์',
      e_mail: 'อีเมลล์',
      line_id: 'LineID',
      birthday:'วันเกิด',
      olds:'อายุ',
      news:'รับข่าวสาร',
      credit_term:'เครดิตเทอม',
      contactName:'ชื่อ',
      contactPosition:'ตำแหน่ง',
      contactEmail:'อีเมลล์',
      contactPhoneNo:'เบอร์โทร',
      contactLineId:'Line ID',
      contactRemark:'บันทึก',
      billingCode:'รหัส',
      billingName:'ชื่อ',
      billingTax:'เลขประจำตัวผู้เสียภาษี',
      billingAddr1:'เลขที่/อาคาร/หมู่บ้าน',
      billingAddr2:'ซอย/ถนน',
      billingTambon:'แขวง/ตำบล',
      billingAmper:'อำเถอ',
      billingProvince:'จังหวัด',
      billingZipcode:'รหัสไปรษณีย์',
      billingOtherNo:'เบอร์อื่นๆ',
      billingLiveYear:'ปีที่อาศัย',
      billingRemark:'หมายเหตุ',
      billingSend:'การจัดส่ง',
      billingNote:'บันทึก',
      billingPayment:'การจ่ายเงิน',
      customer_type:'ประเภท',
      member_type:'ประเภทสมาชิก',
      credit_term_status:'สถานะ'
    },
    tab: {
      billing_data:'ชื่อและที่อยู่ที่ใช้ในการออกบิล',
      contract_name:'ชื่อผู้ติดต่อ'
    },
    inTable:{
      contactNameInTable:'ชื่อ',
      contactPhoneNoInTable:'เบอร์โทร',
      contactCodeInTableBill:'รหัส',
      defaultBill:'ที่อยู่หลัก'
    },
    button:{
      addContact:'Add/Update'
    },
    customer_type_list:{
      type_person:'บุคคล',
      type_company:'บริษัท'
    },
    newsList:{
      yes:'รับ',
      no:'ไม่รับ',
      AP:'อนุมัติ',
      NAP:'รออนุมัติ'
    },
    prod_group:{
      name:'Group Name'
    },
    prodGroupList:{
      leftList:'Product Code',
      rightList:'In List'
    }
  }
}
