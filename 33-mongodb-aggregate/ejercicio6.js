// ejercicio 6: agrupar las películas por categorías
// - Coger sólo: nombre, año, valoración media calculada

db.getCollection('movies').aggregate([
  {
    $unwind: '$genres'
  },
  {
    $group: {
      _id: '$genres',
      movies: {
        $push: {
          nombre: '$title',
          año: '$year',
          rating: '$imdb.rating'
        }
      },
      averageRating: { $avg: '$imdb.rating' }
    }
  },
  {
    $project: {
      _id: 0,
      categoria: '$_id',
      valoracionMedia: { $round: ['$averageRating', 2] },
      películas: {
        $map: {
          input: '$movies',
          as: 'movie',
          in: {
            nombre: '$$movie.nombre',
            año: '$$movie.año'
          }
        }
      }
    }
  },
  {
    $sort: { categoria: 1 }
  }
])
