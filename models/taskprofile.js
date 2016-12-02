var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskProfile = new Schema({
  name: String,
  projects: { type: Array, default: [] },
  categories: { type: Array, default: [] }
})

module.exports = mongoose.model('TaskProfile', TaskProfile);
