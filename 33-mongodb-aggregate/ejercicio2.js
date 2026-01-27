// ejercicio 2: añadir los nombres de cada película en un array

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
        $push: '$title'
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
