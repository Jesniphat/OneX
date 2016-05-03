module.exports = {
  finance: {
    payment_voucher: {
      title: {
        index:'รับวางบิล'
      },
      date_in:'วันที่รับสินค้า',
      invoice_date:'วันที่ใบแจ้งหนี้',
      paid_date:'ทำจ่ายวันที่',
      invoice_code:'เลขที่ใบแจ้งหนี้',
      po_code:'เลขที่ PO',
      supplier:'ซื้อจาก',
      paid_date:'วันที่ทำจ่าย',
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
        paid_date:'วันที่จ่าย',
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
        status_ACCEPT:'อนุมัติ (ACCEPT)',
        status_REJECT:'ไม่อนุมัติ (REJECT)',
        status_PAID:'จ่ายแล้ว (PAID)',
        status_VOID:'ยกเลิก (VOID)'
      }
    }
  }
};
