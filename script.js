// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
  
  // Counter animation
  const counters = document.querySelectorAll('.counter');
  const counterSection = document.querySelector('.icons-section');
  
  const startCounter = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let increment = target / (target === 20000 ? 300 : 500);
      let delay = target === 20000 ? 20 : 10;
      let count = 0;
  
      const updateCounter = () => {
        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count).toLocaleString();
          setTimeout(updateCounter, delay);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };
  
      updateCounter();
    });
  };
  
  // Trigger counter when section is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(counterSection);
  
  // Dropdown hover effect
  document.addEventListener('DOMContentLoaded', () => {
    const dropdownToggle = document.querySelector('.nav-item.dropdown .dropdown-toggle');
    const dropdownMenu = document.querySelector('.nav-item.dropdown .dropdown-menu');
  
    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener('mouseenter', () => dropdownMenu.classList.add('show'));
      dropdownMenu.addEventListener('mouseenter', () => dropdownMenu.classList.add('show'));
  
      const closeDropdown = () => {
        setTimeout(() => {
          if (!dropdownMenu.matches(':hover') && !dropdownToggle.matches(':hover')) {
            dropdownMenu.classList.remove('show');
          }
        }, 200);
      };
  
      dropdownToggle.addEventListener('mouseleave', closeDropdown);
      dropdownMenu.addEventListener('mouseleave', closeDropdown);
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const iconContainers = document.querySelectorAll(".icon-container")
  
    iconContainers.forEach((container) => {
      container.addEventListener("mouseenter", () => {
        container.style.backgroundColor = "#e9ecef"
      })
  
      container.addEventListener("mouseleave", () => {
        container.style.backgroundColor = "#f8f9fa"
      })
    })
  })