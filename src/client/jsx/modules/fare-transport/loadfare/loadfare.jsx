var Router        = require('react-router');
var T             = require('react-translate-component');
var Dropzone      = require('react-dropzone');
var tr            = require('counterpart');

var system        = require('ss-system');
var systemActions = system.systemActions; //require('../../system/actions');
var toasterActions = system.toasterActions;

var customerActions  = require('./actions');
var customerStore    = require('./store');

var LoadFare = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var action = require('./actions');
var ReFlux    = require('reflux');

import React from 'react';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import ActionAndroid from 'material-ui/lib/svg-icons/action/android';

LoadFare.Index = React.createClass({
  mixins:[
     ReFlux.listenTo(action.fareUpload.done,'onUploadDone')
  ],
  getInitialState: function () {
    return {
    	secondary: true,
    	disabled: false,
    	filename: "SELECT FILE",
      files: [
      	{}
      ]
    };
  },
  componentDidMount: function() {
    //systemActions.setPageHeader("Load Fare");
  },

  onDrop: function (files) {
      console.log("path name = ",this.props.routes[3].path);
      this.setState({
        filename: "Uploading... ["+files[0].name+"]",
        disabled: true
      });
      //console.log(files[0]);
      action.fareUpload(files[0], this.props.routes[3].path);
  },
  onOpenClick: function () {
        this.refs.dropzone.open();
  },
  onUploadDone: function(err, data){
    toasterActions.pop({
    	type: data.body.status ? 'success' : 'warning',
    	message: data.body.status ? 'นำเข้าข้อมูลเรียบร้อย' : data.body.message
    });

    this.setState({
        filename: "SELECT FILE",
        disabled: false
    });

    if(this.props.routes[3].path == 'zone') {
        //action.listFarePoint();
        action.listFareZone();
    } else if(this.props.routes[3].path == 'rate') {
        //action.listFarePoint();
        action.listFareRate();
    }

  },

  DownloadTemplate: function(){
    var item_name = '';
    if(this.props.routes[3].path == 'zone') {
      item_name = '/templates/fareZone.xlsx';
    } else if(this.props.routes[3].path == 'rate') {
      item_name = '/templates/fareRate.xlsx';
    }
    window.open(item_name, '_blank');
  },
  render: function() {
    const styles = {
    button: { margin: 12, width: 300, fontWeight: 'bold', marginLeft: 200 },
    title: { display:'block', paddingTop:15, fontWeight: 'bold', fontSize:20 },
    dropzone: { width: '100%', border:'none' },
    link: { marginLeft: 254, fontSize:12, cursor:'pointer', textDecoration:'underline' },
    depth: { height: 195, margin: '20px auto', textAlign: 'left' }
  };
    return (
      <div className="content-page">
        <div className="content-header panelf" style={{ marginRight: 40 }}>
          	<Paper className="panel7" style={styles.depth} zDepth={1}>
          	  <Dropzone ref="dropzone" disableClick={this.state.disabled} multiple={false} onDrop={this.onDrop} style={styles.dropzone}>
          	  	<div className="flex">
                    <div className="panel2">
                        <i className="flaticon-microsoft8 flatbig" style={{ color:'green' }}></i>
                    </div>
                        <div className="panel6" style={{ textAlign: 'left' }}>
                            <h2>Load fare {this.props.routes[3].path}</h2>
                            <ol>
                                <li>Download and fill in Excel sheet.</li>
                                <li>The new spread sheet update will replace the existing one</li>
                            </ol>
                        </div>
                    </div>
                 <button className={"ui positive button"+(this.state.disabled ? ' disabled' : '')} style={styles.button}>
                    <i className="icon upload"></i>
                    {this.state.filename}
                </button>
              </Dropzone>
              <div>
                <a onClick={this.DownloadTemplate} style={styles.link}>click to download template xls file.</a>
              </div>
            </Paper>
        </div>
        <div className="content-body panelf">{this.props.children}</div>
      </div>
    )
  }
});

//LoadFare.Screen = require('./loadfare-screen.jsx');


// LoadFare.Routes = (
//   <Route name="transport.loadfare" path="loadfare" handler={LoadFare.Index}>
//     <Router.DefaultRoute name="transport.loadfare.screen" path="loadfare-screen" handler={LoadFare.Screen}/>
//   </Route>
// );

module.exports = LoadFare;
