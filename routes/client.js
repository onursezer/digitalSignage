var express = require('express');
var router = express.Router();
var walk = require('walk');
var path = require('path');
var Fields = require("../models/fields");

router.get('/client/:id', function (req, res) {
    var clientName = req.params.id;
    console.log("client : " + clientName);
    Fields.count({ "isim": clientName }, function (err, say) {
        if (say == 0) {
            res.render("hata_sayfasi.handlebars", { title: "digitalBilgiEkraniPanel" });
        } else {

            Fields.findOne({ "isim": clientName }, function (err, obj) {

                var playListName = "";
                playListName = obj.playListName;
                var array = [];
                var address = "public/clients/";
                var addressClient = address.concat(playListName);

                var files = [];
                var walker = walk.walk(addressClient, { followLinks: false });
                walker.on('file', function (root, stat, next) {
                    var fileName = root + '/' + stat.name;
                    files.push(fileName);
                    next();
                });
                walker.on('end', function () {
                    //console.log(files);

                    var i;
                    for (i = 0; i < files.length; i++) {
                        array.push("<img src='/" + files[i] + "' width='800' height='620' />");
                    }
                    //console.log(array);
                    res.render('index.jade', { param1: JSON.stringify(array) });
                });

            });

        }
    });

});

module.exports = router;