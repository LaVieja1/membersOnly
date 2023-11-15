var express = require('express');
var router = express.Router();

const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

/* GET home page. */
router.get("/", postController.post_list);

/* SIGN UP PAGE */
router.get("/sign-up", userController.sign_up_get);
router.post("/sign-up", userController.sign_up_post);

// LOGIN PAGE
router.get("/login", userController.login_get);
router.post("/login", userController.login_post);

// LOGOUT
router.get("/logout", userController.logout);

// MEMBERSHIP PAGE
router.get("/membership", userController.membership_get);
router.post("/membership", userController.membership_post);

// NEW POST PAGE
router.get("/new-post", postController.new_post_get);
router.post("/new-post", postController.new_post_post);

module.exports = router;
