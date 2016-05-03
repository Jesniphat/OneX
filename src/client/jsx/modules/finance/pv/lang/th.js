module.exports = {
  finance: {
    pv: {
      title: {
        index:'ใบสำคัญจ่าย',
        list:'รายการใบสำคัญจ่าย'
      },
      action: {
        new:'สร้าง'
      },
      list: {
        code:'เลขที่',
        document_date:'วันที่',
        approve_date:'วันที่อนุมัติ',
        total_amount:'ยอดเงิน',
        vat_amount:'VAT',
        cn_code:'C/N',
        cn_amount:'ลดหนี้',
        net_amount:'จ่ายสุทธิ',
        staff:'ผู้ทำรายการ',
        status:'สถานะ',
        status_DRAFT:'ร่าง',
        status_PROPOSE:'เสนออนุมัติ',
        status_APPROVE:'อนุมัติ',
        status_REJECT:'ไม่อนุมัติ',
        status_PAID:'จ่ายแล้ว',
        status_VOID:'ยกเลิก',
        remark:'หมายเหตุ',
        supplier_code:'ผู้จัดจำหน่าย'
      },
      status_not_yet_approve:'รออนุมัติ',
      date_in:'วันที่รับสินค้า',
      invoice_date:'วันที่ใบแจ้งหนี้',
      document_date:'ทำจ่ายวันที่',
      invoice_code:'เลขที่ใบแจ้งหนี้',
      po_code:'เลขที่ PO',
      supplier:'ซื้อจาก',
      product:'สินค้า',
      shop:'สาขา',
      document_date:'วันที่ทำจ่าย',
      paid_status:'สถานะ',
      paid_status_ALL:'ทุกสถานะ',
      paid_status_W:'รอทำจ่าย',
      paid_status_F:'ทำจ่ายแล้ว',
      remark:'หมายเหตุ',
      chk_all:'เลือกทั้งหมด',
      search_table: {
        code:'PO / INV',
        product:'สินค้า',
        serial_barcode:'S/N บาร์โค้ด',
        qty:'จำนวน',
        cost:'ทุนซื้อ',
        select_all:'เลือกทั้งหมด'
      },
      voucher_table: {
        code:'PO / INV',
        product:'สินค้า',
        serial_barcode:'S/N บาร์โค้ด',
        qty:'จำนวน',
        cost:'ทุนซื้อ',
        vat:'VAT',
        select_all:'เอาออกทั้งหมด'
      },
      voucher: {
        code:'เลขที่',
        document_date:'วันที่ทำจ่าย',
        supplier:'ผู้ขาย',
        staff:'การเงิน',
        remark:'หมายเหตุ',
        total_amount:'ยอดรวมก่อน VAT',
        vat_amount:'VAT',
        cn_code:'เลขที่ C/N',
        cn_amount:'C/N',
        net_amount:'ยอดสุทธิ',
        status:'สถานะ',
        status_DRAFT:'ร่าง (DRAFT)',
        status_PROPOSE:'เสนออนุมัติ (PROPOSE)',
        status_APPROVE:'อนุมัติ (APPROVE)',
        status_REJECT:'ไม่อนุมัติ (REJECT)',
        status_PAID:'จ่ายแล้ว (PAID)',
        status_VOID:'ยกเลิก (VOID)'
      }
    }
  }
};
