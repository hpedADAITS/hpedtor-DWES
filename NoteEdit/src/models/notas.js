import { z } from 'zod';

const validarFecha = (valor) => !Number.isNaN(Date.parse(valor));

export const esquemaNotaId = z.object({
  id: z.string().min(1, { message: 'id requerido' }),
});

export const esquemaCrearNota = z.object({
  titulo: z.string().min(1, { message: 'titulo requerido' }),
  contenido: z.string().optional().default(''),
  categoria: z.string().optional().default('general'),
});

export const esquemaActualizarNota = z.object({
  titulo: z.string().min(1, { message: 'titulo vacio' }).optional(),
  contenido: z.string().optional(),
  categoria: z.string().optional(),
}).refine((datos) => datos.titulo || datos.contenido || datos.categoria, {
  message: 'titulo, contenido o categoria requerido',
});

export const esquemaListarNotasQuery = z.object({
  page: z.coerce.number()
    .int()
    .positive()
    .optional()
    .default(1),
  limit: z.coerce.number()
    .int()
    .positive()
    .max(100)
    .optional()
    .default(10),
  sort: z.enum(['creadaEn', 'actualizadaEn', 'titulo', 'tamano'])
    .optional()
    .default('actualizadaEn'),
  order: z.enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  tituloContiene: z.string().optional(),
  contenidoContiene: z.string().optional(),
  categoria: z.string().optional(),
  creadaDesde: z.string().optional().refine((v) => !v || validarFecha(v), { message: 'creadaDesde invalida' }),
  creadaHasta: z.string().optional().refine((v) => !v || validarFecha(v), { message: 'creadaHasta invalida' }),
  actualizadaDesde: z.string().optional().refine((v) => !v || validarFecha(v), { message: 'actualizadaDesde invalida' }),
  actualizadaHasta: z.string().optional().refine((v) => !v || validarFecha(v), { message: 'actualizadaHasta invalida' }),
});

export const esquemaImportarNotas = z.object({
  archivos: z.array(z.object({
    nombre: z.string().min(1, { message: 'nombre requerido' }),
    contenido: z.string().optional().default(''),
    categoria: z.string().optional().default('general'),
  })).min(1, { message: 'archivos requerido' }),
});
