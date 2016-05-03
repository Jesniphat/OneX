var path = require('path');
var report = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  margin: [18, 18, 18, 18],  imagePath: path.normalize(__dirname),
  pageFooter: true,
  RH: [],
  PH: [
    {
      height: 100,
      autoShrink: true,
      items: [

        { type: 'text', x: 0, y: 8, w: 806, h: 22, fontSize: 18, text: 'สรุปรายการกำไร-ขาดทุน จากการเปลี่ยนทุนสินค้ายึดช่วงวันที่ {{date_from}} ถึง {{date_to}}', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 32, w: 806, h: 16, fontSize: 12, text: 'กำไร = ทุนใหม่ - คงเหลือ - ติดตั้ง - สัญญา', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 3, y: 58, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 55, h: 12, x: 33, y: 58, text: 'วันที่ออก', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 160, h: 12, x: 88, y: 58, text: 'ชื่อไฟแนนซ์', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 100, h: 12, x: 248, y: 58, text: 'สาขา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 348, y: 58, text: 'จำนวน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 383, y: 58, text: 'ทุนใหม่', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 443, y: 58, text: 'ทุนเดิม', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 503, y: 58, text: 'ชำระแล้ว', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 563, y: 58, text: 'คงเหลือ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 623, y: 58, text: 'ติดตั้ง', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 683, y: 58, text: 'สัญญา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 743, y: 58, text: 'กำไร', },
        { type: 'line', x1: 3, x2: 3, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 33, x2: 33, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 88, x2: 88, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 248, x2: 248, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 348, x2: 348, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 383, x2: 383, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 443, x2: 443, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 503, x2: 503, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 563, x2: 563, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 623, x2: 623, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 683, x2: 683, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 743, x2: 743, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 803, x2: 803, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 3, x2: 803, y1: 54, y2: 54, lineWidth: 1, },
        { type: 'line', x1: 3, x2: 803, y1: 75, y2: 75, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 22, h: 8, x: 7, y: 4, field: 'row', },
        { type: 'text', align: 'center', fontSize: 12, w: 47, h: 8, x: 37, y: 4, field: 'sign_date', },
        { type: 'text', align: 'left', fontSize: 12, w: 152, h: 8, x: 92, y: 4, field: 'display_name', },
        { type: 'text', align: 'left', fontSize: 12, w: 92, h: 8, x: 252, y: 4, field: 'name', },
        { type: 'text', align: 'right', fontSize: 12, w: 27, h: 8, x: 352, y: 4, field: 'unit', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 387, y: 4, field: 'new_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 447, y: 4, field: 'cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 507, y: 4, field: 'total_paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 567, y: 4, field: 'balance', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 627, y: 4, field: 'install_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 687, y: 4, field: 'fee', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 747, y: 4, field: 'price', },
        { type: 'line', x1: 3, x2: 3, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 33, x2: 33, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 88, x2: 88, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 248, x2: 248, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 348, x2: 348, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 383, x2: 383, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 443, x2: 443, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 503, x2: 503, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 563, x2: 563, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 623, x2: 623, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 683, x2: 683, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 743, x2: 743, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 803, x2: 803, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 3, x2: 803, y1: 20, y2: 20, lineWidth: 0.5, style:'dotted' },
      ]
    }
  ],
  RF: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'right', fontSize: 12, w: 27, h: 8, x: 352, y: 2, field: 'sum_unit', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 387, y: 2, field: 'sum_new_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 447, y: 2, field: 'sum_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 507, y: 2, field: 'sum_total_paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 567, y: 2, field: 'sum_balance', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 627, y: 2, field: 'sum_install_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 687, y: 2, field: 'sum_fee', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 747, y: 2, field: 'sum_price', },
        { type: 'text', align: 'right', fontSize: 12, bold: true, w: 62, h: 8, x: 284, y: 2, text: 'สรุปยอดรวม', },
        { type: 'line', x1: 348, x2: 348, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 383, x2: 383, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 383, x2: 383, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 443, x2: 443, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 443, x2: 443, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 503, x2: 503, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 503, x2: 503, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 563, x2: 563, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 563, x2: 563, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 623, x2: 623, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 623, x2: 623, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 683, x2: 683, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 683, x2: 683, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 743, x2: 743, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 743, x2: 743, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 803, x2: 803, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 803, x2: 803, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 348, x2: 803, y1: 18, y2: 18, lineWidth: 0.5 },
        { type: 'line', x1: 348, x2: 803, y1: 20, y2: 20, lineWidth: 0.5 },
      ]
    }
  ],
  PF: [
    {
      autoShrink: true,
      items: [
        { type: 'line', x1: 3, x2: 3, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 33, x2: 33, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 88, x2: 88, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 248, x2: 248, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 348, x2: 348, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 383, x2: 383, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 443, x2: 443, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 503, x2: 503, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 563, x2: 563, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 623, x2: 623, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 683, x2: 683, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 743, x2: 743, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 3, x2: 803, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 803, x2: 803, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
