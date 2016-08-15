const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

mongoose.connect('mongodb://localhost/web-worker');

const websiteSchema = mongoose.Schema({
  fullUrl: {
    type: String, required: true, unique: true,
  },
  htmlContent: {
    type: String,
  },
});

websiteSchema.plugin(findOrCreate);

module.exports = mongoose.model('Website', websiteSchema);
