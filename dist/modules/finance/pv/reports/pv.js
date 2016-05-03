var path = require('path');
var report = {
  pageSize: 'A4',
  pageOrientation: 'portrait',
  margin: [36, 36, 0, 54], // top, right, bottom, left
  imagePath: path.normalize(__dirname),
  RH: [],
  PH: [
    {
      // simulate group header
      height:54,
      autoShrink:true,
      items: [
        {
          type:'rectangle',
          x:0,y:0,w:144,h:54,
          lineWidth:1.5
        },
        {
          type:'hline',
          x:0,y:27,w:144,
          lineWidth:1
        },
        {
          type:'text',
          x:0, y:0, w:144, h:27,
          text:'ชำระเงินผู้จำหน่าย',
          fontSize:22,
          align:'center',
          bold:true
        },
        {
          type:'text',
          x:0, y:27, w:144, h:27,
          text:'Official Payment',
          fontSize:24,
          align:'center',
        },
        {
          type:'text',
          x:162, y:0, w:198, h:27,
          text:'บริษัท สยามชัยเซอร์วิส จำกัด',
          fontSize:20,
          bold:true
        },
        // {
        //   type:'text',
        //   x:162, y:27, w:198, h:27,
        //   text:'จ่ายโดย: เงินสด',
        //   fontSize:16
        // },
        {
          type:'rectangle',
          x:360,y:0,w:144,h:54,
          lineWidth:1.5
        },
        {
          type:'hline',
          x:360,y:27,w:144,
          lineWidth:1
        },
        {
          type:'text',
          x:366, y:0, w:36, h:12,
          text:'เลขที่',
          fontSize:16
        },
        {
          type:'text',
          x:366, y:12, w:36, h:12,
          text:'No.',
          fontSize:16
        },
        {
          type:'text',
          x:366, y:27, w:36, h:12,
          text:'วันที่',
          fontSize:16
        },
        {
          type:'text',
          x:366, y:39, w:36, h:12,
          text:'Date',
          fontSize:16
        },
        {
          type:'text',
          x:400,y:3,w:99,h:24,
          field:'code',
          fontSize:18
        },
        {
          type:'text',
          x:400,y:30,w:99,h:24,
          field:'document_date',
          fontSize:18
        },
        {
          type:'hline',
          x:0,y:60,w:504,
          lineWidth:1
        },
        {
          type:'hline',
          x:0,y:87,w:504,
          lineWidth:1
        },
        {
          type:'vline',
          x:0,y:60,h:27,
          lineWidth:0.5
        },
        {
          type:'vline',
          x:63,y:60,h:27,
          lineWidth:0.5
        },
        {
          type:'vline',
          x:180,y:60,h:27,
          lineWidth:0.5
        },
        {
          type:'vline',
          x:252,y:60,h:27,
          lineWidth:0.5
        },
        {
          type:'vline',
          x:324,y:60,h:27,
          lineWidth:0.5
        },
        {
          type:'vline',
          x:504,y:60,h:27,
          lineWidth:0.5
        },
        {
          type:'text',
          x:0,y:63,h:24,w:63,
          text:'สาขา',
          fontSize:18,
          align:'center'
        },
        {
          type:'text',
          x:63,y:63,h:24,w:117,
          text:'ใบแจ้งหนี้',
          fontSize:18,
          align:'center'
        },
        {
          type:'text',
          x:180,y:63,h:24,w:72,
          text:'วันที่รับ',
          fontSize:18,
          align:'center'
        },
        {
          type:'text',
          x:252,y:63,h:24,w:72,
          text:'จำนวนเงิน',
          fontSize:18,
          align:'center'
        },
        {
          type:'text',
          x:324,y:63,h:24,w:180,
          text:'หมายเหตุ',
          fontSize:18,
          align:'center'
        }
      ]
    },
    {
      overlay:true,
      items:[
        {
          type:'text',
          x:0,y:144,h:72,w:504,
          field:'status',
          fontSize:72,
          align:'center',
          color:'#ccc'
        }
      ]
    }
  ],
  DT: [
    {
      height: 27,
      autoShrink:true,
      items: [
        // {
        //   type:'hline',
        //   x:0,y:27,w:504,
        //   lineWidth:1
        // },
        {
          type:'vline',
          x:0,y:0,h:21,
          lineWidth:0.5
        },
        {
          type:'vline',
          x:63,y:0,h:21,
          lineWidth:0.5
        },
        {
          type:'vline',
          x:180,y:0,h:21,
          lineWidth:0.5
        },
        {
          type:'vline',
          x:252,y:0,h:21,
          lineWidth:0.5
        },
        {
          type:'vline',
          x:324,y:0,h:21,
          lineWidth:0.5
        },
        {
          type:'vline',
          x:504,y:0,h:21,
          lineWidth:0.5
        },
        {
          type:'text',
          x:0,y:0,h:21,w:63,
          field:'shop_code',
          fontSize:16,
          align:'center'
        },
        {
          type:'text',
          x:69,y:0,h:21,w:90,
          field:'invoice_code',
          fontSize:16,
        },
        {
          type:'text',
          x:183,y:0,h:21,w:66,
          field:'invoice_date',
          fontSize:16,
          align:'center'
        },
        {
          type:'text',
          x:255,y:0,h:21,w:63,
          field:'amount',
          fontSize:16,
          align:'right'
        },
        {
          type:'text',
          x:330,y:0,h:21,w:171,
          field:'remark',
          fontSize:16
        }
      ]
    }
  ],
  PF: [
    {
      // simulate group footer
      height:100,
      autoShrink:true,
      items: [
        {
          type:'hline',
          x:0, y:0, w:504,
          lineWidth:1
        },
        {
          type:'hline',
          x:0, y:27, w:504,
          lineWidth:1,
          show: function(item) {
            return item.showTotal ||false;
          }
        },
        {
          type:'vline',
          x:0, y:0, h:27,
          lineWidth:0.5,
          show: function(item) {
            return item.showTotal ||false;
          }
        },
        {
          type:'vline',
          x:324, y:0, h:27,
          lineWidth:0.5,
          show: function(item) {
            return item.showTotal ||false;
          }
        },
        {
          type:'vline',
          x:504, y:0, h:27,
          lineWidth:0.5,
          show: function(item) {
            return item.showTotal ||false;
          }
        },
        {
          type:'rectangle',
          x:0, y:0, w:324, h:27,
          fillColor:'#000',
          show: function(item) {
            return item.showTotal ||false;
          }
        },
        {
          type:'text',
          x:0, y:3, w:324, h:24,
          field:'total_amount_text',
          fontSize:18,
          align:'center',
          color:'#fff',
          bold:true,
          show: function(item) {
            return item.showTotal ||false;
          }
        },
        {
          type:'text',
          x:327, y:3, w:180, h:24,
          field:'total_amount',
          fontSize:18,
          align:'center',
          bold:true,
          show: function(item) {
            return item.showTotal ||false;
          }
        },
        {
          type:'text',
          x:0, y:39, w:288, h:27,
          text:'ผู้อนุมัติ......................................',
          fontSize:16
        },

        {
          type:'text',
          x:-55, y:59, w:144, h:27,
          text:'วันที่....../........../........',
          fontSize:16,
          align:'right'
        },
        {
          type:'text',
          x:216, y:39, w:288, h:18,
          field:'approve_by',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:216, y:54, w:288, h:18,
          field:'printed',
          fontSize:12,
          align:'right'
        }
      ]
    }
  ],
  RF: []
};

module.exports = report;
