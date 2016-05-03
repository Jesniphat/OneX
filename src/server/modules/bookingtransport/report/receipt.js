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
        // {
        //   type:'image',
        //   x:0, y:8, fit:[50, 50],
        //   image: './images/atta_logo.png'
        // },
        {
          type:'rectangle',
          x:0, y:0, w:540, h:45,
          lineWidth:1,
          radius:0
        },
        {
          type:'rectangle',
          x:400, y:5, w:135, h:35,
          lineWidth:1,
          radius:5
        },
        {
          type:'text',
          x:405,y:5,w:130,h:16,
          text:'TEMPORARY RECEIPT  NO:',
          align:'left',
          fontSize:16
        },
        {
          type:'text',
          x:405,y:17,w:130,h:20,
          text:'INV2016030001',
          align:'left',
          fontSize:20,
          bold:true
        },
        {
          type:'rectangle',
          x:0,y:50,w:310,h:100,
          lineWidth:1,
          radius:5
        },
        {
          type:'text',
          x:10,y:50,w:300,h:18,
          text:'BILLED',
          align:'left',
          fontSize:18,
          bold:true
        },
        {
          type:'text',
          x:10,y:68,w:300,h:16,
          text:'Address:',
          align:'left',
          fontSize:14,
          bold:true
        },
        {
          type:'text',
          x:10,y:84,w:300,h:66,
          text:'Nippon Sysits.,LTD\nMeanrod 1000/125 Soi Sukumvit 55 Sukhumvit Rd.\nNorth Klongton Wattana\nBangkok Thailand 10110',
          align:'left',
          lineHeight:0.7,
          fontSize:14
        },
        {
          type:'rectangle',
          x:315,y:50,w:225,h:100,
          lineWidth:1,
          radius:5
        },
        {
          type:'text',
          x:315,y:70,w:225,h:18,
          text:'BOOKING NO : 16030001',
          align:'center',
          fontSize:18,
          bold:true
        },
        {
          type:'text',
          x:315,y:88,w:225,h:18,
          text:'WAYBILL RECEIPT NO : 201603 0001',
          align:'center',
          fontSize:18,
          bold:true
        },
        {
          type:'text',
          x:315,y:106,w:225,h:18,
          text:'RECEIPT DATE : 17/03/2016',
          align:'center',
          fontSize:18,
          bold:true
        },
        {
          type:'rectangle',
          x:0,y:155,w:540,h:100,
          lineWidth:1,
          radius:5
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
          text:'21/03/2016',
          align:'left',
          fontSize:16
        },
        {
          type:'text',
          x:280,y:178,w:90,h:16,
          text:'QTY',
          align:'left',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:370,y:178,w:170,h:16,
          text:'3',
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
          text:'Bangkok (Sathon)',
          align:'left',
          fontSize:16
        },
        {
          type:'text',
          x:280,y:195,w:90,h:16,
          text:'TO',
          align:'left',
          fontSize:16,
          bold:true
        },
        {
          type:'text',
          x:370,y:195,w:170,h:16,
          text:'Phanom Penh',
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
          text:'ONE DAY',
          align:'left',
          fontSize:16
        },
        {
          type:'rectangle',
          x:0,y:260,w:540,h:27,
          lineWidth:1,
          radius:0
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
          text:'PRICE(THB)',
          align:'center',
          fontSize:15,
          bold:true
        },
        {
          type:'text',
          x:465,y:264,w:75,h:16,
          text:'AMOUNT(THB)',
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
          text:'Document',
          align:'left',
          fontSize:14
        },
        {
          type:'text',
          x:315,y:0,w:75,h:14,
          text:'3',
          align:'center',
          fontSize:14
        },
        {
          type:'text',
          x:390,y:0,w:63,h:16,
          text:'100.00',
          align:'right',
          fontSize:14
        },
        {
          type:'text',
          x:465,y:0,w:65,h:16,
          text:'300.00',
          align:'right',
          fontSize:14
        }
      ]
    }
  ],
  PF: [
    {
      items: [
        {
          type:'rectangle',
          x:0,y:0,w:540,h:73,
          lineWidth:1,
          radius:0
        },
        {
          type:'text',
          x:10,y:0,w:450,h:14,
          text:'SUB TOTAL',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:465,y:0,w:65,h:14,
          text:'300.00',
          align:'right',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:10,y:14,w:450,h:14,
          text:'DISCOUNT',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:465,y:14,w:65,h:14,
          text:'30.00',
          align:'right',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:10,y:28,w:450,h:14,
          text:'SURCHARGE',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:465,y:28,w:65,h:14,
          text:'30.00',
          align:'right',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:10,y:42,w:450,h:14,
          text:'TOTAL',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:465,y:42,w:65,h:14,
          text:'300.00',
          align:'right',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:390,y:56,w:140,h:14,
          text:'(three hundred baht)',
          align:'right',
          bold:true,
          fontSize:14
        },


        {
          type:'rectangle',
          x:0,y:78,w:540,h:60,
          lineWidth:1,
          radius:0
        },
        {
          type:'text',
          x:0,y:83,w:540,h:17,
          text:'THANK YOU FOR YOUR ORDER',
          align:'center',
          bold:true,
          fontSize:17
        },
        {
          type:'text',
          x:0,y:100,w:540,h:15,
          text:'BILLING INFORMATION',
          align:'center',
          bold:true,
          fontSize:15
        },
        {
          type:'text',
          x:0,y:115,w:540,h:14,
          text:'Siam Commerical Bank : Siam Paragon Branch : ACC No 123456789-1',
          align:'center',
          bold:true,
          fontSize:14
        },

        {
          type:'text',
          x:0,y:150,w:540,h:14,
          text:'COMPANY INFORMATION',
          align:'left',
          bold:true,
          fontSize:14
        },
        {
          type:'text',
          x:0,y:165,w:540,h:50,
          text:'Logistic one co., ltd (Head office) \nTaxpayer Identification Number : 123456789012 \n1000/125 Soi Sukumvit 55 Sukhumvit Rd. North Klongton Wattana Bangkok Thailand 10110 \nEmail onex@logisticone.com   Tel: 026754555',
          align:'left',
          bold:false,
          lineHeight:0.5,
          fontSize:12
        },
      ]
    }
  ],
  RF: [
    {
      items: []
    }
  ]
};