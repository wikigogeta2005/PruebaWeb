# PostManager App 🚀

Una aplicación web interactiva e intuitiva diseñada para gestionar publicaciones (posts) consumiendo la API de prueba **JSONPlaceholder**. La aplicación permite realizar todas las operaciones CRUD fundamentales utilizando diferentes métodos HTTP (`GET`, `POST`, `PATCH`, `DELETE`) combinados con un sistema de persistencia local.

## ✨ Características principales

*   **Listar Posts (GET):** Recupera y renderiza dinámicamente las publicaciones desde la API o el almacenamiento local.
*   **Búsqueda y Filtrado (GET):** Permite buscar un post específico por su ID o filtrar listas completas por el ID de usuario (`userId`).
*   **Creación de Posts (POST):** Formulario integrado para añadir nuevas publicaciones que se guardan de inmediato.
*   **Modificación Parcial (PATCH):** Ventana modal integrada para actualizar únicamente el título de cualquier post.
*   **Eliminación (DELETE):** Borrado físico de elementos en la interfaz y en memoria.
*   **Persistencia con LocalStorage:** Todos los cambios (creaciones, modificaciones y eliminaciones) se guardan en el navegador para mantener el estado tras recargar la página.
*   **Interfaz Moderna:** Estilizada con componentes limpios y animaciones fluidas mediante **Tailwind CSS**.

---

## 📂 Organización del Proyecto

El proyecto está diseñado bajo una arquitectura limpia y modular que separa claramente el desarrollo en TypeScript, los componentes visuales y el entorno de despliegue en producción.

### 1. Estructura de Carpetas y Archivos

```text
├── dist/                   # CÓDIGO DE PRODUCCIÓN (Generado automáticamente)
│   └── app.js              # Código JavaScript nativo final compilado por TypeScript
├── src/                    # CÓDIGO FUENTE (Entorno de desarrollo)
│   ├── index.html          # Interfaz de usuario (UI), estructura HTML y CDN de Tailwind
│   ├── app.ts              # Lógica del negocio, peticiones HTTP y manejo del DOM
│   └── style.css           # Estilos personalizados y animaciones de carga/borrado
├── .dockerignore           # Exclusiones para optimizar el tamaño de la imagen Docker
├── Dockerfile              # Configuración de compilación y servidor web Nginx
├── package.json            # Configuración de Node.js y dependencias de desarrollo
└── tsconfig.json           # Reglas y configuración del compilador de TypeScript

### Docker
Crear la imagen: docker build -t kenaposo2005/api:latest .
Docker push: docker push kenaposo2005/api:latest
Docker Pull: docker pull kenaposo2005/api:latest
docker run -d -p 8083:80 kenaposo2005/api:latest
