const mongoose = require('mongoose');

const complexSchema = new mongoose.Schema({
  name: String,
  binary: Buffer,
  living: Boolean,
  updated: {
    type: Date,
    default: Date.now
  },
  age: {
    type: Number,
    min: 18,
    max: 65,
    required: true
  },
  mixed: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  price: mongoose.Schema.Types.Decimal128,
  tags: [],
  stringArray: [String],
  numberArray: [Number],
  dateArray: [Date],
  bufferArray: [Buffer],
  booleanArray: [Boolean],
  mixedArray: [mongoose.Schema.Types.Mixed],
  objectIdArray: [mongoose.Schema.Types.ObjectId],
  nestedArrays: [[]],
  arrayOfNumbers: [[Number]],
  address: {
    street: {
      type: String,
      lowercase: true,
      trim: true
    },
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  properties: Map,
  metadata: {
    type: Map,
    of: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  comments: [{
    author: String,
    text: String,
    date: { type: Date, default: Date.now }
  }],
  profile: {
    bio: String,
    profilePicture: Buffer,
    social: {
      twitter: String,
      github: String,
      linkedin: String
    }
  }
});

const ComplexModel = mongoose.model('ComplexModel', complexSchema);

module.exports = { ComplexModel };
