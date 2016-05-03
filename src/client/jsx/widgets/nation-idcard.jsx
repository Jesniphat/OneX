var React   = require('react');
var tr      = require('counterpart');

var getBase64Image = function(img) {
  var canvas = document.createElement("canvas");
  console.log(img.naturalWidth, '*', img.naturalHeight);
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL;
}

var NationIDCard = React.createClass({
  componentDidMount: function() {
    var img = this.refs.img.getDOMNode();
    img.crossOrigin='anonymous';
    img.onload = function() {
      var imgData = getBase64Image(img);
      if (typeof this.props.onChange === 'function') {
        this.props.onChange({
          nationid: this.props.idcard.nationid,
          photoData: imgData
        });
      }
    }.bind(this);
  },

  render: function() {
    var idcard  = this.props.idcard;
    var addr1='';
    var addr2='';
    var fullnameTH = '';
    var fullnameEN = '';

    if (idcard.firstnameTH) {
      fullnameTH = idcard.prenameTH + ' ' + idcard.firstnameTH + ' ' + idcard.lastnameTH;
      fullnameEN = idcard.prenameEN + ' ' + idcard.firstnameEN;
    }

    if (idcard.address) {
      var tmp = [];
      ['houseNo','villageNo', 'lane', 'road', 'unknown', 'tambon'].forEach(function(item) {
        if (idcard.address[item]) {
          tmp.push(idcard.address[item]);
        }
      });
      addr1 = tmp.join(' ');
      tmp = [];
      ['amphur', 'province'].forEach(function(item) {
        if (idcard.address[item]) {
          tmp.push(idcard.address[item]);
        }
      });
      addr2 = tmp.join(' ');
    }
    var birthTH = '';
    var birthEN = '';
    var issueDateTH = '';
    var issueDateEN = '';
    var expireDateTH = '';
    var expireDateEN = '';
    if (idcard.birth) {
      var d = new Date(idcard.birth);
      birthTH = tr.localize(d, {type:'date', locale:'th'});
      birthEN = tr.localize(d, {type:'date', format:'dd MM yyyy', locale:'en'});
    }
    if (idcard.issueDate) {
      var d = new Date(idcard.issueDate);
      issueDateTH = tr.localize(d, {type:'date', locale:'th'});
      issueDateEN = tr.localize(d, {type:'date', format:'dd MM yyyy', locale:'en'});
    }
    if (idcard.expireDate) {
      var d = new Date(idcard.expireDate);
      expireDateTH = tr.localize(d, {type:'date', locale:'th'});
      expireDateEN = tr.localize(d, {type:'date', format:'dd MM yyyy', locale:'en'});
    }

    return (
      <div className="nationid-reader">
        <div className={'nationid-card' + (typeof idcard.nationid==='undefined' ? ' inactive':'')}>
          <div className="code">{idcard.nationid||''}</div>
          <div className="name-th ellipsis">{fullnameTH}</div>
          <div className="name-en ellipsis">{fullnameEN}</div>
          <div className="name2-en ellipsis">{idcard.lastnameEN}</div>
          <div className="birth-th">{birthTH}</div>
          <div className="birth-en">{birthEN}</div>
          <div className="addr1 ellipsis">{addr1}</div>
          <div className="addr2 ellipsis">{addr2}</div>
          <div className="issue_date_th">{issueDateTH}</div>
          <div className="issue_date_en">{issueDateEN}</div>
          <div className="expiry_date_th">{expireDateTH}</div>
          <div className="expiry_date_en">{expireDateEN}</div>
          <img ref="img" className="photo" src={this.props.photoPath}/>
          <div className={'photoLoading'+(this.props.photoLoading ? ' spinner':'')}></div>
        </div>
      </div>
    );
  }
});


module.exports = NationIDCard;
