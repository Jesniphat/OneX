var Service = require('node-linux').Service;

// Create a new service object
var svc = new Service({
  name:'SecureStock',
  description: 'NS SecureStock',
  script: '/opt/securestock/dist/app.js',
  env: {
    name: "NLS_LANG",
    value: process.env['NLS_LANG'] // service is now able to access the user who created its' home directory
  }
});

console.log('NLS_LANG=', process.env['NLS_LANG']);

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
//svc.uninstall();
