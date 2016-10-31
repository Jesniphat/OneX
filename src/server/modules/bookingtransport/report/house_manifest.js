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
        {type:'text',x:0, y:95, w:540, h:16,text:'House cargo manifest / บัญชีกำกับสินค้า (รอง)',fontSize:16,bold:true,align: 'center'},

        {type:'text',x:300, y:111, w:70, h:12,text:'E.T.D',fontSize:12,bold:true,align: 'left'},

        {type:'text',x:55, y:123, w:75, h:12,text:'Date / วันที่ : ',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:135, y:123, w:75, h:12,field:'created_date',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:300, y:123, w:70, h:12,text:'วันที่ออกเดินทาง',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:385, y:123, w:75, h:12,field:'intransit_date',fontSize:12,bold:false,align: 'left'},

        {type:'text',x:55, y:135, w:75, h:12,text:'Master waybill no.',fontSize:12,bold:true,align: 'left'},
        {type:'text',x:300, y:135, w:70, h:12,text:'E.T.A',fontSize:12,bold:true,align: 'left'},

        {type:'text',x:55, y:147, w:75, h:12,text:'หมายเลขใบนำส่ง',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:135, y:147, w:75, h:12,field:'intransit_no',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:300, y:147, w:70, h:12,text:'วันที่ถึงปลายทาง',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:385, y:147, w:75, h:12,field:'accepted_date',fontSize:12,bold:false,align: 'left'},

        {type:'text',x:55, y:171, w:75, h:12,text:'Prepared by ',fontSize:12,bold:true,align: 'left'},
        {type:'text',x:300, y:171, w:80, h:12,text:'No. of house waybill',fontSize:12,bold:true,align: 'left'},

        {type:'text',x:55, y:183, w:75, h:12,text:'จัดทำโดย',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:135, y:183, w:75, h:12,field:'prepare_by',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:300, y:183, w:80, h:12,text:'จำนวนใบตราส่งสินค้า',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:385, y:183, w:75, h:12,field:'waybill_no',fontSize:12,bold:false,align: 'left'},

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
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 19, y: 16, text: 'Customer ID', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 19, y: 30, text: 'รหัสลูกค้า', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 84, y: 23, text: 'House Waybill No.', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 149, y: 23, text: 'Item No.', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 214, y: 16, text: 'Nature of Goods', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 214, y: 30, text: 'ประเภทสินค้า', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 279, y: 16, text: 'Gross Weight (Kg)', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 279, y: 30, text: 'น้ำหนักรวม', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 344, y: 16, text: 'Origin Code', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 344, y: 30, text: 'รหัสต้นทาง', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 409, y: 16, text: 'Destination Code', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 409, y: 30, text: 'รหัสปลายทาง', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 474, y: 16, text: 'Remarks', },
        { type: 'text', align: 'center', bold: true, fontSize: 9, w: 65, h: 10, x: 474, y: 30, text: 'หมายเหตุ', },
        { type: 'line', x1: 19, x2: 19, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 84, x2: 84, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 149, x2: 149, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 214, x2: 214, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 279, x2: 279, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 344, x2: 344, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 409, x2: 409, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 474, x2: 474, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 539, x2: 539, y1: 12, y2: 48, lineWidth: 0.5, },
        { type: 'line', x1: 19, x2: 539, y1: 12, y2: 12, lineWidth: 1, },
        { type: 'line', x1: 19, x2: 539, y1: 48, y2: 48, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [
        { type: 'text', align: 'center', fontSize: 8, w: 57, h: 6, x: 23, y: 4, field: 'person_code', },
        { type: 'text', align: 'left', fontSize: 8, w: 57, h: 6, x: 153, y: 4, field: 'item_no', },
        { type: 'text', align: 'center', fontSize: 8, w: 57, h: 6, x: 88, y: 4, field: 'waybill', },
        { type: 'text', align: 'left', fontSize: 8, w: 57, h: 6, x: 218, y: 4, field: 'product_name', },
        { type: 'text', align: 'right', fontSize: 8, w: 44, h: 6, x: 283, y: 4, field: 'gross_weight', },
        { type: 'text', align: 'right', fontSize: 8, w: 57, h: 6, x: 283, y: 4, text: 'Kgs.', },
        { type: 'text', align: 'left', fontSize: 8, w: 57, h: 6, x: 348, y: 4, field: 'origit_code', },
        { type: 'text', align: 'left', fontSize: 8, w: 57, h: 6, x: 413, y: 4, field: 'destination_code', },
        { type: 'text', align: 'left', fontSize: 8, w: 57, h: 6, x: 478, y: 4, field: 'remark', },
        // { type: 'line', x1: 19, x2: 19, y1: 0, y2: 18, lineWidth: 0.5, },
        // { type: 'line', x1: 84, x2: 84, y1: 0, y2: 18, lineWidth: 0.5, },
        // { type: 'line', x1: 149, x2: 149, y1: 0, y2: 18, lineWidth: 0.5, },
        // { type: 'line', x1: 214, x2: 214, y1: 0, y2: 18, lineWidth: 0.5, },
        // { type: 'line', x1: 279, x2: 279, y1: 0, y2: 18, lineWidth: 0.5, },
        // { type: 'line', x1: 344, x2: 344, y1: 0, y2: 18, lineWidth: 0.5, },
        // { type: 'line', x1: 409, x2: 409, y1: 0, y2: 18, lineWidth: 0.5, },
        // { type: 'line', x1: 474, x2: 474, y1: 0, y2: 18, lineWidth: 0.5, },
        // { type: 'line', x1: 539, x2: 539, y1: 0, y2: 18, lineWidth: 0.5, },
        // { type: 'line', x1: 19, x2: 539, y1: 18, y2: 18, lineWidth: 0.5, style:'dotted' },
      ]
    }
  ],
  PF: [
    {

      items: [
        // { type: 'text', align: 'center', fontSize: 8, w: 57, h: 6, x: 23, y: 4, text: 'Total Qty', },
        // { type: 'text', align: 'left', fontSize: 8, w: 57, h: 6, x: 153, y: 4, text: '', },
        // { type: 'text', align: 'center', fontSize: 8, w: 57, h: 6, x: 88, y: 4, text: '', },
        // { type: 'text', align: 'left', fontSize: 8, w: 57, h: 6, x: 218, y: 4, text: '', },
        // { type: 'text', align: 'right', fontSize: 8, w: 44, h: 6, x: 283, y: 4, field: 'intransit_qty', },
        // { type: 'text', align: 'right', fontSize: 8, w: 57, h: 6, x: 283, y: 4, text: '.', },
        // { type: 'text', align: 'left', fontSize: 8, w: 57, h: 6, x: 348, y: 4, text: '', },
        // { type: 'text', align: 'left', fontSize: 8, w: 57, h: 6, x: 413, y: 4, text: '', },
        // { type: 'text', align: 'left', fontSize: 8, w: 57, h: 6, x: 478, y: 4, text: '', },
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
