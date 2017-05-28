var express = require('express');
var router = express.Router();
var session = require("express-session");
var Fields = require("../models/fields");
var Playlist = require("../models/playLists");

// Get Homepage
router.get('/Cihazlar', function (req, res) {

	if (!req.session.kisi) {
		res.redirect("/Giris-Yap");
	} else {
		res.render("fields.handlebars", { title: "digitalBilgiEkraniPanel", breadcrump: "Cihazlar" });
	}


});

router.get('/Cihaz_Ekle', function (req, res) {

	if (!req.session.kisi) {
		res.redirect("/Giris-Yap");
	} else {

		res.render("fields_add.handlebars", { title: "digitalBilgiEkraniPanel", breadcrump: "Cihaz Ekle" });
	}

});

router.get('/Cihaz_Sil', function (req, res) {

	if (!req.session.kisi) {
		res.redirect("/Giris-Yap");
	} else {

		res.render("fields_delete.handlebars", { title: "digitalBilgiEkraniPanel", breadcrump: "Cihaz Sil" });
	}
});

router.get('/Cihaz_Guncelle', function (req, res) {

	if (!req.session.kisi) {
		res.redirect("/Giris-Yap");
	} else {

		res.render("fields_guncelle.handlebars", { title: "digitalBilgiEkraniPanel", breadcrump: "Cihaz Güncelle" });
	}
});

router.get('/fields', function (req, res) {

	Fields.find(function (err, rents) {
		res.json(rents);
	});

});

router.get('/cihaz_sayi', function (req, res) {

	Fields.count(function (err, sayi) {
		res.json(sayi);
	});

});

router.post('/cihaz_ekle', function (req, res) {

	var isim = req.body.isim;
	var playListName = req.body.playListName;

	console.log("/cihaz_ekle" + isim);

	Fields.count({ "isim": isim }, function (err, say) {
		if (say != 0) {
			res.send("1");
		} else {
			Playlist.count({ "playListName": playListName }, function (err, say) {
				if (say == 0) {
					res.send("2");
				} else {
					var newField = new Fields({
						"isim": isim,
						"playListName": playListName
					});
					Fields.createFields(newField, function (err, sonuc) {
						if (err) {
							res.send("Kayıt Oluşturulurken Hata Oluştu!");
						} else {
							// TODO
							// klasor olusturme yazilicak buraya

							res.send("Kayıt Başarıyla Yapıldı.");
						}
					});

				}
			});

		}
	});


});
router.put("/fieldisimguncelle/", function (req, res) {

	var id = req.body.id;
	var isim = req.body.isim;
	Fields.count({ "isim": isim }, function (err, sayi) {
		if (sayi != 0) {
			res.send("1");
		} else {

			Fields.update({ "_id": id }, { $set: { "isim": isim } }, function (err, sonuc) {

				if (err) {
					res.send("Cihaz Adı Güncellenirken Bir Hata Oluştu!");
				} else {
					res.send("Cihaz Adı Başarıyla Güncellendi.");
				}

			});

		}
	});

});

router.put("/fieldplayListNameGuncelle/", function (req, res) {

	var id = req.body.id;
	var playListName = req.body.playListName;

	Playlist.count({ "playListName": playListName }, function (err, say) {
		if (say == 0) {
			res.send("Sistemde Olan Playlist İsmi Girin !");
		} else {

			Fields.update({ "_id": id }, { $set: { "playListName": playListName } }, function (err, sonuc) {

				if (err) {
					res.send("PlayList Güncellenirken Bir Hata Oluştu!");
				} else {
					res.send("PlayList Başarıyla Güncellendi.");
				}

			});
		}
	});
});



router.delete("/fieldsdelete/:id", function (req, res) {

	var id = req.params.id;
	Fields.remove({ "_id": id }, function (err, rents) { });

});

module.exports = router;