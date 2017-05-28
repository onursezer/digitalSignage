var express = require('express');
var router = express.Router();
var session = require("express-session");
var Users = require("../models/user");
var mongoose = require('mongoose');
var multer = require('multer');
var Playlist = require("../models/playLists");
var mkdirp = require('mkdirp');
var Fields = require("../models/fields");
var rimraf = require('rimraf');
var fs = require('fs');



router.get('/Playlist_Ekle', function (req, res) {

	if (!req.session.kisi) {
		res.redirect("/Giris-Yap");
	} else {

		res.render("playlist_ekle.handlebars", { title: "digitalBilgiEkraniPanel", breadcrump: "Playlist Ekle" });
	}
});

router.get('/Playlistler', function (req, res) {

	if (!req.session.kisi) {
		res.redirect("/Giris-Yap");
	} else {

		res.render("playlistler.handlebars", { title: "digitalBilgiEkraniPanel", breadcrump: "Playlistler" });
	}
});


router.get('/Playlist_Sil', function (req, res) {

	if (!req.session.kisi) {
		res.redirect("/Giris-Yap");
	} else {

		res.render("playlist_sil.handlebars", { title: "digitalBilgiEkraniPanel", breadcrump: "Playlist Sil" });
	}
});

router.get('/Playlisti_Duzenle', function (req, res) {

	if (!req.session.kisi) {
		res.redirect("/Giris-Yap");
	} else {

		res.render("playlisti_duzenle.handlebars", { title: "digitalBilgiEkraniPanel", breadcrump: "Playlisti Düzenle" });
	}
});


router.post('/playlist_add', function (req, res) {
	var playListName = req.body.isim;

	Playlist.count({ "playListName": playListName }, function (err, say) {

		if (say != 0) {

			res.send("1");

		} else {
			var newPlayList = new Playlist({
				playListName: playListName,
				list: []
			});
			Playlist.createPlayList(newPlayList, function (err, user) {
				if (err) {
					res.send("Kayıt Oluşturulamadı!");
				} else {
					mkdirp("public/clients/" + playListName, function () {
						//console.log("olusturuldu");
					});
					res.send("Kayıt Başarıyla Tamamlandı.");
				}
			});
		}
	});
});

router.get('/playlists', function (req, res) {

	Playlist.find(function (err, rents) {
		res.json(rents);
	});

});

router.get('/playlist_sayi', function (req, res) {

	Playlist.count(function (err, sayi) {
		res.json(sayi);
	});

});

router.put("/playListNameGuncelle/", function (req, res) {

	var id = req.body.id;
	var playListName = req.body.playListName;
	Playlist.count({ "playListName": playListName }, function (err, sayi) {
		if (sayi != 0) {
			res.send("1");
		} else {
			Playlist.findOne({ "_id": id }, function (err, pList) {
				var oldPlayListName = pList.playListName;
				Playlist.update({ "_id": id }, { $set: { "playListName": playListName } }, function (err, sonuc) {

					if (err) {
						res.send("Playlist Adı Güncellenirken Bir Hata Oluştu!");
					} else {

						fs.rename("public/clients/" + oldPlayListName, "public/clients/" + playListName, function (err) {
							// if (err) throw err;
							// console.log('renamed complete');
						});

						Fields.update({ "playListName": oldPlayListName }, { $set: { "playListName": playListName }, }, { multi: true }, function (err, sonuc) {
							//console.log("cihaz playlistname update basarili");
						});

						res.send("Playlist Adı Başarıyla Güncellendi.");
					}

				});
			});


		}
	});
});

router.delete("/playlistdelete/:id", function (req, res) {

	var id = req.params.id;
	Playlist.findOne({ "_id": id }, function (err, pList) {
		//console.log("pList.playListName : " + pList.playListName);
		var playListName = pList.playListName;
		rimraf("public/clients/" + playListName, function () { });
		Playlist.remove({ "_id": id }, function (err, rents) { });
	});

});


/////// Profil

router.get('/Profilim', function (req, res) {

	if (!req.session.kisi) {
		res.redirect("/Giris-Yap");
	} else {

		res.render("profilim.handlebars", { title: "digitalBilgiEkraniPanel", breadcrump: "Profilim" });
	}
});

router.get('/Giris-Yap', function (req, res) {

	if (req.session.kisi) {
		res.redirect("/");
	} else {
		res.render("login.handlebars", { title: "digitalBilgiEkraniPanel" });
	}


});


router.post('/Giris-Yap', function (req, res) {

	var username = req.body.username;
	var password = req.body.password;

	console.log(username + "/" + password);

	Users.count({ "username": username, "password": password, "yetki": "yönetici" }, function (err, say) {
		if (say != 0) {

			Users.findOne({ "username": username, "password": password }, { "_id": true }, function (err, user) {

				var id = user._id;
				req.session.kisi = id;
				res.send("1");
			});


		} else {

			res.send("Kullanıcı Adı veya Şifre Hatalı! ya da Yetkiniz Yok!");

		}

	});

});
router.get('/admin', function (req, res) {

	id = req.session.kisi;
	Users.find({ "_id": id }, { _id: false, password: false }, function (err, kisi) {
		res.json(kisi);
	});

});

router.get('/Cikis', function (req, res) {
	delete req.session.kisi;

	res.redirect('/Giris-Yap');
});

router.put("/Sifre_Guncelle", function (req, res) {

	var sifre = req.body.password;
	var yenisifre1 = req.body.password1;
	var yenisifre2 = req.body.password2;
	var id = req.session.kisi;

	if (yenisifre1 != yenisifre2) {
		res.send("YENİ ŞİFRELER EŞLEŞMİYOR!");
	} else {

		Users.count({ "_id": id, "password": sifre }, function (err, say) {

			if (say != 0) {

				Users.update({ "_id": id }, { $set: { "password": yenisifre1 } }, function (err, sonuc) {

					if (err) {
						res.send("ŞİFRE GÜNCELLENİRKEN BİR HATA OLUŞTU!");
					} else {
						res.send("1");
					}

				});


			} else {
				res.send("ESKİ ŞİFRENİZ YANLIŞ!");
			}

		});

	}

});


router.put("/Kadi_Guncelle", function (req, res) {

	var kadi = req.body.kadi;
	var kadi1 = req.body.kadi1;
	var kadi2 = req.body.kadi2;
	var id = req.session.kisi;

	if (kadi1 != kadi2) {
		res.send("KULLANICI ADLARI EŞLEŞMİYOR!");
	} else {

		Users.count({ "_id": id, "username": kadi }, function (err, say) {

			if (say != 0) {

				Users.find({ "username": kadi1 }, function (err, sss) {

					if (sss != 0) {
						res.send("LÜTFEN FARKLI BİR KULLANICI ADI DENEYİNİZ!");
					} else {

						Users.update({ "_id": id }, { $set: { "username": kadi1 } }, function (err, sonuc) {

							if (err) {
								res.send("KULLANICI ADI GÜNCELLENİRKEN BİR HATA OLUŞTU!");
							} else {
								res.send("1");
							}

						});

					}

				});


			} else {
				res.send("ESKİ KULLANICI ADINIZ YANLIŞ!");
			}

		});

	}

});

router.put("/Email_Guncelle/", function (req, res) {

	var id = req.session.kisi;
	var email = req.body.email;
	var email1 = req.body.email1;
	var email2 = req.body.email2;
	if (email1 != email2) {
		res.send("YENİ MAİL ADRESLERİ EŞLEŞMİYOR!");
	} else {

		Users.count({ "email": email, "_id": id }, function (err, sayi) {

			if (sayi == 0) {
				res.send("ESKİ E-MAİL ADRESİ YANLIŞ!");
			} else {

				Users.update({ "_id": id }, { $set: { "email": email1 } }, function (err, sonuc) {

					if (err) {
						res.send("E-MAİL GÜNCELLENİRKEN BİR HATA OLUŞTU!");
					} else {
						res.send("1");
					}

				});

			}

		});

	}

});

router.put("/Telefon_Guncelle/", function (req, res) {

	var id = req.session.kisi;
	var telefon = req.body.telefon;
	var telefon1 = req.body.telefon1;
	var telefon2 = req.body.telefon2;
	if (telefon1 != telefon2) {
		res.send("YENİ TELEFON NUMARALARI EŞLEŞMİYOR!");
	} else {

		Users.count({ "phone": telefon, "_id": id }, function (err, sayi) {

			if (sayi == 0) {
				res.send("ESKİ TELEFON NUMARASI YANLIŞ!");
			} else {

				Users.update({ "_id": id }, { $set: { "phone": telefon1 } }, function (err, sonuc) {

					if (err) {
						res.send("TELEFON NUMARASI GÜNCELLENİRKEN BİR HATA OLUŞTU!");
					} else {
						res.send("1");
					}

				});

			}

		});

	}

});



module.exports = router;