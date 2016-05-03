var React = require('react');
var widgets = require('ss-widget');
var FlexTextInput = widgets.FlexTextInput; //require('../../../widgets/flex-text-input.jsx');

var AddressInfo = React.createClass({
  getInitialState: function(key, value) {
    return {
      fields: {
        addr1: {
          id:'addr1',
          type:'text',
          label:'contract.address.addr1',
          icon:'user158'
        },
        addr2: {
          id:'addr2',
          type:'text',
          label:'contract.address.addr2',
          icon:'user158'
        },
        tambon: {
          id:'tambon',
          type:'text',
          label:'contract.address.tambon',
          icon:'user158'
        },
        amphur: {
          id:'amphur',
          type:'text',
          label:'contract.address.amphur',
          icon:'user158'
        },
        province: {
          id:'province',
          type:'text',
          label:'contract.address.province',
          icon:'user158'
        },
        zipcode: {
          id:'zipcode',
          type:'text',
          label:'contract.address.zipcode',
          icon:'user158',
          pattern:'^[0-9]{5}$'
        },
        tel: {
          id:'tel',
          type:'text',
          label:'contract.address.tel',
          icon:'user158',
          pattern:'^0[0-9]{8,9}$'
        },
        other: {
          id:'other',
          type:'text',
          label:this.props.otherLabel || 'contract.address.other',
          icon:'user158'
        }
      },
      data: {}
    }
  },
  componentWillReceiveProps: function(props) {
    if (props.data) {
      this.state.data = props.data;
      this.state.data['addr_text'] = this.getAddressString();
      this.setState({
        data: props.data
      });
    }
  },
  getData: function() {
    return this.state.data;
  },

  getAddressString: function() {
    var tmp = [];
    ['addr1', 'addr2', 'tambon', 'amphur', 'province', 'zipcode'].forEach(function(id) {
      if (this.state.data[id]) {
        tmp.push(this.state.data[id].trim());
      }
    }.bind(this));
    return tmp.join(' ');
  },

  setData: function(data) {
    this.state.data = data;
    this.state.data['addr_text'] = this.getAddressString();
    this.setState({
      data: data
    });
  },

  handleChange: function(key, value) {
    this.state.data[key] = value;
    this.state.data['addr_text'] = this.getAddressString();
    this.setState({
      data: this.state.data
    });
    if (typeof this.props.onChange==='function') {
      this.props.onChange(JSON.parse(JSON.stringify(this.state.data)));
    }
  },

  render: function() {
    return (
      <div className="panelf">
        <div style={{paddingBottom:'4px'}}>
          <FlexTextInput field={this.state.fields.addr1} data={this.state.data} onChange={this.handleChange}/>
        </div>
        <div style={{paddingBottom:'4px'}}>
          <FlexTextInput field={this.state.fields.addr2} data={this.state.data} onChange={this.handleChange}/>
        </div>
        <div className="flex" style={{paddingBottom:'4px'}}>
          <FlexTextInput field={this.state.fields.tambon} data={this.state.data} onChange={this.handleChange}/>
          <div style={{width:'4px'}}></div>
          <FlexTextInput field={this.state.fields.amphur} data={this.state.data} onChange={this.handleChange}/>
        </div>
        <div className="flex" style={{paddingBottom:'4px'}}>
          <FlexTextInput field={this.state.fields.province} data={this.state.data} onChange={this.handleChange}/>
          <div style={{width:'4px'}}></div>
          <FlexTextInput field={this.state.fields.zipcode} data={this.state.data} onChange={this.handleChange}/>
        </div>
        <div className="flex">
          <FlexTextInput field={this.state.fields.tel} data={this.state.data} onChange={this.handleChange}/>
          <div style={{width:'4px'}}></div>
          <FlexTextInput field={this.state.fields.other} data={this.state.data} onChange={this.handleChange}/>
        </div>
      </div>
    )
  }
});

module.exports = AddressInfo;
