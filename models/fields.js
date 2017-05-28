var mongoose = require('mongoose');

// User Schema
var FiledSchema = mongoose.Schema({
	isim: {
		type: String
	},
	personCount: {
		type: String, default: "0"
	},
	playListName: {
		type: String
	}

});

var Fields = module.exports = mongoose.model('fields', FiledSchema);

module.exports.createFields = function(newField, callback){
	newField.save(callback);
}

