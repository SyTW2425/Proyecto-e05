import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  profilePicture: { type: String, default: '/default-profile.png' },
})

export const User = mongoose.model('User', userSchema);