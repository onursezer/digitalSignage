var config = require('../config');
var express = require('express');
var router = express.Router();
var http = require('http');
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var crypto = require("crypto");

// Upload route.
router.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var id = crypto.randomBytes(3).toString('hex');
        var old_path = files.file.path,
            file_size = files.file.size,
            file_ext = files.file.name.split('.').pop(),
            index = old_path.lastIndexOf('/') + 1,
            file_name = old_path.substr(index),
            new_path = path.join(process.env.PWD, config.FOLDERNAME, id + '.' + file_ext);

        fs.readFile(old_path, function (err, data) {
            fs.writeFile(new_path, data, function (err) {
                fs.unlink(old_path, function (err) {
                    if (err) {
                        res.status(500);
                        res.json({ 'success': false });
                    } else {
                        fs.readdir(config.UPLOADDIR, function (err, list) {
                            if (err)
                                throw err;
                            console.log(list);
                            res.render('fileUpload.jade', { fileList: list });
                        });

                    }
                });
            });
        });
    });
});

router.get('/Playlist/:id', function (req, res) {
    console.log("path : " + req.path);

    config.UPLOADDIR = "public/clients/" + req.params.id + "/";
    config.FOLDERNAME = "/public/clients/" + req.params.id + "/";
    fs.readdir(config.UPLOADDIR, function (err, list) {
        if (err)
            throw err;
        console.log(list);
        res.render('fileUpload.jade', { fileList: list });
    });

});

router.get('/deleteFile/:file', function (req, res) {
    var targetPath = config.UPLOADDIR + req.param("file");

    fs.unlink(targetPath, function (err) {
        if (err) {
            res.send("Error to delete file: " + err);
        } else {
            res.send("File deleted successfully!");
        }
    })


});

router.get('/filelist', function (req, res) {
    fs.readdir(config.UPLOADDIR, function (err, list) {
        if (err)
            throw err;
        res.render('filelist.jade', { fileList: list, folderName: config.FOLDERNAME });
    });

});

module.exports = router;
