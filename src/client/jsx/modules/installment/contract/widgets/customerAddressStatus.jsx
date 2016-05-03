var React       = require('react');
var widgets     = require('ss-widget');
var T           = require('react-translate-component');

var FlexDropdown = widgets.FlexDropdown;
var FlexTextInput = widgets.FlexTextInput;
var FlexIcon      = widgets.FlexIcon;
var AddressInfo = require('../address-info.jsx');

module.exports = function(fields, data, handleChange, hasHeader, copyAddressFn) {
  var header = null;
  if (hasHeader===true) {
    header = (
      <div style={{paddingBottom:'4px'}}>
        <T content="contract.address_status" className="section-header" component="div"></T>
      </div>
    );
  }
  return (
    <div className="flex">
      <div className="box5">
        {header}
        <T content="contract.address.card_address" component="div" className="panelf section-header" style={{fontWeight:'bold'}}/>
        <AddressInfo ref="cardAddr"  otherLabel="contract.address.year" onChange={function(newData) {
            handleChange('cardAddr', newData);
          }}
          data={data.cardAddr}
          />
      </div>
      <div className="box5">
        <div className="flex">
          <T content="contract.address.home_address" component="div" className="panelf section-header can-grow" style={{fontWeight:'bold'}}/>
          <div className="no-shrink panel3 flex">
            <FlexDropdown
              field={{
                id:'homeAddrCopyFrom',
                label:'contract.address.copy_from',
                list:[
                  {value:'custom', text:'กำหนดเอง'},
                  {value:'fromCard',text:'ที่อยู่บัตรประชาชน'}
                ]
              }}
              data={data}
              onChange={handleChange}
              />
            {typeof copyAddressFn == 'function' ? (
              <FlexIcon
                icon="copy31"
                className="no-shrink"
                title="contract.read_id"
                onClick={function() {copyAddressFn('homeAddrCopyFrom')}.bind(this)}
                style={{padding:'4px'}}
                />
              ) : null}
          </div>
        </div>
        <AddressInfo ref="customerAddr"  otherLabel="contract.address.year" onChange={function(newData) {
//            data.customerAddr = newData;
            handleChange('customerAddr', newData);
          }}
          data={data.customerAddr}
          />
      </div>
    </div>
  );
}
