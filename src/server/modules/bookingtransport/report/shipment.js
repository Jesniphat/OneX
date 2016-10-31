module.exports = {
  pageSize: 'A4',
  margin: [18, 18, 18, 36], // top, right, bottom, left
  RH: [
    {
      items: []
    }
  ],
  PH: [
    {
      items: [
        {
          type:'image',
          x:0, y:15, fit:[100, 100],
          image: './images/Onexlogo.png'
        },
        {
          type:'text',
          x:110, y:0, w:336, h:16,
          text:'',
          fontSize:20,
          bold:true
        },
        {
          type:'text',
          x:110, y:15, w:336, h:13,
          text:'LOGISTICS ONE CO.,LTD',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:110, y:29, w:336, h:42,
          text:'1000/125 SOI SUKHUMVIT 55 (THONGLOR),SUKHUMVIT RD.,\n' +
            'NORTH KLONGTON, WATTANA,BANGKOK 10110 THAILAND',
          style:'addr',
          fontSize:14,
          lineHeight:0.6
        },
        {
          type:'line',
          x1:0, y1:65, x2:540, y2:65,
          lineWidth:1
        },
        {
          type:'text',
          x:260, y:66, w:280, h:30,
          text:'BOOKING CONFIRMATION',
          align:'right',
          fontSize:30,
          bold:true
        },
        {
          type:'text',
          x:328, y:96, w:110, h:16,
          text:'WAYBILL NUMBER: ',
          align:'right',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:450, y:96, w:90, h:16,
          field:'waybill',
          align:'right',
          fontSize:16
        },
        {
          type:'text',
          x:328, y:112, w:110, h:16,
          text:'BOOKING NO: ',
          align:'right',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:450, y:112, w:90, h:16,
          field:'booking_no',
          align:'right',
          fontSize:16
        },
        {
          type:'text',
          x:328, y:128, w:110, h:16,
          text:'SHIPMENT DATE: ',
          align:'right',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:450, y:128, w:90, h:16,
          field:'pickup_date',
          align:'right',
          fontSize:16
        },
        {
          type:'text',
          x:328, y:144, w:110, h:16,
          text:'BOOKING DATE: ',
          align:'right',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:450, y:144, w:90, h:16,
          field:'booking_date',
          align:'right',
          fontSize:16
        },
        {
          type:'line',
          x1:0, y1:170, x2:540, y2:170,
          lineWidth:1
        },
        // BODY
        // {
        //   type:'rectangle',
        //   x:0, y:160, w:540, h:85,
        //   lineWidth:1,
        //   radius:6
        // },
        {
          type:'text',
          x:5,y:177,w:100,h:16,
          text:'Sender',
          align:'left',
          bold:true,
          fontSize:16
        },
        {
          type:'text',
          x:105,y:177,w:155,h:70,
          field:'sender',
          align:'left',
          fontSize:14,
          lineHeight:0.7
        },
        {
          type:'text',
          x:285,y:177,w:100,h:16,
          text:'Receipient',
          align:'left',
          bold:true,
          fontSize:16
        },
        {
          type:'text',
          x:385,y:177,w:155,h:70,
          field:'receipient',
          align:'left',
          fontSize:14,
          lineHeight:0.7
        },


        {
          type:'image',
          x:0, y:245, fit:[540, 50],
          image: './images/greybg.png'
        },
        {
          type:'text',
          x:3,y:244,w:537,h:16,
          text:'Booking details',
          align:'left',
          bold:true,
          fontSize:16
        },

        {
          type:'text',
          x:3,y:265,w:82,h:14,
          text:'Shipment Date',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:85,y:265,w:10,h:14,
          text:':',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:100,y:265,w:170,h:14,
          field:'pickup_date',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:3,y:279,w:82,h:14,
          text:'Waybill Number',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:85,y:279,w:10,h:14,
          text:':',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:100,y:279,w:170,h:14,
          field:'waybill',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:315,y:265,w:90,h:14,
          text:'Number of Pieces',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:405,y:265,w:5,h:14,
          text:':',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:425,y:265,w:115,h:14,
          field:'item_qty',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:315,y:279,w:90,h:14,
          text:'Gross Weight',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:405,y:279,w:5,h:14,
          text:':',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:425,y:279,w:115,h:14,
          field:'total_weight',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:315,y:293,w:90,h:14,
          text:'Volumn Weight',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:405,y:293,w:5,h:14,
          text:':',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:425,y:293,w:115,h:14,
          field:'total_volume_weight',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:315,y:307,w:90,h:14,
          text:'Chargeable Weight',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:405,y:307,w:5,h:14,
          text:':',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:425,y:307,w:115,h:14,
          field:'chargeable',
          align:'left',
          fontSize:14
        },


        {
          type:'text',
          x:0,y:319,w:540,h:16,
          text:'Fare',
          align:'left',
          bold:true,
          fontSize:16
        },
        {
          type:'text',
          x:270,y:335,w:45,h:16,
          text:'Quantity',
          align:'center',
          fontSize:16
        },
        {
          type:'text',
          x:315,y:335,w:45,h:16,
          text:'Width',
          align:'center',
          fontSize:16
        },
        {
          type:'text',
          x:360,y:335,w:45,h:16,
          text:'Depth',
          align:'center',
          fontSize:16
        },
        {
          type:'text',
          x:405,y:335,w:45,h:16,
          text:'Height',
          align:'center',
          fontSize:16
        },
        {
          type:'text',
          x:450,y:335,w:35,h:16,
          text:'Total',
          align:'center',
          fontSize:16
        },
        {
          type:'text',
          x:495,y:335,w:45,h:16,
          text:'',
          align:'center',
          fontSize:16
        },
        {
          type:'line',
          x1:0, y1:355, x2:540, y2:355,
          lineWidth:1
        },
      ]
    }
  ],
  DT: [
    {
      items: [
        {
          type:'text',
          x:0,y:3,w:270,h:14,
          field:'booking_name',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:270,y:3,w:45,h:14,
          field:'qty',
          align:'center',
          fontSize:14
        },
        {
          type:'text',
          x:315,y:3,w:45,h:14,
          field:'width',
          align:'right',
          fontSize:14
        },
        {
          type:'text',
          x:360,y:3,w:45,h:14,
          field:'depth',
          align:'right',
          fontSize:14
        },
        {
          type:'text',
          x:405,y:3,w:45,h:14,
          field:'height',
          align:'right',
          fontSize:14
        },
        {
          type:'text',
          x:450,y:3,w:45,h:14,
          field:'total_price',
          align:'right',
          fontSize:14
        },
        {
          type:'text',
          x:495,y:3,w:45,h:14,
          field:'currency',
          align:'center',
          fontSize:14
        }
      ]
    }
  ],
  PF: [
    {
      items: [
        {
          type:'line',
          x1:0, y1:10, x2:540, y2:10,
          lineWidth:1
        },
        {
          type:'text',
          x:0,y:10,w:450,h:14,
          text:'Sub total',
          align:'left',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:450,y:10,w:45,h:14,
          field:'sub_total',
          align:'right',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:495,y:10,w:45,h:14,
          field:'currency',
          align:'center',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:0,y:24,w:450,h:14,
          text:'Discount',
          align:'left',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:450,y:24,w:45,h:14,
          field:'discount_amount',
          align:'right',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:495,y:24,w:45,h:14,
          field:'currency',
          align:'center',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:0,y:38,w:450,h:14,
          text:'Surcharge',
          align:'left',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:450,y:38,w:45,h:14,
          field:'charge_amount',
          align:'right',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:495,y:38,w:45,h:14,
          field:'currency',
          align:'center',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:0,y:52,w:450,h:14,
          field:'vat_text',
          align:'left',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:450,y:52,w:45,h:14,
          field:'vat_amount',
          align:'right',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:495,y:52,w:45,h:14,
          field:'currency',
          align:'center',
          bold:false,
          fontSize:14
        },
        {
          type:'text',
          x:0,y:66,w:450,h:14,
          text:'Grand Total',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:450,y:66,w:45,h:14,
          field:'grand_total_amount',
          align:'right',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:495,y:66,w:45,h:14,
          field:'currency',
          align:'center',
          bold:true,
          fontSize:14
        },



        {
          type:'image',
          x:0, y:90, fit:[540, 50],
          image: './images/greybg.png'
        },
        {
          type:'text',
          x:3,y:89,w:537,h:16,
          text:'Payment details',
          align:'left',
          bold:true,
          fontSize:16
        },

        {
          type:'text',
          x:3,y:120,w:500,h:30,
          field:'payment_status',
          align:'left',
          fontSize:27
        },

        {
          type:'line',
          x1:0, y1:175, x2:540, y2:175,
          lineWidth:1
        }
      ]
    }
  ],
  RF: [
    {
      items: [
        // {
        //     type:'text',
        //     x:3,y:190,w:537,h:50,
        //     text:'Reference information \nPick up booking referencee:  134370 \nDiscription of contents:  Form FTA & Copy of Bill of Lading : CI-2119-007,CI-2118-026,CI-2117-130',
        //     align:'left',
        //     fontSize:10
        // }
      ]
    }
  ]
};
