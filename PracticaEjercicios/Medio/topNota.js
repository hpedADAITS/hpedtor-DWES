function NotaTop(alumnos) {
  return alumnos.map(({ name, notes }) => ({
    name,
    topNote: Math.max(...notes)
  }));
}
