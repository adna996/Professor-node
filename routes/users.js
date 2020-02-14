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
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond');
});
router.get('/login',(req,res)=> res.render('login'));
router.get('/register', (req,res)=>res.render('register'));



/*router.post('/register', (req,res)=>{
  const {name, email, password, password2} = req.body;
  let errors [];
  if(!name || !email || !password || password2){
    errors.push({msg: 'Popunite sve polja'});
  }
  if(password !== password2){
    errors.push({msg:'Passwordi se ne podudaraju'});
  }
  if(password.length<5){
    console.push({msg:'Password mora imati najmanje 6 karaktera'});
  }
  if(errors.length>0){
    res.render('/register',{
      errors,name,email,password,password2
    });
  }else{
    res.send('Proslo je');
  }
});*/


module.exports = router;
