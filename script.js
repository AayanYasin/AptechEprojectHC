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
    }
};

// Add a product to the cart
function addToCart(productId, products) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1; // Increase quantity if item already exists
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new item to cart
    }
    renderCartItems(); // Re-render the cart
    openCartDrawer(); // Open the cart drawer
    saveCartToLocalStorage(); // Save cart to localStorage
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

    // ==================== Products Page Functionality ====================
    const productsGrid = document.getElementById('hussain-products-grid');
    if (productsGrid) {
        const products = [
          { id: 1, name: "Handmade Pottery", price: 45, image: "https://placehold.co/800x800" },
          { id: 2, name: "Wooden Sculpture", price: 120, image: "https://placehold.co/800x800" },
          { id: 3, name: "Handwoven Textile", price: 80, image: "https://placehold.co/800x800" },
          { id: 4, name: "Silver Necklace", price: 200, image: "https://placehold.co/800x800" },
          { id: 5, name: "Ceramic Vase", price: 30, image: "https://placehold.co/800x800" },
          { id: 6, name: "Leather Wallet", price: 60, image: "https://placehold.co/800x800" },
          { id: 7, name: "Wool Blanket", price: 150, image: "https://placehold.co/800x800" },
          { id: 8, name: "Gold Earrings", price: 250, image: "https://placehold.co/800x800" },
          { id: 9, name: "Handmade Journal", price: 35, image: "https://placehold.co/800x800" },
          { id: 10, name: "Glass Mosaic Art", price: 90, image: "https://placehold.co/800x800" },
          { id: 11, name: "Bamboo Basket", price: 40, image: "https://placehold.co/800x800" },
          { id: 12, name: "Clay Tea Set", price: 75, image: "https://placehold.co/800x800" },
          { id: 13, name: "Vintage Wooden Box", price: 110, image: "https://placehold.co/800x800" },
          { id: 14, name: "Marble Coasters", price: 25, image: "https://placehold.co/800x800" },
          { id: 15, name: "Hand-Carved Chess Set", price: 180, image: "https://placehold.co/800x800" },
          { id: 16, name: "Personalized Keychain", price: 20, image: "https://placehold.co/800x800" },
          { id: 17, name: "Artisan Soap Set", price: 50, image: "https://placehold.co/800x800" },
          { id: 18, name: "Resin Art Tray", price: 95, image: "https://placehold.co/800x800" },
          { id: 19, name: "Decorative Throw Pillow", price: 55, image: "https://placehold.co/800x800" },
          { id: 20, name: "Eco-Friendly Tote Bag", price: 30, image: "https://placehold.co/800x800" },
          { id: 21, name: "Embroidered Table Runner", price: 85, image: "https://placehold.co/800x800" },
          { id: 22, name: "Hand-Painted Wall Art", price: 140, image: "https://placehold.co/800x800" },
          { id: 23, name: "Customized Leather Belt", price: 70, image: "https://placehold.co/800x800" },
          { id: 24, name: "Luxury Silk Scarf", price: 160, image: "https://placehold.co/800x800" },
          { id: 25, name: "Carved Wooden Spoon Set", price: 45, image: "https://placehold.co/800x800" },
        ];

        // Render products on page load
        function renderProducts(priceRange = 'all') {
            productsGrid.innerHTML = '';
            const filteredProducts = products.filter(product => {
                if (priceRange === 'all') return true;
                const [min, max] = priceRange.split('-').map(Number);
                if (priceRange.endsWith('+')) {
                    return product.price >= min;
                } else {
                    return product.price >= min && product.price <= max;
                }
            });

            filteredProducts.forEach(product => {
                const productCard = `
                    <div class="col-md-3 hussain-product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="hussain-card-body">
                            <h5 class="hussain-card-title">${product.name}</h5>
                            <p class="hussain-card-price">Rs.${product.price}</p>
                            <button class="hussain-add-to-cart" data-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                `;
                productsGrid.insertAdjacentHTML('beforeend', productCard);
            });
        }

        // Handle price filter change
        const priceFilter = document.getElementById('hussain-price-filter');
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                renderProducts(e.target.value);
            });
        }

        // Add to cart functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('hussain-add-to-cart')) {
                const productId = +e.target.getAttribute('data-id');
                addToCart(productId, products); // Add product to cart
            }
        });

        renderProducts(); // Render products on page load
    }

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