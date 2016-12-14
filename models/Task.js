var mongoose = require('mongoose')
var Schema = mongoose.Schema;

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
    isCompleted: { type: Boolean, default: false}
});

module.exports = mongoose.model('Task', Task);
