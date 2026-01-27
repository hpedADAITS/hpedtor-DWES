// ejercicio 4: devolver las películas agrupadas
// - Primer nivel por género
// - Segundo nivel por año

db.getCollection('movies').aggregate([
  {
    $unwind: '$genres'
  },
  {
    $group: {
      _id: {
        genre: '$genres',
        year: '$year'
      },
      count: { $sum: 1 },
      movies: { $push: '$title' }
    }
  },
  {
    $group: {
      _id: '$_id.genre',
      years: {
        $push: {
          year: '$_id.year',
          count: '$count',
          movies: '$movies'
        }
      }
    }
  },
  {
    $sort: { _id: 1 }
  }
])
