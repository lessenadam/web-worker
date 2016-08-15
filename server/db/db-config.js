const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')

mongoose.connect('mongodb://localhost/web-worker');

var websiteSchema = mongoose.Schema({
  shortUrl: {
    type:String, required:true, unique: true
  },
  fullUrl: {
    type:String, required:true, unique: true
  },
  htmlContent: {
    type:String
  },
});

websiteSchema.plugin(findOrCreate);

module.exports = mongoose.model('Website', websiteSchema);