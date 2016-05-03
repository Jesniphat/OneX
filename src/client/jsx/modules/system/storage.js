

module.exports = {
  save: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  load: function(key, def) {
    var value = localStorage.getItem(key);
    if (value==null) {
      return def || null;
    }
    try {
      value = JSON.parse(value);
    } catch(e) {
      console.log('error', e);
      value = null;
    }
    return value;
  },

  remove: function(key) {
    localStorage.removeItem(key);
  }
}
