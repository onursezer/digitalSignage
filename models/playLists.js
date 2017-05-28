var mongoose = require('mongoose');

// User Schema


var PlayListSchema = mongoose.Schema({
    playListName: {
        type: String,
        default: null
    },
    list: [
        {
            type: String,
            default: null
        }]

});

var PlayLists = module.exports = mongoose.model('playLists', PlayListSchema);

module.exports.createPlayList = function (newField, callback) {
    newField.save(callback);
}
