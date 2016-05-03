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

        { type: 'text', x: 0, y: 8, w: 559, h: 22, fontSize: 18, text: 'สรุปรายรับลูกค้าผ่อนร้าน', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 32, w: 559, h: 20, fontSize: 16, text: 'ช่วงวันที่ {{date_from}} ถึง {{date_to}}', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 54, w: 559, h: 20, fontSize: 16, text: 'ประจำเดือน {{date_month}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 0, y: 84, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 100, h: 12, x: 30, y: 84, text: 'สาขา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 130, y: 84, text: 'ชำระค่างวด', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 190, y: 84, text: 'รับเงินดาวน์', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 250, y: 84, text: 'รายรับรวม', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 310, y: 84, text: 'ยอดจัด', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 370, y: 84, text: 'ดาวน์+ยอดจัด', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 50, h: 12, x: 430, y: 84, text: 'จำนวนขาย', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 80, h: 12, x: 480, y: 84, text: 'หมายเหตุ', },
        { type: 'line', x1: 0, x2: 0, y1: 80, y2: 101, lineWidth: 0.5, },
        { type: 'line', x1: 30, x2: 30, y1: 80, y2: 101, lineWidth: 0.5, },
        { type: 'line', x1: 130, x2: 130, y1: 80, y2: 101, lineWidth: 0.5, },
        { type: 'line', x1: 190, x2: 190, y1: 80, y2: 101, lineWidth: 0.5, },
        { type: 'line', x1: 250, x2: 250, y1: 80, y2: 101, lineWidth: 0.5, },
        { type: 'line', x1: 310, x2: 310, y1: 80, y2: 101, lineWidth: 0.5, },
        { type: 'line', x1: 370, x2: 370, y1: 80, y2: 101, lineWidth: 0.5, },
        { type: 'line', x1: 430, x2: 430, y1: 80, y2: 101, lineWidth: 0.5, },
        { type: 'line', x1: 480, x2: 480, y1: 80, y2: 101, lineWidth: 0.5, },
        { type: 'line', x1: 560, x2: 560, y1: 80, y2: 101, lineWidth: 0.5, },
        { type: 'line', x1: 0, x2: 560, y1: 80, y2: 80, lineWidth: 1, },
        { type: 'line', x1: 0, x2: 560, y1: 101, y2: 101, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 22, h: 8, x: 4, y: 4, field: 'group_row', },
        { type: 'text', align: 'left', fontSize: 12, w: 92, h: 8, x: 34, y: 4, field: 'name', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 134, y: 4, field: 'payment_per_month', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 194, y: 4, field: 'down_payment', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 254, y: 4, field: 'balance', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 314, y: 4, field: 'total_paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 374, y: 4, field: 'payment_price', },
        { type: 'number', align: 'right', fontSize: 12, w: 42, h: 8, x: 434, y: 4, field: 'unit', },
        { type: 'text', align: 'left', fontSize: 12, w: 72, h: 8, x: 484, y: 4, field: 'remark', },
        { type: 'line', x1: 0, x2: 0, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 30, x2: 30, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 130, x2: 130, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 190, x2: 190, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 250, x2: 250, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 310, x2: 310, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 370, x2: 370, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 430, x2: 430, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 480, x2: 480, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 560, x2: 560, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 0, x2: 560, y1: 20, y2: 20, lineWidth: 0.5, style:'dotted' },
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

        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 134, y: 2, field: 'group_payment_per_month', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 194, y: 2, field: 'group_down_payment', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 254, y: 2, field: 'group_balance', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 314, y: 2, field: 'group_total_paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 52, h: 8, x: 374, y: 2, field: 'group_payment_price', },
        { type: 'number', align: 'right', fontSize: 12, w: 42, h: 8, x: 434, y: 2, field: 'group_unit', },
        { type: 'text', align: 'right', fontSize: 12, bold: true, w: 112, h: 8, x: 16, y: 2, text: '', },
        { type: 'line', x1: 130, x2: 130, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 190, x2: 190, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 190, x2: 190, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 250, x2: 250, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 250, x2: 250, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 310, x2: 310, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 310, x2: 310, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 370, x2: 370, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 370, x2: 370, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 430, x2: 430, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 430, x2: 430, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 480, x2: 480, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 560, x2: 560, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 130, x2: 560, y1: 18, y2: 18, lineWidth: 0.5 },
        { type: 'line', x1: 130, x2: 560, y1: 20, y2: 20, lineWidth: 0.5 },

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
        { type: 'line', x1: 190, x2: 190, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 250, x2: 250, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 310, x2: 310, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 370, x2: 370, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 430, x2: 430, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 480, x2: 480, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 0, x2: 560, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 560, x2: 560, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
