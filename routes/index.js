var express = require('express');
const async = require('hbs/lib/async');
const { rawListeners } = require('../config/db');
var router = express.Router();

var conn = require('../config/db');
var userModel = require('../models/user');

/* GET home page. */
router.get('/', async function(req, res, next) {

  let options = {
    serverSuccess: req.flash('server-success')
   
  }

  try {
    options.userList = await userModel.list(conn);
  } catch (error) {
    options.serverError = error.message
  }

  res.render('index', options);
});

router.get('/create', function(req, res, next) {
  res.render('create',{
    serverError: req.flash('server-error')
  });
});
 
//for delete
router.get('/delete/:user_id', async function(req, res, next) {
  let user_id = req.params.user_id;

  try {
    let resp = await userModel.delete(conn,user_id);
    req.flash('server-success', "deleted successfully")
    res.redirect("/");
  } catch (error) {
    req.flash('server-error', "updated error")
    res.redirect("/");
    
  }

})
//for edit
router.get('/edit/:user_id', async function(req, res, next) {

  let user_id = req.params.user_id;
  let options = {}
   try {
     let userResp = await userModel.list(conn,user_id)
     options.user = userResp[0];
   } catch (error) {
     options.serverError = error.messagel
     
   }

  res.render('edit',options);
});
 //upadte query
router.post('/edit/:user_id', async function(req, res, next) {
  let user_id = req.params.user_id;
  // conn.query(query,[data],function)

  let data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    mobile: req.body.mobile,
    email: req.body.email
  };

  try {
    let resp = await userModel.update(conn,data,user_id);
    req.flash('server-success', "updated successfully")
    res.redirect("/");
  
  } 
  catch (error) {
    req.flash('server-error', error.messag)
    res.redirect("/edit" + user_id);
    
  }
});





router.post('/create', async function(req, res, next) {
  // conn.query(query,[data],function)

  let data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    mobile: req.body.mobile,
    email: req.body.email
  };

  try {
    let resp = await userModel.insert(conn,data);
    req.flash('server-success', "user added successfully")
    res.redirect("/");
  
  } 
  catch (error) {
    req.flash('server-error', error.messag)
    res.redirect("/create");
    
  }
});

module.exports = router;
