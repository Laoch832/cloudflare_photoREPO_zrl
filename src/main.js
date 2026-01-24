import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'

// Initialize Vercel Analytics and Speed Insights
inject()
injectSpeedInsights()

// Import Material Web Components
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/labs/navigationbar/navigation-bar.js';
import '@material/web/labs/navigationtab/navigation-tab.js';

// Create Vue app
const app = createApp(App)

// Use Vue Router
app.use(router)

// Mount the app
app.mount('#app')
