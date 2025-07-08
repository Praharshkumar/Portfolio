// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 70;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Header background change on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Active navigation link highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.clientHeight;
            if (sectionTop <= 200 && sectionTop + sectionHeight > 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Feedback/Testimonials Slider
    const feedbackCards = document.querySelectorAll('.feedback-card');
    const feedbackBtns = document.querySelectorAll('.feedback-btn');
    let currentSlide = 0;

    function showSlide(index) {
        feedbackCards.forEach(card => card.classList.remove('active'));
        feedbackBtns.forEach(btn => btn.classList.remove('active'));
        
        feedbackCards[index].classList.add('active');
        feedbackBtns[index].classList.add('active');
    }

    feedbackBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-slide testimonials
    setInterval(() => {
        currentSlide = (currentSlide + 1) % feedbackCards.length;
        showSlide(currentSlide);
    }, 5000);

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Basic form validation
            if (!formObject.name || !formObject.email || !formObject.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(formObject.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Submit to database
            const success = await submitContactForm(formObject);
            if (success) {
                contactForm.reset();
            }
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Typing animation for hero section
    const heroTitle = document.querySelector('.hero-content h1:last-of-type');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.innerHTML += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }

    // Skills animation on scroll
    const skillItems = document.querySelectorAll('.skill-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });

    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Add parallax to other sections
        const sections = document.querySelectorAll('.about, .skills, .projects');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const speed = 0.1;
            const yPos = -(rect.top * speed);
            section.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Dynamic text in hero section
    const dynamicTexts = [
        'Software Developer',
        'Data Analyst', 
        'AI/ML Specialist',
        
    ];
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeText() {
            const currentText = dynamicTexts[textIndex];
            
            if (isDeleting) {
                heroSubtitle.textContent = `I am into ${currentText.substring(0, charIndex - 1)}`;
                charIndex--;
            } else {
                heroSubtitle.textContent = `I am into ${currentText.substring(0, charIndex + 1)}`;
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 100 : 150;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % dynamicTexts.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeText, typeSpeed);
        }
        
        // Start the typing animation
        setTimeout(typeText, 2000);
    }

    // Add loading states for external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 1000);
        });
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Add some interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .skill-item, .project-card, .service-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });

    // Load dynamic content from database
    loadProjects();
    loadCertifications();
    
    // Console welcome message
    console.log(`
    🚀 Welcome to My Portfolio!
    
    Thanks for checking out the code!
    
    Built with:
    - HTML5
    - CSS3 (Grid, Flexbox, Custom Properties)
    - Vanilla JavaScript
    - AOS (Animate On Scroll)
    - Font Awesome Icons
    - PostgreSQL Database
    - Flask API
    
    Feel free to reach out if you have any questions!
    `);
});

// API functions to load dynamic content
async function loadProjects() {
    try {
        const response = await fetch('http://localhost:8000/api/projects');
        const projects = await response.json();
        
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid && projects.length > 0) {
            // Clear existing content except the "View All Projects" section
            projectsGrid.innerHTML = '';
            
            projects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            });
            
            // Re-initialize AOS for new elements
            AOS.refresh();
        }
    } catch (error) {
        console.log('Using static project data - API not available');
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');
    
    const techTags = project.technologies.map(tech => 
        `<span>${tech}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image_url}" alt="${project.title}">
            <div class="project-overlay">
                <a href="${project.live_url}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i></a>
                <a href="${project.github_url}" class="project-link" target="_blank"><i class="fab fa-github"></i></a>
            </div>
        </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tech">
                ${techTags}
            </div>
            <div class="project-links">
                <a href="${project.live_url}" class="btn btn-sm" target="_blank">Live Demo</a>
                <a href="${project.github_url}" class="btn btn-sm btn-secondary" target="_blank">GitHub</a>
            </div>
        </div>
    `;
    
    return card;
}

async function loadCertifications() {
    try {
        const response = await fetch('http://localhost:8000/api/certifications');
        const certifications = await response.json();
        
        const certsGrid = document.querySelector('.certifications-grid');
        if (certsGrid && certifications.length > 0) {
            certsGrid.innerHTML = '';
            
            certifications.forEach(cert => {
                const certCard = createCertificationCard(cert);
                certsGrid.appendChild(certCard);
            });
            
            AOS.refresh();
        }
    } catch (error) {
        console.log('Using static certification data - API not available');
    }
}

function createCertificationCard(cert) {
    const card = document.createElement('div');
    card.className = 'cert-card';
    card.setAttribute('data-aos', 'fade-up');
    
    const issueDate = new Date(cert.issue_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });
    
    card.innerHTML = `
        <div class="cert-image">
            <img src="${cert.image_url}" alt="${cert.title}">
        </div>
        <div class="cert-content">
            <h3>${cert.title}</h3>
            <p>${cert.issuer}</p>
            <small>Issued: ${issueDate}</small>
            <br><br>
            <a href="${cert.verify_url}" class="btn btn-sm" target="_blank">Verify Certificate</a>
        </div>
    `;
    
    return card;
}

// Update contact form to submit to database
async function submitContactForm(formData) {
    try {
        const response = await fetch('http://localhost:8000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            return true;
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        return false;
    }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce((event) => {
    // Scroll event handlers here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element with selector "${selector}" not found`);
    }
    return element;
}

// Theme toggle functionality (bonus feature)
function createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--gradient-primary);
        color: white;
        cursor: pointer;
        z-index: 1000;
        transition: var(--transition);
        box-shadow: var(--shadow);
    `;
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

// Initialize theme toggle
// createThemeToggle();
