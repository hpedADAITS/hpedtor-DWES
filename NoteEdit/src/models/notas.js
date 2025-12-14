import { z } from 'zod';

export const esquemaNotaId = z.object({
  id: z.string().min(1, { message: 'id requerido' }),
});

export const esquemaCrearNota = z.object({
  titulo: z.string().min(1, { message: 'titulo requerido' }),
  contenido: z.string().optional().default(''),
});

export const esquemaActualizarNota = z.object({
  titulo: z.string().min(1, { message: 'titulo vacio' }).optional(),
  contenido: z.string().optional(),
}).refine((datos) => datos.titulo || datos.contenido, {
  message: 'titulo o contenido requerido',
});
