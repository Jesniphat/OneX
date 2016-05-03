var React       = require('react');
var tr          = require('counterpart');
var widgets     = require('ss-widget');

var FlexTextInput   = widgets.FlexTextInput;
var FlexRadioGroup  = widgets.FlexRadioGroup;
var FlexDropdown    = widgets.FlexDropdown;


module.exports = function(fields, data, addr, handleChange) {
  // var doc_send_to_field = {
  //   id:'doc_send_to',
  //   label:'contract.doc_send_to',
  //   raw:true,
  //   list: [
  //     {value:'HOME', text: tr.translate('contract.doc_send_to_HOME') + ' ('+(addr.HOME || '')+')'},
  //     {value:'WORK', text: tr.translate('contract.doc_send_to_WORK') + ' ('+(addr.WORK|| '')+')'}
  //   ]
  // }
  return (
    <div className="panel6">
      <div className="flex" style={{paddingBottom:'4px'}}>
        <FlexTextInput field={fields.birth} data={data} onChange={handleChange}/>
        <div style={{width:'4px'}} className="no-shrink"></div>
        <FlexTextInput field={fields.age} data={data} onChange={handleChange}/>
      </div>
      <div className="flex" style={{paddingBottom:'4px', height:'32px'}}>
        <FlexRadioGroup field={fields.gender} data={data} className="box3 flex" onChange={handleChange}/>
        <div style={{width:'4px'}} className="no-shrink"></div>
        <FlexRadioGroup field={fields.marital_status} data={data} className="box3 flex" onChange={handleChange}/>
      </div>
      <div className="flex" style={{paddingBottom:'4px'}}>
        <FlexTextInput field={fields.mobile} data={data} onChange={handleChange}/>
        <div style={{width:'4px'}} className="no-shrink"></div>
        <FlexTextInput field={fields.email} data={data} onChange={handleChange}/>
      </div>
      <div style={{paddingBottom:'4px'}}>
        <FlexDropdown field={fields.addr_type} data={data} onChange={handleChange}/>
      </div>
      <div style={{paddingBottom:'4px'}}>
        <FlexDropdown field={fields.addr_with} data={data} onChange={handleChange}/>
      </div>
      <div style={{paddingBottom:'4px'}}>
        <FlexTextInput field={fields.addr_person} data={data} onChange={handleChange}/>
      </div>
    </div>
  );
  // <div>
  //   <FlexRadioGroup field={doc_send_to_field} data={data} onChange={handleChange} itemClassName="ellipsis"/>
  // </div>

}
