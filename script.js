// ==================== Global Variables ====================
let cart = []; // Global cart array
let cartItemsContainer; // Container for cart items

// ==================== Cart Functions ====================

// Save cart to localStorage
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    renderCartItems(); // Render cart items after loading
    updateCartBadge(); // Update cart badge after loading
  }
}

// Clear cart from localStorage
function clearCartFromLocalStorage() {
  localStorage.removeItem('cart');
}

// Render cart items in the cart drawer
function renderCartItems() {
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = ''; // Clear the container
    let total = 0; // Initialize total price

    // Loop through cart items and render them
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity; // Calculate item total
      total += itemTotal; // Add to overall total

      const cartItem = `
        <div class="hussain-cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h5>${item.name}</h5>
            <p>Rs.${itemTotal.toFixed(2)}</p>
          </div>
          <div class="hussain-quantity-selector">
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
      `;
      cartItemsContainer.insertAdjacentHTML('beforeend', cartItem);
    });

    // Add total section and actions
    const totalSection = `
      <div class="hussain-cart-total">
        <h5>Total: Rs.${total.toFixed(2)}</h5>
      </div>
      <div class="hussain-cart-actions">
        <button class="hussain-checkout-btn">Checkout</button>
        <button class="hussain-empty-cart-btn">Empty Cart</button>
      </div>
    `;
    cartItemsContainer.insertAdjacentHTML('beforeend', totalSection);

    // Add event listeners for buttons
    const checkoutButton = document.querySelector('.hussain-checkout-btn');
    const emptyCartButton = document.querySelector('.hussain-empty-cart-btn');

    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        alert('Proceeding to checkout...'); // Replace with actual checkout logic
      });
    }

    if (emptyCartButton) {
      emptyCartButton.addEventListener('click', () => {
        cart.length = 0; // Clear the cart
        renderCartItems(); // Re-render the cart
        clearCartFromLocalStorage(); // Clear cart from localStorage
        updateCartBadge(); // Update cart badge after emptying cart
      });
    }
  }
}

// Open the cart drawer
function openCartDrawer() {
  const cartDrawer = document.querySelector('.hussain-cart-drawer');
  if (cartDrawer) {
    cartDrawer.classList.add('open');
  }
}

// Close the cart drawer
function closeCartDrawer() {
  const cartDrawer = document.querySelector('.hussain-cart-drawer');
  if (cartDrawer) {
    cartDrawer.classList.remove('open');
  }
}

// Update item quantity in the cart
window.updateQuantity = function (productId, change) {
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += change;
    if (cartItem.quantity <= 0) {
      cart.splice(cart.indexOf(cartItem), 1); // Remove item if quantity is 0
    }
    renderCartItems(); // Re-render the cart
    saveCartToLocalStorage(); // Save cart to localStorage
    updateCartBadge(); // Update cart badge after changing quantity
  }
};

// Add a product to the cart
function addToCart(productId) {
  // Find the product card using the productId
  const productCard = document.querySelector(`.hussain-product-card button[data-id="${productId}"]`)?.closest('.hussain-product-card');
  if (!productCard) {
    console.error(`Product card with ID ${productId} not found.`);
    return;
  }

  // Extract product details from the static HTML
  const product = {
    id: productId,
    name: productCard.querySelector('.hussain-card-title').textContent,
    price: parseFloat(productCard.querySelector('.hussain-card-price').textContent.replace('Rs.', '')),
    image: productCard.querySelector('img').src,
    quantity: 1, // Default quantity
  };

  // Check if the product already exists in the cart
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1; // Increase quantity if item already exists
  } else {
    cart.push(product); // Add new item to cart
  }

  renderCartItems(); // Re-render the cart
  openCartDrawer(); // Open the cart drawer
  saveCartToLocalStorage(); // Save cart to localStorage
  updateCartBadge(); // Update cart badge after adding to cart
}

// Function to update the cart badge count
function updateCartBadge() {
  const cartBadge = document.querySelector('.cart .badge');
  if (cartBadge) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItems;
  }
}

// ==================== Event Listeners ====================

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart items container
  cartItemsContainer = document.querySelector('.hussain-cart-items');

  // Load cart from localStorage
  loadCartFromLocalStorage();

  // ==================== Navbar Scroll Effect ====================
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ==================== Counter Animation ====================
  const counters = document.querySelectorAll('.counter');
  const counterSection = document.querySelector('.icons-section');

  if (counterSection && counters.length > 0) {
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startCounter();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(counterSection);
  }

  // ==================== Dropdown Hover Effect ====================
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

  // ==================== Icon Container Hover Effect ====================
  const iconContainers = document.querySelectorAll('.icon-container');
  if (iconContainers.length > 0) {
    iconContainers.forEach((container) => {
      container.addEventListener('mouseenter', () => {
        container.style.backgroundColor = '#e9ecef';
      });

      container.addEventListener('mouseleave', () => {
        container.style.backgroundColor = '#f8f9fa';
      });
    });
  }

  // ==================== Add to Cart Functionality ====================
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('hussain-add-to-cart')) {
      const productId = +e.target.getAttribute('data-id');
      addToCart(productId); // Add product to cart
    }
  });

  // ==================== Cart Icon Functionality ====================
  const cartIcon = document.querySelector('.navbar .cart');
  if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default link behavior
      openCartDrawer(); // Open the cart drawer
    });
  }

  // Close cart drawer when close button is clicked
  const closeDrawerButton = document.querySelector('.hussain-close-drawer');
  if (closeDrawerButton) {
    closeDrawerButton.addEventListener('click', closeCartDrawer);
  }
});