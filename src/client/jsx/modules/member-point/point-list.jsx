var React         = require('react');
var Router        = require('react-router');
var tr            = require('counterpart');
var T             = require('react-translate-component');
var helper        = require('../../../../server/lib/helper');

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var store = require('./store');
var actions = require('./actions');
var Reflux = require('reflux');

var List = React.createClass({
  mixins:[
    Reflux.listenTo(actions.getList.done, 'doneGetList')
  ],

  getInitialState:function() {
    var id_card = this.props.params.member;
    actions.getList({ id_card: id_card });
    return {
      data:{ list:[] }
    };
  },

  doneGetList: function(res){
    if(res.status) {
      this.setState({ data: res });
    } else {
      this.props.history.pushState(null, '/');
    }
  },

  render: function() {
    const style_money = {
      textAlign: 'right'
    }
    var PointList = this.state.data.list.map(function(item){
      return (
        <tr>
          <td>{item.desc_}</td>
          <td style={style_money}>{item.point}</td>
          <td style={style_money}>{item.balance}</td>
        </tr>
      )
    });

    if(this.state.data.list.length == 0) PointList = (<tr><td colSpan="3" style={{ textAlign:'center' }}>No transaction</td></tr>)

    return (
      <div>
        <div className="ui stackable three column grid">
          <div className="column"><b>Code:</b> {this.state.data.member_code}</div>
          <div className="column" style={{width:'480px'}}><b>Name:</b> {this.state.data.member_name}</div>
        </div>
        <div className="ui stackable three column grid">
          <div className="column"><b>Points:</b> {this.state.data.point}</div>
          <div className="column"><b>First Expire Date:</b> {this.state.data.expire}</div>
          <div className="column"><b>Expire Points:</b> {this.state.data.expire_point}</div>
        </div>
        <table className="ui single line table">
          <thead>
            <tr>
              <th>Description</th>
              <th width="100" style={style_money}>Points</th>
              <th width="100" style={style_money}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {PointList}
          </tbody>
        </table>

      </div>
    );
  }
});

module.exports = List;
