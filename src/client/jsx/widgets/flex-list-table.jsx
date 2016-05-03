var React   = require('react');
var Reflux  = require('reflux');
var T       = require('react-translate-component');
var helper  = require('ss-system').helper;
var FlexIcon = require('./flex-icon.jsx');
var DatePicker = require('react-datepicker');

var FlexListTable = React.createClass({

  getInitialState: function() {
    return {
      data: this.props.data || [],
      displayRows: this.props.displayRows || 10,
      lov:{},
      inputData: {
      }
    }
  },

  handleChange: function(name, value) {
    this.state.inputData[name] = value;
    if (typeof this.props.onInputChange==='function') {
      this.props.onInputChange(this.state.data);
    }
    this.setState({
      inputData:this.state.inputData
    });
//    console.log(this.state.inputData);
  },

  handleKeyEnter: function(field, e) {
    //console.log('jack');
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

  editRow: function(i, e) {
    e.preventDefault();
    var data = JSON.parse(JSON.stringify(this.props.data[i]));
    data._row = i;
    this.setState({
      inputData: data
    });
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

  // shouldComponentUpdate: function(nextProps, nextState) {
  //   if (nextProps.data==this.props.nextState){
  //     return false;
  //   }
  //   if (JSON.stringify(nextProps.data)===JSON.stringify(this.props.data)) {
  //     return false;
  //   }
  //   return true;
  // },

  render: function() {
    var colgroup = this.props.fields.map(function(field) {
      var style = {};
      if (field.width) {
        style.width=field.width;
      }
      return (
        <col key={field.name} style={style}></col>
      );
    });
//    colgroup.push(<col key="actions" style={{width:(28*2+8)+'px'}}></col>);

    var th = this.props.fields.map(function(field) {
      var style = {};
      if (field.width) {
        style.width=field.width+'px';
      }
      return (
        <th key={field.name} style={style}>
          <T content={field.label}/>
        </th>
      )
    });
//    th.push(<th key="actions">&nbsp;</th>);

    // var inputRow = this.props.fields.map(function(field) {
    //   var input = null;
    //   if (field.type==='checkbox') {
    //     input = (
    //       <span className="checkbox">
    //         <input
    //           id={'chk_'+field.name}
    //           type="checkbox"
    //           ref={field.name}
    //           checked={this.state.inputData[field.name]}
    //           onChange={function(e) {this.handleChange(field.name, e.target.checked)}.bind(this)}
    //           onKeyUp={function(e) {this.handleKeyEnter(field, e)}.bind(this)}
    //         />
    //         <label htmlFor={'chk_'+field.name}></label>
    //       </span>
    //     );
    //   } else {
    //     input = (
    //       <input
    //         type="text"
    //         ref={field.name}
    //         value={this.state.inputData[field.name]}
    //         readOnly={field.readonly||false}
    //         onChange={function(e) {this.handleChange(field.name, e.target.value)}.bind(this)}
    //         onKeyUp={function(e) {this.handleKeyEnter(field, e)}.bind(this)}
    //         />);
    //   }
    //   return (
    //     <td key={field.name}>
    //       {input}
    //     </td>
    //   )
    // }.bind(this));

    // inputRow.push((
    //   <td key="actions">
    //     <div className="flex">
    //       <a href="#" ref="_save"
    //         className="flaticon-download164"
    //         onClick={this.doSave}
    //         onKeyUp={function(e) {
    //           if(e.keyCode==13) {
    //             this.doSave(e);
    //           }
    //         }.bind(this)}
    //         ></a>
    //       <a href="#" className="flaticon-clear5" onClick={this.doClear}></a>
    //     </div>
    //   </td>
    // ));

    var rows = this.props.data.map(function(row, i) {
      var td = this.props.fields.map(function(field) {
        var text = null;
        if (typeof field.render==='function') {
          text = field.render(row, i);
        } else {
          text = row[field.name];
        }
        return (
          <td key={field.name}>{text}</td>
        );
      });
      // td.push(
      //   <td key="actions" className="flex">
      //     <a
      //       href="#"
      //       className="flaticon-create3"
      //       onClick={function(e) {this.editRow(i, e)}.bind(this)}
      //       ></a>
      //     <a
      //       href="#"
      //       className="flaticon-rubbish"
      //       onClick={function(e) {this.removeRow(i,e)}.bind(this)}
      //       ></a>
      //   </td>
      // );
      return (
        <tr key={i}>
          {td}
        </tr>
      );
    }.bind(this));

    var numRows = this.props.displayRows || 10;
    // <tr className="inputRow">
    //   {inputRow}
    // </tr>

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

      </div>
    );
  }

});

module.exports = FlexListTable;
