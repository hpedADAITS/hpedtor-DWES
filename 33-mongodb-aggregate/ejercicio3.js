// ejercicio 3: en lugar de array de nombres, que sean objetos que contengan: nombre, año, valoración imdb, géneros

db.getCollection('movies').aggregate([
  {
    $match: {
      languages: 'Spanish',
      type: { $in: ['movie', 'series'] }
    }
  },
  {
    $group: {
      _id: null,
      titles: {
        $push: {
          nombre: '$title',
          año: '$year',
          valoracionImdb: '$imdb.rating',
          géneros: '$genres'
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      titles: 1
    }
  }
])
