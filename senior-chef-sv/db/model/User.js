const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  openid: { type: String, required: true, unique: true },
  nickname: { 
    type: String,  
    default: "",
  },
  avatarUrl: { type: String, default: '' },
  gender: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  collections: { type: [Object], default: [] }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);