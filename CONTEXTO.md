# Contexto del Proyecto: Merakiies

## 🍪 Descripción General
Merakiies es una aplicación web de e-commerce para la venta de galletas artesanales. Consta de un frontend renderizado estáticamente y un backend desarrollado en Node.js con una base de datos MySQL.

## 🏗️ Estructura de Directorios
El proyecto sigue una arquitectura clásica cliente-servidor, separada en carpetas:
- **`public/`**: Contiene todo el código del Frontend.
  - `index.html`: La Single Page Application (SPA).
  - `css/style.css`: Hojas de estilo puras.
  - `js/app.js`: Lógica de interacción (carrito, filtrado de productos).
- **`server/`**: Contiene la lógica del Backend.
  - `server.js`: API REST usando Express.js.
- **`database/`**: Contiene scripts de la Base de Datos.
  - `merakiies_db.sql`: Script de creación e inserción de datos inicial.

## 🛠️ Tecnologías Principales (Stack)
- **Frontend**: HTML5, CSS3, JavaScript Vanilla.
- **Backend**: Node.js, Express.js (Puerto 4000).
- **Base de Datos**: MySQL (Puerto 3306 comúnmente, usa XAMPP).
- **Dependencias (npm)**: `express`, `mysql2`, `cors`.

## ⚙️ Características Clave
1. **Autoconfiguración de Base de Datos**: El archivo `server.js` está configurado para que al iniciarse (`npm start`), se conecte al servidor MySQL local. Si la base de datos `merakiies_db` no existe, la crea, crea las tablas y la puebla utilizando el script `merakiies_db.sql` automáticamente.
2. **Servidor Unificado**: Express no solo expone las rutas `/api/*`, sino que también sirve los archivos estáticos de la carpeta `public/` en la ruta `/`.
3. **Persistencia del Carrito**: La aplicación del carrito de compras asocia los productos a un `session_id` que se gestiona desde el frontend.
4. **Flujo de Compra Directo (Sin Detalles Individuales)**: La aplicación no cuenta con una página de producto individual/específico. En su lugar:
   - Todos los productos se listan y visualizan directamente en la página/sección de menú.
   - Cada bloque de producto contiene un botón para agregar directamente al carrito, además de un control de entrada (input numérico) en el propio bloque para seleccionar y modificar la cantidad de galletas deseadas antes de añadir.

## 🚀 Flujo de Desarrollo (Dev Flow)
- Para iniciar el proyecto localmente, solo se necesita correr `npm start` desde la raíz.
- No es necesario ejecutar pasos manuales en phpMyAdmin, siempre y cuando MySQL esté activo localmente con usuario `root` y sin contraseña.

## 📈 Historial de Cambios y Ajustes Recientes

1. **Rediseño Completo de la Página Home**:
   - Se reemplazó la estructura original por un diseño moderno de Tailwind CSS importado de un boceto externo.
   - Para no desconfigurar el CSS nativo de la aplicación (`style.css`), se inyectó Tailwind con la opción `preflight: false` desactivada.

2. **Resolución de Espaciado Lateral Innecesario (Bordes en Home)**:
   - **Problema**: El diseño del Home presentaba bordes blancos gruesos a los costados debido a las reglas restrictivas de `max-width: 1200px` y `margin: 40px auto` asignadas de forma global a la etiqueta `<main>` en `style.css`.
   - **Solución**: Se liberó la etiqueta `<main>` para permitir que el Home ocupe el ancho completo de la pantalla, reubicando las restricciones restrictivas solo a las secciones heredadas del SPA (`main > section:not(#home)`).

3. **Reconfiguración de Enlaces del Header**:
   - Se actualizó la barra de navegación para incluir exactamente los enlaces: `Inicio`, `Menu` (vinculado a la sección de Catálogo), `Nosotros` y `Contacto` (vinculado mediante un ancla `#contacto` al pie de página).

4. **Corrección de Enlaces Invisibles (Conflicto de Clases)**:
   - **Problema**: Los enlaces de navegación desaparecieron por completo en el header. Esto ocurrió porque Tailwind oculta elementos usando la clase `.hidden` combinada con media queries (`hidden md:flex`). Sin embargo, el archivo `style.css` original declaraba `.hidden { display: none !important; }`, anulando el comportamiento responsivo de Tailwind y escondiéndolos permanentemente.
   - **Solución**: Se renombró la clase global de `style.css` a `.app-hidden` y se actualizaron las referencias de manipulación del DOM en `app.js` y en la sección del carrito de `index.html` para usar `.app-hidden`. De esta forma, Tailwind pudo operar su visibilidad con normalidad sin romper el ocultamiento del carrito.

5. **Extracción y Unificación del Header (Navbar)**:
   - **Mejora**: Para evitar la duplicación de código y mantener una experiencia consistente, se extrajo el HTML del header a un archivo independiente `public/components/header.html`.
   - Se creó el script `public/js/components.js` que inyecta este componente dinámicamente tanto en `index.html` como en `menu.html` tan pronto como el DOM carga.

6. **Consolidación de Estilos y Configuración Tailwind**:
   - **Mejora**: La configuración personalizada de Tailwind (colores, fuentes) que residía incrustada en `index.html` se movió a un archivo externo compartido `public/js/tailwind-theme.js`. Ambos archivos (`index.html` y `menu.html`) ahora importan esta configuración y la hoja base `style.css` garantizando un diseño 100% idéntico entre páginas.

7. **Corrección de Navegación Inter-páginas (SPA vs Multipágina)**:
   - **Problema**: El header unificado utilizaba botones pensados exclusivamente para el SPA de `index.html` (`data-target`), por lo que al hacer clic desde `menu.html` los enlaces estaban rotos o no hacían nada.
   - **Solución**: Se cambiaron los botones del header por etiquetas `<a>` con rutas absolutas (ej. `/index.html#home`). En el script SPA (`app.js`), se añadió lógica para interceptar estos clics si el usuario está en el index, manteniendo la navegación fluida (sin recargar la página). Adicionalmente, `app.js` ahora lee el "hash" de la URL al cargar la página para abrir automáticamente la sección correcta si el usuario navega desde `menu.html` hacia el home.

8. **Integración de las Páginas "Nosotros" y "Contacto"**:
    - **Mejora**: Se añadieron las nuevas páginas `public/html/nosotros.html` y `public/html/contacto.html` al diseño multipágina.
    - Se eliminaron sus barras de navegación fijas (hardcodeadas) y los bloques inline de configuración de Tailwind.
    - Se adaptaron ambas páginas para inyectar dinámicamente el componente común `header.html` e importar el tema unificado (`tailwind-theme.js`) junto al estilo base (`style.css`).
    - Se actualizó el script `components.js` para que identifique la ruta actual de estas páginas (`nosotros.html` y `contacto.html`) y aplique el estilo visual activo correspondiente a los enlaces del navbar.
