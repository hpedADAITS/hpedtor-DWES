const mongoose = require('mongoose');

const colorValidationSchema = new mongoose.Schema({
  selectedColor: {
    type: String,
    required: true
  },
  colorList: {
    type: [String],
    required: true
  }
});

colorValidationSchema.path('selectedColor').validate(function(value) {
  return this.colorList.includes(value);
}, 'Selected color must be in the color list');

colorValidationSchema.path('selectedColor').validate(async function(value) {
  const validColors = this.colorList;
  return validColors.includes(value);
}, 'Selected color must be in the color list');

colorValidationSchema.methods.validateColor = function() {
  if (!this.colorList.includes(this.selectedColor)) {
    throw new Error('Selected color must be in the color list');
  }
};

colorValidationSchema.pre('save', function(next) {
  if (!this.colorList.includes(this.selectedColor)) {
    next(new Error('Selected color must be in the color list'));
  } else {
    next();
  }
});

const ColorValidation = mongoose.model('ColorValidation', colorValidationSchema);

module.exports = { ColorValidation };
