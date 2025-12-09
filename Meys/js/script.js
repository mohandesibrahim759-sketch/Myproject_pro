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
    initTestimonials(); // نظام التقييمات الموحد
    
    console.log('✅ تم تحميل جميع الأنظمة بنجاح');
});

// Enhanced Loader with Progress
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    
    const loaderContent = document.querySelector('.loader-content');
    if (!loaderContent) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'loader-progress';
    progressBar.innerHTML = '<div class="loader-progress-bar"></div>';
    loaderContent.appendChild(progressBar);
    
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
            if (targetId && targetId.startsWith('#')) {
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
    if (!themeIcon) return;
    
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
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            if (scrollY > 500) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
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

// نظام الاتصال المحسن والمصحح
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        console.log('📧 تحميل نموذج الاتصال...');
        
        // إضافة التحقق من الحقول في الوقت الفعلي
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                this.classList.remove('error');
                const errorElement = this.parentNode.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                }
            });
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من جميع الحقول
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
                return;
            }

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // إرسال الإيميل مباشرة
            sendDirectEmail(name, email, subject, message);
        });
    }
}

// إرسال الإيميل مباشرة - مصحح
function sendDirectEmail(name, email, subject, message) {
    const emailBody = `
اسم المرسل: ${sanitizeInput(name)}
البريد الإلكتروني: ${sanitizeInput(email)}

الرسالة:
${sanitizeInput(message)}

---
تم الإرسال من موقع ابراهيم المخلافي
    `.trim();

    const mailtoLink = `mailto:mohandesibrahim795@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // فتح بريد المستخدم الإلكتروني
    window.open(mailtoLink, '_blank');
    
    showNotification('يتم فتح بريدك الإلكتروني... يرجى إرسال الرسالة', 'info');
    
    // إعادة تعيين النموذج بعد تأكيد
    setTimeout(() => {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.reset();
            showNotification('شكراً لتواصلك! سأرد عليك قريباً 📧', 'success');
        }
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
                const target = parseInt(counter.getAttribute('data-count') || 0);
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

// نظام التقييمات المحسن والمضمون والمصحح
function initTestimonials() {
    console.log('🌟 بدء تحميل نظام التقييمات...');
    
    // تحميل التقييمات من localStorage
    let testimonials = JSON.parse(localStorage.getItem('ibrahim_testimonials'));
    
    if (!testimonials || !Array.isArray(testimonials)) {
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
    initTestimonialSlider();
    
    console.log('✅ نظام التقييمات جاهز');
}

function renderTestimonials(testimonials) {
    const container = document.getElementById('testimonialsContainer');
    if (!container) {
        console.error('❌ لم يتم العثور على حاوية التقييمات');
        return;
    }

    const approvedTestimonials = testimonials.filter(t => t.approved);
    
    if (approvedTestimonials.length === 0) {
        container.innerHTML = `
            <div class="testimonial-slide">
                <div class="testimonial-card">
                    <div class="testimonial-content">
                        <p>لا توجد تقييمات حتى الآن. كن أول من يشارك تجربته!</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = approvedTestimonials.map(testimonial => `
        <div class="testimonial-slide">
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <div class="testimonial-rating">
                        ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                    </div>
                    <p class="testimonial-text">"${sanitizeInput(testimonial.content)}"</p>
                </div>
                <div class="testimonial-author">
                    <div class="author-info">
                        <h4>${sanitizeInput(testimonial.name)}</h4>
                        <span class="author-position">${sanitizeInput(testimonial.position)}</span>
                        <span class="testimonial-date">${new Date(testimonial.date).toLocaleDateString('ar-EG')}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    console.log(`✅ تم عرض ${approvedTestimonials.length} تقييم`);
}

function initTestimonialForm() {
    const form = document.getElementById('addTestimonialForm');
    if (!form) {
        console.error('❌ لم يتم العثور على نموذج التقييم');
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
        
        // إضافة تأثير عند التمرير
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                if (sRating <= rating) {
                    s.classList.add('hover');
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });

    // تعيين 5 نجوم افتراضياً
    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-rating')) <= 5) {
            star.classList.add('active');
        }
    });

    // إضافة التحقق من الحقول في الوقت الفعلي
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorElement = this.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        });
    });

    // إرسال النموذج
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('clientName').value.trim();
        const position = document.getElementById('clientPosition').value.trim();
        const content = document.getElementById('clientTestimonial').value.trim();
        const rating = parseInt(document.getElementById('clientRating').value) || 5;

        // التحقق من الحقول
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
            return;
        }

        if (content.length < 10) {
            showNotification('الرأي يجب أن يكون على الأقل 10 أحرف', 'error');
            return;
        }

        // إنشاء التقييم الجديد
        const newTestimonial = {
            id: Date.now(),
            name: sanitizeInput(name),
            position: sanitizeInput(position),
            content: sanitizeInput(content),
            rating: rating,
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
        
        // إعادة تهيئة السلايدر
        setTimeout(() => {
            initTestimonialSlider();
        }, 100);
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
        const totalRating = approvedTestimonials.reduce((sum, t) => sum + (t.rating || 0), 0);
        const average = (totalRating / approvedTestimonials.length).toFixed(1);
        averageElement.textContent = average;
        averageElement.setAttribute('data-count', average);
    } else if (averageElement) {
        averageElement.textContent = '0';
        averageElement.setAttribute('data-count', '0');
    }

    // تحديث عدد العملاء الراضين
    const happyElement = document.getElementById('happyClients');
    if (happyElement) {
        const happyClients = approvedTestimonials.filter(t => (t.rating || 0) >= 4).length;
        happyElement.textContent = happyClients;
        happyElement.setAttribute('data-count', happyClients);
    }

    // تحديث نسبة العملاء العائدين (محسوبة من إجمالي التقييمات)
    const returningElement = document.getElementById('returningClients');
    if (returningElement) {
        const totalClients = new Set(approvedTestimonials.map(t => t.name)).size;
        const totalTestimonials = approvedTestimonials.length;
        const returnRate = totalClients > 0 ? Math.round((totalTestimonials / totalClients) * 100) : 0;
        returningElement.textContent = returnRate;
        returningElement.setAttribute('data-count', returnRate);
    }

    // إعادة تشغيل العدادات
    setTimeout(() => {
        initCounters();
    }, 500);
}

function initTestimonialSlider() {
    const container = document.querySelector('.testimonials-container');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (!container || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // إنشاء نقاط التنقل
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.setAttribute('data-slide', i);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function goToSlide(n) {
        currentSlide = (n + totalSlides) % totalSlides;
        updateSlider();
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    function updateSlider() {
        // تحديث موضع السلايدر
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // تحديث النقاط النشطة
        document.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // أحداث الأزرار
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // التمرير التلقائي
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    // إيقاف التمرير التلقائي عند التمرير فوق السلايدر
    container.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    container.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
    
    // دعم السحب على الأجهزة اللوحية
    let touchStartX = 0;
    let touchEndX = 0;
    
    container.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    });
    
    container.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // سحب لليسار
            } else {
                prevSlide(); // سحب لليمين
            }
        }
    }
    
    // التهيئة الأولية
    updateSlider();
    
    // جعل الدوال متاحة globally للتحكم
    window.nextTestimonialSlide = nextSlide;
    window.prevTestimonialSlide = prevSlide;
    window.goToTestimonialSlide = goToSlide;
}

// Enhanced Blog
function initBlog() {
    // Lazy load images
    const blogImages = document.querySelectorAll('.blog-image img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const dataSrc = img.getAttribute('data-src');
                if (dataSrc) {
                    img.src = dataSrc;
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    blogImages.forEach(img => {
        if (img.hasAttribute('data-src')) {
            imageObserver.observe(img);
        }
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

// بيانات المشاريع المحسنة
function initProjectsData() {
    const projects = [
        {
            id: 1,
            title: "موقع تجارة إلكترونية",
            description: "موقع متكامل للتجارة الإلكترونية مع نظام دفع آمن وإدارة للمخزون.",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
            category: "web",
            tags: ["HTML", "CSS", "JavaScript", "React"],
            liveUrl: "#",
            demoUrl: "#",
            githubUrl: "https://github.com/ibrahimmkh"
        },
        {
            id: 2,
            title: "تطبيق إدارة المهام",
            description: "تطبيق ويب متكامل لإدارة المهام اليومية مع ميزات متقدمة.",
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w-800&auto=format&fit=crop",
            category: "web",
            tags: ["React", "Node.js", "MongoDB"],
            liveUrl: "#",
            demoUrl: "#",
            githubUrl: "https://github.com/ibrahimmkh"
        },
        {
            id: 3,
            title: "تصميم واجهة تطبيق جوال",
            description: "تصميم حديث وبديع لواجهة تطبيق جوال لخدمة التوصيل.",
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop",
            category: "design",
            tags: ["Figma", "UI/UX", "Adobe XD"],
            liveUrl: "#",
            demoUrl: "#",
            githubUrl: "https://github.com/ibrahimmkh"
        },
        {
            id: 4,
            title: "تطبيق الياقة البدنية",
            description: "تطبيق جوال متكامل لمتابعة التمارين الرياضية واللياقة البدنية.",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop",
            category: "mobile",
            tags: ["React Native", "Firebase", "API"],
            liveUrl: "#",
            demoUrl: "#",
            githubUrl: "https://github.com/ibrahimmkh"
        },
        {
            id: 5,
            title: "منصة تعليمية",
            description: "منصة متكاملة للتعلم الإلكتروني مع نظام إدارة المحتوى.",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop",
            category: "web",
            tags: ["Vue.js", "Laravel", "MySQL"],
            liveUrl: "#",
            demoUrl: "#",
            githubUrl: "https://github.com/ibrahimmkh"
        },
        {
            id: 6,
            title: "تطبيق إدارة المخزون",
            description: "تطبيق متكامل لإدارة المخزون والمبيعات للشركات الصغيرة.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
            category: "mobile",
            tags: ["Flutter", "SQLite", "REST API"],
            liveUrl: "#",
            demoUrl: "#",
            githubUrl: "https://github.com/ibrahimmkh"
        }
    ];

    renderProjects(projects);
}

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
                        <a href="${project.liveUrl}" class="project-link" title="عرض المشروع" target="_blank" onclick="return handleProjectLink(event, '${project.githubUrl}')">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                        <a href="${project.demoUrl}" class="project-link" title="عرض التفاصيل" target="_blank" onclick="return handleProjectLink(event, '${project.githubUrl}')">
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

// معالج روابط المشاريع
function handleProjectLink(event, githubUrl) {
    event.preventDefault();
    event.stopPropagation();
    
    // إذا كان الرابط #، افتح GitHub
    if (event.currentTarget.getAttribute('href') === '#') {
        window.open(githubUrl || 'https://github.com/ibrahimmkh', '_blank');
        return false;
    }
    return true;
}

// بيانات المدونة المحسنة
function initBlogData() {
    const blogPosts = [
        {
            id: 1,
            title: "أفضل ممارسات تطوير الويب في 2024",
            excerpt: "تعرف على أحدث التقنيات والممارسات في مجال تطوير الويب لهذا العام.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
            date: "2024-01-15",
            category: "تطوير الويب",
            readTime: "5 دقائق",
            url: "#"
        },
        {
            id: 2,
            title: "كيفية تحسين أداء مواقع الويب",
            excerpt: "نصائح وتقنيات عملية لتحسين سرعة وأداء مواقع الويب.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
            date: "2024-01-10",
            category: "أداء الموقع",
            readTime: "4 دقائق",
            url: "#"
        },
        {
            id: 3,
            title: "مقدمة إلى React.js للمبتدئين",
            excerpt: "دليل شامل للبدء مع مكتبة React.js وتطوير تطبيقات ويب تفاعلية.",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
            date: "2024-01-05",
            category: "أطر العمل",
            readTime: "7 دقائق",
            url: "#"
        },
        {
            id: 4,
            title: "أهمية تجربة المستخدم في التصميم",
            excerpt: "لماذا تعتبر تجربة المستخدم العنصر الأهم في نجاح أي منتج رقمي.",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
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

// نظام الحجوزات الأساسي
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
            updateBookingSummary();
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
            
            // حفظ الحجز في localStorage
            const booking = {
                type: consultationType,
                duration: duration,
                time: selectedTime,
                date: new Date().toISOString(),
                status: 'confirmed'
            };
            
            const bookings = JSON.parse(localStorage.getItem('ibrahim_bookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('ibrahim_bookings', JSON.stringify(bookings));
            
            showNotification(`تم حجز موعدك بنجاح! ${consultationType} - ${duration} دقيقة - ${selectedTime}`, 'success');
            bookingForm.reset();
            timeSlots.forEach(s => s.classList.remove('active'));
            selectedTime = null;
            updateBookingSummary();
            
        } catch (error) {
            console.error('Booking error:', error);
            showNotification('حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// نظام المتجر الأساسي
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

// نظام التحليلات الأساسي
function initAnalytics() {
    const trackEvent = (category, action, label) => {
        // تخزين محلي
        const analyticsData = loadFromCMS('analytics') || [];
        analyticsData.push({
            timestamp: new Date().toISOString(),
            category,
            action,
            label,
            page: window.location.pathname,
            userAgent: navigator.userAgent
        });
        
        // الاحتفاظ بأخر 1000 حدث فقط
        if (analyticsData.length > 1000) {
            analyticsData.splice(0, analyticsData.length - 1000);
        }
        
        saveToCMS('analytics', analyticsData);
    };

    // تتبع النقرات
    document.addEventListener('click', function(e) {
        const target = e.target;
        const button = target.closest('button');
        const link = target.closest('a');
        
        if (button) {
            trackEvent('Click', 'Button Click', button.textContent.trim() || 'Unknown Button');
        } else if (link) {
            trackEvent('Click', 'Link Click', link.textContent.trim() || link.getAttribute('href') || 'Unknown Link');
        }
    });

    // تتبع إرسال النماذج
    document.addEventListener('submit', function(e) {
        const form = e.target;
        trackEvent('Form', 'Form Submit', form.id || 'Unknown Form');
    });

    // تتبع التمرير
    let scrollTracked = false;
    window.addEventListener('scroll', function() {
        if (!scrollTracked && window.scrollY > window.innerHeight * 0.5) {
            trackEvent('Engagement', 'Scroll', '50% Page Height');
            scrollTracked = true;
        }
        
        if (window.scrollY > window.innerHeight * 0.9) {
            trackEvent('Engagement', 'Scroll', '90% Page Height');
        }
    });

    // تتبع الوقت
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('Engagement', 'Time Spent', `${timeSpent} seconds`);
    });

    // تتبع الصفحة الأولى
    trackEvent('Page', 'View', window.location.pathname);
}

// نظام حالات الدراسة
function initCaseStudies() {
    const caseStudies = document.querySelectorAll('.case-study-card');
    
    caseStudies.forEach(study => {
        const expandBtn = study.querySelector('.case-study-toggle');
        if (expandBtn) {
            expandBtn.addEventListener('click', function() {
                study.classList.toggle('expanded');
                this.textContent = study.classList.contains('expanded') ? 'تصغير التفاصيل' : 'عرض التفاصيل';
            });
        }
    });
}

// تحديث ملخص الحجز
function updateBookingSummary() {
    const consultationType = document.getElementById('consultationType')?.value;
    const duration = document.getElementById('duration')?.value;
    const selectedSlot = document.querySelector('.time-slot.active')?.textContent;
    
    if (consultationType && duration && selectedSlot) {
        const summary = `
            <h4>ملخص الحجز</h4>
            <p><strong>نوع الاستشارة:</strong> ${consultationType}</p>
            <p><strong>المدة:</strong> ${duration} دقيقة</p>
            <p><strong>الوقت:</strong> ${selectedSlot}</p>
            <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-EG')}</p>
        `;
        
        const summaryElement = document.getElementById('bookingSummary');
        if (summaryElement) {
            summaryElement.innerHTML = summary;
            summaryElement.style.display = 'block';
        }
    }
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
                errorMessage = 'الاسم يجب أن يكون على الأقل حرفين';
            } else if (value.length > 50) {
                isValid = false;
                errorMessage = 'الاسم لا يجب أن يتجاوز 50 حرفاً';
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
                errorMessage = 'هذا الحقل يجب أن يكون على الأقل 3 أحرف';
            }
            break;
        case 'message':
        case 'clientTestimonial':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'هذا الحقل يجب أن يكون على الأقل 10 أحرف';
            } else if (value.length > 1000) {
                isValid = false;
                errorMessage = 'هذا الحقل لا يجب أن يتجاوز 1000 حرف';
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
            <span class="notification-message">${sanitizeInput(message)}</span>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-progress"></div>
    `;
    
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

// Sanitize input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// دوال المساعدة للإدارة
function showTestimonialsInConsole() {
    const testimonials = JSON.parse(localStorage.getItem('ibrahim_testimonials')) || [];
    console.log('📊 التقييمات الحالية:', testimonials);
    console.log(`عدد التقييمات: ${testimonials.length}`);
    console.log(`عدد التقييمات المعتمدة: ${testimonials.filter(t => t.approved).length}`);
    
    // تصدير كـ JSON
    const json = JSON.stringify(testimonials, null, 2);
    console.log('📥 JSON للتصدير:', json);
    
    return testimonials;
}

function exportTestimonials() {
    const testimonials = JSON.parse(localStorage.getItem('ibrahim_testimonials')) || [];
    const dataStr = JSON.stringify(testimonials, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `testimonials-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('تم تصدير التقييمات بنجاح', 'success');
}

function importTestimonials(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data)) {
                localStorage.setItem('ibrahim_testimonials', JSON.stringify(data));
                initTestimonials();
                showNotification('تم استيراد التقييمات بنجاح', 'success');
            } else {
                showNotification('الملف غير صالح', 'error');
            }
        } catch (error) {
            showNotification('خطأ في قراءة الملف', 'error');
        }
    };
    reader.readAsText(file);
}

function clearAllTestimonials() {
    if (confirm('هل تريد حذف جميع التقييمات؟')) {
        localStorage.removeItem('ibrahim_testimonials');
        initTestimonials();
        showNotification('تم حذف جميع التقييمات', 'info');
    }
}

function backupAllData() {
    const data = {
        testimonials: JSON.parse(localStorage.getItem('ibrahim_testimonials') || '[]'),
        bookings: JSON.parse(localStorage.getItem('ibrahim_bookings') || '[]'),
        analytics: JSON.parse(localStorage.getItem('cms_analytics') || '[]'),
        backupDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('تم إنشاء نسخة احتياطية', 'success');
}

// جعل الدوال متاحة globally
window.showTestimonialsInConsole = showTestimonialsInConsole;
window.clearAllTestimonials = clearAllTestimonials;
window.smoothScrollTo = smoothScrollTo;
window.showNotification = showNotification;
window.exportTestimonials = exportTestimonials;
window.backupAllData = backupAllData;

console.log('✅ تم تحميل جميع الأنظمة بنجاح');