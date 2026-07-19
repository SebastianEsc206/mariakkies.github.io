# 🍪 Merakiies - Galletas Artesanales

E-commerce de galletas artesanales construido con Node.js, Express y MySQL.

---

## 📋 Requisitos Previos

Antes de clonar este proyecto, asegúrate de tener instalados los siguientes programas en tu computadora:

### 1. Node.js (v18 o superior)
Motor de JavaScript necesario para ejecutar el servidor backend.

- **Descarga:** [https://nodejs.org/](https://nodejs.org/)
- Selecciona la versión **LTS** (recomendada).
- Para verificar que está instalado, abre una terminal y ejecuta:
  ```bash
  node -v
  npm -v
  ```

### 2. XAMPP
Proporciona el servidor de base de datos **MySQL/MariaDB** que la aplicación necesita para funcionar.

- **Descarga:** [https://www.apachefriends.org/](https://www.apachefriends.org/)
- Solo necesitas el módulo de **MySQL** activo desde el Panel de Control de XAMPP.

> **Nota:** También puedes usar cualquier otra instalación de MySQL o MariaDB que tengas disponible, siempre y cuando esté corriendo en `localhost` con el usuario `root` y sin contraseña (configuración por defecto de XAMPP).

### 3. Git
Necesario para clonar el repositorio desde GitHub.

- **Descarga:** [https://git-scm.com/](https://git-scm.com/)
- Para verificar que está instalado:
  ```bash
  git --version
  ```

---

## 🚀 Instalación y Ejecución

Sigue estos pasos en orden para poner el proyecto en marcha:

```bash
# 1. Clonar el repositorio
git clone https://github.com/SebastianEsc206/mariakkies.github.io.git

# 2. Entrar en la carpeta del proyecto
cd mariakkies.github.io

# 3. Instalar las dependencias de Node.js
npm install

# 4. Asegúrate de que MySQL esté corriendo en XAMPP (módulo MySQL en "Start")

# 5. Iniciar el servidor
npm start
```

> ✅ **No necesitas crear la base de datos manualmente.** Al ejecutar `npm start`, el servidor detecta automáticamente si la base de datos `merakiies_db` no existe y la crea junto con todas sus tablas y datos de ejemplo.

Una vez iniciado, abre tu navegador y visita:

🌐 **http://localhost:4000**

---

## 📁 Estructura del Proyecto

```
mariakkies.github.io/
├── public/                  # Archivos del frontend (servidos al navegador)
│   ├── index.html           # Página principal del frontend (SPA)
│   ├── css/
│   │   └── style.css        # Estilos de la interfaz
│   └── js/
│       └── app.js           # Lógica del frontend (catálogo, carrito, búsqueda)
├── server/                  # Lógica del backend
│   └── server.js            # Servidor Express + MySQL
├── database/                # Scripts de base de datos
│   └── merakiies_db.sql     # Estructura y datos iniciales
├── .gitignore               # Archivos excluidos del repositorio
├── README.md                # Documentación del proyecto
└── package.json             # Dependencias y scripts de Node.js
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| **HTML/CSS/JS** | Frontend (interfaz de usuario) |
| **Node.js** | Entorno de ejecución del servidor |
| **Express** | Framework para la API REST |
| **MySQL/MariaDB** | Base de datos relacional |
| **mysql2** | Driver de conexión a MySQL desde Node.js |

---

## 📦 Dependencias del Proyecto

Estas se instalan automáticamente al ejecutar `npm install`:

- `express` - Framework web para Node.js
- `mysql2` - Conector de MySQL para Node.js
- `cors` - Middleware para permitir peticiones de origen cruzado
- `bcryptjs` - Hash de contraseñas
- `jsonwebtoken` - Autenticación con JWT

---

## 🗄️ Base de Datos

Al ejecutar `npm start` por primera vez, el servidor:

1. Se conecta a MySQL en `localhost` (usuario `root`, sin contraseña).
2. Crea la base de datos `merakiies_db` si no existe.
3. Si no encuentra la tabla `products`, ejecuta automáticamente `database/merakiies_db.sql`.
4. Inserta categorías, productos, usuario admin y configuración de delivery.

Tablas creadas automáticamente:

- **`categories`** - Categorías del catálogo
- **`products`** - Productos con precio, imagen, stock, badge y ventas
- **`users`** - Usuarios registrados (clientes y admin)
- **`addresses`** - Direcciones de entrega
- **`cart_items`** - Carrito por sesión o usuario autenticado
- **`orders`** / **`order_items`** - Pedidos y su detalle
- **`payments`** - Registro de pagos
- **`contact_messages`** - Mensajes del formulario de contacto
- **`delivery_config`** - WhatsApp y nombre del repartidor

### Cuentas de prueba (instaladas automáticamente)

Estas cuentas se crean al ejecutar `npm start` por primera vez. Las contraseñas se generan con bcrypt en el primer arranque del servidor.

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@gmail.com` | `admin` |
| Cliente | `cliente@gmail.com` | `cliente` |

---

## 👥 Autores

Hecho con ❤️ para Luis Uribe.