var path = require('path');
var report = {
  pageSize: 'A4',
  pageOrientation: 'portrait',
  margin: [18, 18, 18, 18],
  pageFooter: true,
  RH: [
    {
      items: [
        {type:'image',x:195, y:2, fit:[150, 62],image: './images/Onexlogo.png'},
        {
          type:'text',x:0, y:63, w:540, h:13,
          text:'1000/125 SOI SUKHUMVIT 55 (THONGLOR), SUKHUMVIT RD., NORTH KLONGTON, WATTANA, BANGKOK, 10110 THAILAND',
          fontSize:12,bold:false,align: 'center'},
        {type:'text',x:0, y:75, w:540, h:12,text:'Hotline : +66(0)2 381 5001-6',fontSize:12,bold:true,align: 'center'},
        {type:'text',x:0, y:95, w:540, h:16,text:'Payment tracking / เอกสารติดตามยอดลูกค้า',fontSize:16,bold:true,align: 'center'},

        {type:'text',x:163, y:123, w:80, h:12,text:'Booking date From : ',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:243, y:123, w:75, h:12,field:'p_from',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:303, y:123, w:70, h:12,text:'To : ',fontSize:12,bold:false,align: 'left'},
        {type:'text',x:323, y:123, w:75, h:12,field:'p_to',fontSize:12,bold:false,align: 'left'},

        // {type:'text',x:55, y:135, w:75, h:12,text:'Manifest No.',fontSize:12,bold:true,align: 'left'},
        {type:'text',x:218, y:135, w:70, h:12,text:'Payment status : ',fontSize:12,bold:true,align: 'left'},
        {type:'text',x:288, y:135, w:70, h:12,field:'p_status',fontSize:12,bold:true,align: 'left'}
      ]
    }
  ],
  PH: [
    {
      height: 100,
      autoShrink: true,
      items: [

        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 35, h: 10, x: 19, y: 16, text: 'NO.', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 65, h: 10, x: 54, y: 16, text: 'Booking no.', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 95, h: 10, x: 119, y: 16, text: 'Client', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 65, h: 10, x: 214, y: 16, text: 'Booking date', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 65, h: 10, x: 279, y: 16, text: 'Pickup date', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 65, h: 10, x: 344, y: 16, text: 'Payment type', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 65, h: 10, x: 409, y: 16, text: 'Payment status', },
        { type: 'text', align: 'center', bold: true, fontSize: 11, w: 65, h: 10, x: 474, y: 16, text: 'Total amount', },
        { type: 'line', x1: 19, x2: 19, y1: 12, y2: 31, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 54, y1: 12, y2: 31, lineWidth: 0.5, },
        { type: 'line', x1: 119, x2: 119, y1: 12, y2: 31, lineWidth: 0.5, },
        { type: 'line', x1: 214, x2: 214, y1: 12, y2: 31, lineWidth: 0.5, },
        { type: 'line', x1: 279, x2: 279, y1: 12, y2: 31, lineWidth: 0.5, },
        { type: 'line', x1: 344, x2: 344, y1: 12, y2: 31, lineWidth: 0.5, },
        { type: 'line', x1: 409, x2: 409, y1: 12, y2: 31, lineWidth: 0.5, },
        { type: 'line', x1: 474, x2: 474, y1: 12, y2: 31, lineWidth: 0.5, },
        { type: 'line', x1: 539, x2: 539, y1: 12, y2: 31, lineWidth: 0.5, },
        { type: 'line', x1: 19, x2: 539, y1: 12, y2: 12, lineWidth: 1, },
        { type: 'line', x1: 19, x2: 539, y1: 31, y2: 31, lineWidth: 1, },
      ]
    }
  ],
  DT: [
    {
      autoShrink: true,
      items: [

        { type: 'number', align: 'center', fontSize: 10, w: 27, h: 6, x: 23, y: 4, field: 'no', },
        { type: 'text', align: 'center', fontSize: 10, w: 57, h: 6, x: 58, y: 4, field: 'booking_no', },
        { type: 'text', align: 'left', fontSize: 10, w: 87, h: 6, x: 123, y: 4, field: 'customer_name', },
        { type: 'text', align: 'center', fontSize: 10, w: 57, h: 6, x: 218, y: 4, field: 'booking_date', },
        { type: 'text', align: 'center', fontSize: 10, w: 57, h: 6, x: 283, y: 4, field: 'pickup_date', },
        { type: 'text', align: 'left', fontSize: 10, w: 57, h: 6, x: 348, y: 4, field: 'payment_type', },
        { type: 'text', align: 'center', fontSize: 10, w: 57, h: 6, x: 413, y: 4, field: 'payment_status', },
        { type: 'text', align: 'right', fontSize: 10, w: 57, h: 6, x: 478, y: 4, field: 'total_amount', },
        { type: 'line', x1: 19, x2: 19, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 54, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 119, x2: 119, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 214, x2: 214, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 279, x2: 279, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 344, x2: 344, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 409, x2: 409, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 474, x2: 474, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 539, x2: 539, y1: 0, y2: 18, lineWidth: 0.5, },
        { type: 'line', x1: 19, x2: 539, y1: 18, y2: 18, lineWidth: 0.5, style:'dotted' },
      ]
    }
  ],
  RF: [
    {
      autoShrink: true,
      items: [

      ]
    }
  ],
  PF: [
    {
      autoShrink: true,
      items: [
        { type: 'line', x1: 19, x2: 19, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 54, x2: 54, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 119, x2: 119, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 214, x2: 214, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 279, x2: 279, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 344, x2: 344, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 409, x2: 409, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 474, x2: 474, y1: 0, y2: 2, lineWidth: 0.5, },
        { type: 'line', x1: 19, x2: 539, y1: 2, y2: 2, lineWidth: 1 },
        { type: 'line', x1: 539, x2: 539, y1: 0, y2: 2, lineWidth: 0.5, },
      ]
    }
  ],
};
module.exports = report;
