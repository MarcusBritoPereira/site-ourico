document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Active Link Highlighting based on URL
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && linkPath === 'index.html') {
            link.classList.add('active'); // Home is active by default on root
        } else {
            link.classList.remove('active');
        }
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // Contact Form WhatsApp Integration
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const responsavel = document.getElementById('responsavel').value;
            const aluno = document.getElementById('aluno').value;
            const telefone = document.getElementById('telefone').value;
            const mensagem = document.getElementById('mensagem').value;

            const text = `*Novo Contato via Site*%0A%0A*Responsável:* ${responsavel}%0A*Aluno(a):* ${aluno}%0A*Telefone:* ${telefone}%0A*Mensagem:* ${mensagem || 'Sem mensagem adicional'}`;

            const whatsappUrl = `https://wa.me/5593991907710?text=${text}`;

            window.open(whatsappUrl, '_blank');

            // Redirect to Thank You page
            setTimeout(() => {
                window.location.href = 'obrigado.html';
            }, 1000);
        });
    }

    // Sticky Header
    const header = document.querySelector('.site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
    // WhatsApp Balloon Animation
    setTimeout(() => {
        const balloon = document.querySelector('.whatsapp-balloon');
        if (balloon) {
            balloon.classList.add('visible');

            // Hide balloon after 10 seconds
            setTimeout(() => {
                balloon.classList.remove('visible');
            }, 10000);
        }
    }, 5000);
});
