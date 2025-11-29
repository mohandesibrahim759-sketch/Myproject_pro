// Main JavaScript File - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تحميل الموقع...');
    
    // Initialize all components
    initLoader();
    initNavigation();
    initThemeToggle();
    initTypingEffect();
    initScrollEffects();
    initSkillBars();
    initProjectFilter();
    initContactForm();
    initBackToTop();
    initCounters();
    initBlog();
    initAOS();
    initParticles();
    initCursorEffects();
    initPreloaderAnimations();
    initFormAnimations();
    initProjectsData();
    initBlogData();
    
    // الأنظمة الأساسية
    initTestimonialsSystem();
    
    // الأنظمة الأخرى
    initBookingSystem();
    initStoreSystem();
    initCMS();
    initAnalytics();
    initCaseStudies();
    
    console.log('✅ تم تحميل جميع الأنظمة بنجاح');
});

// Enhanced Loader with Progress
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'loader-progress';
    progressBar.innerHTML = '<div class="loader-progress-bar"></div>';
    document.querySelector('.loader-content').appendChild(progressBar);
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 800);
            }, 500);
        }
        const progressBarElement = document.querySelector('.loader-progress-bar');
        if (progressBarElement) {
            progressBarElement.style.width = progress + '%';
        }
    }, 200);
}

// Enhanced Navigation
function initNavigation() {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!header || !hamburger || !navLinks) return;
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // Header background effect
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Header hide/show on scroll
        if (scrollY > lastScrollY && scrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = window.scrollY;
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    smoothScrollTo(targetSection, 1000);
                }
            }
            
            // Close mobile menu
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Enhanced active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
}

// Enhanced Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('i');
    
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check for saved theme preference or use system preference
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = systemPrefersDark ? 'dark' : 'light';
    }
    
    // Apply theme
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    
    // Theme toggle with animation
    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        // Add transition class for smooth theme change
        document.documentElement.classList.add('theme-transition');
        
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
        
        // Remove transition class after animation
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        }
    });
}

// Enhanced Typing Effect
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const texts = [
        'مطور واجهات أمامية محترف',
        'مصمم تجربة مستخدم',
        'مطور تطبيقات ويب',
        'خبير أداء وتحسين',
        'مبرمج متعدد المهارات',
        'مطور حلول رقمية'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100 + Math.random() * 50;
        }
        
        // Add cursor blink
        typingText.style.borderRight = '2px solid var(--primary)';
        
        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end of text
            typingSpeed = 2000;
            isDeleting = true;
            setTimeout(() => {
                typingText.style.borderRight = '2px solid transparent';
            }, 500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing after a delay
    setTimeout(type, 1000);
}

// Enhanced Scroll Effects
function initScrollEffects() {
    // Enhanced back to top button
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        if (scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            smoothScrollTo(document.body, 800);
        });
    }
    
    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                smoothScrollTo(target, 1000);
            }
        });
    });
}

// Enhanced Skill Bars
function initSkillBars() {
    // Linear skill bars
    const skillBars = document.querySelectorAll('.skill-progress');
    const linearObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.3 });
    
    skillBars.forEach(bar => {
        linearObserver.observe(bar);
    });
    
    // Circular progress charts
    const chartCircles = document.querySelectorAll('.chart-circle');
    const circleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = entry.target.getAttribute('data-percent');
                entry.target.style.background = `conic-gradient(var(--primary) ${percent}%, var(--dark) 0%)`;
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.3 });
    
    chartCircles.forEach(circle => {
        circleObserver.observe(circle);
    });
}

// Enhanced Project Filter
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects with animation
            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || category === filterValue;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, index * 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// نظام الاتصال المحسن
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        console.log('📧 تحميل نموذج الاتصال...');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showNotification('البريد الإلكتروني غير صحيح', 'error');
                return;
            }

            // إرسال الإيميل مباشرة
            sendDirectEmail(name, email, subject, message);
        });
    }
}

// إرسال الإيميل مباشرة
function sendDirectEmail(name, email, subject, message) {
    const emailBody = `
اسم المرسل: ${name}
البريد الإلكتروني: ${email}

الرسالة:
${message}

---
تم الإرسال من موقع ابراهيم المخلافي
    `.trim();

    const mailtoLink = `mailto:mohandesibrahim795@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // فتح بريد المستخدم الإلكتروني
    window.open(mailtoLink, '_blank');
    
    showNotification('يتم فتح بريدك الإلكتروني... يرجى إرسال الرسالة', 'info');
    
    // إعادة تعيين النموذج
    setTimeout(() => {
        document.getElementById('contactForm').reset();
        showNotification('شكراً لتواصلك! سأرد عليك قريباً 📧', 'success');
    }, 2000);
}

// Enhanced Back to Top
function initBackToTop() {
    // Already implemented in scroll effects
}

// Enhanced Counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                let start = null;
                
                const easeOutQuart = t => 1 - --t * t * t * t;
                
                function animateCounter(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);
                    const easePercentage = easeOutQuart(percentage);
                    
                    const value = Math.floor(easePercentage * target);
                    counter.textContent = value.toLocaleString();
                    
                    if (progress < duration) {
                        requestAnimationFrame(animateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }
                
                requestAnimationFrame(animateCounter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.3 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Enhanced Testimonials Slider
function initTestimonials() {
    const sliderContainer = document.querySelector('.testimonials-container');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (!sliderContainer || testimonials.length === 0) return;
    
    let currentIndex = 0;
    const totalTestimonials = testimonials.length;
    
    // Set initial position
    updateSliderPosition();
    
    function updateSliderPosition() {
        sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        sliderContainer.style.transition = 'transform 0.5s ease-in-out';
        
        // تحديث النقاط النشطة
        document.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function nextSlide() {
        if (currentIndex >= totalTestimonials - 1) {
            currentIndex = 0; // العودة للبداية
        } else {
            currentIndex++;
        }
        updateSliderPosition();
    }
    
    function prevSlide() {
        if (currentIndex <= 0) {
            currentIndex = totalTestimonials - 1; // الذهاب للنهاية
        } else {
            currentIndex--;
        }
        updateSliderPosition();
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Auto slide
    let autoSlide = setInterval(nextSlide, 5000);
    
    // Pause auto-slide on hover
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });
    
    // Touch swipe support
    let startX = 0;
    let endX = 0;
    
    sliderContainer.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });
    
    sliderContainer.addEventListener('touchend', e => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // جعل الدوال متاحة globally
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
}

// Enhanced Blog
function initBlog() {
    // Lazy load images
    const blogImages = document.querySelectorAll('.blog-image img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src') || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    blogImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize AOS
function initAOS() {
    // Custom AOS implementation for better performance
    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('[data-aos]').forEach(el => {
        aosObserver.observe(el);
    });
}

// Particle Effects Background
function initParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    heroSection.appendChild(particlesContainer);
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
}

// Custom Cursor Effects
function initCursorEffects() {
    // Only enable on non-touch devices
    if (window.matchMedia('(hover: hover)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Add hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }
}

// Enhanced Preloader Animations
function initPreloaderAnimations() {
    // Add loading animations for elements
    const animatedElements = document.querySelectorAll('.service-card, .project-card, .skill, .stat, .testimonial-card, .blog-card');
    
    animatedElements.forEach((el, index) => {
        el.style.setProperty('--animation-order', index);
    });
}

// Form Animations
function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check initial value
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// بيانات المشاريع
function initProjectsData() {
    const projects = [
        {
            id: 1,
            title: "موقع تجارة إلكترونية",
            description: "موقع متكامل للتجارة الإلكترونية مع نظام دفع آمن وإدارة للمخزون.",
            image: "assets/img/1.jpg",
            category: "web",
            tags: ["HTML", "CSS", "JavaScript", "React"],
            liveUrl: "#",
            demoUrl: "#"
        },
        {
            id: 2,
            title: "تطبيق إدارة المهام",
            description: "تطبيق ويب متكامل لإدارة المهام اليومية مع ميزات متقدمة.",
            image: "assets/img/1.jpg",
            category: "web",
            tags: ["React", "Node.js", "MongoDB"],
            liveUrl: "#",
            demoUrl: "#"
        },
        {
            id: 3,
            title: "تصميم واجهة تطبيق جوال",
            description: "تصميم حديث وبديع لواجهة تطبيق جوال لخدمة التوصيل.",
            image: "R.jfif",
            category: "design",
            tags: ["Figma", "UI/UX", "Adobe XD"],
            liveUrl: "#",
            demoUrl: "#"
        },
        {
            id: 4,
            title: "تطبيق الياقة البدنية",
            description: "تطبيق جوال متكامل لمتابعة التمارين الرياضية واللياقة البدنية.",
            image: "mmm.png",
            category: "mobile",
            tags: ["React Native", "Firebase", "API"],
            liveUrl: "#",
            demoUrl: "#"
        },
        {
            id: 5,
            title: "منصة تعليمية",
            description: "منصة متكاملة للتعلم الإلكتروني مع نظام إدارة المحتوى.",
            image: "assets/img/1.jpg",
            category: "web",
            tags: ["Vue.js", "Laravel", "MySQL"],
            liveUrl: "#",
            demoUrl: "#"
        },
        {
            id: 6,
            title: "تطبيق إدارة المخزون",
            description: "تطبيق متكامل لإدارة المخزون والمبيعات للشركات الصغيرة.",
            image: "assets/img/ic_launcher.png",
            category: "mobile",
            tags: ["Flutter", "SQLite", "REST API"],
            liveUrl: "#",
            demoUrl: "#"
        }
    ];

    renderProjects(projects);
}

// عرض المشاريع
function renderProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-category', project.category);
        projectCard.setAttribute('data-aos', 'fade-up');
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-links">
                        <a href="${project.liveUrl}" class="project-link" title="عرض المشروع">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                        <a href="${project.demoUrl}" class="project-link" title="عرض التفاصيل">
                            <i class="fas fa-search"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        projectsGrid.appendChild(projectCard);
    });

    // إعادة تهيئة filter بعد إضافة المشاريع
    initProjectFilter();
}

// بيانات المدونة
function initBlogData() {
    const blogPosts = [
        {
            id: 1,
            title: "أفضل ممارسات تطوير الويب في 2024",
            excerpt: "تعرف على أحدث التقنيات والممارسات في مجال تطوير الويب لهذا العام.",
            image: "assets/img/1.jpg",
            date: "2024-01-15",
            category: "تطوير الويب",
            readTime: "5 دقائق",
            url: "#"
        },
        {
            id: 2,
            title: "كيفية تحسين أداء مواقع الويب",
            excerpt: "نصائح وتقنيات عملية لتحسين سرعة وأداء مواقع الويب.",
            image: "assets/img/1.jpg",
            date: "2024-01-10",
            category: "أداء الموقع",
            readTime: "4 دقائق",
            url: "#"
        },
        {
            id: 3,
            title: "مقدمة إلى React.js للمبتدئين",
            excerpt: "دليل شامل للبدء مع مكتبة React.js وتطوير تطبيقات ويب تفاعلية.",
            image: "assets/img/1.jpg",
            date: "2024-01-05",
            category: "أطر العمل",
            readTime: "7 دقائق",
            url: "#"
        },
        {
            id: 4,
            title: "أهمية تجربة المستخدم في التصميم",
            excerpt: "لماذا تعتبر تجربة المستخدم العنصر الأهم في نجاح أي منتج رقمي.",
            image: "assets/img/1.jpg",
            date: "2024-01-01",
            category: "تصميم",
            readTime: "6 دقائق",
            url: "#"
        }
    ];

    renderBlogPosts(blogPosts);
}

// عرض مقالات المدونة
function renderBlogPosts(posts) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    blogGrid.innerHTML = '';

    posts.forEach(post => {
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-card';
        blogCard.setAttribute('data-aos', 'fade-up');
        
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        blogCard.innerHTML = `
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="blog-date">
                    <span>${formattedDate}</span>
                </div>
            </div>
            <div class="blog-content">
                <span class="blog-category">${post.category}</span>
                <h3>
                    <a href="${post.url}">${post.title}</a>
                </h3>
                <p>${post.excerpt}</p>
                <div class="blog-meta">
                    <span class="read-time">
                        <i class="far fa-clock"></i> ${post.readTime}
                    </span>
                    <a href="${post.url}" class="blog-link">
                        اقرأ المزيد <i class="fas fa-arrow-left"></i>
                    </a>
                </div>
            </div>
        `;

        blogGrid.appendChild(blogCard);
    });
}

// نظام التقييمات المحسن والمضمون
function initTestimonialsSystem() {
    console.log('🌟 بدء تحميل نظام التقييمات...');
    
    // تأخير التنفيذ لضمان تحميل الـ DOM
    setTimeout(() => {
        // تحميل التقييمات من localStorage
        let testimonials = JSON.parse(localStorage.getItem('ibrahim_testimonials'));
        
        if (!testimonials) {
            testimonials = [
                {
                    id: 1,
                    name: "أحمد محمد",
                    position: "مدير شركة تقنية",
                    content: "عمل ابراهيم كان استثنائياً. قام بتطوير موقعنا باحترافية عالية وتجاوز توقعاتنا. أنصح بالتعامل معه.",
                    rating: 5,
                    date: new Date().toISOString(),
                    approved: true
                },
                {
                    id: 2,
                    name: "فاطمة علي",
                    position: "صاحبة متجر إلكتروني",
                    content: "شكراً لابراهيم على العمل الرائع في تطوير متجرنا الإلكتروني. التصميم كان رائعاً والأداء ممتاز.",
                    rating: 5,
                    date: new Date().toISOString(),
                    approved: true
                },
                {
                    id: 3,
                    name: "خالد عبدالله",
                    position: "مدير مشاريع",
                    content: "محترف ومتميز في عمله. التزم بالمواعيد وأنتج عملًا يتجاوز التوقعات. سأعمل معه مرة أخرى.",
                    rating: 5,
                    date: new Date().toISOString(),
                    approved: true
                }
            ];
            localStorage.setItem('ibrahim_testimonials', JSON.stringify(testimonials));
        }

        renderTestimonials(testimonials);
        initTestimonialForm();
        updateTestimonialsStats();
        
        console.log('✅ نظام التقييمات جاهز');
    }, 500);
}

function renderTestimonials(testimonials) {
    const container = document.getElementById('testimonialsContainer');
    if (!container) {
        console.error('❌ لم يتم العثور على حاوية التقييمات - testimonialsContainer');
        return;
    }

    const approvedTestimonials = testimonials.filter(t => t.approved);
    
    if (approvedTestimonials.length === 0) {
        container.innerHTML = `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <p>لا توجد تقييمات حتى الآن. كن أول من يشارك تجربته!</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = approvedTestimonials.map(testimonial => `
        <div class="testimonial-card">
            <div class="testimonial-content">
                <div class="testimonial-rating">
                    ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                </div>
                <p>"${testimonial.content}"</p>
            </div>
            <div class="testimonial-author">
                <div class="author-info">
                    <h4>${testimonial.name}</h4>
                    <span>${testimonial.position}</span>
                    <span class="testimonial-date">${new Date(testimonial.date).toLocaleDateString('ar-EG')}</span>
                </div>
            </div>
        </div>
    `).join('');

    console.log(`✅ تم عرض ${approvedTestimonials.length} تقييم`);
}

function initTestimonialForm() {
    const form = document.getElementById('addTestimonialForm');
    if (!form) {
        console.error('❌ لم يتم العثور على نموذج التقييم - addTestimonialForm');
        return;
    }

    // نظام النجوم
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('clientRating');

    if (!stars.length || !ratingInput) {
        console.error('❌ لم يتم العثور على النجوم أو حقل التقييم');
        return;
    }

    // إضافة أحداث النقر على النجوم
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;
            
            // تحديث مظهر النجوم
            stars.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                if (sRating <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // تعيين 5 نجوم افتراضياً
    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-rating')) <= 5) {
            star.classList.add('active');
        }
    });

    // إرسال النموذج
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('clientName').value.trim();
        const position = document.getElementById('clientPosition').value.trim();
        const content = document.getElementById('clientTestimonial').value.trim();
        const rating = parseInt(document.getElementById('clientRating').value);

        // التحقق من الحقول
        if (!name || !position || !content) {
            showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        if (content.length < 10) {
            showNotification('الرأي يجب أن يكون至少 10 أحرف', 'error');
            return;
        }

        // إنشاء التقييم الجديد
        const newTestimonial = {
            id: Date.now(),
            name,
            position,
            content,
            rating,
            date: new Date().toISOString(),
            approved: true
        };

        // جلب التقييمات الحالية من localStorage
        const testimonials = JSON.parse(localStorage.getItem('ibrahim_testimonials')) || [];
        
        // إضافة التقييم الجديد في بداية المصفوفة
        testimonials.unshift(newTestimonial);
        
        // حفظ في localStorage
        localStorage.setItem('ibrahim_testimonials', JSON.stringify(testimonials));

        // إعادة تحميل التقييمات
        renderTestimonials(testimonials);
        
        // تحديث الإحصائيات
        updateTestimonialsStats();

        // إعادة تعيين النموذج
        form.reset();
        
        // إعادة تعيين النجوم إلى 5 نجوم
        stars.forEach(star => star.classList.remove('active'));
        stars.forEach(star => {
            if (parseInt(star.getAttribute('data-rating')) <= 5) {
                star.classList.add('active');
            }
        });
        ratingInput.value = '5';

        showNotification('شكراً لك! تم إضافة تقييمك بنجاح 🎉', 'success');
    });
}

function updateTestimonialsStats() {
    const testimonials = JSON.parse(localStorage.getItem('ibrahim_testimonials')) || [];
    const approvedTestimonials = testimonials.filter(t => t.approved);
    
    // تحديث العدد الإجمالي
    const totalElement = document.getElementById('totalTestimonials');
    if (totalElement) {
        totalElement.textContent = approvedTestimonials.length;
        totalElement.setAttribute('data-count', approvedTestimonials.length);
    }

    // تحديث متوسط التقييم
    const averageElement = document.getElementById('averageRating');
    if (averageElement && approvedTestimonials.length > 0) {
        const average = (approvedTestimonials.reduce((sum, t) => sum + t.rating, 0) / approvedTestimonials.length).toFixed(1);
        averageElement.textContent = average;
    } else if (averageElement) {
        averageElement.textContent = '0';
    }

    // تحديث عدد العملاء الراضين
    const happyElement = document.getElementById('happyClients');
    if (happyElement) {
        const happyClients = approvedTestimonials.filter(t => t.rating >= 4).length;
        happyElement.textContent = happyClients;
        happyElement.setAttribute('data-count', happyClients);
    }

    // إعادة تشغيل العدادات
    initCounters();
}

// نظام الحجوزات
function initBookingSystem() {
    const bookingForm = document.getElementById('bookingForm');
    const timeSlots = document.querySelectorAll('.time-slot');
    
    if (!bookingForm) return;

    let selectedTime = null;

    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            selectedTime = this.textContent;
        });
    });

    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!selectedTime) {
            showNotification('يرجى اختيار وقت الحجز', 'error');
            return;
        }

        const consultationType = document.getElementById('consultationType').value;
        const duration = document.getElementById('duration').value;

        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحجز...';
        submitBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showNotification(`تم حجز موعدك بنجاح! ${consultationType} - ${duration} دقيقة - ${selectedTime}`, 'success');
            bookingForm.reset();
            timeSlots.forEach(s => s.classList.remove('active'));
            selectedTime = null;
            
        } catch (error) {
            showNotification('حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// نظام المتجر
function initStoreSystem() {
    const storeFilters = document.querySelectorAll('.store-filters .filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (!storeFilters.length) return;

    storeFilters.forEach(button => {
        button.addEventListener('click', function() {
            storeFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-category');
            
            productCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || category === filterValue;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, index * 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// نظام إدارة المحتوى المبسط
function initCMS() {
    window.saveToCMS = function(key, data) {
        try {
            localStorage.setItem(`cms_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to CMS:', error);
            return false;
        }
    };

    window.loadFromCMS = function(key) {
        try {
            const data = localStorage.getItem(`cms_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from CMS:', error);
            return null;
        }
    };

    window.deleteFromCMS = function(key) {
        try {
            localStorage.removeItem(`cms_${key}`);
            return true;
        } catch (error) {
            console.error('Error deleting from CMS:', error);
            return false;
        }
    };
}

// نظام التحليلات
function initAnalytics() {
    const trackEvent = (category, action, label) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        
        const analyticsData = loadFromCMS('analytics') || [];
        analyticsData.push({
            timestamp: new Date().toISOString(),
            category,
            action,
            label
        });
        
        saveToCMS('analytics', analyticsData);
    };

    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('click', function() {
            const text = this.textContent.trim() || this.getAttribute('aria-label') || 'Unknown';
            trackEvent('Click', 'Link Click', text);
        });
    });

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            trackEvent('Form', 'Form Submit', this.id || 'Unknown Form');
        });
    });

    let scrollTracked = false;
    window.addEventListener('scroll', function() {
        if (!scrollTracked && window.scrollY > window.innerHeight * 0.5) {
            trackEvent('Engagement', 'Scroll', '50% Page Height');
            scrollTracked = true;
        }
    });

    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('Engagement', 'Time Spent', `${timeSpent} seconds`);
    });
}

// نظام حالات الدراسة
function initCaseStudies() {
    const caseStudies = document.querySelectorAll('.case-study-card');
    
    caseStudies.forEach(study => {
        study.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
}

// Utility Functions
function smoothScrollTo(target, duration) {
    const targetPosition = target.offsetTop - 100;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }
    
    requestAnimationFrame(animation);
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.id;
    
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
        case 'clientName':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'الاسم يجب أن يكون至少 حرفين';
            }
            break;
        case 'email':
            if (!validateEmail(value)) {
                isValid = false;
                errorMessage = 'البريد الإلكتروني غير صحيح';
            }
            break;
        case 'subject':
        case 'clientPosition':
            if (value.length < 3) {
                isValid = false;
                errorMessage = 'هذا الحقل يجب أن يكون至少 3 أحرف';
            }
            break;
        case 'message':
        case 'clientTestimonial':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'هذا الحقل يجب أن يكون至少 10 أحرف';
            }
            break;
    }
    
    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.cssText = `
            color: #ff4757;
            font-size: 0.8rem;
            display: block;
            margin-top: 5px;
            text-align: right;
        `;
        field.parentNode.appendChild(errorElement);
    } else {
        field.classList.add('valid');
    }
    
    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 6 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${posX}%;
        top: ${posY}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icons[type] || icons.info}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-progress"></div>
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = getNotificationStyles();
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    const progressBar = notification.querySelector('.notification-progress');
    setTimeout(() => {
        progressBar.style.width = '0%';
    }, 100);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    notification.addEventListener('mouseenter', () => {
        clearTimeout(autoClose);
        progressBar.style.animationPlayState = 'paused';
    });
    
    notification.addEventListener('mouseleave', () => {
        progressBar.style.animationPlayState = 'running';
        setTimeout(() => {
            closeNotification(notification);
        }, 2000);
    });
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

function getNotificationStyles() {
    return `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--dark);
            color: white;
            padding: 0;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(150%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border: 1px solid rgba(108, 99, 255, 0.2);
            overflow: hidden;
            min-width: 300px;
            max-width: 400px;
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification.success {
            border-left: 4px solid #4CAF50;
        }
        .notification.error {
            border-left: 4px solid #F44336;
        }
        .notification.info {
            border-left: 4px solid #2196F3;
        }
        .notification.warning {
            border-left: 4px solid #FF9800;
        }
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            padding: 20px;
        }
        .notification-content i {
            font-size: 1.3rem;
            flex-shrink: 0;
        }
        .notification.success i { color: #4CAF50; }
        .notification.error i { color: #F44336; }
        .notification.info i { color: #2196F3; }
        .notification.warning i { color: #FF9800; }
        .notification-message {
            flex: 1;
            font-weight: 500;
        }
        .notification-close {
            background: none;
            border: none;
            color: rgba(255,255,255,0.7);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 5px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        .notification-close:hover {
            background: rgba(255,255,255,0.1);
            color: white;
        }
        .notification-progress {
            width: 100%;
            height: 3px;
            background: rgba(108, 99, 255, 0.3);
            animation: notificationProgress 5s linear forwards;
        }
        @keyframes notificationProgress {
            from { width: 100%; }
            to { width: 0%; }
        }
    `;
}

// Additional CSS animations
const additionalStyles = `
    .stars-rating {
        display: flex;
        gap: 5px;
        margin: 10px 0;
        direction: ltr;
        justify-content: flex-end;
    }
    
    .star {
        font-size: 24px;
        color: #ddd;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .star:hover,
    .star.active {
        color: #ffc107;
        transform: scale(1.1);
    }
    
    .testimonial-rating {
        color: #ffc107;
        font-size: 18px;
        margin-bottom: 10px;
        direction: ltr;
        text-align: right;
    }
    
    .rating-section {
        margin: 20px 0;
        text-align: right;
    }
    
    .rating-section label {
        display: block;
        margin-bottom: 10px;
        font-weight: 500;
        color: var(--text-color);
    }
    
    .testimonial-dots {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 30px;
        flex-wrap: wrap;
    }
    
    .testimonial-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--border-color);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }
    
    .testimonial-dot.active {
        background: var(--primary);
        transform: scale(1.2);
    }
`;

// Add additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// دوال المساعدة للإدارة
function showTestimonialsInConsole() {
    const testimonials = JSON.parse(localStorage.getItem('ibrahim_testimonials')) || [];
    console.log('📊 التقييمات الحالية:', testimonials);
    return testimonials;
}

function clearAllTestimonials() {
    if (confirm('هل تريد حذف جميع التقييمات؟')) {
        localStorage.removeItem('ibrahim_testimonials');
        initTestimonialsSystem();
        showNotification('تم حذف جميع التقييمات', 'info');
    }
}

// جعل الدوال متاحة globally
window.showTestimonialsInConsole = showTestimonialsInConsole;
window.clearAllTestimonials = clearAllTestimonials;
window.smoothScrollTo = smoothScrollTo;
window.showNotification = showNotification;

console.log('✅ تم تحميل جميع الأنظمة بنجاح');