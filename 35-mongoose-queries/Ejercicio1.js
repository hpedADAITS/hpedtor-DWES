const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({}, { strict: false });
const WeatherData = mongoose.model('WeatherData', weatherDataSchema, 'data');

async function weatherPaginationNative(page = 1, pageSize = 10) {
  try {
    const skip = (page - 1) * pageSize;
    const total = await WeatherData.countDocuments();
    const data = await WeatherData.find()
      .skip(skip)
      .limit(pageSize)
      .exec();
    
    return {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      data
    };
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = { weatherPaginationNative };
