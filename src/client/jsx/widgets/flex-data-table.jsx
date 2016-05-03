var React       = require('react');
// var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Reflux      = require('reflux');
var T           = require('react-translate-component');
var moment      = require('moment');
var DatePicker  = require('react-datepicker');

var FlexIcon = require('./flex-icon.jsx');

var FlexDataTable = React.createClass({
//  mixins: [PureRenderMixin],
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   if (nextProps==this.props) {
  //     return false;
  //   }
  //   if (nextProps && nextProps.data && nextProps.data.length == this.props.data.length) {
  //     if(JSON.stringify(nextProps.data)==JSON.stringify(this.props.data)) {
  //       return false;
  //     }
  //   }
  //   return true;
  // },

  getInitialState: function() {
    return {
      displayRows: this.props.displayRows || 10,
      lov:{},
      row_i:-1,
      field_id:''
    }
  },

  handleChange: function(name, value) {
    this.state.inputData[name] = value;
    if (typeof this.props.onInputChange==='function') {
      this.props.onInputChange(this.props.data);
    }
    this.setState({
      inputData:this.state.inputData
    });
//    console.log(this.state.inputData);
  },

  handleKeyEnter: function(field, e) {
    if (e.keyCode==13) {
      var ok = true;
      if (typeof field.onEnter === 'function') {
        e.stopPropagation();
        var ok = field.onEnter.bind(this)(this.state.inputData);
        if (ok) {
          this.setState({
            inputData: this.state.inputData
          });
        }
      }

      if (ok) {
        // find next tab index
        var ref = null;
        var tabIndex = field.tabIndex;
//        console.log('tabIndex=', tabIndex);
        var len = this.props.fields.length;
        for (var i = 0; i < len; i++) {
          if (this.props.fields[i].name==field.name) {
            continue;
          }
          var index = parseInt(this.props.fields[i].tabIndex);
          if (isNaN(index) || index <= tabIndex) {
            continue;
          }
          // found
//          console.log('index=', index);
          if (this.refs[this.props.fields[i].name]) {
            ref = this.refs[this.props.fields[i].name];
            break;
          }
        }
        if (ref==null) {
          // goto save
          ref = this.refs._save;
        }
//        console.log(ref.getDOMNode());
        ref.getDOMNode().focus();
        e.stopPropagation();
      }
    }
  },

  removeRow: function(i, e) {
    e.preventDefault();
    if (typeof this.props.onRemove==='function') {
      this.props.onRemove(i);
    }
  },

  doSave: function(e) {
    e.preventDefault();
    e.stopPropagation();

    if (typeof this.props.onSave === 'function') {
      if (this.props.onSave(this.state.inputData)) {
        // save ok
        this.doClear(e);
      } else {
        // save error
      }
    }
  },

  doClear: function(e) {
    e.preventDefault();
    this.setState({
      inputData:{setup:false}
    });
    for (var i = 0; i < this.props.fields.length; i++) {
      if (this.props.fields[i].tabIndex) {
        if (this.refs[this.props.fields[i].name]) {
          this.refs[this.props.fields[i].name].getDOMNode().focus();
          break;
        }
      }
    }
  },

  handleDoubleClick: function(row_i, field_id) {
    if (typeof this.props.canEdit==='function' && this.props.canEdit(row_i, field_id)) {
      this.setState({
        row_i: row_i,
        field_id: field_id
      }, function() {
        if (this.refs.editText) {
          this.refs.editText.getDOMNode().focus();
        }
      });
    }
  },

  handleBlur: function(id) {
    this.setState({
      row_i: -1,
      field_id: ''
    });
  },

  render: function() {
    var colgroup = this.props.fields.map(function(field) {
      var style = {};
      if (field.width) {
        style.width = field.width;
      }
      return (
        <col key={field.name} style={style}></col>
      );
    });
    if (this.props.actions) {
      colgroup.push(<col key="actions" style={{width:(28*this.props.actions.length+8)+'px'}}></col>);
    }

    var th = this.props.fields.map(function(field) {
      var style = {};
      if (field.width) {
        style.width=field.width+'px';
      }
      return (
        <th key={field.name} style={style} className="ellipsis">
          {field.raw ? field.label : (<T content={field.label}/>) }
        </th>
      )
    });
    if (this.props.actions) {
      th.push(<th key="actions">&nbsp;</th>);
    }

    var rows = this.props.data.map(function(row, row_i) {
      var td = this.props.fields.map(function(field) {
        var text = null;
        if (row_i==this.state.row_i && field.name==this.state.field_id) {
          if (field.type==='date') {
            text = (
              <DatePicker
                dateFormat="DD/MM/YYYY"
                selected={moment(row[field.name])}
                onChange={function(date) {
                  if (typeof this.props.onChange==='function') {
                    this.props.onChange(row_i, field.name, date.format('YYYY-MM-DD'));
                  }
                }.bind(this)}
                onBlur={this.handleBlur}
                style={{width:'100%'}}
                />
            )
          } else {
            text = (
              <input
                ref="editText"
                type={field.type}
                value={this.props.data[row_i][field.name]}
                style={{width:'100%'}}
                onChange={function(e) {
                  if (typeof this.props.onChange==='function') {
                    this.props.onChange(row_i, field.name, e.target.value);
                  }
                }.bind(this)}
                onBlur={this.handleBlur}
                />
            );
          }
        } else {
          if (typeof field.render==='function') {
            text = field.render(row, row_i);
          } else {
            text = row[field.name];
          }
        }
        return (
          <td key={field.name}
            onDoubleClick={field.readonly ? null :
              function() {this.handleDoubleClick(row_i, field.name)}.bind(this)}
            className={field.className}
            >{text}</td>
        );
      }.bind(this));

      if (this.props.actions) {
        var actionList = [];
        if (this.props.actions) {
          actionList = this.props.actions.map(function(action) {
            return (
              <a
                href="#"
                className={'flaticon-'+(action.icon || '')}
                onClick={function(e) {
                  e.preventDefault();
                  if (typeof this.props.handleAction==='function') {
                    this.props.handleAction(action.id, row_i, row);
                  }
                }.bind(this)}
                title={action.title || ''}
                ></a>
            );
          });
        }
        td.push(
          <td key="actions" className="flex">{actionList}</td>
        )
      }
      return (
        <tr key={this.props.key ? row[this.props.key] : row_i}>
          {td}
        </tr>
      );
    }.bind(this));

    var numRows = this.props.displayRows || 10;

    return (
      <div className="flex-data-table">
        <div className="header">
          <table>
            <colgroup>
              {colgroup}
            </colgroup>
            <thead>
              <tr>
                {th}
              </tr>
            </thead>
          </table>
        </div>
        <div className="body" style={{height:(32*numRows)+'px'}}>
          <table>
            <colgroup>
              {colgroup}
            </colgroup>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
        <div className="footer">
          <table>
            <colgroup>
              {colgroup}
            </colgroup>
            <tfoot>
              {this.props.footer}
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

});

module.exports = FlexDataTable;
