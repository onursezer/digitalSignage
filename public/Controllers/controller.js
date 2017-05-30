var digitalBilgiEkrani = angular.module('digitalBilgiEkrani', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});


digitalBilgiEkrani.controller('admin', ['$scope', '$http', function ($scope, $http) {

    var Yenile = function () {

        $http.get("/fields").success(function (response) {
            $scope.cihazlar = response;
            if ($scope.cihazlar == "") {
                $scope.fields_sonuc = "Cihamız Bulunmamaktadır!";
            }
        });

        $http.get("/playlists").success(function (response) {
            $scope.playlistler = response;
            if ($scope.playlistler == "") {
                $scope.playlists_sonuc = "Playlistimiz Bulunmamaktadır!";
            }
        });


        $http.get("/cihaz_sayi").success(function (response) {

            if (response == "0") {
                $scope.cihaz_count = "0";
                $scope.cihaz_count_sonuc = "Malesef Cihazmız Yok!";
            } else {
                $scope.cihaz_count = response;
                $scope.cihaz_count_sonuc = "Cihazmız Var";
            }
        });

        $http.get("/playlist_sayi").success(function (response) {

            if (response == "0") {
                $scope.playlist_count = "0";
                $scope.playlist_count_sonuc = "Malesef Playlistimiz Yok!";
            } else {
                $scope.playlist_count = response;
                $scope.playlist_count_sonuc = "Playlistimiz Var";
            }
        });

        //ADMİN İŞLEMLERİ

        $http.get("/admin").success(function (response) {
            $scope.admin = response;
        });

    }

    Yenile();

    //CİHAZ İŞLEMLERİ

    $scope.Cihaz_Ekle = function (isim) {

        if ($.trim(isim).length == 0) {
            $scope.cihaz_sonuc = "Boş Alan Bırakmayınız!";
        } else {
            $http.post("/cihaz_ekle", $scope.cihaz).success(function (response) {
                if (response == "1") {
                    $scope.cihaz_sonuc = "Lütfen Farklı Bir Cihaz İsimi Yazınız.";
                } else if (response == "2") {
                    $scope.cihaz_sonuc = "Lütfen Farklı Bir Playlist İsimi Yazınız.";
                }
                else {
                    $scope.cihaz_sonuc = response;
                    $scope.cihaz = "";
                }
            });
        }
        Yenile();
    }

    $scope.Cihaz_Sil = function (id) {
        $http.delete("/fieldsdelete/" + id).success(function (response) { });
        Yenile();
    }

    $scope.CihazIsimGuncelle = function (id, isim) {
        if ($.trim(isim).length == 0) {
            $scope.fieldisimguncelle_sonuc = "Lütfen Cihaz Adını Giriniz!";
        } else {
            var veriler = { "id": id, "isim": isim };
            $http.put("/fieldisimguncelle", veriler).success(function (response) {

                if (response == "1") {
                    $scope.fieldisimguncelle_sonuc = "Lütfen Farklı Bir Cihaz Adı Giriniz!";
                } else {
                    $scope.fieldisimguncelle_sonuc = response;
                    $scope.isim = "";
                    Yenile();
                }
            });
        }
    }


    $scope.CihazPlayListNameGuncelle = function (id, playListName) {
        if ($.trim(playListName).length == 0) {
            $scope.fieldisimguncelle_sonuc = "Lütfen Cihaz Adını Giriniz!";
        } else {
            var veriler = { "id": id, "playListName": playListName };
            $http.put("/fieldplayListNameGuncelle", veriler).success(function (response) {

                if (response == "1") {
                    $scope.fieldPlayListName_sonuc = "Lütfen Farklı Bir Cihaz Adı Giriniz!";
                } else {
                    $scope.fieldPlayListName_sonuc = response;
                    $scope.isim = "";
                    Yenile();
                }
            });
        }
    }


    //Playlist İŞLEMLERİ

    $scope.Playlist_Sil = function (id) {
        $http.delete("/playlistdelete/" + id).success(function (response) {

            if (response == "2") {
                $scope.playlistSil_sonuc = "Playlist Silinemedi!";
            } else {
                $scope.playlistSil_sonuc = "Playlist Başarıyla Silindi!";
            }

        });
        Yenile();
    }

    $scope.Playlist_Ekle = function (isim) {

        if ($.trim(isim).length == 0) {
            $scope.kullaniciekle_sonuc = "Boş Alan Bırakmayınız!";
        } else {
            $http.post("/playlist_add", $scope.playlist).success(function (response) {
                if (response == "1") {
                    $scope.playlist_sonuc = "Lütfen! Farklı Bir Playlist Adı Deneyiniz.";
                } else {
                    $scope.playlist_sonuc = response;
                    $scope.playlist = "";
                }

            });
        }
        Yenile();
    }

    $scope.PlayListNameGuncelle = function (id, playListName) {
        if ($.trim(playListName).length == 0) {
            $scope.fieldisimguncelle_sonuc = "Lütfen Playlist Adı Giriniz!";
        } else {
            var veriler = { "id": id, "playListName": playListName };
            $http.put("/playListNameGuncelle", veriler).success(function (response) {

                if (response == "1") {
                    $scope.PlayListName_sonuc = "Lütfen Farklı Bir Playlist Adı Giriniz!";
                } else {
                    $scope.PlayListName_sonuc = response;
                    $scope.isim = "";
                    Yenile();
                }
            });
        }
    }


    $scope.Show_Playlist = function (isim) {

        console.log("a href " + isim);

    }


    //ADMİN GİRİŞ

    $scope.GirisYap = function (kadi, sifre) {
        var kadi1 = $.trim(kadi);
        var sifre1 = $.trim(sifre);


        if (kadi1.length == 0 || sifre1.length == 0) {
            $scope.giris_sonuc = "Boş Alan Bırakmayınız!";
        } else {
            var veriler = { "username": kadi1, "password": sifre1 };
            $http.post("/Giris-Yap", veriler).success(function (response) {
                if (response == "1") {
                    $scope.admin = "";
                    $scope.giris_sonuc = "GİRİŞ BAŞARIYLA YAPILDI.";
                    window.location.href = '/';
                } else {
                    $scope.giris_sonuc = response;
                }

            });
        }
    }


    $scope.SifreGuncelle = function (sifre, sifre1, sifre2) {
        var sifree = $.trim(sifre);
        var sifree1 = $.trim(sifre1);
        var sifree2 = $.trim(sifre2);


        if (sifree.length == 0 || sifree1.length == 0 || sifree2.length == 0) {
            $scope.sifreguncelle_sonuc = "Boş Alan Bırakmayınız!";
        } else {
            var veriler = { "password": sifree, "password1": sifree1, "password2": sifree2 };
            $http.put("/Sifre_Guncelle", veriler).success(function (response) {
                if (response == "1") {
                    $scope.admin = "";
                    $scope.sifreguncelle_sonuc = "ŞİFRENİZ BAŞARIYLA SIFIRLANDI.";
                    Yenile();
                } else {
                    $scope.sifreguncelle_sonuc = response;
                }

            });
        }

    }

    $scope.KadiGuncelle = function (kadi, kadi1, kadi2) {
        var kadii = $.trim(kadi);
        var kadii1 = $.trim(kadi1);
        var kadii2 = $.trim(kadi2);


        if (kadii.length == 0 || kadii1.length == 0 || kadii2.length == 0) {
            $scope.kadiguncelle_sonuc = "Boş Alan Bırakmayınız!";
        } else {
            var veriler = { "kadi": kadii, "kadi1": kadii1, "kadi2": kadii2 };
            console.log(veriler);
            $http.put("/Kadi_Guncelle", veriler).success(function (response) {
                if (response == "1") {
                    $scope.admin = "";
                    $scope.kadiguncelle_sonuc = "KULLANICI ADINIZ BAŞARIYLA SIFIRLANDI.";
                    Yenile();
                } else {
                    $scope.kadiguncelle_sonuc = response;
                }


            });
        }

    }


    $scope.EmailGuncelle = function (email, email1, email2) {
        var emaile = $.trim(email);
        var emaile1 = $.trim(email1);
        var emaile2 = $.trim(email2);


        if (emaile.length == 0 || emaile1.length == 0 || emaile2.length == 0) {
            $scope.emailguncelle_sonuc = "Boş Alan Bırakmayınız!";
        } else {
            var veriler = { "email": emaile, "email1": emaile1, "email2": emaile2 };
            console.log(veriler);
            $http.put("/Email_Guncelle", veriler).success(function (response) {
                if (response == "1") {
                    $scope.admin = "";
                    $scope.emailguncelle_sonuc = "E-MAİL ADRESİNİZ BAŞARIYLA SIFIRLANDI.";
                    Yenile();
                } else {
                    $scope.emailguncelle_sonuc = response;
                }


            });
        }

    }


    $scope.TelefonGuncelle = function (telefon, telefon1, telefon2) {
        var telefone = $.trim(telefon);
        var telefone1 = $.trim(telefon1);
        var telefone2 = $.trim(telefon2);


        if (telefone.length == 0 || telefone1.length == 0 || telefone2.length == 0) {
            $scope.telefonguncelle_sonuc = "Boş Alan Bırakmayınız!";
        } else {
            var veriler = { "telefon": telefone, "telefon1": telefone1, "telefon2": telefone2 };
            console.log(veriler);
            $http.put("/Telefon_Guncelle", veriler).success(function (response) {
                if (response == "1") {
                    $scope.admin = "";
                    $scope.telefonguncelle_sonuc = "TELEFON NUMARANIZ BAŞARIYLA SIFIRLANDI.";
                    Yenile();
                } else {
                    $scope.telefonguncelle_sonuc = response;
                }


            });
        }

    }
}]);
