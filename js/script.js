// Theme Toggle Functionality
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
// Hamburger and Close icons for mobile menu button
const hamburgerIconSVG = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
const closeIconSVG = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;


function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const themeBtn = document.getElementById('theme-toggle-button');
    if (themeBtn) {
        themeBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    }
}

let initialUserTheme = localStorage.getItem('theme');
let prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = initialUserTheme || (prefersDark ? 'dark' : 'light');
applyTheme(currentTheme);

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Mobile Menu Toggle Functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    function openMobileMenu() {
        if (mobileMenu && mobileMenuOverlay && mobileMenuButton) {
            mobileMenu.classList.add('open');
            mobileMenuOverlay.classList.add('open');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
            mobileMenuButton.innerHTML = closeIconSVG; // Use SVG string
            document.body.classList.add('mobile-menu-open-body-lock');
        }
    }

    function closeMobileMenu() {
         if (mobileMenu && mobileMenuOverlay && mobileMenuButton) {
            mobileMenu.classList.remove('open');
            mobileMenuOverlay.classList.remove('open');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenuButton.innerHTML = hamburgerIconSVG; // Use SVG string
            document.body.classList.remove('mobile-menu-open-body-lock');
        }
    }

    if (mobileMenuButton && mobileMenu && mobileMenuOverlay) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenu.classList.contains('open');
            if (isExpanded) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Smooth scroll for all anchor links & close mobile menu if open
    // --- START OF MODIFIED SECTION ---
    document.querySelectorAll('nav a[href^="#"], #mobile-menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const wasMobileMenuOpen = mobileMenu && mobileMenu.classList.contains('open'); // Check state BEFORE closing

            if (wasMobileMenuOpen) {
                closeMobileMenu();
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarEl = document.getElementById('navbar');
                const navbarHeight = navbarEl ? navbarEl.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navbarHeight;

                // If mobile menu was open and just closed, give a tiny delay for the body's overflow to update
                if (wasMobileMenuOpen) {
                    setTimeout(() => {
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 50); // A small delay like 50ms might be enough (adjust if needed)
                } else {
                    // For desktop or if menu was already closed, scroll immediately
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    // --- END OF MODIFIED SECTION ---


    // Navbar scroll effect
    const navbarEl = document.getElementById('navbar');
    if (navbarEl) {
        const setNavbarAppearance = () => {
            if (window.scrollY > 50) {
                navbarEl.classList.add('scrolled');
                 navbarEl.style.backgroundColor = ''; // Reset to use CSS variable from .scrolled
            } else {
                navbarEl.classList.remove('scrolled');
                // Set background to primary only if not scrolled to avoid overriding theme switch
                const currentBgPrimary = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
                if (navbarEl.style.backgroundColor !== currentBgPrimary) {
                     navbarEl.style.backgroundColor = currentBgPrimary;
                }
            }
        };
        setNavbarAppearance(); // Initial check
        window.addEventListener('scroll', setNavbarAppearance);
    }

    // Hero background fallback
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const heroBgImg = new Image();
        heroBgImg.src = 'https://picsum.photos/seed/hero-bg-theme-v5/1920/1080';
        heroBgImg.onerror = function() {
            heroSection.classList.add('hero-bg-fallback');
        };
    }

    // Typing Effect
    const roles = ["مطور واجهات أمامية إبداعي", "مطور واجهات خلفية قوي", "مهندس برمجيات متكامل", "محترف في تحويل الأفكار إلى واقع"];
    let roleIndex = 0;
    let charIndex = 0;
    const typingTextElement = document.getElementById('typing-text');
    const typingContainerElement = document.getElementById('typing-role-container');

    function type() {
        if (typingTextElement && charIndex < roles[roleIndex].length) {
            typingTextElement.textContent += roles[roleIndex].charAt(charIndex);
            charIndex++;
            if (typingContainerElement) {
                typingContainerElement.style.width = `auto`;
                typingContainerElement.style.display = 'inline-block';
            }
            setTimeout(type, 90); // Typing speed
        } else {
            setTimeout(erase, 2800); // Pause before erasing
        }
    }

    function erase() {
        if (typingTextElement && charIndex > 0) {
            typingTextElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            if (typingContainerElement) {
                typingContainerElement.style.width = `auto`;
                typingContainerElement.style.display = 'inline-block';
            }
            setTimeout(erase, 45); // Erasing speed
        } else {
            roleIndex = (roleIndex + 1) % roles.length;
            if (typingContainerElement) { // Ensure caret animation reset correctly
                typingContainerElement.style.animation = 'none'; // Reset animation
                void typingContainerElement.offsetWidth; // Trigger reflow
                typingContainerElement.style.animation = 'blink-caret .75s step-end infinite';
            }
            setTimeout(type, 700); // Pause before typing next role
        }
    }

    if (typingTextElement && typingContainerElement) {
        // Initial animation is set by CSS, JS will handle subsequent resets if needed.
        setTimeout(type, 1500); // Initial delay before typing starts
    }

    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || '0';
                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Animate Skill Bars
    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const skillBar = skillItem.querySelector('.skill-bar');
                const skillValueElement = skillItem.querySelector('.skill-value');
                const targetLevel = parseInt(skillItem.dataset.skillLevel);

                if (skillBar && skillValueElement && !isNaN(targetLevel)) {
                    setTimeout(() => {
                        let currentPercentage = 0;
                        const finalPercentage = Math.max(0, Math.min(100, targetLevel));

                        skillValueElement.textContent = '0%'; // Initialize text
                        skillBar.style.width = '0%';    // Initialize bar width

                        if (finalPercentage === 0) {
                             skillValueElement.textContent = '0%';
                             skillBar.style.width = '0%';
                            observer.unobserve(skillItem); // Unobserve after animation
                            return;
                        }

                        const animationDuration = 1000; // 1 second
                        const steps = finalPercentage;
                        const stepTime = Math.max(10, animationDuration / steps);

                        const interval = setInterval(() => {
                            currentPercentage++;

                            skillValueElement.textContent = currentPercentage + '%';
                            skillBar.style.width = currentPercentage + '%';

                            if (currentPercentage >= finalPercentage) {
                                clearInterval(interval);
                                skillValueElement.textContent = finalPercentage + '%';
                                skillBar.style.width = finalPercentage + '%';
                            }
                        }, stepTime);
                    }, 250); // Delay before starting animation
                }
                observer.unobserve(skillItem); // Unobserve after animation starts
            }
        });
    }, {
        threshold: 0.35 // Trigger when 35% of skill item is visible
    });

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });

    // Update current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Particle effect for hero section
    const particlesContainer = document.getElementById('particles-container');
    const numberOfParticles = 30;

    if (particlesContainer) {
        for (let i = 0; i < numberOfParticles; i++) {
            let particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = particle.style.width;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 12}s`;
            particle.style.animationDuration = `${Math.random() * 12 + 18}s`;
            particlesContainer.appendChild(particle);
        }
    }

    // Form submission simulation
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            formMessage.textContent = 'شكراً لك! تم استلام رسالتك بنجاح. (هذه محاكاة)';
            formMessage.className = 'mt-7 text-center text-green-400'; // Directly use Tailwind class or a CSS variable equivalent
            this.reset();
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'mt-7 text-center';
            }, 5500);
        });
    }
}); // End of DOMContentLoaded
