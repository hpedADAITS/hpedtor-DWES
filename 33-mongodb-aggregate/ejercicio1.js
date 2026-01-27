// ejercicio 1: devolver la cuenta de cuántas películas y series hay en español

db.getCollection('movies').aggregate([
  {
    $match: {
      languages: 'Spanish',
      type: { $in: ['movie', 'series'] }
    }
  },
  {
    $count: 'total'
  }
])
