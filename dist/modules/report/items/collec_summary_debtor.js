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

        { type: 'text', x: 0, y: 8, w: 559, h: 21, fontSize: 18, text: 'มูลค่าลูกหนี้คงเหลือ ณ วันที่ {{date_now}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 10, y: 57, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 180, h: 12, x: 40, y: 57, text: 'สาขา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 82, h: 12, x: 220, y: 57, text: 'ทุนขาย', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 82, h: 12, x: 302, y: 57, text: 'ราคาขาย', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 82, h: 12, x: 384, y: 57, text: 'หนี้ค้างจากราคาขาย', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 82, h: 12, x: 466, y: 57, text: 'ทุนคงเหลือ', },
        { type: 'line', x1: 10, x2: 10, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 40, x2: 40, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 220, x2: 220, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 302, x2: 302, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 384, x2: 384, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 466, x2: 466, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 548, x2: 548, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 10, x2: 548, y1: 54, y2: 54, lineWidth: 1, },
        { type: 'line', x1: 10, x2: 548, y1: 73, y2: 73, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 24, h: 9, x: 13, y: 3, field: 'row', },
        { type: 'text', align: 'left', fontSize: 12, w: 174, h: 9, x: 43, y: 3, field: 'name', },
        { type: 'money', align: 'right', fontSize: 12, w: 76, h: 9, x: 223, y: 3, field: 'price', },
        { type: 'money', align: 'right', fontSize: 12, w: 76, h: 9, x: 305, y: 3, field: 'cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 76, h: 9, x: 387, y: 3, field: 'total_paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 76, h: 9, x: 469, y: 3, field: 'balance', },
        { type: 'line', x1: 10, x2: 10, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 40, x2: 40, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 220, x2: 220, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 302, x2: 302, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 384, x2: 384, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 466, x2: 466, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 548, x2: 548, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 10, x2: 548, y1: 18, y2: 18, lineWidth: 0.5, style:'dotted' },
      ]
    }
  ],
  RF: [
    {
      autoShrink: true,
      items: [

        { type: 'money', align: 'right', fontSize: 12, w: 76, h: 9, x: 223, y: 1, field: 'sum_price', },
        { type: 'money', align: 'right', fontSize: 12, w: 76, h: 9, x: 305, y: 1, field: 'sum_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 76, h: 9, x: 387, y: 1, field: 'sum_total_paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 76, h: 9, x: 469, y: 1, field: 'sum_balance', },
        { type: 'text', align: 'right', fontSize: 12, bold: true, w: 158, h: 9, x: 60.5, y: 1, text: 'สรุปยอดรวม', },
        { type: 'line', x1: 220, x2: 220, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 302, x2: 302, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 302, x2: 302, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 384, x2: 384, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 384, x2: 384, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 466, x2: 466, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 466, x2: 466, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 548, x2: 548, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 548, x2: 548, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 220, x2: 548, y1: 16, y2: 16, lineWidth: 0.5 },
        { type: 'line', x1: 220, x2: 548, y1: 18, y2: 18, lineWidth: 0.5 },
      ]
    }
  ],
  PF: [
    {
      autoShrink: true,
      items: [
        { type: 'line', x1: 10, x2: 10, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 40, x2: 40, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 220, x2: 220, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 302, x2: 302, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 384, x2: 384, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 466, x2: 466, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 10, x2: 548, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 548, x2: 548, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
