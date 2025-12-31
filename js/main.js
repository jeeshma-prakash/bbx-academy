// ========================================
// BBX Academy - Main JavaScript
// ========================================

// Preloader Animation
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    
    // Wait for 2.5 seconds then hide preloader
    setTimeout(() => {
        preloader.classList.add('hidden');
        
        // Show main content after preloader fades
        setTimeout(() => {
            mainContent.classList.add('visible');
            
            // Initialize AOS after content is visible
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 1000,
                    once: true,
                    offset: 100,
                    easing: 'ease-out-cubic'
                });
            }
        }, 300);
    }, 2500);
});



// Audience Card Hover Effects with GSAP
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.audience-card');
    
    cards.forEach((card, index) => {
        // Entrance animation
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 80,
            rotateX: -15,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'back.out(1.7)'
        });
        
        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(this, {
                duration: 0.3,
                rotateX: -rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                ease: 'power2.out'
            });
        });
    });
    
    // Animate trust indicators on scroll
    const trustItems = document.querySelectorAll('.trust-item h4');
    if (trustItems.length > 0) {
        trustItems.forEach((item, index) => {
            gsap.from(item.parentElement, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power3.out'
            });
            
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                textContent: 0,
                duration: 2,
                delay: 0.3,
                ease: 'power1.out',
                snap: { textContent: 1 },
                onUpdate: function() {
                    const value = this.targets()[0].textContent;
                    // Keep the formatting for percentage and rating
                    if (item.parentElement.querySelector('p').textContent.includes('Success Rate')) {
                        this.targets()[0].textContent = Math.ceil(value) + '%';
                    } else if (item.parentElement.querySelector('p').textContent.includes('Rating')) {
                        this.targets()[0].textContent = (Math.ceil(value * 10) / 10).toFixed(1) + '/5';
                    } else if (item.parentElement.querySelector('p').textContent.includes('Students')) {
                        this.targets()[0].textContent = Math.ceil(value) + '+';
                    } else {
                        this.targets()[0].textContent = Math.ceil(value) + '+';
                    }
                }
            });
        });
    }
    
    // Parallax effect for hero elements
    window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        
        gsap.to('.shape-1', {
            x: moveX * 2,
            y: moveY * 2,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.to('.shape-2', {
            x: -moveX * 1.5,
            y: -moveY * 1.5,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.to('.shape-3', {
            x: moveX,
            y: moveY,
            duration: 1,
            ease: 'power2.out'
        });
    });
    
    // Magnetic effect for cards
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(this, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// GSAP ScrollTrigger for background shapes
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        gsap.to(shape, {
            scrollTrigger: {
                trigger: shape,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: index % 2 === 0 ? 100 : -100,
            rotation: index % 2 === 0 ? 180 : -180,
            ease: 'none'
        });
    });
}

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Smooth follower animation
    function animateFollower() {
        const distX = mouseX - followerX;
        const distY = mouseY - followerY;
        
        followerX += distX * 0.1;
        followerY += distY * 0.1;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Cursor hover effects
    const hoverables = document.querySelectorAll('a, button, .audience-card');
    hoverables.forEach(hoverable => {
        hoverable.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            follower.style.transform = 'scale(1.5)';
        });
        
        hoverable.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
        });
    });
}

