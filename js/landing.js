// navbar footer connection
fetch('navbar.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
        // Initialize navbar functionality after it's loaded
        initNavbarFunctions();
        initMobileNavbar();
    });

fetch('footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

// Initialize scroll-to-top button
const initScrollToTop = () => {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`;
    scrollBtn.className = 'scroll-to-top-btn';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// Initialize mobile navbar with fullscreen animation
const initMobileNavbar = () => {
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const toggler = document.querySelector('.navbar-toggler');
    
    if (!navbar || !navbarCollapse || !toggler) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);

    const collapseInstance = bootstrap ? bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false }) : null;

    const getCollapseInstance = () => {
        if (collapseInstance) {
            return collapseInstance;
        }
        return bootstrap ? bootstrap.Collapse.getInstance(navbarCollapse) : null;
    };

    const showNav = () => {
        document.body.classList.add('mobile-nav-open');
        overlay.classList.add('active');
    };

    const hideNav = () => {
        document.body.classList.remove('mobile-nav-open');
        overlay.classList.remove('active');
    };

    navbarCollapse.addEventListener('show.bs.collapse', showNav);
    navbarCollapse.addEventListener('hide.bs.collapse', hideNav);

    overlay.addEventListener('click', () => {
        const bsCollapse = getCollapseInstance();
        if (bsCollapse) {
            bsCollapse.hide();
        }
    });

    navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth >= 992) {
                return;
            }

            const bsCollapse = getCollapseInstance();
            if (bsCollapse) {
                bsCollapse.hide();
            }
        });
    });
};

// Initialize navbar-related functions after navbar is loaded
const initNavbarFunctions = () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for modal triggers
            if (this.hasAttribute('data-bs-toggle')) {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                navbar.style.backdropFilter = 'blur(5px)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.backdropFilter = 'none';
            }
        });
    }
};

// ========================================
// BBX Academy - Landing Pages JavaScript
// ========================================

const initCourseTabs = () => {
    const containers = document.querySelectorAll('.courses-tabs');
    if (!containers.length) {
        return;
    }

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    containers.forEach(container => {
        const buttons = Array.from(container.querySelectorAll('.tab-link'));
        const panels = Array.from(container.querySelectorAll('.tab-panel'));
        const tabNav = container.querySelector('.tab-nav');

        if (!buttons.length || !panels.length) {
            return;
        }

        let activeButton = buttons.find(btn => btn.classList.contains('active')) || buttons[0];
        let activePanel = panels.find(panel => panel.classList.contains('active')) || panels[0];

        // Update sliding bubble indicator position
        const updateBubblePosition = (targetButton) => {
            if (!tabNav || !targetButton) return;
            
            const navRect = tabNav.getBoundingClientRect();
            const btnRect = targetButton.getBoundingClientRect();
            const offset = btnRect.left - navRect.left - 12; // 12px is the padding
            const width = btnRect.width;
            
            tabNav.style.setProperty('--tab-offset', `${offset}px`);
            tabNav.style.setProperty('--tab-width', `${width}px`);
        };

        // Initialize bubble position on load
        const initBubble = () => {
            if (activeButton) {
                // Small delay to ensure layout is complete
                requestAnimationFrame(() => {
                    updateBubblePosition(activeButton);
                });
            }
        };

        const setButtonState = (button, isActive) => {
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', isActive ? 'true' : 'false');
            button.setAttribute('tabindex', isActive ? '0' : '-1');
        };

        const setPanelState = (panel, isActive) => {
            panel.classList.toggle('active', isActive);
            if (!isActive) {
                panel.classList.remove('animate-in');
            }
            panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        };

        const runSwitch = targetButton => {
            if (!targetButton || targetButton === activeButton) {
                return;
            }

            const targetId = targetButton.getAttribute('aria-controls');
            const targetPanel = targetId ? container.querySelector(`#${targetId}`) : null;
            if (!targetPanel) {
                return;
            }

            // Update bubble position with smooth animation
            updateBubblePosition(targetButton);

            if (activeButton) {
                setButtonState(activeButton, false);
            }
            if (activePanel) {
                setPanelState(activePanel, false);
            }

            setButtonState(targetButton, true);
            setPanelState(targetPanel, true);

            if (!reduceMotion) {
                targetPanel.classList.add('animate-in');
                targetPanel.addEventListener('animationend', () => {
                    targetPanel.classList.remove('animate-in');
                }, { once: true });
            }

            activeButton = targetButton;
            activePanel = targetPanel;
        };

        const handleKeyNav = event => {
            const key = event.key;
            if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(key)) {
                return;
            }
            event.preventDefault();

            const currentIndex = buttons.indexOf(document.activeElement);
            if (currentIndex === -1) {
                return;
            }

            let targetIndex = currentIndex;
            if (key === 'ArrowRight') {
                targetIndex = (currentIndex + 1) % buttons.length;
            } else if (key === 'ArrowLeft') {
                targetIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            } else if (key === 'Home') {
                targetIndex = 0;
            } else if (key === 'End') {
                targetIndex = buttons.length - 1;
            }

            if (buttons[targetIndex]) {
                buttons[targetIndex].focus();
            }
        };

        buttons.forEach((button, index) => {
            const tabKey = button.dataset.tab || `panel-${index}`;
            const panelId = button.getAttribute('aria-controls') || `tab-${tabKey}`;
            button.setAttribute('aria-controls', panelId);
            button.setAttribute('id', button.id || `tab-btn-${tabKey}`);

            const panel = panels.find(el => el.id === panelId);
            if (panel) {
                panel.setAttribute('role', 'tabpanel');
                panel.setAttribute('aria-labelledby', button.id);
                const isActive = panel === activePanel;
                setPanelState(panel, isActive);
            }

            const isActiveButton = button === activeButton;
            setButtonState(button, isActiveButton);

            button.addEventListener('click', () => {
                runSwitch(button);
            });
            button.addEventListener('keydown', handleKeyNav);
        });

        // Initialize bubble position
        initBubble();
        
        // Update bubble on window resize
        window.addEventListener('resize', () => {
            updateBubblePosition(activeButton);
        });
    });
};

// Floating Badges Mouse Interaction
const initFloatingBadges = () => {
    const mascotScene = document.getElementById('mascotScene');
    const badgesContainer = document.getElementById('badgesContainer');
    
    if (!mascotScene || !badgesContainer) return;
    
    const badges = badgesContainer.querySelectorAll('.floating-badge');
    if (!badges.length) return;
    
    // Store badge data
    const badgeData = [];
    
    badges.forEach((badge, index) => {
        badgeData.push({
            element: badge,
            speed: parseFloat(badge.dataset.speed) || 0.05,
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0,
            floatOffset: 0,
            floatSpeed: 0.6 + Math.random() * 0.3,
            floatAmplitude: 4 + Math.random() * 4,
            floatPhase: Math.random() * Math.PI * 2,
            isFloating: false
        });
    });
    
    // Phase 1: All pills fall to center
    badges.forEach(badge => {
        badge.classList.add('phase-fall');
    });
    
    // Phase 2: After all have fallen (longest delay 0.2s + animation 0.9s + small buffer)
    const scatterDelay = 0.2 + 0.9 + 0.2;
    
    setTimeout(() => {
        badges.forEach(badge => {
            badge.classList.remove('phase-fall');
            badge.classList.add('phase-scatter');
        });
        
        // Phase 3: After scatter transition (1.2s), enable floating
        setTimeout(() => {
            badges.forEach((badge, index) => {
                badge.classList.add('phase-float');
                badgeData[index].isFloating = true;
            });
        }, 1300);
        
    }, scatterDelay * 1000);
    
    // Mouse move handler
    const handleMouseMove = (e) => {
        const rect = mascotScene.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        badgeData.forEach((data) => {
            if (!data.isFloating) return;
            data.targetX = -mouseX * data.speed;
            data.targetY = -mouseY * data.speed;
        });
    };
    
    // Reset when mouse leaves
    const handleMouseLeave = () => {
        badgeData.forEach((data) => {
            data.targetX = 0;
            data.targetY = 0;
        });
    };
    
    let time = 0;
    
    // Animation loop
    const animate = () => {
        time += 0.016;
        
        badgeData.forEach((data) => {
            if (!data.isFloating) return;
            
            // Gentle floating
            data.floatOffset = Math.sin(time * data.floatSpeed + data.floatPhase) * data.floatAmplitude;
            
            // Smoother mouse follow (lower lerp = smoother)
            data.currentX += (data.targetX - data.currentX) * 0.04;
            data.currentY += (data.targetY - data.currentY) * 0.04;
            
            // Apply via CSS custom properties
            data.element.style.setProperty('--mouse-x', `${data.currentX}px`);
            data.element.style.setProperty('--mouse-y', `${data.currentY}px`);
            data.element.style.setProperty('--float-offset', `${data.floatOffset}px`);
        });
        
        requestAnimationFrame(animate);
    };
    
    mascotScene.addEventListener('mousemove', handleMouseMove);
    mascotScene.addEventListener('mouseleave', handleMouseLeave);
    animate();
};

// Initialize AOS and tabs
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    initCourseTabs();
    initFloatingBadges();
    initScrollToTop();
});

// GSAP ScrollTrigger Animations
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero section animations
    gsap.from('.hero-headline', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.hero-subheadline', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.hero-ctas', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out'
    });

    // Floating cards animation
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            delay: 0.6 + (index * 0.2),
            ease: 'back.out(1.7)'
        });
    });

    // Course cards hover effect
    const courseCards = document.querySelectorAll('.course-card:not(.featured)');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Methodology cards stagger animation
    gsap.from('.methodology-card', {
        scrollTrigger: {
            trigger: '.methodology-section',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Methodology orbit animation
    const orbitEl = document.querySelector('.orbit-container');
    if (orbitEl && typeof gsap !== 'undefined') {
        gsap.to('.orbit-ring', { rotation: 360, duration: 22, ease: 'none', repeat: -1 });
        gsap.utils.toArray('.tool-icon').forEach((el, i) => {
            gsap.to(el, { y: 8, duration: 2.2 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        });
        gsap.from('.tool-icon', {
            scrollTrigger: {
                trigger: '.methodology-section',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.8,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });
        gsap.from('.methodology-list li', {
            scrollTrigger: {
                trigger: '.methodology-section',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 20,
            stagger: 0.15,
            duration: 0.6,
            ease: 'power3.out'
        });
    }

    // Comparison table rows animation
    gsap.from('.comparison-row', {
        scrollTrigger: {
            trigger: '.comparison-section',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -50,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
    });

    // Stats counter animation
    const statItems = document.querySelectorAll('.stat-item h3');
    statItems.forEach(stat => {
        const endValue = stat.textContent;
        const numericValue = parseInt(endValue.replace(/\D/g, ''));
        
        if (!isNaN(numericValue)) {
            gsap.from(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                textContent: 0,
                duration: 2,
                ease: 'power1.out',
                snap: { textContent: 1 },
                onUpdate: function() {
                    const currentValue = Math.ceil(this.targets()[0].textContent);
                    this.targets()[0].textContent = currentValue + '+';
                }
            });
        }
    });

    // CTA section scale animation
    gsap.from('.cta-card', {
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        scale: 0.9,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });
}

// Form submission handling
const enrollForm = document.getElementById('enrollForm');
if (enrollForm) {
    enrollForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('studentName').value;
        const email = document.getElementById('studentEmail').value;
        const phone = document.getElementById('studentPhone').value;
        const course = document.getElementById('studentCourse').value;
        
        // Here you would typically send this data to your backend
        console.log('Form submitted:', { name, email, phone, course });
        
        // Show success message
        alert('Thank you for your interest! Our team will contact you shortly.');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('enrollModal'));
        modal.hide();
        
        // Reset form
        enrollForm.reset();
    });
}

// Add parallax effect to hero section
if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const parallaxElements = heroSection.querySelectorAll('.floating-card');
            parallaxElements.forEach((element, index) => {
                const speed = 0.1 + (index * 0.05);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });
}

// Testimonial carousel auto-play enhancement
const testimonialCarousel = document.querySelector('#testimonialCarousel');
if (testimonialCarousel) {
    // Auto-play with pause on hover
    let carouselInstance = new bootstrap.Carousel(testimonialCarousel, {
        interval: 5000,
        wrap: true
    });
    
    testimonialCarousel.addEventListener('mouseenter', () => {
        carouselInstance.pause();
    });
    
    testimonialCarousel.addEventListener('mouseleave', () => {
        carouselInstance.cycle();
    });
}

// Add entrance animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all feature items
document.querySelectorAll('.feature-item, .trust-badge').forEach(item => {
    observer.observe(item);
});

// Add animation class
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Accordion smooth animation
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', function() {
        const wasCollapsed = this.classList.contains('collapsed');
        
        if (!wasCollapsed) {
            return; // Button is being collapsed, do nothing
        }
        
        // Smooth scroll to accordion item
        setTimeout(() => {
            const rect = this.getBoundingClientRect();
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            
            if (rect.top < navbarHeight) {
                window.scrollBy({
                    top: rect.top - navbarHeight - 20,
                    behavior: 'smooth'
                });
            }
        }, 350); // Wait for Bootstrap's collapse animation
    });
});

// Interactive Moving Circles for Coming Soon Tabs
const initInteractiveCircles = () => {
    const containers = document.querySelectorAll('.interactive-bg');
    
    containers.forEach(container => {
        const circles = container.querySelectorAll('.floating-circle');
        const parentWrapper = container.closest('.coming-soon-wrapper');
        
        if (!parentWrapper) return;
        
        // Mouse move effect
        parentWrapper.addEventListener('mousemove', (e) => {
            const rect = parentWrapper.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            circles.forEach((circle, index) => {
                // Different movement intensity for each circle
                const intensity = (index + 1) * 0.08;
                const moveX = (mouseX - centerX) * intensity;
                const moveY = (mouseY - centerY) * intensity;
                
                // Apply transform with some delay for smooth effect
                circle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
        
        // Reset on mouse leave
        parentWrapper.addEventListener('mouseleave', () => {
            circles.forEach(circle => {
                circle.style.transform = 'translate(0, 0)';
            });
        });
        
        // Add hover effect on circles - make pointer events work
        circles.forEach(circle => {
            circle.style.pointerEvents = 'auto';
            
            circle.addEventListener('mouseenter', () => {
                circle.style.transform = 'scale(1.3)';
                circle.style.opacity = '0.9';
            });
            
            circle.addEventListener('mouseleave', () => {
                circle.style.transform = 'scale(1)';
                circle.style.opacity = '0.6';
            });
        });
    });
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initInteractiveCircles);
