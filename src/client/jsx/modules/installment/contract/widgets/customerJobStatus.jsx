var React         = require('react');
var widgets       = require('ss-widget');

var FlexTextInput = widgets.FlexTextInput;

module.exports = function(fields, data, handleChange) {
  return (
    <div className="panel5">
      <div className="flex" style={{paddingBottom:'4px'}}>
        <FlexTextInput field={fields.work_type} data={data} onChange={handleChange}/>
        <div style={{width:'4px'}}></div>
        <FlexTextInput field={fields.work_type_other} data={data} onChange={handleChange}/>
      </div>
      <div className="flex" style={{paddingBottom:'4px'}}>
        <FlexTextInput field={fields.work_detail} data={data} onChange={handleChange}/>
        <div style={{width:'4px'}}></div>
        <FlexTextInput field={fields.work_department} data={data} onChange={handleChange}/>
      </div>
      <div className="flex" style={{paddingBottom:'4px'}}>
        <FlexTextInput field={fields.work_position} data={data} onChange={handleChange}/>
        <div style={{width:'4px'}}></div>
        <FlexTextInput field={fields.work_time} data={data} onChange={handleChange}/>
      </div>
      <div className="flex" style={{paddingBottom:'4px'}}>
        <FlexTextInput field={fields.work_year} data={data} onChange={handleChange}/>
        <div style={{width:'4px'}}></div>
        <FlexTextInput field={fields.work_salary} data={data} onChange={handleChange}/>
      </div>
      <div className="flex" style={{paddingBottom:'4px'}}>
        <FlexTextInput field={fields.work_income} data={data} onChange={handleChange}/>
        <div style={{width:'4px'}}></div>
        <FlexTextInput field={fields.work_income_source} data={data} onChange={handleChange}/>
      </div>
      <div style={{paddingBottom:'4px'}}>
        <FlexTextInput field={fields.work_prev_company} data={data} onChange={handleChange}/>
      </div>
      <div style={{paddingBottom:'4px'}}>
        <FlexTextInput field={fields.work_prev_addr} data={data} onChange={handleChange}/>
      </div>
      <div className="flex">
        <FlexTextInput field={fields.work_prev_department} data={data} onChange={handleChange}/>
        <div style={{width:'4px'}}></div>
        <FlexTextInput field={fields.work_prev_tel} data={data} onChange={handleChange}/>
      </div>
    </div>
  );
}
