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

        { type: 'text', x: 0, y: 8, w: 559, h: 22, fontSize: 18, text: 'รายงาน % ลูกหนี้เกินกำหนดชำระ', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 32, w: 559, h: 18, fontSize: 14, text: 'เดือน {{date_month}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 19, y: 60, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 49, y: 60, text: 'สาขา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 170, h: 12, x: 109, y: 60, text: 'พนักงาน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 279, y: 60, text: 'ทั้งหมด', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 339, y: 60, text: 'เกิน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 399, y: 60, text: 'คิดเป็น %', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 80, h: 12, x: 459, y: 60, text: 'หมายเหตุ', },
        { type: 'line', x1: 19, x2: 19, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 49, x2: 49, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 109, x2: 109, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 279, x2: 279, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 339, x2: 339, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 399, x2: 399, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 459, x2: 459, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 539, x2: 539, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 19, x2: 539, y1: 56, y2: 56, lineWidth: 1, },
        { type: 'line', x1: 19, x2: 539, y1: 77, y2: 77, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 22, h: 8, x: 23, y: 4, field: 'row', },
        { type: 'text', align: 'left', fontSize: 12, w: 52, h: 8, x: 53, y: 4, field: 'name', },
        { type: 'money', align: 'right', fontSize: 12, w: 162, h: 8, x: 113, y: 4, field: 'display_name', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 283, y: 4, field: 'ca_all', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 343, y: 4, field: 'ca_over', },
        { type: 'money', align: 'center', fontSize: 12, w: 52, h: 8, x: 403, y: 4, field: 'right', },
        { type: 'money', align: 'left', fontSize: 12, w: 72, h: 8, x: 463, y: 4, field: 'remark', },
        { type: 'line', x1: 19, x2: 19, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 49, x2: 49, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 109, x2: 109, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 279, x2: 279, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 339, x2: 339, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 399, x2: 399, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 459, x2: 459, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 539, x2: 539, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 19, x2: 539, y1: 20, y2: 20, lineWidth: 0.5, style:'dotted' },
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
        { type: 'line', x1: 19, x2: 19, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 49, x2: 49, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 109, x2: 109, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 279, x2: 279, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 339, x2: 339, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 399, x2: 399, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 459, x2: 459, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 19, x2: 539, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 539, x2: 539, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
