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

        { type: 'text', x: 0, y: 8, w: 806, h: 22, fontSize: 18, text: 'รายการหักเงินลูกค้าหนีตามไม่ได้ สาขา {{name}} - {{display_name}}', bold: true, align: 'center' },
        { type: 'text', x: 0, y: 32, w: 806, h: 22, fontSize: 18, text: 'ช่วงวันที่ {{date_from}} ถึง {{date_to}}', bold: true, align: 'center' },
        { type: 'image', x: 0, y: -8, fit:[100, 50], image: './images/logo_siamchai.png' },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 30, h: 12, x: 6, y: 64, text: 'เกิน/วัน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 50, h: 12, x: 36, y: 64, text: 'วันที่ซื้อ', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 50, h: 12, x: 86, y: 64, text: 'จ่ายล่าสุด', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 80, h: 12, x: 136, y: 64, text: 'ชื่อลูกค้า', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 40, h: 12, x: 216, y: 64, text: 'สัญญา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 80, h: 12, x: 256, y: 64, text: 'รายการสินค้า', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 336, y: 64, text: 'ราคาขาย', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 394, y: 64, text: 'ต้นทุน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 452, y: 64, text: 'ทำสัญญา', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 510, y: 64, text: 'ชำระแล้ว', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 568, y: 64, text: 'กำไร', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 626, y: 64, text: 'ขาดทุน', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 684, y: 64, text: 'หัก พนง', },
        { type: 'text', align: 'center', bold: true, fontSize: 13, w: 58, h: 12, x: 742, y: 64, text: 'บริษัท', },
        { type: 'line', x1: 6, x2: 6, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 36, x2: 36, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 86, x2: 86, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 136, x2: 136, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 216, x2: 216, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 256, x2: 256, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 336, x2: 336, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 394, x2: 394, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 452, x2: 452, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 510, x2: 510, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 568, x2: 568, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 626, x2: 626, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 684, x2: 684, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 742, x2: 742, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 800, x2: 800, y1: 60, y2: 81, lineWidth: 0.5, },
        { type: 'line', x1: 6, x2: 800, y1: 60, y2: 60, lineWidth: 1, },
        { type: 'line', x1: 6, x2: 800, y1: 81, y2: 81, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', fontSize: 12, w: 22, h: 8, x: 10, y: 4, field: 'over', },
        { type: 'text', align: 'center', fontSize: 12, w: 42, h: 8, x: 40, y: 4, field: 'sign_date', },
        { type: 'text', align: 'center', fontSize: 12, w: 42, h: 8, x: 90, y: 4, field: 'due_date', },
        { type: 'text', align: 'left', fontSize: 12, w: 72, h: 8, x: 140, y: 4, field: 'cus_name', },
        { type: 'text', align: 'center', fontSize: 12, w: 32, h: 8, x: 220, y: 4, field: 'code', },
        { type: 'text', align: 'left', fontSize: 12, w: 72, h: 8, x: 260, y: 4, field: 'product_detail', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 340, y: 4, field: 'total_price', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 398, y: 4, field: 'cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 456, y: 4, field: 'fee', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 514, y: 4, field: 'total_paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 572, y: 4, field: 'profit', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 630, y: 4, field: 'loss', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 688, y: 4, field: 'ca_staff', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 746, y: 4, field: 'ca_shop', },
        { type: 'line', x1: 6, x2: 6, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 36, x2: 36, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 86, x2: 86, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 136, x2: 136, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 216, x2: 216, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 256, x2: 256, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 336, x2: 336, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 394, x2: 394, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 452, x2: 452, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 510, x2: 510, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 568, x2: 568, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 626, x2: 626, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 684, x2: 684, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 742, x2: 742, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 800, x2: 800, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 6, x2: 800, y1: 20, y2: 20, lineWidth: 0.5, style:'dotted' },
      ]
    }
  ],
  RF: [
    {
      autoShrink: true,
      items: [
{ type:'text', x:580, y:40, w:0, h:0, fontSize:18, bold:true, align:'left', text:'จำนวนเงินที่ต้องหัก' }, 
{ type:'text', x:682, y:40, w:60, h:20, fontSize:18, bold:true, align:'right', field:'sum_total_loss' }, 
{ type: 'line', x1: 582, x2: 771, y1: 60, y2: 60, lineWidth: 0.5 }, 
{ type: 'line', x1: 582, x2: 771, y1: 62, y2: 62, lineWidth: 0.5, style:'dotted' }, 
      ]
    }
  ],
  GF: [
    {
      autoShrink: true,
      items: [

        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 340, y: 2, field: 'group_total_price', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 398, y: 2, field: 'group_cost', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 456, y: 2, field: 'group_fee', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 514, y: 2, field: 'group_total_paid', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 572, y: 2, field: 'group_profit', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 630, y: 2, field: 'group_loss', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 688, y: 2, field: 'group_ca_staff', },
        { type: 'money', align: 'right', fontSize: 12, w: 50, h: 8, x: 746, y: 2, field: 'group_ca_shop', },
        { type: 'text', align: 'right', fontSize: 12, bold: true, w: 108, h: 8, x: 226, y: 2, text: '', },
        { type: 'line', x1: 336, x2: 336, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 394, x2: 394, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 394, x2: 394, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 452, x2: 452, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 452, x2: 452, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 510, x2: 510, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 510, x2: 510, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 568, x2: 568, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 568, x2: 568, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 626, x2: 626, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 626, x2: 626, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 684, x2: 684, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 684, x2: 684, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 742, x2: 742, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 742, x2: 742, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 800, x2: 800, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 800, x2: 800, y1: 0, y2: 20, lineWidth: 0.5, },
        { type: 'line', x1: 336, x2: 800, y1: 18, y2: 18, lineWidth: 0.5 },
        { type: 'line', x1: 336, x2: 800, y1: 20, y2: 20, lineWidth: 0.5 },

        { type:'text', x:550, y:40, w:0, h:0, fontSize:14, bold:true, align:'left', text:'ลายเซ็น' }, 
        { type: 'line', x1: 582, x2: 718, y1: 52, y2: 52, lineWidth: 0.5, style:'dotted' }, 
        { type:'text', x:720, y:40, w:0, h:0, fontSize:14, bold:true, align:'left', text:'อนุมัติ' }, 
        { type:'text', x:590, y:70, w:0, h:0, fontSize:14, bold:true, align:'left', text:'วันที่' }, 
        { type: 'line', x1: 610, x2: 705, y1: 82, y2: 82, lineWidth: 0.5, style:'dotted' }, 
      ]
    }
  ],
  PF: [
    {
      autoShrink: true,
      items: [
        { type: 'line', x1: 6, x2: 6, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 36, x2: 36, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 86, x2: 86, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 136, x2: 136, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 216, x2: 216, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 256, x2: 256, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 336, x2: 336, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 394, x2: 394, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 452, x2: 452, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 510, x2: 510, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 568, x2: 568, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 626, x2: 626, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 684, x2: 684, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 742, x2: 742, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 6, x2: 800, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 800, x2: 800, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
