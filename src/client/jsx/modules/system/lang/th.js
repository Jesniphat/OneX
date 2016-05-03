module.exports = {
  counterpart: {
    names: {
      __locale: "th",
      days: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'],
      abbreviated_days: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
      months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      abbreviated_months: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
      am: 'AM',
      pm: 'PM'
    },
//    pluralize: require('pluralizers/de'),

    formats: {
      date: {
        'default':  '%e %b %Q',
        long:       '%e %B %Q',
//        short:      '%d %m %q',
        short:      '%e %b %q',
        monthYear: '%b %Q'
      },

      time: {
        'default':  '%H:%M Uhr',
        long:       '%H:%M:%S %z',
        short:      '%H:%M'
      },

      datetime: {
        'default':  '%a, %e. %b %Y, %H:%M Uhr',
        long:       '%A, %e. %B %Y, %H:%M:%S %z',
        short:      '%d %b %q %H:%M'
      }
    }
  },
  status: {
    ready: 'พร้อม',
    loading: 'กำลังโหลด...',
    error: 'เกิดข้อผิดพลาด!',
    idcard: {
      ready: 'เครื่องอ่านบัตร: พร้อม',
      reading: 'เครื่องอ่านบัตร: กำลังอ่านข้อมูลบัตร',
      error: 'เครื่องอ่านบัตร: อ่านบัตรไม่สำเร็จ',
      noreader: 'ไม่พบเครื่องอ่านบัตร'
    }
  },
  actions: 'คำสั่ง',
  action: {
    edit: 'แก้ไข',
    delete: 'ลบ',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    print: 'พิมพ์',
    preview: 'ดูก่อนพิมพ์',
    signout:'ออกจากระบบ',
    help:'วิธีใช้งานระบบ',
    search:'ค้นหา',
    clearSearch:'เริ่มใหม่',
    select:'เลือก',
    confirm:'ยืนยัน',
    exportToExcel:'ดาวน์โหลดไฟล์ Excel',
    void:'ยกเลิกรายการ'
  },
  row: {
    created_at:'สร้างเมื่อ',
    updated_at:'แก้ไขเมื่อ',
    created_by:'สร้างโดย',
    updated_by:'แก้ไขโดย'
  },
  dialog: {
    title: {
      session_timeout: 'ขาดการติดต่อนานเกินไป',
      confirm_to_exit:'ยืนยันการออกจากระบบ',
      confirm_to_signout:'ยืนยันการออก'
    },
    confirm:'ยืนยัน',
    ok:'ตกลง',
    cancel:'ยกเลิก'
  },
  result: {
    save_done: 'บันทึกข้อมูลเรียบร้อยแล้ว',
    delete_done: 'ลบข้อมูลเรียบร้อยแล้ว'
  },
  page: {
    pageNumber: 'หน้าที่',
    rowNumber: 'แถวที่',
    perPage: 'แสดงครั้งละ',
    rows: 'แถว'
  },
  user: {
    changePass:'เปลี่ยนรหัสผ่าน'
  },
  person: {
    prename:'คำนำหน้า',
    firstname:'ชื่อ',
    lastname:'นามสกุล',
    fullname:'ชื่อ-นามสกุล',
    nationid:'บัตรประชาชน',
    passport:'Passport',
    nation:'สัญชาติ',
    gender:'เพศ',
    marital_status:'สถานะสมรส',
    email:'อีเมล',
    lineid:'ไอดีไลน์',
    birth:'วันเกิด',
    gender_M:'ชาย',
    gender_F:'หญิง',
    gender_NA:'ไม่ระบุ',
    marital_status_SINGLE:'โสด',
    marital_status_MARRIED:'สมรส',
    marital_status_NA:'ไม่ระบุ'
  },
  system: {
    printer: {
      laser_printer: 'เครื่องพิมพ์เลเซอร์',
      dot_printer:'เครื่องพิมพ์หัวเข็ม',
      url:'URL',
      select_a_printer:'เลือก',
      list_printer:'แสดงเครื่องพิมพ์'
    }
  }
}
