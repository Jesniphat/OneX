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

        { type: 'text', x: 0, y: 8, w: 806, h: 21, fontSize: 18, text: 'รายงานเสนอปรับทุนยึดสินค้า สาขา {{name}}', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 31, w: 806, h: 19, fontSize: 16, text: 'วันที่ {{date_from}} ถึง {{date_to}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 5, y: 59, text: 'ลำดับ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 95, h: 12, x: 35, y: 59, text: 'ชื่อลูกค้า', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 55, h: 12, x: 130, y: 59, text: 'วันที่ซื้อ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 55, h: 12, x: 185, y: 59, text: 'วันที่ยึด', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 140, h: 12, x: 240, y: 59, text: 'สินค้า (สภาพ)', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 380, y: 59, text: 'ทุนใหม่', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 440, y: 59, text: 'ทุนเดิม', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 500, y: 59, text: 'ชำระแล้ว', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 560, y: 59, text: 'คงเหลือ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 620, y: 59, text: 'ติดตั้ง', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 680, y: 59, text: 'สัญญา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 60, h: 12, x: 740, y: 59, text: 'กำไร', },
        { type: 'line', x1: 5, x2: 5, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 35, x2: 35, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 130, x2: 130, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 185, x2: 185, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 240, x2: 240, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 380, x2: 380, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 440, x2: 440, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 500, x2: 500, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 560, x2: 560, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 620, x2: 620, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 680, x2: 680, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 740, x2: 740, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 800, x2: 800, y1: 56, y2: 75, lineWidth: 1, },
        { type: 'line', x1: 5, x2: 800, y1: 56, y2: 56, lineWidth: 1, },
        { type: 'line', x1: 5, x2: 800, y1: 75, y2: 75, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 24, h: 22+9, x: 8, y: 3, field: 'group_row', },
        { type: 'text', align: 'left', fontSize: 12, w: 89, h: 22+9, x: 38, y: 3, field: 'display_name', },
        { type: 'text', align: 'center', fontSize: 12, w: 49, h: 22+9, x: 133, y: 3, field: 'sign_date', },
        { type: 'text', align: 'center', fontSize: 12, w: 49, h: 22+9, x: 188, y: 3, field: 'close_date', },
        { type: 'text', align: 'left', fontSize: 12, w: 134, h: 22+9, x: 243, y: 3, field: 'product_detail', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 22+9, x: 383, y: 3, field: 'new_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 22+9, x: 443, y: 3, field: 'cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 22+9, x: 503, y: 3, field: 'total_paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 22+9, x: 563, y: 3, field: 'balance', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 22+9, x: 623, y: 3, field: 'install_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 22+9, x: 683, y: 3, field: 'fee', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 22+9, x: 743, y: 3, field: 'price', },
        { type: 'line', x1: 5, x2: 5, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 35, x2: 35, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 130, x2: 130, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 185, x2: 185, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 240, x2: 240, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 380, x2: 380, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 440, x2: 440, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 500, x2: 500, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 560, x2: 560, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 620, x2: 620, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 680, x2: 680, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 740, x2: 740, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 800, x2: 800, y1: 0, y2: 17+18, lineWidth: 1, },
        { type: 'line', x1: 5, x2: 800, y1: 17+18, y2: 17+18, lineWidth: 1, style:'solid' },
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

        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 383, y: 1, field: 'group_new_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 443, y: 1, field: 'group_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 503, y: 1, field: 'group_total_paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 563, y: 1, field: 'group_balance', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 623, y: 1, field: 'group_install_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 683, y: 1, field: 'group_fee', },
        { type: 'money', align: 'right', fontSize: 12, w: 54, h: 9, x: 743, y: 1, field: 'group_price', },
        { type: 'text', align: 'right', fontSize: 12, bold: true, w: 114, h: 9, x: 264.5, y: 1, text: 'สรุปยอดรวม', },
        { type: 'line', x1: 380, x2: 380, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 440, x2: 440, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 440, x2: 440, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 500, x2: 500, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 500, x2: 500, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 560, x2: 560, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 560, x2: 560, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 620, x2: 620, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 620, x2: 620, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 680, x2: 680, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 680, x2: 680, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 740, x2: 740, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 740, x2: 740, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 800, x2: 800, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 800, x2: 800, y1: 0, y2: 18, lineWidth: 1, },
        { type: 'line', x1: 380, x2: 800, y1: 16, y2: 16, lineWidth: 1 },
        { type: 'line', x1: 380, x2: 800, y1: 18, y2: 18, lineWidth: 1 },

        { type:'text', x:550, y:40, w:0, h:0, fontSize:14, bold:true, align:'left', text:'ลายเซ็น' },
        { type: 'line', x1: 582, x2: 718, y1: 52, y2: 52, lineWidth: 1, style:'solid' },
        { type:'text', x:720, y:40, w:0, h:0, fontSize:14, bold:true, align:'left', text:'อนุมัติ' },
        { type:'text', x:590, y:70, w:0, h:0, fontSize:14, bold:true, align:'left', text:'วันที่' },
        { type: 'line', x1: 610, x2: 705, y1: 82, y2: 82, lineWidth: 1, style:'solid' },
      ]
    }
  ],
  PF: [
    {
      autoShrink: true,
      items: [
        { type: 'line', x1: 5, x2: 5, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 35, x2: 35, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 130, x2: 130, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 185, x2: 185, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 240, x2: 240, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 380, x2: 380, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 440, x2: 440, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 500, x2: 500, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 560, x2: 560, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 620, x2: 620, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 680, x2: 680, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 740, x2: 740, y1: 0, y2: 2, lineWidth: 1, },
        { type: 'line', x1: 5, x2: 800, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 800, x2: 800, y1: 0, y2: 2, lineWidth: 1, },
      ]
    }
  ],
};
module.exports = report;
