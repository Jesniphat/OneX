var React         = require('react');
var Router        = require('react-router');
var tr            = require('counterpart');
var T             = require('react-translate-component');
var LineChart     = require("react-chartjs").Line;
var PieChart      = require("react-chartjs").Pie;
var system        = require('ss-system');

var systemActions = system.systemActions; //require('../system/actions');
var menuActions   = system.menuActions; //require('../system/actions/menu');
var infoPanelActions  = system.infoPanelActions;

var Inspection        = require('./inspection/inspection.jsx');
var Contract          = require('./contract/contract.jsx');
var Barcode           = require('./barcode/barcode.jsx');
var CommissionOpen    = require('./commission-open/commission.jsx');
var CommissionClose   = require('./commission-close-new/commission.jsx');
var Recontract        = require('./recontract/recontract.jsx');
var ReportOthers      = require('./others/others.jsx');
var ReportComOpen      = require('./report-commission-open/commission.jsx');
var ReportComClose      = require('./report-commission-close/commission.jsx');

tr.registerTranslations('en', require('./lang/en'));
tr.registerTranslations('th', require('./lang/th'));

var App = {};

App.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setTheme(4);
    systemActions.updateTopPanel({
      code:'installment',
      name:'เงินผ่อน',
      icon:'shopping232'
    });
    menuActions.show([
      {id:'dashboard', route:'/installment/dashboard', label:'installment.menu.dashboard', icon:'show6',acl:['M_INSTALLMENT_DASHBOARD']},
      {id:'inspection', route:'/installment/inspection/detail', label:'installment.menu.inspection', icon:'search100',acl:['M_INSTALLMENT_INSPECTION']},
      {id:'contractPending', route:'/installment/contract/pending', label:'installment.menu.contractPending', icon:'sort52',acl:['M_INSTALLMENT_CONTRACTPENDING']},
      {id:'contractList', index:true, route:'/installment/contract', label:'installment.menu.contractList', icon:'show5',acl:['M_INSTALLMENT_CONTRACTLIST']},
      {id:'contractDunning', route:'/installment/contract/dunning', label:'installment.menu.contractDunning', icon:'show6',acl:['M_INSTALLMENT_CONTRACTDUNNING']},
      {id:'contractClose', route:'/installment/contract/close', label:'installment.menu.contractClose', icon:'show6',acl:['M_INSTALLMENT_CONTRACTCLOSE']},
      {id:'recontract', route:'/installment/recontract', label:'installment.menu.recontract', icon:'show6',acl:['M_INSTALLMENT_RECONTRACT']},
      {id:'contractCloseDiscount', route:'/installment/contract/closediscount', label:'installment.menu.contractCloseDiscount', icon:'show6',acl:['M_INSTALLMENT_CONTRACTCLOSEDISCOUNT']},
      {id:'commissionOpenList', route:'/installment/commission-open', label:'installment.menu.commissionOpenList', icon:'receipt9',acl:['M_INSTALLMENT_COMMISSIONOPENLIST']},
      {id:'commissionCloseList', route:'/installment/commission-close', label:'installment.menu.commissionCloseList', icon:'receipt9',acl:['M_INSTALLMENT_COMMISSIONCLOSELIST']},
      {id:'barcodeGenerator', route:'/installment/barcode-gen', label:'installment.menu.barcodeGenerator', icon:'blogger12',acl:['M_INSTALLMENT_BARCODEGENERATOR']},
      {id:'barcodePrint', route:'/installment/barcode-print', label:'installment.menu.barcodePrint', icon:'blogger12',acl:['M_INSTALLMENT_BARCODEPRINT']},
      {id:'report', route:'/installment/others', label:'installment.menu.others', icon:'sort52',acl:['M_INSTALLMENT_OTHERS']}
    ]);
  },
  render: function() {
    return this.props.children;
  }
});
//  {id:'report', route:'installment.others.others', label:'installment.menu.others', icon:'sort52',acl:['installment']}
App.Dashboard = React.createClass({
  getInitialState: function() {
    return {
      chartData: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
          }
        ]
      },
      chartData2: [
        {
          value: 300,
          color:"#F7464A",
          highlight: "#FF5A5E",
          label: "Red"
        },
        {
          value: 50,
          color: "#46BFBD",
          highlight: "#5AD3D1",
          label: "Green"
        },
        {
          value: 100,
          color: "#FDB45C",
          highlight: "#FFC870",
          label: "Yellow"
        }
      ]
    }
  },

  componentDidMount:function() {
    infoPanelActions.hide();
  },
  render: function() {
    var lineOptions = {
      scaleShowGridLines : true,
      scaleGridLineColor : "rgba(0,0,0,.05)",
      scaleGridLineWidth : 1,
      scaleShowHorizontalLines: true,
      scaleShowVerticalLines: true,
      bezierCurve : true,
      bezierCurveTension : 0.4,
      pointDot : true,
      pointDotRadius : 4,
      pointDotStrokeWidth : 1,
      pointHitDetectionRadius : 20,
      datasetStroke : true,
      datasetStrokeWidth : 2,
      datasetFill : true,
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
    };
    var pieOptions = {
      segmentShowStroke : true,
      segmentStrokeColor : "#fff",
      segmentStrokeWidth : 2,
      percentageInnerCutout : 0, // This is 0 for Pie charts
      animationSteps : 100,
      animationEasing : "easeOutBounce",
      animateRotate : true,
      animateScale : false,
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    }
    return (
      <div>
        <div className="box10 flex">
          <div className="panel5">
            <T content="installment.title.index"/>
          </div>
          <div className="panel5"></div>
        </div>
        <div className="box10 flex">
          <div className="panel5">
            <LineChart data={this.state.chartData} options={lineOptions} width="464" height="348"/>
          </div>
          <div className="panel5">
            <PieChart data={this.state.chartData2} options={pieOptions} width="464" height="348"/>
          </div>
        </div>
      </div>
    );
  }
});

// App.Routes = (
//   <Route name="installment" path="installment" handler={App.Index}>
//     <Router.DefaultRoute name="installment.dashboard" handler={App.Dashboard}/>
//     {Inspection.Routes}
//     {Contract.Routes}
//     {Recontract.Routes}
//     {CommissionOpen.Routes}
//     {CommissionClose.Routes}
//     {Barcode.Generator.Routes}
//     {Barcode.Print.Routes}
//     {ReportOthers.Routes}
//     {ReportComOpen.Routes}
//     {ReportComClose.Routes}
//   </Route>
// );

module.exports = App;
