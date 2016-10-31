module.exports = {
  pageSize: 'A4',
  margin: [18, 18, 18, 36], //
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
          x:3, y:10, fit:[90, 90],
          image: './images/Onexlogo.png'
        },
        {
          type:'text',
          x:73, y:3, w:250, h:14,
          text:'LOGISTICS ONE CO.,LTD',
          align:'center',
          fontSize:14,
          bold:true
        },
        {
          type:'text',
          x:73, y:18, w:250, h:25,
          text:'1000/125 SOI SUKHUMVIT 55 (THONGLOR),SUKHUMVIT RD.,\n' +
               'NORTH KLONGTON, WATTANA,BANGKOK 10110 THAILAND',
          style:'addr',
          fontSize:10,
          lineHeight:0.6,
          align:'center'
        },
        {
          type:'text',
          x:33, y:36, w:336, h:14,
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
          x1:0, y1:120-68, x2:0, y2:188-68,
          lineWidth:1
        },
        {
          type:'text',
          x:10, y:128-68, w:310, h:14,
          text:'Ship To / ส่งถึง ',
          fontSize:12,
          bold:true,
        },
        {
          type:'text',
          x:160, y:124-68, w:70, h:14,
          text:'Date / วันที่ : ',
          fontSize:12,
          align:'right'
        },
        {
          type:'text',
          x:233, y:124-68, w:107, h:14,
          field:'intransit_date',
          fontSize:12,
          align:'left'
        },
        {
          type:'text',
          x:0, y:142-68, w:320, h:50,
          field:'receipient',
          fontSize:12,
          lineHeight:0.6,
          align:'center',
        },
        {
          type:'line',
          x1:320, y1:120-68, x2:320, y2:188-68,
          lineWidth:1
        },
        {
          type:'line',
          x1:0, y1:188-68, x2:320, y2:188-68,
          lineWidth:1
        },

        {
          type:'line',
          x1:0, y1:188-68, x2:0, y2:217-68,
          lineWidth:1
        },
        {
          type:'text',
          x:10, y:190-68, w:310, h:30,
          text:'Weight / น้ำหนัก ',
          fontSize:20,
          bold:true,
        },
        {
          type:'text',
          x:120, y:190-68, w:200, h:30,
          field:'total_weight',
          fontSize:20,
          align:'left',
          bold:true,
        },

        {
          type:'line',
          x1:320, y1:188-68, x2:320, y2:217-68,
          lineWidth:1
        },
        {
          type:'line',
          x1:0, y1:217-68, x2:320, y2:217-68,
          lineWidth:1
        },


        {
          type:'line',
          x1:0, y1:217-68, x2:0, y2:287-68,
          lineWidth:1
        },
        {
          type:'barcode',
          x:40, y:220-68, w:250, h:40,
          format:'code128',
          field:'waybill',
        },
        {
          type:'text',
          x:50, y:268-68, w:90, h:14,
          text:'House Waybill No. ',
          fontSize:14,
          bold:true,
        },
        {
          type:'text',
          x:140, y:265-68, w:120, h:19,
          field:'waybill',
          fontSize:18,
          bold:true,
        },
        {
          type:'line',
          x1:320, y1:217-68, x2:320, y2:287-68,
          lineWidth:1
        },
        {
          type:'line',
          x1:0, y1:287-68, x2:320, y2:287-68,
          lineWidth:1
        },
        {
          type:'text',
          x:0, y:357-68, w:320, h:10,
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
