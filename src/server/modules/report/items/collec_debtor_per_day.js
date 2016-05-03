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

        { type: 'text', x: 0, y: 8, w: 559, h: 22, fontSize: 18, text: 'รายงาน % ลูกหนี้เกินกำหนด{{day_over}}', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 32, w: 559, h: 18, fontSize: 14, text: 'เดือน {{date_month}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 24, y: 60, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 100, h: 12, x: 54, y: 60, text: 'สาขา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 130, h: 12, x: 154, y: 60, text: 'พนักงาน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 284, y: 60, text: 'สัญญาทั้งหมด', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 344, y: 60, text: 'สัญญาที่เกิน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 50, h: 12, x: 404, y: 60, text: 'คิดเป็น %', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 80, h: 12, x: 454, y: 60, text: 'หมายเหตุ', },
        { type: 'line', x1: 24, x2: 24, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 54, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 154, x2: 154, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 284, x2: 284, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 344, x2: 344, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 404, x2: 404, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 454, x2: 454, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 534, x2: 534, y1: 56, y2: 77, lineWidth: 0.5, },
        { type: 'line', x1: 24, x2: 534, y1: 56, y2: 56, lineWidth: 1, },
        { type: 'line', x1: 24, x2: 534, y1: 77, y2: 77, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 22, h: 8, x: 28, y: 4, field: 'row', },
        { type: 'text', align: 'left', fontSize: 12, w: 92, h: 8, x: 58, y: 4, field: 'name', },
        { type: 'text', align: 'left', fontSize: 12, w: 122, h: 8, x: 158, y: 4, field: 'display_name', },
        { type: 'number', align: 'right', fontSize: 12, w: 52, h: 8, x: 288, y: 4, field: 'ca_all', },
        { type: 'number', align: 'right', fontSize: 12, w: 52, h: 8, x: 348, y: 4, field: 'ca_over', },
        { type: 'money', align: 'right', fontSize: 12, w: 42, h: 8, x: 408, y: 4, field: 'percent', },
        { type: 'text', align: 'left', fontSize: 12, w: 72, h: 8, x: 458, y: 4, field: 'remark', },
        { type: 'line', x1: 24, x2: 24, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 54, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 154, x2: 154, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 284, x2: 284, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 344, x2: 344, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 404, x2: 404, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 454, x2: 454, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 534, x2: 534, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 24, x2: 534, y1: 20, y2: 20, lineWidth: 0.5, style:'dotted' },
      ]
    }
  ],
  RF: [
    {
      autoShrink: true,
      items: [

        { type: 'number', align: 'right', fontSize: 12, w: 52, h: 8, x: 288, y: 2, field: 'sum_ca_all', },
        { type: 'number', align: 'right', fontSize: 12, w: 52, h: 8, x: 348, y: 2, field: 'sum_ca_over', },
        { type: 'money', align: 'right', fontSize: 12, w: 42, h: 8, x: 408, y: 2, field: 'sum_percent', },
        { type: 'text', align: 'right', fontSize: 12, bold: true, w: 112, h: 8, x: 170, y: 2, text: '', },
        { type: 'line', x1: 284, x2: 284, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 344, x2: 344, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 344, x2: 344, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 404, x2: 404, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 404, x2: 404, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 454, x2: 454, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 534, x2: 534, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 284, x2: 534, y1: 18, y2: 18, lineWidth: 0.5 },
        { type: 'line', x1: 284, x2: 534, y1: 20, y2: 20, lineWidth: 0.5 },
      ]
    }
  ],
  PF: [
    {
      autoShrink: true,
      items: [
        { type: 'line', x1: 24, x2: 24, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 54, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 154, x2: 154, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 284, x2: 284, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 344, x2: 344, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 404, x2: 404, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 454, x2: 454, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 24, x2: 534, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 534, x2: 534, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
