// ejercicio 5: agrupar las películas por valoración
// - La agrupación se hace por valores enteros
// - Ej: en la categoría 7 estarán todos los comprendidos entre [7, 8)

db.getCollection('movies').aggregate([
  {
    $match: {
      'imdb.rating': { $exists: true, $ne: null, $ne: '' }
    }
  },
  {
    $addFields: {
      numericRating: { $toDouble: '$imdb.rating' },
      ratingCategory: {
        $floor: { $toDouble: '$imdb.rating' }
      }
    }
  },
  {
    $group: {
      _id: '$ratingCategory',
      count: { $sum: 1 },
      movies: { $push: '$title' },
      averageRating: { $avg: '$numericRating' }
    }
  },
  {
    $sort: { _id: 1 }
  }
])
