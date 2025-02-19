// script.js
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    signupBtn.addEventListener('click', () => {
        signupModal.style.display = 'block';
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add login logic here
        console.log('Login submitted');
        loginModal.style.display = 'none';
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add signup logic here
        console.log('Signup submitted');
        signupModal.style.display = 'none';
    });

    // GSAP animation for the phone
    gsap.to('.phone', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });

    gsap.from('.hero-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.registerPlugin(ScrollTrigger);

gsap.from('.some-section', {
  opacity: 0,
  y: 50,
  duration: 1,
  scrollTrigger: {
    trigger: '.some-section',
    start: 'top 80%'
  }
});

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    gsap.from(modal.querySelector('.modal-content'), {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });
  }

  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    document.querySelector('.hero-section').style.backgroundPositionY = scrollPosition * 0.5 + 'px';
  });

  
  
      
});
