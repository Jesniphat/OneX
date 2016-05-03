
var systemStore = require('./store');
var sessionStore = require('./stores/session');

var getShopAcl = function(acls) {
  var session = sessionStore.getSession();
  var acl = session.acl;
  var shops = systemStore.getMaster().shops;
  if (session.staff.is_admin=='YES') {
    return shops;
  }
  var out = [];
  for (var ii in shops) {
    var shop = shops[ii];
    if (typeof acls==='undefined') {
      if (acl[shop.code]) {
        out.push(shop);
      }
      continue;
    }
    for (var i in acls) {
      var pass = true;
      for (var j in acls[i]) {
        if (!pass) {
          break;
        }
        for (var k in acls[i][j]) {
          if (
            typeof acl[shop.code] === 'undefined'
            || typeof acl[shop.code][j] === 'undefined'
            || typeof acl[shop.code][j][k] === 'undefined'
            || acl[shop.code][j][k]===false
            ) {
            pass = false;
            break;
          }
        }
      }
      if (pass) {
        break;
      }
    }
    if (pass) {
      out.push(shop);
    }
  }
  return out;
}

var hasAcl = function(acls) {
  var session = sessionStore.getSession();
  var acl = session.acl;
  if (session.staff.is_admin=='YES') {
    return true;
  }

  for (var i in acls) {
    for(var j = 0; j < acls[i].length; j++) {
      if (
        typeof acl[session.shop.code] === 'undefined'
        || typeof acl[session.shop.code][i] === 'undefined'
        || typeof acl[session.shop.code][i][acls[i][j]] === 'undefined'
        || acl[session.shop.code][i][acls[i][j]] === false
        ) {
//          console.log(i, j, session.shop.code, acl);
        return false;
      }
    }
  }

  return true;
}

var hasMAcl = function(menu_acl) {
  var session = sessionStore.getSession();
  var acl = session.acl[session.shop.code];
  if (session.staff.is_admin=='YES') {
    return true;
  }
  if (typeof acl !== 'undefined') {
    for (var i in acl) {
      for(var j = 0; j < menu_acl.length; j++) {
        if(acl[i][menu_acl[j]] == true) return true;
      }
    }
  }
  return false;
}


var getAcl = function() {
  return sessionStore.getSession().acl;
}

module.exports = {
  getShopAcl: getShopAcl,
  hasAcl: hasAcl,
  hasMAcl: hasMAcl,
  getAcl: getAcl
}
