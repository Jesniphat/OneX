var path = require('path');
var report = {
  pageSize: 'A4',
  pageOrientation: 'portrait',
  margin: [18, 18, 18, 18],  imagePath: path.normalize(__dirname),
  pageFooter: true,
  RH: [],
  PH: [
    {
      height: 100,
      autoShrink: true,
      items: [

        { type: 'text', x: 0, y: 8, w: 559, h: 22, fontSize: 18, text: 'รายการหักเงินลูกค้าหนีตามไม่ได้', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 32, w: 559, h: 20, fontSize: 16, text: 'ช่วงวันที่ {{date_from}} ถึง {{date_to}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 1, y: 70, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 50, h: 12, x: 31, y: 70, text: 'วันที่ออก CA', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 110, h: 12, x: 81, y: 70, text: 'พนักงาน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 191, y: 70, text: 'สาขา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 40, h: 12, x: 261, y: 62, text: 'จำนวน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 40, h: 12, x: 261, y: 78, text: 'ลูกหนี้', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 301, y: 70, text: 'กำไร', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 359, y: 70, text: 'ขาดทุน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 417, y: 70, text: 'หักสยามชัย', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 487, y: 70, text: 'หักพนักงาน', },
        { type: 'line', x1: 1, x2: 1, y1: 58, y2: 98, lineWidth: 0.5, },
        { type: 'line', x1: 31, x2: 31, y1: 58, y2: 98, lineWidth: 0.5, },
        { type: 'line', x1: 81, x2: 81, y1: 58, y2: 98, lineWidth: 0.5, },
        { type: 'line', x1: 191, x2: 191, y1: 58, y2: 98, lineWidth: 0.5, },
        { type: 'line', x1: 261, x2: 261, y1: 58, y2: 98, lineWidth: 0.5, },
        { type: 'line', x1: 301, x2: 301, y1: 58, y2: 98, lineWidth: 0.5, },
        { type: 'line', x1: 359, x2: 359, y1: 58, y2: 98, lineWidth: 0.5, },
        { type: 'line', x1: 417, x2: 417, y1: 58, y2: 98, lineWidth: 0.5, },
        { type: 'line', x1: 487, x2: 487, y1: 58, y2: 98, lineWidth: 0.5, },
        { type: 'line', x1: 557, x2: 557, y1: 58, y2: 98, lineWidth: 0.5, },
        { type: 'line', x1: 1, x2: 557, y1: 58, y2: 58, lineWidth: 1, },
        { type: 'line', x1: 1, x2: 557, y1: 98, y2: 98, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 22, h: 8, x: 5, y: 4, field: 'row', },
        { type: 'text', align: 'center', fontSize: 12, w: 42, h: 8, x: 35, y: 4, field: 'sign_date', },
        { type: 'text', align: 'left', fontSize: 12, w: 102, h: 8, x: 85, y: 4, field: 'display_name', },
        { type: 'text', align: 'left', fontSize: 12, w: 62, h: 8, x: 195, y: 4, field: 'name', },
        { type: 'text', align: 'right', fontSize: 12, w: 32, h: 8, x: 265, y: 4, field: 'unit', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 305, y: 4, field: 'profit', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 363, y: 4, field: 'loss', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 421, y: 4, field: 'ca_shop', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 491, y: 4, field: 'ca_staff', },
        { type: 'line', x1: 1, x2: 1, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 31, x2: 31, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 81, x2: 81, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 191, x2: 191, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 261, x2: 261, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 301, x2: 301, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 359, x2: 359, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 417, x2: 417, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 487, x2: 487, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 557, x2: 557, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 1, x2: 557, y1: 20, y2: 20, lineWidth: 0.5, style:'dotted' },
      ]
    }
  ],
  RF: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'right', fontSize: 12, w: 32, h: 8, x: 265, y: 2, field: 'sum_unit', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 305, y: 2, field: 'sum_profit', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 363, y: 2, field: 'sum_loss', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 421, y: 2, field: 'sum_ca_shop', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 491, y: 2, field: 'sum_ca_staff', },
        { type: 'text', align: 'right', fontSize: 12, bold: true, w: 72, h: 8, x: 187, y: 2, text: 'สรุปยอด', },
        { type: 'line', x1: 261, x2: 261, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 301, x2: 301, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 301, x2: 301, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 359, x2: 359, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 359, x2: 359, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 417, x2: 417, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 417, x2: 417, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 487, x2: 487, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 487, x2: 487, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 557, x2: 557, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 557, x2: 557, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 261, x2: 557, y1: 18, y2: 18, lineWidth: 0.5 },
        { type: 'line', x1: 261, x2: 557, y1: 20, y2: 20, lineWidth: 0.5 },
      ]
    }
  ],
  PF: [
    {
      autoShrink: true,
      items: [
        { type: 'line', x1: 1, x2: 1, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 31, x2: 31, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 81, x2: 81, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 191, x2: 191, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 261, x2: 261, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 301, x2: 301, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 359, x2: 359, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 417, x2: 417, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 487, x2: 487, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 1, x2: 557, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 557, x2: 557, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
