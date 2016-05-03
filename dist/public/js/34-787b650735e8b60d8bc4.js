webpackJsonp([34,135],{

/***/ 655:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var tr = __webpack_require__(207);
	var T = __webpack_require__(381);
	var helper = __webpack_require__(361);

	tr.registerTranslations('en', __webpack_require__(650));
	tr.registerTranslations('th', __webpack_require__(651));

	var store = __webpack_require__(653);
	var actions = __webpack_require__(654);
	var Reflux = __webpack_require__(335);

	var List = React.createClass({
	  displayName: 'List',

	  mixins: [Reflux.listenTo(actions.getList.done, 'doneGetList')],

	  getInitialState: function getInitialState() {
	    var id_card = this.props.params.member;
	    actions.getList({ id_card: id_card });
	    return {
	      data: { list: [] }
	    };
	  },

	  doneGetList: function doneGetList(res) {
	    if (res.status) {
	      this.setState({ data: res });
	    } else {
	      this.props.history.pushState(null, '/');
	    }
	  },

	  render: function render() {
	    var style_money = {
	      textAlign: 'right'
	    };
	    var PointList = this.state.data.list.map(function (item) {
	      return React.createElement(
	        'tr',
	        null,
	        React.createElement(
	          'td',
	          null,
	          item.desc_
	        ),
	        React.createElement(
	          'td',
	          { style: style_money },
	          item.point
	        ),
	        React.createElement(
	          'td',
	          { style: style_money },
	          item.balance
	        )
	      );
	    });

	    if (this.state.data.list.length == 0) PointList = React.createElement(
	      'tr',
	      null,
	      React.createElement(
	        'td',
	        { colSpan: '3', style: { textAlign: 'center' } },
	        'No transaction'
	      )
	    );

	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'ui stackable three column grid' },
	        React.createElement(
	          'div',
	          { className: 'column' },
	          React.createElement(
	            'b',
	            null,
	            'Code:'
	          ),
	          ' ',
	          this.state.data.member_code
	        ),
	        React.createElement(
	          'div',
	          { className: 'column', style: { width: '480px' } },
	          React.createElement(
	            'b',
	            null,
	            'Name:'
	          ),
	          ' ',
	          this.state.data.member_name
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'ui stackable three column grid' },
	        React.createElement(
	          'div',
	          { className: 'column' },
	          React.createElement(
	            'b',
	            null,
	            'Points:'
	          ),
	          ' ',
	          this.state.data.point
	        ),
	        React.createElement(
	          'div',
	          { className: 'column' },
	          React.createElement(
	            'b',
	            null,
	            'First Expire Date:'
	          ),
	          ' ',
	          this.state.data.expire
	        ),
	        React.createElement(
	          'div',
	          { className: 'column' },
	          React.createElement(
	            'b',
	            null,
	            'Expire Points:'
	          ),
	          ' ',
	          this.state.data.expire_point
	        )
	      ),
	      React.createElement(
	        'table',
	        { className: 'ui single line table' },
	        React.createElement(
	          'thead',
	          null,
	          React.createElement(
	            'tr',
	            null,
	            React.createElement(
	              'th',
	              null,
	              'Description'
	            ),
	            React.createElement(
	              'th',
	              { width: '100', style: style_money },
	              'Points'
	            ),
	            React.createElement(
	              'th',
	              { width: '100', style: style_money },
	              'Balance'
	            )
	          )
	        ),
	        React.createElement(
	          'tbody',
	          null,
	          PointList
	        )
	      )
	    );
	  }
	});

	module.exports = List;

/***/ }

});