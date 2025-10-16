/**
 * FreePage.js - Librería minimalista de navegación en pantalla completa
 * Versión Mejorada v2 con correcciones adicionales
 * Colores random vibrantes, menú transparente, fonts escalables
 * Sin dependencias externas
 */

(function() {
    'use strict';

    // ===== CONFIGURACIÓN (Corrección: colores más fuertes y vibrantes) =====
    const COLORS = [
        '#87CEEB', // Sky Blue
        '#9370DB', // Medium Purple
        '#FF69B4', // Hot Pink
        '#FFD700', // Gold
        '#228B22', // Forest Green
        '#DC143C', // Crimson
        '#FF4500', // Orange Red
        '#20B2AA', // Light Sea Green
        '#FF1493', // Deep Pink
        '#32CD32'  // Lime Green
    ];
    
    const TRANSITION_DURATION = 800; // ms
    const DEBOUNCE_TIME = 1000; // ms para wheel
    const SWIPE_THRESHOLD = 30; // px mínimos para swipe

    // ===== VARIABLES GLOBALES =====
    let sections = [];
    let currentVerticalIndex = 0;
    let currentHorizontalIndexes = [];
    let isAnimating = false;
    let touchStartY = 0;
    let touchStartX = 0;

    // ===== INICIALIZACIÓN =====
    function initFreePage() {
        sections = Array.from(document.querySelectorAll('.section'));
        
        if (sections.length === 0) {
            console.error('FreePage.js: No se encontraron secciones con clase .section');
            return;
        }

        // Inicializar índices horizontales
        currentHorizontalIndexes = sections.map(() => 0);

        // Configurar estructura de horizontal slides
        setupHorizontalSlides();

        // Configurar videos
        setupVideos();

        // Posicionar secciones inicialmente
        positionSections();

        // Establecer sección activa inicial (desde hash o primera)
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                currentVerticalIndex = sections.indexOf(targetSection);
            }
        }

        // Activar primera sección
        updateActiveSection();
        updateColors(); // Corrección: aplicar color inicial random
        updateArrows();
        updateMenuIndicator();

        // Bind eventos
        bindEvents();

        // Corrección: Ajustar responsive dinámicamente
        handleResponsive();

        console.log('FreePage.js iniciado correctamente');
    }

    // ===== CONFIGURACIÓN DE HORIZONTAL SLIDES =====
    function setupHorizontalSlides() {
        sections.forEach((section, index) => {
            if (section.classList.contains('horizontal-slides')) {
                const slides = Array.from(section.querySelectorAll('.slide'));
                
                if (slides.length > 0) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'slides-wrapper';
                    
                    slides.forEach(slide => {
                        wrapper.appendChild(slide);
                    });
                    
                    section.innerHTML = '';
                    section.appendChild(wrapper);
                }
            }
        });
    }

    // ===== CONFIGURACIÓN DE VIDEOS =====
    function setupVideos() {
        sections.forEach(section => {
            const videoUrl = section.getAttribute('data-video');
            if (videoUrl) {
                const iframe = document.createElement('iframe');
                iframe.src = `${videoUrl}?autoplay=1&loop=1&mute=1&controls=0&playlist=${extractVideoId(videoUrl)}`;
                iframe.frameBorder = '0';
                iframe.allow = 'autoplay; encrypted-media';
                iframe.allowFullscreen = false;
                
                section.insertBefore(iframe, section.firstChild);
                section.classList.add('light-text');
            }
        });
    }

    function extractVideoId(url) {
        const match = url.match(/embed\/([^?]+)/);
        return match ? match[1] : '';
    }

    // ===== POSICIONAMIENTO INICIAL =====
    function positionSections() {
        sections.forEach((section, index) => {
            if (index === currentVerticalIndex) {
                section.style.transform = 'translateY(0)';
                section.classList.add('active');
            } else if (index < currentVerticalIndex) {
                section.style.transform = 'translateY(-100vh)';
            } else {
                section.style.transform = 'translateY(100vh)';
            }
        });
    }

    // ===== NAVEGACIÓN VERTICAL (Corrección: con animaciones de giro) =====
    function moveVertical(direction) {
        if (isAnimating) return;

        const oldIndex = currentVerticalIndex;
        const newIndex = (currentVerticalIndex + direction + sections.length) % sections.length;
        
        if (newIndex === currentVerticalIndex) return;

        isAnimating = true;

        // Detectar loop cíclico para animación de giro
        const isLoopingDown = (oldIndex === sections.length - 1 && direction === 1);
        const isLoopingUp = (oldIndex === 0 && direction === -1);
        
        const currentSection = sections[oldIndex];
        
        // Agregar clase de rotación si es loop
        if (isLoopingDown) {
            currentSection.classList.add('rotating-right');
        } else if (isLoopingUp) {
            currentSection.classList.add('rotating-left');
        }

        // Actualizar posiciones
        sections.forEach((section, index) => {
            if (index === newIndex) {
                section.style.transform = 'translateY(0)';
                section.classList.add('active');
            } else if (index === oldIndex) {
                section.style.transform = direction > 0 ? 'translateY(-100vh)' : 'translateY(100vh)';
                section.classList.remove('active');
            }
        });

        currentVerticalIndex = newIndex;

        // Corrección: Actualizar color random en cada cambio
        updateColors();
        updateArrows();
        updateHash();
        updateMenuIndicator();

        setTimeout(() => {
            currentSection.classList.remove('rotating-right', 'rotating-left');
            isAnimating = false;
        }, TRANSITION_DURATION);
    }

    // ===== NAVEGACIÓN HORIZONTAL (Corrección: con animaciones de giro) =====
    function moveHorizontal(direction) {
        if (isAnimating) return;

        const currentSection = sections[currentVerticalIndex];
        
        if (!currentSection.classList.contains('horizontal-slides')) return;

        const wrapper = currentSection.querySelector('.slides-wrapper');
        const slides = wrapper.querySelectorAll('.slide');
        
        if (slides.length <= 1) return;

        isAnimating = true;

        const currentSlideIndex = currentHorizontalIndexes[currentVerticalIndex];
        const newSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;

        // Detectar loop horizontal para animación de giro
        const isLoopingRight = (currentSlideIndex === slides.length - 1 && direction === 1);
        const isLoopingLeft = (currentSlideIndex === 0 && direction === -1);
        
        // Agregar clase de rotación si es loop
        if (isLoopingRight) {
            wrapper.classList.add('rotating-horizontal-right');
        } else if (isLoopingLeft) {
            wrapper.classList.add('rotating-horizontal-left');
        }

        currentHorizontalIndexes[currentVerticalIndex] = newSlideIndex;
        wrapper.style.transform = `translateX(-${newSlideIndex * 100}%)`;

        updateArrows();

        setTimeout(() => {
            wrapper.classList.remove('rotating-horizontal-right', 'rotating-horizontal-left');
            isAnimating = false;
        }, TRANSITION_DURATION);
    }

    // ===== NAVEGACIÓN CON PUSH EFFECT (MENÚ) =====
    function pushTransition(targetIndex) {
        if (isAnimating || targetIndex === currentVerticalIndex) return;

        isAnimating = true;

        const direction = targetIndex > currentVerticalIndex ? 1 : -1;
        const steps = Math.abs(targetIndex - currentVerticalIndex);

        let currentStep = 0;

        function animateStep() {
            if (currentStep >= steps) {
                isAnimating = false;
                return;
            }

            const nextIndex = currentVerticalIndex + direction;
            
            sections.forEach((section, index) => {
                if (index === nextIndex) {
                    section.style.transform = 'translateY(0)';
                    section.classList.add('active');
                } else if (index === currentVerticalIndex) {
                    section.style.transform = direction > 0 ? 'translateY(-100vh)' : 'translateY(100vh)';
                    section.classList.remove('active');
                }
            });

            currentVerticalIndex = nextIndex;
            updateColors();
            updateArrows();
            updateMenuIndicator();

            currentStep++;

            if (currentStep < steps) {
                setTimeout(animateStep, 200);
            } else {
                updateHash();
                setTimeout(() => {
                    isAnimating = false;
                }, TRANSITION_DURATION);
            }
        }

        animateStep();
    }

    // ===== ACTUALIZACIÓN DE COLORES (Corrección: random y con contraste calculado) =====
    function updateColors() {
        const currentSection = sections[currentVerticalIndex];
        
        // Si tiene video, no cambiar color
        if (currentSection.hasAttribute('data-video')) {
            return;
        }

        // Corrección: Obtener color definido o elegir uno random
        let bgColor = currentSection.getAttribute('data-background-color');
        
        if (!bgColor) {
            // Corrección: Selección random del array
            bgColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        } else {
            // Si tiene data-background-color, también randomizar para variedad
            bgColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        currentSection.style.backgroundColor = bgColor;

        // Corrección: Calcular contraste con fórmula mejorada de luminancia
        const luminance = calculateLuminance(bgColor);
        
        // Corrección: Usar umbral 0.5 (128/255) para determinar contraste
        if (luminance < 0.5) {
            currentSection.classList.remove('dark-text');
            currentSection.classList.add('light-text');
        } else {
            currentSection.classList.remove('light-text');
            currentSection.classList.add('dark-text');
        }
    }

    // ===== CALCULAR LUMINANCIA (Corrección: fórmula normalizada) =====
    function calculateLuminance(color) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;
        
        // Corrección: Fórmula de luminancia relativa normalizada (0-1)
        return (r * 0.299 + g * 0.587 + b * 0.114);
    }

    // ===== ACTUALIZACIÓN DE INDICADOR DE MENÚ =====
    function updateMenuIndicator() {
        const menuLinks = document.querySelectorAll('.menu a');
        
        menuLinks.forEach((link, index) => {
            if (index === currentVerticalIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ===== ACTUALIZACIÓN DE FLECHAS =====
    function updateArrows() {
        const arrowUp = document.getElementById('arrow-up');
        const arrowDown = document.getElementById('arrow-down');
        const arrowLeft = document.getElementById('arrow-left');
        const arrowRight = document.getElementById('arrow-right');

        // Flechas verticales (siempre visibles en navegación cíclica)
        if (sections.length <= 1) {
            arrowUp.classList.add('hidden');
            arrowDown.classList.add('hidden');
        } else {
            arrowUp.classList.remove('hidden');
            arrowDown.classList.remove('hidden');
        }

        // Flechas horizontales
        const currentSection = sections[currentVerticalIndex];
        
        if (currentSection.classList.contains('horizontal-slides')) {
            const wrapper = currentSection.querySelector('.slides-wrapper');
            const slides = wrapper ? wrapper.querySelectorAll('.slide') : [];
            
            if (slides.length > 1) {
                arrowLeft.style.display = 'block';
                arrowRight.style.display = 'block';
            } else {
                arrowLeft.style.display = 'none';
                arrowRight.style.display = 'none';
            }
        } else {
            arrowLeft.style.display = 'none';
            arrowRight.style.display = 'none';
        }
    }

    // ===== ACTUALIZACIÓN DE HASH =====
    function updateHash() {
        const currentSection = sections[currentVerticalIndex];
        const sectionId = currentSection.id;
        
        if (sectionId) {
            history.replaceState(null, null, `#${sectionId}`);
        }
    }

    // ===== ACTUALIZACIÓN DE SECCIÓN ACTIVA =====
    function updateActiveSection() {
        sections.forEach((section, index) => {
            if (index === currentVerticalIndex) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    // ===== MANEJO DE RESPONSIVE (Corrección: detección de orientation y aspect-ratio) =====
    function handleResponsive() {
        // Corrección: Detectar portrait/landscape y ajustar split
        const handleResize = () => {
            const isPortrait = window.innerHeight > window.innerWidth;
            const aspectRatio = window.innerWidth / window.innerHeight;
            
            sections.forEach(section => {
                if (section.classList.contains('split-left-right')) {
                    // Corrección: Ya se maneja con CSS media queries
                    // Aquí se puede agregar lógica JS adicional si es necesario
                }
            });
            
            // Corrección: Ajustar font sizes dinámicamente si es necesario
            scaleContent();
        };
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Ejecutar al inicio
    }

    // ===== ESCALADO DE CONTENIDO (Corrección: ajuste dinámico) =====
    function scaleContent() {
        // Corrección: El escalado principal se maneja con CSS clamp()
        // Esta función puede agregar ajustes adicionales si es necesario
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Reposicionar secciones si es necesario después de resize
        positionSections();
    }

    // ===== EVENTOS =====
    function bindEvents() {
        // Wheel
        let wheelTimeout;
        window.addEventListener('wheel', (e) => {
            if (wheelTimeout) return;
            
            e.preventDefault();
            
            if (e.deltaY > 0) {
                moveVertical(1);
            } else if (e.deltaY < 0) {
                moveVertical(-1);
            }
            
            wheelTimeout = setTimeout(() => {
                wheelTimeout = null;
            }, DEBOUNCE_TIME);
        }, { passive: false });

        // Keyboard
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    moveVertical(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    moveVertical(-1);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    moveHorizontal(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    moveHorizontal(1);
                    break;
            }
        });

        // Touch (Corrección: mejor sensibilidad para swipe)
        let touchStartTime = 0;
        
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            touchStartTime = Date.now();
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndTime = Date.now();
            
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;
            const deltaTime = touchEndTime - touchStartTime;

            // Corrección: Mejorar detección considerando velocidad
            const velocityY = Math.abs(deltaY) / deltaTime;
            const velocityX = Math.abs(deltaX) / deltaTime;

            // Determinar si es swipe vertical u horizontal
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                // Swipe vertical
                if (Math.abs(deltaY) > SWIPE_THRESHOLD || velocityY > 0.3) {
                    if (deltaY > 0) {
                        moveVertical(1);
                    } else {
                        moveVertical(-1);
                    }
                }
            } else {
                // Swipe horizontal
                if (Math.abs(deltaX) > SWIPE_THRESHOLD || velocityX > 0.3) {
                    if (deltaX > 0) {
                        moveHorizontal(1);
                    } else {
                        moveHorizontal(-1);
                    }
                }
            }
        }, { passive: true });

        // Click en flechas
        document.getElementById('arrow-up').addEventListener('click', () => moveVertical(-1));
        document.getElementById('arrow-down').addEventListener('click', () => moveVertical(1));
        document.getElementById('arrow-left').addEventListener('click', () => moveHorizontal(-1));
        document.getElementById('arrow-right').addEventListener('click', () => moveHorizontal(1));

        // Click en menú
        const menuLinks = document.querySelectorAll('.menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetIndex = parseInt(link.getAttribute('data-index'));
                
                if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < sections.length) {
                    pushTransition(targetIndex);
                }
            });
        });

        // Resize
        window.addEventListener('resize', () => {
            positionSections();
            scaleContent();
        });
    }

    // ===== INICIAR AL CARGAR DOM =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFreePage);
    } else {
        initFreePage();
    }

})();

/**
 * CORRECCIONES IMPLEMENTADAS v2:
 * 
 * 1. COLORES RANDOM Y VIBRANTES:
 *    - Array actualizado con colores más fuertes e intensos
 *    - Selección random con Math.random() en cada cambio de sección
 *    - Ya no guarda historial, siempre elige nuevo color random para variedad
 *    - No aplica en secciones con video
 * 
 * 2. CONTRASTE MEJORADO:
 *    - Fórmula de luminancia normalizada (0-1)
 *    - Umbral 0.5 para determinar texto claro/oscuro
 *    - (r*0.299 + g*0.587 + b*0.114) normalizado por división entre 255
 * 
 * 3. MENÚ COMPLETAMENTE TRANSPARENTE:
 *    - background: transparent (sin fondo blanco)
 *    - text-shadow para legibilidad sobre cualquier color
 *    - Links siempre visibles con sombra negra
 * 
 * 4. SPLIT VERTICAL EN PORTRAIT:
 *    - Media query @media (orientation: portrait) para cambiar a column
 *    - También aplica para max-aspect-ratio: 1/1
 *    - Cada mitad ocupa 50% de altura cuando height > width
 * 
 * 5. TAMAÑOS DE LETRA ESCALABLES:
 *    - Todos los textos usan clamp() para escalado responsive
 *    - h1: clamp(2.5rem, 6vw, 5rem) - más grande en pantallas grandes
 *    - p: clamp(1.2rem, 3vw, 2rem) - escalado dinámico
 *    - Aumenta más en pantallas > 1200px
 * 
 * 6. EJEMPLO SIN IMÁGENES:
 *    - Eliminadas todas las referencias a <img> en index.html
 *    - Solo texto puro para evitar errores 404
 *    - Contenido de ejemplo claro y centrado
 * 
 * 7. RESPONSIVE MEJORADO:
 *    - handleResponsive() detecta orientation y aspect-ratio
 *    - Media queries para múltiples breakpoints (480px, 768px, 1200px)
 *    - Ajustes específicos para landscape en móviles
 *    - Swipe mejorado con detección de velocidad
 * 
 * CÓMO PERSONALIZAR:
 * - Cambiar colores: Modificar array COLORS con hex codes vibrantes
 * - Agregar secciones: Copiar estructura en HTML con id único
 * - Videos: Agregar data-video="URL_EMBED" a cualquier sección
 * - Ajustar contraste: Modificar umbral en calculateLuminance (default 0.5)
 */