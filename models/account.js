var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    config: {
      profile: { type: String, default: "default" }
    }
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
