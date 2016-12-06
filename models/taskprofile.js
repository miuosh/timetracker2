var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskProfile = new Schema({
  name: { type: String, unique: true },
  projects: { type: Array, default: [] },
  categories: { type: Array, default: [] }
})

module.exports = mongoose.model('TaskProfile', TaskProfile);
