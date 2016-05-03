var path = require('path');
var report = {
  pageSize: 'A3',
  pageOrientation: 'landscape',
  margin: [18, 18, 18, 18],  imagePath: path.normalize(__dirname),
  RH: [],
  PH: [
    {
      height: 100,
      autoShrink: true,
      items: [

        { type: 'text', x: 0, y: 8, w: 806, h: 22, fontSize: 18, text: 'รายงานกำไร-ขาดทุน(สรุปทุกสาขา)', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 32, w: 806, h: 20, fontSize: 16, text: 'เดือน {{date_month}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 250, h: 12, x: 132, y: 60, text: 'ขายสด', },
        { type: 'line', x1: 130, x2: 380, y1: 58, y2: 58, },
        { type: 'line', lineWidth: '0.5', x1: 130, x2: 130, y1: 58, y2: 78, },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 256, h: 12, x: 382, y: 60, text: 'ผ่อนเคลื่อนไหว(เงินได้รับจริง)', },
        { type: 'line', x1: 380, x2: 636, y1: 58, y2: 58, },
        { type: 'line', lineWidth: '0.5', x1: 380, x2: 380, y1: 58, y2: 78, },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 210, h: 12, x: 638, y: 60, text: 'สรุปผ่อนกำไรผ่อน ที่คาดว่าจะได้เดือนนี้(ไม่เอามาคำนวณกำไร)', },
        { type: 'line', x1: 636, x2: 846, y1: 58, y2: 58, },
        { type: 'line', lineWidth: '0.5', x1: 636, x2: 636, y1: 58, y2: 78, },
        { type: 'line', lineWidth: '0.5', x1: 846, x2: 846, y1: 58, y2: 78, },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 0, y: 90, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 100, h: 12, x: 30, y: 90, text: 'สาขา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 110, h: 12, x: 130, y: 90, text: 'ขายสด-สดพิเศษ(เก่า)', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 240, y: 90, text: 'ทุน+ติดตั้ง', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 310, y: 90, text: 'กำไร*', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 380, y: 90, text: 'เงินดาวน์ใหม่', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 438, y: 90, text: 'เงิดงวดใหม่', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 496, y: 90, text: 'ทุนประจำงวด', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 566, y: 90, text: 'กำไรผ่อนร้าน **', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 636, y: 90, text: 'ยอดขายผ่อน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 706, y: 90, text: 'ทุน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 776, y: 90, text: 'กำไร', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 846, y: 90, text: 'รายได้ ***', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 70, h: 12, x: 916, y: 90, text: 'ค่าใช้จ่าย ****', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 100, h: 12, x: 986, y: 82, text: 'กำไรสุทธิ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 100, h: 12, x: 986, y: 98, text: '* + ** + *** - ****', },
        { type: 'line', x1: 0, x2: 0, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 30, x2: 30, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 130, x2: 130, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 240, x2: 240, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 310, x2: 310, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 380, x2: 380, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 438, x2: 438, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 496, x2: 496, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 566, x2: 566, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 636, x2: 636, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 706, x2: 706, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 776, x2: 776, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 846, x2: 846, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 916, x2: 916, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 986, x2: 986, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 1086, x2: 1086, y1: 78, y2: 118, lineWidth: 0.5, },
        { type: 'line', x1: 0, x2: 1086, y1: 78, y2: 78, lineWidth: 1, },
        { type: 'line', x1: 0, x2: 1086, y1: 118, y2: 118, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 22, h: 8, x: 4, y: 4, field: 'row', },
        { type: 'text', align: 'left', fontSize: 12, w: 92, h: 8, x: 34, y: 4, field: 'sh_name', },
        { type: 'money', align: 'right', fontSize: 12, w: 102, h: 8, x: 134, y: 4, field: 'sell_price', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 244, y: 4, field: 'sell_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 314, y: 4, field: 'sumSell', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 384, y: 4, field: 'down_payment', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 442, y: 4, field: 'amount', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 500, y: 4, field: 'cost_term', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 570, y: 4, field: 'profit', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 640, y: 4, field: 'installment_price', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 710, y: 4, field: 'installment_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 780, y: 4, field: 'sumInstallment', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 850, y: 4, field: 'income_price', },
        { type: 'money', align: 'right', fontSize: 12, w: 62, h: 8, x: 920, y: 4, field: 'expense_price', },
        { type: 'money', align: 'right', fontSize: 12, w: 92, h: 8, x: 990, y: 4, field: 'net_profit', },
        { type: 'line', x1: 0, x2: 0, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 30, x2: 30, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 130, x2: 130, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 240, x2: 240, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 310, x2: 310, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 380, x2: 380, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 438, x2: 438, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 496, x2: 496, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 566, x2: 566, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 636, x2: 636, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 706, x2: 706, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 776, x2: 776, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 846, x2: 846, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 916, x2: 916, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 986, x2: 986, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 1086, x2: 1086, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 0, x2: 1086, y1: 20, y2: 20, lineWidth: 0.5, style:'dotted' },
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
        { type: 'line', x1: 0, x2: 0, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 30, x2: 30, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 130, x2: 130, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 240, x2: 240, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 310, x2: 310, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 380, x2: 380, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 438, x2: 438, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 496, x2: 496, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 566, x2: 566, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 636, x2: 636, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 706, x2: 706, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 776, x2: 776, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 846, x2: 846, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 916, x2: 916, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 986, x2: 986, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 0, x2: 1086, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 1086, x2: 1086, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
