# FreePage.js

Una librería de navegación en pantalla completa.

## 🚀 Características

- ✅ **100% Vanilla JavaScript** - Sin frameworks ni dependencias externas
- ✅ **Navegación Cíclica Infinita** - Vertical y horizontal
- ✅ **Responsive Design** - Soporte completo para móviles y tablets
- ✅ **Transiciones Suaves** - Animaciones fluidas de 800ms
- ✅ **Colores Dinámicos** - Rotación automática con contraste inteligente
- ✅ **Videos de Fondo** - Integración con YouTube
- ✅ **Multiple Layouts** - Full-center, Split, Horizontal slides
- ✅ **Touch/Swipe Support** - Gestos táctiles nativos
- ✅ **Menú Transparente** - Navegación con efecto "push"
- ✅ **URL Hashes** - Navegación directa a secciones

## 📦 Instalación

1. Descarga los tres archivos:
   - `index.html`
   - `styles.css`
   - `FreePage.js`

2. Colócalos en el mismo directorio

3. Abre `index.html` en un navegador moderno

## 🎯 Uso Básico

### Estructura HTML

```html
<div id="fullscreen-container">
    <div class="section full-center" id="seccion1" data-background-color="#F0F8FF">
        <div class="content">
            <h1>Título</h1>
            <p>Contenido</p>
        </div>
    </div>
</div>
```

### Tipos de Secciones

#### 1. Full Center
```html
<div class="section full-center" id="seccion1" data-background-color="#F0F8FF">
    <div class="content">
        <h1>Título Centrado</h1>
        <p>Texto centrado</p>
        <img src="imagen.jpg" alt="Descripción">
    </div>
</div>
```

#### 2. Split Left/Right
```html
<div class="section split-left-right" id="seccion2" data-background-color="#E6E6FA">
    <div class="left">
        <h2>Contenido Izquierdo</h2>
        <p>Texto aquí</p>
    </div>
    <div class="right">
        <img src="imagen.jpg" alt="Descripción">
    </div>
</div>
```

#### 3. Horizontal Slides
```html
<div class="section horizontal-slides" id="seccion3" data-background-color="#ADD8E6">
    <div class="slide">
        <h2>Slide 1</h2>
        <p>Contenido 1</p>
    </div>
    <div class="slide">
        <h2>Slide 2</h2>
        <p>Contenido 2</p>
    </div>
    <div class="slide">
        <h2>Slide 3</h2>
        <p>Contenido 3</p>
    </div>
</div>
```

#### 4. Video de Fondo
```html
<div class="section full-center" id="seccion4" data-video="https://www.youtube.com/embed/VIDEO_ID">
    <div class="content">
        <h1>Texto sobre Video</h1>
        <p>El overlay oscuro se aplica automáticamente</p>
    </div>
</div>
```

## 🎨 Personalización

### Colores

Puedes definir colores de dos formas:

1. **Por sección** (recomendado):
```html
<div class="section" data-background-color="#FF6B6B">
```

2. **Modificar el array de colores** en `FreePage.js`:
```javascript
const COLORS = [
    '#F0F8FF', '#E6E6FA', '#ADD8E6', '#FFB6C1',
    '#FFFFFF', '#000000', '#B0C4DE', '#FFD1DC',
    '#E0FFFF', '#F5F5DC'
];
```

### Menú de Navegación

Agrega links al menú en `index.html`:

```html
<nav class="menu">
    <a href="#seccion1" data-index="0">Inicio</a>
    <a href="#seccion2" data-index="1">Sobre</a>
    <a href="#seccion3" data-index="2">Galería</a>
    <a href="#seccion4" data-index="3">Contacto</a>
</nav>
```

**Importante**: El atributo `data-index` debe coincidir con la posición de la sección (0-indexed).

### Videos de YouTube

Para agregar un video de fondo:

1. Obtén la URL de embed de YouTube:
   - Video: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Embed: `https://www.youtube.com/embed/dQw4w9WgXcQ`

2. Agrega el atributo `data-video`:
```html
<div class="section" data-video="https://www.youtube.com/embed/dQw4w9WgXcQ">
```

El video se reproducirá automáticamente en loop, silenciado y con un overlay oscuro.

## ⌨️ Controles

### Desktop
- **Scroll del ratón**: Navegar verticalmente
- **Flechas ↑↓**: Navegar verticalmente
- **Flechas ←→**: Navegar horizontalmente (en slides)
- **Click en flechas**: Navegación visual
- **Click en menú**: Saltar a sección con efecto "push"

### Mobile/Tablet
- **Swipe vertical**: Navegar entre secciones
- **Swipe horizontal**: Navegar entre slides
- **Tap en flechas**: Navegación táctil

## 🔧 Configuración Avanzada

### Ajustar Velocidad de Transición

En `FreePage.js`:
```javascript
const TRANSITION_DURATION = 800; // Cambiar a 600, 1000, etc.
```

En `styles.css`:
```css
.section {
    transition: transform 800ms ease-in-out; /* Debe coincidir */
}
```

### Cambiar Umbral de Swipe

En `FreePage.js`:
```javascript
const SWIPE_THRESHOLD = 50; // Píxeles mínimos para detectar swipe
```

### Tiempo de Debounce del Scroll

En `FreePage.js`:
```javascript
const DEBOUNCE_TIME = 1000; // Tiempo entre scrolls (ms)
```

## 📱 Responsive Design

La librería incluye breakpoints automáticos:

- **Desktop**: > 768px
  - Layout completo
  - Flechas de 50px
  - Split horizontal

- **Tablet**: 481px - 768px
  - Layout adaptado
  - Flechas de 48px
  - Split puede ser vertical

- **Mobile**: < 480px
  - Layout vertical
  - Flechas de 40px
  - Split siempre vertical
  - Menú compacto

## 🎭 Efectos Especiales

### Efecto "Push"

Al hacer click en el menú, las secciones se deslizan secuencialmente:

```javascript
// Se activa automáticamente con clicks en el menú
// Velocidad: 200ms por sección intermedia
```

### Contraste Automático

El texto cambia de color automáticamente según el fondo:

- **Fondos claros** (luminancia < 128): Texto oscuro
- **Fondos oscuros** (luminancia ≥ 128): Texto claro

## 🐛 Solución de Problemas

### Las secciones no cambian
- Verifica que las secciones tengan la clase `.section`
- Asegúrate de que `FreePage.js` se carga correctamente
- Revisa la consola del navegador para errores

### El video no se reproduce
- Verifica que la URL sea de formato embed: `/embed/VIDEO_ID`
- Algunos videos tienen restricciones de reproducción embebida
- Prueba con otro video público

### El menú no funciona
- Verifica que el atributo `data-index` coincida con la posición
- Asegúrate de que los IDs de las secciones existan
- Revisa que el href apunte al ID correcto

### Problemas en móvil
- Asegúrate de tener la meta tag viewport:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## 📄 Licencia

Este código es de uso libre. Puedes modificarlo y distribuirlo sin restricciones.

## 🤝 Contribuciones

Para agregar características o reportar bugs:
1. Modifica los archivos según necesites
2. Prueba en múltiples navegadores
3. Documenta los cambios

## 📚 Ejemplos Adicionales

### Sección con múltiples imágenes
```html
<div class="section full-center" data-background-color="#FFF5E1">
    <div class="content">
        <h1>Galería</h1>
        <img src="imagen1.jpg" alt="Imagen 1" style="max-width: 45%; margin: 10px;">
        <img src="imagen2.jpg" alt="Imagen 2" style="max-width: 45%; margin: 10px;">
    </div>
</div>
```

### Sección con botones
```html
<div class="section full-center" data-background-color="#E8F4F8">
    <div class="content">
        <h1>Contacto</h1>
        <button style="padding: 15px 30px; margin: 10px; cursor: pointer;">
            Enviar Email
        </button>
        <button style="padding: 15px 30px; margin: 10px; cursor: pointer;">
            WhatsApp
        </button>
    </div>
</div>
```

## 🎓 Créditos
**Author**: ErwinSaul
**Versión**: 1.0.0  
