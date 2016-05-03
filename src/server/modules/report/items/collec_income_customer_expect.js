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

        { type: 'text', x: 0, y: 8, w: 559, h: 22, fontSize: 18, text: 'สรุปกำไรผ่อนร้านที่คาดว่าจะได้รับ', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 32, w: 559, h: 20, fontSize: 16, text: 'ช่วงวันที่ {{date_from}} ถึง {{date_to}}', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 54, w: 559, h: 20, fontSize: 16, text: 'ประจำเดือน {{date_month}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 54, y: 92, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 150, h: 12, x: 84, y: 92, text: 'สาขา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 234, y: 92, text: 'ดาวน์ + ค้าง', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 304, y: 84, text: 'ทุน+ติดตั้ง+', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 304, y: 100, text: 'ทำสัญญา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 374, y: 92, text: 'กำไร', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 444, y: 92, text: 'จำนวน', },
        { type: 'line', x1: 54, x2: 54, y1: 80, y2: 120, lineWidth: 0.5, },
        { type: 'line', x1: 84, x2: 84, y1: 80, y2: 120, lineWidth: 0.5, },
        { type: 'line', x1: 234, x2: 234, y1: 80, y2: 120, lineWidth: 0.5, },
        { type: 'line', x1: 304, x2: 304, y1: 80, y2: 120, lineWidth: 0.5, },
        { type: 'line', x1: 374, x2: 374, y1: 80, y2: 120, lineWidth: 0.5, },
        { type: 'line', x1: 444, x2: 444, y1: 80, y2: 120, lineWidth: 0.5, },
        { type: 'line', x1: 504, x2: 504, y1: 80, y2: 120, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 504, y1: 80, y2: 80, lineWidth: 1, },
        { type: 'line', x1: 54, x2: 504, y1: 120, y2: 120, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 22, h: 8, x: 58, y: 4, field: 'group_row', },
        { type: 'text', align: 'left', fontSize: 12, w: 142, h: 8, x: 88, y: 4, field: 'name', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 238, y: 4, field: 'total', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 308, y: 4, field: 'cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 378, y: 4, field: 'price', },
        { type: 'number', align: 'right', fontSize: 12, w: 52, h: 8, x: 448, y: 4, field: 'unit', },
        { type: 'line', x1: 54, x2: 54, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 84, x2: 84, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 234, x2: 234, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 304, x2: 304, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 374, x2: 374, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 444, x2: 444, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 504, x2: 504, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 504, y1: 20, y2: 20, lineWidth: 0.5, style:'dotted' },
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
  GF: [
    {
      autoShrink: true,
      items: [

        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 238, y: 2, field: 'group_total', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 308, y: 2, field: 'group_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 378, y: 2, field: 'group_price', },
        { type: 'number', align: 'right', fontSize: 12, w: 52, h: 8, x: 448, y: 2, field: 'group_unit', },
        { type: 'text', align: 'right', fontSize: 12, bold: true, w: 132, h: 8, x: 100, y: 2, text: '', },
        { type: 'line', x1: 234, x2: 234, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 304, x2: 304, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 304, x2: 304, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 374, x2: 374, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 374, x2: 374, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 444, x2: 444, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 444, x2: 444, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 504, x2: 504, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 504, x2: 504, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 234, x2: 504, y1: 18, y2: 18, lineWidth: 0.5 },
        { type: 'line', x1: 234, x2: 504, y1: 20, y2: 20, lineWidth: 0.5 },

      ]
    }
  ],
  PF: [
    {
      autoShrink: true,
      items: [
        { type: 'line', x1: 54, x2: 54, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 84, x2: 84, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 234, x2: 234, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 304, x2: 304, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 374, x2: 374, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 444, x2: 444, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 504, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 504, x2: 504, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
