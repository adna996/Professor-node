var express = require('express');
var router = express.Router();
const PORT = process.env.PORT||3000;
var io=null;

/*KONEKCIJA NA BAZU PODATAKA*/
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
pool.on('connect', () => {
    console.log('connected to the db');
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('welcome',
    {title: "Home"});
    console.log('doso sam');
});
/*GET login page*/
router.get('/login',function(req,res,next){
    res.render('login');
    console.log('get login');
});
/*GET registration page*/
router.get('/register',function(req,res,next){
    res.render('register');
    console.log('get register');
});
router.get('/addLecture',function(req,res,next){
    res.render('addLecture');
    console.log('get addLecture');
});
router.get('/pitanja',function(req,res,next){
    res.render('pitanja');
    console.log('get pitanja form');
});
/*router.get('/anketiranja',function(req,res,next){
    res.render('anketiranje');
    console.log('get anketa form');
});*/
/*GET predmet page za profesore after login */
/*router.get('/predmet',function(req,res,next){
    res.render('predmet');
});*/

//-------------------------------------------------------------------------------------------------

//registration form
router.post('/register', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }
        client.query("INSERT INTO prof_profil " +
            "(username_prof, ime_prof, prezime_prof, email_prof, password_prof) values " +
            "($1, $2, $3, $4, $5);",
            [req.body.username,req.body.ime, req.body.prezime, req.body.email, req.body.password],
            function (err, result) {
                done();

                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                } else {
                    res.redirect('/login');
                }
            });
    });
});

//---------------------------------------------------------------------------------------------------
var username_login="";

//login form
router.post('/login', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }
        username_login = [req.body.username];
        client.query("SELECT * FROM prof_profil " +
            "WHERE username_prof = $1 and password_prof = $2",
            [req.body.username,req.body.password],
        function (err, result) {
                done();
                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                    res.redirect('/login')
                } else {
                    res.redirect('/predmet');
                    console.log('proso login; prof je ' + username_login)
                }
            });
    });
});
//-----------------------------------------------------------------------------------------------------
//predmeti profesora
router.get('/predmet',
    function (req, res, next) {
        console.info("Ovdje ispisi predmete!" + username_login);
        next();
    },
    function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }
            console.log(username_login);

            client.query("SELECT naziv_predmet FROM predmet ",
                function (err, result){
                    done();
                    if (err) {
                        console.info("Error occured while getting the user detail of ", err);
                        res.sendStatus(400);
                    } else {
                        res.render('predmet', {
                            title: 'Subjects',
                            predmet: result.rows,
                        });
                    }
                });
        });
    });
//-------------------------------------------------------------------------------------------
//PREDAVANJA
var id_pred=0;
router.get('/predavanja/:id', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }

        client.query("SELECT broj_predavanja FROM predavanja where id_predmet = $1;",[req.params.id],
            function (err, result) {
                done();

                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                } else {
                    res.render('predavanja', {
                        title: 'Lectures',
                        predavanja: result.rows,
                    });
                }
            });
    });
});



//BRISI PREDAVANJE
router.delete('/brisi/:id', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }

        client.query("DELETE FROM predavanja " +
            "WHERE id = $1;", [req.params.id],
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
//DODAJ PREDAVANJE
router.post('/addLecture', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }
        client.query("INSERT INTO predavanja " +
            "(broj_predavanja) values " +
            "($1);", [req.body.number],
            function (err, result) {
                done();
                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                } else {
                    res.redirect('/predavanja/:id');
                }
            });
    });
});


//----------------------------------------------------------------------------------
//PITANJA


router.post('/pitanja', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }
        client.query("INSERT INTO pitanja " +
            "(pitanje, odgovor) values " +
            "($1,$2);",
            [req.body.pitanje,req.body.odg],
            function (err, result) {
                done();

                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                } else {
                    res.redirect('/anketiranja');
                }
            });
    });
});

router.get('/anketiranja', function(req, res, next) {
    console.info('lal');
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }
        client.query("SELECT pitanje FROM pitanja",
            function (err, result) {
                done();
                console.info(result);

                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                } else {
                    res.render('anketiranje', {
                        title: 'Questionary',
                        pitanja: result.rows,
                    });
                }
            });
    });
});

module.exports = router;
