# Proyecto Vue con Bun y Tailwind CSS

Este proyecto utiliza [Vue.js](https://vuejs.org/) como framework principal, [Bun](https://bun.sh/) como gestor de paquetes y entorno de ejecución, y [Tailwind CSS](https://tailwindcss.com/) para el diseño de la interfaz.

## Requisitos previos

Asegúrate de tener instalado lo siguiente en tu máquina:

- [Bun](https://bun.sh/) (puedes instalarlo siguiendo las instrucciones en su [documentación oficial](https://bun.sh/docs/installation))

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/Botica-Developer/xml-handler.git
   cd xml-handler
   ```

2. Instala las dependencias:

   ```bash
   bun install
   ```

3. Configura Tailwind CSS:

   - Si no está configurado, ejecuta el siguiente comando para inicializar Tailwind:
     ```bash
     npx tailwindcss init
     ```
   - Configura el archivo `tailwind.config.js` para incluir tus rutas de Vue:
     ```javascript
     module.exports = {
       content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
       theme: {
         extend: {}
       },
       plugins: []
     }
     ```

4. Asegúrate de importar Tailwind CSS en tu proyecto:

   - En el archivo `src/main.css` o similar:

     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

   - Luego, asegúrate de incluir este archivo CSS en tu archivo principal `main.ts` o `main.js`:
     ```javascript
     import './main.css'
     ```

## Iniciar el proyecto

Para iniciar el servidor de desarrollo, ejecuta:

```bash
bun run dev
```

Esto abrirá la aplicación en tu navegador en [http://localhost:3000](http://localhost:3000) (puedes verificar el puerto configurado en el proyecto).

## Compilar para producción

Para compilar el proyecto para producción, utiliza:

```bash
bun run build
```

Los archivos compilados estarán en la carpeta `dist`.

## Scripts disponibles

- **`bun run dev`**: Inicia el servidor de desarrollo.
- **`bun run build`**: Compila el proyecto para producción.
- **`bun run preview`**: Sirve la aplicación compilada para previsualizarla.

## Documentación

- [Documentación de Vue.js](https://vuejs.org/guide/introduction.html)
- [Documentación de Bun](https://bun.sh/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
