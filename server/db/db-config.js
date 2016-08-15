const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/web-worker');

var websiteSchema = mongoose.Schema({
  shortUrl: {
    type:String, required:true
  },
  fullUrl: {
    type:String, required:true
  },
  htmlContent: {
    type:String
  },
});

module.exports = mongoose.model('Website', websiteSchema);