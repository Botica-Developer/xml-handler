import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Crear una instancia del router
const router = createRouter({
  // Usar el historial de navegación del navegador
  history: createWebHistory(import.meta.env.BASE_URL),
  // Definir las rutas de la aplicación
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView // Componente que se renderiza cuando se accede a la ruta '/'
    }
  ]
})

// Exportar la instancia del router
export default router
