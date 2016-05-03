var express     = require('express');
var router      = express.Router();
var q           = require('q');

var dbo        = require('../../lib/db_ora');

router.get('/:code?', function(req, res) {
	var pm = { code: ('%'+(req.params.code || '')+'%').replace('%%', '%'), shop_id: req.query.shop_id  };
	dbo.query("SELECT nickname, st.id FROM staff st, "+
		"(select id from shop where mysqlshopid = :shop_id) sh "+
		"WHERE (nickname like :code or fullname like :code) and st.shop_id = sh.id and ROWNUM <= 100", pm).then(function(data){
		data = data.map(function(item){ return { name: item.nickname, value: item.id } });
		res.send({ success:true, results: data });
	});
});

module.exports = router;
