# NoteEdit

Un gestor simple de notas con API REST construido con Node.js, Express y MongoDB.

## Características

- **Gestión de Usuarios**: Registro y autenticación con contraseñas encriptadas
- **Gestión de Notas**: Crear, leer, actualizar y eliminar notas
- **Control de Acceso**: Roles de usuario y administrador
- **Importar/Exportar**: Subir y descargar notas
- **Autenticación por Token**: Seguridad en las peticiones
- **Documentación API**: Swagger incluido
- **Tests**: Suite de pruebas con Jest

## Requisitos

- Node.js 20+
- MongoDB 4.4+

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd NoteEdit

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```


## Uso

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start

# Ver documentación API
http://localhost:3000/api-docs
```

## API Principal

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/usuarios` | Listar usuarios |
| GET | `/public` | Acceso público |
| GET | `/vip` | Acceso VIP (requiere token) |
| GET | `/admin` | Acceso admin |
| GET | `/notas` | Listar notas |
| POST | `/notas` | Crear nota |
| GET | `/notas/:id` | Obtener nota |
| PUT | `/notas/:id` | Actualizar nota |
| DELETE | `/notas/:id` | Eliminar nota (admin) |
| POST | `/notas/importar` | Importar notas |
| GET | `/notas/exportar` | Exportar notas |
| GET | `/notas/:id/archivo` | Descargar nota como archivo |
| GET | `/hora` | Obtener hora actual |

## Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Cobertura de tests
npm run test:coverage

# Tests con Postman
npm run test:postman
```


## Docker

```bash
# Con Docker Compose (incluye MongoDB)
docker-compose up -d

# O construir manualmente
docker build -t noteedit .
docker run -p 3000:3000 --env-file .env noteedit
```

## Estructura del Proyecto

```
src/
├── config/            # Configuración general
├── core/              # Infraestructura
│   ├── config/       # Carga de configuración
│   ├── loaders/      # Inicialización (Express, MongoDB)
│   ├── middlewares/  # Middlewares (auth, validación)
│   ├── routes/       # Rutas principales
│   ├── utils/        # Utilidades y logger
│   └── views/        # Vistas HTML
├── modules/           # Módulos de funcionalidad
│   ├── notas/        # Gestión de notas
│   ├── usuarios/     # Gestión de usuarios
│   ├── seguridad/    # Autenticación y acceso
│   └── hora/         # Utilidades de tiempo
├── openapi/          # Documentación API
├── tests/            # Tests
├── app.js            # Configuración Express
├── cli.js            # Interfaz de línea de comandos
├── config.js         # Configuración de entorno
└── index.js          # Punto de entrada
```

## Stack Tecnológico

- **Express 5.2** - Framework web
- **Mongoose 9.0** - ODM para MongoDB
- **bcrypt** - Encriptación de contraseñas
- **Zod** - Validación de datos
- **Winston** - Logging
- **Jest** - Testing
- **ESLint** - Linting

## CLI Interactivo

Menú interactivo con interfaz de usuario:

```bash
npm run cli:interactive
```

Características:
- **Verificación de token**
- Crear notas interactivamente
- Listar todas tus notas
- Ver nota completa
- Editar notas existentes
- Eliminar notas
- Generar tokens con bcrypt (opción 6)

Requiere que el servidor esté corriendo y `NOTEEDIT_URL` configurado en `.env`

**Para usar el CLI:**
1. Si no tienes token: ejecuta `npm run cli:interactive` y presiona opción 6 para generar uno
2. Copia el token generado en tu `.env` como `NOTEEDIT_TOKEN=<token>`
3. Reinicia el CLI para que se verifique el token

## CLI Tradicional

Herramienta de línea de comandos con flags:

```bash
# Generar token bcrypt
npm run cli -- token

# Probar conexión
npm run cli -- ping

# Listar notas
npm run cli -- notas listar

# Ver nota
npm run cli -- notas ver <id>

# Crear nota
npm run cli -- notas crear --titulo "Título" --contenido "Contenido"

# Editar nota
npm run cli -- notas editar <id> --titulo "Nuevo título"

# Eliminar nota
npm run cli -- notas borrar <id>
```

## Migraciones

```bash
# Migrar notas a MongoDB
npm run migrate:mongo
```

## Licencia

MIT
