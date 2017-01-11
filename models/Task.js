var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var timespan = new Schema({
  startTime : { type: Date },
  stopTime: { type: Date },
  dt : { type: Number, default: 0}
})

var Task = new Schema( {
    id: String,
    desc: String,
    category: String,
    project: String,
    creationDate: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 },
    isPerforming: { type: Boolean, default: false},
    _creator: String,
    isCompleted: { type: Boolean, default: false},
    history : [ timespan ]
});

module.exports = mongoose.model('Task', Task);
