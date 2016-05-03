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

        { type: 'text', x: 0, y: 8, w: 806, h: 22, fontSize: 18, text: 'รายงาน % ลูกหนี้เกินกำหนดชำระ', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 32, w: 806, h: 18, fontSize: 14, text: 'ประจำปี {{due_year}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 55, y: 60, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 80, h: 12, x: 85, y: 60, text: 'สาขา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 130, h: 12, x: 165, y: 60, text: 'พนักงาน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 295, y: 60, text: 'ม.ค.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 330, y: 60, text: 'ก.พ.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 365, y: 60, text: 'มี.ค.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 400, y: 60, text: 'เม.ย.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 435, y: 60, text: 'พ.ค.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 470, y: 60, text: 'มิ.ย.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 505, y: 60, text: 'ก.ค.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 540, y: 60, text: 'ส.ค.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 575, y: 60, text: 'ก.ย.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 610, y: 60, text: 'ต.ค.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 645, y: 60, text: 'พ.ย.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 680, y: 60, text: 'ธ.ค.', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 35, h: 12, x: 715, y: 60, text: 'เฉลี่ย', },
        { type: 'line', x1: 55, x2: 55, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 85, x2: 85, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 165, x2: 165, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 295, x2: 295, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 330, x2: 330, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 365, x2: 365, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 400, x2: 400, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 435, x2: 435, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 470, x2: 470, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 505, x2: 505, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 540, x2: 540, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 575, x2: 575, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 610, x2: 610, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 645, x2: 645, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 680, x2: 680, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 715, x2: 715, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 750, x2: 750, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 55, x2: 750, y1: 56, y2: 56, lineWidth: 1, },
        { type: 'line', x1: 55, x2: 750, y1: 77, y2: 77, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 22, h: 8, x: 59, y: 4, field: 'row', },
        { type: 'text', align: 'left', fontSize: 12, w: 72, h: 8, x: 89, y: 4, field: 'name', },
        { type: 'text', align: 'left', fontSize: 12, w: 122, h: 8, x: 169, y: 4, field: 'display_name', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 299, y: 4, field: '1', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 334, y: 4, field: '2', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 369, y: 4, field: '3', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 404, y: 4, field: '4', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 439, y: 4, field: '5', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 474, y: 4, field: '6', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 509, y: 4, field: '7', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 544, y: 4, field: '8', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 579, y: 4, field: '9', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 614, y: 4, field: '10', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 649, y: 4, field: '11', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 684, y: 4, field: '12', },
        { type: 'money', align: 'center', fontSize: 12, w: 27, h: 8, x: 719, y: 4, field: 'percent', },
        { type: 'line', x1: 55, x2: 55, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 85, x2: 85, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 165, x2: 165, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 295, x2: 295, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 330, x2: 330, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 365, x2: 365, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 400, x2: 400, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 435, x2: 435, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 470, x2: 470, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 505, x2: 505, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 540, x2: 540, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 575, x2: 575, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 610, x2: 610, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 645, x2: 645, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 680, x2: 680, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 715, x2: 715, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 750, x2: 750, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 55, x2: 750, y1: 20, y2: 20, lineWidth: 0.5, style:'dotted' },
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
        { type: 'line', x1: 55, x2: 55, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 85, x2: 85, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 165, x2: 165, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 295, x2: 295, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 330, x2: 330, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 365, x2: 365, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 400, x2: 400, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 435, x2: 435, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 470, x2: 470, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 505, x2: 505, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 540, x2: 540, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 575, x2: 575, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 610, x2: 610, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 645, x2: 645, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 680, x2: 680, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 715, x2: 715, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 55, x2: 750, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 750, x2: 750, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
