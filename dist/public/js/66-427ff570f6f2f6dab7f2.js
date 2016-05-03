webpackJsonp([66,68,69,70,73,75,78,81,84,85,87,135],{

/***/ 774:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] },
	  'saveNew': { children: ['done', 'error'] },
	  'delete': { children: ['done', 'error'] },
	  'getSellInfo': { children: ['done', 'error'] },
	  'getBarcode': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'listClose': { children: ['done', 'error'] },
	  'exportClose': { children: ['done', 'error'] },
	  'getCloseReturn': { children: ['done', 'error'] },
	  'getListCollection': { children: ['done', 'error'] },
	  'saveCollection': { children: ['done', 'error'] },
	  'getMobileNumber': { children: ['done', 'error'] },
	  'exportDunning': { children: ['done', 'error'] },
	  'printCollectionReport': { children: ['done', 'error'] },
	  'listClosediscount': { children: ['done', 'error'] },
	  'exportClosediscount': { children: ['done', 'error'] },
	  'saveClosediscount': { children: ['done', 'error'] },
	  'closeCaStaffList': { children: ['done', 'error'] },
	  'saveCloseCa': { children: ['done', 'error'] },
	  'getContractID': { children: ['done', 'error'] },
	  'getPersonCard': { children: ['done', 'error'] },
	  'getPersonCardCo': { children: ['done', 'error'] }
	});

/***/ },

/***/ 801:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var tr = __webpack_require__(207);
	var T = __webpack_require__(383);
	var LineChart = __webpack_require__(802).Line;
	var PieChart = __webpack_require__(802).Pie;
	var system = __webpack_require__(356);

	var systemActions = system.systemActions; //require('../system/actions');
	var menuActions = system.menuActions; //require('../system/actions/menu');
	var infoPanelActions = system.infoPanelActions;

	var Inspection = __webpack_require__(812);
	var Contract = __webpack_require__(818);
	var Barcode = __webpack_require__(822);
	var CommissionOpen = __webpack_require__(827);
	var CommissionClose = __webpack_require__(832);
	var Recontract = __webpack_require__(837);
	var ReportOthers = __webpack_require__(842);
	var ReportComOpen = __webpack_require__(847);
	var ReportComClose = __webpack_require__(852);

	tr.registerTranslations('en', __webpack_require__(857));
	tr.registerTranslations('th', __webpack_require__(858));

	var App = {};

	App.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setTheme(4);
	    systemActions.updateTopPanel({
	      code: 'installment',
	      name: 'เงินผ่อน',
	      icon: 'shopping232'
	    });
	    menuActions.show([{ id: 'dashboard', route: '/installment/dashboard', label: 'installment.menu.dashboard', icon: 'show6', acl: ['M_INSTALLMENT_DASHBOARD'] }, { id: 'inspection', route: '/installment/inspection/detail', label: 'installment.menu.inspection', icon: 'search100', acl: ['M_INSTALLMENT_INSPECTION'] }, { id: 'contractPending', route: '/installment/contract/pending', label: 'installment.menu.contractPending', icon: 'sort52', acl: ['M_INSTALLMENT_CONTRACTPENDING'] }, { id: 'contractList', index: true, route: '/installment/contract', label: 'installment.menu.contractList', icon: 'show5', acl: ['M_INSTALLMENT_CONTRACTLIST'] }, { id: 'contractDunning', route: '/installment/contract/dunning', label: 'installment.menu.contractDunning', icon: 'show6', acl: ['M_INSTALLMENT_CONTRACTDUNNING'] }, { id: 'contractClose', route: '/installment/contract/close', label: 'installment.menu.contractClose', icon: 'show6', acl: ['M_INSTALLMENT_CONTRACTCLOSE'] }, { id: 'recontract', route: '/installment/recontract', label: 'installment.menu.recontract', icon: 'show6', acl: ['M_INSTALLMENT_RECONTRACT'] }, { id: 'contractCloseDiscount', route: '/installment/contract/closediscount', label: 'installment.menu.contractCloseDiscount', icon: 'show6', acl: ['M_INSTALLMENT_CONTRACTCLOSEDISCOUNT'] }, { id: 'commissionOpenList', route: '/installment/commission-open', label: 'installment.menu.commissionOpenList', icon: 'receipt9', acl: ['M_INSTALLMENT_COMMISSIONOPENLIST'] }, { id: 'commissionCloseList', route: '/installment/commission-close', label: 'installment.menu.commissionCloseList', icon: 'receipt9', acl: ['M_INSTALLMENT_COMMISSIONCLOSELIST'] }, { id: 'barcodeGenerator', route: '/installment/barcode-gen', label: 'installment.menu.barcodeGenerator', icon: 'blogger12', acl: ['M_INSTALLMENT_BARCODEGENERATOR'] }, { id: 'barcodePrint', route: '/installment/barcode-print', label: 'installment.menu.barcodePrint', icon: 'blogger12', acl: ['M_INSTALLMENT_BARCODEPRINT'] }, { id: 'report', route: '/installment/others', label: 'installment.menu.others', icon: 'sort52', acl: ['M_INSTALLMENT_OTHERS'] }]);
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});
	//  {id:'report', route:'installment.others.others', label:'installment.menu.others', icon:'sort52',acl:['installment']}
	App.Dashboard = React.createClass({
	  displayName: 'Dashboard',

	  getInitialState: function getInitialState() {
	    return {
	      chartData: {
	        labels: ["January", "February", "March", "April", "May", "June", "July"],
	        datasets: [{
	          label: "My First dataset",
	          fillColor: "rgba(220,220,220,0.2)",
	          strokeColor: "rgba(220,220,220,1)",
	          pointColor: "rgba(220,220,220,1)",
	          pointStrokeColor: "#fff",
	          pointHighlightFill: "#fff",
	          pointHighlightStroke: "rgba(220,220,220,1)",
	          data: [65, 59, 80, 81, 56, 55, 40]
	        }, {
	          label: "My Second dataset",
	          fillColor: "rgba(151,187,205,0.2)",
	          strokeColor: "rgba(151,187,205,1)",
	          pointColor: "rgba(151,187,205,1)",
	          pointStrokeColor: "#fff",
	          pointHighlightFill: "#fff",
	          pointHighlightStroke: "rgba(151,187,205,1)",
	          data: [28, 48, 40, 19, 86, 27, 90]
	        }]
	      },
	      chartData2: [{
	        value: 300,
	        color: "#F7464A",
	        highlight: "#FF5A5E",
	        label: "Red"
	      }, {
	        value: 50,
	        color: "#46BFBD",
	        highlight: "#5AD3D1",
	        label: "Green"
	      }, {
	        value: 100,
	        color: "#FDB45C",
	        highlight: "#FFC870",
	        label: "Yellow"
	      }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    infoPanelActions.hide();
	  },
	  render: function render() {
	    var lineOptions = {
	      scaleShowGridLines: true,
	      scaleGridLineColor: "rgba(0,0,0,.05)",
	      scaleGridLineWidth: 1,
	      scaleShowHorizontalLines: true,
	      scaleShowVerticalLines: true,
	      bezierCurve: true,
	      bezierCurveTension: 0.4,
	      pointDot: true,
	      pointDotRadius: 4,
	      pointDotStrokeWidth: 1,
	      pointHitDetectionRadius: 20,
	      datasetStroke: true,
	      datasetStrokeWidth: 2,
	      datasetFill: true,
	      legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
	    };
	    var pieOptions = {
	      segmentShowStroke: true,
	      segmentStrokeColor: "#fff",
	      segmentStrokeWidth: 2,
	      percentageInnerCutout: 0, // This is 0 for Pie charts
	      animationSteps: 100,
	      animationEasing: "easeOutBounce",
	      animateRotate: true,
	      animateScale: false,
	      legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
	    };
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          React.createElement(T, { content: 'installment.title.index' })
	        ),
	        React.createElement('div', { className: 'panel5' })
	      ),
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          React.createElement(LineChart, { data: this.state.chartData, options: lineOptions, width: '464', height: '348' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          React.createElement(PieChart, { data: this.state.chartData2, options: pieOptions, width: '464', height: '348' })
	        )
	      )
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

/***/ },

/***/ 802:
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  Bar: __webpack_require__(803),
	  Doughnut: __webpack_require__(807),
	  Line: __webpack_require__(808),
	  Pie: __webpack_require__(809),
	  PolarArea: __webpack_require__(810),
	  Radar: __webpack_require__(811),
	  createClass: __webpack_require__(804).createClass
	};


/***/ },

/***/ 803:
/***/ function(module, exports, __webpack_require__) {

	var vars = __webpack_require__(804);

	module.exports = vars.createClass('Bar', ['getBarsAtEvent']);


/***/ },

/***/ 804:
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  createClass: function(chartType, methodNames, dataKey) {
	    var classData = {
	      displayName: chartType + 'Chart',
	      getInitialState: function() { return {}; },
	      render: function() {
	        var _props = {
	          ref: 'canvass'
	        };
	        for (var name in this.props) {
	          if (this.props.hasOwnProperty(name)) {
	            if (name !== 'data' && name !== 'options') {
	              _props[name] = this.props[name];
	            }
	          }
	        }
	        return React.createElement('canvas', _props);
	      }
	    };

	    var extras = ['clear', 'stop', 'resize', 'toBase64Image', 'generateLegend', 'update', 'addData', 'removeData'];
	    function extra(type) {
	      classData[type] = function() {
	        this.state.chart[name].apply(this.state.chart, arguments);
	      };
	    }

	    classData.componentDidMount = function() {
	      this.initializeChart(this.props);
	    };

	    classData.componentWillUnmount = function() {
	      var chart = this.state.chart;
	      chart.destroy();
	    };

	    classData.componentWillReceiveProps = function(nextProps) {
	      var chart = this.state.chart;
	      if (this.props.redraw) {
	        chart.destroy();
	        this.initializeChart(nextProps);
	      } else {
	        dataKey = dataKey || dataKeys[chart.name];
	        updatePoints(nextProps, chart, dataKey);
	        chart.update();
	      }
	    };

	    classData.initializeChart = function(nextProps) {
	      var Chart = __webpack_require__(805);
	      var el = this.getDOMNode();
	      var ctx = el.getContext("2d");
	      var chart = new Chart(ctx)[chartType](nextProps.data, nextProps.options || {});
	      this.state.chart = chart;
	    };

	    // return the chartjs instance
	    classData.getChart = function() {
	      return this.state.chart;
	    };

	    // return the canvass element that contains the chart
	    classData.getCanvass = function() {
	      return this.refs.canvass.getDOMNode();
	    };

	    var i;
	    for (i=0; i<extras.length; i++) {
	      extra(extras[i]);
	    }
	    for (i=0; i<methodNames.length; i++) {
	      extra(methodNames[i]);
	    }

	    var React = __webpack_require__(2);
	    return React.createClass(classData);
	  }
	};

	var dataKeys = {
	  'Line': 'points',
	  'Radar': 'points',
	  'Bar': 'bars'
	};

	var updatePoints = function(nextProps, chart, dataKey) {
	  var name = chart.name;

	  if (name === 'PolarArea' || name === 'Pie' || name === 'Doughnut') {
	    nextProps.data.forEach(function(segment, segmentIndex) {
	      chart.segments[segmentIndex].value = segment.value;
	    });
	  } else {
	    nextProps.data.datasets.forEach(function(set, setIndex) {
	      set.data.forEach(function(val, pointIndex) {
	        chart.datasets[setIndex][dataKey][pointIndex].value = val;
	      });
	    });
	  }
	};






/***/ },

/***/ 805:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * Chart.js
	 * http://chartjs.org/
	 * Version: 1.1.1
	 *
	 * Copyright 2015 Nick Downie
	 * Released under the MIT license
	 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
	 */


	(function(){

		"use strict";

		//Declare root variable - window in the browser, global on the server
		var root = this,
			previous = root.Chart;

		//Occupy the global variable of Chart, and create a simple base class
		var Chart = function(context){
			var chart = this;
			this.canvas = context.canvas;

			this.ctx = context;

			//Variables global to the chart
			var computeDimension = function(element,dimension)
			{
				if (element['offset'+dimension])
				{
					return element['offset'+dimension];
				}
				else
				{
					return document.defaultView.getComputedStyle(element).getPropertyValue(dimension);
				}
			};

			var width = this.width = computeDimension(context.canvas,'Width') || context.canvas.width;
			var height = this.height = computeDimension(context.canvas,'Height') || context.canvas.height;

			this.aspectRatio = this.width / this.height;
			//High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
			helpers.retinaScale(this);

			return this;
		};
		//Globally expose the defaults to allow for user updating/changing
		Chart.defaults = {
			global: {
				// Boolean - Whether to animate the chart
				animation: true,

				// Number - Number of animation steps
				animationSteps: 60,

				// String - Animation easing effect
				animationEasing: "easeOutQuart",

				// Boolean - If we should show the scale at all
				showScale: true,

				// Boolean - If we want to override with a hard coded scale
				scaleOverride: false,

				// ** Required if scaleOverride is true **
				// Number - The number of steps in a hard coded scale
				scaleSteps: null,
				// Number - The value jump in the hard coded scale
				scaleStepWidth: null,
				// Number - The scale starting value
				scaleStartValue: null,

				// String - Colour of the scale line
				scaleLineColor: "rgba(0,0,0,.1)",

				// Number - Pixel width of the scale line
				scaleLineWidth: 1,

				// Boolean - Whether to show labels on the scale
				scaleShowLabels: true,

				// Interpolated JS string - can access value
				scaleLabel: "<%=value%>",

				// Boolean - Whether the scale should stick to integers, and not show any floats even if drawing space is there
				scaleIntegersOnly: true,

				// Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
				scaleBeginAtZero: false,

				// String - Scale label font declaration for the scale label
				scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

				// Number - Scale label font size in pixels
				scaleFontSize: 12,

				// String - Scale label font weight style
				scaleFontStyle: "normal",

				// String - Scale label font colour
				scaleFontColor: "#666",

				// Boolean - whether or not the chart should be responsive and resize when the browser does.
				responsive: false,

				// Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
				maintainAspectRatio: true,

				// Boolean - Determines whether to draw tooltips on the canvas or not - attaches events to touchmove & mousemove
				showTooltips: true,

				// Boolean - Determines whether to draw built-in tooltip or call custom tooltip function
				customTooltips: false,

				// Array - Array of string names to attach tooltip events
				tooltipEvents: ["mousemove", "touchstart", "touchmove", "mouseout"],

				// String - Tooltip background colour
				tooltipFillColor: "rgba(0,0,0,0.8)",

				// String - Tooltip label font declaration for the scale label
				tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

				// Number - Tooltip label font size in pixels
				tooltipFontSize: 14,

				// String - Tooltip font weight style
				tooltipFontStyle: "normal",

				// String - Tooltip label font colour
				tooltipFontColor: "#fff",

				// String - Tooltip title font declaration for the scale label
				tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

				// Number - Tooltip title font size in pixels
				tooltipTitleFontSize: 14,

				// String - Tooltip title font weight style
				tooltipTitleFontStyle: "bold",

				// String - Tooltip title font colour
				tooltipTitleFontColor: "#fff",

				// String - Tooltip title template
				tooltipTitleTemplate: "<%= label%>",

				// Number - pixel width of padding around tooltip text
				tooltipYPadding: 6,

				// Number - pixel width of padding around tooltip text
				tooltipXPadding: 6,

				// Number - Size of the caret on the tooltip
				tooltipCaretSize: 8,

				// Number - Pixel radius of the tooltip border
				tooltipCornerRadius: 6,

				// Number - Pixel offset from point x to tooltip edge
				tooltipXOffset: 10,

				// String - Template string for single tooltips
				tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

				// String - Template string for single tooltips
				multiTooltipTemplate: "<%= datasetLabel %>: <%= value %>",

				// String - Colour behind the legend colour block
				multiTooltipKeyBackground: '#fff',

				// Array - A list of colors to use as the defaults
				segmentColorDefault: ["#A6CEE3", "#1F78B4", "#B2DF8A", "#33A02C", "#FB9A99", "#E31A1C", "#FDBF6F", "#FF7F00", "#CAB2D6", "#6A3D9A", "#B4B482", "#B15928" ],

				// Array - A list of highlight colors to use as the defaults
				segmentHighlightColorDefaults: [ "#CEF6FF", "#47A0DC", "#DAFFB2", "#5BC854", "#FFC2C1", "#FF4244", "#FFE797", "#FFA728", "#F2DAFE", "#9265C2", "#DCDCAA", "#D98150" ],

				// Function - Will fire on animation progression.
				onAnimationProgress: function(){},

				// Function - Will fire on animation completion.
				onAnimationComplete: function(){}

			}
		};

		//Create a dictionary of chart types, to allow for extension of existing types
		Chart.types = {};

		//Global Chart helpers object for utility methods and classes
		var helpers = Chart.helpers = {};

			//-- Basic js utility methods
		var each = helpers.each = function(loopable,callback,self){
				var additionalArgs = Array.prototype.slice.call(arguments, 3);
				// Check to see if null or undefined firstly.
				if (loopable){
					if (loopable.length === +loopable.length){
						var i;
						for (i=0; i<loopable.length; i++){
							callback.apply(self,[loopable[i], i].concat(additionalArgs));
						}
					}
					else{
						for (var item in loopable){
							callback.apply(self,[loopable[item],item].concat(additionalArgs));
						}
					}
				}
			},
			clone = helpers.clone = function(obj){
				var objClone = {};
				each(obj,function(value,key){
					if (obj.hasOwnProperty(key)){
						objClone[key] = value;
					}
				});
				return objClone;
			},
			extend = helpers.extend = function(base){
				each(Array.prototype.slice.call(arguments,1), function(extensionObject) {
					each(extensionObject,function(value,key){
						if (extensionObject.hasOwnProperty(key)){
							base[key] = value;
						}
					});
				});
				return base;
			},
			merge = helpers.merge = function(base,master){
				//Merge properties in left object over to a shallow clone of object right.
				var args = Array.prototype.slice.call(arguments,0);
				args.unshift({});
				return extend.apply(null, args);
			},
			indexOf = helpers.indexOf = function(arrayToSearch, item){
				if (Array.prototype.indexOf) {
					return arrayToSearch.indexOf(item);
				}
				else{
					for (var i = 0; i < arrayToSearch.length; i++) {
						if (arrayToSearch[i] === item) return i;
					}
					return -1;
				}
			},
			where = helpers.where = function(collection, filterCallback){
				var filtered = [];

				helpers.each(collection, function(item){
					if (filterCallback(item)){
						filtered.push(item);
					}
				});

				return filtered;
			},
			findNextWhere = helpers.findNextWhere = function(arrayToSearch, filterCallback, startIndex){
				// Default to start of the array
				if (!startIndex){
					startIndex = -1;
				}
				for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
					var currentItem = arrayToSearch[i];
					if (filterCallback(currentItem)){
						return currentItem;
					}
				}
			},
			findPreviousWhere = helpers.findPreviousWhere = function(arrayToSearch, filterCallback, startIndex){
				// Default to end of the array
				if (!startIndex){
					startIndex = arrayToSearch.length;
				}
				for (var i = startIndex - 1; i >= 0; i--) {
					var currentItem = arrayToSearch[i];
					if (filterCallback(currentItem)){
						return currentItem;
					}
				}
			},
			inherits = helpers.inherits = function(extensions){
				//Basic javascript inheritance based on the model created in Backbone.js
				var parent = this;
				var ChartElement = (extensions && extensions.hasOwnProperty("constructor")) ? extensions.constructor : function(){ return parent.apply(this, arguments); };

				var Surrogate = function(){ this.constructor = ChartElement;};
				Surrogate.prototype = parent.prototype;
				ChartElement.prototype = new Surrogate();

				ChartElement.extend = inherits;

				if (extensions) extend(ChartElement.prototype, extensions);

				ChartElement.__super__ = parent.prototype;

				return ChartElement;
			},
			noop = helpers.noop = function(){},
			uid = helpers.uid = (function(){
				var id=0;
				return function(){
					return "chart-" + id++;
				};
			})(),
			warn = helpers.warn = function(str){
				//Method for warning of errors
				if (window.console && typeof window.console.warn === "function") console.warn(str);
			},
			amd = helpers.amd = ("function" === 'function' && __webpack_require__(806)),
			//-- Math methods
			isNumber = helpers.isNumber = function(n){
				return !isNaN(parseFloat(n)) && isFinite(n);
			},
			max = helpers.max = function(array){
				return Math.max.apply( Math, array );
			},
			min = helpers.min = function(array){
				return Math.min.apply( Math, array );
			},
			cap = helpers.cap = function(valueToCap,maxValue,minValue){
				if(isNumber(maxValue)) {
					if( valueToCap > maxValue ) {
						return maxValue;
					}
				}
				else if(isNumber(minValue)){
					if ( valueToCap < minValue ){
						return minValue;
					}
				}
				return valueToCap;
			},
			getDecimalPlaces = helpers.getDecimalPlaces = function(num){
				if (num%1!==0 && isNumber(num)){
					var s = num.toString();
					if(s.indexOf("e-") < 0){
						// no exponent, e.g. 0.01
						return s.split(".")[1].length;
					}
					else if(s.indexOf(".") < 0) {
						// no decimal point, e.g. 1e-9
						return parseInt(s.split("e-")[1]);
					}
					else {
						// exponent and decimal point, e.g. 1.23e-9
						var parts = s.split(".")[1].split("e-");
						return parts[0].length + parseInt(parts[1]);
					}
				}
				else {
					return 0;
				}
			},
			toRadians = helpers.radians = function(degrees){
				return degrees * (Math.PI/180);
			},
			// Gets the angle from vertical upright to the point about a centre.
			getAngleFromPoint = helpers.getAngleFromPoint = function(centrePoint, anglePoint){
				var distanceFromXCenter = anglePoint.x - centrePoint.x,
					distanceFromYCenter = anglePoint.y - centrePoint.y,
					radialDistanceFromCenter = Math.sqrt( distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);


				var angle = Math.PI * 2 + Math.atan2(distanceFromYCenter, distanceFromXCenter);

				//If the segment is in the top left quadrant, we need to add another rotation to the angle
				if (distanceFromXCenter < 0 && distanceFromYCenter < 0){
					angle += Math.PI*2;
				}

				return {
					angle: angle,
					distance: radialDistanceFromCenter
				};
			},
			aliasPixel = helpers.aliasPixel = function(pixelWidth){
				return (pixelWidth % 2 === 0) ? 0 : 0.5;
			},
			splineCurve = helpers.splineCurve = function(FirstPoint,MiddlePoint,AfterPoint,t){
				//Props to Rob Spencer at scaled innovation for his post on splining between points
				//http://scaledinnovation.com/analytics/splines/aboutSplines.html
				var d01=Math.sqrt(Math.pow(MiddlePoint.x-FirstPoint.x,2)+Math.pow(MiddlePoint.y-FirstPoint.y,2)),
					d12=Math.sqrt(Math.pow(AfterPoint.x-MiddlePoint.x,2)+Math.pow(AfterPoint.y-MiddlePoint.y,2)),
					fa=t*d01/(d01+d12),// scaling factor for triangle Ta
					fb=t*d12/(d01+d12);
				return {
					inner : {
						x : MiddlePoint.x-fa*(AfterPoint.x-FirstPoint.x),
						y : MiddlePoint.y-fa*(AfterPoint.y-FirstPoint.y)
					},
					outer : {
						x: MiddlePoint.x+fb*(AfterPoint.x-FirstPoint.x),
						y : MiddlePoint.y+fb*(AfterPoint.y-FirstPoint.y)
					}
				};
			},
			calculateOrderOfMagnitude = helpers.calculateOrderOfMagnitude = function(val){
				return Math.floor(Math.log(val) / Math.LN10);
			},
			calculateScaleRange = helpers.calculateScaleRange = function(valuesArray, drawingSize, textSize, startFromZero, integersOnly){

				//Set a minimum step of two - a point at the top of the graph, and a point at the base
				var minSteps = 2,
					maxSteps = Math.floor(drawingSize/(textSize * 1.5)),
					skipFitting = (minSteps >= maxSteps);

				// Filter out null values since these would min() to zero
				var values = [];
				each(valuesArray, function( v ){
					v == null || values.push( v );
				});
				var minValue = min(values),
				    maxValue = max(values);

				// We need some degree of separation here to calculate the scales if all the values are the same
				// Adding/minusing 0.5 will give us a range of 1.
				if (maxValue === minValue){
					maxValue += 0.5;
					// So we don't end up with a graph with a negative start value if we've said always start from zero
					if (minValue >= 0.5 && !startFromZero){
						minValue -= 0.5;
					}
					else{
						// Make up a whole number above the values
						maxValue += 0.5;
					}
				}

				var	valueRange = Math.abs(maxValue - minValue),
					rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange),
					graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
					graphMin = (startFromZero) ? 0 : Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
					graphRange = graphMax - graphMin,
					stepValue = Math.pow(10, rangeOrderOfMagnitude),
					numberOfSteps = Math.round(graphRange / stepValue);

				//If we have more space on the graph we'll use it to give more definition to the data
				while((numberOfSteps > maxSteps || (numberOfSteps * 2) < maxSteps) && !skipFitting) {
					if(numberOfSteps > maxSteps){
						stepValue *=2;
						numberOfSteps = Math.round(graphRange/stepValue);
						// Don't ever deal with a decimal number of steps - cancel fitting and just use the minimum number of steps.
						if (numberOfSteps % 1 !== 0){
							skipFitting = true;
						}
					}
					//We can fit in double the amount of scale points on the scale
					else{
						//If user has declared ints only, and the step value isn't a decimal
						if (integersOnly && rangeOrderOfMagnitude >= 0){
							//If the user has said integers only, we need to check that making the scale more granular wouldn't make it a float
							if(stepValue/2 % 1 === 0){
								stepValue /=2;
								numberOfSteps = Math.round(graphRange/stepValue);
							}
							//If it would make it a float break out of the loop
							else{
								break;
							}
						}
						//If the scale doesn't have to be an int, make the scale more granular anyway.
						else{
							stepValue /=2;
							numberOfSteps = Math.round(graphRange/stepValue);
						}

					}
				}

				if (skipFitting){
					numberOfSteps = minSteps;
					stepValue = graphRange / numberOfSteps;
				}

				return {
					steps : numberOfSteps,
					stepValue : stepValue,
					min : graphMin,
					max	: graphMin + (numberOfSteps * stepValue)
				};

			},
			/* jshint ignore:start */
			// Blows up jshint errors based on the new Function constructor
			//Templating methods
			//Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
			template = helpers.template = function(templateString, valuesObject){

				// If templateString is function rather than string-template - call the function for valuesObject

				if(templateString instanceof Function){
				 	return templateString(valuesObject);
			 	}

				var cache = {};
				function tmpl(str, data){
					// Figure out if we're getting a template, or if we need to
					// load the template - and be sure to cache the result.
					var fn = !/\W/.test(str) ?
					cache[str] = cache[str] :

					// Generate a reusable function that will serve as a template
					// generator (and which will be cached).
					new Function("obj",
						"var p=[],print=function(){p.push.apply(p,arguments);};" +

						// Introduce the data as local variables using with(){}
						"with(obj){p.push('" +

						// Convert the template into pure JavaScript
						str
							.replace(/[\r\t\n]/g, " ")
							.split("<%").join("\t")
							.replace(/((^|%>)[^\t]*)'/g, "$1\r")
							.replace(/\t=(.*?)%>/g, "',$1,'")
							.split("\t").join("');")
							.split("%>").join("p.push('")
							.split("\r").join("\\'") +
						"');}return p.join('');"
					);

					// Provide some basic currying to the user
					return data ? fn( data ) : fn;
				}
				return tmpl(templateString,valuesObject);
			},
			/* jshint ignore:end */
			generateLabels = helpers.generateLabels = function(templateString,numberOfSteps,graphMin,stepValue){
				var labelsArray = new Array(numberOfSteps);
				if (templateString){
					each(labelsArray,function(val,index){
						labelsArray[index] = template(templateString,{value: (graphMin + (stepValue*(index+1)))});
					});
				}
				return labelsArray;
			},
			//--Animation methods
			//Easing functions adapted from Robert Penner's easing equations
			//http://www.robertpenner.com/easing/
			easingEffects = helpers.easingEffects = {
				linear: function (t) {
					return t;
				},
				easeInQuad: function (t) {
					return t * t;
				},
				easeOutQuad: function (t) {
					return -1 * t * (t - 2);
				},
				easeInOutQuad: function (t) {
					if ((t /= 1 / 2) < 1){
						return 1 / 2 * t * t;
					}
					return -1 / 2 * ((--t) * (t - 2) - 1);
				},
				easeInCubic: function (t) {
					return t * t * t;
				},
				easeOutCubic: function (t) {
					return 1 * ((t = t / 1 - 1) * t * t + 1);
				},
				easeInOutCubic: function (t) {
					if ((t /= 1 / 2) < 1){
						return 1 / 2 * t * t * t;
					}
					return 1 / 2 * ((t -= 2) * t * t + 2);
				},
				easeInQuart: function (t) {
					return t * t * t * t;
				},
				easeOutQuart: function (t) {
					return -1 * ((t = t / 1 - 1) * t * t * t - 1);
				},
				easeInOutQuart: function (t) {
					if ((t /= 1 / 2) < 1){
						return 1 / 2 * t * t * t * t;
					}
					return -1 / 2 * ((t -= 2) * t * t * t - 2);
				},
				easeInQuint: function (t) {
					return 1 * (t /= 1) * t * t * t * t;
				},
				easeOutQuint: function (t) {
					return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
				},
				easeInOutQuint: function (t) {
					if ((t /= 1 / 2) < 1){
						return 1 / 2 * t * t * t * t * t;
					}
					return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
				},
				easeInSine: function (t) {
					return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
				},
				easeOutSine: function (t) {
					return 1 * Math.sin(t / 1 * (Math.PI / 2));
				},
				easeInOutSine: function (t) {
					return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
				},
				easeInExpo: function (t) {
					return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
				},
				easeOutExpo: function (t) {
					return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
				},
				easeInOutExpo: function (t) {
					if (t === 0){
						return 0;
					}
					if (t === 1){
						return 1;
					}
					if ((t /= 1 / 2) < 1){
						return 1 / 2 * Math.pow(2, 10 * (t - 1));
					}
					return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
				},
				easeInCirc: function (t) {
					if (t >= 1){
						return t;
					}
					return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
				},
				easeOutCirc: function (t) {
					return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
				},
				easeInOutCirc: function (t) {
					if ((t /= 1 / 2) < 1){
						return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
					}
					return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
				},
				easeInElastic: function (t) {
					var s = 1.70158;
					var p = 0;
					var a = 1;
					if (t === 0){
						return 0;
					}
					if ((t /= 1) == 1){
						return 1;
					}
					if (!p){
						p = 1 * 0.3;
					}
					if (a < Math.abs(1)) {
						a = 1;
						s = p / 4;
					} else{
						s = p / (2 * Math.PI) * Math.asin(1 / a);
					}
					return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
				},
				easeOutElastic: function (t) {
					var s = 1.70158;
					var p = 0;
					var a = 1;
					if (t === 0){
						return 0;
					}
					if ((t /= 1) == 1){
						return 1;
					}
					if (!p){
						p = 1 * 0.3;
					}
					if (a < Math.abs(1)) {
						a = 1;
						s = p / 4;
					} else{
						s = p / (2 * Math.PI) * Math.asin(1 / a);
					}
					return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
				},
				easeInOutElastic: function (t) {
					var s = 1.70158;
					var p = 0;
					var a = 1;
					if (t === 0){
						return 0;
					}
					if ((t /= 1 / 2) == 2){
						return 1;
					}
					if (!p){
						p = 1 * (0.3 * 1.5);
					}
					if (a < Math.abs(1)) {
						a = 1;
						s = p / 4;
					} else {
						s = p / (2 * Math.PI) * Math.asin(1 / a);
					}
					if (t < 1){
						return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));}
					return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
				},
				easeInBack: function (t) {
					var s = 1.70158;
					return 1 * (t /= 1) * t * ((s + 1) * t - s);
				},
				easeOutBack: function (t) {
					var s = 1.70158;
					return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
				},
				easeInOutBack: function (t) {
					var s = 1.70158;
					if ((t /= 1 / 2) < 1){
						return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
					}
					return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
				},
				easeInBounce: function (t) {
					return 1 - easingEffects.easeOutBounce(1 - t);
				},
				easeOutBounce: function (t) {
					if ((t /= 1) < (1 / 2.75)) {
						return 1 * (7.5625 * t * t);
					} else if (t < (2 / 2.75)) {
						return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
					} else if (t < (2.5 / 2.75)) {
						return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
					} else {
						return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
					}
				},
				easeInOutBounce: function (t) {
					if (t < 1 / 2){
						return easingEffects.easeInBounce(t * 2) * 0.5;
					}
					return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;
				}
			},
			//Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
			requestAnimFrame = helpers.requestAnimFrame = (function(){
				return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function(callback) {
						return window.setTimeout(callback, 1000 / 60);
					};
			})(),
			cancelAnimFrame = helpers.cancelAnimFrame = (function(){
				return window.cancelAnimationFrame ||
					window.webkitCancelAnimationFrame ||
					window.mozCancelAnimationFrame ||
					window.oCancelAnimationFrame ||
					window.msCancelAnimationFrame ||
					function(callback) {
						return window.clearTimeout(callback, 1000 / 60);
					};
			})(),
			animationLoop = helpers.animationLoop = function(callback,totalSteps,easingString,onProgress,onComplete,chartInstance){

				var currentStep = 0,
					easingFunction = easingEffects[easingString] || easingEffects.linear;

				var animationFrame = function(){
					currentStep++;
					var stepDecimal = currentStep/totalSteps;
					var easeDecimal = easingFunction(stepDecimal);

					callback.call(chartInstance,easeDecimal,stepDecimal, currentStep);
					onProgress.call(chartInstance,easeDecimal,stepDecimal);
					if (currentStep < totalSteps){
						chartInstance.animationFrame = requestAnimFrame(animationFrame);
					} else{
						onComplete.apply(chartInstance);
					}
				};
				requestAnimFrame(animationFrame);
			},
			//-- DOM methods
			getRelativePosition = helpers.getRelativePosition = function(evt){
				var mouseX, mouseY;
				var e = evt.originalEvent || evt,
					canvas = evt.currentTarget || evt.srcElement,
					boundingRect = canvas.getBoundingClientRect();

				if (e.touches){
					mouseX = e.touches[0].clientX - boundingRect.left;
					mouseY = e.touches[0].clientY - boundingRect.top;

				}
				else{
					mouseX = e.clientX - boundingRect.left;
					mouseY = e.clientY - boundingRect.top;
				}

				return {
					x : mouseX,
					y : mouseY
				};

			},
			addEvent = helpers.addEvent = function(node,eventType,method){
				if (node.addEventListener){
					node.addEventListener(eventType,method);
				} else if (node.attachEvent){
					node.attachEvent("on"+eventType, method);
				} else {
					node["on"+eventType] = method;
				}
			},
			removeEvent = helpers.removeEvent = function(node, eventType, handler){
				if (node.removeEventListener){
					node.removeEventListener(eventType, handler, false);
				} else if (node.detachEvent){
					node.detachEvent("on"+eventType,handler);
				} else{
					node["on" + eventType] = noop;
				}
			},
			bindEvents = helpers.bindEvents = function(chartInstance, arrayOfEvents, handler){
				// Create the events object if it's not already present
				if (!chartInstance.events) chartInstance.events = {};

				each(arrayOfEvents,function(eventName){
					chartInstance.events[eventName] = function(){
						handler.apply(chartInstance, arguments);
					};
					addEvent(chartInstance.chart.canvas,eventName,chartInstance.events[eventName]);
				});
			},
			unbindEvents = helpers.unbindEvents = function (chartInstance, arrayOfEvents) {
				each(arrayOfEvents, function(handler,eventName){
					removeEvent(chartInstance.chart.canvas, eventName, handler);
				});
			},
			getMaximumWidth = helpers.getMaximumWidth = function(domNode){
				var container = domNode.parentNode,
				    padding = parseInt(getStyle(container, 'padding-left')) + parseInt(getStyle(container, 'padding-right'));
				// TODO = check cross browser stuff with this.
				return container ? container.clientWidth - padding : 0;
			},
			getMaximumHeight = helpers.getMaximumHeight = function(domNode){
				var container = domNode.parentNode,
				    padding = parseInt(getStyle(container, 'padding-bottom')) + parseInt(getStyle(container, 'padding-top'));
				// TODO = check cross browser stuff with this.
				return container ? container.clientHeight - padding : 0;
			},
			getStyle = helpers.getStyle = function (el, property) {
				return el.currentStyle ?
					el.currentStyle[property] :
					document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
			},
			getMaximumSize = helpers.getMaximumSize = helpers.getMaximumWidth, // legacy support
			retinaScale = helpers.retinaScale = function(chart){
				var ctx = chart.ctx,
					width = chart.canvas.width,
					height = chart.canvas.height;

				if (window.devicePixelRatio) {
					ctx.canvas.style.width = width + "px";
					ctx.canvas.style.height = height + "px";
					ctx.canvas.height = height * window.devicePixelRatio;
					ctx.canvas.width = width * window.devicePixelRatio;
					ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
				}
			},
			//-- Canvas methods
			clear = helpers.clear = function(chart){
				chart.ctx.clearRect(0,0,chart.width,chart.height);
			},
			fontString = helpers.fontString = function(pixelSize,fontStyle,fontFamily){
				return fontStyle + " " + pixelSize+"px " + fontFamily;
			},
			longestText = helpers.longestText = function(ctx,font,arrayOfStrings){
				ctx.font = font;
				var longest = 0;
				each(arrayOfStrings,function(string){
					var textWidth = ctx.measureText(string).width;
					longest = (textWidth > longest) ? textWidth : longest;
				});
				return longest;
			},
			drawRoundedRectangle = helpers.drawRoundedRectangle = function(ctx,x,y,width,height,radius){
				ctx.beginPath();
				ctx.moveTo(x + radius, y);
				ctx.lineTo(x + width - radius, y);
				ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
				ctx.lineTo(x + width, y + height - radius);
				ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
				ctx.lineTo(x + radius, y + height);
				ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
				ctx.lineTo(x, y + radius);
				ctx.quadraticCurveTo(x, y, x + radius, y);
				ctx.closePath();
			};


		//Store a reference to each instance - allowing us to globally resize chart instances on window resize.
		//Destroy method on the chart will remove the instance of the chart from this reference.
		Chart.instances = {};

		Chart.Type = function(data,options,chart){
			this.options = options;
			this.chart = chart;
			this.id = uid();
			//Add the chart instance to the global namespace
			Chart.instances[this.id] = this;

			// Initialize is always called when a chart type is created
			// By default it is a no op, but it should be extended
			if (options.responsive){
				this.resize();
			}
			this.initialize.call(this,data);
		};

		//Core methods that'll be a part of every chart type
		extend(Chart.Type.prototype,{
			initialize : function(){return this;},
			clear : function(){
				clear(this.chart);
				return this;
			},
			stop : function(){
				// Stops any current animation loop occuring
				Chart.animationService.cancelAnimation(this);
				return this;
			},
			resize : function(callback){
				this.stop();
				var canvas = this.chart.canvas,
					newWidth = getMaximumWidth(this.chart.canvas),
					newHeight = this.options.maintainAspectRatio ? newWidth / this.chart.aspectRatio : getMaximumHeight(this.chart.canvas);

				canvas.width = this.chart.width = newWidth;
				canvas.height = this.chart.height = newHeight;

				retinaScale(this.chart);

				if (typeof callback === "function"){
					callback.apply(this, Array.prototype.slice.call(arguments, 1));
				}
				return this;
			},
			reflow : noop,
			render : function(reflow){
				if (reflow){
					this.reflow();
				}
				
				if (this.options.animation && !reflow){
					var animation = new Chart.Animation();
					animation.numSteps = this.options.animationSteps;
					animation.easing = this.options.animationEasing;
					
					// render function
					animation.render = function(chartInstance, animationObject) {
						var easingFunction = helpers.easingEffects[animationObject.easing];
						var stepDecimal = animationObject.currentStep / animationObject.numSteps;
						var easeDecimal = easingFunction(stepDecimal);
						
						chartInstance.draw(easeDecimal, stepDecimal, animationObject.currentStep);
					};
					
					// user events
					animation.onAnimationProgress = this.options.onAnimationProgress;
					animation.onAnimationComplete = this.options.onAnimationComplete;
					
					Chart.animationService.addAnimation(this, animation);
				}
				else{
					this.draw();
					this.options.onAnimationComplete.call(this);
				}
				return this;
			},
			generateLegend : function(){
				return helpers.template(this.options.legendTemplate, this);
			},
			destroy : function(){
				this.stop();
				this.clear();
				unbindEvents(this, this.events);
				var canvas = this.chart.canvas;

				// Reset canvas height/width attributes starts a fresh with the canvas context
				canvas.width = this.chart.width;
				canvas.height = this.chart.height;

				// < IE9 doesn't support removeProperty
				if (canvas.style.removeProperty) {
					canvas.style.removeProperty('width');
					canvas.style.removeProperty('height');
				} else {
					canvas.style.removeAttribute('width');
					canvas.style.removeAttribute('height');
				}

				delete Chart.instances[this.id];
			},
			showTooltip : function(ChartElements, forceRedraw){
				// Only redraw the chart if we've actually changed what we're hovering on.
				if (typeof this.activeElements === 'undefined') this.activeElements = [];

				var isChanged = (function(Elements){
					var changed = false;

					if (Elements.length !== this.activeElements.length){
						changed = true;
						return changed;
					}

					each(Elements, function(element, index){
						if (element !== this.activeElements[index]){
							changed = true;
						}
					}, this);
					return changed;
				}).call(this, ChartElements);

				if (!isChanged && !forceRedraw){
					return;
				}
				else{
					this.activeElements = ChartElements;
				}
				this.draw();
				if(this.options.customTooltips){
					this.options.customTooltips(false);
				}
				if (ChartElements.length > 0){
					// If we have multiple datasets, show a MultiTooltip for all of the data points at that index
					if (this.datasets && this.datasets.length > 1) {
						var dataArray,
							dataIndex;

						for (var i = this.datasets.length - 1; i >= 0; i--) {
							dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
							dataIndex = indexOf(dataArray, ChartElements[0]);
							if (dataIndex !== -1){
								break;
							}
						}
						var tooltipLabels = [],
							tooltipColors = [],
							medianPosition = (function(index) {

								// Get all the points at that particular index
								var Elements = [],
									dataCollection,
									xPositions = [],
									yPositions = [],
									xMax,
									yMax,
									xMin,
									yMin;
								helpers.each(this.datasets, function(dataset){
									dataCollection = dataset.points || dataset.bars || dataset.segments;
									if (dataCollection[dataIndex] && dataCollection[dataIndex].hasValue()){
										Elements.push(dataCollection[dataIndex]);
									}
								});

								helpers.each(Elements, function(element) {
									xPositions.push(element.x);
									yPositions.push(element.y);


									//Include any colour information about the element
									tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, element));
									tooltipColors.push({
										fill: element._saved.fillColor || element.fillColor,
										stroke: element._saved.strokeColor || element.strokeColor
									});

								}, this);

								yMin = min(yPositions);
								yMax = max(yPositions);

								xMin = min(xPositions);
								xMax = max(xPositions);

								return {
									x: (xMin > this.chart.width/2) ? xMin : xMax,
									y: (yMin + yMax)/2
								};
							}).call(this, dataIndex);

						new Chart.MultiTooltip({
							x: medianPosition.x,
							y: medianPosition.y,
							xPadding: this.options.tooltipXPadding,
							yPadding: this.options.tooltipYPadding,
							xOffset: this.options.tooltipXOffset,
							fillColor: this.options.tooltipFillColor,
							textColor: this.options.tooltipFontColor,
							fontFamily: this.options.tooltipFontFamily,
							fontStyle: this.options.tooltipFontStyle,
							fontSize: this.options.tooltipFontSize,
							titleTextColor: this.options.tooltipTitleFontColor,
							titleFontFamily: this.options.tooltipTitleFontFamily,
							titleFontStyle: this.options.tooltipTitleFontStyle,
							titleFontSize: this.options.tooltipTitleFontSize,
							cornerRadius: this.options.tooltipCornerRadius,
							labels: tooltipLabels,
							legendColors: tooltipColors,
							legendColorBackground : this.options.multiTooltipKeyBackground,
							title: template(this.options.tooltipTitleTemplate,ChartElements[0]),
							chart: this.chart,
							ctx: this.chart.ctx,
							custom: this.options.customTooltips
						}).draw();

					} else {
						each(ChartElements, function(Element) {
							var tooltipPosition = Element.tooltipPosition();
							new Chart.Tooltip({
								x: Math.round(tooltipPosition.x),
								y: Math.round(tooltipPosition.y),
								xPadding: this.options.tooltipXPadding,
								yPadding: this.options.tooltipYPadding,
								fillColor: this.options.tooltipFillColor,
								textColor: this.options.tooltipFontColor,
								fontFamily: this.options.tooltipFontFamily,
								fontStyle: this.options.tooltipFontStyle,
								fontSize: this.options.tooltipFontSize,
								caretHeight: this.options.tooltipCaretSize,
								cornerRadius: this.options.tooltipCornerRadius,
								text: template(this.options.tooltipTemplate, Element),
								chart: this.chart,
								custom: this.options.customTooltips
							}).draw();
						}, this);
					}
				}
				return this;
			},
			toBase64Image : function(){
				return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
			}
		});

		Chart.Type.extend = function(extensions){

			var parent = this;

			var ChartType = function(){
				return parent.apply(this,arguments);
			};

			//Copy the prototype object of the this class
			ChartType.prototype = clone(parent.prototype);
			//Now overwrite some of the properties in the base class with the new extensions
			extend(ChartType.prototype, extensions);

			ChartType.extend = Chart.Type.extend;

			if (extensions.name || parent.prototype.name){

				var chartName = extensions.name || parent.prototype.name;
				//Assign any potential default values of the new chart type

				//If none are defined, we'll use a clone of the chart type this is being extended from.
				//I.e. if we extend a line chart, we'll use the defaults from the line chart if our new chart
				//doesn't define some defaults of their own.

				var baseDefaults = (Chart.defaults[parent.prototype.name]) ? clone(Chart.defaults[parent.prototype.name]) : {};

				Chart.defaults[chartName] = extend(baseDefaults,extensions.defaults);

				Chart.types[chartName] = ChartType;

				//Register this new chart type in the Chart prototype
				Chart.prototype[chartName] = function(data,options){
					var config = merge(Chart.defaults.global, Chart.defaults[chartName], options || {});
					return new ChartType(data,config,this);
				};
			} else{
				warn("Name not provided for this chart, so it hasn't been registered");
			}
			return parent;
		};

		Chart.Element = function(configuration){
			extend(this,configuration);
			this.initialize.apply(this,arguments);
			this.save();
		};
		extend(Chart.Element.prototype,{
			initialize : function(){},
			restore : function(props){
				if (!props){
					extend(this,this._saved);
				} else {
					each(props,function(key){
						this[key] = this._saved[key];
					},this);
				}
				return this;
			},
			save : function(){
				this._saved = clone(this);
				delete this._saved._saved;
				return this;
			},
			update : function(newProps){
				each(newProps,function(value,key){
					this._saved[key] = this[key];
					this[key] = value;
				},this);
				return this;
			},
			transition : function(props,ease){
				each(props,function(value,key){
					this[key] = ((value - this._saved[key]) * ease) + this._saved[key];
				},this);
				return this;
			},
			tooltipPosition : function(){
				return {
					x : this.x,
					y : this.y
				};
			},
			hasValue: function(){
				return isNumber(this.value);
			}
		});

		Chart.Element.extend = inherits;


		Chart.Point = Chart.Element.extend({
			display: true,
			inRange: function(chartX,chartY){
				var hitDetectionRange = this.hitDetectionRadius + this.radius;
				return ((Math.pow(chartX-this.x, 2)+Math.pow(chartY-this.y, 2)) < Math.pow(hitDetectionRange,2));
			},
			draw : function(){
				if (this.display){
					var ctx = this.ctx;
					ctx.beginPath();

					ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
					ctx.closePath();

					ctx.strokeStyle = this.strokeColor;
					ctx.lineWidth = this.strokeWidth;

					ctx.fillStyle = this.fillColor;

					ctx.fill();
					ctx.stroke();
				}


				//Quick debug for bezier curve splining
				//Highlights control points and the line between them.
				//Handy for dev - stripped in the min version.

				// ctx.save();
				// ctx.fillStyle = "black";
				// ctx.strokeStyle = "black"
				// ctx.beginPath();
				// ctx.arc(this.controlPoints.inner.x,this.controlPoints.inner.y, 2, 0, Math.PI*2);
				// ctx.fill();

				// ctx.beginPath();
				// ctx.arc(this.controlPoints.outer.x,this.controlPoints.outer.y, 2, 0, Math.PI*2);
				// ctx.fill();

				// ctx.moveTo(this.controlPoints.inner.x,this.controlPoints.inner.y);
				// ctx.lineTo(this.x, this.y);
				// ctx.lineTo(this.controlPoints.outer.x,this.controlPoints.outer.y);
				// ctx.stroke();

				// ctx.restore();



			}
		});

		Chart.Arc = Chart.Element.extend({
			inRange : function(chartX,chartY){

				var pointRelativePosition = helpers.getAngleFromPoint(this, {
					x: chartX,
					y: chartY
				});

				// Normalize all angles to 0 - 2*PI (0 - 360°)
				var pointRelativeAngle = pointRelativePosition.angle % (Math.PI * 2),
				    startAngle = (Math.PI * 2 + this.startAngle) % (Math.PI * 2),
				    endAngle = (Math.PI * 2 + this.endAngle) % (Math.PI * 2) || 360;

				// Calculate wether the pointRelativeAngle is between the start and the end angle
				var betweenAngles = (endAngle < startAngle) ?
					pointRelativeAngle <= endAngle || pointRelativeAngle >= startAngle:
					pointRelativeAngle >= startAngle && pointRelativeAngle <= endAngle;

				//Check if within the range of the open/close angle
				var withinRadius = (pointRelativePosition.distance >= this.innerRadius && pointRelativePosition.distance <= this.outerRadius);

				return (betweenAngles && withinRadius);
				//Ensure within the outside of the arc centre, but inside arc outer
			},
			tooltipPosition : function(){
				var centreAngle = this.startAngle + ((this.endAngle - this.startAngle) / 2),
					rangeFromCentre = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;
				return {
					x : this.x + (Math.cos(centreAngle) * rangeFromCentre),
					y : this.y + (Math.sin(centreAngle) * rangeFromCentre)
				};
			},
			draw : function(animationPercent){

				var easingDecimal = animationPercent || 1;

				var ctx = this.ctx;

				ctx.beginPath();

				ctx.arc(this.x, this.y, this.outerRadius < 0 ? 0 : this.outerRadius, this.startAngle, this.endAngle);

	            ctx.arc(this.x, this.y, this.innerRadius < 0 ? 0 : this.innerRadius, this.endAngle, this.startAngle, true);

				ctx.closePath();
				ctx.strokeStyle = this.strokeColor;
				ctx.lineWidth = this.strokeWidth;

				ctx.fillStyle = this.fillColor;

				ctx.fill();
				ctx.lineJoin = 'bevel';

				if (this.showStroke){
					ctx.stroke();
				}
			}
		});

		Chart.Rectangle = Chart.Element.extend({
			draw : function(){
				var ctx = this.ctx,
					halfWidth = this.width/2,
					leftX = this.x - halfWidth,
					rightX = this.x + halfWidth,
					top = this.base - (this.base - this.y),
					halfStroke = this.strokeWidth / 2;

				// Canvas doesn't allow us to stroke inside the width so we can
				// adjust the sizes to fit if we're setting a stroke on the line
				if (this.showStroke){
					leftX += halfStroke;
					rightX -= halfStroke;
					top += halfStroke;
				}

				ctx.beginPath();

				ctx.fillStyle = this.fillColor;
				ctx.strokeStyle = this.strokeColor;
				ctx.lineWidth = this.strokeWidth;

				// It'd be nice to keep this class totally generic to any rectangle
				// and simply specify which border to miss out.
				ctx.moveTo(leftX, this.base);
				ctx.lineTo(leftX, top);
				ctx.lineTo(rightX, top);
				ctx.lineTo(rightX, this.base);
				ctx.fill();
				if (this.showStroke){
					ctx.stroke();
				}
			},
			height : function(){
				return this.base - this.y;
			},
			inRange : function(chartX,chartY){
				return (chartX >= this.x - this.width/2 && chartX <= this.x + this.width/2) && (chartY >= this.y && chartY <= this.base);
			}
		});

		Chart.Animation = Chart.Element.extend({
			currentStep: null, // the current animation step
			numSteps: 60, // default number of steps
			easing: "", // the easing to use for this animation
			render: null, // render function used by the animation service
			
			onAnimationProgress: null, // user specified callback to fire on each step of the animation 
			onAnimationComplete: null, // user specified callback to fire when the animation finishes
		});
		
		Chart.Tooltip = Chart.Element.extend({
			draw : function(){

				var ctx = this.chart.ctx;

				ctx.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);

				this.xAlign = "center";
				this.yAlign = "above";

				//Distance between the actual element.y position and the start of the tooltip caret
				var caretPadding = this.caretPadding = 2;

				var tooltipWidth = ctx.measureText(this.text).width + 2*this.xPadding,
					tooltipRectHeight = this.fontSize + 2*this.yPadding,
					tooltipHeight = tooltipRectHeight + this.caretHeight + caretPadding;

				if (this.x + tooltipWidth/2 >this.chart.width){
					this.xAlign = "left";
				} else if (this.x - tooltipWidth/2 < 0){
					this.xAlign = "right";
				}

				if (this.y - tooltipHeight < 0){
					this.yAlign = "below";
				}


				var tooltipX = this.x - tooltipWidth/2,
					tooltipY = this.y - tooltipHeight;

				ctx.fillStyle = this.fillColor;

				// Custom Tooltips
				if(this.custom){
					this.custom(this);
				}
				else{
					switch(this.yAlign)
					{
					case "above":
						//Draw a caret above the x/y
						ctx.beginPath();
						ctx.moveTo(this.x,this.y - caretPadding);
						ctx.lineTo(this.x + this.caretHeight, this.y - (caretPadding + this.caretHeight));
						ctx.lineTo(this.x - this.caretHeight, this.y - (caretPadding + this.caretHeight));
						ctx.closePath();
						ctx.fill();
						break;
					case "below":
						tooltipY = this.y + caretPadding + this.caretHeight;
						//Draw a caret below the x/y
						ctx.beginPath();
						ctx.moveTo(this.x, this.y + caretPadding);
						ctx.lineTo(this.x + this.caretHeight, this.y + caretPadding + this.caretHeight);
						ctx.lineTo(this.x - this.caretHeight, this.y + caretPadding + this.caretHeight);
						ctx.closePath();
						ctx.fill();
						break;
					}

					switch(this.xAlign)
					{
					case "left":
						tooltipX = this.x - tooltipWidth + (this.cornerRadius + this.caretHeight);
						break;
					case "right":
						tooltipX = this.x - (this.cornerRadius + this.caretHeight);
						break;
					}

					drawRoundedRectangle(ctx,tooltipX,tooltipY,tooltipWidth,tooltipRectHeight,this.cornerRadius);

					ctx.fill();

					ctx.fillStyle = this.textColor;
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText(this.text, tooltipX + tooltipWidth/2, tooltipY + tooltipRectHeight/2);
				}
			}
		});

		Chart.MultiTooltip = Chart.Element.extend({
			initialize : function(){
				this.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);

				this.titleFont = fontString(this.titleFontSize,this.titleFontStyle,this.titleFontFamily);

				this.titleHeight = this.title ? this.titleFontSize * 1.5 : 0;
				this.height = (this.labels.length * this.fontSize) + ((this.labels.length-1) * (this.fontSize/2)) + (this.yPadding*2) + this.titleHeight;

				this.ctx.font = this.titleFont;

				var titleWidth = this.ctx.measureText(this.title).width,
					//Label has a legend square as well so account for this.
					labelWidth = longestText(this.ctx,this.font,this.labels) + this.fontSize + 3,
					longestTextWidth = max([labelWidth,titleWidth]);

				this.width = longestTextWidth + (this.xPadding*2);


				var halfHeight = this.height/2;

				//Check to ensure the height will fit on the canvas
				if (this.y - halfHeight < 0 ){
					this.y = halfHeight;
				} else if (this.y + halfHeight > this.chart.height){
					this.y = this.chart.height - halfHeight;
				}

				//Decide whether to align left or right based on position on canvas
				if (this.x > this.chart.width/2){
					this.x -= this.xOffset + this.width;
				} else {
					this.x += this.xOffset;
				}


			},
			getLineHeight : function(index){
				var baseLineHeight = this.y - (this.height/2) + this.yPadding,
					afterTitleIndex = index-1;

				//If the index is zero, we're getting the title
				if (index === 0){
					return baseLineHeight + this.titleHeight / 3;
				} else{
					return baseLineHeight + ((this.fontSize * 1.5 * afterTitleIndex) + this.fontSize / 2) + this.titleHeight;
				}

			},
			draw : function(){
				// Custom Tooltips
				if(this.custom){
					this.custom(this);
				}
				else{
					drawRoundedRectangle(this.ctx,this.x,this.y - this.height/2,this.width,this.height,this.cornerRadius);
					var ctx = this.ctx;
					ctx.fillStyle = this.fillColor;
					ctx.fill();
					ctx.closePath();

					ctx.textAlign = "left";
					ctx.textBaseline = "middle";
					ctx.fillStyle = this.titleTextColor;
					ctx.font = this.titleFont;

					ctx.fillText(this.title,this.x + this.xPadding, this.getLineHeight(0));

					ctx.font = this.font;
					helpers.each(this.labels,function(label,index){
						ctx.fillStyle = this.textColor;
						ctx.fillText(label,this.x + this.xPadding + this.fontSize + 3, this.getLineHeight(index + 1));

						//A bit gnarly, but clearing this rectangle breaks when using explorercanvas (clears whole canvas)
						//ctx.clearRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);
						//Instead we'll make a white filled block to put the legendColour palette over.

						ctx.fillStyle = this.legendColorBackground;
						ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);

						ctx.fillStyle = this.legendColors[index].fill;
						ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);


					},this);
				}
			}
		});

		Chart.Scale = Chart.Element.extend({
			initialize : function(){
				this.fit();
			},
			buildYLabels : function(){
				this.yLabels = [];

				var stepDecimalPlaces = getDecimalPlaces(this.stepValue);

				for (var i=0; i<=this.steps; i++){
					this.yLabels.push(template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));
				}
				this.yLabelWidth = (this.display && this.showLabels) ? longestText(this.ctx,this.font,this.yLabels) + 10 : 0;
			},
			addXLabel : function(label){
				this.xLabels.push(label);
				this.valuesCount++;
				this.fit();
			},
			removeXLabel : function(){
				this.xLabels.shift();
				this.valuesCount--;
				this.fit();
			},
			// Fitting loop to rotate x Labels and figure out what fits there, and also calculate how many Y steps to use
			fit: function(){
				// First we need the width of the yLabels, assuming the xLabels aren't rotated

				// To do that we need the base line at the top and base of the chart, assuming there is no x label rotation
				this.startPoint = (this.display) ? this.fontSize : 0;
				this.endPoint = (this.display) ? this.height - (this.fontSize * 1.5) - 5 : this.height; // -5 to pad labels

				// Apply padding settings to the start and end point.
				this.startPoint += this.padding;
				this.endPoint -= this.padding;

				// Cache the starting endpoint, excluding the space for x labels
				var cachedEndPoint = this.endPoint;

				// Cache the starting height, so can determine if we need to recalculate the scale yAxis
				var cachedHeight = this.endPoint - this.startPoint,
					cachedYLabelWidth;

				// Build the current yLabels so we have an idea of what size they'll be to start
				/*
				 *	This sets what is returned from calculateScaleRange as static properties of this class:
				 *
					this.steps;
					this.stepValue;
					this.min;
					this.max;
				 *
				 */
				this.calculateYRange(cachedHeight);

				// With these properties set we can now build the array of yLabels
				// and also the width of the largest yLabel
				this.buildYLabels();

				this.calculateXLabelRotation();

				while((cachedHeight > this.endPoint - this.startPoint)){
					cachedHeight = this.endPoint - this.startPoint;
					cachedYLabelWidth = this.yLabelWidth;

					this.calculateYRange(cachedHeight);
					this.buildYLabels();

					// Only go through the xLabel loop again if the yLabel width has changed
					if (cachedYLabelWidth < this.yLabelWidth){
						this.endPoint = cachedEndPoint;
						this.calculateXLabelRotation();
					}
				}

			},
			calculateXLabelRotation : function(){
				//Get the width of each grid by calculating the difference
				//between x offsets between 0 and 1.

				this.ctx.font = this.font;

				var firstWidth = this.ctx.measureText(this.xLabels[0]).width,
					lastWidth = this.ctx.measureText(this.xLabels[this.xLabels.length - 1]).width,
					firstRotated,
					lastRotated;


				this.xScalePaddingRight = lastWidth/2 + 3;
				this.xScalePaddingLeft = (firstWidth/2 > this.yLabelWidth) ? firstWidth/2 : this.yLabelWidth;

				this.xLabelRotation = 0;
				if (this.display){
					var originalLabelWidth = longestText(this.ctx,this.font,this.xLabels),
						cosRotation,
						firstRotatedWidth;
					this.xLabelWidth = originalLabelWidth;
					//Allow 3 pixels x2 padding either side for label readability
					var xGridWidth = Math.floor(this.calculateX(1) - this.calculateX(0)) - 6;

					//Max label rotate should be 90 - also act as a loop counter
					while ((this.xLabelWidth > xGridWidth && this.xLabelRotation === 0) || (this.xLabelWidth > xGridWidth && this.xLabelRotation <= 90 && this.xLabelRotation > 0)){
						cosRotation = Math.cos(toRadians(this.xLabelRotation));

						firstRotated = cosRotation * firstWidth;
						lastRotated = cosRotation * lastWidth;

						// We're right aligning the text now.
						if (firstRotated + this.fontSize / 2 > this.yLabelWidth){
							this.xScalePaddingLeft = firstRotated + this.fontSize / 2;
						}
						this.xScalePaddingRight = this.fontSize/2;


						this.xLabelRotation++;
						this.xLabelWidth = cosRotation * originalLabelWidth;

					}
					if (this.xLabelRotation > 0){
						this.endPoint -= Math.sin(toRadians(this.xLabelRotation))*originalLabelWidth + 3;
					}
				}
				else{
					this.xLabelWidth = 0;
					this.xScalePaddingRight = this.padding;
					this.xScalePaddingLeft = this.padding;
				}

			},
			// Needs to be overidden in each Chart type
			// Otherwise we need to pass all the data into the scale class
			calculateYRange: noop,
			drawingArea: function(){
				return this.startPoint - this.endPoint;
			},
			calculateY : function(value){
				var scalingFactor = this.drawingArea() / (this.min - this.max);
				return this.endPoint - (scalingFactor * (value - this.min));
			},
			calculateX : function(index){
				var isRotated = (this.xLabelRotation > 0),
					// innerWidth = (this.offsetGridLines) ? this.width - offsetLeft - this.padding : this.width - (offsetLeft + halfLabelWidth * 2) - this.padding,
					innerWidth = this.width - (this.xScalePaddingLeft + this.xScalePaddingRight),
					valueWidth = innerWidth/Math.max((this.valuesCount - ((this.offsetGridLines) ? 0 : 1)), 1),
					valueOffset = (valueWidth * index) + this.xScalePaddingLeft;

				if (this.offsetGridLines){
					valueOffset += (valueWidth/2);
				}

				return Math.round(valueOffset);
			},
			update : function(newProps){
				helpers.extend(this, newProps);
				this.fit();
			},
			draw : function(){
				var ctx = this.ctx,
					yLabelGap = (this.endPoint - this.startPoint) / this.steps,
					xStart = Math.round(this.xScalePaddingLeft);
				if (this.display){
					ctx.fillStyle = this.textColor;
					ctx.font = this.font;
					each(this.yLabels,function(labelString,index){
						var yLabelCenter = this.endPoint - (yLabelGap * index),
							linePositionY = Math.round(yLabelCenter),
							drawHorizontalLine = this.showHorizontalLines;

						ctx.textAlign = "right";
						ctx.textBaseline = "middle";
						if (this.showLabels){
							ctx.fillText(labelString,xStart - 10,yLabelCenter);
						}

						// This is X axis, so draw it
						if (index === 0 && !drawHorizontalLine){
							drawHorizontalLine = true;
						}

						if (drawHorizontalLine){
							ctx.beginPath();
						}

						if (index > 0){
							// This is a grid line in the centre, so drop that
							ctx.lineWidth = this.gridLineWidth;
							ctx.strokeStyle = this.gridLineColor;
						} else {
							// This is the first line on the scale
							ctx.lineWidth = this.lineWidth;
							ctx.strokeStyle = this.lineColor;
						}

						linePositionY += helpers.aliasPixel(ctx.lineWidth);

						if(drawHorizontalLine){
							ctx.moveTo(xStart, linePositionY);
							ctx.lineTo(this.width, linePositionY);
							ctx.stroke();
							ctx.closePath();
						}

						ctx.lineWidth = this.lineWidth;
						ctx.strokeStyle = this.lineColor;
						ctx.beginPath();
						ctx.moveTo(xStart - 5, linePositionY);
						ctx.lineTo(xStart, linePositionY);
						ctx.stroke();
						ctx.closePath();

					},this);

					each(this.xLabels,function(label,index){
						var xPos = this.calculateX(index) + aliasPixel(this.lineWidth),
							// Check to see if line/bar here and decide where to place the line
							linePos = this.calculateX(index - (this.offsetGridLines ? 0.5 : 0)) + aliasPixel(this.lineWidth),
							isRotated = (this.xLabelRotation > 0),
							drawVerticalLine = this.showVerticalLines;

						// This is Y axis, so draw it
						if (index === 0 && !drawVerticalLine){
							drawVerticalLine = true;
						}

						if (drawVerticalLine){
							ctx.beginPath();
						}

						if (index > 0){
							// This is a grid line in the centre, so drop that
							ctx.lineWidth = this.gridLineWidth;
							ctx.strokeStyle = this.gridLineColor;
						} else {
							// This is the first line on the scale
							ctx.lineWidth = this.lineWidth;
							ctx.strokeStyle = this.lineColor;
						}

						if (drawVerticalLine){
							ctx.moveTo(linePos,this.endPoint);
							ctx.lineTo(linePos,this.startPoint - 3);
							ctx.stroke();
							ctx.closePath();
						}


						ctx.lineWidth = this.lineWidth;
						ctx.strokeStyle = this.lineColor;


						// Small lines at the bottom of the base grid line
						ctx.beginPath();
						ctx.moveTo(linePos,this.endPoint);
						ctx.lineTo(linePos,this.endPoint + 5);
						ctx.stroke();
						ctx.closePath();

						ctx.save();
						ctx.translate(xPos,(isRotated) ? this.endPoint + 12 : this.endPoint + 8);
						ctx.rotate(toRadians(this.xLabelRotation)*-1);
						ctx.font = this.font;
						ctx.textAlign = (isRotated) ? "right" : "center";
						ctx.textBaseline = (isRotated) ? "middle" : "top";
						ctx.fillText(label, 0, 0);
						ctx.restore();
					},this);

				}
			}

		});

		Chart.RadialScale = Chart.Element.extend({
			initialize: function(){
				this.size = min([this.height, this.width]);
				this.drawingArea = (this.display) ? (this.size/2) - (this.fontSize/2 + this.backdropPaddingY) : (this.size/2);
			},
			calculateCenterOffset: function(value){
				// Take into account half font size + the yPadding of the top value
				var scalingFactor = this.drawingArea / (this.max - this.min);

				return (value - this.min) * scalingFactor;
			},
			update : function(){
				if (!this.lineArc){
					this.setScaleSize();
				} else {
					this.drawingArea = (this.display) ? (this.size/2) - (this.fontSize/2 + this.backdropPaddingY) : (this.size/2);
				}
				this.buildYLabels();
			},
			buildYLabels: function(){
				this.yLabels = [];

				var stepDecimalPlaces = getDecimalPlaces(this.stepValue);

				for (var i=0; i<=this.steps; i++){
					this.yLabels.push(template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));
				}
			},
			getCircumference : function(){
				return ((Math.PI*2) / this.valuesCount);
			},
			setScaleSize: function(){
				/*
				 * Right, this is really confusing and there is a lot of maths going on here
				 * The gist of the problem is here: https://gist.github.com/nnnick/696cc9c55f4b0beb8fe9
				 *
				 * Reaction: https://dl.dropboxusercontent.com/u/34601363/toomuchscience.gif
				 *
				 * Solution:
				 *
				 * We assume the radius of the polygon is half the size of the canvas at first
				 * at each index we check if the text overlaps.
				 *
				 * Where it does, we store that angle and that index.
				 *
				 * After finding the largest index and angle we calculate how much we need to remove
				 * from the shape radius to move the point inwards by that x.
				 *
				 * We average the left and right distances to get the maximum shape radius that can fit in the box
				 * along with labels.
				 *
				 * Once we have that, we can find the centre point for the chart, by taking the x text protrusion
				 * on each side, removing that from the size, halving it and adding the left x protrusion width.
				 *
				 * This will mean we have a shape fitted to the canvas, as large as it can be with the labels
				 * and position it in the most space efficient manner
				 *
				 * https://dl.dropboxusercontent.com/u/34601363/yeahscience.gif
				 */


				// Get maximum radius of the polygon. Either half the height (minus the text width) or half the width.
				// Use this to calculate the offset + change. - Make sure L/R protrusion is at least 0 to stop issues with centre points
				var largestPossibleRadius = min([(this.height/2 - this.pointLabelFontSize - 5), this.width/2]),
					pointPosition,
					i,
					textWidth,
					halfTextWidth,
					furthestRight = this.width,
					furthestRightIndex,
					furthestRightAngle,
					furthestLeft = 0,
					furthestLeftIndex,
					furthestLeftAngle,
					xProtrusionLeft,
					xProtrusionRight,
					radiusReductionRight,
					radiusReductionLeft,
					maxWidthRadius;
				this.ctx.font = fontString(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily);
				for (i=0;i<this.valuesCount;i++){
					// 5px to space the text slightly out - similar to what we do in the draw function.
					pointPosition = this.getPointPosition(i, largestPossibleRadius);
					textWidth = this.ctx.measureText(template(this.templateString, { value: this.labels[i] })).width + 5;
					if (i === 0 || i === this.valuesCount/2){
						// If we're at index zero, or exactly the middle, we're at exactly the top/bottom
						// of the radar chart, so text will be aligned centrally, so we'll half it and compare
						// w/left and right text sizes
						halfTextWidth = textWidth/2;
						if (pointPosition.x + halfTextWidth > furthestRight) {
							furthestRight = pointPosition.x + halfTextWidth;
							furthestRightIndex = i;
						}
						if (pointPosition.x - halfTextWidth < furthestLeft) {
							furthestLeft = pointPosition.x - halfTextWidth;
							furthestLeftIndex = i;
						}
					}
					else if (i < this.valuesCount/2) {
						// Less than half the values means we'll left align the text
						if (pointPosition.x + textWidth > furthestRight) {
							furthestRight = pointPosition.x + textWidth;
							furthestRightIndex = i;
						}
					}
					else if (i > this.valuesCount/2){
						// More than half the values means we'll right align the text
						if (pointPosition.x - textWidth < furthestLeft) {
							furthestLeft = pointPosition.x - textWidth;
							furthestLeftIndex = i;
						}
					}
				}

				xProtrusionLeft = furthestLeft;

				xProtrusionRight = Math.ceil(furthestRight - this.width);

				furthestRightAngle = this.getIndexAngle(furthestRightIndex);

				furthestLeftAngle = this.getIndexAngle(furthestLeftIndex);

				radiusReductionRight = xProtrusionRight / Math.sin(furthestRightAngle + Math.PI/2);

				radiusReductionLeft = xProtrusionLeft / Math.sin(furthestLeftAngle + Math.PI/2);

				// Ensure we actually need to reduce the size of the chart
				radiusReductionRight = (isNumber(radiusReductionRight)) ? radiusReductionRight : 0;
				radiusReductionLeft = (isNumber(radiusReductionLeft)) ? radiusReductionLeft : 0;

				this.drawingArea = largestPossibleRadius - (radiusReductionLeft + radiusReductionRight)/2;

				//this.drawingArea = min([maxWidthRadius, (this.height - (2 * (this.pointLabelFontSize + 5)))/2])
				this.setCenterPoint(radiusReductionLeft, radiusReductionRight);

			},
			setCenterPoint: function(leftMovement, rightMovement){

				var maxRight = this.width - rightMovement - this.drawingArea,
					maxLeft = leftMovement + this.drawingArea;

				this.xCenter = (maxLeft + maxRight)/2;
				// Always vertically in the centre as the text height doesn't change
				this.yCenter = (this.height/2);
			},

			getIndexAngle : function(index){
				var angleMultiplier = (Math.PI * 2) / this.valuesCount;
				// Start from the top instead of right, so remove a quarter of the circle

				return index * angleMultiplier - (Math.PI/2);
			},
			getPointPosition : function(index, distanceFromCenter){
				var thisAngle = this.getIndexAngle(index);
				return {
					x : (Math.cos(thisAngle) * distanceFromCenter) + this.xCenter,
					y : (Math.sin(thisAngle) * distanceFromCenter) + this.yCenter
				};
			},
			draw: function(){
				if (this.display){
					var ctx = this.ctx;
					each(this.yLabels, function(label, index){
						// Don't draw a centre value
						if (index > 0){
							var yCenterOffset = index * (this.drawingArea/this.steps),
								yHeight = this.yCenter - yCenterOffset,
								pointPosition;

							// Draw circular lines around the scale
							if (this.lineWidth > 0){
								ctx.strokeStyle = this.lineColor;
								ctx.lineWidth = this.lineWidth;

								if(this.lineArc){
									ctx.beginPath();
									ctx.arc(this.xCenter, this.yCenter, yCenterOffset, 0, Math.PI*2);
									ctx.closePath();
									ctx.stroke();
								} else{
									ctx.beginPath();
									for (var i=0;i<this.valuesCount;i++)
									{
										pointPosition = this.getPointPosition(i, this.calculateCenterOffset(this.min + (index * this.stepValue)));
										if (i === 0){
											ctx.moveTo(pointPosition.x, pointPosition.y);
										} else {
											ctx.lineTo(pointPosition.x, pointPosition.y);
										}
									}
									ctx.closePath();
									ctx.stroke();
								}
							}
							if(this.showLabels){
								ctx.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);
								if (this.showLabelBackdrop){
									var labelWidth = ctx.measureText(label).width;
									ctx.fillStyle = this.backdropColor;
									ctx.fillRect(
										this.xCenter - labelWidth/2 - this.backdropPaddingX,
										yHeight - this.fontSize/2 - this.backdropPaddingY,
										labelWidth + this.backdropPaddingX*2,
										this.fontSize + this.backdropPaddingY*2
									);
								}
								ctx.textAlign = 'center';
								ctx.textBaseline = "middle";
								ctx.fillStyle = this.fontColor;
								ctx.fillText(label, this.xCenter, yHeight);
							}
						}
					}, this);

					if (!this.lineArc){
						ctx.lineWidth = this.angleLineWidth;
						ctx.strokeStyle = this.angleLineColor;
						for (var i = this.valuesCount - 1; i >= 0; i--) {
							var centerOffset = null, outerPosition = null;

							if (this.angleLineWidth > 0 && (i % this.angleLineInterval === 0)){
								centerOffset = this.calculateCenterOffset(this.max);
								outerPosition = this.getPointPosition(i, centerOffset);
								ctx.beginPath();
								ctx.moveTo(this.xCenter, this.yCenter);
								ctx.lineTo(outerPosition.x, outerPosition.y);
								ctx.stroke();
								ctx.closePath();
							}

							if (this.backgroundColors && this.backgroundColors.length == this.valuesCount) {
								if (centerOffset == null)
									centerOffset = this.calculateCenterOffset(this.max);

								if (outerPosition == null)
									outerPosition = this.getPointPosition(i, centerOffset);

								var previousOuterPosition = this.getPointPosition(i === 0 ? this.valuesCount - 1 : i - 1, centerOffset);
								var nextOuterPosition = this.getPointPosition(i === this.valuesCount - 1 ? 0 : i + 1, centerOffset);

								var previousOuterHalfway = { x: (previousOuterPosition.x + outerPosition.x) / 2, y: (previousOuterPosition.y + outerPosition.y) / 2 };
								var nextOuterHalfway = { x: (outerPosition.x + nextOuterPosition.x) / 2, y: (outerPosition.y + nextOuterPosition.y) / 2 };

								ctx.beginPath();
								ctx.moveTo(this.xCenter, this.yCenter);
								ctx.lineTo(previousOuterHalfway.x, previousOuterHalfway.y);
								ctx.lineTo(outerPosition.x, outerPosition.y);
								ctx.lineTo(nextOuterHalfway.x, nextOuterHalfway.y);
								ctx.fillStyle = this.backgroundColors[i];
								ctx.fill();
								ctx.closePath();
							}
							// Extra 3px out for some label spacing
							var pointLabelPosition = this.getPointPosition(i, this.calculateCenterOffset(this.max) + 5);
							ctx.font = fontString(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily);
							ctx.fillStyle = this.pointLabelFontColor;

							var labelsCount = this.labels.length,
								halfLabelsCount = this.labels.length/2,
								quarterLabelsCount = halfLabelsCount/2,
								upperHalf = (i < quarterLabelsCount || i > labelsCount - quarterLabelsCount),
								exactQuarter = (i === quarterLabelsCount || i === labelsCount - quarterLabelsCount);
							if (i === 0){
								ctx.textAlign = 'center';
							} else if(i === halfLabelsCount){
								ctx.textAlign = 'center';
							} else if (i < halfLabelsCount){
								ctx.textAlign = 'left';
							} else {
								ctx.textAlign = 'right';
							}

							// Set the correct text baseline based on outer positioning
							if (exactQuarter){
								ctx.textBaseline = 'middle';
							} else if (upperHalf){
								ctx.textBaseline = 'bottom';
							} else {
								ctx.textBaseline = 'top';
							}

							ctx.fillText(this.labels[i], pointLabelPosition.x, pointLabelPosition.y);
						}
					}
				}
			}
		});

		Chart.animationService = {
			frameDuration: 17,
			animations: [],
			dropFrames: 0,
			addAnimation: function(chartInstance, animationObject) {
				for (var index = 0; index < this.animations.length; ++ index){
					if (this.animations[index].chartInstance === chartInstance){
						// replacing an in progress animation
						this.animations[index].animationObject = animationObject;
						return;
					}
				}
				
				this.animations.push({
					chartInstance: chartInstance,
					animationObject: animationObject
				});

				// If there are no animations queued, manually kickstart a digest, for lack of a better word
				if (this.animations.length == 1) {
					helpers.requestAnimFrame.call(window, this.digestWrapper);
				}
			},
			// Cancel the animation for a given chart instance
			cancelAnimation: function(chartInstance) {
				var index = helpers.findNextWhere(this.animations, function(animationWrapper) {
					return animationWrapper.chartInstance === chartInstance;
				});
				
				if (index)
				{
					this.animations.splice(index, 1);
				}
			},
			// calls startDigest with the proper context
			digestWrapper: function() {
				Chart.animationService.startDigest.call(Chart.animationService);
			},
			startDigest: function() {

				var startTime = Date.now();
				var framesToDrop = 0;

				if(this.dropFrames > 1){
					framesToDrop = Math.floor(this.dropFrames);
					this.dropFrames -= framesToDrop;
				}

				for (var i = 0; i < this.animations.length; i++) {

					if (this.animations[i].animationObject.currentStep === null){
						this.animations[i].animationObject.currentStep = 0;
					}

					this.animations[i].animationObject.currentStep += 1 + framesToDrop;
					if(this.animations[i].animationObject.currentStep > this.animations[i].animationObject.numSteps){
						this.animations[i].animationObject.currentStep = this.animations[i].animationObject.numSteps;
					}
					
					this.animations[i].animationObject.render(this.animations[i].chartInstance, this.animations[i].animationObject);
					
					// Check if executed the last frame.
					if (this.animations[i].animationObject.currentStep == this.animations[i].animationObject.numSteps){
						// Call onAnimationComplete
						this.animations[i].animationObject.onAnimationComplete.call(this.animations[i].chartInstance);
						// Remove the animation.
						this.animations.splice(i, 1);
						// Keep the index in place to offset the splice
						i--;
					}
				}

				var endTime = Date.now();
				var delay = endTime - startTime - this.frameDuration;
				var frameDelay = delay / this.frameDuration;

				if(frameDelay > 1){
					this.dropFrames += frameDelay;
				}

				// Do we have more stuff to animate?
				if (this.animations.length > 0){
					helpers.requestAnimFrame.call(window, this.digestWrapper);
				}
			}
		};

		// Attach global event to resize each chart instance when the browser resizes
		helpers.addEvent(window, "resize", (function(){
			// Basic debounce of resize function so it doesn't hurt performance when resizing browser.
			var timeout;
			return function(){
				clearTimeout(timeout);
				timeout = setTimeout(function(){
					each(Chart.instances,function(instance){
						// If the responsive flag is set in the chart instance config
						// Cascade the resize event down to the chart.
						if (instance.options.responsive){
							instance.resize(instance.render, true);
						}
					});
				}, 50);
			};
		})());


		if (amd) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
				return Chart;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module === 'object' && module.exports) {
			module.exports = Chart;
		}

		root.Chart = Chart;

		Chart.noConflict = function(){
			root.Chart = previous;
			return Chart;
		};

	}).call(this);

	(function(){
		"use strict";

		var root = this,
			Chart = root.Chart,
			helpers = Chart.helpers;


		var defaultConfig = {
			//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
			scaleBeginAtZero : true,

			//Boolean - Whether grid lines are shown across the chart
			scaleShowGridLines : true,

			//String - Colour of the grid lines
			scaleGridLineColor : "rgba(0,0,0,.05)",

			//Number - Width of the grid lines
			scaleGridLineWidth : 1,

			//Boolean - Whether to show horizontal lines (except X axis)
			scaleShowHorizontalLines: true,

			//Boolean - Whether to show vertical lines (except Y axis)
			scaleShowVerticalLines: true,

			//Boolean - If there is a stroke on each bar
			barShowStroke : true,

			//Number - Pixel width of the bar stroke
			barStrokeWidth : 2,

			//Number - Spacing between each of the X value sets
			barValueSpacing : 5,

			//Number - Spacing between data sets within X values
			barDatasetSpacing : 1,

			//String - A legend template
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span class=\"<%=name.toLowerCase()%>-legend-icon\" style=\"background-color:<%=datasets[i].fillColor%>\"></span><span class=\"<%=name.toLowerCase()%>-legend-text\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"

		};


		Chart.Type.extend({
			name: "Bar",
			defaults : defaultConfig,
			initialize:  function(data){

				//Expose options as a scope variable here so we can access it in the ScaleClass
				var options = this.options;

				this.ScaleClass = Chart.Scale.extend({
					offsetGridLines : true,
					calculateBarX : function(datasetCount, datasetIndex, barIndex){
						//Reusable method for calculating the xPosition of a given bar based on datasetIndex & width of the bar
						var xWidth = this.calculateBaseWidth(),
							xAbsolute = this.calculateX(barIndex) - (xWidth/2),
							barWidth = this.calculateBarWidth(datasetCount);

						return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * options.barDatasetSpacing) + barWidth/2;
					},
					calculateBaseWidth : function(){
						return (this.calculateX(1) - this.calculateX(0)) - (2*options.barValueSpacing);
					},
					calculateBarWidth : function(datasetCount){
						//The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
						var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);

						return (baseWidth / datasetCount);
					}
				});

				this.datasets = [];

				//Set up tooltip events on the chart
				if (this.options.showTooltips){
					helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
						var activeBars = (evt.type !== 'mouseout') ? this.getBarsAtEvent(evt) : [];

						this.eachBars(function(bar){
							bar.restore(['fillColor', 'strokeColor']);
						});
						helpers.each(activeBars, function(activeBar){
							if (activeBar) {
								activeBar.fillColor = activeBar.highlightFill;
								activeBar.strokeColor = activeBar.highlightStroke;
							}
						});
						this.showTooltip(activeBars);
					});
				}

				//Declare the extension of the default point, to cater for the options passed in to the constructor
				this.BarClass = Chart.Rectangle.extend({
					strokeWidth : this.options.barStrokeWidth,
					showStroke : this.options.barShowStroke,
					ctx : this.chart.ctx
				});

				//Iterate through each of the datasets, and build this into a property of the chart
				helpers.each(data.datasets,function(dataset,datasetIndex){

					var datasetObject = {
						label : dataset.label || null,
						fillColor : dataset.fillColor,
						strokeColor : dataset.strokeColor,
						bars : []
					};

					this.datasets.push(datasetObject);

					helpers.each(dataset.data,function(dataPoint,index){
						//Add a new point for each piece of data, passing any required data to draw.
						datasetObject.bars.push(new this.BarClass({
							value : dataPoint,
							label : data.labels[index],
							datasetLabel: dataset.label,
							strokeColor : (typeof dataset.strokeColor == 'object') ? dataset.strokeColor[index] : dataset.strokeColor,
							fillColor : (typeof dataset.fillColor == 'object') ? dataset.fillColor[index] : dataset.fillColor,
							highlightFill : (dataset.highlightFill) ? (typeof dataset.highlightFill == 'object') ? dataset.highlightFill[index] : dataset.highlightFill : (typeof dataset.fillColor == 'object') ? dataset.fillColor[index] : dataset.fillColor,
							highlightStroke : (dataset.highlightStroke) ? (typeof dataset.highlightStroke == 'object') ? dataset.highlightStroke[index] : dataset.highlightStroke : (typeof dataset.strokeColor == 'object') ? dataset.strokeColor[index] : dataset.strokeColor
						}));
					},this);

				},this);

				this.buildScale(data.labels);

				this.BarClass.prototype.base = this.scale.endPoint;

				this.eachBars(function(bar, index, datasetIndex){
					helpers.extend(bar, {
						width : this.scale.calculateBarWidth(this.datasets.length),
						x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
						y: this.scale.endPoint
					});
					bar.save();
				}, this);

				this.render();
			},
			update : function(){
				this.scale.update();
				// Reset any highlight colours before updating.
				helpers.each(this.activeElements, function(activeElement){
					activeElement.restore(['fillColor', 'strokeColor']);
				});

				this.eachBars(function(bar){
					bar.save();
				});
				this.render();
			},
			eachBars : function(callback){
				helpers.each(this.datasets,function(dataset, datasetIndex){
					helpers.each(dataset.bars, callback, this, datasetIndex);
				},this);
			},
			getBarsAtEvent : function(e){
				var barsArray = [],
					eventPosition = helpers.getRelativePosition(e),
					datasetIterator = function(dataset){
						barsArray.push(dataset.bars[barIndex]);
					},
					barIndex;

				for (var datasetIndex = 0; datasetIndex < this.datasets.length; datasetIndex++) {
					for (barIndex = 0; barIndex < this.datasets[datasetIndex].bars.length; barIndex++) {
						if (this.datasets[datasetIndex].bars[barIndex].inRange(eventPosition.x,eventPosition.y)){
							helpers.each(this.datasets, datasetIterator);
							return barsArray;
						}
					}
				}

				return barsArray;
			},
			buildScale : function(labels){
				var self = this;

				var dataTotal = function(){
					var values = [];
					self.eachBars(function(bar){
						values.push(bar.value);
					});
					return values;
				};

				var scaleOptions = {
					templateString : this.options.scaleLabel,
					height : this.chart.height,
					width : this.chart.width,
					ctx : this.chart.ctx,
					textColor : this.options.scaleFontColor,
					fontSize : this.options.scaleFontSize,
					fontStyle : this.options.scaleFontStyle,
					fontFamily : this.options.scaleFontFamily,
					valuesCount : labels.length,
					beginAtZero : this.options.scaleBeginAtZero,
					integersOnly : this.options.scaleIntegersOnly,
					calculateYRange: function(currentHeight){
						var updatedRanges = helpers.calculateScaleRange(
							dataTotal(),
							currentHeight,
							this.fontSize,
							this.beginAtZero,
							this.integersOnly
						);
						helpers.extend(this, updatedRanges);
					},
					xLabels : labels,
					font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
					lineWidth : this.options.scaleLineWidth,
					lineColor : this.options.scaleLineColor,
					showHorizontalLines : this.options.scaleShowHorizontalLines,
					showVerticalLines : this.options.scaleShowVerticalLines,
					gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
					gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
					padding : (this.options.showScale) ? 0 : (this.options.barShowStroke) ? this.options.barStrokeWidth : 0,
					showLabels : this.options.scaleShowLabels,
					display : this.options.showScale
				};

				if (this.options.scaleOverride){
					helpers.extend(scaleOptions, {
						calculateYRange: helpers.noop,
						steps: this.options.scaleSteps,
						stepValue: this.options.scaleStepWidth,
						min: this.options.scaleStartValue,
						max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
					});
				}

				this.scale = new this.ScaleClass(scaleOptions);
			},
			addData : function(valuesArray,label){
				//Map the values array for each of the datasets
				helpers.each(valuesArray,function(value,datasetIndex){
					//Add a new point for each piece of data, passing any required data to draw.
					this.datasets[datasetIndex].bars.push(new this.BarClass({
						value : value,
						label : label,
						datasetLabel: this.datasets[datasetIndex].label,
						x: this.scale.calculateBarX(this.datasets.length, datasetIndex, this.scale.valuesCount+1),
						y: this.scale.endPoint,
						width : this.scale.calculateBarWidth(this.datasets.length),
						base : this.scale.endPoint,
						strokeColor : this.datasets[datasetIndex].strokeColor,
						fillColor : this.datasets[datasetIndex].fillColor
					}));
				},this);

				this.scale.addXLabel(label);
				//Then re-render the chart.
				this.update();
			},
			removeData : function(){
				this.scale.removeXLabel();
				//Then re-render the chart.
				helpers.each(this.datasets,function(dataset){
					dataset.bars.shift();
				},this);
				this.update();
			},
			reflow : function(){
				helpers.extend(this.BarClass.prototype,{
					y: this.scale.endPoint,
					base : this.scale.endPoint
				});
				var newScaleProps = helpers.extend({
					height : this.chart.height,
					width : this.chart.width
				});
				this.scale.update(newScaleProps);
			},
			draw : function(ease){
				var easingDecimal = ease || 1;
				this.clear();

				var ctx = this.chart.ctx;

				this.scale.draw(easingDecimal);

				//Draw all the bars for each dataset
				helpers.each(this.datasets,function(dataset,datasetIndex){
					helpers.each(dataset.bars,function(bar,index){
						if (bar.hasValue()){
							bar.base = this.scale.endPoint;
							//Transition then draw
							bar.transition({
								x : this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
								y : this.scale.calculateY(bar.value),
								width : this.scale.calculateBarWidth(this.datasets.length)
							}, easingDecimal).draw();
						}
					},this);

				},this);
			}
		});


	}).call(this);

	(function(){
		"use strict";

		var root = this,
			Chart = root.Chart,
			//Cache a local reference to Chart.helpers
			helpers = Chart.helpers;

		var defaultConfig = {
			//Boolean - Whether we should show a stroke on each segment
			segmentShowStroke : true,

			//String - The colour of each segment stroke
			segmentStrokeColor : "#fff",

			//Number - The width of each segment stroke
			segmentStrokeWidth : 2,

			//The percentage of the chart that we cut out of the middle.
			percentageInnerCutout : 50,

			//Number - Amount of animation steps
			animationSteps : 100,

			//String - Animation easing effect
			animationEasing : "easeOutBounce",

			//Boolean - Whether we animate the rotation of the Doughnut
			animateRotate : true,

			//Boolean - Whether we animate scaling the Doughnut from the centre
			animateScale : false,

			//String - A legend template
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span class=\"<%=name.toLowerCase()%>-legend-icon\" style=\"background-color:<%=segments[i].fillColor%>\"></span><span class=\"<%=name.toLowerCase()%>-legend-text\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"

		};

		Chart.Type.extend({
			//Passing in a name registers this chart in the Chart namespace
			name: "Doughnut",
			//Providing a defaults will also register the defaults in the chart namespace
			defaults : defaultConfig,
			//Initialize is fired when the chart is initialized - Data is passed in as a parameter
			//Config is automatically merged by the core of Chart.js, and is available at this.options
			initialize:  function(data){

				//Declare segments as a static property to prevent inheriting across the Chart type prototype
				this.segments = [];
				this.outerRadius = (helpers.min([this.chart.width,this.chart.height]) -	this.options.segmentStrokeWidth/2)/2;

				this.SegmentArc = Chart.Arc.extend({
					ctx : this.chart.ctx,
					x : this.chart.width/2,
					y : this.chart.height/2
				});

				//Set up tooltip events on the chart
				if (this.options.showTooltips){
					helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
						var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];

						helpers.each(this.segments,function(segment){
							segment.restore(["fillColor"]);
						});
						helpers.each(activeSegments,function(activeSegment){
							activeSegment.fillColor = activeSegment.highlightColor;
						});
						this.showTooltip(activeSegments);
					});
				}
				this.calculateTotal(data);

				helpers.each(data,function(datapoint, index){
					if (!datapoint.color) {
						datapoint.color = 'hsl(' + (360 * index / data.length) + ', 100%, 50%)';
					}
					this.addData(datapoint, index, true);
				},this);

				this.render();
			},
			getSegmentsAtEvent : function(e){
				var segmentsArray = [];

				var location = helpers.getRelativePosition(e);

				helpers.each(this.segments,function(segment){
					if (segment.inRange(location.x,location.y)) segmentsArray.push(segment);
				},this);
				return segmentsArray;
			},
			addData : function(segment, atIndex, silent){
				var index = atIndex !== undefined ? atIndex : this.segments.length;
				if ( typeof(segment.color) === "undefined" ) {
					segment.color = Chart.defaults.global.segmentColorDefault[index % Chart.defaults.global.segmentColorDefault.length];
					segment.highlight = Chart.defaults.global.segmentHighlightColorDefaults[index % Chart.defaults.global.segmentHighlightColorDefaults.length];				
				}
				this.segments.splice(index, 0, new this.SegmentArc({
					value : segment.value,
					outerRadius : (this.options.animateScale) ? 0 : this.outerRadius,
					innerRadius : (this.options.animateScale) ? 0 : (this.outerRadius/100) * this.options.percentageInnerCutout,
					fillColor : segment.color,
					highlightColor : segment.highlight || segment.color,
					showStroke : this.options.segmentShowStroke,
					strokeWidth : this.options.segmentStrokeWidth,
					strokeColor : this.options.segmentStrokeColor,
					startAngle : Math.PI * 1.5,
					circumference : (this.options.animateRotate) ? 0 : this.calculateCircumference(segment.value),
					label : segment.label
				}));
				if (!silent){
					this.reflow();
					this.update();
				}
			},
			calculateCircumference : function(value) {
				if ( this.total > 0 ) {
					return (Math.PI*2)*(value / this.total);
				} else {
					return 0;
				}
			},
			calculateTotal : function(data){
				this.total = 0;
				helpers.each(data,function(segment){
					this.total += Math.abs(segment.value);
				},this);
			},
			update : function(){
				this.calculateTotal(this.segments);

				// Reset any highlight colours before updating.
				helpers.each(this.activeElements, function(activeElement){
					activeElement.restore(['fillColor']);
				});

				helpers.each(this.segments,function(segment){
					segment.save();
				});
				this.render();
			},

			removeData: function(atIndex){
				var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length-1;
				this.segments.splice(indexToDelete, 1);
				this.reflow();
				this.update();
			},

			reflow : function(){
				helpers.extend(this.SegmentArc.prototype,{
					x : this.chart.width/2,
					y : this.chart.height/2
				});
				this.outerRadius = (helpers.min([this.chart.width,this.chart.height]) -	this.options.segmentStrokeWidth/2)/2;
				helpers.each(this.segments, function(segment){
					segment.update({
						outerRadius : this.outerRadius,
						innerRadius : (this.outerRadius/100) * this.options.percentageInnerCutout
					});
				}, this);
			},
			draw : function(easeDecimal){
				var animDecimal = (easeDecimal) ? easeDecimal : 1;
				this.clear();
				helpers.each(this.segments,function(segment,index){
					segment.transition({
						circumference : this.calculateCircumference(segment.value),
						outerRadius : this.outerRadius,
						innerRadius : (this.outerRadius/100) * this.options.percentageInnerCutout
					},animDecimal);

					segment.endAngle = segment.startAngle + segment.circumference;

					segment.draw();
					if (index === 0){
						segment.startAngle = Math.PI * 1.5;
					}
					//Check to see if it's the last segment, if not get the next and update the start angle
					if (index < this.segments.length-1){
						this.segments[index+1].startAngle = segment.endAngle;
					}
				},this);

			}
		});

		Chart.types.Doughnut.extend({
			name : "Pie",
			defaults : helpers.merge(defaultConfig,{percentageInnerCutout : 0})
		});

	}).call(this);

	(function(){
		"use strict";

		var root = this,
			Chart = root.Chart,
			helpers = Chart.helpers;

		var defaultConfig = {

			///Boolean - Whether grid lines are shown across the chart
			scaleShowGridLines : true,

			//String - Colour of the grid lines
			scaleGridLineColor : "rgba(0,0,0,.05)",

			//Number - Width of the grid lines
			scaleGridLineWidth : 1,

			//Boolean - Whether to show horizontal lines (except X axis)
			scaleShowHorizontalLines: true,

			//Boolean - Whether to show vertical lines (except Y axis)
			scaleShowVerticalLines: true,

			//Boolean - Whether the line is curved between points
			bezierCurve : true,

			//Number - Tension of the bezier curve between points
			bezierCurveTension : 0.4,

			//Boolean - Whether to show a dot for each point
			pointDot : true,

			//Number - Radius of each point dot in pixels
			pointDotRadius : 4,

			//Number - Pixel width of point dot stroke
			pointDotStrokeWidth : 1,

			//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
			pointHitDetectionRadius : 20,

			//Boolean - Whether to show a stroke for datasets
			datasetStroke : true,

			//Number - Pixel width of dataset stroke
			datasetStrokeWidth : 2,

			//Boolean - Whether to fill the dataset with a colour
			datasetFill : true,

			//String - A legend template
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span class=\"<%=name.toLowerCase()%>-legend-icon\" style=\"background-color:<%=datasets[i].strokeColor%>\"></span><span class=\"<%=name.toLowerCase()%>-legend-text\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",

			//Boolean - Whether to horizontally center the label and point dot inside the grid
			offsetGridLines : false

		};


		Chart.Type.extend({
			name: "Line",
			defaults : defaultConfig,
			initialize:  function(data){
				//Declare the extension of the default point, to cater for the options passed in to the constructor
				this.PointClass = Chart.Point.extend({
					offsetGridLines : this.options.offsetGridLines,
					strokeWidth : this.options.pointDotStrokeWidth,
					radius : this.options.pointDotRadius,
					display: this.options.pointDot,
					hitDetectionRadius : this.options.pointHitDetectionRadius,
					ctx : this.chart.ctx,
					inRange : function(mouseX){
						return (Math.pow(mouseX-this.x, 2) < Math.pow(this.radius + this.hitDetectionRadius,2));
					}
				});

				this.datasets = [];

				//Set up tooltip events on the chart
				if (this.options.showTooltips){
					helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
						var activePoints = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];
						this.eachPoints(function(point){
							point.restore(['fillColor', 'strokeColor']);
						});
						helpers.each(activePoints, function(activePoint){
							activePoint.fillColor = activePoint.highlightFill;
							activePoint.strokeColor = activePoint.highlightStroke;
						});
						this.showTooltip(activePoints);
					});
				}

				//Iterate through each of the datasets, and build this into a property of the chart
				helpers.each(data.datasets,function(dataset){

					var datasetObject = {
						label : dataset.label || null,
						fillColor : dataset.fillColor,
						strokeColor : dataset.strokeColor,
						pointColor : dataset.pointColor,
						pointStrokeColor : dataset.pointStrokeColor,
						points : []
					};

					this.datasets.push(datasetObject);


					helpers.each(dataset.data,function(dataPoint,index){
						//Add a new point for each piece of data, passing any required data to draw.
						datasetObject.points.push(new this.PointClass({
							value : dataPoint,
							label : data.labels[index],
							datasetLabel: dataset.label,
							strokeColor : dataset.pointStrokeColor,
							fillColor : dataset.pointColor,
							highlightFill : dataset.pointHighlightFill || dataset.pointColor,
							highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor
						}));
					},this);

					this.buildScale(data.labels);


					this.eachPoints(function(point, index){
						helpers.extend(point, {
							x: this.scale.calculateX(index),
							y: this.scale.endPoint
						});
						point.save();
					}, this);

				},this);


				this.render();
			},
			update : function(){
				this.scale.update();
				// Reset any highlight colours before updating.
				helpers.each(this.activeElements, function(activeElement){
					activeElement.restore(['fillColor', 'strokeColor']);
				});
				this.eachPoints(function(point){
					point.save();
				});
				this.render();
			},
			eachPoints : function(callback){
				helpers.each(this.datasets,function(dataset){
					helpers.each(dataset.points,callback,this);
				},this);
			},
			getPointsAtEvent : function(e){
				var pointsArray = [],
					eventPosition = helpers.getRelativePosition(e);
				helpers.each(this.datasets,function(dataset){
					helpers.each(dataset.points,function(point){
						if (point.inRange(eventPosition.x,eventPosition.y)) pointsArray.push(point);
					});
				},this);
				return pointsArray;
			},
			buildScale : function(labels){
				var self = this;

				var dataTotal = function(){
					var values = [];
					self.eachPoints(function(point){
						values.push(point.value);
					});

					return values;
				};

				var scaleOptions = {
					templateString : this.options.scaleLabel,
					height : this.chart.height,
					width : this.chart.width,
					ctx : this.chart.ctx,
					textColor : this.options.scaleFontColor,
					offsetGridLines : this.options.offsetGridLines,
					fontSize : this.options.scaleFontSize,
					fontStyle : this.options.scaleFontStyle,
					fontFamily : this.options.scaleFontFamily,
					valuesCount : labels.length,
					beginAtZero : this.options.scaleBeginAtZero,
					integersOnly : this.options.scaleIntegersOnly,
					calculateYRange : function(currentHeight){
						var updatedRanges = helpers.calculateScaleRange(
							dataTotal(),
							currentHeight,
							this.fontSize,
							this.beginAtZero,
							this.integersOnly
						);
						helpers.extend(this, updatedRanges);
					},
					xLabels : labels,
					font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
					lineWidth : this.options.scaleLineWidth,
					lineColor : this.options.scaleLineColor,
					showHorizontalLines : this.options.scaleShowHorizontalLines,
					showVerticalLines : this.options.scaleShowVerticalLines,
					gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
					gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
					padding: (this.options.showScale) ? 0 : this.options.pointDotRadius + this.options.pointDotStrokeWidth,
					showLabels : this.options.scaleShowLabels,
					display : this.options.showScale
				};

				if (this.options.scaleOverride){
					helpers.extend(scaleOptions, {
						calculateYRange: helpers.noop,
						steps: this.options.scaleSteps,
						stepValue: this.options.scaleStepWidth,
						min: this.options.scaleStartValue,
						max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
					});
				}


				this.scale = new Chart.Scale(scaleOptions);
			},
			addData : function(valuesArray,label){
				//Map the values array for each of the datasets

				helpers.each(valuesArray,function(value,datasetIndex){
					//Add a new point for each piece of data, passing any required data to draw.
					this.datasets[datasetIndex].points.push(new this.PointClass({
						value : value,
						label : label,
						datasetLabel: this.datasets[datasetIndex].label,
						x: this.scale.calculateX(this.scale.valuesCount+1),
						y: this.scale.endPoint,
						strokeColor : this.datasets[datasetIndex].pointStrokeColor,
						fillColor : this.datasets[datasetIndex].pointColor
					}));
				},this);

				this.scale.addXLabel(label);
				//Then re-render the chart.
				this.update();
			},
			removeData : function(){
				this.scale.removeXLabel();
				//Then re-render the chart.
				helpers.each(this.datasets,function(dataset){
					dataset.points.shift();
				},this);
				this.update();
			},
			reflow : function(){
				var newScaleProps = helpers.extend({
					height : this.chart.height,
					width : this.chart.width
				});
				this.scale.update(newScaleProps);
			},
			draw : function(ease){
				var easingDecimal = ease || 1;
				this.clear();

				var ctx = this.chart.ctx;

				// Some helper methods for getting the next/prev points
				var hasValue = function(item){
					return item.value !== null;
				},
				nextPoint = function(point, collection, index){
					return helpers.findNextWhere(collection, hasValue, index) || point;
				},
				previousPoint = function(point, collection, index){
					return helpers.findPreviousWhere(collection, hasValue, index) || point;
				};

				if (!this.scale) return;
				this.scale.draw(easingDecimal);


				helpers.each(this.datasets,function(dataset){
					var pointsWithValues = helpers.where(dataset.points, hasValue);

					//Transition each point first so that the line and point drawing isn't out of sync
					//We can use this extra loop to calculate the control points of this dataset also in this loop

					helpers.each(dataset.points, function(point, index){
						if (point.hasValue()){
							point.transition({
								y : this.scale.calculateY(point.value),
								x : this.scale.calculateX(index)
							}, easingDecimal);
						}
					},this);


					// Control points need to be calculated in a separate loop, because we need to know the current x/y of the point
					// This would cause issues when there is no animation, because the y of the next point would be 0, so beziers would be skewed
					if (this.options.bezierCurve){
						helpers.each(pointsWithValues, function(point, index){
							var tension = (index > 0 && index < pointsWithValues.length - 1) ? this.options.bezierCurveTension : 0;
							point.controlPoints = helpers.splineCurve(
								previousPoint(point, pointsWithValues, index),
								point,
								nextPoint(point, pointsWithValues, index),
								tension
							);

							// Prevent the bezier going outside of the bounds of the graph

							// Cap puter bezier handles to the upper/lower scale bounds
							if (point.controlPoints.outer.y > this.scale.endPoint){
								point.controlPoints.outer.y = this.scale.endPoint;
							}
							else if (point.controlPoints.outer.y < this.scale.startPoint){
								point.controlPoints.outer.y = this.scale.startPoint;
							}

							// Cap inner bezier handles to the upper/lower scale bounds
							if (point.controlPoints.inner.y > this.scale.endPoint){
								point.controlPoints.inner.y = this.scale.endPoint;
							}
							else if (point.controlPoints.inner.y < this.scale.startPoint){
								point.controlPoints.inner.y = this.scale.startPoint;
							}
						},this);
					}


					//Draw the line between all the points
					ctx.lineWidth = this.options.datasetStrokeWidth;
					ctx.strokeStyle = dataset.strokeColor;
					ctx.beginPath();

					helpers.each(pointsWithValues, function(point, index){
						if (index === 0){
							ctx.moveTo(point.x, point.y);
						}
						else{
							if(this.options.bezierCurve){
								var previous = previousPoint(point, pointsWithValues, index);

								ctx.bezierCurveTo(
									previous.controlPoints.outer.x,
									previous.controlPoints.outer.y,
									point.controlPoints.inner.x,
									point.controlPoints.inner.y,
									point.x,
									point.y
								);
							}
							else{
								ctx.lineTo(point.x,point.y);
							}
						}
					}, this);

					if (this.options.datasetStroke) {
						ctx.stroke();
					}

					if (this.options.datasetFill && pointsWithValues.length > 0){
						//Round off the line by going to the base of the chart, back to the start, then fill.
						ctx.lineTo(pointsWithValues[pointsWithValues.length - 1].x, this.scale.endPoint);
						ctx.lineTo(pointsWithValues[0].x, this.scale.endPoint);
						ctx.fillStyle = dataset.fillColor;
						ctx.closePath();
						ctx.fill();
					}

					//Now draw the points over the line
					//A little inefficient double looping, but better than the line
					//lagging behind the point positions
					helpers.each(pointsWithValues,function(point){
						point.draw();
					});
				},this);
			}
		});


	}).call(this);

	(function(){
		"use strict";

		var root = this,
			Chart = root.Chart,
			//Cache a local reference to Chart.helpers
			helpers = Chart.helpers;

		var defaultConfig = {
			//Boolean - Show a backdrop to the scale label
			scaleShowLabelBackdrop : true,

			//String - The colour of the label backdrop
			scaleBackdropColor : "rgba(255,255,255,0.75)",

			// Boolean - Whether the scale should begin at zero
			scaleBeginAtZero : true,

			//Number - The backdrop padding above & below the label in pixels
			scaleBackdropPaddingY : 2,

			//Number - The backdrop padding to the side of the label in pixels
			scaleBackdropPaddingX : 2,

			//Boolean - Show line for each value in the scale
			scaleShowLine : true,

			//Boolean - Stroke a line around each segment in the chart
			segmentShowStroke : true,

			//String - The colour of the stroke on each segment.
			segmentStrokeColor : "#fff",

			//Number - The width of the stroke value in pixels
			segmentStrokeWidth : 2,

			//Number - Amount of animation steps
			animationSteps : 100,

			//String - Animation easing effect.
			animationEasing : "easeOutBounce",

			//Boolean - Whether to animate the rotation of the chart
			animateRotate : true,

			//Boolean - Whether to animate scaling the chart from the centre
			animateScale : false,

			//String - A legend template
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span class=\"<%=name.toLowerCase()%>-legend-icon\" style=\"background-color:<%=segments[i].fillColor%>\"></span><span class=\"<%=name.toLowerCase()%>-legend-text\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"
		};


		Chart.Type.extend({
			//Passing in a name registers this chart in the Chart namespace
			name: "PolarArea",
			//Providing a defaults will also register the defaults in the chart namespace
			defaults : defaultConfig,
			//Initialize is fired when the chart is initialized - Data is passed in as a parameter
			//Config is automatically merged by the core of Chart.js, and is available at this.options
			initialize:  function(data){
				this.segments = [];
				//Declare segment class as a chart instance specific class, so it can share props for this instance
				this.SegmentArc = Chart.Arc.extend({
					showStroke : this.options.segmentShowStroke,
					strokeWidth : this.options.segmentStrokeWidth,
					strokeColor : this.options.segmentStrokeColor,
					ctx : this.chart.ctx,
					innerRadius : 0,
					x : this.chart.width/2,
					y : this.chart.height/2
				});
				this.scale = new Chart.RadialScale({
					display: this.options.showScale,
					fontStyle: this.options.scaleFontStyle,
					fontSize: this.options.scaleFontSize,
					fontFamily: this.options.scaleFontFamily,
					fontColor: this.options.scaleFontColor,
					showLabels: this.options.scaleShowLabels,
					showLabelBackdrop: this.options.scaleShowLabelBackdrop,
					backdropColor: this.options.scaleBackdropColor,
					backdropPaddingY : this.options.scaleBackdropPaddingY,
					backdropPaddingX: this.options.scaleBackdropPaddingX,
					lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,
					lineColor: this.options.scaleLineColor,
					lineArc: true,
					width: this.chart.width,
					height: this.chart.height,
					xCenter: this.chart.width/2,
					yCenter: this.chart.height/2,
					ctx : this.chart.ctx,
					templateString: this.options.scaleLabel,
					valuesCount: data.length
				});

				this.updateScaleRange(data);

				this.scale.update();

				helpers.each(data,function(segment,index){
					this.addData(segment,index,true);
				},this);

				//Set up tooltip events on the chart
				if (this.options.showTooltips){
					helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
						var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];
						helpers.each(this.segments,function(segment){
							segment.restore(["fillColor"]);
						});
						helpers.each(activeSegments,function(activeSegment){
							activeSegment.fillColor = activeSegment.highlightColor;
						});
						this.showTooltip(activeSegments);
					});
				}

				this.render();
			},
			getSegmentsAtEvent : function(e){
				var segmentsArray = [];

				var location = helpers.getRelativePosition(e);

				helpers.each(this.segments,function(segment){
					if (segment.inRange(location.x,location.y)) segmentsArray.push(segment);
				},this);
				return segmentsArray;
			},
			addData : function(segment, atIndex, silent){
				var index = atIndex || this.segments.length;

				this.segments.splice(index, 0, new this.SegmentArc({
					fillColor: segment.color,
					highlightColor: segment.highlight || segment.color,
					label: segment.label,
					value: segment.value,
					outerRadius: (this.options.animateScale) ? 0 : this.scale.calculateCenterOffset(segment.value),
					circumference: (this.options.animateRotate) ? 0 : this.scale.getCircumference(),
					startAngle: Math.PI * 1.5
				}));
				if (!silent){
					this.reflow();
					this.update();
				}
			},
			removeData: function(atIndex){
				var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length-1;
				this.segments.splice(indexToDelete, 1);
				this.reflow();
				this.update();
			},
			calculateTotal: function(data){
				this.total = 0;
				helpers.each(data,function(segment){
					this.total += segment.value;
				},this);
				this.scale.valuesCount = this.segments.length;
			},
			updateScaleRange: function(datapoints){
				var valuesArray = [];
				helpers.each(datapoints,function(segment){
					valuesArray.push(segment.value);
				});

				var scaleSizes = (this.options.scaleOverride) ?
					{
						steps: this.options.scaleSteps,
						stepValue: this.options.scaleStepWidth,
						min: this.options.scaleStartValue,
						max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
					} :
					helpers.calculateScaleRange(
						valuesArray,
						helpers.min([this.chart.width, this.chart.height])/2,
						this.options.scaleFontSize,
						this.options.scaleBeginAtZero,
						this.options.scaleIntegersOnly
					);

				helpers.extend(
					this.scale,
					scaleSizes,
					{
						size: helpers.min([this.chart.width, this.chart.height]),
						xCenter: this.chart.width/2,
						yCenter: this.chart.height/2
					}
				);

			},
			update : function(){
				this.calculateTotal(this.segments);

				helpers.each(this.segments,function(segment){
					segment.save();
				});
				
				this.reflow();
				this.render();
			},
			reflow : function(){
				helpers.extend(this.SegmentArc.prototype,{
					x : this.chart.width/2,
					y : this.chart.height/2
				});
				this.updateScaleRange(this.segments);
				this.scale.update();

				helpers.extend(this.scale,{
					xCenter: this.chart.width/2,
					yCenter: this.chart.height/2
				});

				helpers.each(this.segments, function(segment){
					segment.update({
						outerRadius : this.scale.calculateCenterOffset(segment.value)
					});
				}, this);

			},
			draw : function(ease){
				var easingDecimal = ease || 1;
				//Clear & draw the canvas
				this.clear();
				helpers.each(this.segments,function(segment, index){
					segment.transition({
						circumference : this.scale.getCircumference(),
						outerRadius : this.scale.calculateCenterOffset(segment.value)
					},easingDecimal);

					segment.endAngle = segment.startAngle + segment.circumference;

					// If we've removed the first segment we need to set the first one to
					// start at the top.
					if (index === 0){
						segment.startAngle = Math.PI * 1.5;
					}

					//Check to see if it's the last segment, if not get the next and update the start angle
					if (index < this.segments.length - 1){
						this.segments[index+1].startAngle = segment.endAngle;
					}
					segment.draw();
				}, this);
				this.scale.draw();
			}
		});

	}).call(this);

	(function(){
		"use strict";

		var root = this,
			Chart = root.Chart,
			helpers = Chart.helpers;



		Chart.Type.extend({
			name: "Radar",
			defaults:{
				//Boolean - Whether to show lines for each scale point
				scaleShowLine : true,

				//Boolean - Whether we show the angle lines out of the radar
				angleShowLineOut : true,

				//Boolean - Whether to show labels on the scale
				scaleShowLabels : false,

				// Boolean - Whether the scale should begin at zero
				scaleBeginAtZero : true,

				//String - Colour of the angle line
				angleLineColor : "rgba(0,0,0,.1)",

				//Number - Pixel width of the angle line
				angleLineWidth : 1,

				//Number - Interval at which to draw angle lines ("every Nth point")
				angleLineInterval: 1,

				//String - Point label font declaration
				pointLabelFontFamily : "'Arial'",

				//String - Point label font weight
				pointLabelFontStyle : "normal",

				//Number - Point label font size in pixels
				pointLabelFontSize : 10,

				//String - Point label font colour
				pointLabelFontColor : "#666",

				//Boolean - Whether to show a dot for each point
				pointDot : true,

				//Number - Radius of each point dot in pixels
				pointDotRadius : 3,

				//Number - Pixel width of point dot stroke
				pointDotStrokeWidth : 1,

				//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
				pointHitDetectionRadius : 20,

				//Boolean - Whether to show a stroke for datasets
				datasetStroke : true,

				//Number - Pixel width of dataset stroke
				datasetStrokeWidth : 2,

				//Boolean - Whether to fill the dataset with a colour
				datasetFill : true,

				//String - A legend template
				legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span class=\"<%=name.toLowerCase()%>-legend-icon\" style=\"background-color:<%=datasets[i].strokeColor%>\"></span><span class=\"<%=name.toLowerCase()%>-legend-text\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"

			},

			initialize: function(data){
				this.PointClass = Chart.Point.extend({
					strokeWidth : this.options.pointDotStrokeWidth,
					radius : this.options.pointDotRadius,
					display: this.options.pointDot,
					hitDetectionRadius : this.options.pointHitDetectionRadius,
					ctx : this.chart.ctx
				});

				this.datasets = [];

				this.buildScale(data);

				//Set up tooltip events on the chart
				if (this.options.showTooltips){
					helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
						var activePointsCollection = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];

						this.eachPoints(function(point){
							point.restore(['fillColor', 'strokeColor']);
						});
						helpers.each(activePointsCollection, function(activePoint){
							activePoint.fillColor = activePoint.highlightFill;
							activePoint.strokeColor = activePoint.highlightStroke;
						});

						this.showTooltip(activePointsCollection);
					});
				}

				//Iterate through each of the datasets, and build this into a property of the chart
				helpers.each(data.datasets,function(dataset){

					var datasetObject = {
						label: dataset.label || null,
						fillColor : dataset.fillColor,
						strokeColor : dataset.strokeColor,
						pointColor : dataset.pointColor,
						pointStrokeColor : dataset.pointStrokeColor,
						points : []
					};

					this.datasets.push(datasetObject);

					helpers.each(dataset.data,function(dataPoint,index){
						//Add a new point for each piece of data, passing any required data to draw.
						var pointPosition;
						if (!this.scale.animation){
							pointPosition = this.scale.getPointPosition(index, this.scale.calculateCenterOffset(dataPoint));
						}
						datasetObject.points.push(new this.PointClass({
							value : dataPoint,
							label : data.labels[index],
							datasetLabel: dataset.label,
							x: (this.options.animation) ? this.scale.xCenter : pointPosition.x,
							y: (this.options.animation) ? this.scale.yCenter : pointPosition.y,
							strokeColor : dataset.pointStrokeColor,
							fillColor : dataset.pointColor,
							highlightFill : dataset.pointHighlightFill || dataset.pointColor,
							highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor
						}));
					},this);

				},this);

				this.render();
			},
			eachPoints : function(callback){
				helpers.each(this.datasets,function(dataset){
					helpers.each(dataset.points,callback,this);
				},this);
			},

			getPointsAtEvent : function(evt){
				var mousePosition = helpers.getRelativePosition(evt),
					fromCenter = helpers.getAngleFromPoint({
						x: this.scale.xCenter,
						y: this.scale.yCenter
					}, mousePosition);

				var anglePerIndex = (Math.PI * 2) /this.scale.valuesCount,
					pointIndex = Math.round((fromCenter.angle - Math.PI * 1.5) / anglePerIndex),
					activePointsCollection = [];

				// If we're at the top, make the pointIndex 0 to get the first of the array.
				if (pointIndex >= this.scale.valuesCount || pointIndex < 0){
					pointIndex = 0;
				}

				if (fromCenter.distance <= this.scale.drawingArea){
					helpers.each(this.datasets, function(dataset){
						activePointsCollection.push(dataset.points[pointIndex]);
					});
				}

				return activePointsCollection;
			},

			buildScale : function(data){
				this.scale = new Chart.RadialScale({
					display: this.options.showScale,
					fontStyle: this.options.scaleFontStyle,
					fontSize: this.options.scaleFontSize,
					fontFamily: this.options.scaleFontFamily,
					fontColor: this.options.scaleFontColor,
					showLabels: this.options.scaleShowLabels,
					showLabelBackdrop: this.options.scaleShowLabelBackdrop,
					backdropColor: this.options.scaleBackdropColor,
					backgroundColors: this.options.scaleBackgroundColors,
					backdropPaddingY : this.options.scaleBackdropPaddingY,
					backdropPaddingX: this.options.scaleBackdropPaddingX,
					lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,
					lineColor: this.options.scaleLineColor,
					angleLineColor : this.options.angleLineColor,
					angleLineWidth : (this.options.angleShowLineOut) ? this.options.angleLineWidth : 0,
	        angleLineInterval: (this.options.angleLineInterval) ? this.options.angleLineInterval : 1,
					// Point labels at the edge of each line
					pointLabelFontColor : this.options.pointLabelFontColor,
					pointLabelFontSize : this.options.pointLabelFontSize,
					pointLabelFontFamily : this.options.pointLabelFontFamily,
					pointLabelFontStyle : this.options.pointLabelFontStyle,
					height : this.chart.height,
					width: this.chart.width,
					xCenter: this.chart.width/2,
					yCenter: this.chart.height/2,
					ctx : this.chart.ctx,
					templateString: this.options.scaleLabel,
					labels: data.labels,
					valuesCount: data.datasets[0].data.length
				});

				this.scale.setScaleSize();
				this.updateScaleRange(data.datasets);
				this.scale.buildYLabels();
			},
			updateScaleRange: function(datasets){
				var valuesArray = (function(){
					var totalDataArray = [];
					helpers.each(datasets,function(dataset){
						if (dataset.data){
							totalDataArray = totalDataArray.concat(dataset.data);
						}
						else {
							helpers.each(dataset.points, function(point){
								totalDataArray.push(point.value);
							});
						}
					});
					return totalDataArray;
				})();


				var scaleSizes = (this.options.scaleOverride) ?
					{
						steps: this.options.scaleSteps,
						stepValue: this.options.scaleStepWidth,
						min: this.options.scaleStartValue,
						max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
					} :
					helpers.calculateScaleRange(
						valuesArray,
						helpers.min([this.chart.width, this.chart.height])/2,
						this.options.scaleFontSize,
						this.options.scaleBeginAtZero,
						this.options.scaleIntegersOnly
					);

				helpers.extend(
					this.scale,
					scaleSizes
				);

			},
			addData : function(valuesArray,label){
				//Map the values array for each of the datasets
				this.scale.valuesCount++;
				helpers.each(valuesArray,function(value,datasetIndex){
					var pointPosition = this.scale.getPointPosition(this.scale.valuesCount, this.scale.calculateCenterOffset(value));
					this.datasets[datasetIndex].points.push(new this.PointClass({
						value : value,
						label : label,
						datasetLabel: this.datasets[datasetIndex].label,
						x: pointPosition.x,
						y: pointPosition.y,
						strokeColor : this.datasets[datasetIndex].pointStrokeColor,
						fillColor : this.datasets[datasetIndex].pointColor
					}));
				},this);

				this.scale.labels.push(label);

				this.reflow();

				this.update();
			},
			removeData : function(){
				this.scale.valuesCount--;
				this.scale.labels.shift();
				helpers.each(this.datasets,function(dataset){
					dataset.points.shift();
				},this);
				this.reflow();
				this.update();
			},
			update : function(){
				this.eachPoints(function(point){
					point.save();
				});
				this.reflow();
				this.render();
			},
			reflow: function(){
				helpers.extend(this.scale, {
					width : this.chart.width,
					height: this.chart.height,
					size : helpers.min([this.chart.width, this.chart.height]),
					xCenter: this.chart.width/2,
					yCenter: this.chart.height/2
				});
				this.updateScaleRange(this.datasets);
				this.scale.setScaleSize();
				this.scale.buildYLabels();
			},
			draw : function(ease){
				var easeDecimal = ease || 1,
					ctx = this.chart.ctx;
				this.clear();
				this.scale.draw();

				helpers.each(this.datasets,function(dataset){

					//Transition each point first so that the line and point drawing isn't out of sync
					helpers.each(dataset.points,function(point,index){
						if (point.hasValue()){
							point.transition(this.scale.getPointPosition(index, this.scale.calculateCenterOffset(point.value)), easeDecimal);
						}
					},this);



					//Draw the line between all the points
					ctx.lineWidth = this.options.datasetStrokeWidth;
					ctx.strokeStyle = dataset.strokeColor;
					ctx.beginPath();
					helpers.each(dataset.points,function(point,index){
						if (index === 0){
							ctx.moveTo(point.x,point.y);
						}
						else{
							ctx.lineTo(point.x,point.y);
						}
					},this);
					ctx.closePath();
					ctx.stroke();

					ctx.fillStyle = dataset.fillColor;
					if(this.options.datasetFill){
						ctx.fill();
					}
					//Now draw the points over the line
					//A little inefficient double looping, but better than the line
					//lagging behind the point positions
					helpers.each(dataset.points,function(point){
						if (point.hasValue()){
							point.draw();
						}
					});

				},this);

			}

		});





	}).call(this);


/***/ },

/***/ 806:
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },

/***/ 807:
/***/ function(module, exports, __webpack_require__) {

	var vars = __webpack_require__(804);

	module.exports = vars.createClass('Doughnut', ['getSegmentsAtEvent']);


/***/ },

/***/ 808:
/***/ function(module, exports, __webpack_require__) {

	var vars = __webpack_require__(804);

	module.exports = vars.createClass('Line', ['getPointsAtEvent']);


/***/ },

/***/ 809:
/***/ function(module, exports, __webpack_require__) {

	var vars = __webpack_require__(804);

	module.exports = vars.createClass('Pie', ['getSegmentsAtEvent']);


/***/ },

/***/ 810:
/***/ function(module, exports, __webpack_require__) {

	var vars = __webpack_require__(804);

	module.exports = vars.createClass('PolarArea', ['getSegmentsAtEvent']);


/***/ },

/***/ 811:
/***/ function(module, exports, __webpack_require__) {

	var vars = __webpack_require__(804);

	module.exports = vars.createClass('Radar', ['getPointsAtEvent']);


/***/ },

/***/ 812:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var contractActions = __webpack_require__(813);
	var contractStore = __webpack_require__(814);

	var Inspection = {};

	tr.registerTranslations('en', __webpack_require__(815));
	tr.registerTranslations('th', __webpack_require__(816));

	Inspection.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('installment.inspection.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	Inspection.Detail = __webpack_require__(817);

	// Inspection.Routes = (
	//   <Route name="installment.inspection" path="inspection" handler={Inspection.Index}>
	//     <Router.DefaultRoute name="installment.inspection.detail" handler={Inspection.Detail}/>
	//   </Route>
	// );
	// console.log('route');

	module.exports = Inspection;

/***/ },

/***/ 813:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  inspect: { children: ['done', 'error'] },
	  genContractForm: { children: ['done', 'error'] },
	  savePerson: { children: ['done', 'error'] },
	  savePersonPhoto: { children: ['done', 'error'] },
	  getPersonOracle: { children: ['done', 'error'] }
	});

/***/ },

/***/ 814:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var inspectionActions = __webpack_require__(813);

	var inspectionStore = Reflux.createStore({
	  listenables: [inspectionActions],

	  onInspect: function onInspect(param) {
	    ajaxActions.request('/api/installment/inspection/inspect', param, this.doneInspect);
	  },

	  doneInspect: function doneInspect(res) {
	    if (res.status === true) {
	      inspectionActions.inspect.done(res.data);
	    } else {
	      inspectionActions.inspect.error(res.error);
	    }
	  },

	  onGenContractForm: function onGenContractForm(param) {
	    ajaxActions.request('/api/installment/inspection/genForm', param, this.doneGenContractForm);
	  },

	  doneGenContractForm: function doneGenContractForm(res) {
	    if (res.status === true) {
	      inspectionActions.genContractForm.done(res.data);
	    } else {
	      inspectionActions.genContractForm.error(res.error);
	    }
	  },

	  // inspectionActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/installment/inspection/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      inspectionActions.list.done(res.data, res.opt);
	    } else {
	      inspectionActions.list.error(res.error);
	    }
	  },

	  onSavePerson: function onSavePerson(param) {
	    ajaxActions.request('/api/installment/inspection/savePerson', param, this.doneSavePerson);
	  },

	  doneSavePerson: function doneSavePerson(res) {
	    if (res.status === true) {
	      inspectionActions.savePerson.done(res.id);
	    } else {
	      inspectionActions.savePerson.error(res.error);
	    }
	  },

	  onSavePersonPhoto: function onSavePersonPhoto(param) {
	    ajaxActions.request('/api/installment/inspection/savePersonPhoto', param, this.doneSavePersonPhoto);
	  },

	  doneSavePersonPhoto: function doneSavePersonPhoto(res) {
	    if (res.status === true) {
	      inspectionActions.savePersonPhoto.done(res.id);
	    } else {
	      inspectionActions.savePersonPhoto.error(res.error);
	    }
	  },

	  onGetPersonOracle: function onGetPersonOracle(param) {
	    ajaxActions.request('/api/installment/inspection/getPersonOracle', param, this.doneGetPersonOracle);
	  },

	  doneGetPersonOracle: function doneGetPersonOracle(res) {
	    inspectionActions.getPersonOracle.done(res);
	  }

	});

	module.exports = inspectionStore;

/***/ },

/***/ 815:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 816:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  installment: {
	    inspection: {
	      title: {
	        index: 'ประวัติลูกค้าเช่าซื้อ',
	        inspect: 'ตรวจสอบประวัติ'
	      },
	      tab: {
	        cus_info: 'ข้อมูลผู้เช่าซื้อ',
	        co_info: 'ข้อมูลผู้เช่าซื้อร่วม',
	        history: 'ประวัติการเช่าซื้อ'
	      },
	      nation_id: 'บัตรประชาชน',
	      home_addr: 'ที่อยู่ปัจจุบัน',
	      work_addr: 'ที่อยู่ที่ทำงาน',
	      print_form1: 'พิมพ์สัญญา',
	      print_form2: 'พิมพ์หนังสือยินยอม',
	      add_cust: 'เพิ่มลูกค้า',
	      prev_contract: 'สัญญาเก่า',
	      read_id: 'อ่านบัตรประชาชน',
	      contract: {
	        no: 'ที่',
	        status: 'การชำระ',
	        role: 'ผู้เช่าซื้อ/ร่วม',
	        code: 'เลขที่สัญญา',
	        sign_date: 'วันที่สัญญา',
	        product: 'สินค้า',
	        payment_price: 'ยอดผ่อน',
	        total_paid: 'ชำระแล้ว',
	        balance: 'คงเหลือ',
	        current_status: 'สถานะ',
	        role_type: {
	          cus: 'ผู้เช่าซื้อ',
	          co: 'ผู้เช่าซื้อร่วม'
	        },
	        status_text: {
	          NORMAL: 'ปกติ',
	          DEBT: 'ค้างชำระ',
	          CLOSE_CANCEL: 'ปิด/ยกเลิก',
	          CLOSE_NORMAL: 'ปิด/ปกติ',
	          CLOSE_RETURN: 'ปิด/คืนของ',
	          CLOSE_CONFISCATE: 'ปิด/ยืดคืนของ',
	          CLOSE_BAD_DEBT: 'ปิด/หนี้สูญ'
	        },
	        view: 'ดู'
	      }
	    }
	  }
	};

/***/ },

/***/ 817:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(337);
	var tr = __webpack_require__(207);
	var T = __webpack_require__(383);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var systemActions = system.systemActions;
	var helper = system.helper;

	var toasterActions = system.toasterActions;

	var FlexTextInput = widgets.FlexTextInput;
	var FlexButton = widgets.FlexButton;
	var FlexIcon = widgets.FlexIcon;
	var NationIDCard = widgets.NationIDCard;
	var FlexDataTable = widgets.FlexDataTable;
	var FlexTab = widgets.FlexTab;
	var FlexDataTable = widgets.FlexDataTable;
	var FlexDropdown = widgets.FlexDropdown;

	var inspectionActions = __webpack_require__(813);
	var inspectionStore = __webpack_require__(814);

	var calcAge = function calcAge(value) {
	  var today = new Date();
	  var d = new Date(value);
	  var age = today.getFullYear() - d.getFullYear();
	  if (d.getMonth() > today.getMonth() || d.getMonth() == today.getMonth() && d.getDate() > today.getDate()) {
	    age--;
	  }
	  return age;
	};

	var genPhotoNationId = function genPhotoNationId(nationid) {
	  if (!nationid || nationid.length != 13) {
	    return window.location.protocol + '//' + window.location.host + '/idcard/photo.png';
	  }
	  return window.location.protocol + '//' + window.location.host + '/idcard/photo/' + nationid.substr(-1) + '/' + nationid.substr(-2, 1) + '/' + nationid + '.jpg';
	};

	var contractFields = [{ name: 'no', label: 'installment.inspection.contract.no', width: '32px', render: function render(row, i) {
	    return i + 1;
	  } }, { name: 'status', label: 'installment.inspection.contract.status', width: '128px', render: function render(row) {
	    if (row.terms && row.terms.length > 0) {
	      return React.createElement(
	        'ul',
	        { className: 'contract_status2' },
	        row.terms.map(function (term) {
	          return React.createElement('li', { key: term.id, className: 'status_' + term.term_status + (term.close_status == 'NORMAL' ? '' : ' ' + term.close_status), title: 'DUE DATE: ' + term.due_date + '\n' + 'PAID DATE: ' + term.paid_date + '\n' + 'DUE AMOUNT: ' + helper.numberFormat(term.due_amount, 2) + '\n' + 'PAID AMOUNT: ' + helper.numberFormat(term.paid_amount, 2) + '\n' + 'STATUS: ' + term.term_status });
	        })
	      );
	    } else {
	      return null;
	    }
	  } }, { name: 'role', label: 'installment.inspection.contract.role', width: '100px', render: function render(row) {
	    return tr.translate('installment.inspection.contract.role_type.' + row.role_type);
	  } }, { name: 'code', label: 'installment.inspection.contract.code', width: '100px' }, { name: 'sign_date', label: 'installment.inspection.contract.sign_date', width: '80px', render: function render(row) {
	    return tr.localize(new Date(row.sign_date), { type: 'date', format: 'short' });
	  } }, { name: 'product', label: 'installment.inspection.contract.product' }, { name: 'payment_price', label: 'installment.inspection.contract.payment_price', width: '80px', className: 'right', render: function render(row) {
	    return helper.numberFormat(row.payment_price, 2);
	  } }, { name: 'total_paid', label: 'installment.inspection.contract.total_paid', width: '80px', className: 'right', render: function render(row) {
	    return helper.numberFormat(row.total_paid, 2);
	  } }, { name: 'balance', label: 'installment.inspection.contract.balance', width: '80px', className: 'right', render: function render(row) {
	    return helper.numberFormat(row.balance, 2);
	  } }, { name: 'current_status', label: 'installment.inspection.contract.current_status', width: '80px', render: function render(row) {
	    return tr.translate('installment.inspection.contract.status_text.' + row.current_status);
	  } }];

	var genPersonFromNationId = function genPersonFromNationId(info) {
	  return {
	    nationid: info.nationid,
	    prename: info.prenameTH || info.prename,
	    firstname: info.firstnameTH || info.firstname,
	    lastname: info.lastnameTH || info.lastname,
	    fullname: (info.prenameTH || info.prename) + ' ' + (info.firstnameTH || info.firstname) + ' ' + (info.lastnameTH || info.lastname),
	    birth: info.birth,
	    gender: info.gender,
	    age: calcAge(info.birth)
	  };
	};

	var InspectDetail = React.createClass({
	  displayName: 'InspectDetail',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [Reflux.listenTo(systemActions.readIDCard.done, 'onReadIDCardDoneAction'), Reflux.listenTo(systemActions.readIDCard.error, 'onReadIDCardErrorAction'), Reflux.listenTo(systemActions.readIDCardPhoto.done, 'onReadIDCardPhotoDoneAction'), Reflux.listenTo(systemActions.readIDCardPhoto.error, 'onReadIDCardPhotoErrorAction'), Reflux.listenTo(inspectionActions.inspect.done, 'onInspectDoneAction'), Reflux.listenTo(inspectionActions.inspect.error, 'onInspectErrorAction'), Reflux.listenTo(inspectionActions.genContractForm.done, 'onGenContractFormDoneAction'), Reflux.listenTo(inspectionActions.genContractForm.error, 'onGenContractFormErrorAction'), Reflux.listenTo(inspectionActions.getPersonOracle.done, 'onGetPersonOracleDoneAction')],

	  getInitialState: function getInitialState() {
	    contractFields.push({ name: 'action', label: 'installment.inspection.contract.view', width: '32px', render: function (row) {
	        return React.createElement('span', { className: 'flaticon-right244 link', onClick: function () {
	            this.context.router.transitionTo('installment.contract.edit', { id: row.id });
	          }.bind(this) });
	      }.bind(this) });
	    return {
	      cus_nation_id: '',
	      co_nation_id: '',
	      currentTab: 'cus_history',
	      addcust_nationid: '',
	      data: {
	        customer: {},
	        co: {},
	        cusIDCard: {},
	        coIDCard: {},
	        cardAddr: {},
	        coCardAddr: {}
	      },
	      homeAddressList: [{ value: 0, text: '' }],
	      workAddressList: [{ value: 0, text: '' }],
	      coHomeAddressList: [{ value: 0, text: '' }],
	      coWorkAddressList: [{ value: 0, text: '' }],
	      cusContractList: [],
	      coContractList: [],
	      tabList: [{ id: 'cus_info', icon: 'user157', text: 'installment.inspection.tab.cus_info' }, { id: 'cus_history', icon: 'work3', text: 'installment.inspection.tab.history' }, { id: 'co_info', icon: 'add184', text: 'installment.inspection.tab.co_info' }, { id: 'co_history', icon: 'work3', text: 'installment.inspection.tab.history' }]
	    };
	  },

	  readIDCard: function readIDCard(card) {
	    this.setState({
	      currentTab: card == 'cusIDCard' ? 'cus_info' : 'co_info'
	    }, function () {
	      systemActions.readIDCard(null /* reader name */, card);
	    });
	  },

	  onReadIDCardDoneAction: function onReadIDCardDoneAction(info, ref) {
	    inspectionActions.inspect({
	      id: info.nationid,
	      ref: ref == 'cusIDCard' ? 'cus_nation_id' : 'co_nation_id'
	    });

	    inspectionActions.savePerson({
	      nationid: info.nationid,
	      type: 'PERSON',
	      prename: info.prenameTH,
	      firstname: info.firstnameTH,
	      lastname: info.lastnameTH,
	      fullname: info.prenameTH + ' ' + info.firstnameTH + ' ' + info.lastnameTH,
	      idcard_info: JSON.stringify(info),
	      passport: '',
	      passport_info: '{}',
	      nation: 'THA',
	      birth: info.birth,
	      gender: info.gender,
	      marital_status: 'N/A',
	      mobile: '',
	      email: '',
	      lineid: ''
	    });

	    this.state.data[ref] = info;
	    var addr = '';
	    var ref2 = '';
	    if (ref == 'cusIDCard') {
	      ref2 = 'cus_nation_id';
	      addr = 'cardAddr';
	      this.state.data.customer = genPersonFromNationId(info);
	    } else if (ref == 'coIDCard') {
	      ref2 = 'co_nation_id';
	      addr = 'coCardAddr';
	      this.state.data.co = genPersonFromNationId(info);
	    }

	    if (!this.state.data[addr].addr1) {
	      var tmp = [];
	      if (info.address.houseNo) {
	        tmp.push(info.address.houseNo);
	      }
	      if (info.address.villageNo) {
	        tmp.push(info.villageNo);
	      }
	      this.state.data[addr].addr1 = tmp.join(' ');

	      tmp = [];
	      if (info.address.lane) {
	        tmp.push(info.address.lane);
	      }
	      if (info.address.road) {
	        tmp.push(info.address.road);
	      }
	      if (info.address.unknown) {
	        tmp.push(info.address.unknown);
	      }
	      this.state.data[addr].addr2 = tmp.join(' ');
	      this.state.data[addr].tambon = info.address.tambon;
	      this.state.data[addr].amphur = info.address.amphur;
	      this.state.data[addr].province = info.address.province;
	    }

	    var obj = {
	      data: this.state.data
	    };

	    obj[ref + 'PhotoLoading'] = true;
	    obj[ref2] = info.nationid;
	    this.setState(obj);
	    systemActions.readIDCardPhoto(null, ref);
	  },

	  onReadIDCardErrorAction: function onReadIDCardErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'result.idcard.error'
	    });
	  },

	  onReadIDCardPhotoDoneAction: function onReadIDCardPhotoDoneAction(info) {
	    var obj = {};
	    console.log(info.photoPath);
	    obj[info.ref + 'Photo'] = info.photoPath;
	    obj[info.ref + 'PhotoLoading'] = false;
	    obj[(info.ref == 'cusIDCard' ? 'customer' : 'co') + 'Photo'] = '';
	    this.setState(obj);
	  },

	  onReadIDCardPhotoErrorAction: function onReadIDCardPhotoErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'result.idcard.photo_error'
	    });
	  },

	  onInspectDoneAction: function onInspectDoneAction(info) {
	    console.log('inspection=', info);
	    if (!info.person) {
	      if (info.ref == 'cus_nation_id' && this.state.data.cusIDCard && this.state.data.cusIDCard.nationid == this.state.data.cus_nation_id) {
	        return;
	      }
	      if (info.ref == 'co_nation_id' && this.state.data.coIDCard && this.state.data.coIDCard.nationid == this.state.data.co_nation_id) {
	        return;
	      }

	      var obj = {
	        data: this.state.data
	      };
	      if (info.ref == 'cus_nation_id') {
	        obj.data.customer = genPersonFromNationId(this.state.data.cusIDCard);
	        obj.data.cardAddr = {};
	      } else {
	        obj.data.co = genPersonFromNationId(this.state.data.coIDCard);;
	        obj.data.coCardAddr = {};
	      }
	      obj.homeAddressList = [{ value: 0, text: '' }];
	      obj.workAddressList = [{ value: 0, text: '' }];
	      obj.coHomeAddressList = [{ value: 0, text: '' }];
	      obj.coWorkAddressList = [{ value: 0, text: '' }];
	      this.setState(obj, function () {
	        toasterActions.pop({
	          type: 'warning',
	          message: 'ไม่พบข้อมูลตามบัตรประชาชนนี้'
	        });
	      });
	      return;
	    }
	    var obj = {
	      data: this.state.data
	    };
	    if (info.ref == 'cus_nation_id') {
	      var ref1 = 'customer';
	      var ref2 = 'cusIDCard';
	      var ref3 = 'cusContractList';
	      var ref4 = 1;
	      var ref5 = 'homeAddressList';
	      var ref6 = 'workAddressList';
	      var ref7 = 'cus_history';
	    } else {
	      var ref1 = 'co';
	      var ref2 = 'coIDCard';
	      var ref3 = 'coContractList';
	      var ref4 = 3;
	      var ref5 = 'coHomeAddressList';
	      var ref6 = 'coWorkAddressList';
	      var ref7 = 'co_history';
	    }
	    if (info.person != null) {
	      try {
	        obj.data[ref2] = JSON.parse(info.person.idcard_info);
	        obj.data[ref2 + 'Photo'] = genPhotoNationId(obj.data[ref2].nationid);
	        obj.data[ref1] = genPersonFromNationId(info.person);
	      } catch (e) {
	        obj.data[ref2] = {};
	      }
	    }

	    obj[ref3] = info.contracts;
	    obj.tabList = this.state.tabList;
	    var cnt = info.contracts.reduce(function (prev, row) {
	      return prev + (row.current_status == 'NORMAL' || row.current_status == 'DEBT' ? 1 : 0);
	    }, 0);
	    obj.tabList[ref4].raw = true;
	    obj.tabList[ref4].text = tr.translate('installment.inspection.tab.history') + ' (' + cnt + '/' + info.contracts.length + ')';

	    var status = 1;
	    if (info.contracts.length == 0) {
	      status = 0;
	    }
	    for (var i = 0; i < info.contracts.length; i++) {
	      if (info.contracts[i].current_status == 'CLOSE_BAD_DEBT' || info.contracts[i].current_status == 'CLOSE_CONFISCATE') {
	        status = 3;
	        break;
	      } else if (info.contracts[i].current_status == 'NORMAL' || info.contracts[i].current_status == 'DEBT') {
	        status = 2;
	      }
	    };
	    obj.data[ref1].status = status;
	    var list = info.addresses.filter(function (row) {
	      return row.type == 'HOME';
	    }).map(function (addr) {
	      return { value: addr.id, text: addr.full_address };
	    });
	    list.unshift({ value: 0, text: '' });
	    obj[ref5] = list;

	    var list = info.addresses.filter(function (row) {
	      return row.type == 'WORK';
	    }).map(function (addr) {
	      return { value: addr.id, text: addr.full_address };
	    });
	    list.unshift({ value: 0, text: '' });
	    obj[ref6] = list;
	    obj.currentTab = ref7;
	    this.setState(obj);
	    console.log('jacktest=', obj);
	  },

	  onInspectErrorAction: function onInspectErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'result.inspect.error'
	    });
	  },

	  handleChange: function handleChange(id, value) {
	    if ((id == 'cus_nation_id' || id == 'co_nation_id') && value.trim().length == 13) {
	      inspectionActions.inspect({
	        id: value.trim(),
	        ref: id
	      });
	    }
	    var obj = {};
	    obj[id] = value;
	    this.setState(obj);
	  },

	  handleIDCardChange: function handleIDCardChange(data) {
	    if (data.photoData) {
	      inspectionActions.savePersonPhoto({
	        nationid: data.nationid,
	        photoData: data.photoData
	      });
	    }
	  },

	  handleTabClick: function handleTabClick(id) {
	    this.setState({
	      currentTab: id
	    });
	  },

	  doPrintForm: function doPrintForm(type) {
	    inspectionActions.genContractForm({
	      type: type,
	      cus: {
	        nationid: this.state.cus_nation_id,
	        contract_id: this.state.contract_id || 0,
	        home_addr_id: this.state.home_addr_id || 0,
	        work_addr_id: this.state.work_addr_id || 0
	      },
	      co: {
	        nationid: this.state.co_nation_id,
	        home_addr_id: this.state.co_home_addr_id || 0,
	        work_addr_id: this.state.co_work_addr_id || 0
	      }
	    });
	  },

	  doAddCustomer: function doAddCustomer() {
	    inspectionActions.getPersonOracle({ nationid: this.state.addcust_nationid });
	  },

	  onGenContractFormDoneAction: function onGenContractFormDoneAction(result) {
	    var prefix_url = window.location.protocol + '//' + window.location.host + '/output/';
	    console.log(prefix_url);
	    systemActions.print({
	      url: prefix_url + result.url
	    });
	  },

	  onGetPersonOracleDoneAction: function onGetPersonOracleDoneAction(result) {

	    if (result.status == true) {
	      // console.log('jack=',result.addcust[0]);
	      // console.log('jack2=',result.addcust[0].nationid);
	      // console.log('jack2=',result.addcust[0].firstnameth);
	      inspectionActions.savePerson({
	        nationid: result.addcust[0].nationid,
	        type: 'PERSON',
	        prename: '',
	        firstname: result.addcust[0].firstnameth,
	        lastname: result.addcust[0].lastnameth,
	        fullname: result.addcust[0].firstnameth + ' ' + result.addcust[0].lastnameth,
	        idcard_info: '{}',
	        passport: '',
	        passport_info: '{}',
	        nation: 'THA',
	        birth: '',
	        gender: '',
	        marital_status: 'N/A',
	        mobile: '',
	        email: '',
	        lineid: ''
	      });
	      toasterActions.pop({
	        type: 'success',
	        message: 'บันทึกข้อมูลเรียบร้อย'
	      });
	    } else {
	      toasterActions.pop({
	        type: 'warning',
	        message: 'ไม่พบข้อมูลในระบบ หรือข้อมูลมีอยู่แล้ว'
	      });
	    }
	  },

	  render: function render() {
	    var cusStatus = null;
	    if (typeof this.state.data.customer.status === 'number') {
	      if (this.state.data.customer.status == 1) {
	        cusStatus = React.createElement(
	          'div',
	          { className: 'green', style: { marginLeft: '8px' } },
	          React.createElement('span', { className: 'flaticon-circle108' }),
	          React.createElement(
	            'span',
	            { style: { paddingLeft: '8px' } },
	            'ปกติ'
	          )
	        );
	      } else if (this.state.data.customer.status == 2) {
	        cusStatus = React.createElement(
	          'div',
	          { className: 'orange', style: { marginLeft: '8px' } },
	          React.createElement('span', { className: 'flaticon-round54' }),
	          React.createElement(
	            'span',
	            { style: { paddingLeft: '8px' } },
	            'ติดผ่อน'
	          )
	        );
	      } else if (this.state.data.customer.status == 3) {
	        cusStatus = React.createElement(
	          'div',
	          { className: 'red', style: { marginLeft: '8px' } },
	          React.createElement('span', { className: 'flaticon-round56' }),
	          React.createElement(
	            'span',
	            { style: { paddingLeft: '8px' } },
	            'ลูกหนี้เสีย'
	          )
	        );
	      } else {
	        console.log('NO HISTORY');
	        cusStatus = React.createElement(
	          'div',
	          { className: 'green', style: { marginLeft: '8px' } },
	          React.createElement('span', { className: 'flaticon-circle108' }),
	          React.createElement(
	            'span',
	            { style: { paddingLeft: '8px' } },
	            'ไม่มีประวัติ'
	          )
	        );
	      }
	    }
	    var customerLine = React.createElement(
	      'div',
	      { className: 'flex box10' },
	      React.createElement(
	        'div',
	        { className: 'no-shrink panel1' },
	        'ผู้เช่าซื้อ'
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel3 can-grow flex' },
	        React.createElement(FlexTextInput, {
	          field: { id: 'cus_nation_id', label: 'installment.inspection.nation_id', pattern: '^[0-9]{13}$' },
	          data: this.state,
	          onChange: this.handleChange
	        }),
	        React.createElement(FlexIcon, { icon: 'framed1', className: 'no-shrink', title: 'installment.inspection.read_id', onClick: function () {
	            this.readIDCard('cusIDCard');
	          }.bind(this), style: { padding: '4px' } })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel6 flex', style: { fontSize: '20px', lineHeight: '24px', height: '24px', paddingTop: '4px' } },
	        this.state.data.customer.fullname,
	        cusStatus
	      )
	    );

	    var coStatus = null;

	    if (typeof this.state.data.co.status === 'number') {
	      if (this.state.data.co.status == 1) {
	        coStatus = React.createElement(
	          'div',
	          { className: 'green', style: { marginLeft: '8px' } },
	          React.createElement('span', { className: 'flaticon-circle108' }),
	          React.createElement(
	            'span',
	            { style: { paddingLeft: '8px' } },
	            'ปกติ'
	          )
	        );
	      } else if (this.state.data.co.status == 2) {
	        coStatus = React.createElement(
	          'div',
	          { className: 'orange', style: { marginLeft: '8px' } },
	          React.createElement('span', { className: 'flaticon-round54' }),
	          React.createElement(
	            'span',
	            { style: { paddingLeft: '8px' } },
	            'ติดผ่อน'
	          )
	        );
	      } else if (this.state.data.co.status == 3) {
	        coStatus = React.createElement(
	          'div',
	          { className: 'red', style: { marginLeft: '8px' } },
	          React.createElement('span', { className: 'flaticon-round56' }),
	          React.createElement(
	            'span',
	            { style: { paddingLeft: '8px' } },
	            'ลูกหนี้เสีย'
	          )
	        );
	      } else {
	        coStatus = React.createElement(
	          'div',
	          { className: 'green', style: { marginLeft: '8px' } },
	          React.createElement('span', { className: 'flaticon-circle108' }),
	          React.createElement(
	            'span',
	            { style: { paddingLeft: '8px' } },
	            'ไม่มีประวัติ'
	          )
	        );
	      }
	    }

	    var coLine = React.createElement(
	      'div',
	      { className: 'flex box10' },
	      React.createElement(
	        'div',
	        { className: 'no-shrink panel1' },
	        'ผู้เช่าซื้อร่วม'
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel3 can-grow flex' },
	        React.createElement(FlexTextInput, {
	          field: { id: 'co_nation_id', label: 'installment.inspection.nation_id', pattern: '^[0-9]{13}$' },
	          data: this.state,
	          onChange: this.handleChange
	        }),
	        React.createElement(FlexIcon, { icon: 'framed1', className: 'no-shrink', title: 'installment.inspection.read_id', onClick: function () {
	            this.readIDCard('coIDCard');
	          }.bind(this), style: { padding: '4px' } })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel6 flex', style: { fontSize: '20px', lineHeight: '24px', height: '24px', paddingTop: '4px' } },
	        this.state.data.co.fullname,
	        coStatus
	      )
	    );

	    var addCustLine = React.createElement(
	      'div',
	      { className: 'flex box10' },
	      React.createElement(
	        'div',
	        { className: 'no-shrink panel1' },
	        'เพิ่มลูกค้า'
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel3 can-grow flex' },
	        React.createElement(FlexTextInput, {
	          field: { id: 'addcust_nationid', label: 'installment.inspection.nation_id', pattern: '^[0-9]{13}$' },
	          data: this.state,
	          onChange: this.handleChange
	        })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel2 can-grow flex' },
	        React.createElement(FlexButton, { icon: 'add186', label: 'installment.inspection.add_cust', 'default': true,
	          onClick: function () {
	            this.doAddCustomer();
	          }.bind(this) })
	      ),
	      React.createElement('div', { className: 'panel4 flex', style: { fontSize: '20px', lineHeight: '24px', height: '24px', paddingTop: '4px' } })
	    );

	    var conList = this.state.cusContractList.map(function (row) {
	      return {
	        value: row.id,
	        text: row.code + ' ' + row.sign_date + ' ' + row.product
	      };
	    });
	    conList.unshift({ valcot: '' });
	    var cusInfoTab = React.createElement(
	      'div',
	      { style: { display: this.state.currentTab == 'cus_info' ? 'block' : 'none' } },
	      React.createElement(
	        'div',
	        { className: 'flex' },
	        React.createElement(
	          'div',
	          { className: 'box6' },
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(T, { content: 'installment.inspection.home_addr',
	              component: 'div', style: { height: '24px', lineHeight: '24px', paddingTop: '4px' }
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(FlexDropdown, {
	              field: {
	                id: 'home_addr_id',
	                list: this.state.homeAddressList
	              },
	              data: this.state,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(T, { content: 'installment.inspection.work_addr',
	              component: 'div', style: { height: '24px', lineHeight: '24px', paddingTop: '4px' }
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(FlexDropdown, {
	              field: {
	                id: 'work_addr_id',
	                list: this.state.workAddressList
	              },
	              data: this.state,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(T, { content: 'installment.inspection.prev_contract',
	              component: 'div', style: { height: '24px', lineHeight: '24px', paddingTop: '4px' }
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(FlexDropdown, {
	              field: {
	                id: 'contract_id',
	                list: conList
	              },
	              data: this.state,
	              onChange: this.handleChange
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel4 no-shrink' },
	          React.createElement(NationIDCard, {
	            idcard: this.state.data.cusIDCard,
	            photoPath: this.state.cusIDCardPhoto,
	            photoLoading: this.state.cusIDCardPhotoLoading,
	            onChange: function (data) {
	              this.handleIDCardChange(data);
	            }.bind(this)
	          })
	        )
	      )
	    );
	    var coInfoTab = React.createElement(
	      'div',
	      { style: { display: this.state.currentTab == 'co_info' ? 'block' : 'none' } },
	      React.createElement(
	        'div',
	        { className: 'flex' },
	        React.createElement(
	          'div',
	          { className: 'box6' },
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(T, { content: 'installment.inspection.home_addr',
	              component: 'div', style: { height: '24px', lineHeight: '24px', paddingTop: '4px' }
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(FlexDropdown, {
	              field: {
	                id: 'co_home_addr_id',
	                list: this.state.coHomeAddressList
	              },
	              data: this.state,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(T, { content: 'installment.inspection.work_addr',
	              component: 'div', style: { height: '24px', lineHeight: '24px', paddingTop: '4px' }
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(FlexDropdown, {
	              field: {
	                id: 'co_work_addr_id',
	                list: this.state.coWorkAddressList
	              },
	              data: this.state,
	              onChange: this.handleChange
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel4 no-shrink' },
	          React.createElement(NationIDCard, {
	            idcard: this.state.data.coIDCard,
	            photoPath: this.state.coIDCardPhoto,
	            photoLoading: this.state.coIDCardPhotoLoading,
	            onChange: function (data) {
	              this.handleIDCardChange('co', data);
	            }.bind(this)
	          })
	        )
	      )
	    );
	    var cusHistory = React.createElement(
	      'div',
	      { className: 'panel10', style: { display: this.state.currentTab == 'cus_history' ? 'block' : 'none' } },
	      React.createElement(FlexDataTable, {
	        fields: contractFields,
	        data: this.state.cusContractList,
	        displayRows: 10
	      })
	    );
	    var coHistory = React.createElement(
	      'div',
	      { className: 'panel10', style: { display: this.state.currentTab == 'co_history' ? 'block' : 'none' } },
	      React.createElement(FlexDataTable, {
	        fields: contractFields,
	        data: this.state.coContractList,
	        displayRows: 10
	      })
	    );
	    return React.createElement(
	      'div',
	      { className: 'flex-form' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'installment.inspection.title.inspect', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink' },
	          React.createElement(FlexButton, { icon: 'printer88', label: 'installment.inspection.print_form1', 'default': true,
	            onClick: function () {
	              this.doPrintForm('form1');
	            }.bind(this) })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink' },
	          React.createElement(FlexButton, { icon: 'printer88', label: 'installment.inspection.print_form2', 'default': true,
	            onClick: function () {
	              this.doPrintForm('form2');
	            }.bind(this) })
	        )
	      ),
	      React.createElement(
	        'div',
	        null,
	        customerLine,
	        coLine,
	        addCustLine,
	        React.createElement(
	          'div',
	          { className: 'panel10' },
	          React.createElement(FlexTab, { list: this.state.tabList, selected: this.state.currentTab, onClick: this.handleTabClick })
	        ),
	        cusInfoTab,
	        cusHistory,
	        coInfoTab,
	        coHistory
	      )
	    );
	  }
	});

	module.exports = InspectDetail;

/***/ },

/***/ 818:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var contractActions = __webpack_require__(774);
	var contractStore = __webpack_require__(819);

	var Contract = {};

	tr.registerTranslations('en', __webpack_require__(820));
	tr.registerTranslations('th', __webpack_require__(821));

	Contract.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('contract.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// Contract.Pending = require('./contract-pending.jsx');
	// Contract.New = require('./contract-new.jsx');
	// Contract.List = require('./contract-list.jsx');
	// Contract.Edit = require('./contract-edit.jsx');
	// Contract.Close = require('./contract-close.jsx');
	// Contract.CloseDiscount = require('./contract-closediscount.jsx');
	// Contract.Dunning = require('./contract-dunning.jsx');
	// Contract.Redeem = require('./contract-redeem.jsx');

	// Contract.Routes = (
	//   <Route name="installment.contract" path="contract" handler={Contract.Index}>
	//     <Router.DefaultRoute name="installment.contract.pending" handler={Contract.Pending}/>
	//     <Route name="installment.contract.new" path="new/:sellId/:sellType?/:contractref?/:sellold?" handler={Contract.New}/>
	//     <Route name="installment.contract.list" path="list" handler={Contract.List}/>
	//     <Route name="installment.contract.edit" path="edit/:id/:pageback?/:close?/:dunning?" handler={Contract.Edit}/>
	//     <Route name="installment.contract.close" handler={Contract.Close}/>
	//     <Route name="installment.contract.closediscount" handler={Contract.CloseDiscount}/>
	//     <Route name="installment.contract.dunning" handler={Contract.Dunning}/>
	//     <Route name="installment.contract.redeem" handler={Contract.Redeem}/>
	//   </Route>
	// );

	module.exports = Contract;

/***/ },

/***/ 819:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var contractActions = __webpack_require__(774);

	var contractStore = Reflux.createStore({
	  listenables: [contractActions],

	  // contractActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/installment/contract/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      contractActions.list.done(res.data, res.opt);
	      menuActions.updateCount('contract.sell', res.opt.totalRows);
	    } else {
	      contractActions.list.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/installment/contract/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      contractActions.export.done(res.file);
	    } else {
	      contractActions.export.error(res.error);
	    }
	  },
	  onGetBarcode: function onGetBarcode(param) {
	    ajaxActions.request('/api/installment/contract/listBarcode', param, this.doneGetBarcode);
	  },

	  doneGetBarcode: function doneGetBarcode(res) {
	    if (res.status === true) {
	      contractActions.getBarcode.done(res.data, res.opt);
	    } else {
	      contractActions.getBarcode.error(res.error);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/installment/contract/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      contractActions.getById.done({
	        contract: res.contract,
	        paymentTerm: res.paymentTerm,
	        refContract: res.refContract
	      });
	    } else {
	      contractActions.getById.error(res.msg);
	    }
	  },

	  onSaveNew: function onSaveNew(data) {
	    ajaxActions.request('/api/installment/contract/saveNew', data, this.doneSaveNew);
	  },

	  doneSaveNew: function doneSaveNew(res) {
	    if (res.status === true) {
	      contractActions.saveNew.done(res.data);
	      //      menuActions.updateCount('contract', res.totalRows);
	    } else {
	        contractActions.saveNew.error(res.error);
	      }
	  },

	  onDelete: function onDelete(id) {
	    ajaxActions.request('/api/installment/contract/delete', { id: id }, this.doneDelete);
	  },

	  doneDelete: function doneDelete(res) {
	    if (res.status === true) {
	      contractActions.delete.done(res.data);
	    } else {
	      contractActions.delete.error(res.msg);
	    }
	  },

	  onGetSellInfo: function onGetSellInfo(id) {
	    ajaxActions.request('/api/installment/contract/sellInfo', { id: id }, this.doneGetSellInfo);
	  },

	  doneGetSellInfo: function doneGetSellInfo(res) {
	    if (res.status === true) {
	      contractActions.getSellInfo.done(res.data);
	    } else {
	      contractActions.getSellInfo.error(res.error);
	    }
	  },

	  onSave: function onSave(data) {
	    ajaxActions.request('/api/installment/contract/save', data, this.doneSave);
	  },
	  doneSave: function doneSave(res) {
	    console.log(res.status);
	    if (res.status === true) {
	      contractActions.save.done(res.data);
	    } else {
	      contractActions.save.error(res.error);
	    }
	  },

	  // contractActions.Close
	  onListClose: function onListClose(param) {
	    ajaxActions.request('/api/installment/contract/listClose', param, this.doneListClose);
	  },

	  doneListClose: function doneListClose(res) {
	    if (res.status === true) {
	      contractActions.listClose.done(res.data, res.opt);
	      //menuActions.updateCount('contract.sell', res.opt.totalRows);
	    } else {
	        contractActions.listClose.error(res.error);
	      }
	  },

	  onExportClose: function onExportClose(param) {
	    ajaxActions.request('/api/installment/contract/exportClose', param, this.doneExportClose);
	  },

	  doneExportClose: function doneExportClose(res) {
	    if (res.status === true) {
	      contractActions.exportClose.done(res.file);
	    } else {
	      contractActions.exportClose.error(res.error);
	    }
	  },

	  onGetCloseReturn: function onGetCloseReturn(param) {
	    console.log('request');
	    ajaxActions.request('/api/installment/contract/getCloseReturn', param, this.doneGetCloseReturn);
	  },

	  doneGetCloseReturn: function doneGetCloseReturn(res) {
	    if (res.status === true) {
	      contractActions.getCloseReturn.done(res.data);
	    } else {
	      contractActions.getCloseReturn.error(res.error);
	    }
	  },

	  onSaveCollection: function onSaveCollection(param) {
	    ajaxActions.request('/api/installment/contract/saveCollection', param, this.doneSaveCollection);
	  },

	  doneSaveCollection: function doneSaveCollection(res) {
	    if (res.status === true) {
	      contractActions.saveCollection.done(res.data);
	    } else {
	      contractActions.saveCollection.error(res.error);
	    }
	  },

	  onGetListCollection: function onGetListCollection(id) {
	    ajaxActions.request('/api/installment/contract/getListCollection', { id: id }, this.doneGetListCollection);
	  },

	  doneGetListCollection: function doneGetListCollection(res) {
	    if (res.status === true) {
	      contractActions.getListCollection.done(res.data);
	    } else {
	      contractActions.getListCollection.error(res.error);
	    }
	  },

	  onGetMobileNumber: function onGetMobileNumber(param) {
	    //console.log('onPaymentOptionList');
	    ajaxActions.request('/api/installment/contract/getMobileNumber', param, this.doneGetMobileNumber);
	  },

	  doneGetMobileNumber: function doneGetMobileNumber(res) {
	    if (res.status === true) {
	      contractActions.getMobileNumber.done(res.data);
	    } else {
	      contractActions.getMobileNumber.error(res.error);
	    }
	  },

	  onPrintCollectionReport: function onPrintCollectionReport(res) {
	    ajaxActions.request('/api/installment/contract/printCollectionReport', res, this.donePrintCollectionReport);
	  },

	  donePrintCollectionReport: function donePrintCollectionReport(res) {
	    if (res.status === true) {
	      contractActions.printCollectionReport.done(res.data);
	    } else {
	      contractActions.printCollectionReport.error(res.error);
	    }
	  },

	  onExportDunning: function onExportDunning(param) {
	    ajaxActions.request('/api/installment/contract/exportDunning', param, this.doneExportDunning);
	  },

	  doneExportDunning: function doneExportDunning(res) {
	    if (res.status === true) {
	      contractActions.exportDunning.done(res.file);
	    } else {
	      contractActions.exportDunning.error(res.error);
	    }
	  },

	  onListClosediscount: function onListClosediscount(param) {
	    ajaxActions.request('/api/installment/contract/listClosediscount', param, this.doneListClosediscount);
	  },

	  doneListClosediscount: function doneListClosediscount(res) {
	    if (res.status === true) {
	      contractActions.listClosediscount.done(res.data, res.opt);
	      menuActions.updateCount('contract.sell', res.opt.totalRows);
	    } else {
	      contractActions.listClosediscount.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExportClosediscount: function onExportClosediscount(param) {
	    ajaxActions.request('/api/installment/contract/exportClosediscount', param, this.doneExportClosediscount);
	  },

	  doneExportClosediscount: function doneExportClosediscount(res) {
	    if (res.status === true) {
	      contractActions.exportClosediscount.done(res.file);
	    } else {
	      contractActions.exportClosediscount.error(res.error);
	    }
	  },

	  onSaveClosediscount: function onSaveClosediscount(id) {
	    console.log('request');
	    ajaxActions.request('/api/installment/contract/saveClosediscount', { id: id }, this.doneSaveClosediscount);
	  },

	  doneSaveClosediscount: function doneSaveClosediscount(res) {
	    if (res.status === true) {
	      contractActions.saveClosediscount.done(res);
	    } else {
	      contractActions.saveClosediscount.error(res.error);
	    }
	  },

	  onCloseCaStaffList: function onCloseCaStaffList(id) {
	    ajaxActions.request('/api/installment/contract/closeCaStaffList', { id: id }, this.doneCloseCaStaffList);
	  },

	  doneCloseCaStaffList: function doneCloseCaStaffList(res) {
	    if (res.status === true) {
	      contractActions.closeCaStaffList.done(res.data);
	    } else {
	      contractActions.closeCaStaffList.error(res.error);
	    }
	  },

	  onSaveCloseCa: function onSaveCloseCa(param) {
	    ajaxActions.request('/api/installment/contract/saveCloseCa', param, this.doneSaveCloseCa);
	  },

	  doneSaveCloseCa: function doneSaveCloseCa(res) {
	    if (res.status === true) {
	      contractActions.saveCloseCa.done(res);
	    } else {
	      contractActions.saveCloseCa.error(res.error);
	    }
	  },

	  onGetContractID: function onGetContractID(contract_code) {
	    //console.log('onPaymentOptionList');
	    ajaxActions.request('/api/installment/contract/getContractID', { code: contract_code }, this.doneGetContractID);
	  },

	  doneGetContractID: function doneGetContractID(res) {
	    if (res.status === true) {
	      contractActions.getContractID.done(res.data);
	    } else {
	      contractActions.getContractID.error(res.error);
	    }
	  },

	  onGetPersonCard: function onGetPersonCard(nationid) {
	    ajaxActions.request('/api/installment/contract/getPersonCard', { nationid: nationid }, this.doneGetPersonCard);
	  },

	  doneGetPersonCard: function doneGetPersonCard(res) {
	    console.log('res:', res);
	    if (res.status === true) {
	      contractActions.getPersonCard.done(res.data.person_card);
	    } else {
	      contractActions.getPersonCard.error(res.error);
	    }
	  },

	  onGetPersonCardCo: function onGetPersonCardCo(nationid) {
	    ajaxActions.request('/api/installment/contract/getPersonCardCo', { nationid: nationid }, this.doneGetPersonCardCo);
	  },

	  doneGetPersonCardCo: function doneGetPersonCardCo(res) {
	    console.log('res:', res);
	    if (res.status === true) {
	      contractActions.getPersonCardCo.done(res.data.person_card);
	    } else {
	      contractActions.getPersonCardCo.error(res.error);
	    }
	  }

	});

	module.exports = contractStore;

/***/ },

/***/ 820:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 821:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  installment: {
	    contract: {
	      current_status: {
	        NORMAL: 'ปกติ',
	        DEBT: 'ค้างชำระ',
	        CLOSE_CANCEL: 'ปิด/ยกเลิก',
	        CLOSE_NORMAL: 'ปิด/ปกติ',
	        CLOSE_RETURN: 'ปิด/คืนของ',
	        CLOSE_CONFISCATE: 'ปิด/ยึดคืน',
	        CLOSE_BAD_DEBT: 'ปิด/หนี้สูญ',
	        CLOSE_CHANGE: 'ปิดเปลี่ยนของ'
	      }
	    }
	  },
	  info: {
	    sell_date: 'วันที่ขาย',
	    receipt_no: 'ใบเสร็จ',
	    shop_name: 'สาขา',
	    contract_ref: 'เลขที่สัญญา',
	    company_name: 'ลูกค้า',
	    description: 'สินค้า',
	    serial: 'S/N',
	    price: 'ราคาขาย',
	    cost: 'ราคาทุน',
	    down_payment: 'ดาวน์',
	    remain_price: 'ยอดจัด',
	    finance_staff: 'พนักงานไฟแนนซ์',
	    sell_staff: 'พนักงานขาย',
	    flag: '*',
	    flag_hint: 'สดพิเศษ'
	  },
	  sell: {
	    sell_date: 'วันที่',
	    receipt_no: 'ใบเสร็จ',
	    description: 'ข้อมูลสินค้า',
	    serial: 'ซีเรียล',
	    sales_staff: 'พนักงานขาย',
	    finance_staff: 'พนักงานสินเชื่อ',
	    price: 'ราคาสินค้าทั้งหมด',
	    cost: 'ทุน',
	    main_price: 'ราคาสินค้าที่ผ่อน',
	    down_payment: 'ดาวน์',
	    fee: 'ค่าทำสัญญา',
	    install_cost: 'ค่าติดตั้ง',
	    remain_price: 'ยอดจัด'
	  },
	  contract: {
	    contract: 'สัญญา',
	    filter_shop: 'สาขา',
	    filter_current_status: 'สถานะ',
	    filter_selltype: 'สถานะขาย',
	    code: 'เลขที่',
	    sign_date: 'วันที่ทำ',
	    shop_code: 'รหัสสาขา',
	    shop_name: 'สาขา',
	    contract_status: 'สถานะ',
	    doc_send_to: 'จัดส่งเอกสารที่',
	    doc_send_to_HOME: 'บ้าน',
	    doc_send_to_WORK: 'ที่ทำงาน',
	    customer: 'ผู้เช่าซื้อ',
	    cus_mobile: 'เบอร์โทร',
	    co: 'ผู้เช่าซื้อร่วม',
	    coaddress_status: 'ที่อยู่',
	    cowork_status: 'การงาน',
	    product: 'สินค้า',
	    serial: 'S/N',
	    product_detail: 'รายละเอียดสินค้า',
	    address_status: 'ที่อยู่',
	    work_status: 'การงาน',
	    product_status: 'ข้อมูลสินค้า',
	    payment_status: 'งวดการชำระ',
	    payment_month: 'จำนวนงวด',
	    payment_on_day: 'ชำระทุกวันที่',
	    payment_price: 'ยอดจัด',
	    fee: 'ค่าทำสัญญา',
	    payment_per_month: 'ชำระเดือนละ',
	    total_paid: 'ชำระแล้ว',
	    payment_balance: 'คงเหลือ',
	    nationid: 'บัตรประชาชน',
	    pname: 'คำนำหน้า',
	    name: 'ชื่อ',
	    lname: 'นามสกุล',
	    nation_id: 'บัตรประชาชน',
	    birth: 'วันเกิด',
	    age: 'อายุ',
	    gender: 'เพศ',
	    marital_status: 'สถานภาพ',
	    over_day: 'เกินกำหนด',
	    finance: 'ไฟแนนซ์',
	    last_paid: 'ชำระล่าสุด',
	    amount_term: 'งวดค้าง',
	    return_date: 'วันที่ยึด',
	    discount: 'ส่วนลด',
	    contract_ref: 'เลขที่สัญญาเก่า',
	    sell_date: 'วันที่ขาย',
	    cus_name: 'ผู้เช่าซื้อ',
	    address: {
	      copy_from: 'คัดลอกจาก',
	      card_address: 'ที่อยู่ตามบัตรประชาชน',
	      home_address: 'ที่อยู่ปัจจุบัน',
	      work_address: 'ที่อยู่ที่ทำงาน',
	      addr1: 'เลขที่/อาคาร/หมู่บ้าน',
	      addr2: 'ซอย/ถนน',
	      tambon: 'แขวง/ตำบล',
	      amphur: 'เขต/อำเภอ',
	      province: 'จังหวัด',
	      zipcode: 'รหัสไปรษณีย์',
	      tel: 'เบอร์อื่น ๆ',
	      fax: 'โทรสาร',
	      year: 'ปีที่อาศัย'
	    },
	    addr_type: 'สถานภาพที่อยู่',
	    addr_with: 'อาศัยอยู่กับ',
	    addr_person: 'จำนวนผู้อาศัยด้วย',
	    addr_month: 'เดือนที่อาศัย',
	    tel: 'โทรศัพท์',
	    mobile: 'มือถือ',
	    email: 'อีเมล',
	    co_relation: 'ความสัมพันธ์',
	    work_company: 'บริษัท/ห้างร้าน',
	    work_addr1: 'เลขที่/หมู่ที่/อาคาร/ชั้น',
	    work_addr2: 'ซอย/ถนน',
	    work_type: 'ประเภทธุรกิจ',
	    work_type_other: 'อื่น ๆ',
	    work_detail: 'ลักษณะงาน',
	    work_department: 'แผนก',
	    work_position: 'ตำแหน่ง',
	    work_time: 'เวลาที่สะดวก',
	    work_year: 'อายุงาน(ปี)',
	    work_salary: 'ฐานเงินเดือน',
	    work_income: 'รายได้อื่น ๆ',
	    work_income_source: 'แหล่งที่มารายได้อื่น ๆ',
	    work_prev_company: 'สถานที่ทำงานเดิม',
	    work_prev_addr: 'ที่ตั้ง',
	    work_prev_department: 'แผนก',
	    work_prev_tel: 'โทรศัพท์',
	    title: {
	      index: 'สัญญาเช่าซื้อ',
	      list_pending: 'รายการขายผ่อนรอเปิดสัญญา',
	      list: 'รายการสัญญาเช่าซื้อทั้งหมด',
	      view: 'รายละเอียดสัญญาเช่าซื้อ',
	      new: 'ทำสัญญาใหม่',
	      close: 'รายการยึด/คืนสินค้าทั้งหมด',
	      closediscount: 'รายการสัญญารอปิดแบบมีส่วนลด',
	      list_redeem: 'รายการขายไถ่ถอน/เปลี่ยนของรอเปิดสัญญา'
	    },
	    action: {
	      new: 'เพิ่มสาขาใหม่'
	    },
	    person_info: 'ข้อมูลส่วนตัว',
	    work_info: 'สภานภาพการงาน',
	    card_info: 'บัตรประชาชน',
	    gen_payment: 'สร้างงวดชำระ',
	    payment: {
	      date: 'วันที่ชำระ',
	      amount: 'ยอดชำระ'
	    },
	    status: {
	      WAIT: 'รอจ่าย',
	      WAIT_PARTIAL: 'ชำระบางส่วน',
	      WAIT_PAID: 'ชำระแล้ว',
	      OVERDUE: 'เกินกำหนด',
	      OVERDUE_PARTIAL: 'เกิน, ชำระบางส่วน',
	      OVERDUE_PAID: 'เกิน, ชำระแล้ว'
	    },
	    current_status: {
	      ALL: 'ทุกสถานะ',
	      NORMAL: 'ปกติ',
	      DEBT: 'ค้างชำระ',
	      CLOSE_NORMAL: 'ปิดสัญญา ปกติ',
	      CLOSE_CANCEL: 'ปิดสัญญา ยกเลิก',
	      CLOSE_RETURN: 'ปิดสัญญา คืนของ',
	      CLOSE_CONFISCATE: 'ปิดสัญญา ยึดของคืน',
	      CLOSE_BAD_DEBT: 'ปิดสัญญา ตัดหนี้สูญ'
	    },

	    view: {
	      summary: 'ภาพรวม',
	      customer: 'ข้อมูลลูกค้า',
	      payment: 'งวดชำระ',
	      call: 'การติดตาม'
	    },
	    term: {
	      num: 'งวด',
	      due_date: 'กำหนดชำระ',
	      due_amount: 'ยอดชำระ',
	      paid_date: 'วันที่ชำระ',
	      paid_amount: 'ชำระแล้ว',
	      term_status: 'สถานะการชำระ',
	      ref_code: 'เลขที่ใบเสร็จอ้างอิง',
	      term_status_WAIT: 'รอชำระ',
	      term_status_WAIT_PARTIAL: 'ชำระบางส่วน',
	      term_status_WAIT_PAID: 'ชำระแล้ว',
	      term_status_OVERDUE: 'เกินกำหนด',
	      term_status_OVERDUE_PARTIAL: 'ชำระบางส่วน เกินกำหนด',
	      term_status_OVERDUE_PAID: 'ชำระแล้ว เกินกำหนด'
	    },
	    filter_type: 'ประเภทการคืน',
	    footer: {
	      special: '| * หมายถึง สดพิเศษ'
	    }
	  },
	  close_return: {
	    newcost: 'ราคาทุนใหม่',
	    oldcost: 'ราคาทุนเดิม',
	    paid: 'ชำระแล้ว',
	    balance: 'คงเหลือ',
	    contract_free: 'ค่าทำสัญญา',
	    install_free: 'ค่าติดตั้ง',
	    profit_loss: 'กำไรขาดทุน',
	    sell_id: 'เลขที่ขาย',
	    sign_date: 'วันที่ขาย',
	    product_serial: 'Serial No',
	    product_detial: 'สินค้า',
	    product_condition: 'สภาพสินค้า',
	    remark: 'หมายเหตุ',
	    return_date: 'วันที่ยึดสินค้า',
	    return_detail: {
	      num: 'ลำดับ',
	      product: 'สินค้า',
	      serial: 'Serial No',
	      newcost: 'ทุนใหม่',
	      oldcost: 'ทุนเดิม'
	    }
	  },
	  collection: {
	    call_date: 'วันที่โทรตาม',
	    call_number: 'เบอร์โทร',
	    call_remark: 'ข้อความ',
	    due_date: 'วันนัดชำระ',
	    call_type: 'ประเภทการโทร',
	    save: 'บันทึกตามหนี้',
	    print: 'พิมพ์เอกสาร',
	    print_file: 'เอกสาร',
	    send_print: 'ส่งถึง',
	    statusca: 'สถานะ',
	    saveca: 'บันทึกแจ้งหนีหนี้ CA',
	    call_name: 'ชื่อผู้ซื้อ/ชื่อผู้ค้ำ',
	    collection_list: {
	      num: 'ลำดับ',
	      call_date: 'วันที่โทรตาม',
	      due_date: 'วันนัดชำระ',
	      call_number: 'เบอร์โทร',
	      call_type: 'ประเภทการโทร',
	      call_remark: 'ข้อความ',
	      staff_name: 'พนักงาน'
	    }
	  },
	  closeca: {
	    contract_code: 'เลขที่สัญญา',
	    paid: 'ชำระแล้ว',
	    cost: 'ราคาทุน',
	    new_cost: 'ราคาทุนใหม่',
	    fee: 'ค่าทำสัญญา',
	    install_cost: 'ค่าติดตั้ง',
	    total_paid: 'ชำระแล้ว',
	    profit_lost: 'กำไรขาดทุน',
	    sell_id: 'เลขที่ขาย',
	    sign_date: 'วันที่ขาย',
	    closeca_effective: 'หัก/จ่าย เดือน',
	    closeca_date: 'วันที่ปิด CA',
	    product_serial: 'Serial No',
	    product_detail: 'สินค้า',
	    closeca_remark: 'หมายเหตุ',
	    nationid: 'เลขที่บัตรประชาชน',
	    cus_name: 'ชือลูกค้า',
	    over_day: 'จำนวนวันเกิน',
	    last_paid: 'วันที่จ่ายล่าสุด',
	    closeca_staffname: 'พนักงานผู้รับผิดชอบ',
	    closeca_staff_percent: 'หักพนักงาน(%)',
	    closeca_staff_amount: 'หักพนักงานเป็นเงิน',
	    closeca_percent: 'บริษัทรับผิดชอบ(%)',
	    closeca_amount: 'บริษัทรับผิดชอบเป็นเงิน',
	    saveca: 'ปิดสัญญาหนีหนี้CA',
	    total_price: 'ราคาขาย'
	  }
	};

/***/ },

/***/ 822:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var barcodeActions = __webpack_require__(823);
	var barcodeStore = __webpack_require__(824);

	var Generator = {};
	var Print = {};

	tr.registerTranslations('en', __webpack_require__(825));
	tr.registerTranslations('th', __webpack_require__(826));

	Generator.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('barcode.title.generator'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	Print.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('barcode.title.print'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// Generator.Routes = (
	//   <Route name="installment.barcode-gen" path="barcode-gen" handler={Generator.Index}>
	//     <Router.DefaultRoute name="installment.barcode-gen.generator" handler={require('./barcode-generator.jsx')}/>
	//   </Route>
	// );

	// Print.Routes = (
	//   <Route name="installment.barcode-print" path="barcode-print" handler={Print.Index}>
	//     <Router.DefaultRoute name="installment.barcode-print.print" handler={require('./barcode-print.jsx')}/>
	//   </Route>
	// );

	module.exports = { Print: Print, Generator: Generator };

/***/ },

/***/ 823:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facet': { children: ['done', 'error'] },
	  'reprint': { children: ['done', 'error'] },
	  'generate': { children: ['done', 'error'] }
	});

/***/ },

/***/ 824:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);
	var $ = __webpack_require__(360);
	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var barcodeActions = __webpack_require__(823);

	var barcodeStore = Reflux.createStore({
	  listenables: [barcodeActions],

	  // barcodeActions.list
	  onList: function onList(param) {
	    console.log('onList');
	    ajaxActions.request('/api/installment/barcode/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      barcodeActions.list.done(res.data, res.opt);
	    } else {
	      barcodeActions.list.error(res.error);
	    }
	  },
	  // barcodeActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/installment/barcode/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      barcodeActions.export.done(res.file);
	    } else {
	      barcodeActions.export.error(res.error);
	    }
	  },

	  onFacet: function onFacet() {
	    ajaxActions.request('/api/installment/barcode/facet', {}, this.doneFacet);
	  },

	  doneFacet: function doneFacet(res) {
	    if (res.status === true) {
	      barcodeActions.facet.done(res);
	    } else {
	      barcodeActions.facet.error(res.error);
	    }
	  },

	  onGetBarcode: function onGetBarcode(param) {
	    ajaxActions.request('/api/installment/barcode/listBarcode', param, this.doneGetBarcode);
	  },

	  doneGetBarcode: function doneGetBarcode(res) {
	    if (res.status === true) {
	      barcodeActions.getBarcode.done(res.data);
	    } else {
	      barcodeActions.getBarcode.error(res.error);
	    }
	  },

	  onGenerate: function onGenerate(param) {
	    ajaxActions.request('/api/installment/barcode/generate', param, this.doneGenerate);
	  },

	  doneGenerate: function doneGenerate(res) {
	    if (res.status === true) {
	      $.ajax({
	        url: '//localhost:9001/barcode/ttp244',
	        contentType: 'application/json; charset=utf-8',
	        data: JSON.stringify(res.barcode),
	        type: 'POST',
	        dataType: 'json',
	        success: function success(result) {
	          barcodeActions.generate.done(result);
	        },
	        error: function error() {
	          barcodeActions.generate.done({ status: false });
	        }
	      });
	    } else {
	      barcodeActions.generate.done({ status: false });
	    }
	  },

	  onReprint: function onReprint(param) {
	    ajaxActions.request('/api/installment/barcode/reprint', param, this.doneReprint);
	  },

	  doneReprint: function doneReprint(res) {
	    if (res.status === true) {
	      $.ajax({
	        url: '//localhost:9001/barcode/ttp244',
	        contentType: 'application/json; charset=utf-8',
	        data: JSON.stringify(res.barcode),
	        type: 'POST',
	        dataType: 'json',
	        success: function success(result) {
	          console.log(result);
	          barcodeActions.reprint.done(result);
	        },
	        error: function error() {
	          barcodeActions.reprint.done({ status: false, message: 'กรุณา Restart Service และ เชื่อต่อเครื่องพิมพ์อีกครั้ง' });
	        }
	      });
	    } else {
	      barcodeActions.reprint.done({ status: false });
	    }
	  },
	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/barcode/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      barcodeActions.getById.done({
	        barcode: res.barcode,
	        paymentTerm: res.paymentTerm,
	        refContract: res.refContract
	      });
	    } else {
	      barcodeActions.getById.error(res.msg);
	    }
	  },

	  onSaveNew: function onSaveNew(data) {
	    ajaxActions.request('/api/barcode/saveNew', data, this.doneSaveNew);
	  },

	  doneSaveNew: function doneSaveNew(res) {
	    if (res.status === true) {
	      barcodeActions.saveNew.done(res.data);
	      //      menuActions.updateCount('barcode', res.totalRows);
	    } else {
	        barcodeActions.saveNew.error(res.error);
	      }
	  },

	  onDelete: function onDelete(id) {
	    ajaxActions.request('/api/barcode/delete', { id: id }, this.doneDelete);
	  },

	  doneDelete: function doneDelete(res) {
	    if (res.status === true) {
	      barcodeActions.delete.done(res.data);
	    } else {
	      barcodeActions.delete.error(res.msg);
	    }
	  },

	  onGetSellInfo: function onGetSellInfo(id) {
	    ajaxActions.request('/api/barcode/sellInfo', { id: id }, this.doneGetSellInfo);
	  },

	  doneGetSellInfo: function doneGetSellInfo(res) {
	    if (res.status === true) {
	      barcodeActions.getSellInfo.done(res.data);
	    } else {
	      barcodeActions.getSellInfo.error(res.error);
	    }
	  },

	  onSave: function onSave(data) {
	    ajaxActions.request('/api/barcode/save', data, this.doneSave);
	  },
	  doneSave: function doneSave(res) {
	    if (res.status === true) {
	      barcodeActions.save.done(res.data);
	    } else {
	      barcodeActions.save.error(res.error);
	    }
	  }
	});

	module.exports = barcodeStore;

/***/ },

/***/ 825:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 826:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  barcode: {
	    begin: 'เลขที่สัญญา',
	    end: 'เลขที่สัญญา',
	    shop_code: 'รหัสสาขา',
	    shop_name: 'ชื่อสาขา',
	    year: 'พ.ศ.',
	    qty: 'จำนวน',
	    last_barcode: 'บาร์โค้ดสุดท้าย',
	    count_total: 'จำนวนทั้งหมด',
	    count_used: 'ใช้ไปแล้ว',
	    count_available: 'คงเหลือ',
	    confirm_dialog: 'ยืนยันการพิมพ์เลขที่สัญญา กรุณาติดตั้งเครื่องพิมพ์บาร์โค้ดให้เรียบร้อย, ก่อนกดตกลง',
	    title: {
	      generator: 'เพิ่มเลขที่สัญญา',
	      print: 'พิมพ์เลขที่สัญญา'
	    }
	  }
	};

/***/ },

/***/ 827:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var commissionActions = __webpack_require__(828);
	var commissionStore = __webpack_require__(829);

	var Barcode = {};

	tr.registerTranslations('en', __webpack_require__(830));
	tr.registerTranslations('th', __webpack_require__(831));

	Barcode = React.createClass({
	  displayName: 'Barcode',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('installment.commission-open.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// Barcode.Routes = (
	//   <Route name="installment.commission-open" path="commission-open" handler={Barcode.Index}>
	//     <Router.DefaultRoute name="installment.commission-open.list" handler={require('./commission-list.jsx')}/>
	//     <Route name="installment.commission-open.detail" path="detail/:term_year/:term_month/:shop_id/:staff_id" handler={require('./commission-detail.jsx')}/>
	//   </Route>
	// );

	module.exports = Barcode;

/***/ },

/***/ 828:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facetList': { children: ['done', 'error'] },
	  'facetDetail': { children: ['done', 'error'] },
	  'commissionDetail': { children: ['done', 'error'] },
	  'saveCommission': { children: ['done', 'error'] },
	  'voidCommission': { children: ['done', 'error'] },
	  'paidCommission': { children: ['done', 'error'] }
	});

/***/ },

/***/ 829:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var commissionActions = __webpack_require__(828);

	var commissionStore = Reflux.createStore({
	  listenables: [commissionActions],

	  // commissionActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/installment/commission-open/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      commissionActions.list.done(res.data, res.opt);
	      //      menuActions.updateCount('commission.sell', res.opt.totalRows);
	    } else {
	        commissionActions.list.error(res.error);
	      }
	  },
	  // commissionActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/installment/commission-open/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      commissionActions.export.done(res.file);
	    } else {
	      commissionActions.export.error(res.error);
	    }
	  },

	  onFacetList: function onFacetList() {
	    ajaxActions.request('/api/installment/commission-open/facetList', {}, this.doneFacetList);
	  },

	  doneFacetList: function doneFacetList(res) {
	    if (res.status === true) {
	      commissionActions.facetList.done(res);
	    } else {
	      commissionActions.facetList.error(res.error);
	    }
	  },

	  onFacetDetail: function onFacetDetail(param) {
	    ajaxActions.request('/api/installment/commission-open/facetDetail', param, this.doneFacetDetail);
	  },

	  doneFacetDetail: function doneFacetDetail(res) {
	    if (res.status === true) {
	      commissionActions.facetDetail.done(res);
	    } else {
	      commissionActions.facetDetail.error(res.error);
	    }
	  },

	  onCommissionDetail: function onCommissionDetail(param) {
	    ajaxActions.request('/api/installment/commission-open/commissionDetail', param, this.doneCommissionDetail);
	  },

	  doneCommissionDetail: function doneCommissionDetail(res) {
	    if (res.status === true) {
	      commissionActions.commissionDetail.done(res);
	    } else {
	      commissionActions.commissionDetail.error(res.error);
	    }
	  },

	  onSaveCommission: function onSaveCommission(param) {
	    ajaxActions.request('/api/installment/commission-open/saveCommission', param, this.doneSaveCommission);
	  },

	  doneSaveCommission: function doneSaveCommission(res) {
	    if (res.status === true) {
	      commissionActions.saveCommission.done(res);
	    } else {
	      commissionActions.saveCommission.error(res.error);
	    }
	  },

	  onVoidCommission: function onVoidCommission(id) {
	    ajaxActions.request('/api/installment/commission-open/voidCommission', { id: id }, this.doneVoidCommission);
	  },

	  doneVoidCommission: function doneVoidCommission(res) {
	    if (res.status === true) {
	      commissionActions.voidCommission.done();
	    } else {
	      commissionActions.voidCommission.error(res.error);
	    }
	  },

	  onPaidCommission: function onPaidCommission(id) {
	    ajaxActions.request('/api/installment/commission-open/paidCommission', { id: id }, this.donePaidCommission);
	  },

	  donePaidCommission: function donePaidCommission(res) {
	    if (res.status === true) {
	      commissionActions.paidCommission.done();
	    } else {
	      commissionActions.paidCommission.error(res.error);
	    }
	  }
	});

	module.exports = commissionStore;

/***/ },

/***/ 830:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  commission: {}
	};

/***/ },

/***/ 831:
/***/ function(module, exports) {

	'use strict';

	var _commissionOpen;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	module.exports = {
	  installment: {
	    "commission-open": (_commissionOpen = {
	      title: {
	        index: 'ค่าคอมเปิดสัญญา',
	        list: 'รายการสรุปค่าคอมเปิดสัญญา',
	        detail: 'รายละเอียดการเปิดสัญญา'
	      },
	      sell_staff_name: 'พนักงานขาย',
	      sign_date: 'วันที่ขาย',
	      code: 'สัญญา',
	      cus_fullname: 'ลูกค้า',
	      sum_product_price: 'ขายสุทธิ',
	      sum_payment_price: 'ผ่อนร้าน',
	      sum_cost: 'ทุนขาย',
	      sum_fee: 'ค่าสัญญา',
	      sum_install_cost: 'ค่าติดตั้ง',
	      sum_profit: 'กำไร',
	      paid_status: 'จ่ายแล้ว?',
	      authorized_date: 'วันที่',
	      num_contract: '#',
	      filter_shop: 'สาขา',
	      filter_term_year: ' ',
	      filter_term_month: ' ',
	      filter_staff: ' ',
	      total_profit: 'กำไรรวม',
	      profit_amount: 'กำไรรวม',
	      total_contract: 'จำนวนสัญญา',
	      paid_pct: '% จ่าย',
	      paid_amount: 'จำนวนเงินจ่าย',
	      other_paid: 'หัก/จ่าย อื่น ๆ',
	      term_year: 'งวดการจ่าย',
	      term_month: 'เดือน'
	    }, _defineProperty(_commissionOpen, 'authorized_date', 'วันที่'), _defineProperty(_commissionOpen, 'remark', 'บันทึกข้อความ'), _defineProperty(_commissionOpen, 'payment_term', 'งวด'), _defineProperty(_commissionOpen, 'confirm_to_void', 'ยืนยันการ VOID'), _defineProperty(_commissionOpen, 'confirm_to_paid', 'ยืนยันการ PAID'), _defineProperty(_commissionOpen, 'payment', {
	      summary_period: 'สรุป',
	      paid_period: 'จ่าย',
	      num_contract: '#',
	      profit_amount: 'กำไรรวม',
	      paid_pct: '%',
	      paid_amount: 'จำนวนเงิน',
	      authorized_date: 'อนุมัติ',
	      remark: 'หมายเหตุ',
	      status: 'สถานะ',
	      status_READY: 'พร้อมจ่าย',
	      status_PAID: 'จ่ายแล้ว',
	      status_VOID: 'ยกเลิก',
	      other_paid: 'หัก/จ่ายอื่น ๆ'
	    }), _defineProperty(_commissionOpen, 'contract', {
	      no: 'ที่',
	      sign_date: 'วันที่',
	      code: 'สัญญา',
	      customer: 'ลูกค้า',
	      product: 'สินค้า',
	      total_price: 'ขายสุทธิ',
	      payment_price: 'ผ่อนร้าน',
	      cost: 'ทุนขาย',
	      fee: 'FEE',
	      install_cost: 'ค่าติดตั้ง',
	      profit: 'กำไร',
	      payment_month: '#งวด',
	      status: 'สถานะ',
	      commision_paid: 'จ่าย'
	    }), _commissionOpen)
	  }
	};

/***/ },

/***/ 832:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var commissionActions = __webpack_require__(833);
	var commissionStore = __webpack_require__(834);

	var Barcode = {};

	tr.registerTranslations('en', __webpack_require__(835));
	tr.registerTranslations('th', __webpack_require__(836));

	Barcode = React.createClass({
	  displayName: 'Barcode',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('installment.commission-close.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// Barcode.Routes = (
	//   <Route name="installment.commission-close" path="commission-close" handler={Barcode.Index}>
	//     <Router.DefaultRoute name="installment.commission-close.list" handler={require('./commission-list.jsx')}/>
	//     <Route name="installment.commission-close.detail" path="detail/:term_year/:term_month/:shop_id/:staff_id" handler={require('./commission-detail.jsx')}/>
	//   </Route>
	// );

	module.exports = Barcode;

/***/ },

/***/ 833:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facetList': { children: ['done', 'error'] },
	  'genrate': { children: ['done', 'error'] },
	  'facetDetail': { children: ['done', 'error'] },
	  'commissionDetail': { children: ['done', 'error'] },
	  'saveCommission': { children: ['done', 'error'] },
	  'voidCommission': { children: ['done', 'error'] },
	  'paidCommission': { children: ['done', 'error'] }
	});

/***/ },

/***/ 834:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var commissionActions = __webpack_require__(833);

	var commissionStore = Reflux.createStore({
	  listenables: [commissionActions],

	  // commissionActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/installment/commission-close/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      console.log('data=', res.data);
	      commissionActions.list.done(res.data, res.opt);
	      //      menuActions.updateCount('commission.sell', res.opt.totalRows);
	    } else {
	        commissionActions.list.error(res.error);
	      }
	  },
	  // commissionActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/installment/commission-close/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      commissionActions.export.done(res.file);
	    } else {
	      commissionActions.export.error(res.error);
	    }
	  },

	  onFacetList: function onFacetList() {
	    ajaxActions.request('/api/installment/commission-close/facetList', {}, this.doneFacetList);
	  },

	  doneFacetList: function doneFacetList(res) {
	    if (res.status === true) {
	      commissionActions.facetList.done(res);
	    } else {
	      commissionActions.facetList.error(res.error);
	    }
	  },

	  onFacetDetail: function onFacetDetail(param) {
	    ajaxActions.request('/api/installment/commission-close/facetDetail', param, this.doneFacetDetail);
	  },

	  doneFacetDetail: function doneFacetDetail(res) {
	    if (res.status === true) {
	      commissionActions.facetDetail.done(res);
	    } else {
	      commissionActions.facetDetail.error(res.error);
	    }
	  },

	  onCommissionDetail: function onCommissionDetail(param) {
	    ajaxActions.request('/api/installment/commission-close/commissionDetail', param, this.doneCommissionDetail);
	  },

	  doneCommissionDetail: function doneCommissionDetail(res) {
	    if (res.status === true) {
	      commissionActions.commissionDetail.done(res);
	    } else {
	      commissionActions.commissionDetail.error(res.error);
	    }
	  },

	  onSaveCommission: function onSaveCommission(param) {
	    ajaxActions.request('/api/installment/commission-close/saveCommission', param, this.doneSaveCommission);
	  },

	  doneSaveCommission: function doneSaveCommission(res) {
	    if (res.status === true) {
	      commissionActions.saveCommission.done(res);
	    } else {
	      commissionActions.saveCommission.error(res.error);
	    }
	  },

	  onVoidCommission: function onVoidCommission(id) {
	    ajaxActions.request('/api/installment/commission-close/voidCommission', { id: id }, this.doneVoidCommission);
	  },

	  doneVoidCommission: function doneVoidCommission(res) {
	    if (res.status === true) {
	      commissionActions.voidCommission.done();
	    } else {
	      commissionActions.voidCommission.error(res.error);
	    }
	  },

	  onPaidCommission: function onPaidCommission(id) {
	    ajaxActions.request('/api/installment/commission-close/paidCommission', { id: id }, this.donePaidCommission);
	  },

	  donePaidCommission: function donePaidCommission(res) {
	    if (res.status === true) {
	      commissionActions.paidCommission.done();
	    } else {
	      commissionActions.paidCommission.error(res.error);
	    }
	  }

	});

	module.exports = commissionStore;

/***/ },

/***/ 835:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  commission: {}
	};

/***/ },

/***/ 836:
/***/ function(module, exports) {

	'use strict';

	var _commissionClose;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	module.exports = {
	  installment: {
	    "commission-close": (_commissionClose = {
	      title: {
	        index: 'ค่าคอมปิดสัญญา',
	        list: 'รายการสรุปค่าคอมปิดสัญญา',
	        detail: 'รายละเอียดการปิดสัญญา'
	      },
	      list: {
	        shop: 'สาขา',
	        display_name: 'ชื่อพนักงาน',
	        cost: 'ทุนรวม',
	        amount: 'ราคารวม',
	        profit: 'กำไรรวม',
	        contract_amount: 'จำนวนสัญญา'
	      },
	      sell_staff_name: 'พนักงานขาย',
	      sign_date: 'วันที่ขาย',
	      code: 'สัญญา',
	      cus_fullname: 'ลูกค้า',
	      sum_product_price: 'ขายสุทธิ',
	      sum_payment_price: 'ผ่อนร้าน',
	      sum_cost: 'ทุนขาย',
	      sum_fee: 'ค่าสัญญา',
	      sum_install_cost: 'ค่าติดตั้ง',
	      sum_profit: 'กำไร',
	      paid_status: 'จ่ายแล้ว?',
	      authorized_date: 'วันที่',
	      num_receipt: '#',
	      filter_shop: 'สาขา',
	      filter_term_year: ' ',
	      filter_term_month: ' ',
	      filter_staff: ' ',
	      total_profit: 'กำไรรวม',
	      profit_amount: 'กำไรรวม',
	      total_contract: 'จำนวนสัญญา',
	      paid_pct: '% จ่าย',
	      paid_amount: 'จำนวนเงินจ่าย',
	      term_year: 'งวดการจ่าย',
	      term_month: 'เดือน'
	    }, _defineProperty(_commissionClose, 'authorized_date', 'วันที่'), _defineProperty(_commissionClose, 'remark', 'บันทึกข้อความ'), _defineProperty(_commissionClose, 'payment_term', 'งวด'), _defineProperty(_commissionClose, 'closeca', 'หักค่าสัญญาหนีหนี้'), _defineProperty(_commissionClose, 'payment', {
	      summary_period: 'สรุป',
	      paid_period: 'จ่าย',
	      num_receipt: '#',
	      profit_amount: 'กำไรรวม',
	      paid_pct: '%',
	      paid_amount: 'จำนวนเงิน',
	      authorized_date: 'อนุมัติ',
	      remark: 'หมายเหตุ',
	      status: 'สถานะ',
	      status_READY: 'พร้อมจ่าย',
	      status_PAID: 'จ่ายแล้ว',
	      status_VOID: 'ยกเลิก',
	      other_paid: 'หัก/จ่ายอื่น ๆ'
	    }), _defineProperty(_commissionClose, 'contract', {
	      no: 'ที่',
	      close_date: 'ปิดวันที่',
	      code: 'เลขที่',
	      customer: 'ลูกค้า',
	      product: 'สินค้า',
	      total_paid: 'ยอดจ่าย',
	      cost: 'ทุนขาย',
	      fee: 'ค่าสัญญา',
	      install_cost: 'ค่าติดตั้ง',
	      profit: 'กำไร',
	      payment_month: '#งวด',
	      status: 'สถานะ',
	      commision_paid: 'จ่าย'
	    }), _defineProperty(_commissionClose, 'receipt', {
	      no: 'ที่',
	      contract_code: 'เลขที่สัญญา',
	      cus_name: 'ชื่อผู้เช่าซื้อ',
	      close_date: 'วันที่ปิด',
	      sell_date: 'วันที่ขาย',
	      pay_date: 'วันที่รับเงิน',
	      code: 'เลขที่',
	      shop_name: 'สาขา',
	      cost: 'ทุนประจำงวด',
	      amount: 'ยอดเงินรับ',
	      profit: 'กำไร',
	      finance_name: 'ชื่อไฟแนนซ์'
	    }), _commissionClose)
	  }
	};

/***/ },

/***/ 837:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var recontractActions = __webpack_require__(838);
	var recontractStore = __webpack_require__(839);

	var Recontract = {};

	tr.registerTranslations('en', __webpack_require__(840));
	tr.registerTranslations('th', __webpack_require__(841));

	Recontract = React.createClass({
	  displayName: 'Recontract',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('contract.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	//Recontract.List = require('./recontract-list.jsx');

	// Recontract.Routes = (
	//   <Route name="installment.recontract" path="recontract" handler={Recontract.Index}>
	//     <Router.DefaultRoute name="installment.recontract.list" path="list" handler={Recontract.List}/>
	//   </Route>
	// );

	module.exports = Recontract;

/***/ },

/***/ 838:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'listRecontract': { children: ['done', 'error'] },
	  'exportRecontract': { children: ['done', 'error'] },
	  'saveRecontract': { children: ['done', 'error'] }
	});

/***/ },

/***/ 839:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var contractActions = __webpack_require__(838);

	var contractStore = Reflux.createStore({
	  listenables: [contractActions],

	  // contractActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/installment/contract/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      contractActions.list.done(res.data, res.opt);
	      menuActions.updateCount('contract.sell', res.opt.totalRows);
	    } else {
	      contractActions.list.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/installment/contract/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      contractActions.export.done(res.file);
	    } else {
	      contractActions.export.error(res.error);
	    }
	  },
	  onGetBarcode: function onGetBarcode(param) {
	    ajaxActions.request('/api/installment/contract/listBarcode', param, this.doneGetBarcode);
	  },

	  doneGetBarcode: function doneGetBarcode(res) {
	    if (res.status === true) {
	      contractActions.getBarcode.done(res.data, res.opt);
	    } else {
	      contractActions.getBarcode.error(res.error);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/installment/contract/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      contractActions.getById.done({
	        contract: res.contract,
	        paymentTerm: res.paymentTerm,
	        refContract: res.refContract
	      });
	    } else {
	      contractActions.getById.error(res.msg);
	    }
	  },

	  onSaveNew: function onSaveNew(data) {
	    ajaxActions.request('/api/installment/contract/saveNew', data, this.doneSaveNew);
	  },

	  doneSaveNew: function doneSaveNew(res) {
	    if (res.status === true) {
	      contractActions.saveNew.done(res.data);
	      //      menuActions.updateCount('contract', res.totalRows);
	    } else {
	        contractActions.saveNew.error(res.error);
	      }
	  },

	  onDelete: function onDelete(id) {
	    ajaxActions.request('/api/installment/contract/delete', { id: id }, this.doneDelete);
	  },

	  doneDelete: function doneDelete(res) {
	    if (res.status === true) {
	      contractActions.delete.done(res.data);
	    } else {
	      contractActions.delete.error(res.msg);
	    }
	  },

	  onGetSellInfo: function onGetSellInfo(id) {
	    ajaxActions.request('/api/installment/contract/sellInfo', { id: id }, this.doneGetSellInfo);
	  },

	  doneGetSellInfo: function doneGetSellInfo(res) {
	    if (res.status === true) {
	      contractActions.getSellInfo.done(res.data);
	    } else {
	      contractActions.getSellInfo.error(res.error);
	    }
	  },

	  onSave: function onSave(data) {
	    ajaxActions.request('/api/installment/contract/save', data, this.doneSave);
	  },
	  doneSave: function doneSave(res) {
	    console.log(res.status);
	    if (res.status === true) {
	      contractActions.save.done(res.data);
	    } else {
	      contractActions.save.error(res.error);
	    }
	  },

	  // contractActions.Close
	  onListClose: function onListClose(param) {
	    ajaxActions.request('/api/installment/contract/listClose', param, this.doneListClose);
	  },

	  doneListClose: function doneListClose(res) {
	    if (res.status === true) {
	      contractActions.listClose.done(res.data, res.opt);
	      //menuActions.updateCount('contract.sell', res.opt.totalRows);
	    } else {
	        contractActions.listClose.error(res.error);
	      }
	  },

	  onExportClose: function onExportClose(param) {
	    ajaxActions.request('/api/installment/contract/exportClose', param, this.doneExportClose);
	  },

	  doneExportClose: function doneExportClose(res) {
	    if (res.status === true) {
	      contractActions.exportClose.done(res.file);
	    } else {
	      contractActions.exportClose.error(res.error);
	    }
	  },

	  onGetCloseReturn: function onGetCloseReturn(param) {
	    console.log('request');
	    ajaxActions.request('/api/installment/contract/getCloseReturn', param, this.doneGetCloseReturn);
	  },

	  doneGetCloseReturn: function doneGetCloseReturn(res) {
	    if (res.status === true) {
	      contractActions.getCloseReturn.done(res.data);
	    } else {
	      contractActions.getCloseReturn.error(res.error);
	    }
	  },

	  onSaveCollection: function onSaveCollection(param) {
	    ajaxActions.request('/api/installment/contract/saveCollection', param, this.doneSaveCollection);
	  },

	  doneSaveCollection: function doneSaveCollection(res) {
	    if (res.status === true) {
	      contractActions.saveCollection.done(res.data);
	    } else {
	      contractActions.saveCollection.error(res.error);
	    }
	  },

	  onGetListCollection: function onGetListCollection(id) {
	    ajaxActions.request('/api/installment/contract/getListCollection', { id: id }, this.doneGetListCollection);
	  },

	  doneGetListCollection: function doneGetListCollection(res) {
	    if (res.status === true) {
	      contractActions.getListCollection.done(res.data);
	    } else {
	      contractActions.getListCollection.error(res.error);
	    }
	  },

	  onGetMobileNumber: function onGetMobileNumber(param) {
	    //console.log('onPaymentOptionList');
	    ajaxActions.request('/api/installment/contract/getMobileNumber', param, this.doneGetMobileNumber);
	  },

	  doneGetMobileNumber: function doneGetMobileNumber(res) {
	    if (res.status === true) {
	      contractActions.getMobileNumber.done(res.data);
	    } else {
	      contractActions.getMobileNumber.error(res.error);
	    }
	  },

	  onPrintCollectionReport: function onPrintCollectionReport(res) {
	    ajaxActions.request('/api/installment/contract/printCollectionReport', res, this.donePrintCollectionReport);
	  },

	  donePrintCollectionReport: function donePrintCollectionReport(res) {
	    if (res.status === true) {
	      contractActions.printCollectionReport.done(res.data);
	    } else {
	      contractActions.printCollectionReport.error(res.error);
	    }
	  },

	  onExportDunning: function onExportDunning(param) {
	    ajaxActions.request('/api/installment/contract/exportDunning', param, this.doneExportDunning);
	  },

	  doneExportDunning: function doneExportDunning(res) {
	    if (res.status === true) {
	      contractActions.exportDunning.done(res.file);
	    } else {
	      contractActions.exportDunning.error(res.error);
	    }
	  },

	  onListClosediscount: function onListClosediscount(param) {
	    ajaxActions.request('/api/installment/contract/listClosediscount', param, this.doneListClosediscount);
	  },

	  doneListClosediscount: function doneListClosediscount(res) {
	    if (res.status === true) {
	      contractActions.listClosediscount.done(res.data, res.opt);
	      menuActions.updateCount('contract.sell', res.opt.totalRows);
	    } else {
	      contractActions.listClosediscount.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExportClosediscount: function onExportClosediscount(param) {
	    ajaxActions.request('/api/installment/contract/exportClosediscount', param, this.doneExportClosediscount);
	  },

	  doneExportClosediscount: function doneExportClosediscount(res) {
	    if (res.status === true) {
	      contractActions.exportClosediscount.done(res.file);
	    } else {
	      contractActions.exportClosediscount.error(res.error);
	    }
	  },

	  onSaveClosediscount: function onSaveClosediscount(id) {
	    console.log('request');
	    ajaxActions.request('/api/installment/contract/saveClosediscount', { id: id }, this.doneSaveClosediscount);
	  },

	  doneSaveClosediscount: function doneSaveClosediscount(res) {
	    if (res.status === true) {
	      contractActions.saveClosediscount.done(res);
	    } else {
	      contractActions.saveClosediscount.error(res.error);
	    }
	  },

	  onCloseCaStaffList: function onCloseCaStaffList(id) {
	    ajaxActions.request('/api/installment/contract/closeCaStaffList', { id: id }, this.doneCloseCaStaffList);
	  },

	  doneCloseCaStaffList: function doneCloseCaStaffList(res) {
	    if (res.status === true) {
	      contractActions.closeCaStaffList.done(res.data);
	    } else {
	      contractActions.closeCaStaffList.error(res.error);
	    }
	  },

	  onSaveCloseCa: function onSaveCloseCa(param) {
	    ajaxActions.request('/api/installment/contract/saveCloseCa', param, this.doneSaveCloseCa);
	  },

	  doneSaveCloseCa: function doneSaveCloseCa(res) {
	    if (res.status === true) {
	      contractActions.saveCloseCa.done(res);
	    } else {
	      contractActions.saveCloseCa.error(res.error);
	    }
	  },

	  onGetContractID: function onGetContractID(contract_code) {
	    //console.log('onPaymentOptionList');
	    ajaxActions.request('/api/installment/contract/getContractID', { code: contract_code }, this.doneGetContractID);
	  },

	  doneGetContractID: function doneGetContractID(res) {
	    if (res.status === true) {
	      contractActions.getContractID.done(res.data);
	    } else {
	      contractActions.getContractID.error(res.error);
	    }
	  },

	  onGetPersonCard: function onGetPersonCard(nationid) {
	    ajaxActions.request('/api/installment/contract/getPersonCard', { nationid: nationid }, this.doneGetPersonCard);
	  },

	  doneGetPersonCard: function doneGetPersonCard(res) {
	    if (res.status === true) {
	      contractActions.getPersonCard.done(res.data.person_card);
	    } else {
	      contractActions.getPersonCard.error(res.error);
	    }
	  },

	  onSaveRecontract: function onSaveRecontract(data) {
	    ajaxActions.request('/api/installment/contract/saveRecontract', data, this.doneSaveRecontract);
	  },

	  doneSaveRecontract: function doneSaveRecontract(res) {
	    if (res.status === true) {
	      contractActions.saveRecontract.done(res.data);
	    } else {
	      contractActions.saveRecontract.error(res.error);
	    }
	  },

	  onListRecontract: function onListRecontract(param) {
	    ajaxActions.request('/api/installment/contract/listRecontract', param, this.doneListRecontract);
	  },

	  doneListRecontract: function doneListRecontract(res) {
	    if (res.status === true) {
	      contractActions.listRecontract.done(res.data, res.opt);
	      menuActions.updateCount('contract.sell', res.opt.totalRows);
	    } else {
	      contractActions.listRecontract.error(res.error);
	    }
	  },

	  onExportRecontract: function onExportRecontract(param) {
	    ajaxActions.request('/api/installment/contract/exportRecontract', param, this.doneExportRecontract);
	  },

	  doneExportRecontract: function doneExportRecontract(res) {
	    if (res.status === true) {
	      contractActions.exportRecontract.done(res.file);
	    } else {
	      contractActions.exportRecontract.error(res.error);
	    }
	  }

	});

	module.exports = contractStore;

/***/ },

/***/ 840:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 841:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  installment: {
	    contract: {
	      current_status: {
	        NORMAL: 'ปกติ',
	        DEBT: 'ค้างชำระ',
	        CLOSE_CANCEL: 'ปิด/ยกเลิก',
	        CLOSE_NORMAL: 'ปิด/ปกติ',
	        CLOSE_RETURN: 'ปิด/คืนของ',
	        CLOSE_CONFISCATE: 'ปิด/ยึดคืน',
	        CLOSE_BAD_DEBT: 'ปิด/หนี้สูญ'
	      }
	    }
	  },
	  info: {
	    sell_date: 'วันที่ขาย',
	    receipt_no: 'ใบเสร็จ',
	    shop_name: 'สาขา',
	    contract_ref: 'เลขที่สัญญา',
	    company_name: 'ลูกค้า',
	    description: 'สินค้า',
	    serial: 'S/N',
	    price: 'ราคาขาย',
	    cost: 'ราคาทุน',
	    down_payment: 'ดาวน์',
	    remain_price: 'ยอดจัด',
	    finance_staff: 'พนักงานไฟแนนซ์',
	    sell_staff: 'พนักงานขาย',
	    flag: '*',
	    flag_hint: 'สดพิเศษ'
	  },
	  sell: {
	    sell_date: 'วันที่',
	    receipt_no: 'ใบเสร็จ',
	    description: 'ข้อมูลสินค้า',
	    serial: 'ซีเรียล',
	    sales_staff: 'พนักงานขาย',
	    finance_staff: 'พนักงานสินเชื่อ',
	    price: 'ราคาสินค้าทั้งหมด',
	    cost: 'ทุน',
	    main_price: 'ราคาสินค้าที่ผ่อน',
	    down_payment: 'ดาวน์',
	    fee: 'ค่าทำสัญญา',
	    install_cost: 'ค่าติดตั้ง',
	    remain_price: 'ยอดจัด'
	  },
	  contract: {
	    contract: 'สัญญา',
	    filter_shop: 'สาขา',
	    filter_current_status: 'สถานะ',
	    filter_selltype: 'สถานะขาย',
	    code: 'เลขที่',
	    sign_date: 'วันที่ทำ',
	    shop_code: 'รหัสสาขา',
	    shop_name: 'สาขา',
	    contract_status: 'สถานะ',
	    doc_send_to: 'จัดส่งเอกสารที่',
	    doc_send_to_HOME: 'บ้าน',
	    doc_send_to_WORK: 'ที่ทำงาน',
	    customer: 'ผู้เช่าซื้อ',
	    cus_mobile: 'เบอร์โทร',
	    co: 'ผู้เช่าซื้อร่วม',
	    coaddress_status: 'ที่อยู่',
	    cowork_status: 'การงาน',
	    product: 'สินค้า',
	    serial: 'S/N',
	    product_detail: 'รายละเอียดสินค้า',
	    address_status: 'ที่อยู่',
	    work_status: 'การงาน',
	    product_status: 'ข้อมูลสินค้า',
	    payment_status: 'งวดการชำระ',
	    payment_month: 'จำนวนงวด',
	    payment_on_day: 'ชำระทุกวันที่',
	    payment_price: 'ยอดจัด',
	    fee: 'ค่าทำสัญญา',
	    payment_per_month: 'ชำระเดือนละ',
	    total_paid: 'ชำระแล้ว',
	    payment_balance: 'คงเหลือ',
	    nationid: 'บัตรประชาชน',
	    pname: 'คำนำหน้า',
	    name: 'ชื่อ',
	    lname: 'นามสกุล',
	    nation_id: 'บัตรประชาชน',
	    birth: 'วันเกิด',
	    age: 'อายุ',
	    gender: 'เพศ',
	    marital_status: 'สถานภาพ',
	    over_day: 'เกินกำหนด',
	    finance: 'ไฟแนนซ์',
	    last_paid: 'ชำระล่าสุด',
	    amount_term: 'งวดค้าง',
	    return_date: 'วันที่ยึด',
	    discount: 'ส่วนลด',
	    address: {
	      copy_from: 'คัดลอกจาก',
	      card_address: 'ที่อยู่ตามบัตรประชาชน',
	      home_address: 'ที่อยู่ปัจจุบัน',
	      work_address: 'ที่อยู่ที่ทำงาน',
	      addr1: 'เลขที่/อาคาร/หมู่บ้าน',
	      addr2: 'ซอย/ถนน',
	      tambon: 'แขวง/ตำบล',
	      amphur: 'เขต/อำเภอ',
	      province: 'จังหวัด',
	      zipcode: 'รหัสไปรษณีย์',
	      tel: 'เบอร์อื่น ๆ',
	      fax: 'โทรสาร',
	      year: 'ปีที่อาศัย'
	    },
	    addr_type: 'สถานภาพที่อยู่',
	    addr_with: 'อาศัยอยู่กับ',
	    addr_person: 'จำนวนผู้อาศัยด้วย',
	    addr_month: 'เดือนที่อาศัย',
	    tel: 'โทรศัพท์',
	    mobile: 'มือถือ',
	    email: 'อีเมล',
	    co_relation: 'ความสัมพันธ์',
	    work_company: 'บริษัท/ห้างร้าน',
	    work_addr1: 'เลขที่/หมู่ที่/อาคาร/ชั้น',
	    work_addr2: 'ซอย/ถนน',
	    work_type: 'ประเภทธุรกิจ',
	    work_type_other: 'อื่น ๆ',
	    work_detail: 'ลักษณะงาน',
	    work_department: 'แผนก',
	    work_position: 'ตำแหน่ง',
	    work_time: 'เวลาที่สะดวก',
	    work_year: 'อายุงาน(ปี)',
	    work_salary: 'ฐานเงินเดือน',
	    work_income: 'รายได้อื่น ๆ',
	    work_income_source: 'แหล่งที่มารายได้อื่น ๆ',
	    work_prev_company: 'สถานที่ทำงานเดิม',
	    work_prev_addr: 'ที่ตั้ง',
	    work_prev_department: 'แผนก',
	    work_prev_tel: 'โทรศัพท์',
	    confirm_return_title: 'ยกเลิกและคืนเลขที่สัญญา',
	    title: {
	      index: 'สัญญาเช่าซื้อ'
	    },
	    action: {
	      new: 'เพิ่มสาขาใหม่'
	    },
	    person_info: 'ข้อมูลส่วนตัว',
	    work_info: 'สภานภาพการงาน',
	    card_info: 'บัตรประชาชน',
	    gen_payment: 'สร้างงวดชำระ',
	    payment: {
	      date: 'วันที่ชำระ',
	      amount: 'ยอดชำระ'
	    },
	    status: {
	      WAIT: 'รอจ่าย',
	      WAIT_PARTIAL: 'ชำระบางส่วน',
	      WAIT_PAID: 'ชำระแล้ว',
	      OVERDUE: 'เกินกำหนด',
	      OVERDUE_PARTIAL: 'เกิน, ชำระบางส่วน',
	      OVERDUE_PAID: 'เกิน, ชำระแล้ว'
	    },
	    current_status: {
	      ALL: 'ทุกสถานะ',
	      NORMAL: 'ปกติ',
	      DEBT: 'ค้างชำระ',
	      CLOSE_NORMAL: 'ปิดสัญญา ปกติ',
	      CLOSE_CANCEL: 'ปิดสัญญา ยกเลิก',
	      CLOSE_RETURN: 'ปิดสัญญา คืนของ',
	      CLOSE_CONFISCATE: 'ปิดสัญญา ยึดของคืน',
	      CLOSE_BAD_DEBT: 'ปิดสัญญา ตัดหนี้สูญ'
	    },

	    view: {
	      summary: 'ภาพรวม',
	      customer: 'ข้อมูลลูกค้า',
	      payment: 'งวดชำระ',
	      call: 'การติดตาม'
	    },
	    term: {
	      num: 'งวด',
	      due_date: 'กำหนดชำระ',
	      due_amount: 'ยอดชำระ',
	      paid_date: 'วันที่ชำระ',
	      paid_amount: 'ชำระแล้ว',
	      term_status: 'สถานะการชำระ',
	      ref_code: 'เลขที่ใบเสร็จอ้างอิง',
	      term_status_WAIT: 'รอชำระ',
	      term_status_WAIT_PARTIAL: 'ชำระบางส่วน',
	      term_status_WAIT_PAID: 'ชำระแล้ว',
	      term_status_OVERDUE: 'เกินกำหนด',
	      term_status_OVERDUE_PARTIAL: 'ชำระบางส่วน เกินกำหนด',
	      term_status_OVERDUE_PAID: 'ชำระแล้ว เกินกำหนด'
	    },
	    filter_type: 'ประเภทการคืน',
	    footer: {
	      special: '| * หมายถึง สดพิเศษ'
	    }
	  },
	  close_return: {
	    newcost: 'ราคาทุนใหม่',
	    oldcost: 'ราคาทุนเดิม',
	    paid: 'ชำระแล้ว',
	    balance: 'คงเหลือ',
	    contract_free: 'ค่าทำสัญญา',
	    install_free: 'ค่าติดตั้ง',
	    profit_loss: 'กำไรขาดทุน',
	    sell_id: 'เลขที่ขาย',
	    sign_date: 'วันที่ขาย',
	    product_serial: 'Serial No',
	    product_detial: 'สินค้า',
	    product_condition: 'สภาพสินค้า',
	    remark: 'หมายเหตุ',
	    return_date: 'วันที่ยึดสินค้า',
	    return_detail: {
	      num: 'ลำดับ',
	      product: 'สินค้า',
	      serial: 'Serial No',
	      newcost: 'ทุนใหม่',
	      oldcost: 'ทุนเดิม'
	    }
	  },
	  collection: {
	    call_date: 'วันที่โทรตาม',
	    call_number: 'เบอร์โทร',
	    call_remark: 'ข้อความ',
	    due_date: 'วันนัดชำระ',
	    call_type: 'ประเภทการโทร',
	    save: 'บันทึกตามหนี้',
	    print: 'พิมพ์เอกสาร',
	    print_file: 'เอกสาร',
	    send_print: 'ส่งถึง',
	    statusca: 'สถานะ',
	    saveca: 'บันทึกแจ้งหนีหนี้ CA',
	    call_name: 'ชื่อผู้ซื้อ/ชื่อผู้ค้ำ',
	    collection_list: {
	      num: 'ลำดับ',
	      call_date: 'วันที่โทรตาม',
	      due_date: 'วันนัดชำระ',
	      call_number: 'เบอร์โทร',
	      call_type: 'ประเภทการโทร',
	      call_remark: 'ข้อความ',
	      staff_name: 'พนักงาน'
	    }
	  },
	  closeca: {
	    contract_code: 'เลขที่สัญญา',
	    paid: 'ชำระแล้ว',
	    cost: 'ราคาทุน',
	    fee: 'ค่าทำสัญญา',
	    install_cost: 'ค่าติดตั้ง',
	    total_paid: 'ชำระแล้ว',
	    profit_lost: 'กำไรขาดทุน',
	    sell_id: 'เลขที่ขาย',
	    sign_date: 'วันที่ขาย',
	    closeca_effective: 'หัก/จ่าย เดือน',
	    closeca_date: 'วันที่ปิด CA',
	    product_serial: 'Serial No',
	    product_detail: 'สินค้า',
	    closeca_remark: 'หมายเหตุ',
	    nationid: 'เลขที่บัตรประชาชน',
	    cus_name: 'ชือลูกค้า',
	    over_day: 'จำนวนวันเกิน',
	    last_paid: 'วันที่จ่ายล่าสุด',
	    closeca_staffname: 'พนักงานผู้รับผิดชอบ',
	    closeca_staff_percent: 'หักพนักงาน(%)',
	    closeca_staff_amount: 'หักพนักงานเป็นเงิน',
	    closeca_percent: 'บริษัทรับผิดชอบ(%)',
	    closeca_amount: 'บริษัทรับผิดชอบเป็นเงิน',
	    saveca: 'ปิดสัญญาหนีหนี้CA'
	  }
	};

/***/ },

/***/ 842:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);
	var Reflux = __webpack_require__(337);
	var Link = Router.Link;

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var FlexButton = widgets.FlexButton;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexDropdown = widgets.FlexDropdown;

	var dialogActions = system.dialogActions;
	var systemActions = system.systemActions; //require('../../system/actions');
	var infoPanelActions = system.infoPanelActions;

	var actions = __webpack_require__(843);
	var customerStore = __webpack_require__(844);

	var Others = {};

	tr.registerTranslations('en', __webpack_require__(845));
	tr.registerTranslations('th', __webpack_require__(846));

	Others.Index = React.createClass({
	  displayName: 'Index',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('others.title.index'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	Others.List = React.createClass({
	  displayName: 'List',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [Reflux.listenTo(actions.getBranch.done, 'onGetBranchAction'), Reflux.listenTo(actions.pdfExport.done, 'onPDFExport')],
	  getInitialState: function getInitialState() {
	    var listMonth = [],
	        listYear = [],
	        listYearAll = [],
	        yearStart = 2557;
	    var THMonth = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

	    for (var i = 0; i < 12; i++) {
	      listMonth.push({ value: i + 1, text: THMonth[i] });
	    };

	    listYearAll.push({ value: 'ALL', text: 'ALL' });
	    for (var i = 0; i < 10; i++) {
	      listYear.push({ value: yearStart + i - 543, text: yearStart + i });
	      listYearAll.push({ value: yearStart + i - 543, text: yearStart + i });
	    };

	    var y = new Date().getFullYear(),
	        m = new Date().getMonth() + 1;
	    return {
	      report: null,
	      Parameter: React.createElement('div', null),
	      preview: '',
	      param: {
	        date_from: '2015/01/01',
	        date_to: '2015/12/01',
	        date: '2015/01/01',
	        branch: 'ALL',
	        month: m,
	        year: y,
	        year_all: y,
	        day: 0
	      },
	      branchItem: {
	        id: 'branch',
	        icon: 'user157',
	        label: 'others.param.branch',
	        list: []
	      },
	      monthItem: {
	        id: 'month',
	        icon: 'user157',
	        label: 'others.param.month',
	        list: listMonth
	      },
	      yearItem: {
	        id: 'year',
	        icon: 'user157',
	        label: 'others.param.year',
	        list: listYear
	      },
	      yearAllItem: {
	        id: 'year_all',
	        icon: 'user157',
	        label: 'others.param.year_all',
	        list: listYearAll
	      },
	      list: ['income_customer', 'income_customer_expect', 'summary', 'product_branch', 'debtor_ca_staff', 'debtor_ca', 'summary_installment', 'debtor_per_day', 'debtor_per_year', 'summary_debtor', 'summary_debtor_new', 'summary_ca', 'commission_expense', 'table_summary_ca', 'table_summary_r', 'report_commission_open', 'report_commission_close'],
	      class: {}
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    infoPanelActions.show('installment', null);
	    systemActions.setPageHeader('');
	    actions.getBranch();
	    this.onResetCSSReport();
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },
	  onResetCSSReport: function onResetCSSReport(name_active) {
	    for (var i = 0; i < this.state.list.length; i++) {
	      this.state.class[this.state.list[i]] = 'report-list';
	    }
	    if (name_active != undefined) this.state.class[name_active] = 'report-list report-active';
	    this.setState({ class: this.state.class });
	  },
	  onGetBranchAction: function onGetBranchAction(data) {

	    var list = data.branch.map(function (row) {

	      return { value: row.value, text: row.text };
	    });
	    this.state.branchItem.list = list;
	    this.setState({
	      branchItem: this.state.branchItem
	    });
	  },
	  onPDFExport: function onPDFExport(filename) {
	    window.open(filename);
	  },
	  handleChange: function handleChange(id, value) {
	    console.log(id, value);
	    this.state.param[id] = value;
	    this.setState({
	      param: this.state.param,
	      Parameter: this.createParameter(this.state.report)
	    });
	  },
	  createParameter: function createParameter(name) {
	    this.state.report = name || this.state.report || 'summary';

	    var report = {
	      income_customer: ['period_date', 'branch'],
	      income_customer_expect: ['period_date', 'branch'],
	      summary: ['period_date', 'branch'],
	      product_branch: ['period_date', 'branch'],
	      debtor_ca_staff: ['period_date'],
	      debtor_ca: ['period_date'],
	      summary_installment: ['year_all', 'branch'],
	      debtor_per_day: ['month', 'year', 'day'],
	      debtor_per_year: ['year'],
	      summary_debtor: ['month', 'year'],
	      summary_debtor_new: ['year'],
	      summary_ca: ['year'],
	      commission_expense: ['month', 'year'],
	      table_summary_ca: ['month', 'year'],
	      table_summary_r: ['month', 'year'],
	      report_commission_open: [],
	      report_commission_close: []
	    };

	    var field = {
	      date_from: { id: 'date_from', label: 'others.param.date_from', type: 'date' },
	      date_to: { id: 'date_to', label: 'others.param.date_to', type: 'date' },
	      date: { id: 'date', label: 'others.param.date', type: 'date' },
	      day: { id: 'day', label: 'others.param.day', type: 'text', pattern: '^[0-9]{1,2}$' }
	    };

	    var obj = React.createElement('div', { className: 'flex-form', style: { padding: '10px 10px' } });

	    var btn = React.createElement(
	      'div',
	      { style: { marginTop: 8 } },
	      React.createElement(FlexButton, {
	        icon: 'printer88', label: 'action.print', 'default': true,
	        field: this.state.btn_print,
	        onClick: this.doSubmit })
	    );

	    // if(obj.props == undefined) obj.props = { children: [] };
	    // if(obj.props.children == undefined) obj.props.children = [];
	    // obj.props.children.push(btn);

	    for (var i = 0; i < report[this.state.report].length; i++) {
	      var param = null;
	      switch (report[this.state.report][i]) {
	        case 'branch':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexDropdown, { field: this.state.branchItem, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	        case 'day':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexTextInput, { field: field.day, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	        case 'month':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexDropdown, { field: this.state.monthItem, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	        case 'year':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexDropdown, { field: this.state.yearItem, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	        case 'year_all':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexDropdown, { field: this.state.yearAllItem, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	        case 'period_date':
	          param = React.createElement(
	            'div',
	            null,
	            React.createElement(
	              'div',
	              { style: { marginTop: 8 } },
	              React.createElement(FlexTextInput, { field: field.date_from, data: this.state.param, onChange: this.handleChange })
	            ),
	            React.createElement(
	              'div',
	              { style: { marginTop: 8 } },
	              React.createElement(FlexTextInput, { field: field.date_to, data: this.state.param, onChange: this.handleChange })
	            )
	          );
	          break;
	        case 'date':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexTextInput, { field: field.date, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	      }
	      // if(param != null) {
	      //   // Hack React. //
	      //   obj.props.children.push(param);
	      //   // Hack React. //
	      // }
	    }

	    return obj;
	  },

	  doPrint: function doPrint(name, label) {
	    this.state.preview = '/img/reports/' + name + '.jpg';
	    this.setState({ Parameter: this.createParameter(name), preview: this.state.preview });
	    this.onResetCSSReport(name);
	  },

	  doRedirect: function doRedirect(link) {
	    //console.log('this.context=',this.context.router);
	    this.context.router.transitionTo(link);
	  },

	  doSubmit: function doSubmit() {
	    var getState = this.state;
	    getState.param.display_name = system.sessionStore.getSession().staff.display_name;

	    actions.pdfExport(getState.report, getState.param);
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'box12 flex' },
	        React.createElement(
	          'div',
	          { className: 'box5' },
	          React.createElement(T, { content: 'others.header.summary', component: 'h2' }),
	          React.createElement(
	            Link,
	            { to: '/installment/others/income_customer', activeClassName: 'report-active', className: 'report-list' },
	            React.createElement('span', { className: 'flaticon-google122 normal icon' }),
	            tr.translate("others.name.income_customer")
	          ),
	          React.createElement(T, { content: 'others.name.income_customer', component: 'div', className: this.state.class.income_customer,
	            onClick: function (e) {
	              this.doPrint('income_customer', 'others.name.income_customer');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.income_customer_expect', component: 'div', className: this.state.class.income_customer_expect,
	            onClick: function (e) {
	              this.doPrint('income_customer_expect', 'others.name.income_customer_expect');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.summary', component: 'div', className: this.state.class.summary,
	            onClick: function (e) {
	              this.doPrint('summary', 'others.name.summary');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.product_branch', component: 'div', className: this.state.class.product_branch,
	            onClick: function (e) {
	              this.doPrint('product_branch', 'others.name.product_branch');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.debtor_ca_staff', component: 'div', className: this.state.class.debtor_ca_staff,
	            onClick: function (e) {
	              this.doPrint('debtor_ca_staff', 'others.name.debtor_ca_staff');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.debtor_ca', component: 'div', className: this.state.class.debtor_ca,
	            onClick: function (e) {
	              this.doPrint('debtor_ca', 'others.name.debtor_ca');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.summary_installment', component: 'div', className: this.state.class.summary_installment,
	            onClick: function (e) {
	              this.doPrint('summary_installment', 'others.name.summary_installment');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.debtor_per_day', component: 'div', className: this.state.class.debtor_per_day,
	            onClick: function (e) {
	              this.doPrint('debtor_per_day', 'others.name.debtor_per_day');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.debtor_per_year', component: 'div', className: this.state.class.debtor_per_year,
	            onClick: function (e) {
	              this.doPrint('debtor_per_year', 'others.name.debtor_per_year');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.summary_debtor', component: 'div', className: this.state.class.summary_debtor,
	            onClick: function (e) {
	              this.doPrint('summary_debtor', 'others.name.summary_debtor');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.summary_ca', component: 'div', className: this.state.class.summary_ca,
	            onClick: function (e) {
	              this.doPrint('summary_ca', 'others.name.summary_ca');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.table_summary_ca', component: 'div', className: this.state.class.table_summary_ca,
	            onClick: function (e) {
	              this.doPrint('table_summary_ca', 'others.name.table_summary_ca');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.table_summary_r', component: 'div', className: this.state.class.table_summary_r,
	            onClick: function (e) {
	              this.doPrint('table_summary_r', 'others.name.table_summary_r');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.report_commission_open', component: 'div', className: this.state.class.report_commission_open,
	            onClick: function (e) {
	              this.doRedirect('installment.report-commission-open');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.report_commission_close', component: 'div', className: this.state.class.report_commission_close,
	            onClick: function (e) {
	              this.doRedirect('installment.report-commission-close');
	            }.bind(this) })
	        ),
	        React.createElement(
	          'div',
	          { className: 'box3' },
	          React.createElement(T, { content: 'others.header.parameter', component: 'h2' }),
	          this.state.Parameter
	        ),
	        React.createElement(
	          'div',
	          { className: 'box5' },
	          React.createElement(T, { content: 'others.header.preview', component: 'h2' }),
	          React.createElement('img', { src: this.state.preview, width: '500' })
	        )
	      )
	    );
	  }

	});

	// Others.Routes = (
	//   <Route name="installment.others.others" path="others" handler={Others.Index}>
	//     <Router.DefaultRoute name="installment.others.list" handler={Others.List}/>
	//   </Route>
	// );

	module.exports = Others;

	// <T content={'others.name.commission_expense'} component="div" className={this.state.class.commission_expense}
	//  onClick={function(e) { this.doPrint('commission_expense', 'others.name.commission_expense'); }.bind(this) }/>

/***/ },

/***/ 843:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'getBranch': { children: ['done', 'error'] },
	  'pdfExport': { children: ['done', 'error'] },
	  'plExport': { children: ['done', 'error'] }
	});

/***/ },

/***/ 844:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);
	var toasterActions = system.toasterActions;
	var ajaxActions = system.ajaxActions; // require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var customerActions = __webpack_require__(843);

	var customerStore = Reflux.createStore({
	  listenables: [customerActions],

	  onGetBranch: function onGetBranch() {
	    ajaxActions.request('/api/report/getBranch', {}, this.doneGetBranch);
	  },
	  doneGetBranch: function doneGetBranch(res) {
	    if (res.status === true) {
	      customerActions.getBranch.done(res.data);
	    } else {
	      customerActions.getBranch.error(res.msg);
	    }
	  },

	  onPdfExport: function onPdfExport(name, param) {
	    param.report_name = name;
	    ajaxActions.request('/api/report/export', { data: param }, this.donePdfExport);
	  },
	  donePdfExport: function donePdfExport(res) {
	    if (res.status === true) {
	      customerActions.pdfExport.done(res.data.exports);
	    } else {
	      toasterActions.pop({
	        type: 'success',
	        message: 'ไม่พบข้อมูลที่อยู่ในช่วงเวลาที่ระบุ'
	      });
	      customerActions.pdfExport.error(res.msg);
	    }
	  },

	  onPlExport: function onPlExport(name, param) {
	    param.report_name = name;
	    ajaxActions.request('/api/report/exportProfitLoss', { data: param }, this.donePlExport);
	  },

	  donePlExport: function donePlExport(res) {
	    if (res.status === true) {
	      customerActions.plExport.done(res.data.exports);
	    } else {
	      toasterActions.pop({
	        type: 'success',
	        message: 'ไม่พบข้อมูลที่อยู่ในช่วงเวลาที่ระบุ'
	      });
	      customerActions.plExport.error(res.msg);
	    }
	  }

	});

	module.exports = customerStore;

/***/ },

/***/ 845:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  department: {}
	};

/***/ },

/***/ 846:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  others: {
	    title: {
	      index: 'รายงานอื่นๆ'
	    },
	    header: {
	      summary: 'รายงานสรุป',
	      parameter: 'ตัวกรองข้อมูล',
	      preview: 'ตัวอย่างรายงาน'
	    },
	    name: {
	      summary: 'สรุปรายการกำไร-ขาดทุน จากการเปลี่ยนทุนสินค้ายึด',
	      product_branch: 'รายงานเสนอปรับทุนยึดสินค้า',
	      debtor_ca_staff: 'รายการหักเงินลูกค้าหนีตามไม่ได้ตามพนักงาน',
	      debtor_ca: 'รายการหักเงินลูกค้าหนีตามไม่ได้',
	      summary_installment: 'สรุปมูลค่าและต้นทุนผ่อนคงเหลือ',
	      income_customer: 'สรุปรายรับลูกค้าผ่อนร้าน',
	      income_customer_expect: 'สรุปกำไรผ่อนร้านที่คาดว่าจะได้รับ',
	      summary_debtor: 'มูลค่าลูกหนี้คงเหลือ',
	      summary_debtor_new: 'รายงานสรุปยอดลูกหนี้ผ่อนใหม่ประจำปี',
	      debtor_per_day: 'รายงาน % ลูกหนี้เกินกำหนด',
	      debtor_per_year: 'รายงาน % ลูกหนี้เกินกำหนดชำระรายปี',
	      summary_ca: 'สรุปการปิดบัญชี,ตัวยึด,ลุกหนี้หนี คิดเป็นเปอร์เซนต์',
	      commission_expense: 'รายการจ่ายค่าคอมมิสชั่น',
	      table_summary_ca: 'รายงานสรุปลูกหนี้ปิดบัญชี,ยึด,CA',
	      table_summary_r: 'รายงานสรุปลูกค้ายึด ตามจำนวนที่เดือนที่ยึด',
	      report_commission_open: 'รายงานค่าคอมเปิด',
	      report_commission_close: 'รายงานค่าคอมปิด'
	    },
	    param: {
	      date_from: 'วันที่',
	      date_to: 'ถึงวันที่',
	      date: 'วันที่',
	      branch: 'สาขา',
	      month: 'เดือน',
	      year: 'ปี',
	      year_all: 'รายการขายประจำปี',
	      day: 'จำนวนวัน'
	    }
	  }
	};

/***/ },

/***/ 847:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var receiptStore = __webpack_require__(848);
	var Commission = {};

	var system = __webpack_require__(356);
	var systemActions = system.systemActions;

	tr.registerTranslations('en', __webpack_require__(850));
	tr.registerTranslations('th', __webpack_require__(851));

	Commission = React.createClass({
	  displayName: 'Commission',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('report.commission.searchopen'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	// Commission.List = require('./commission-open-list.jsx');

	// Commission.Routes = (
	//   <Route name="installment.report-commission-open" path="report-commission-open" handler={Commission.Index}>
	//      <Router.DefaultRoute name="installment.report-commission-open.list" path="list" handler={Commission.List}/>
	//   </Route>
	// );

	module.exports = Commission;

/***/ },

/***/ 848:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions; // require('../../../actions/ajax');
	var ajaxStore = system.ajaxStore; // require('../../../stores/ajax');
	var menuActions = system.menuActions; // require('../../../actions/menu');
	var Reflux = __webpack_require__(337);
	var commissionActions = __webpack_require__(849);

	var commissionStore = Reflux.createStore({
	  listenables: [commissionActions],

	  // commissionActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/report/listopen', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      commissionActions.list.done(res.data, res.opt);
	    } else {
	      commissionActions.list.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExportopen: function onExportopen(param) {
	    ajaxActions.request('/api/report/exportopen', param, this.doneExportopen);
	  },

	  doneExportopen: function doneExportopen(res) {
	    if (res.status === true) {
	      commissionActions.exportopen.done(res.file);
	    } else {
	      commissionActions.exportopen.error(res.error);
	    }
	  }

	});

	module.exports = commissionStore;

/***/ },

/***/ 849:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'exportopen': { children: ['done', 'error'] }
	});

/***/ },

/***/ 850:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  staff: {
	    user: 'Username',
	    pass: 'Password',
	    display_name: 'Display Name',
	    last_login: 'Last Login',
	    last_ip: 'Last IP'
	  }
	};

/***/ },

/***/ 851:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  commision: {
	    search: 'รายงานสรุปค่าคอมเปิด',
	    contract_code: 'เลขที่สัญญา',
	    shop_name: 'สาขา',
	    sell_staff: 'พนักงานขาย',
	    product_detail: 'สินค้า',
	    product_serial: 'serial',
	    cost: 'ทุนพนักงาน',
	    install_cost: 'ค่าติดตั้ง',
	    fee: 'ค่าทำสัญญา',
	    total_price: 'ราคาขาย',
	    profit: 'กำไร',
	    paid_period: 'เดือนที่จ่าย',
	    cus_name: 'ผู้เช่าซื้อ',
	    sign_date: 'วันที่ขาย'
	  }
	};

/***/ },

/***/ 852:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var receiptStore = __webpack_require__(853);
	var Commission = {};

	var system = __webpack_require__(356);
	var systemActions = system.systemActions;

	tr.registerTranslations('en', __webpack_require__(855));
	tr.registerTranslations('th', __webpack_require__(856));

	Commission = React.createClass({
	  displayName: 'Commission',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('report.commission.search'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	//Commission.List = require('./commission-close-list.jsx');

	// Commission.Routes = (
	//   <Route name="installment.report-commission-close" path="report-commission-close" handler={Commission.Index}>
	//      <Router.DefaultRoute name="installment.report-commission-close.list" path="list" handler={Commission.List}/>
	//   </Route>
	// );

	module.exports = Commission;

/***/ },

/***/ 853:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions; // require('../../../actions/ajax');
	var ajaxStore = system.ajaxStore; // require('../../../stores/ajax');
	var menuActions = system.menuActions; // require('../../../actions/menu');
	var Reflux = __webpack_require__(337);
	var commissionActions = __webpack_require__(854);

	var commissionStore = Reflux.createStore({
	  listenables: [commissionActions],

	  // commissionActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/report/listclose', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      commissionActions.list.done(res.data, res.opt);
	      // console.log('total=',res.opt.totalRows);
	      // menuActions.updateCount('report.sell', res.opt.totalRows);
	    } else {
	        commissionActions.list.error(res.error);
	      }
	  },
	  // contractActions.list
	  onExportclose: function onExportclose(param) {
	    console.log('request');
	    ajaxActions.request('/api/report/exportclose', param, this.doneExportclose);
	  },

	  doneExportclose: function doneExportclose(res) {
	    if (res.status === true) {
	      commissionActions.exportclose.done(res.file);
	    } else {
	      commissionActions.exportclose.error(res.error);
	    }
	  }

	});

	module.exports = commissionStore;

/***/ },

/***/ 854:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'exportclose': { children: ['done', 'error'] }
	});

/***/ },

/***/ 855:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  staff: {
	    user: 'Username',
	    pass: 'Password',
	    display_name: 'Display Name',
	    last_login: 'Last Login',
	    last_ip: 'Last IP'
	  }
	};

/***/ },

/***/ 856:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  commision: {
	    search: 'รายงานสรุปค่าคอมปิด',
	    shop_name: 'สาขา',
	    receipt_code: 'เลขที่ใบเสร็จ',
	    staff_name: 'ไฟแนนซ์',
	    pay_date: 'วันที่ทำรายการ',
	    cost_term: 'ทุนประจำงวด',
	    amount: 'ยอดเงินรับ',
	    profit: 'กำไร',
	    paid_period: 'เดือนที่จ่าย'
	  }
	};

/***/ },

/***/ 857:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  installment: {
	    menu: {
	      dashboard: 'Dashboard',
	      staff: 'Staffs',
	      permission: 'Permissions',
	      branch: 'Branch'
	    }
	  }
	};

/***/ },

/***/ 858:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  installment: {
	    title: {
	      index: 'ภาพรวม'
	    },
	    menu: {
	      dashboard: 'ภาพรวม',
	      inspection: 'ตรวจสอบประวัติ',
	      contractPending: 'เปิดสัญญาใหม่',
	      contractList: 'สัญญาทั้งหมด',
	      contractClose: 'ปิดสัญญายึด/คืน',
	      contractCloseDiscount: 'ปิดสัญญาส่วนลด',
	      commissionOpenList: 'ค่าคอมเปิดสัญญา',
	      commissionCloseList: 'ค่าคอมปิดสัญญา',
	      contractDunning: 'ติดตามหนี้',
	      contractRedeem: 'เปิดสัญญาไถ่ถอน',
	      barcodeGenerator: 'เพิ่มเลขที่สัญญา',
	      barcodePrint: 'พิมพ์เลขที่สัญญา',
	      recontract: 'เลือกเลขสัญญาผิด',
	      change: 'เปลี่ยนสินค้า',
	      others: 'รายงาน'
	    },
	    change: {
	      search: 'ค้นหาสัญญาเปลี่ยนของ'
	    }
	  }
	};

/***/ }

});