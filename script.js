document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. Theme Management (LocalStorage)
       ========================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Define available themes
    const themes = ['fresh-green', 'earthy', 'dark'];
    let currentThemeIndex = 0;

    // Load saved theme or default to 'fresh-green' (which is handled via no data attribute)
    const savedTheme = localStorage.getItem('avocado_theme');
    
    if (savedTheme) {
        if (savedTheme === 'fresh-green') {
            root.removeAttribute('data-theme');
            currentThemeIndex = 0;
        } else if (savedTheme === 'earthy') {
            root.setAttribute('data-theme', 'earthy');
            currentThemeIndex = 1;
        } else if (savedTheme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            currentThemeIndex = 2;
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const selectedTheme = themes[currentThemeIndex];

        if (selectedTheme === 'fresh-green') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', selectedTheme);
        }
        
        localStorage.setItem('avocado_theme', selectedTheme);
    });

    /* =========================================
       2. Mobile Navigation
       ========================================= */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* =========================================
       3. Product Filtering
       ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* =========================================
       4. Contact Form Handling
       ========================================= */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic Validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Create Submission Object
        const submission = {
            id: Date.now(),
            name: name,
            email: email,
            company: document.getElementById('company').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: message,
            date: new Date().toISOString()
        };

        // Save to LocalStorage
        saveToLocalStorage(submission);

        // Show Success UI
        formFeedback.textContent = 'Thank you! Your message has been sent successfully.';
        formFeedback.classList.add('success');
        
        // Reset Form
        contactForm.reset();

        // Remove success message after 5 seconds
        setTimeout(() => {
            formFeedback.classList.remove('success');
        }, 5000);
    });

    function saveToLocalStorage(data) {
        let submissions = [];
        const storedData = localStorage.getItem('avocado_contact_submissions');

        if (storedData) {
            try {
                submissions = JSON.parse(storedData);
            } catch (e) {
                console.error('Error parsing LocalStorage data', e);
                submissions = [];
            }
        }

        submissions.push(data);
        
        try {
            localStorage.setItem('avocado_contact_submissions', JSON.stringify(submissions));
            console.log('Data saved to LocalStorage:', data);
        } catch (e) {
            console.error('Error saving to LocalStorage (quota exceeded?)', e);
            alert('Message saved, but storage is full. Please clear old data.');
        }
    }

    /* =========================================
       5. Dynamic Footer Year
       ========================================= */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* =========================================
       6. Service Worker Registration (PWA)
       ========================================= */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});

// Global function for "Inquire" buttons to scroll to contact and pre-fill
function scrollToContact(productName) {
    const contactSection = document.getElementById('contact');
    const subjectInput = document.getElementById('subject');
    
    contactSection.scrollIntoView({ behavior: 'smooth' });
    
    // Small delay to allow scroll start before focusing (optional polish)
    setTimeout(() => {
        subjectInput.value = `Inquiry about ${productName}`;
        subjectInput.focus();
    }, 500);
}
