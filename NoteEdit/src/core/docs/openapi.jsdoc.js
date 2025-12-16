/**
 * @openapi
 * openapi: 3.0.3
 * info:
 *   title: NoteEdit API
 *   version: 1.0.0
 *   description: API REST para el gestor de notas con autenticación por token (bcrypt) y roles.
 * servers:
 *   - url: http://localhost:3000
 * tags:
 *   - name: Sistema
 *     description: Endpoints de verificación y páginas estáticas.
 *   - name: Externo
 *     description: Integraciones con servicios externos (APIs de terceros).
 *   - name: Seguridad
 *     description: Rutas de ejemplo para control de acceso (public/vip/admin).
 *   - name: Usuarios
 *     description: Endpoints básicos de usuarios.
 *   - name: Notas
 *     description: CRUD de notas con filtros, ordenación y paginación.
 * components:
 *   securitySchemes:
 *     TokenAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: >
 *         Enviar `Bearer <hash bcrypt de "I know your secret">`
 *         (o usar cabecera `x-token`).
 *     Rol:
 *       type: apiKey
 *       in: header
 *       name: x-rol
 *       description: Rol del usuario (`usuario` o `admin`).
 *     AdminUsuario:
 *       type: apiKey
 *       in: header
 *       name: x-usuario
 *       description: Usuario admin (debe coincidir con `ADMIN_USER`).
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *     Nota:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         titulo:
 *           type: string
 *         contenido:
 *           type: string
 *         categoria:
 *           type: string
 *         creadaEn:
 *           type: string
 *         actualizadaEn:
 *           type: string
 *     CrearNota:
 *       type: object
 *       required: [titulo]
 *       properties:
 *         titulo:
 *           type: string
 *         contenido:
 *           type: string
 *         categoria:
 *           type: string
 *     ActualizarNota:
 *       type: object
 *       properties:
 *         titulo:
 *           type: string
 *         contenido:
 *           type: string
 *         categoria:
 *           type: string
 *     ImportarNotas:
 *       type: object
 *       required: [archivos]
 *       properties:
 *         archivos:
 *           type: array
 *           items:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *               contenido:
 *                 type: string
 *               categoria:
 *                 type: string
 *
 * paths:
 *   /ping:
 *     get:
 *       tags: [Sistema]
 *       summary: Ping
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             text/plain:
 *               schema:
 *                 type: string
 *   /page:
 *     get:
 *       tags: [Sistema]
 *       summary: Página HTML de ejemplo
 *       responses:
 *         "200":
 *           description: OK
 *   /error:
 *     get:
 *       tags: [Sistema]
 *       summary: Página HTML de error (404)
 *       responses:
 *         "404":
 *           description: Not Found
 *
 *   /hora:
 *     get:
 *       tags: [Externo]
 *       summary: Hora actual desde WorldTimeAPI
 *       responses:
 *         "200":
 *           description: OK
 *         "500":
 *           description: Error del servidor (o del servicio externo)
 *
 *   /public:
 *     get:
 *       tags: [Seguridad]
 *       summary: Acceso público
 *       responses:
 *         "200":
 *           description: OK
 *   /vip:
 *     get:
 *       tags: [Seguridad]
 *       summary: Acceso autenticado (vip)
 *       security:
 *         - TokenAuth: []
 *           Rol: []
 *       responses:
 *         "200":
 *           description: OK
 *         "401":
 *           description: No autorizado
 *           content:
 *             application/json:
 *               schema: { $ref: "#/components/schemas/Error" }
 *         "403":
 *           description: Prohibido
 *           content:
 *             application/json:
 *               schema: { $ref: "#/components/schemas/Error" }
 *   /admin:
 *     get:
 *       tags: [Seguridad]
 *       summary: Acceso admin
 *       security:
 *         - TokenAuth: []
 *           Rol: []
 *           AdminUsuario: []
 *       responses:
 *         "200":
 *           description: OK
 *         "401":
 *           description: No autorizado
 *           content:
 *             application/json:
 *               schema: { $ref: "#/components/schemas/Error" }
 *         "403":
 *           description: Prohibido
 *           content:
 *             application/json:
 *               schema: { $ref: "#/components/schemas/Error" }
 *
 *   /usuarios:
 *     get:
 *       tags: [Usuarios]
 *       summary: Listar usuarios (demo)
 *       responses:
 *         "200":
 *           description: OK
 *
 *   /notas:
 *     get:
 *       tags: [Notas]
 *       summary: Listar notas (paginado)
 *       security:
 *         - TokenAuth: []
 *           Rol: []
 *       parameters:
 *         - in: query
 *           name: page
 *           schema: { type: integer, minimum: 1, default: 1 }
 *         - in: query
 *           name: limit
 *           schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *         - in: query
 *           name: sort
 *           schema:
 *             type: string
 *             enum: [creadaEn, actualizadaEn, titulo, tamano]
 *             default: actualizadaEn
 *         - in: query
 *           name: order
 *           schema: { type: string, enum: [asc, desc], default: desc }
 *         - in: query
 *           name: tituloContiene
 *           schema: { type: string }
 *         - in: query
 *           name: contenidoContiene
 *           schema: { type: string }
 *         - in: query
 *           name: categoria
 *           schema: { type: string }
 *         - in: query
 *           name: creadaDesde
 *           schema: { type: string }
 *         - in: query
 *           name: creadaHasta
 *           schema: { type: string }
 *         - in: query
 *           name: actualizadaDesde
 *           schema: { type: string }
 *         - in: query
 *           name: actualizadaHasta
 *           schema: { type: string }
 *       responses:
 *         "200":
 *           description: OK
 *         "400":
 *           description: Query inválida
 *         "401":
 *           description: No autorizado
 *         "403":
 *           description: Prohibido
 *     post:
 *       tags: [Notas]
 *       summary: Crear nota
 *       security:
 *         - TokenAuth: []
 *           Rol: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/CrearNota" }
 *       responses:
 *         "201":
 *           description: Creada
 *         "400":
 *           description: Datos inválidos
 *         "401":
 *           description: No autorizado
 *         "403":
 *           description: Prohibido
 *
 *   /notas/exportar:
 *     get:
 *       tags: [Notas]
 *       summary: Exportar notas (JSON con contenido .note)
 *       security:
 *         - TokenAuth: []
 *           Rol: []
 *       responses:
 *         "200":
 *           description: OK
 *
 *   /notas/importar:
 *     post:
 *       tags: [Notas]
 *       summary: Importar notas (crea múltiples)
 *       security:
 *         - TokenAuth: []
 *           Rol: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ImportarNotas" }
 *       responses:
 *         "201":
 *           description: Creadas
 *         "400":
 *           description: Datos inválidos
 *
 *   /notas/{id}:
 *     get:
 *       tags: [Notas]
 *       summary: Obtener una nota
 *       security:
 *         - TokenAuth: []
 *           Rol: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema: { type: string }
 *       responses:
 *         "200":
 *           description: OK
 *         "404":
 *           description: No encontrada
 *     put:
 *       tags: [Notas]
 *       summary: Editar una nota
 *       security:
 *         - TokenAuth: []
 *           Rol: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema: { type: string }
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ActualizarNota" }
 *       responses:
 *         "200":
 *           description: OK
 *         "400":
 *           description: Datos inválidos
 *         "404":
 *           description: No encontrada
 *     delete:
 *       tags: [Notas]
 *       summary: Borrar una nota (solo admin)
 *       security:
 *         - TokenAuth: []
 *           Rol: []
 *           AdminUsuario: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema: { type: string }
 *       responses:
 *         "200":
 *           description: OK
 *         "401":
 *           description: No autorizado
 *         "403":
 *           description: Prohibido
 *         "404":
 *           description: No encontrada
 *
 *   /notas/{id}/archivo:
 *     get:
 *       tags: [Notas]
 *       summary: Exportar una nota como archivo .note
 *       security:
 *         - TokenAuth: []
 *           Rol: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema: { type: string }
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             text/plain:
 *               schema:
 *                 type: string
 *         "404":
 *           description: No encontrada
 */

export default {};
