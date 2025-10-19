# FreePage.js

Una librería de navegación en pantalla completa con componentes reutilizables.

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
- ✅ **Componentes Reutilizables** - Persona, Evento, Lugar

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
<div id="fullscreen-container" data-base-colors="#FF0000,#00FF00,#0000FF">
```

Si no defines colores base, se usarán los colores predeterminados del archivo `FreePage.js`:
```javascript
let baseColors = [ '#FFFFFF', '#144D85', '#B33536'];
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
  - Componentes en columna

## 🎭 Efectos Especiales

### Efecto "Push"

Al hacer click en el menú, las secciones se deslizan secuencialmente:

```javascript
// Se activa automáticamente con clicks en el menú
// Velocidad: 200ms por sección intermedia
```

### Contraste Automático

El texto cambia de color automáticamente según el fondo:

- **Fondos claros** (luminancia < 0.5): Texto claro
- **Fondos oscuros** (luminancia ≥ 0.5): Texto oscuro

### Componentes Responsivos

Los componentes se adaptan automáticamente:

- **Desktop**: Layout original (horizontal/vertical según diseño)
- **Mobile (<600px)**: Stack vertical automático
- **Landscape móvil**: Layout optimizado para pantalla horizontal

## 🛠 Solución de Problemas

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

### Componentes se solapan
- Verifica los valores de `padding-bottom` en CSS
- Ajusta el `max-width` de los componentes
- Revisa media queries para tu dispositivo

## 📚 Ejemplos Adicionales

### Sección con Persona y texto
```html
<div class="section full-center" id="seccion1">
    <div class="content">
        <h1>Nuestro Equipo</h1>
        <div class="persona">
            <h3 class="nombre">Juan Pérez</h3>
            <img src="https://via.placeholder.com/100x100" alt="Juan">
            <p class="descripcion">CEO y Fundador</p>
        </div>
    </div>
</div>
```

### Split con componentes
```html
<div class="section split-left-right" id="seccion2">
    <div class="left">
        <div class="persona persona-horizontal">
            <img src="https://via.placeholder.com/100x100" alt="María">
            <div>
                <h3 class="nombre">María García</h3>
                <p class="descripcion">Diseñadora UX</p>
            </div>
        </div>
    </div>
    <div class="right">
        <div class="evento">
            <h3 class="tema">Workshop 2025</h3>
            <p class="detalle">Aprende diseño UX</p>
            <p class="info">📍 Online • 📅 20 Abril</p>
        </div>
    </div>
</div>
```

### Slides con múltiples componentes
```html
<div class="section horizontal-slides" id="seccion3">
    <div class="slide">
        <div class="lugar">
            <img src="https://via.placeholder.com/150x100" alt="Oficina">
            <div class="descripcion">
                <h4>Nuestra Oficina</h4>
                <p>Espacio moderno de trabajo</p>
            </div>
        </div>
    </div>
    <div class="slide">
        <div class="persona">
            <h3 class="nombre">Carlos López</h3>
            <img src="https://via.placeholder.com/100x100" alt="Carlos">
            <p class="descripcion">Developer</p>
        </div>
    </div>
    <div class="slide">
        <div class="evento">
            <h3 class="tema">Lanzamiento</h3>
            <p class="detalle">Nuevo producto</p>
            <p class="info">📍 Madrid • 📅 1 Mayo</p>
        </div>
    </div>
</div>
```

### Persona sobre video
```html
<div class="section full-center" id="seccion4" data-video="https://www.youtube.com/embed/VIDEO_ID">
    <div class="content">
        <div class="persona">
            <h3 class="nombre">Ana Martínez</h3>
            <img src="https://via.placeholder.com/100x100" alt="Ana">
            <p class="descripcion">Content Creator</p>
        </div>
    </div>
</div>
```

## 🎨 Personalización de Componentes

### Modificar estilos de Persona

```css
.persona {
    max-width: 350px; /* Cambiar ancho máximo */
    padding: 25px; /* Ajustar padding */
    border-radius: 12px; /* Cambiar border radius */
}

.persona img {
    width: 120px; /* Cambiar tamaño de imagen */
    height: 120px;
    border: 4px solid rgba(255, 255, 255, 0.5); /* Ajustar borde */
}
```

### Modificar estilos de Evento

```css
.evento {
    max-width: 400px;
    padding: 25px;
    background: rgba(255, 255, 255, 0.1); /* Cambiar fondo */
}

.evento .tema {
    font-size: 1.8rem; /* Ajustar tamaño de título */
}
```

### Modificar estilos de Lugar

```css
.lugar {
    max-width: 600px;
    padding: 25px;
}

.lugar img {
    width: 50%; /* Cambiar proporción de imagen */
    border-radius: 8px;
}
```

## 📄 Licencia

Este código es de uso libre. Puedes modificarlo y distribuirlo sin restricciones.

## 🤝 Contribuciones

Para agregar características o reportar bugs:
1. Modifica los archivos según necesites
2. Prueba en múltiples navegadores
3. Documenta los cambios

## 🎓 Créditos
**Author**: ErwinSaul  
**Versión**: 1.0.0 con Componentes Reutilizables

## 📋 Checklist de Integración

- [x] HTML actualizado con componentes
- [x] CSS con estilos de componentes
- [x] Responsividad completa
- [x] Compatibilidad con colores dinámicos
- [x] Contraste automático
- [x] Navegación cíclica funcional
- [x] Videos de fondo soportados
- [x] Touch/Swipe habilitado
- [x] Menú transparente
- [x] Flechas con contraste0000FF">
    <div class="section full-center" id="seccion1">
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
<div class="section full-center" id="seccion1">
    <div class="content">
        <h1>Título Centrado</h1>
        <p>Texto centrado</p>
        <img src="imagen.jpg" alt="Descripción">
    </div>
</div>
```

#### 2. Split Left/Right
```html
<div class="section split-left-right" id="seccion2">
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
<div class="section horizontal-slides" id="seccion3">
    <div class="slide">
        <h2>Slide 1</h2>
        <p>Contenido 1</p>
    </div>
    <div class="slide">
        <h2>Slide 2</h2>
        <p>Contenido 2</p>
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

## 🎨 Componentes Reutilizables

### Componente Persona (Básico)

```html
<div class="persona">
    <h3 class="nombre">Juan Pérez</h3>
    <img src="https://via.placeholder.com/100x100" alt="Juan Pérez">
    <p class="descripcion">Desarrollador Full Stack</p>
</div>
```

### Componente Persona (Horizontal)

```html
<div class="persona persona-horizontal">
    <img src="https://via.placeholder.com/100x100" alt="María García">
    <div>
        <h3 class="nombre">María García</h3>
        <p class="descripcion">Diseñadora UX/UI</p>
    </div>
</div>
```

### Componente Evento

```html
<div class="evento">
    <h3 class="tema">Conferencia Web 2025</h3>
    <p class="detalle">Descripción del evento aquí</p>
    <p class="info">📍 Madrid • 📅 15 Marzo • ⏰ 10:00 AM</p>
</div>
```

### Componente Lugar

```html
<div class="lugar">
    <img src="https://via.placeholder.com/150x100" alt="Parque Central">
    <div class="descripcion">
        <h4>Parque Central</h4>
        <p>Descripción del lugar aquí</p>
    </div>
</div>
```

## 🎨 Personalización

### Colores Base

Puedes definir colores base en el contenedor principal:

```html
<div id="fullscreen-container" data-base-colors="#FF0000,#00FF00,#