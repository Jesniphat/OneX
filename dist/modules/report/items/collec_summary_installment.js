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

        { type: 'text', x: 0, y: 8, w: 559, h: 21, fontSize: 18, text: 'สรุปมูลค่าและต้นทุนผ่อนคงเหลือ', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 31, w: 559, h: 19, fontSize: 16, text: 'รายการขาย ประจำปี {{year}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 54, y: 59, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 160, h: 12, x: 84, y: 59, text: 'สาขา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 80, h: 12, x: 244, y: 59, text: 'มูลค่าคงเหลือ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 80, h: 12, x: 324, y: 59, text: 'ต้นทุนคงเหลือ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 100, h: 12, x: 404, y: 59, text: 'หมายเหตุ', },
        { type: 'line', x1: 54, x2: 54, y1: 56, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 84, x2: 84, y1: 56, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 244, x2: 244, y1: 56, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 324, x2: 324, y1: 56, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 404, x2: 404, y1: 56, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 504, x2: 504, y1: 56, y2: 75, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 504, y1: 56, y2: 56, lineWidth: 1, },
        { type: 'line', x1: 54, x2: 504, y1: 75, y2: 75, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 24, h: 9, x: 57, y: 3, field: 'group_row', },
        { type: 'text', align: 'left', fontSize: 12, w: 154, h: 9, x: 87, y: 3, field: 'name', },
        { type: 'money', align: 'right', fontSize: 12, w: 74, h: 9, x: 247, y: 3, field: 'price', },
        { type: 'money', align: 'right', fontSize: 12, w: 74, h: 9, x: 327, y: 3, field: 'cost', },
        { type: 'text', align: 'left', fontSize: 12, w: 94, h: 9, x: 407, y: 3, field: 'remark', },
        { type: 'line', x1: 54, x2: 54, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 84, x2: 84, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 244, x2: 244, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 324, x2: 324, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 404, x2: 404, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 504, x2: 504, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 504, y1: 18, y2: 18, lineWidth: 0.5, style:'dotted' },
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

        { type: 'money', align: 'right', fontSize: 12, w: 74, h: 9, x: 247, y: 1, field: 'group_price', },
        { type: 'money', align: 'right', fontSize: 12, w: 74, h: 9, x: 327, y: 1, field: 'group_cost', },
        { type: 'text', align: 'right', fontSize: 12, bold: true, w: 154, h: 9, x: 88.5, y: 1, text: '', },
        { type: 'line', x1: 244, x2: 244, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 324, x2: 324, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 324, x2: 324, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 404, x2: 404, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 504, x2: 504, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 244, x2: 504, y1: 16, y2: 16, lineWidth: 0.5 },
        { type: 'line', x1: 244, x2: 504, y1: 18, y2: 18, lineWidth: 0.5 },

      ]
    }
  ],
  PF: [
    {
      autoShrink: true,
      items: [
        { type: 'line', x1: 54, x2: 54, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 84, x2: 84, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 244, x2: 244, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 324, x2: 324, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 404, x2: 404, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 504, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 504, x2: 504, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
