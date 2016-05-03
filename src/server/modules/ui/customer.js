var express     = require('express');
var router      = express.Router();
var bodyParser  = require('body-parser');
var q           = require('q');

var dbo        = require('../../lib/db_ora');

router.get('/:code?', function(req, res) {
	var pm = { code: ('%'+(req.params.code || '')+'%').replace('%%', '%') };
	dbo.query("SELECT code, id FROM company WHERE type = 'C' AND code like :code and ROWNUM <= 100", pm).then(function(data){
		data = data.map(function(item){ return { name: item.code, value: item.id } });
		res.send({ success:true, results: data });
	});
});

module.exports = router;
