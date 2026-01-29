const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const weatherDataSchema = new mongoose.Schema({}, { strict: false });
weatherDataSchema.plugin(mongoosePaginate);

const WeatherData = mongoose.model('WeatherData', weatherDataSchema, 'data');

async function weatherPaginationPlugin(page = 1, pageSize = 10) {
  try {
    const options = {
      page,
      limit: pageSize,
      lean: true
    };
    
    const result = await WeatherData.paginate({}, options);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = { weatherPaginationPlugin };
