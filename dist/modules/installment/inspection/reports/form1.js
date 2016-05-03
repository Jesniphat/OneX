var path = require('path');

var report = {
  pageSize: 'A4',
  pageOrientation: 'portrait',
  margin: [36, 18, 18, 18], // top, right, bottom, left
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
          type:'barcode',
          x:400,y:0,w:144,h:36,
          format:'code128',
          text:'12345'
        },
        {
          type:'text',
          x:144, y:72, w:216, h:18,
          field:'cus.fullname',
          fontSize:14,
        },
        {
          type:'text',
          x:27, y:90, w:27, h:18,
          field:'cus.age',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
          x:126, y:90, w:18, h:18,
          field:'cus.birth_dd',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
          x:162, y:90, w:27, h:18,
          field:'cus.birth_mm',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
          x:204, y:90, w:27, h:18,
          field:'cus.birth_yy',
          fontSize:14,
          align:'center'
        },
        {
          type:'circle',
          x:255, y:93, w:24, h:15,
          show:function(row) {
            return row['cus.gender']=='M';
          }
        },
        {
          type:'circle',
          x:279, y:93, w:24, h:15,
          show:function(row) {
            return row['cus.gender']=='F';
          }
        },
        {
          type:'circle',
          x:348, y:93, w:33, h:15,
          show:function(row) {
            return row['cus.marital_status']=='MARRIED';
          }
        },
        {
          type:'circle',
          x:381, y:93, w:21, h:15,
          show:function(row) {
            return row['cus.marital_status']=='SINGLE';
          }
        },
        {
          type:'text',
          x:117, y:111, w:144, h:18,
          field:'cus.nationid',
          fontSize:16,
          align:'center'
        },
        {
          type:'text',
          x:90, y:129, w:288, h:18,
          field:'homeAddr.line1',
          fontSize:14
        },
        {
          type:'text',
          x:18, y:147, w:180, h:18,
          field:'homeAddr.line2',
          fontSize:14
        },
        {
          type:'text',
          x:234, y:147, w:72, h:18,
          field:'homeAddr.tambon',
          fontSize:14
        },
        {
          type:'text',
          x:324, y:147, w:72, h:18,
          field:'homeAddr.amphur',
          fontSize:14
        },
        {
          type:'text',
          x:27, y:165, w:72, h:18,
          field:'homeAddr.province',
          fontSize:14
        },
        {
          type:'text',
          x:147, y:165, w:36, h:18,
          field:'homeAddr.zipcode',
          fontSize:14
        },
        {
          type:'text',
          x:252, y:165, w:144, h:18,
          field:'homeAddr.tel',
          fontSize:14
        },
        {
          type:'text',
          x:72, y:183, w:144, h:18,
          field:'cus.mobile',
          fontSize:14
        },
        {
          type:'text',
          x:324, y:183, w:72, h:18,
          field:'homeAddr.other',
          fontSize:14
        },
        {
          type:'circle',
          x:66, y:207, w:51, h:15,
          show:function(row) {return row['cus.addr_owner']=='01';}
        },
        {
          type:'circle',
          x:120, y:207, w:39, h:15,
          show:function(row) {return row['cus.addr_owner']=='02';}
        },
        {
          type:'circle',
          x:162, y:207, w:72, h:15,
          show:function(row) {return row['cus.addr_owner']=='03';}
        },
        {
          type:'circle',
          x:237, y:207, w:42, h:15,
          show:function(row) {return row['cus.addr_owner']=='04';}
        },
        {
          type:'circle',
          x:282, y:207, w:54, h:15,
          show:function(row) {return row['cus.addr_owner']=='05';}
        },
        {
          type:'circle',
          x:339, y:207, w:60, h:15,
          show:function(row) {return row['cus.addr_owner']=='06';}
        },
        {
          type:'circle',
          x:54, y:225, w:36, h:15,
          show:function(row) {return row['cus.addr_with']=='01';}
        },
        {
          type:'circle',
          x:96, y:225, w:45, h:15,
          show:function(row) {return row['cus.addr_with']=='02';}
        },
        {
          type:'circle',
          x:147, y:225, w:21, h:15,
          show:function(row) {return row['cus.addr_with']=='03';}
        },
        {
          type:'circle',
          x:174, y:225, w:33, h:15,
          show:function(row) {return row['cus.addr_with']=='04';}
        },
        {
          type:'circle',
          x:210, y:225, w:27, h:15,
          show:function(row) {return row['cus.addr_with']=='05';}
        },
        {
          type:'text',
          x:354, y:219, w:33, h:18,
          field:'cus.addr_person',
          fontSize:14,
          align:'center'
        },
        {
          type:'text',
          x:162, y:270, w:180, h:18,
          field:'cus.work_company',
          fontSize:14
        },
        {
          type:'text',
          x:36, y:288, w:324, h:18,
          field:'workAddr.line',
          fontSize:14
        },
        {
          type:'text',
          x:27, y:306, w:72, h:18,
          field:'workAddr.tambon',
          fontSize:14
        },
        {
          type:'text',
          x:126, y:306, w:72, h:18,
          field:'workAddr.amphur',
          fontSize:14
        },
        {
          type:'text',
          x:225, y:306, w:72, h:18,
          field:'workAddr.province',
          fontSize:14
        },
        {
          type:'text',
          x:354, y:306, w:54, h:18,
          field:'workAddr.zipcode',
          fontSize:14
        },
        {
          type:'text',
          x:360, y:324, w:54, h:18,
          field:'cus.work_type',
          fontSize:14
        },
        {
          type:'text',
          x:36, y:342, w:63, h:18,
          field:'workAddr.tel',
          fontSize:14
        },
        {
          type:'text',
          x:207, y:342, w:108, h:18,
          field:'cus.work_detail',
          fontSize:14
        },
        {
          type:'text',
          x:345, y:342, w:63, h:18,
          field:'cus.work_department',
          fontSize:14
        },
        {
          type:'text',
          x:36, y:360, w:63, h:18,
          field:'cus.work_position',
          fontSize:14
        },
        {
          type:'text',
          x:198, y:360, w:54, h:18,
          field:'cus.work_time',
          fontSize:14
        },
        {
          type:'text',
          x:324, y:360, w:54, h:18,
          field:'cus.work_year',
          fontSize:14
        },
        {
          type:'text',
          x:54, y:378, w:48, h:18,
          field:'cus.work_salary',
          fontSize:14
        },
        {
          type:'text',
          x:144, y:378, w:72, h:18,
          field:'cus.work_income',
          fontSize:14
        },
        {
          type:'text',
          x:306, y:378, w:90, h:18,
          field:'cus.work_income_source',
          fontSize:14
        },
        {
          type:'text',
          x:288, y:411, w:126, h:18,
          field:'cus.work_prev_company',
          fontSize:14
        },
        {
          type:'text',
          x:18, y:429, w:126, h:18,
          field:'cus.work_prev_addr',
          fontSize:14
        },
        {
          type:'text',
          x:183, y:429, w:90, h:18,
          field:'cus.work_prev_department',
          fontSize:14
        },
        {
          type:'text',
          x:324, y:429, w:72, h:18,
          field:'cus.work_prev_tel',
          fontSize:14
        },

        {
          type:'text',
          x:126, y:474, w:162, h:18,
          field:'co.fullname',
          fontSize:14
        },
        {
          type:'text',
          x:360, y:473, w:36, h:18,
          field:'cus.relation',
          fontSize:14
        },
        {
          type:'text',
          x:90, y:492, w:288, h:18,
          field:'coHomeAddr.line1',
          fontSize:14
        },
        {
          type:'text',
          x:18, y:513, w:180, h:18,
          field:'coHomeAddr.line2',
          fontSize:14
        },
        {
          type:'text',
          x:234, y:513, w:72, h:18,
          field:'coHomeAddr.tambon',
          fontSize:14
        },
        {
          type:'text',
          x:324, y:513, w:72, h:18,
          field:'coHomeAddr.amphur',
          fontSize:14
        },
        {
          type:'text',
          x:27, y:531, w:72, h:18,
          field:'coHomeAddr.province',
          fontSize:14
        },
        {
          type:'text',
          x:147, y:531, w:36, h:18,
          field:'coHomeAddr.zipcode',
          fontSize:14
        },
        {
          type:'text',
          x:252, y:531, w:144, h:18,
          field:'coHomeAddr.tel',
          fontSize:14
        },
        {
          type:'text',
          x:72, y:549, w:144, h:18,
          field:'co.mobile',
          fontSize:14
        },
        {
          type:'text',
          x:324, y:549, w:72, h:18,
          field:'coHomeAddr.other',
          fontSize:14
        },
        {
          type:'text',
          x:117, y:570, w:144, h:18,
          field:'co.nationid',
          fontSize:16,
          align:'center'
        },
        {
          type:'text',
          x:63, y:588, w:216, h:18,
          field:'co.work_company',
          fontSize:14
        },
        {
          type:'text',
          x:342, y:588, w:72, h:18,
          field:'co.work_detail',
          fontSize:14
        },
        {
          type:'text',
          x:27, y:606, w:39, h:18,
          field:'co.work_department',
          fontSize:14
        },
        {
          type:'text',
          x:99, y:606, w:39, h:18,
          field:'co.work_position',
          fontSize:14
        },
        {
          type:'text',
          x:234, y:606, w:39, h:18,
          field:'co.work_time',
          fontSize:14
        },
        {
          type:'text',
          x:99, y:624, w:18, h:18,
          field:'co.work_year',
          fontSize:14
        },
        {
          type:'text',
          x:288, y:624, w:54, h:18,
          field:'co.work_salary',
          fontSize:14
        },
        {
          type:'text',
          x:18, y:642, w:378, h:18,
          field:'co.work_address',
          fontSize:14
        },
      ]
    },
  ],
  PF: [],
  RF: []
};
module.exports = report;
