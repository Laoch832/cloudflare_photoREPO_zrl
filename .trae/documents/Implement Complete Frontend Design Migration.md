I will implement the complete new frontend design by migrating the provided HTML variants into your Vue.js project. This involves updating the Home, Diary, Login, and Gallery pages, as well as creating new Profile and Music pages to match the "Atmospheric Cinema" and "Unified iOS Premium" aesthetics.

### 1. Configuration & Assets
- **Update `index.html`**: Add Google Fonts references for *Newsreader*, *Inter*, *Playfair Display*, *Plus Jakarta Sans*, *La Belle Aurore*, and *Material Symbols Outlined*.
- **Update `tailwind.config.js`**: Extend the theme with the specific color palettes (Primary Pink `#ff4d94`, Orange `#f49d25`, Accent Rose `#E88D7D`), font families, and border radius utilities used in the new designs.

### 2. View Migration
I will rewrite the following views to match the provided designs:
- **`src/views/Home.vue`**: Implement the **Atmospheric Cinema** design (Dark mode, glass sidebar, large typography, photo frame).
- **`src/views/Login.vue`**: Implement the **Refined iOS Login** design (Dark mesh gradient, glass card).
- **`src/views/Diary.vue`**: Implement the **Cinematic Diary** design (Light/iOS theme, timeline view).
- **`src/views/Gallery.vue`**: Implement the **Polaroid Gallery** design (Dark theme, scattered polaroids).
- **`src/views/Music.vue`** (New): Implement the **Immersive Music Player** design (Full screen, lyrics view).
- **`src/views/Profile.vue`** (New): Implement the **Account Settings** design (Glass card, profile management).

### 3. Component Updates
- **`src/components/MusicPlayer.vue`**: Update the global music player to match the "Glass Pill" design seen in the Home and Diary variants.
- **Global CSS**: Add utility classes for "glassmorphism", "grain texture", and "polaroid effects" to `src/style.css` to be shared across components.

### 4. Routing
- Ensure `src/router/index.js` includes routes for `/music` and `/profile`.

This will transform your application into a cohesive, high-fidelity design system.