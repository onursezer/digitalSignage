var express = require('express');
var router = express.Router();
var session = require("express-session");

// Get Homepage
router.get('/', function (req, res) {

	if (req.session.kisi) {
		res.render("index.handlebars", { title: "digitalBilgiEkraniPanel", breadcrump: "Anasayfa" });
	} else {
		res.redirect("/Giris-Yap");
	}

});

module.exports = router;