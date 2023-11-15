var express = require('express');
var router = express.Router();

const userController = require("../controllers/userController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* SIGN UP PAGE */
router.get("/sign-up", userController.sign_up_get);
router.post("/sign-up", userController.sign_up_post);

module.exports = router;
