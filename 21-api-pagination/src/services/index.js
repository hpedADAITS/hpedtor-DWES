const libros = [
  {
    id: 1, titulo: 'The Great Gatsby', autor: 'F. Scott Fitzgerald', año: 1925, paginas: 180,
  },
  {
    id: 2, titulo: 'To Kill a Mockingbird', autor: 'Harper Lee', año: 1960, paginas: 281,
  },
  {
    id: 3, titulo: '1984', autor: 'George Orwell', año: 1949, paginas: 328,
  },
  {
    id: 4, titulo: 'Pride and Prejudice', autor: 'Jane Austen', año: 1813, paginas: 432,
  },
  {
    id: 5, titulo: 'The Catcher in the Rye', autor: 'J.D. Salinger', año: 1951, paginas: 277,
  },
  {
    id: 6, titulo: 'Brave New World', autor: 'Aldous Huxley', año: 1932, paginas: 288,
  },
  {
    id: 7, titulo: 'Jane Eyre', autor: 'Charlotte Brontë', año: 1847, paginas: 507,
  },
  {
    id: 8, titulo: 'Wuthering Heights', autor: 'Emily Brontë', año: 1847, paginas: 323,
  },
  {
    id: 9, titulo: 'The Hobbit', autor: 'J.R.R. Tolkien', año: 1937, paginas: 310,
  },
  {
    id: 10, titulo: 'Dune', autor: 'Frank Herbert', año: 1965, paginas: 688,
  },
  {
    id: 11, titulo: 'The Lord of the Rings', autor: 'J.R.R. Tolkien', año: 1954, paginas: 1178,
  },
  {
    id: 12, titulo: 'Harry Potter', autor: 'J.K. Rowling', año: 1997, paginas: 309,
  },
];

async function obtenerLibros(query = {}) {
  let filtrados = [...libros];

  // filtros
  if (query.autor) {
    filtrados = filtrados.filter((lib) => lib.autor
      .toLowerCase()
      .includes(query.autor.toLowerCase()));
  }

  if (query.minYear) {
    const minAño = parseInt(query.minYear, 10);
    filtrados = filtrados.filter((lib) => lib.año >= minAño);
  }

  if (query.maxYear) {
    const maxAño = parseInt(query.maxYear, 10);
    filtrados = filtrados.filter((lib) => lib.año <= maxAño);
  }

  if (query.titulo) {
    filtrados = filtrados.filter((lib) => lib.titulo
      .toLowerCase()
      .includes(query.titulo.toLowerCase()));
  }

  // ordenamiento
  const ordenarPor = query.sortBy || 'id';
  const orden = query.sortOrder === 'desc' ? -1 : 1;

  filtrados.sort((a, b) => {
    const aVal = a[ordenarPor];
    const bVal = b[ordenarPor];

    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal) * orden;
    }
    return (aVal - bVal) * orden;
  });

  // paginacion con offset
  const offset = Math.max(0, parseInt(query.offset, 10) || 0);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 5));
  const paginados = filtrados.slice(offset, offset + limit);

  return {
    total: filtrados.length,
    values: paginados,
  };
}

async function obtenerLibroId(id) {
  return libros.find((lib) => lib.id === parseInt(id, 10));
}

async function crearLibro(datos) {
  const libro = {
    id: Math.max(...libros.map((lib) => lib.id), 0) + 1,
    ...datos,
  };
  libros.push(libro);
  return libro;
}

async function actualizarLibro(id, datos) {
  const libro = libros.find((lib) => lib.id === parseInt(id, 10));
  if (!libro) return null;
  Object.assign(libro, datos);
  return libro;
}

async function eliminarLibro(id) {
  const index = libros.findIndex((lib) => lib.id === parseInt(id, 10));
  if (index === -1) return null;
  const [libro] = libros.splice(index, 1);
  return libro;
}

module.exports = {
  obtenerLibros,
  obtenerLibroId,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
};
