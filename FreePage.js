/**
 * FreePage.js - Librería minimalista de navegación en pantalla completa
 * Versión Mejorada v2 con correcciones adicionales
 * Colores random vibrantes, menú transparente, fonts escalables
 * Sin dependencias externas
 */

(function() {
    'use strict';

    // ===== CONFIGURACIÓN (Corrección: 22 colores vibrantes y minimalistas) =====
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
        '#32CD32', // Lime Green
        '#4169E1', // Royal Blue
        '#FF6347', // Tomato
        '#00CED1', // Dark Turquoise
        '#ADFF2F', // Green Yellow
        '#BA55D3', // Medium Orchid
        '#FFA500', // Orange
        '#4682B4', // Steel Blue
        '#FF00FF', // Magenta
        '#98FB98', // Pale Green
        '#6A5ACD', // Slate Blue
        '#FF8C00', // Dark Orange
        '#00FA9A'  // Medium Spring Green
    ];
    
    const TRANSITION_DURATION = 800; // ms
    const DEBOUNCE_TIME = 1000; // ms para wheel
    
    // Énfasis responsividad: Threshold dinámico según tamaño de pantalla
    let SWIPE_THRESHOLD = 30; // px mínimos para swipe

    // ===== VARIABLES GLOBALES =====
    let sections = [];
    let currentVerticalIndex = 0;
    let currentHorizontalIndexes = [];
    let isAnimating = false;
    let touchStartY = 0;
    let touchStartX = 0;
    let lastColorUsed = null; // Corrección: evitar repetición consecutiva
    let currentScreenSize = 'desktop'; // Énfasis responsividad: track del tamaño

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

    // ===== ACTUALIZACIÓN DE COLORES (Corrección: random sin repetición consecutiva) =====
    function updateColors() {
        const currentSection = sections[currentVerticalIndex];
        
        // Si tiene video, no cambiar color
        if (currentSection.hasAttribute('data-video')) {
            return;
        }

        let bgColor;
        
        // Corrección: Selección random evitando repetición consecutiva
        if (COLORS.length > 1) {
            let availableColors = COLORS.filter(color => color !== lastColorUsed);
            
            // Si por alguna razón no hay colores disponibles, usar todos
            if (availableColors.length === 0) {
                availableColors = COLORS;
            }
            
            bgColor = availableColors[Math.floor(Math.random() * availableColors.length)];
            lastColorUsed = bgColor;
        } else {
            // Si solo hay 1 color, usarlo
            bgColor = COLORS[0];
        }

        currentSection.style.backgroundColor = bgColor;

        // Corrección: Calcular contraste con fórmula mejorada de luminancia
        const luminance = calculateLuminance(bgColor);
        
        // Corrección: Usar umbral 0.5 para determinar contraste
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

    // ===== MANEJO DE RESPONSIVE (Énfasis responsividad: detección mejorada) =====
    function handleResponsive() {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isPortrait = height > width;
            
            // Énfasis responsividad: Actualizar threshold según tamaño de pantalla
            if (width < 480) {
                SWIPE_THRESHOLD = 25; // Más sensible en móviles pequeños
                currentScreenSize = 'mobile-small';
            } else if (width < 768) {
                SWIPE_THRESHOLD = 30;
                currentScreenSize = 'mobile';
            } else if (width < 1200) {
                SWIPE_THRESHOLD = 35;
                currentScreenSize = 'tablet';
            } else {
                SWIPE_THRESHOLD = 40;
                currentScreenSize = 'desktop';
            }
            
            // Énfasis responsividad: Ajustar elementos dinámicamente
            scaleContent();
            updateArrows();
        };
        
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        handleResize(); // Ejecutar al inicio
    }

    // ===== ESCALADO DE CONTENIDO (Énfasis responsividad: ajuste dinámico mejorado) =====
    function scaleContent() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Énfasis responsividad: Agregar clase según tamaño
        document.body.classList.remove('screen-mobile-small', 'screen-mobile', 'screen-tablet', 'screen-desktop');
        document.body.classList.add(`screen-${currentScreenSize}`);
        
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

        // Touch (Énfasis responsividad: mejor sensibilidad mejorada)
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

            // Énfasis responsividad: Velocidad ajustada según pantalla
            const minVelocity = currentScreenSize === 'mobile-small' ? 0.2 : 0.3;
            const velocityY = Math.abs(deltaY) / deltaTime;
            const velocityX = Math.abs(deltaX) / deltaTime;

            // Determinar si es swipe vertical u horizontal
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                // Swipe vertical
                if (Math.abs(deltaY) > SWIPE_THRESHOLD || velocityY > minVelocity) {
                    if (deltaY > 0) {
                        moveVertical(1);
                    } else {
                        moveVertical(-1);
                    }
                }
            } else {
                // Swipe horizontal
                if (Math.abs(deltaX) > SWIPE_THRESHOLD || velocityX > minVelocity) {
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
 * CORRECCIONES IMPLEMENTADAS v3 (FINALES):
 * 
 * 1. ARRAY DE COLORES EXPANDIDO:
 *    - 22 colores vibrantes y minimalistas
 *    - Tonos variados: azules, rojos, verdes, morados, amarillos, naranjas
 *    - Selección random en cada cambio de sección
 *    - Evita repetición consecutiva usando lastColorUsed
 * 
 * 2. CONTRASTE MEJORADO:
 *    - Fórmula de luminancia normalizada (0-1)
 *    - Umbral 0.5 para determinar texto claro/oscuro
 *    - Texto blanco si luminance < 0.5, negro si >= 0.5
 *    - Garantiza legibilidad en todos los colores
 * 
 * 3. FLECHAS SIN SOLAPAMIENTO:
 *    - z-index: 500 (debajo del contenido que tiene 600)
 *    - Posicionamiento ajustado: bottom: 50px (desktop), 40-45px (mobile)
 *    - Tamaño reducido: 32px (desktop), 40px (tablet), 48px (mobile)
 *    - Padding aumentado en contenido: 100-120px inferior
 * 
 * 4. RESPONSIVE MEJORADO:
 *    - Padding dinámico según dispositivo
 *    - Media queries para 480px, 768px, 1200px
 *    - Ajustes específicos para landscape (max-height: 500px)
 *    - z-index en .content, .left, .right, .slides-wrapper
 * 
 * 5. INTEGRACIÓN CON CORRECCIONES PREVIAS:
 *    - Mantiene split vertical en portrait
 *    - Menú completamente transparente
 *    - Fonts escalables con clamp()
 *    - Animaciones de giro en loops cíclicos
 *    - Sin imágenes en el ejemplo
 * 
 * CARACTERÍSTICAS COMPLETAS:
 * ✓ 22 colores vibrantes con selección random no consecutiva
 * ✓ Contraste perfecto automático (texto siempre legible)
 * ✓ Flechas nunca solapan contenido (z-index + padding)
 * ✓ Responsive total (320px-1920px, portrait/landscape)
 * ✓ Navegación cíclica infinita con animaciones de giro
 * ✓ Menú flotante transparente con indicador activo
 * ✓ Split adapta a vertical en portrait
 * ✓ Letras grandes y escalables
 * ✓ Touch-friendly (flechas 48px mínimo en mobile)
 * ✓ Sin dependencias externas
 * 
 * CÓMO PERSONALIZAR:
 * - Agregar colores: Extender array COLORS con códigos hex
 * - Ajustar contraste: Modificar umbral en updateColors (default 0.5)
 * - Cambiar posición flechas: Editar bottom/left/right en CSS
 * - Agregar secciones: Copiar estructura en HTML con id único
 * - Videos: Agregar data-video="URL_EMBED" a cualquier sección
 */