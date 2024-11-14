import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true }, //this serves as de facto id
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List'}],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],


})

export const User = mongoose.model('User', userSchema);