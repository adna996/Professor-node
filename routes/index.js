var express = require('express');
var router = express.Router();
const PORT = process.env.PORT||3000;
var io=null;

const config = {
  user: 'omjahhkk',
  database: 'omjahhkk',
  password: 'uzrqdTx13-FcHD-WOK9KvZlKjUXWg1WH', //env var: PGPASSWORD
  host: 'rajje.db.elephantsql.com',
  port: 5432,
  max: 300,
  idleTimeoutMillis: 30000
};

var pg = require('pg');
var pool = new pg.Pool(config);

/* GET home page. */
router.get('/',(req,res)=>res.render('welcome'));


router.get('/predmet', function(req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error",' +
          ' "status" : 500}');
    }

    client.query(
        "SELECT * FROM predmet; ",
        function (err, result) {
          done();

          if (err) {
            console.info(err);
            res.sendStatus(400);
          } else {
            res.render('predmet', {
              title: 'Predmet',
              predmet: result.rows
            });
          }
        });
  });
});


router.post('/login/predmet/predavanja/:id', function(req, res, next) {
    var id=req.params.id;
  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error",' +
          ' "status" : 500}');
    }

    client.query("SELECT broj_predavanja FROM predavanja " +
        "INNER JOIN predmet WHERE predmet.id = $predavanja.id_predmet;",
        [req.params.id],
        function (err, result) {
          done();

          if (err) {
            console.info(err);
            res.sendStatus(400);
          } else {
            res.sendStatus(200);
          }
        });
  });
});


module.exports = router;
