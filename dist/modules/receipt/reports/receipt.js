var path = require('path');
var report = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  margin: [18, 18, 18, 18], // top, right, bottom, left
  imagePath: path.normalize(__dirname),
  RH: [],
  PH: [
    // Original
    {
      height: 100,
      autoShrink:true,
      items: [
        {
          type:'image',
          x:0, y:0, fit:[72, 36],
          image: './images/logo_siamchai.png'
        },
        {
          type:'text',
          x:100, y:10, w:150, h:15,
          field:'alert_text',
          fontSize:18,
          align:'center',
          color:'red'
        },
        {
          type:'text',
          x:250, y:5, w:130, h:15,
          text:'ใบเสร็จรับเงิน',
          fontSize:24,
          align:'right'
        },
        {
          type:'text',
          x:0, y:30 , w:380, h:15,
          text:'11,9 ซอยรังสิต-ปทุม3 ตำบลประชาธิปัตย์ อำเภอธัญบุรี จังหวัดปทุมธานี 12130 โทร.0915764592-3',
          fontSize:12
        },
        {
          type:'line',
          x1:0,y1:45,x2:380,y2:45,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:0,y1:92,x2:380,y2:92,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:0,y1:122,x2:380,y2:122,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:0,y1:137,x2:380,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:250,y1:62,x2:380,y2:62,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:250,y1:77,x2:380,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:0,y1:45,x2:0,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:250,y1:45,x2:250,y2:92,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:380,y1:45,x2:380,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:30,y1:122,x2:30,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:240,y1:122,x2:240,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:280,y1:122,x2:280,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:330,y1:122,x2:330,y2:137,
          lineWidth:0.5
        },
        {
          type:'text',
          x:2, y:47 , w:30, h:15,
          text:'ลูกค้า',
          fontSize:12
        },
        {
          type:'text',
          x:23, y:47 , w:250, h:15,
          //text:'ประทีป อยู่สถิตย์',
          field:'cus_name',
          fontSize:12
        },
        {
          type:'text',
          x:252, y:47 , w:100, h:15,
          text:'เลขที่',
          fontSize:12
        },
        {
          type:'text',
          x:290, y:47 , w:87, h:15,
          //text:'201506/10740',
          field:'code',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:2, y:62, w:200, h:30,
          //text:'บ้้านเลขที่ 1111111111111111111111111111111111111111111111111111111111111111111111111',
          field:'cus_add',
          fontSize:12
        },

        {
          type:'text',
          x:252, y:62 , w:100, h:15,
          text:'วันที่',
          fontSize:12
        },
        {
          type:'text',
          x:290, y:62 , w:87, h:15,
          //text:'30/06/2015 18:00:01',
          field:'system_date',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:252, y:77 , w:100, h:15,
          text:'ไฟแนนซ์โดย',
          fontSize:12
        },
        {
          type:'text',
          x:290, y:77 , w:87, h:15,
          //text:'ประทีป อยู่สถิตย์',
          field:'display_name',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:2, y:93, w:377, h:30,
          //text:'สาขา 22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222',
          field:'shop_name',
          fontSize:12
        },
        {
          type:'text',
          x:0, y:122, w:30, h:10,
          text:'ลำดับ',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:30, y:122, w:200, h:10,
          text:'ค่างวด',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:235, y:122, w:50, h:10,
          text:'เงินต้น',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:280, y:122, w:50, h:10,
          text:'ค่าใช้จ่าย',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:330, y:122, w:50, h:10,
          text:'คงเหลือ',
          fontSize:12,
          align:'center'
        },
        {
          type:'image',
          x:416, y:0, fit:[72, 36],
          image: './images/logo_siamchai.png'
        },
        {
          type:'text',
          x:516, y:10, w:150, h:15,
          field:'alert_text',
          fontSize:18,
          align:'center',
          color:'red'
        },
        {
          type:'text',
          x:666, y:5, w:130, h:15,
          text:'ใบเสร็จรับเงิน',
          fontSize:24,
          align:'right'
        },
        {
          type:'text',
          x:416, y:30 , w:380, h:15,
          text:'11,9 ซอยรังสิต-ปทุม3 ตำบลประชาธิปัตย์ อำเภอธัญบุรี จังหวัดปทุมธานี 12130',
          fontSize:12
        },
        {
          type:'line',
          x1:416,y1:45,x2:796,y2:45,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:416,y1:92,x2:796,y2:92,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:416,y1:122,x2:796,y2:122,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:416,y1:137,x2:796,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:666,y1:62,x2:796,y2:62,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:666,y1:77,x2:796,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:416,y1:45,x2:416,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:666,y1:45,x2:666,y2:92,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:796,y1:45,x2:796,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:446,y1:122,x2:446,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:656,y1:122,x2:656,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:696,y1:122,x2:696,y2:137,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:746,y1:122,x2:746,y2:137,
          lineWidth:0.5
        },
        {
          type:'text',
          x:418, y:47 , w:30, h:15,
          text:'ลูกค้า',
          fontSize:12
        },
        {
          type:'text',
          x:439, y:47 , w:250, h:15,
          //text:'ประทีป อยู่สถิตย์',
          field:'cus_name',
          fontSize:12
        },
        {
          type:'text',
          x:668, y:47 , w:100, h:15,
          text:'เลขที่',
          fontSize:12
        },
        {
          type:'text',
          x:706, y:47 , w:87, h:15,
          //text:'201506/10740',
          field:'code',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:418, y:62, w:200, h:30,
          //text:'บ้้านเลขที่ 1111111111111111111111111111111111111111111111111111111111111111111111111',
          field:'cus_add',
          fontSize:12
        },

        {
          type:'text',
          x:668, y:62 , w:100, h:15,
          text:'วันที่',
          fontSize:12
        },
        {
          type:'text',
          x:706, y:62 , w:87, h:15,
          //text:'30/06/2015 18:00:01',
          field:'system_date',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:668, y:77 , w:100, h:15,
          text:'ไฟแนนซ์โดย',
          fontSize:12
        },
        {
          type:'text',
          x:706, y:77 , w:87, h:15,
          //text:'ประทีป อยู่สถิตย์',
          field:'display_name',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:418, y:93, w:377, h:30,
          //text:'สาขา 22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222',
          field:'shop_name',
          fontSize:12
        },
        {
          type:'text',
          x:416, y:122, w:30, h:10,
          text:'ลำดับ',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:446, y:122, w:200, h:10,
          text:'ค่างวด',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:651, y:122, w:50, h:10,
          text:'เงินต้น',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:696, y:122, w:50, h:10,
          text:'ค่าใช้จ่าย',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:746, y:122, w:50, h:10,
          text:'คงเหลือ',
          fontSize:12,
          align:'center'
        },
      ]
    },
  ],
  DT: [
    {
      height: 100,
      autoShrink:true,
      items: [
        {
          type:'text',
          x:0, y:0, w:30, h:15,
          field:'rownum',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:32, y:0, w:200, h:15,
          //text:'เครื่องซักผ้า LG 1111111111111',
          field:'pay_detail',
          fontSize:12
        },
        {
          type:'text',
          x:235, y:0, w:50, h:15,
          //text:'1',
          field:'tr_cost',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:280, y:0, w:47, h:15,
          //text:'27,000.00',
          field:'tr_amount',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:330, y:0, w:47, h:15,
          //text:'27,000.00',
          field:'tr_balance',
          fontSize:12,
          align:'right'
        },
        {
          type:'line',
          x1:0,y1:0,x2:0,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:30,y1:0,x2:30,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:240,y1:0,x2:240,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:280,y1:0,x2:280,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:330,y1:0,x2:330,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:380,y1:0,x2:380,y2:15,
          lineWidth:0.5
        },
        {
          type:'text',
          x:416, y:0, w:30, h:15,
          field:'rownum',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:448, y:0, w:200, h:15,
          //text:'เครื่องซักผ้า LG 1111111111111',
          field:'pay_detail',
          fontSize:12
        },
        {
          type:'text',
          x:651, y:0, w:50, h:15,
          //text:'1',
          field:'tr_cost',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:696, y:0, w:47, h:15,
          //text:'27,000.00',
          field:'tr_amount',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:746, y:0, w:47, h:15,
          //text:'27,000.00',
          field:'tr_balance',
          fontSize:12,
          align:'right'
        },
        {
          type:'line',
          x1:416,y1:0,x2:416,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:446,y1:0,x2:446,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:656,y1:0,x2:656,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:696,y1:0,x2:696,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:746,y1:0,x2:746,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:796,y1:0,x2:796,y2:15,
          lineWidth:0.5
        },
      ]
    },

  ],
  PF: [
    {
      height: 100,
      autoShrink:true,
      overlay: true,
      items: [
        {
          type:'image',
          x:90, y:-270, fit:[200, 135],
          field:function(row, i, data, printState) {
            if (row.status == 'VOID') {
              return './images/canceled.png';
            }
            return './images/none.png';
          }
          //image: './images/canceled.png'
        },
        {
          type:'text',
          x:0, y:0, w:240, h:15,
          //text:'(สองหมื่นเจ็ดพันบาทถ้วน)',
          field:function(row, i, data, printState) {
            if (i==(data.length-1)) {
              return row.text_total_amount;
            }
            return '';
          },
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:242, y:0, w:50, h:15,
          text:'',
          fontSize:12
        },
        {
          type:'text',
          x:330, y:0, w:47, h:15,
          text:'',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:2, y:15, w:237, h:30,
          field:function(row, i, data, printState) {
            if (i==(data.length-1)) {
              return row.payment_remark;
            }
            return '';
          },
          //text:'เงินสด 1000 บัตรเครดิต 500 บัตรเครดิต 500 บัตรเครดิต 500' ,
          fontSize:12
        },
        {
          type:'text',
          x:242, y:15, w:50, h:15,
          text:'รวมชำระ',
          fontSize:12
        },
        {
          type:'text',
          x:330, y:15, w:47, h:15,
          field:function(row, i, data, printState) {
            if (i==(data.length-1)) {
              return row.status;
            }
            return '';
          },
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:240, y:30, w:70, h:15,
          text:'รับเงินโดย',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:280, y:45, w:50, h:15,
          text:'',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:240, y:60, w:70, h:15,
          //text:'ประทีป อยู่สถิตย์',
          field:'pay_staff',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:310, y:30, w:70, h:15,
          text:'พนักงานไฟแนนซ์',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:330, y:45, w:50, h:15,
          text:'',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:330, y:60, w:50, h:15,
          text:'',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:2, y:45, w:377, h:30,
          //text:'หมายเหตุ',
          field:function(row, i, data, printState) {
            if (i==(data.length-1)) {
              return row.remark;
            }
            return '';
          },
          fontSize:12
        },
        {
          type:'line',
          x1:0,y1:0,x2:380,y2:0,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:0,y1:15,x2:380,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:0,y1:45,x2:240,y2:45,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:240,y1:30,x2:380,y2:30,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:0,y1:77,x2:380,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:0,y1:0,x2:0,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:380,y1:0,x2:380,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:240,y1:0,x2:240,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:310,y1:30,x2:310,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:314,y1:60,x2:376,y2:60,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:244,y1:60,x2:306,y2:60,
          lineWidth:0.5
        },
        {
          type:'image',
          x:506, y:-270, fit:[200, 135],
          field:function(row, i, data, printState) {
            if (row.status == 'VOID') {
              return './images/canceled.png';
            }
            return './images/none.png';
          }
          //image: './images/canceled.png'
        },
        {
          type:'text',
          x:416, y:0, w:240, h:15,
          //text:'(สองหมื่นเจ็ดพันบาทถ้วน)',
          field:function(row, i, data, printState) {
            if (i==(data.length-1)) {
              return row.text_total_amount;
            }
            return '';
          },
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:658, y:0, w:50, h:15,
          text:'',
          fontSize:12
        },
        {
          type:'text',
          x:746, y:0, w:47, h:15,
          text:'',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:418, y:15, w:237, h:30,
          field:function(row, i, data, printState) {
            if (i==(data.length-1)) {
              return row.payment_remark;
            }
            return '';
          },
          //text:'เงินสด 1000 บัตรเครดิต 500 บัตรเครดิต 500 บัตรเครดิต 500' ,
          fontSize:12
        },
        {
          type:'text',
          x:658, y:15, w:50, h:15,
          text:'รวมชำระ',
          fontSize:12
        },
        {
          type:'text',
          x:746, y:15, w:47, h:15,
          field:function(row, i, data, printState) {
            if (i==(data.length-1)) {
              return row.total_amount;
            }
            return '';
          },
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:656, y:30, w:70, h:15,
          text:'รับเงินโดย',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:696, y:45, w:50, h:15,
          text:'',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:656, y:60, w:70, h:15,
          //text:'ประทีป อยู่สถิตย์',
          field:'pay_staff',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:726, y:30, w:70, h:15,
          text:'พนักงานไฟแนนซ์',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:746, y:45, w:50, h:15,
          text:'',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:746, y:60, w:50, h:15,
          text:'',
          fontSize:12,
          align:'center'
        },
        {
          type:'text',
          x:418, y:45, w:377, h:30,
          //text:'หมายเหตุ',
          field:function(row, i, data, printState) {
            if (i==(data.length-1)) {
              return row.remark;
            }
            return '';
          },
          fontSize:12
        },
        {
          type:'line',
          x1:416,y1:0,x2:796,y2:0,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:416,y1:15,x2:796,y2:15,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:416,y1:45,x2:656,y2:45,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:656,y1:30,x2:796,y2:30,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:416,y1:77,x2:796,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:416,y1:0,x2:416,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:796,y1:0,x2:796,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:656,y1:0,x2:656,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:726,y1:30,x2:726,y2:77,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:730,y1:60,x2:792,y2:60,
          lineWidth:0.5
        },
        {
          type:'line',
          x1:660,y1:60,x2:722,y2:60,
          lineWidth:0.5
        },
      ]
    },

  ],
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
