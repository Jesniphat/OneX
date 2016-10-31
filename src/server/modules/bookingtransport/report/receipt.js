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
          x:0, y:0, fit:[540, 45],
          image: './images/Proforma-invoice-head.png'
        },
        // {
        //   type:'rectangle',
        //   x:0, y:0, w:540, h:45,
        //   lineWidth:0,
        //   radius:0
        // },
        // {
        //   type:'rectangle',
        //   x:400, y:5, w:135, h:35,
        //   lineWidth:0,
        //   radius:5
        // },
        {
          type:'text',
          x:405,y:5,w:130,h:16,
          text:'TEMPORARY RECEIPT NO:',
          align:'left',
          fontSize:16
        },
        {
          type:'text',
          x:405,y:17,w:123,h:20,
          field:'receipt_no',
          align:'right',
          fontSize:20,
          bold:true
        },
        //proforma-invoice#1
        {
        //   type:'rectangle',
        //   x:0,y:50,w:310,h:100,
        //   lineWidth:1,
        //   radius:5
          type:'image',
          x:0, y:50, fit:[310, 100],
          image: './images/proforma-invoice#1.png'
        },
        {
          type:'text',
          x:10,y:50,w:300,h:18,
          text:'BILLED',
          align:'left',
          fontSize:18,
          bold:true
        },
        // {
        //   type:'text',
        //   x:10,y:68,w:300,h:16,
        //   text:'Address:',
        //   align:'left',
        //   fontSize:14,
        //   bold:true
        // },
        {
          type:'text',
          x:10,y:68,w:300,h:66,
          field:'sender',
          align:'left',
          lineHeight:0.7,
          fontSize:14
        },
        // proforma-invoice#2
        {
        //   type:'rectangle',
        //   x:315,y:50,w:225,h:100,
        //   lineWidth:1,
        //   radius:5
          type:'image',
          x:315, y:50, fit:[225, 100],
          image: './images/proforma-invoice#2.png'
        },
        {
          type:'text',
          x:325,y:70,w:225,h:18,
          field:'booking_no',
          align:'left',
          fontSize:18,
          bold:true
        },
        {
          type:'text',
          x:325,y:88,w:225,h:18,
          field:'waybill',
          align:'left',
          fontSize:18,
          bold:true
        },
        {
          type:'text',
          x:325,y:106,w:225,h:18,
          field:'receipt_date',
          align:'left',
          fontSize:18,
          bold:true
        },
        // proforma-invoice#3
        {
        //   type:'rectangle',
        //   x:0,y:155,w:540,h:100,
        //   lineWidth:1,
        //   radius:5
          type:'image',
          x:0, y:155, fit:[540, 100],
          image: './images/proforma-invoice#3.png'
        },
        {
          type:'text',
          x:10,y:155,w:530,h:20,
          text:'PICKUP DETAILS',
          align:'left',
          fontSize:20,
          bold:true
        },
        {
          type:'text',
          x:10,y:178,w:90,h:16,
          text:'PICKUP DATE',
          align:'left',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:100,y:178,w:170,h:16,
          field:'pickup_date',
          align:'left',
          fontSize:16
        },
        {
          type:'text',
          x:325,y:178,w:90,h:16,
          text:'QTY',
          align:'left',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:370,y:178,w:170,h:16,
          field:'qty',
          align:'left',
          fontSize:16
        },
        {
          type:'text',
          x:10,y:195,w:90,h:16,
          text:'FROM',
          align:'left',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:100,y:195,w:170,h:16,
          field:'from_place',
          align:'left',
          fontSize:16
        },
        {
          type:'text',
          x:325,y:195,w:90,h:16,
          text:'TO',
          align:'left',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:370,y:195,w:170,h:16,
          field:'to_place',
          align:'left',
          fontSize:16
        },
        {
          type:'text',
          x:10,y:212,w:90,h:16,
          text:'DELIVERY TYPE',
          align:'left',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:100,y:212,w:170,h:16,
          field:'delivery_type',
          align:'left',
          fontSize:16
        },
        // Proforma-invoice-red
        {
        //   type:'rectangle',
        //   x:0,y:260,w:540,h:27,
        //   lineWidth:1,
        //   radius:0
          type:'image',
          x:0, y:260, fit:[540, 27],
          image: './images/Proforma-invoice-red.png'
        },
        {
          type:'text',
          x:10,y:264,w:230,h:16,
          text:'DESCRIPTION',
          align:'left',
          fontSize:15,
          bold:true
        },
        {
          type:'text',
          x:315,y:264,w:75,h:16,
          text:'QTY',
          align:'center',
          fontSize:15,
          bold:true
        },
        {
          type:'text',
          x:390,y:264,w:75,h:16,
          field:'price_text',
          align:'center',
          fontSize:15,
          bold:true
        },
        {
          type:'text',
          x:465,y:264,w:75,h:16,
          field:'amount_text',
          align:'center',
          fontSize:15,
          bold:true
        },
      ]
    }
  ],
  DT: [
    {
      items: [
        {
          type:'text',
          x:10,y:0,w:270,h:14,
          field:'description',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:315,y:0,w:75,h:14,
          field:'item_qty',
          align:'center',
          fontSize:14
        },
        {
          type:'text',
          x:390,y:0,w:63,h:14,
          field:'total_price',
          align:'right',
          fontSize:14
        },
        {
          type:'text',
          x:465,y:0,w:65,h:14,
          field:'amount',
          align:'right',
          fontSize:14
        }
      ]
    }
  ],
  PF: [
    {
      items: [
          //Proforma-invoice-Total
        // {
        // //   type:'rectangle',
        // //   x:0,y:3,w:540,h:73,
        // //   lineWidth:1,
        // //   radius:0
        //   type:'image',
        //   x:0, y:3, fit:[540, 73],
        //   image: './images/Proforma-invoice-Total.png'
        // },
        {
          type:'text',
          x:10,y:3,w:450,h:14,
          text:'SUB TOTAL',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:465,y:3,w:65,h:14,
          field:'sub_total',
          align:'right',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:10,y:17,w:450,h:14,
          text:'DISCOUNT',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:465,y:17,w:65,h:14,
          field:'discount_amount',
          align:'right',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:10,y:31,w:450,h:14,
          text:'SURCHARGE',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:465,y:31,w:65,h:14,
          field:'charge_amount',
          align:'right',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:10,y:45,w:450,h:14,
          field:'vat_text',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:465,y:45,w:65,h:14,
          field:'vat_amount',
          align:'right',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:10,y:59,w:450,h:14,
          text:'GRAND TOTAL',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:465,y:59,w:65,h:14,
          field:'grand_total_amount',
          align:'right',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:0,y:73,w:539,h:14,
          field:'amountText',
          align:'right',
          bold:true,
          fontSize:14
        },


        //proforma-invoice#4
        {
        //   type:'rectangle',
        //   x:0,y:81,w:540,h:60,
        //   lineWidth:1,
        //   radius:0
          type:'image',
          x:0, y:96, fit:[540, 60],
          image: './images/proforma-invoice#4.png'
        },
        {
          type:'text',
          x:0,y:101,w:540,h:17,
          text:'THANK YOU FOR YOUR ORDER',
          align:'center',
          bold:true,
          fontSize:17
        },
        {
          type:'text',
          x:0,y:118,w:540,h:15,
          text:'BILLING INFORMATION',
          align:'center',
          bold:true,
          fontSize:15
        },
        {
          type:'text',
          x:0,y:133,w:540,h:14,
          text:'Siam Commerical Bank : Siam Paragon Branch : ACC No 123456789-1',
          align:'center',
          bold:true,
          fontSize:14
        },
      ]
    }
  ],
  RF: [
    {
      items: [
        {
          type:'text',
          x:0,y:318,w:540,h:14,
          text:'COMPANY INFORMATION',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:0,y:333,w:540,h:50,
          text:'Logistic one co., ltd (Head office) \nTaxpayer Identification Number : 123456789012 \n1000/125 Soi Sukumvit 55 Sukhumvit Rd. North Klongton Wattana Bangkok Thailand 10110 \nEmail onex@logisticone.com   Tel: 026754555',
          align:'left',
          bold:false,
          lineHeight:0.5,
          fontSize:12
        },
      ]
    }
  ]
};
