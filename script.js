// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (!menuToggle || !navLinks) return; // safety

  // Ensure the button is above the menu so clicks don't hit a big invisible area
  menuToggle.style.zIndex = 1002;
  navLinks.style.zIndex = 1001;

  // Toggle menu only when the hamburger button is clicked
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent this click from bubbling to document
    const opened = navLinks.classList.toggle("show");
    menuToggle.textContent = opened ? "✖" : "☰";
    // accessibility hint
    menuToggle.setAttribute("aria-expanded", opened ? "true" : "false");
  });

  // Prevent clicks inside the nav box from bubbling up and triggering document click handlers
  navLinks.addEventListener("click", (e) => {
    // If a link was clicked, close the menu (so it doesn't remain open on mobile)
    if (e.target && e.target.tagName === "A") {
      navLinks.classList.remove("show");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
      // allow normal link behavior (smooth scroll etc.)
      return;
    }
    e.stopPropagation(); // otherwise just stop propagation
  });

  // Close the menu if user clicks anywhere outside the menu or button
  document.addEventListener("click", (e) => {
    if (!navLinks.classList.contains("show")) return;
    // if click is outside navLinks AND outside the toggle button, close it
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove("show");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Close menu on Escape key (nice-to-have)
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("show")) {
      navLinks.classList.remove("show");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});


// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});


// Active Navigation Link Highlighting
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80; // adjust for fixed header
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});


// Fade-in Animation on Scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  section.classList.add('fade-in-section'); // add initial class
  observer.observe(section);
});


// Header Background Change on Scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


// Contact Form (Formspree) Handling
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const action = contactForm.getAttribute("action");

    fetch(action, {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          formMessage.style.display = "block";
          contactForm.reset();
        } else {
          response.json().then(data => {
            alert("Oops! There was a problem: " + (data.error || "Please try again."));
          });
        }
      })
      .catch(error => {
        alert("Oops! There was a problem: " + error);
      });
  });
}