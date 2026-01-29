const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  console.log(`Pre-save: User "${this.name}" about to be saved`);
  this.updatedAt = Date.now();
  next();
});

userSchema.post('save', function(doc) {
  console.log(`Post-save: User "${doc.name}" successfully saved with ID: ${doc._id}`);
});

userSchema.pre('find', function(next) {
  console.log('Pre-find: About to execute find query');
  next();
});

userSchema.post('find', function(docs) {
  console.log(`Post-find: Found ${docs.length} documents`);
});

userSchema.pre('findOneAndUpdate', function(next) {
  console.log('Pre-findOneAndUpdate: About to update document');
  this.set({ updatedAt: Date.now() });
  next();
});

userSchema.pre('deleteOne', function(next) {
  console.log(`Pre-delete: About to delete user with ID: ${this._id}`);
  next();
});

userSchema.post('deleteOne', function() {
  console.log('Post-delete: Document successfully deleted');
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
