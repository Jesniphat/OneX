var cleanup = require('../lib/cleanup');

var svc = new cleanup([__dirname+'/../public/output']);
svc.start();
