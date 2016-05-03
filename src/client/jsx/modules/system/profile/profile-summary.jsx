var React         = require('react');
var Router        = require('react-router');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var ProfileSummary = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="profile.title.list" component="h2" />
          </div>
        </div>
        <div className="content-body panelf">
          Summary
        </div>
      </div>
    );
  }
});

module.exports = ProfileSummary;
