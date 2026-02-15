document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation: Auto-close on link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.bootstrap) {
                    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
    }

    // Typewriter Effect
    const container = document.getElementById('typewriter-container');
    const cursor = document.querySelector('.blink-cursor');

    let typewriterTimeout; // Store timeout ID to clear on restart

    function startTypewriter() {
        if (!container) return;

        // Reset State
        clearTimeout(typewriterTimeout);
        // Keep cursor, clear text content but careful not to lose cursor if it's inside
        // Actually the code appends divs. Let's plain clear innerHTML but save cursor if needed.
        // The original code assumes cursor is separate or appended.
        // Let's Clean up everything EXCEPT the cursor if it's external, or just rebuild.
        // Looking at structure: container seems to fill up with divs.
        
        container.innerHTML = ''; // Clear all text
        // Re-append cursor if it was inside, or ensure it's handled.
        // The code: "if(cursor) container.appendChild(cursor);" at start.
        // So clearing innerHTML is fine, we just re-append cursor in the loop.
        
        const words = ['WEBDESIGN', 'GRAFIKDESIGN', 'ENTWICKLUNG'];
        let wordIndex = 0;
        let charIndex = 0;
        let currentElement = null;
        
        // Initial setup for reset
        if(cursor) {
            cursor.style.display = 'inline-block';
            cursor.classList.add('blink-cursor');
            container.appendChild(cursor);
        }

        function type() {
            if (wordIndex >= words.length) {
                if(cursor) cursor.style.display = 'none';
                return;
            }

            const currentWord = words[wordIndex];

            // If we are starting a NEW word
            if (charIndex === 0) {
                currentElement = document.createElement('div');
                currentElement.style.display = 'block'; 
                
                // Insert before cursor
                if (cursor && cursor.parentNode === container) {
                    container.insertBefore(currentElement, cursor);
                } else {
                    container.appendChild(currentElement);
                }
                
                // Ensure cursor is inside or after? 
                // Original code: "container.appendChild(cursor); cursor.style.display = 'inline-block';"
                // It seems the cursor is moved around.
                if(cursor) {
                     // Move cursor to be after this new block?
                     // Actually, if it's a block, cursor should be INSIDE it or AFTER it inline?
                     // Original code appended to container. 
                     // Let's stick to original logic:
                     container.appendChild(cursor);
                     cursor.style.display = 'inline-block';
                }
            }

            // Update text
            const textPart = currentWord.substring(0, charIndex + 1);
            currentElement.textContent = textPart;
            
            // Move cursor inside current element to blink at end of text?
            // Original code: "if(cursor) currentElement.appendChild(cursor);"
            if(cursor) currentElement.appendChild(cursor);

            charIndex++;

            if (charIndex < currentWord.length) {
                typewriterTimeout = setTimeout(type, 100);
            } else {
                // Word finished
                const isLastWord = (wordIndex === words.length - 1);
                
                if (isLastWord) {
                     if(cursor) {
                         cursor.style.display = 'inline-block';
                         cursor.classList.add('blink-cursor');
                     }
                } else {
                     if (cursor && cursor.parentNode === currentElement) {
                        currentElement.removeChild(cursor);
                     }
                     currentElement.innerHTML += `<span class="text-accent">,</span>`;
                     wordIndex++;
                     charIndex = 0; 
                     typewriterTimeout = setTimeout(type, 500);
                }
            }
        }
        type();
    }

    // Initialize Typewriter
    if (container) {
        startTypewriter();
        // Interaction: Restart on click
        container.addEventListener('click', () => {
             startTypewriter();
        });
        container.style.cursor = 'pointer'; // Indicate interactivity
    }

    // Determine elements to animate
    const animateSelectors = [
        '.neu-card', 
        '.display-title', 
        'h2', 
        '.phone-mockup',
        '.section-label',
        'footer h2',
        '.neu-btn'
    ];

    const animatedElements = document.querySelectorAll(animateSelectors.join(','));
    
    // Initialize elements for animation
    animatedElements.forEach((el) => {
        el.classList.add('animate-on-scroll');
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // --- Motion One Interactions ---
    // Wait function to ensure library is loaded
    const waitForMotion = (callback, maxTries = 10) => {
        if (typeof Motion !== 'undefined') {
            callback();
        } else if (maxTries > 0) {
            setTimeout(() => waitForMotion(callback, maxTries - 1), 100);
        } else {
            console.warn('Motion library could not be loaded.');
        }
    };

    waitForMotion(() => {
        const { animate, scroll, spring, inView } = Motion;

        // 1. Floating Navigation Tilt Effect
        const navbar = document.querySelector('.navbar-floating');
        if (navbar) {
            // Slower smooth entry
            navbar.style.transition = 'transform 0.4s ease-out';
            navbar.style.transformStyle = 'preserve-3d';

            navbar.addEventListener('mousemove', (e) => {
                const rect = navbar.getBoundingClientRect();
                const x = e.clientX - rect.left; 
                
                const xPct = (x / rect.width - 0.5) * 2; 

                // Only Horizontal Tilt (rotateY), reduced strength
                const rotateY = xPct * 3; 

                navbar.style.transform = `perspective(1000px) rotateY(${rotateY}deg) scale(1.02)`;
            });

            navbar.addEventListener('mouseleave', () => {
                // VERY smooth/slow reset
                navbar.style.transition = 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
                navbar.style.transform = "perspective(1000px) rotateY(0deg) scale(1)";
                
                setTimeout(() => {
                    navbar.style.transition = 'transform 0.4s ease-out';
                }, 1200);
            });
        }

        // 2. Parallax Scroll Effect for Hero Section
        const heroSection = document.querySelector('#hero');
        if (heroSection) {
            const heroShapes = document.querySelectorAll('.hero-shape');
            const heroComma = document.querySelector('span[style*="font-size: 30rem"]');
            
            // Animate Shapes - Move Background FASTER than natural scroll (or much deeper feeling)
            heroShapes.forEach((shape, index) => {
                const speed = (index + 1) * 60 + 100; // Much higher values for strong parallax
                scroll(animate(shape, { 
                    y: [0, speed],
                    opacity: [1, 0.3] 
                }), {
                    target: heroSection,
                    offset: ["start start", "end start"]
                });
            });

            // Animate Big Comma - Distinct movement
            if (heroComma) {
               const commaParent = heroComma.parentElement; 
               scroll(animate(commaParent, { 
                   y: [0, 300], // Moves fast down
                   opacity: [0.4, 0], 
                   rotate: [0, 25] 
               }), {
                   target: heroSection,
                   offset: ["start start", "end start"]
               });
            }
            
            // Animate Hero Text Content - Move SLOWLY (or against scroll) to create friction
            const heroContent = heroSection.querySelector('.container');
            if (heroContent) {
                // y: [0, 50] means it moves down 50px while page scrolls X px.
                // To create separation, text should stay "closer".
                // Let's make text barely move relative to viewport, or move subtly.
                scroll(animate(heroContent, { 
                    y: [0, 50], 
                    opacity: [1, 0] 
                }), {
                    target: heroSection,
                    offset: ["start start", "center start"]
                });
            }
        }

        // 3. Staggered Entrance for Projects
        // We can use scroll() with stagger() for project cards
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length > 0) {
            // Initial state set in CSS or JS? 
            // Motion One scroll() drives animation based on scroll progress.
            // Or using inView().
            
            // Let's use inView for a triggered animation
            
            inView('.project-card', (info) => {
                const { target } = info;
                animate(target, { 
                    opacity: [0, 1], 
                    y: [50, 0] 
                }, { 
                    duration: 0.8, 
                    easing: [0.17, 0.55, 0.55, 1] 
                });
            });
        }

        // 4. Button Hover Scale (Spring)
        document.querySelectorAll('.neu-btn, .navbar-brand').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                animate(btn, { scale: 1.05 }, { easing: spring() });
            });
            btn.addEventListener('mouseleave', () => {
                animate(btn, { scale: 1 }, { easing: spring() });
            });
        });
    });

});
