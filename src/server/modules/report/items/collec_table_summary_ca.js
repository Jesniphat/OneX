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

        { type: 'text', x: 0, y: 8, w: 806, h: 22, fontSize: 18, text: 'สรุปลูกหนี้ปิดบัญชี/ยึดสินค้า/ลูกหนี้ CA ประจำเดือน {{date_month}} ({{status_group}})', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 120, h: 12, x: 293, y: 58, text: 'สินค้า', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 50, h: 12, x: 413, y: 58, text: 'จำนวนตัว', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 50, h: 12, x: 463, y: 58, text: 'เปอเซ็นต์', },
        { type: 'line', x1: 293, x2: 293, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 413, x2: 413, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 463, x2: 463, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 513, x2: 513, y1: 54, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 293, x2: 513, y1: 54, y2: 54, lineWidth: 1, },
        { type: 'line', x1: 293, x2: 513, y1: 75, y2: 75, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'left', fontSize: 12, w: 112, h: 8, x: 297, y: 4, field: 'label', },
        { type: 'number', align: 'right', fontSize: 12, w: 42, h: 8, x: 417, y: 4, field: 'value', },
        { type: 'money', align: 'right', fontSize: 12, w: 42, h: 8, x: 467, y: 4, field: 'percent', },
        { type: 'line', x1: 293, x2: 293, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 413, x2: 413, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 463, x2: 463, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 513, x2: 513, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 293, x2: 513, y1: 20, y2: 20, lineWidth: 0.5, style:'dotted' },
      ]
    }
  ],
  RF: [
    {
      autoShrink: true,
      items: [

      ]
    }
  ],
  PF: [
    {
      autoShrink: true,
      items: [
        { type: 'line', x1: 293, x2: 293, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 413, x2: 413, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 463, x2: 463, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 293, x2: 513, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 513, x2: 513, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
