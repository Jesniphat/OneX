var express     = require('express');
var path        = require('path');
var moment        = require('moment');
var bodyParser  = require('body-parser');
var q           = require('q');
var dbo        = require('../../lib/db_ora');
var router      = express.Router();
var helper      = require('../../lib/helper');

router.post('/search', function(req, res) {
	dbo.query("SELECT COUNT(id) found FROM member WHERE id_card=:id_card", { id_card: req.body.id_card }).then(function(item){
    res.send({ found: parseInt(item[0].found) > 0 });
  }).catch(function(e){
    res.send({ status:false, error:e });
  });
});

router.post('/list', function(req, res) {
	var $scope = {};
	var sql = "";
	dbo.query("SELECT id, code, name FROM member WHERE id_card=:id_card", { id_card: req.body.id_card }).then(function(item){
		if(item.length == 0) throw 'id_card_unknow';
    $scope.member_id = item[0].id;
    $scope.member_code = item[0].code;
    $scope.member_name = item[0].name;
    $scope.year = moment().format('YYYY');
    $scope.expire = '31/12/'+$scope.year;
    $scope.expire_point = 0.0;

    sql = "SELECT balance FROM member_point_transaction WHERE member_id=:member_id and ROWNUM = 1 ORDER BY ID DESC";
    return dbo.query(sql, { member_id: $scope.member_id });
  }).then(function(item){
  	if(item.length > 0) {
  		$scope.point = helper.numberFormat(item[0].balance, 1);
  	} else {
  		$scope.point = '0.0';
  	}
    sql = "SELECT " +
					"SUM(point-used_point) expire_point FROM member_point_transaction " +
					"WHERE member_id=:member_id AND " +
					"created_date >= TO_DATE('"+($scope.year-1)+"-01-01', 'yyyy-mm-dd') AND " +
					"created_date <= TO_DATE('"+($scope.year-1)+"-12-31', 'yyyy-mm-dd') " +
					"GROUP BY member_id";
    return dbo.query(sql, { member_id: $scope.member_id });
  }).then(function(item){
  	if(item.length > 0) {
  		$scope.expire_point = helper.numberFormat(item[0].expire_point, 1);
  	} else {
  		$scope.expire_point = '0.0';
  	}

    sql = "SELECT " +
					"CONCAT(CONCAT(TO_CHAR(created_date, 'dd-mm-yyyy'), ' '),description) desc_, " +
					"point, balance " +
					"FROM member_point_transaction " +
					"WHERE MEMBER_ID=:member_id AND " +
					"created_date >= TO_DATE('"+($scope.year-1)+"-01-01', 'yyyy-mm-dd') ";
    return dbo.query(sql, { member_id: $scope.member_id });
  }).then(function(item){
		$scope.status = true;
		$scope.list = item;
		res.send($scope);
  }).catch(function(e){
  	console.log(e);
    res.send({ status:false, error:e });
  });
});

module.exports = router;