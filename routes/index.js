var express = require('express');
var router = express.Router();
var PORT =process.env.PORT||3000

var config = {
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

router.get('/',
    function(req, res, next) {
        res.render('index');
});


router.post('/submit',
    function(req, res,next) => {
    res.render('predmeti');
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }
        client.query(
            "SELECT * FROM predmet" +
            "WHERE naziv_predmet = $1 order by id_predmet",
            [req.params.naziv_predmet],
            function (err, result) {
                done();
                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                } else {
                    res.render('predmeti',{
                        predmet:result.rows,
                    });
                }
                });
            });
    });

router.post('/predavanja',
    function(req,res,next)=> {
    res.render('predavanja');
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }
        client.query(
            "SELECT * FROM predavanja " +
            "WHERE broj_predavanja = $1 order by id_predmet",
            [req.params.broj_predavanja],
            function (err, result) {
                done();
                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                } else {
                    res.render('predmeti',{
                        predavanja:result.rows,
                    });
                }
            });
    });
});

router.post('/anketa',
    function(req,res,next)=>{
        res.render('anketiranje');
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }
        });
});

router.post('/pokreni',
    function(res,req,next)=>{
       res.render('pokreni');
       pool.connect(function (err, client, done) {
           if (err) {
               res.end('{"error" : "Error",' +
                   ' "status" : 500}');
           }
           client.query()
       });
});

module.exports = router;
