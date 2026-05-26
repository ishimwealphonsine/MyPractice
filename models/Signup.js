const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default ?? require('passport-local-mongoose');

const signupSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
}, { timestamps: true });

signupSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('Signup', signupSchema);