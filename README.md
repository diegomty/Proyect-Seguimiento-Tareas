# Aplicación de Seguimiento de Tareas (Todo App Full-Stack)

Este proyecto es una aplicación web full-stack para el seguimiento de tareas (Todo App) que permite a los usuarios gestionar objetivos y las tareas asociadas necesarias para alcanzarlos. La aplicación implementa funcionalidades CRUD completas para ambas entidades.

## Descripción del Proyecto

El objetivo principal de esta aplicación es proporcionar una herramienta intuitiva para organizar metas personales o profesionales. Los usuarios pueden definir "Objetivos" generales, cada uno con una fecha de inicio y una fecha planeada de finalización. Dentro de cada objetivo, se pueden crear "Tareas" más pequeñas y específicas, cada una con un título y una descripción, que contribuyen a la consecución del objetivo principal.

## Características Principales

* **Gestión de Objetivos:**
    * Crear nuevos objetivos con nombre, fecha de inicio y fecha planeada final.
    * Ver una lista de todos los objetivos.
    * Ver los detalles de un objetivo específico.
    * Actualizar la información de un objetivo existente.
    * Eliminar objetivos (esto también eliminará todas las tareas asociadas).
* **Gestión de Tareas:**
    * Crear nuevas tareas asociadas a un objetivo específico, con título y descripción.
    * Ver todas las tareas listadas dentro de la página de detalles de su objetivo padre.
    * Marcar tareas como completadas o incompletas.
    * Eliminar tareas individuales.
* **Interfaz de Usuario Reactiva:** Construida con React para una experiencia de usuario fluida y dinámica.
* **Navegación Intuitiva:** Uso de `react-router-dom` para una navegación clara entre las diferentes secciones de la aplicación.
* **Comunicación API:** Interacción eficiente entre el frontend y el backend mediante una API RESTful.
* **Diseño Básico Mejorado:** Estilos aplicados para una mejor presentación visual y usabilidad.

## Tecnologías Utilizadas

Este proyecto se construyó utilizando MySQL y otras herramientas modernas de desarrollo web:

### Frontend:

* **React (v18+):** Biblioteca de JavaScript para construir interfaces de usuario.
* **Vite:** Herramienta de frontend de próxima generación para un desarrollo y empaquetado rápidos.
* **JavaScript (ES6+):** Lenguaje de programación principal para la lógica del frontend.
* **React Router DOM (v6):** Para la gestión de rutas y navegación del lado del cliente.
* **Axios:** Cliente HTTP basado en promesas para realizar peticiones a la API backend.
* **CSS3:** Para el diseño y la presentación visual de la aplicación (estilos globales y por componente/página).
* **HTML5:** Estructura semántica de las páginas.

### Backend:

* **Node.js:** Entorno de ejecución de JavaScript del lado del servidor.
* **Express.js:** Framework minimalista y flexible para Node.js, utilizado para construir la API RESTful.
* **MySQL2:** Cliente de Node.js para MySQL, con soporte para promesas.
* **CORS:** Middleware para habilitar el Intercambio de Recursos de Origen Cruzado.
* **Dotenv:** Módulo para cargar variables de entorno desde un archivo `.env`.

### Base de Datos:

* **MySQL:** Sistema de gestión de bases de datos relacional para almacenar los datos de los objetivos y tareas.

### Estructura del Proyecto:

* **Monorepo (conceptual):** El proyecto está organizado con carpetas separadas para `backend` y `frontend`, facilitando el desarrollo y despliegue independiente o conjunto.

## Proceso de Desarrollo

La aplicación fue desarrollada siguiendo un proceso guiado paso a paso, cubriendo:
1.  Configuración del entorno y estructura del proyecto.
2.  Diseño y creación del esquema de la base de datos MySQL.
3.  Desarrollo del backend con Node.js y Express, implementando la API RESTful y la lógica de negocio.
4.  Desarrollo del frontend con React y Vite, creando componentes, gestionando el estado y conectando con el backend.
5.  Mejoras visuales básicas para la interfaz de usuario.


## Posibles Futuras Mejoras

* Autenticación de usuarios.
* Notificaciones más avanzadas.
---
