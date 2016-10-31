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

        { type: 'text', x: 0, y: 8, w: 559, h: 50, fontSize: 10, text: '1000/125 soi sukhumvit 55 (tohnglor), sukhumvit rd., north klongton, wattana, bangkok, 10110 thailand\r\nHotline: +66(0)2 381 5001-6',lineHeight:0.7, bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/Onexlogo.png' },

        { type: 'text', align: 'left', bold: true, fontSize: 9, w: 123, h: 10, x: 13, y: 38, field: 'delivery_no_text', },
        { type: 'text', align: 'left', bold: true, fontSize: 9, w: 100, h: 10, x: 136, y: 38, field: 'delivery_date', },
        { type: 'text', align: 'left', bold: true, fontSize: 9, w: 190, h: 10, x: 236, y: 38, field: 'driver_name', },
        { type: 'text', align: 'left', bold: true, fontSize: 9, w: 126, h: 10, x: 426, y: 38, field: 'license', },
        { type: 'line', x1: 10, x2: 10, y1: 35, y2: 52, lineWidth: 0.5, },
        { type: 'line', x1: 133, x2: 133, y1: 35, y2: 52, lineWidth: 0.5, },
        { type: 'line', x1: 233, x2: 233, y1: 35, y2: 52, lineWidth: 0.5, },
        { type: 'line', x1: 423, x2: 423, y1: 35, y2: 52, lineWidth: 0.5, },
        { type: 'line', x1: 549, x2: 549, y1: 35, y2: 52, lineWidth: 0.5, },
        { type: 'line', x1: 10, x2: 549, y1: 35, y2: 35, lineWidth: 1, },
        { type: 'line', x1: 10, x2: 549, y1: 52, y2: 52, lineWidth: 1, },

        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 23, h: 10, x: 13, y: 58, text: 'No', },
        { type: 'text', align: 'left', bold: true, fontSize: 9, w: 100, h: 10, x: 36, y: 58, text: '  Deliver to:', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 100, h: 10, x: 136, y: 58, text: 'Address', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 100, h: 10, x: 236, y: 58, text: 'Booking details', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 90, h: 10, x: 336, y: 58, text: 'Barcode', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 63, h: 10, x: 426, y: 58, text: 'Sign', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 63, h: 10, x: 492, y: 58, text: 'Receipt time', },
        { type: 'line', x1: 10, x2: 10, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 33, x2: 33, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 133, x2: 133, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 233, x2: 233, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 333, x2: 333, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 423, x2: 423, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 486, x2: 486, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 549, x2: 549, y1: 54, y2: 73, lineWidth: 0.5, },
        { type: 'line', x1: 10, x2: 549, y1: 54, y2: 54, lineWidth: 1, },
        { type: 'line', x1: 10, x2: 549, y1: 73, y2: 73, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'right', fontSize: 8, w: 15, h: 30, lineHeight:0.7, x: 14, y: 0, field: 'no', },
        { type: 'text', align: 'left', fontSize: 8, w: 92, h: 30, lineHeight:0.7, x: 37, y: 0, field: 'delivery_to', },
        { type: 'text', align: 'left', fontSize: 8, w: 92, h: 30, lineHeight:0.7, x: 137, y: 0, field: 'address', },
        { type: 'text', align: 'left', fontSize: 8, w: 92, h: 30, lineHeight:0.7, x: 237, y: 0, field: 'booking_detail', },
        { type: 'barcode', align: 'left', format:'code128', w: 82, h: 18, x: 330, y: 3, field: 'barcode', },
        { type: 'text', align: 'left', fontSize: 6, w: 82, h: 8, lineHeight:0.7, x: 340, y: 21, field: 'barcode', },
        { type: 'text', align: 'left', fontSize: 8, w: 55, h: 30, lineHeight:0.7, x: 427, y: 0, text: '', },
        { type: 'text', align: 'left', fontSize: 8, w: 55, h: 30, lineHeight:0.7, x: 490, y: 0, text: '', },
        { type: 'line', x1: 10, x2: 10, y1: 0, y2: 30, lineWidth: 0.5, },
        { type: 'line', x1: 33, x2: 33, y1: 0, y2: 30, lineWidth: 0.5, },
        { type: 'line', x1: 133, x2: 133, y1: 0, y2: 30, lineWidth: 0.5, },
        { type: 'line', x1: 233, x2: 233, y1: 0, y2: 30, lineWidth: 0.5, },
        { type: 'line', x1: 333, x2: 333, y1: 0, y2: 30, lineWidth: 0.5, },
        { type: 'line', x1: 423, x2: 423, y1: 0, y2: 30, lineWidth: 0.5, },
        { type: 'line', x1: 486, x2: 486, y1: 0, y2: 30, lineWidth: 0.5, },
        { type: 'line', x1: 549, x2: 549, y1: 0, y2: 30, lineWidth: 0.5, },
        { type: 'line', x1: 10, x2: 549, y1: 30, y2: 30, lineWidth: 0.5, },
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
        { type: 'line', x1: 10, x2: 10, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 33, x2: 33, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 133, x2: 133, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 233, x2: 233, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 333, x2: 333, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 423, x2: 423, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 486, x2: 486, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 10, x2: 549, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 549, x2: 549, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
