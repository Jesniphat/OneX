var path = require('path');
var report = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  margin: [18, 18, 18, 18],  imagePath: path.normalize(__dirname),
  RH: [],
  PH: [
    {
      height: 100,
      autoShrink: true,
      items: [

        { type: 'text', x: 0, y: 8, w: 806, h: 24, fontSize: 18, text: 'รายงานเสนอปรับทุนยึดสินค้า สาขา {{branch}} วันที่ {{date_from}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 5, y: 57, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 95, h: 12, x: 35, y: 57, text: 'ชื่อลูกค้า', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 55, h: 12, x: 130, y: 57, text: 'วันที่ออก', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 55, h: 12, x: 185, y: 57, text: 'วันที่ซื้อ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 140, h: 12, x: 240, y: 57, text: 'สินค้า (สภาพ)', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 380, y: 57, text: 'ทุนใหม่', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 440, y: 57, text: 'ทุนเดิม', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 500, y: 57, text: 'ชำระแล้ว', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 560, y: 57, text: 'คงเหลือ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 620, y: 57, text: 'ติดตั้ง', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 680, y: 57, text: 'สัญญา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 740, y: 57, text: 'กำไร', },
        { type: 'line', x1: 5, x2: 5, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 35, x2: 35, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 130, x2: 130, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 185, x2: 185, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 240, x2: 240, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 380, x2: 380, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 440, x2: 440, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 500, x2: 500, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 560, x2: 560, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 620, x2: 620, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 680, x2: 680, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 740, x2: 740, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 800, x2: 800, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 5, x2: 800, y1: 54, y2: 54, lineWidth: 1, },
        { type: 'line', x1: 5, x2: 800, y1: 75, y2: 75, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 24, h: 9, x: 8, y: 3, field: 'row', },
        { type: 'text', align: 'left', fontSize: 12, w: 89, h: 9, x: 38, y: 3, field: 'name', },
        { type: 'text', align: 'center', fontSize: 12, w: 49, h: 9, x: 133, y: 3, field: 'date', },
        { type: 'text', align: 'center', fontSize: 12, w: 49, h: 9, x: 188, y: 3, field: 'date', },
        { type: 'text', align: 'left', fontSize: 12, w: 134, h: 9, x: 243, y: 3, field: 'product', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 383, y: 3, field: 'cost_new', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 443, y: 3, field: 'cost_old', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 503, y: 3, field: 'paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 563, y: 3, field: 'balance', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 623, y: 3, field: 'setup', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 683, y: 3, field: 'promise', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 743, y: 3, field: 'profit', },
        { type: 'line', x1: 5, x2: 5, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 35, x2: 35, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 130, x2: 130, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 185, x2: 185, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 240, x2: 240, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 380, x2: 380, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 440, x2: 440, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 500, x2: 500, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 560, x2: 560, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 620, x2: 620, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 680, x2: 680, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 740, x2: 740, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 800, x2: 800, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 5, x2: 800, y1: 18, y2: 18, lineWidth: 0.5, style:'dotted' },
      ]
    }
  ],
  RF: [
    {
      autoShrink: true,
      items: [

        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 383, y: 4, field: 'sum_cost_new', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 443, y: 4, field: 'sum_cost_old', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 503, y: 4, field: 'sum_paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 563, y: 4, field: 'sum_balance', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 623, y: 4, field: 'sum_setup', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 683, y: 4, field: 'sum_promise', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 743, y: 4, field: 'sum_profit', },
        { type: 'line', x1: 5, x2: 5, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 35, x2: 35, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 130, x2: 130, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 185, x2: 185, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 240, x2: 240, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'text', align: 'right', fontSize: 12, bold: true, w: 114, h: 9, x: 263, y: 4, text: 'สรุปยอดรวม', },
        { type: 'line', x1: 380, x2: 380, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 440, x2: 440, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 440, x2: 440, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 500, x2: 500, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 500, x2: 500, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 560, x2: 560, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 560, x2: 560, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 620, x2: 620, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 620, x2: 620, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 680, x2: 680, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 680, x2: 680, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 740, x2: 740, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 740, x2: 740, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 800, x2: 800, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 5, x2: 800, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 800, x2: 800, y1: 0, y2: 21, lineWidth: 0.5, },
        { type: 'line', x1: 380, x2: 800, y1: 19, y2: 19, lineWidth: 0.5 },
        { type: 'line', x1: 380, x2: 800, y1: 21, y2: 21, lineWidth: 0.5 },
      ]
    }
  ],
  PF: [
    {
      autoShrink: true,
      items: [
      ]
    }
  ],
};
module.exports = report;
