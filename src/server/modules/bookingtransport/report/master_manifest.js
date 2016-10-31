module.exports = {
  pageSize: 'A4',
  margin: [18, 18, 18, 36], // top, right, bottom, left
  RH: [
    {
      items: [
        {type:'image',x:195, y:2, fit:[150, 62],image: './images/Onexlogo.png'},
        {
          type:'text',x:0, y:63, w:540, h:13,
          text:'1000/125 SOI SUKHUMVIT 55 (THONGLOR), SUKHUMVIT RD., NORTH KLONGTON, WATTANA, BANGKOK, 10110 THAILAND',
          fontSize:12,bold:false,align: 'center'},
        {type:'text',x:0, y:75, w:540, h:12,text:'Hotline : +66(0)2 381 5001-6',fontSize:12,bold:true,align: 'center'},
        {type:'text',x:0, y:95, w:540, h:16,text:'Master cargo manifest / บัญชีกำกับสินค้า (หลัก)',fontSize:16,bold:true,align: 'center'},

        {type:'text',x:300, y:111, w:70, h:12,text:'E.T.D',fontSize:12,bold:true,align: 'left'},

        {type:'text',x:55, y:123, w:75, h:12,text:'Date / วันที่ : ',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:135, y:123, w:75, h:12,field:'created_date',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:300, y:123, w:70, h:12,text:'วันที่ออกเดินทาง',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:385, y:123, w:75, h:12,field:'intransit_date',fontSize:12,bold:false,align: 'left'},

        // {type:'text',x:55, y:135, w:75, h:12,text:'Manifest No.',fontSize:12,bold:true,align: 'left'},
        {type:'text',x:300, y:135, w:70, h:12,text:'E.T.A',fontSize:12,bold:true,align: 'left'},

        // {type:'text',x:55, y:147, w:75, h:12,text:'หมายเลขใบนำส่ง',fontSize:12,bold:false,align: 'left'},
        // {type:'text',x:135, y:147, w:75, h:12,field:'intransit_no',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:300, y:147, w:70, h:12,text:'วันที่ถึงปลายทาง',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:385, y:147, w:75, h:12,field:'accepted_date',fontSize:12,bold:false,align: 'left'},

        {type:'text',x:55, y:171, w:75, h:12,text:'Prepared by ',fontSize:12,bold:true,align: 'left'},
        {type:'text',x:300, y:171, w:83, h:12,text:'No. of master waybill',fontSize:12,bold:true,align: 'left'},

        {type:'text',x:55, y:183, w:75, h:12,text:'จัดทำโดย',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:135, y:183, w:75, h:12,field:'prepare_by',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:300, y:183, w:80, h:12,text:'จำนวนใบตราส่งสินค้า',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:385, y:183, w:75, h:12,field:'item_no',fontSize:12,bold:false,align: 'left'},

        {type:'text',x:55, y:207, w:75, h:12,text:'Point Of Loading',fontSize:12,bold:true,align: 'left'},
        {type:'text',x:300, y:207, w:80, h:12,text:'Point Of Unloading',fontSize:12,bold:true,align: 'left'},

        {type:'text',x:55, y:219, w:75, h:12,text:'จุดนำส่งสินค้าต้นทาง',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:135, y:219, w:150, h:12,field:'from',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:300, y:219, w:80, h:12,text:'จุดรับสินค้าปลายทาง',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:385, y:219, w:150, h:12,field:'to',fontSize:12,bold:false,align: 'left'}
      ]
    }
  ],
  PH: [
    {
      items: [
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 21, y: 16, text: 'Master waybill no.', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 21, y: 30, text: 'หมายเลขตราส่งสินค้า', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 107, y: 16, text: 'Size (LxWxH)', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 107, y: 30, text: 'ขนาดกล่อง(กว้างxยาวxสูง)', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 193, y: 16, text: 'Gorss weight', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 193, y: 30, text: 'น้ำหนักรวม', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 279, y: 16, text: 'Origin Code', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 279, y: 30, text: 'รหัสต้นทาง', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 365, y: 16, text: 'Destination Code', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 365, y: 30, text: 'รหัสปลายทาง', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 451, y: 16, text: 'Remarks', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 86, h: 10, x: 451, y: 30, text: 'หมายเหตุ', },
        { type: 'line', x1: 21, x2: 21, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 107, x2: 107, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 193, x2: 193, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 279, x2: 279, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 365, x2: 365, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 451, x2: 451, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 537, x2: 537, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 21, x2: 537, y1: 12, y2: 12, lineWidth: 1, },
        { type: 'line', x1: 21, x2: 537, y1: 48, y2: 48, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'number', align: 'center', fontSize: 10, w: 78, h: 6, x: 25, y: 4, field: 'intransit_no', },
        { type: 'text', align: 'left', fontSize: 10, w: 78, h: 6, x: 111, y: 4, field: 'size', },
        { type: 'text', align: 'right', fontSize: 10, w: 65, h: 6, x: 197, y: 4, field: 'gross_weight', },
        { type: 'text', align: 'right', fontSize: 10, w: 78, h: 6, x: 197, y: 4, text: 'Kgs.', },
        { type: 'text', align: 'left', fontSize: 10, w: 78, h: 6, x: 283, y: 4, field: 'origit_code', },
        { type: 'text', align: 'left', fontSize: 10, w: 78, h: 6, x: 369, y: 4, field: 'destination_code', },
        { type: 'text', align: 'left', fontSize: 10, w: 78, h: 6, x: 455, y: 4, field: 'remark', },
        { type: 'line', x1: 21, x2: 21, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 107, x2: 107, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 193, x2: 193, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 279, x2: 279, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 365, x2: 365, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 451, x2: 451, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 537, x2: 537, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 21, x2: 537, y1: 18, y2: 18, lineWidth: 0.5, style:'dotted' },
      ]
    }
  ],
  PF: [
    {

      items: [
        { type: 'line', x1: 21, x2: 21, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 107, x2: 107, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 193, x2: 193, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 279, x2: 279, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 365, x2: 365, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 451, x2: 451, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 21, x2: 537, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 537, x2: 537, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
  RF: [
    {
      items: [
        {
          type:'text',
          text: 'Report Footer'
        }
      ]
    }
  ]
};
