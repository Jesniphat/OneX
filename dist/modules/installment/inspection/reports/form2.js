var path = require('path');

var report = {
  pageSize: 'A4',
  pageOrientation: 'portrait',
  margin: [36, 18, 18, 72], // top, right, bottom, left
  imagePath: path.normalize(__dirname),
  debug:false,
  RH: [],
  PH: [],
  DT: [
    {
      height: 100,
      autoShrink:false,
      items: [
        {
          type:'text',
          x:0, y:0, w:450, h:24,
          text:'บริษัท สยามชัยเซอร์วิส จำกัด',
          fontSize:18,
          bold:true,
          align:'center'
        },
        {
          type:'text',
          x:0, y:24, w:450, h:24,
          text:'11,9 ซ.รังสิต-ปทุมธานี 3 ต.ประชาธิปัตย์ อ. ธัญบุรี จ. ปทุมธานี 12130',
          fontSize:18,
          align:'center'
        },
        {
          type:'text',
          x:0, y:48, w:450, h:24,
          text:'โทร.02-959-4200-1 แฟ็กซ์. 02-531-6336, 02-929-4202',
          fontSize:18,
          align:'center'
        },
        {
          type:'line',
          x1:0, y1:72, x2:450, y2:72
        },
        {
          type:'text',
          x:0, y:90, w:450, h:24,
          text:'หนังสือยินยอมชดใช้',
          fontSize:18,
          bold:true,
          align:'center'
        },
        {
          type:'text',
          x:0, y:138, w:450, h:24,
          text:'(กรณีผู้ซื้อทำสัญญาผิดสัญญาการผ่อนซื้อสินค้า)',
          fontSize:18,
          bold:true,
          align:'center'
        },
        {
          type:'text',
          x:36, y:186, w:36, h:21,
          text:'ข้าพเจ้า',
          fontSize:16
        },
        {
          type:'text',
          x:72, y:186, w:216, h:21,
          field:'fullname',
          fontSize:16,
          bold:true,
          align:'center'
        },
        {
          type:'line',
          x1:72,y1:204,x2:288,y2:204,
          style:'dotted'
        },
        {
          type:'text',
          x:288, y:186, w:144, h:21,
          text:'ยินยอมชดใช้เมื่อทำผิดสัญญาไว้',
          fontSize:16
        },
        {
          type:'text',
          x:0, y:207, w:36, h:21,
          text:'ณ สาขา',
          fontSize:16
        },
        {
          type:'text',
          x:36, y:207, w:108, h:21,
          field:'shop_name',
          fontSize:16,
          bold:true,
          align:'center'
        },
        {
          type:'line',
          x1:36,y1:225,x2:144,y2:225,
          style:'dotted'
        },
        {
          type:'text',
          x:144, y:207, w:54, h:21,
          text:'เลขที่สัญญา',
          fontSize:16
        },
        {
          type:'text',
          x:198, y:207, w:108, h:21,
          field:'code',
          fontSize:16,
          bold:true,
          align:'center'
        },
        {
          type:'line',
          x1:198,y1:225,x2:306,y2:225,
          style:'dotted'
        },
        {
          type:'text',
          x:306, y:207, w:144, h:21,
          text:'ดังมีรายละเอียดดังต่อไปนี้',
          fontSize:16
        },
        {
          type:'text',
          x:0, y:240, w:36, h:21,
          text:'1.1',
          fontSize:16
        },
        {
          type:'text',
          x:36, y:240, w:414, h:63,
          text:'เมื่อมีการผิดการชำระเงิน งวดที่........เกิน 7 วัน นับจากวันที่ผู้ซื้อนัดชำระเงิน แล้วผู้ซื้อไม่มีการติด ต่อกับทางร้าน โดยยินดีให้ยกสินค้ากลับและไม่ฟ้องบุกรุก พร้อมเบี้ยปรับเป็นจำนวนเงิน 500 บาท (ห้าร้อยบาทถ้วน)',
          fontSize:16,
          align:'justify'
        },
        {
          type:'text',
          x:0, y:309, w:36, h:21,
          text:'1.2',
          fontSize:16
        },
        {
          type:'text',
          x:36, y:309, w:414, h:42,
          text:'เมื่อมีการส่งสินค้าไปตามที่ผู้ซื้อได้ทำการระบุในสัญญา แต่มีการโยกย้ายเคลื่อนที่สินค้าโดยไม่แจ้งให้ ทางร้านทราบ โดยทางบริษัทฯ จะถือว่าผู้ซื้อทำการยักยอกทรัพย์ของทางบริษัทฯ',
          fontSize:16,
          align:'justify'
        },
        {
          type:'text',
          x:0, y:357, w:36, h:21,
          text:'1.3',
          fontSize:16
        },
        {
          type:'text',
          x:36, y:357, w:414, h:42,
          text:'เมื่อผิดนัดการชำระเงินตามที่ได้ระบุไว้ในสัญญา เกิน 5 วัน ผู้ซื้อยินยอมให้บริษัทฯ ปรับค่าล่าช้าเป็น จำนวนเงิน 50 บาท (ห้าสิบบาทถ้วน) ต่อการทวงถาม',
          fontSize:16,
          align:'justify'
        },
        {
          type:'text',
          x:0, y:405, w:36, h:21,
          text:'1.4',
          fontSize:16
        },
        {
          type:'text',
          x:36, y:405, w:414, h:63,
          text:'กรณีที่มีการส่งเจ้าหน้าที่ไปดำเนินการติดต่อตามทวงถามลูกค้า ผู้ซื้อจะต้องชดใช้ค่าใช้จ่ายในการติด ตามอันประกอบไปด้วยค่าทวงถาม, ค่ารถ(คิดตามระยะทาง), ค่าเสียเวลา ซึงทางบริษัทฯจะทำการ คำนวณให้ผู้ซื้อทราบ และผู้ซื้อจะต้องเป็นผู้จ่ายค่าใช้จ่ายที่เกิดขึ้นทั้งหมด',
          fontSize:16,
          align:'justify'
        },
        {
          type:'text',
          x:0, y:474, w:36, h:21,
          text:'1.5',
          fontSize:16
        },
        {
          type:'text',
          x:36, y:474, w:414, h:42,
          text:'เมื่อผู้ซื้อผิดนัด หรือผิดสัญญา ผู้ค้ำยินยอมที่จะชดใช้หนี้สินในส่วนที่ผู้ซื้อได้ทำการซื้อสินค้าในส่วนที่ ค้างจ่ายพร้อมเบี้ยปรับที่เกิดขึ้นทั้งหมด',
          fontSize:16,
          align:'justify'
        },
        {
          type:'text',
          x:0, y:522, w:36, h:21,
          text:'1.6',
          fontSize:16
        },
        {
          type:'text',
          x:36, y:522, w:414, h:42,
          text:'เมื่อผู้ค้ำประกันไม่สามารถจ่ายส่วนที่ผู้ซื้อต้องชำระได้ ผู้ค้ำประกันจะต้องรับผิดชอบในส่วนที่ขาด ชำระและเบี้ยปรับที่เกิดขึ้นทั้งหมด',
          fontSize:16,
          align:'justify'
        },
        {
          type:'text',
          x:36, y:585, w:36, h:21,
          text:'ข้าพเจ้า',
          fontSize:16
        },
        {
          type:'text',
          x:72, y:585, w:216, h:21,
          field:'fullname',
          fontSize:16,
          bold:true,
          align:'center'
        },
        {
          type:'line',
          x1:72,y1:603,x2:288,y2:603,
          style:'dotted'
        },
        {
          type:'text',
          x:288, y:585, w:162, h:21,
          text:'ผู้ซื้อ และ ผู้ค้ำประกัน ได้อ่านข้อความ',
          fontSize:16
        },
        {
          type:'text',
          x:0, y:606, w:450, h:42,
          text:'ข้างต้นของสัญญาเป็นที่เรียบร้อยแล้ว พร้อมยินยอมชำระเมื่อได้ทำผิดสัญญาดังกล่าว จึงลงลายมือชื่อไว้ เป็นหลักฐานต่อหน้าพยาน และเจ้าหน้าที่',
          fontSize:16,
          align:'justify'
        },
        {
          type:'text',
          x:0, y:669, w:216, h:21,
          text:'ลงชื่อ.............................................ผู้เช่าซื้อ',
          fontSize:16
        },
        {
          type:'text',
          x:225, y:669, w:216, h:21,
          text:'ลงชื่อ.............................................ผู้ค้ำประกัน',
          fontSize:16
        },
        {
          type:'text',
          x:0, y:690, w:216, h:21,
          text:'วันที่..............................................',
          fontSize:16
        },
        {
          type:'text',
          x:225, y:690, w:216, h:21,
          text:'วันที่..............................................',
          fontSize:16
        },
        {
          type:'text',
          x:72, y:723, w:288, h:21,
          text:'ลงชื่อ.......................................................เจ้าหน้าที่บริษัทฯ',
          fontSize:16
        },
        {
          type:'text',
          x:72, y:744, w:288, h:21,
          text:'วันที่..............................................',
          fontSize:16
        }
     ]
    },
  ],
  PF: [],
  RF: []
};
module.exports = report;