import './assets/main.css' // Importa el archivo de estilos principal
import 'primeicons/primeicons.css' // Importa los iconos de PrimeIcons

import { createApp } from 'vue' // Importa la función para crear una aplicación de Vue
import { createPinia } from 'pinia' // Importa la función para crear un store de Pinia
import PrimeVue from 'primevue/config' // Importa la configuración de PrimeVue
import Aura from '@primevue/themes/aura' // Importa el tema Aura de PrimeVue
import ToastService from 'primevue/toastservice' // Importa el servicio de notificaciones de PrimeVue

import App from './App.vue' // Importa el componente principal de la aplicación
import router from './router' // Importa el enrutador de la aplicación

const app = createApp(App) // Crea la aplicación de Vue con el componente principal

app.use(createPinia()) // Usa Pinia como el store de la aplicación
app.use(router) // Usa el enrutador en la aplicación
app.use(PrimeVue, {
  theme: {
    preset: Aura, // Configura el tema Aura para PrimeVue
    options: {
      darkModeSelector: '.app-dark' // Selector para el modo oscuro
    }
  }
})
app.use(ToastService) // Usa el servicio de notificaciones de PrimeVue

app.mount('#app') // Monta la aplicación en el elemento con id 'app'
