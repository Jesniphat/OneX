module.exports = {
  pageSize: 'A4',
  margin: [18, 18, 18, 36], // top, right, bottom, left
  RH: [
    {
      items: []
    }
  ],
  PH: [],
  DT: [
    {
      items: [
        {
          type:'line',
          x1:0, y1:0, x2:320, y2:0,
          lineWidth:1
        },
        {
          type:'line',
          x1:0, y1:0, x2:0, y2:52,
          lineWidth:1
        },
        {
          type:'image',
          x:0, y:10, fit:[100, 100],
          image: './images/Onexlogo.png'
        },
        {
          type:'text',
          x:70, y:3, w:250, h:14,
          text:'LOGISTICS ONE CO.,LTD',
          align:'center',
          fontSize:14,
          bold:true
        },
        {
          type:'text',
          x:70, y:18, w:250, h:25,
          text:'1000/125 SOI SUKHUMVIT 55 (THONGLOR),SUKHUMVIT RD.,\n' +
               'NORTH KLONGTON, WATTANA,BANGKOK 10110 THAILAND',
          style:'addr',
          fontSize:12,
          lineHeight:0.6,
          align:'center'
        },
        {
          type:'text',
          x:30, y:36, w:336, h:14,
          text:'Hotline : 02-381-5001-6',
          style:'addr',
          fontSize:14,
          bold:true,
          align:'center'
        },
        {
          type:'line',
          x1:0, y1:52, x2:320, y2:52,
          lineWidth:1
        },
        {
          type:'line',
          x1:320, y1:0, x2:320, y2:52,
          lineWidth:1
        },
        {
          type:'line',
          x1:0, y1:52, x2:0, y2:120,
          lineWidth:1
        },
        {
          type:'text',
          x:10, y:60, w:310, h:14,
          text:'From / จาก ',
          fontSize:12,
          bold:true,
        },
        {
          type:'text',
          x:180, y:55, w:90, h:14,
          text:'Origin / ต้นทาง : ',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:270, y:53, w:30, h:20,
          text:'BKK',
          fontSize:18,
          align:'right',
          bold:true,
        },
        {
          type:'text',
          // x:0, y:74, w:320, h:43,
          x:0, y:69, w:320, h:55,
          field:'sender',
          fontSize:12,
          lineHeight:0.6,
          align:'center',
        },
        {
          type:'line',
          x1:320, y1:52, x2:320, y2:120,
          lineWidth:1
        },
        {
          type:'line',
          x1:0, y1:120, x2:320, y2:120,
          lineWidth:1
        },
        
        {
          type:'line',
          x1:0, y1:120, x2:0, y2:188,
          lineWidth:1
        },
        {
          type:'text',
          x:10, y:128, w:310, h:14,
          text:'Ship To / ส่งถึง ',
          fontSize:12,
          bold:true,
        },
        {
          type:'text',
          x:180, y:124, w:90, h:14,
          text:'Destination / ปลายทาง : ',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:270, y:121, w:30, h:20,
          text:'PHN',
          fontSize:18,
          align:'right',
          bold:true,
        },
        {
          type:'text',
          // x:0, y:142, w:320, h:43,
          x:0, y:137, w:320, h:55,
          field:'receipient',
          fontSize:12,
          lineHeight:0.6,
          align:'center',
        },
        {
          type:'line',
          x1:320, y1:120, x2:320, y2:188,
          lineWidth:1
        },
        {
          type:'line',
          x1:0, y1:188, x2:320, y2:188,
          lineWidth:1
        },
        
        {
          type:'line',
          x1:0, y1:188, x2:0, y2:217,
          lineWidth:1
        },
        {
          type:'text',
          x:10, y:190, w:310, h:14,
          text:'Date / วันที่ ',
          fontSize:12,
        },
        {
          type:'text',
          x:0, y:190, w:320, h:14,
          text:'Weight / น้ำหนัก ',
          fontSize:12,
          align:'center',
        },
        {
          type:'text',
          x:0, y:190, w:310, h:14,
          text:'Piece ชิ้นที่ ',
          fontSize:12,
          align:'right',
          bold:true,
        },
        {
          type:'text',
          x:10, y:202, w:310, h:14,
          field:'pickup_date',
          fontSize:12,
        },
        {
          type:'text',
          x:0, y:202, w:320, h:14,
          field:'total_weight',
          fontSize:12,
          align:'center',
        },
        {
          type:'text',
          x:0, y:202, w:310, h:14,
          field:'piece',
          fontSize:12,
          align:'right',
          bold:true,
        },
        {
          type:'line',
          x1:320, y1:188, x2:320, y2:217,
          lineWidth:1
        },
        {
          type:'line',
          x1:0, y1:217, x2:320, y2:217,
          lineWidth:1
        },
        
        {
          type:'line',
          x1:0, y1:217, x2:0, y2:247,
          lineWidth:1
        },
        {
          type:'text',
          x:10, y:220, w:310, h:14,
          text:'Content / รายละเอียดสินค้า :',
          fontSize:12,
          bold:true,
        },
        {
          type:'text',
          x:110, y:220, w:210, h:28,
          field:'booking_name',
          lineHeight:0.6,
          fontSize:12,
        },
        {
          type:'line',
          x1:320, y1:217, x2:320, y2:247,
          lineWidth:1
        },
        {
          type:'line',
          x1:0, y1:247, x2:320, y2:247,
          lineWidth:1
        },
        
        {
          type:'line',
          x1:0, y1:247, x2:0, y2:317,
          lineWidth:1
        },
        {
          type:'barcode',
          x:40, y:250, w:250, h:40,
          format:'code128',
          field:'waybill',
        },
        {
          type:'text',
          x:50, y:298, w:90, h:14,
          text:'House Waybill No. ',
          fontSize:14,
          bold:true,
        },
        {
          type:'text',
          x:140, y:295, w:120, h:19,
          field:'waybill',
          fontSize:18,
          bold:true,
        },
        {
          type:'line',
          x1:320, y1:247, x2:320, y2:317,
          lineWidth:1
        },
        {
          type:'line',
          x1:0, y1:317, x2:320, y2:317,
          lineWidth:1
        },
        
        {
          type:'line',
          x1:0, y1:317, x2:0, y2:387,
          lineWidth:1
        },
        {
          type:'barcode',
          x:40, y:320, w:250, h:40,
          format:'code128',
          field:'item_no',
        },
        {
          type:'text',
          x:50, y:368, w:90, h:14,
          text:'Item No. ',
          fontSize:14,
          bold:true,
        },
        {
          type:'text',
          x:95, y:365, w:120, h:19,
          field:'item_no',
          fontSize:18,
          bold:true,
        },
        {
          type:'line',
          x1:320, y1:317, x2:320, y2:387,
          lineWidth:1
        },
        {
          type:'line',
          x1:0, y1:387, x2:320, y2:387,
          lineWidth:1
        },
        {
          type:'text',
          x:0, y:387, w:320, h:10,
          text:'',
          fontSize:12,
          bold:true,
        },
      ]
    }
  ],
  PF: [],
  RF: [
    {
      items: []
    }
  ]
};
