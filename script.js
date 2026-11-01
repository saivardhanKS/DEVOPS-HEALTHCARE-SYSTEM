/* ============================================
   MedCare Plus — Healthcare System Scripts
   ============================================ */

// ---- Navbar Scroll & Active Link ----
(function() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 140;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        });
    });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
            }
        });
        navLinks.forEach(link => link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }));
    }
})();

// ---- Smooth Scroll ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ---- Scroll Reveal Animation ----
(function() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-anim]').forEach((el, i) => {
        el.style.animationDelay = (el.style.animationDelay || (i * 0.06) + 's');
        observer.observe(el);
    });
})();

// ---- Set minimum date for appointment ----
(function() {
    const dateInput = document.getElementById('apptDate');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
})();

// ---- Appointment Form ----
(function() {
    const form = document.getElementById('appointmentForm');
    const modal = document.getElementById('successModal');
    const details = document.getElementById('modalDetails');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const name = document.getElementById('patientName').value;
            const email = document.getElementById('patientEmail').value;
            const phone = document.getElementById('patientPhone').value;
            const dept = document.getElementById('department').value;
            const doc = document.getElementById('doctor').value || 'Any Available Doctor';
            const date = document.getElementById('apptDate').value;
            const time = document.getElementById('apptTime').value;
            const type = document.querySelector('input[name="apptType"]:checked').value;

            // Format date
            const dateObj = new Date(date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            details.innerHTML = `
                <strong>Patient:</strong> ${name}<br>
                <strong>Email:</strong> ${email}<br>
                <strong>Phone:</strong> ${phone}<br>
                <strong>Department:</strong> ${dept}<br>
                <strong>Doctor:</strong> ${doc}<br>
                <strong>Date:</strong> ${formattedDate}<br>
                <strong>Time:</strong> ${time}<br>
                <strong>Type:</strong> ${type === 'in-person' ? '🏥 In-Person Visit' : '💻 Telemedicine'}<br>
                <strong>Ref ID:</strong> MC-${Date.now().toString(36).toUpperCase()}
            `;

            modal.classList.add('active');
            form.reset();
            // Reset date to today
            const today = new Date();
            document.getElementById('apptDate').value = today.toISOString().split('T')[0];
        });
    }
})();

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

// Close modal on overlay click
document.getElementById('successModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
});

// ---- Animated counters for hero stats ----
(function() {
    const highlights = document.querySelectorAll('.highlight-item strong');
    const targetMap = {
        '500+': 500,
        '120+': 120,
        '50K+': 50000,
        '4.9/5': 4.9
    };

    function animateCounter(el, target, suffix, duration = 2000) {
        const start = 0;
        const startTime = performance.now();
        const isFloat = target < 10;
        const isK = target >= 1000;

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            let value = start + (target - start) * eased;

            if (isK) {
                el.textContent = Math.floor(value / 1000) + 'K+';
            } else if (isFloat) {
                el.textContent = value.toFixed(1) + '/5';
            } else {
                el.textContent = Math.floor(value) + '+';
            }

            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent.trim();
                const target = targetMap[text];
                if (target) {
                    animateCounter(entry.target, target, '', 2200);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    highlights.forEach(el => observer.observe(el));
})();

console.log('🏥 MedCare Plus Healthcare System loaded successfully.');
