var path = require('path');
var report = {
  pageSize: 'A4',
  pageOrientation: 'portrait',
  margin: [18, 18, 18, 18], // top, right, bottom, left
  imagePath: path.normalize(__dirname),
  RH: [],
  PH: [],
  DT: [
    {
      height: 100,
      autoShrink:true,
      items: [
        {
          type:'text',
          x:0, y:0, w:576, h:50,
          text:'บริษัท สยามชัยเซอร์วิส จำกัด',
          fontSize:18,
          align:'center'
        },
        {
          type:'text',
           x:0, y:20, w:576, h:50,
          text:'สำนักงานใหญ่ 11,9 ซอยรังสิต-ปทุม3 ตำบลประชาธิปัตย์ อำเภอธัญบุรี จังหวัดปทุมธานี 12130',
          fontSize:14,
          align:'center'
        },
        {
          type:'line',
          x1:40,y1:40,x2:520,y2:40,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:40,y1:50,x2:40,y2:150,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:40,y1:50,x2:290,y2:50,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:290,y1:50,x2:290,y2:150,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:40,y1:150,x2:290,y2:150,
          lineWidth:0.5
        },


         {
          type:'text',
           x:50, y:50, w:50, h:50,
          text:'คุณ',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:70, y:50, w:200, h:50,
          field:'fullname_to',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:50, y:70, w:300, h:50,
          field:'add1_to',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:50, y:90, w:200, h:50,
          field:'add2_to',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:50, y:110, w:200, h:50,
          field:'add3_to',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:50, y:130, w:200, h:50,
          field:'add4_to',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:350, y:95, w:200, h:50,
          field:'today',
          fontSize:14,
          align:'left'
        },
        {
          type:'line',
          x1:300,y1:150,x2:300,y2:250,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:300,y1:150,x2:520,y2:150,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:520,y1:150,x2:520,y2:250,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:300,y1:250,x2:520,y2:250,
          lineWidth:0.5
        },

        {
          type:'image',
          x:310, y:160, fit:[72, 36],
          image: './images/logo_siamchai.png'
        },
        {
          type:'text',
           x:400, y:160, w:80, h:50,
          text:'เลขที่สัญญา',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:400, y:175, w:150, h:50,
          field:'code',
          fontSize:14,
          align:'left'
        },
        {
          type:'image',
          x:310, y:190, fit:[60, 46],
          image: './images/counter_service.png'
        },
        {
          type:'barcode',
          x:380,y:200,w:100,h:20,
          format:'code128',
          field:'code',
        },
        {
          type:'text',
           x:400, y:220, w:150, h:50,
          field:'code',
          fontSize:14,
          align:'left'
        },


         {
          type:'text',
           x:50, y:170, w:50, h:50,
          text:'เรื่อง',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:70, y:170, w:200, h:50,
          text:'เอกสารแจ้งยอดค้างชำระสินค้า',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:50, y:210, w:50, h:50,
          text:'คุณ',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:70, y:210, w:200, h:50,
          field:'fullname_to',
          fontSize:14,
          align:'left'
        },

        {
          type:'text',
           x:80, y:260, w:80, h:50,
          text:'ตามที่คุณ',
          fontSize:14,
          align:'left'
        },
        {
          type:'line',
          x1:120,y1:273,x2:300,y2:273,
          style:'dotted'
        },
        {
          type:'text',
           x:120, y:260, w:180, h:50,
          field:'fullname',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
           x:310, y:260, w:240, h:50,
          text:'ได้ทำสัญญาเช่าซื้อสินค้าจาก บริษัท สยามชัยเซอร์วิส จำกัด',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:40, y:280, w:50, h:50,
          text:'สาขา',
          fontSize:14,
          align:'left'
        },
        {
          type:'line',
          x1:65,y1:293,x2:175,y2:293,
          style:'dotted'
        },
        {
          type:'text',
           x:65, y:280, w:110, h:50,
          field:'shop_name',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
           x:175, y:280, w:50, h:50,
          text:'ประเภท',
          fontSize:14,
          align:'left'
        },
        {
          type:'line',
          x1:210,y1:293,x2:520,y2:293,
          style:'dotted'
        },
        {
          type:'text',
           x:210, y:280, w:310, h:50,
          field:'product_name',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
           x:40, y:300, w:80, h:50,
          text:'เลขที่สัญญา',
          fontSize:14,
          align:'left'
        },
        {
          type:'line',
          x1:90,y1:313,x2:280,y2:313,
          style:'dotted'
        },
        {
          type:'text',
           x:90, y:300, w:180, h:50,
          field:'code',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
           x:285, y:300, w:80, h:50,
          text:'เมื่อวันที่',
          fontSize:14,
          align:'left'
        },
        {
          type:'line',
          x1:320,y1:313,x2:420,y2:313,
          style:'dotted'
        },
        {
          type:'text',
           x:320, y:300, w:100, h:50,
          field:'sign_date',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
           x:420, y:300, w:200, h:50,
          text:'ณ ปัจจุบันท่านมียอดค้างชำระ',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:40, y:320, w:80, h:50,
          text:'งวดวันที่',
          fontSize:14,
          align:'left'
        },
        {
          type:'line',
          x1:75,y1:333,x2:180,y2:333,
          style:'dotted'
        },
        {
          type:'text',
           x:75, y:320, w:105, h:50,
          field:'term_date',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
           x:180, y:320, w:80, h:50,
          text:'เป็นจำนวนเงิน',
          fontSize:14,
          align:'left'
        },
        {
          type:'line',
          x1:235,y1:333,x2:290,y2:333,
          style:'dotted'
        },
        {
          type:'text',
           x:235, y:320, w:60, h:50,
          field:'amount',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
           x:295, y:320, w:50, h:50,
          text:'บาท',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:320, y:320, w:520, h:50,
          text:'ขณะนี้ท่านได้ขาดส่งค่างวดสินค้ากับทางบริษัทฯ เป็นระยะ',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:40, y:340, w:520, h:50,
          text:'เวลาเกินกำหนด ดังนั้นให้ท่านรีบไปชำระยอดค้างโดยด่วน หลังจากได้รับจดหมายฉบับนี้ เราจะไม่ดำเนินคดีตามกฏหมายกับท่าน',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:40, y:360, w:520, h:50,
          text:'(ถ้าท่านสงสัยยอดค้างชำระที่ปรากฏในจดหมายฉบับนี้ เพื่อความถูกต้องก่อนชำระท่านสามารถโทรสอบถามยอดที่ถูกต้องได้ที่เบอร์',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:40, y:380, w:520, h:50,
          text:'0-2959-4200 ต่อ 122,123 มือถือ 061-401-3412 ฝ่ายติดตามหนี้)',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:80, y:420, w:520, h:50,
          text:'บริษัทฯ ต้องขออภัยมา ณ ที่นี้ด้วย ถ้าท่านได้ชำระค่างวดก่อนวันที่จดหมายฉบับนี้ไปถึง แต่ถ้ายังไม่ได้ชำระ ท่านสามารถเดิน',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:40, y:440, w:520, h:50,
          text:'ทางไปชำระได้ที่สาขาที่ท่านซื้อ หรือถ้าไม่สะดวกเดินทางไปชำระที่ร้าน ท่านสามารถชำระผ่านเคาร์เตอร์เซอร์วิส หรือโอนเงินผ่านตู้ ATM',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:40, y:460, w:520, h:50,
          text:'หรือชำระผ่านเคาร์เตอร์ธนาคารกรุงเทพฯ สาขา รังสิต บัญชีออมทรัพย์ ชื่อบัญชี บริษัท สยามชัยเซอร์วิส จำกัด เลขที่บัญชี',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:40, y:480, w:520, h:50,
          text:'165-4804-424 (สำหรับท่านที่โอนเงินผ่าน ATM/ธนาคาร กรุณาแฟกซ์ใบโอนเงิน หรือโทรแจ้งที่สาขาที่ท่านผ่อน หรือโทรแจ้งได้ที่',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:40, y:500, w:520, h:50,
          text:'0-2959-4200 ต่อ 122,123 มือถือ 061-401-3412 เพื่อจะได้ตัดยอดค้างที่ชำระแล้วออกจากบัญชีหนี้เสีย)',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:80, y:540, w:520, h:50,
          text:'บริษัทฯ ขอสงวนสิทธิ์เข้ายึดสินค้าคืน หรือดำเนินคดีกับท่านตามกฏหมาย ถ้าท่านเพิกเฉยในการชำระยอดค้างค่างวดดัง',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:40, y:560, w:520, h:50,
          text:'รายละเอียดตามจดหมายนี้',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:80, y:580, w:520, h:50,
          text:'จึงเรียนมาเพื่อทราบ และหวังว่าจะได้รับความร่วมมือจากท่านเป็นอย่างดี',
          fontSize:14,
          align:'left'
        },
        {
          type:'text',
           x:350, y:620, w:520, h:50,
          text:'ขอแสดงความนับถือ',
          fontSize:14,
          align:'left'
        },
         {
          type:'text',
           x:310, y:680, w:150, h:50,
          field:'staff_name',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
           x:360, y:700, w:520, h:50,
          text:'ฝ่ายเร่งรัดหนี้',
          fontSize:14,
          align:'left'
        },
        {
          type:'line',
          x1:40,y1:730,x2:520,y2:730,
          lineWidth:0.5
        },
        {
          type:'text',
           x:0, y:730, w:576, h:50,
          text:'แจ้งข้อมูลการโอนเงิน หรือสอบถามรายละเอียดเพิ่มกรุณาติดต่อกลับ',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
           x:0, y:750, w:576, h:50,
          text:'สาขาที่ท่านซื้อ หรือ สำนักงานใหญ่ (ฝ่ายติดตามหนี้) โทร.0-2959-4200 ต่อ 122,123 โทรสาร.0-2959-4202',
          fontSize:14,
          align:'center'
        },

      ]
    },

  ],
  PF: [],
  RF: []
};


// var list = [report.PH[0], report.DT[0], report.PF[0]];
// // var list2 = [];
// //
// // list.forEach(function(sections) {
// //   sections.forEach(function(section) {
// //     list2.push(section);
// //   });
// // });
//
//
// list.forEach(function(section) {
//   var len = section.items.length;
//   for (var i = 0; i < len; i++) {
//     var obj = JSON.parse(JSON.stringify(section.items[i]));
//     if (typeof obj.x === 'number') {
//       obj.x += 416;
//     } else if (typeof obj.x1 === 'number') {
//       obj.x1 += 416;
//       obj.x2 += 416;
//     }
//     section.items.push(obj);
//   }
// });

//console.log('test report =' + report.PH[0].items);

module.exports = report;
