document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // Show modals
  loginBtn.addEventListener("click", () => {
    loginModal.style.display = "block";
  });

  signupBtn.addEventListener("click", () => {
    signupModal.style.display = "block";
  });

  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
    if (event.target === signupModal) {
      signupModal.style.display = "none";
    }
  });

  // Signup logic
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const full_name = signupForm.elements[0].value;
    const email = signupForm.elements[1].value;
    const password = signupForm.elements[2].value;
    const confirmPassword = signupForm.elements[3].value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, password }),
      });

      const data = await res.json();
      alert(data.message || "Signup successful!");
      signupModal.style.display = "none";
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error signing up. Please try again.");
    }
  });

  // Login logic
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.elements[0].value;
    const password = loginForm.elements[1].value;

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        loginModal.style.display = "none";
        window.location.href = "app.html"; // Redirect to the main app
      } else {
        alert(data.error || "Invalid login credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error logging in. Please try again.");
    }
  });

  // GSAP animation
  gsap.to(".phone", {
    y: -20,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });

  gsap.from(".hero-content", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
  });

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".some-section", {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: ".some-section",
      start: "top 80%",
    },
  });

  // Enhanced GSAP animations
  gsap.from(".hero-content h1", {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power3.out",
    delay: 0.2,
  });

  gsap.from(".hero-content p", {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: "power3.out",
    delay: 0.4,
  });

  gsap.from(".cta-button", {
    duration: 1,
    y: 20,
    opacity: 0,
    ease: "power3.out",
    delay: 0.6,
  });

  // Smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Enhanced modal animations
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
    gsap.from(modal.querySelector(".modal-content"), {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
      backdropFilter: "blur(10px)",
    });
  }

  window.addEventListener("scroll", () => {
    const scrollPosition = window.pageYOffset;
    document.querySelector(".hero-section").style.backgroundPositionY =
      scrollPosition * 0.5 + "px";
  });

  gsap.to(".map-background", {
    duration: 20,
    scale: 1.1,
    repeat: -1,
    yoyo: true,
    ease: "none",
  });

  // Add parallax effect to background
  window.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    document.querySelector(".map-background").style.transform = `translate(${
      x * 10
    }px, ${y * 10}px)`;
  });

  // Enhanced animations
  gsap.from(".hero-content", {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: "power4.out",
    stagger: 0.2,
  });

  gsap.from(".phone-animation", {
    duration: 1.5,
    x: 100,
    opacity: 0,
    ease: "power4.out",
    delay: 0.5,
  });

  // Parallax effect
  document.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.005;

    gsap.to(".hero-content", {
      duration: 1,
      x: moveX,
      y: moveY,
      ease: "power1.out",
    });

    gsap.to(".phone-animation", {
      duration: 1,
      x: -moveX,
      y: -moveY,
      ease: "power1.out",
    });
  });
});