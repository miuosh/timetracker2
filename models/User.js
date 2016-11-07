var mongoose = require('mongoose')
require('mongoose-long')(mongoose);


module.exports = mongoose.model('Task',{
    id: String,
    desc: String,
    category: String,
    creationDate: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 },
    isPerforming: { type: Boolean, default: false},
    _creator: String  
});
