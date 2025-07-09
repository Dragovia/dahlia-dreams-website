// Product data for 10 dahlia flowers
const dahliaProducts = [
    {
        id: 1,
        name: "Cafe au Lait",
        description: "A stunning dinner plate dahlia with creamy, blush-pink petals that fade to a soft coffee color. Perfect for elegant arrangements and wedding bouquets.",
        price: "$12.99",
        inStock: true,
        image: "🌺"
    },
    {
        id: 2,
        name: "Bishop of Llandaff",
        description: "A classic red dahlia with dark foliage and vibrant scarlet flowers. This variety is known for its long blooming season and disease resistance.",
        price: "$9.99",
        inStock: true,
        image: "🌹"
    },
    {
        id: 3,
        name: "Thomas Edison",
        description: "A magnificent purple dahlia with large, fully double flowers. The deep purple blooms are perfect for adding drama to any garden or arrangement.",
        price: "$14.99",
        inStock: false,
        image: "💜"
    },
    {
        id: 4,
        name: "Arabian Night",
        description: "A dark red dahlia with velvety petals that appear almost black in certain lighting. This variety is highly sought after for its unique coloration.",
        price: "$16.99",
        inStock: true,
        image: "🖤"
    },
    {
        id: 5,
        name: "Pompon",
        description: "Small, perfectly round dahlia flowers in bright pink. These compact blooms are ideal for borders and container gardens.",
        price: "$8.99",
        inStock: true,
        image: "🌸"
    },
    {
        id: 6,
        name: "Karma Choc",
        description: "A beautiful dark red dahlia with chocolate undertones. The flowers have a velvety texture and are perfect for cutting gardens.",
        price: "$13.99",
        inStock: true,
        image: "🍫"
    },
    {
        id: 7,
        name: "White Aster",
        description: "Pure white dahlia with delicate, daisy-like flowers. This variety is perfect for wedding arrangements and adds elegance to any garden.",
        price: "$11.99",
        inStock: false,
        image: "⚪"
    },
    {
        id: 8,
        name: "Firepot",
        description: "A vibrant orange dahlia with fiery red tips. This eye-catching variety is perfect for adding warmth and energy to your garden.",
        price: "$10.99",
        inStock: true,
        image: "🔥"
    },
    {
        id: 9,
        name: "Lavender Perfection",
        description: "Soft lavender dahlia with large, fully double flowers. The gentle color makes it perfect for romantic arrangements and pastel gardens.",
        price: "$15.99",
        inStock: true,
        image: "💜"
    },
    {
        id: 10,
        name: "Yellow Hammer",
        description: "Bright yellow dahlia with golden petals that seem to glow in the sunlight. This cheerful variety is perfect for brightening any space.",
        price: "$12.99",
        inStock: true,
        image: "🌻"
    }
];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const signInModal = document.getElementById('signInModal');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Global variables
let isSignUpMode = false;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing website...');
    
    // Ensure scrolling is enabled with visible scrollbar
    document.body.style.overflow = '';
    document.body.style.overflowX = '';
    document.body.style.overflowY = 'scroll';
    
    // Make loadCart globally accessible
    window.loadCart = loadCart;
    
    // Make forceEnableScrolling globally accessible
    window.forceEnableScrolling = forceEnableScrolling;
    
    // Ensure basic styling is applied immediately
    ensureBasicStyling();
    
    // Force enable scrolling on page load
    setTimeout(() => {
        forceEnableScrolling();
    }, 100);
    
    // Wait for Firebase to be ready
    if (typeof firebase !== 'undefined') {
        initializeApp();
    } else {
        // Fallback to static data if Firebase is not available
        console.log('Firebase not available, using static data');
        loadProducts();
        setupEventListeners();
        setupSmoothScrolling();
    }
});

// Ensure basic styling is always applied
function ensureBasicStyling() {
    console.log('Applying basic styling...');
    
    // Force critical styles
    document.body.style.fontFamily = "'Poppins', 'Arial', sans-serif";
    document.body.style.backgroundColor = "#fff";
    document.body.style.color = "#333";
    
    // Ensure scrolling is enabled with visible scrollbar
    document.body.style.overflow = '';
    document.body.style.overflowX = '';
    document.body.style.overflowY = 'scroll';
    
    // Ensure fonts are loaded
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            console.log('Fonts loaded successfully');
        });
    }
    
    // Add fallback for Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

// Force enable scrolling function
function forceEnableScrolling() {
    console.log('Force enabling scrolling...');
    document.body.style.overflow = '';
    document.body.style.overflowX = '';
    document.body.style.overflowY = 'scroll';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowX = '';
    document.documentElement.style.overflowY = 'scroll';
    console.log('Scrolling should now be enabled with visible scrollbar');
}

// Initialize the app with Firebase
async function initializeApp() {
    try {
        console.log('Initializing Firebase app...');
        console.log('Firebase Auth available:', !!window.firebaseAuth);
        console.log('Firebase DB available:', !!window.firebaseDB);
        
        // Load products from Firebase
        await loadProductsFromFirebase();
        setupEventListeners();
        setupSmoothScrolling();
        
        // Initialize cart
        loadCart();
        
        // Initialize sample products if database is empty
        const products = await window.firebaseDB.getProducts();
        if (products.length === 0) {
            await window.firebaseDB.initializeSampleProducts();
            await loadProductsFromFirebase();
        }
        
        console.log('Firebase app initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to static data
        loadProducts();
        setupEventListeners();
        setupSmoothScrolling();
    }
}

// Load products from Firebase
async function loadProductsFromFirebase() {
    try {
        console.log('Loading products from Firebase...');
        const products = await window.firebaseDB.getProducts();
        console.log('Products loaded from Firebase:', products.length);
        
        productsGrid.innerHTML = '';
        
        if (products.length === 0) {
            console.log('No products in Firebase, initializing sample products...');
            await window.firebaseDB.initializeSampleProducts();
            const sampleProducts = await window.firebaseDB.getProducts();
            console.log('Sample products initialized:', sampleProducts.length);
            
            sampleProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        } else {
            products.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        }
        
        console.log('Products displayed successfully');
        
        // Ensure products section is visible and scrollable
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.style.display = 'block';
            productsSection.style.visibility = 'visible';
        }
        
        // Ensure body is scrollable
        document.body.style.overflow = 'auto';
        
    } catch (error) {
        console.error('Error loading products from Firebase:', error);
        // Fallback to static data
        console.log('Falling back to static data...');
        loadProducts();
    }
}

// Load products into the grid (static data fallback)
function loadProducts() {
    productsGrid.innerHTML = '';
    
    dahliaProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <span style="font-size: 4rem;">${product.image}</span>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price}</div>
            <span class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                ${product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <button class="add-to-cart" ${!product.inStock ? 'disabled' : ''}>
                ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    `;
    
    // Add click event for add to cart
    const addToCartBtn = card.querySelector('.add-to-cart');
    if (product.inStock) {
        addToCartBtn.addEventListener('click', () => addToCart(product));
    }
    
    return card;
}

// Add to cart functionality
async function addToCart(product) {
    try {
        // Check if user is authenticated
        if (!window.firebaseAuth.isAuthenticated()) {
            showNotification('Please sign in to add items to cart', 'error');
            openSignIn();
            return;
        }

        const user = window.firebaseAuth.getCurrentUser();
        if (!user) {
            showNotification('Please sign in to add items to cart', 'error');
            return;
        }

        // Add to cart using Firestore
        await window.firebaseDB.addToCart(user.uid, product.id, 1);
        
        // Update local cart
        const existingItem = cartItems.find(item => item.productId === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                productId: product.id,
                quantity: 1,
                product: product
            });
        }
        
        saveCartToLocal();
        updateCartCount();
        showNotification(`${product.name} added to cart!`, 'success');
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add item to cart', 'error');
    }
}

// Update cart display
async function updateCartDisplay() {
    try {
        const user = window.firebaseAuth.getCurrentUser();
        if (!user) return;

        const cartItems = await window.firebaseDB.getCartWithProducts(user.uid);
        // You can update your cart UI here
        console.log('Cart updated:', cartItems);
    } catch (error) {
        console.error('Error updating cart display:', error);
    }
}

// Force reload products (useful for debugging)
async function forceReloadProducts() {
    console.log('Force reloading products...');
    try {
        await loadProductsFromFirebase();
    } catch (error) {
        console.error('Error in force reload:', error);
        loadProducts(); // Fallback to static data
    }
}

// ===== CART FUNCTIONALITY =====

// Global cart variables
let cartItems = [];
let cartTotal = 0;

// Toggle cart modal
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    
    if (cartModal.style.display === 'block') {
        cartModal.style.display = 'none';
        // Enable scrolling but keep scrollbar visible
        document.body.style.overflow = '';
        document.body.style.overflowX = '';
        document.body.style.overflowY = 'scroll';
        console.log('Cart closed - scrolling enabled');
    } else {
        cartModal.style.display = 'block';
        // Prevent body scrolling but keep scrollbar visible
        document.body.style.overflow = 'hidden';
        document.body.style.overflowY = 'scroll';
        loadCart();
        console.log('Cart opened - scrolling disabled but scrollbar visible');
    }
}

// Load cart from Firebase or local storage
async function loadCart() {
    try {
        console.log('Loading cart...');
        console.log('Firebase Auth available:', !!window.firebaseAuth);
        console.log('User authenticated:', window.firebaseAuth ? window.firebaseAuth.isAuthenticated() : false);
        
        if (window.firebaseAuth && window.firebaseAuth.isAuthenticated()) {
            const user = window.firebaseAuth.getCurrentUser();
            console.log('Current user:', user);
            if (user && window.firebaseDB) {
                console.log('Loading cart from Firebase...');
                const firebaseCart = await window.firebaseDB.getCartWithProducts(user.uid);
                console.log('Firebase cart items:', firebaseCart.length);
                cartItems = firebaseCart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    product: item.product
                }));
            }
        } else {
            // Load from local storage if not authenticated
            console.log('Loading cart from local storage...');
            const savedCart = localStorage.getItem('dahliaCart');
            if (savedCart) {
                cartItems = JSON.parse(savedCart);
                console.log('Local cart items:', cartItems.length);
            }
        }
        
        console.log('Total cart items:', cartItems.length);
        displayCart();
        updateCartCount();
    } catch (error) {
        console.error('Error loading cart:', error);
        showNotification('Error loading cart', 'error');
    }
}

// Display cart items
function displayCart() {
    const cartContent = document.getElementById('cartContent');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (cartItems.length === 0) {
        cartContent.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some beautiful flowers to get started!</p>
            </div>
        `;
        cartTotalElement.textContent = '$0.00';
        return;
    }
    
    cartContent.innerHTML = '';
    cartTotal = 0;
    
    cartItems.forEach(item => {
        const itemTotal = parseFloat(item.product.price) * item.quantity;
        cartTotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <i class="fas fa-flower-tulip"></i>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.product.name}</div>
                <div class="cart-item-price">$${parseFloat(item.product.price).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.productId}', ${item.quantity - 1})" title="Decrease quantity">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                           onchange="updateQuantity('${item.productId}', parseInt(this.value))" title="Quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.productId}', ${item.quantity + 1})" title="Increase quantity">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-item" onclick="removeFromCart('${item.productId}')" title="Remove item">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        
        cartContent.appendChild(cartItemElement);
    });
    
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
}

// Update quantity
async function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    try {
        if (window.firebaseAuth && window.firebaseAuth.isAuthenticated()) {
            const user = window.firebaseAuth.getCurrentUser();
            if (user && window.firebaseDB) {
                await window.firebaseDB.updateCartItem(user.uid, productId, newQuantity);
            }
        }
        
        // Update local cart
        const itemIndex = cartItems.findIndex(item => item.productId === productId);
        if (itemIndex !== -1) {
            cartItems[itemIndex].quantity = newQuantity;
            saveCartToLocal();
        }
        
        displayCart();
        updateCartCount();
    } catch (error) {
        console.error('Error updating quantity:', error);
        showNotification('Error updating quantity', 'error');
    }
}

// Remove from cart
async function removeFromCart(productId) {
    try {
        if (window.firebaseAuth && window.firebaseAuth.isAuthenticated()) {
            const user = window.firebaseAuth.getCurrentUser();
            if (user && window.firebaseDB) {
                await window.firebaseDB.removeFromCart(user.uid, productId);
            }
        }
        
        // Update local cart
        cartItems = cartItems.filter(item => item.productId !== productId);
        saveCartToLocal();
        
        displayCart();
        updateCartCount();
        showNotification('Item removed from cart', 'success');
    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification('Error removing item', 'error');
    }
}

// Clear cart
async function clearCart() {
    try {
        if (window.firebaseAuth && window.firebaseAuth.isAuthenticated()) {
            const user = window.firebaseAuth.getCurrentUser();
            if (user && window.firebaseDB) {
                await window.firebaseDB.clearCart(user.uid);
            }
        }
        
        cartItems = [];
        saveCartToLocal();
        displayCart();
        updateCartCount();
        showNotification('Cart cleared', 'success');
    } catch (error) {
        console.error('Error clearing cart:', error);
        showNotification('Error clearing cart', 'error');
    }
}

// Save cart to local storage
function saveCartToLocal() {
    localStorage.setItem('dahliaCart', JSON.stringify(cartItems));
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    if (!window.firebaseAuth || !window.firebaseAuth.isAuthenticated()) {
        showNotification('Please sign in to checkout', 'error');
        openSignIn();
        return;
    }
    
    displayCheckoutModal();
}

// Display checkout modal
function displayCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    checkoutItems.innerHTML = '';
    cartItems.forEach(item => {
        const itemTotal = parseFloat(item.product.price) * item.quantity;
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <span>${item.product.name} x${item.quantity}</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        checkoutItems.appendChild(checkoutItem);
    });
    
    checkoutTotal.textContent = `$${cartTotal.toFixed(2)}`;
    checkoutModal.style.display = 'block';
}

// Close checkout modal
function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.style.display = 'none';
}

// Handle checkout form submission
async function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('shippingName').value,
        email: document.getElementById('shippingEmail').value,
        address: document.getElementById('shippingAddress').value,
        phone: document.getElementById('shippingPhone').value
    };
    
    try {
        const user = window.firebaseAuth.getCurrentUser();
        const orderData = {
            items: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: parseFloat(item.product.price)
            })),
            total: cartTotal,
            shippingInfo: formData,
            status: 'pending'
        };
        
        const orderId = await window.firebaseDB.createOrder(user.uid, orderData);
        
        showNotification('Order placed successfully!', 'success');
        closeCheckout();
        clearCart();
        
        // Reset form
        document.getElementById('checkoutForm').reset();
        
    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Error placing order', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Sign in form submission
    const signInForm = document.querySelector('.signin-form');
    if (signInForm) {
        signInForm.addEventListener('submit', handleAuthSubmit);
    }
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', handleContactForm);
    
    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    

    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === signInModal) {
            closeSignIn();
        }
        if (event.target === cartModal) {
            toggleCart();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (signInModal.style.display === 'block') {
                closeSignIn();
            }
            if (cartModal.style.display === 'block') {
                toggleCart();
            }
        }
        
        // Force enable scrolling with Ctrl+Shift+S (for debugging)
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
            forceEnableScrolling();
            showNotification('Scrolling enabled', 'info');
        }
    });
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Modal functions
function openSignIn() {
    signInModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.body.style.overflowY = 'scroll';
}

function closeSignIn() {
    signInModal.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.overflowX = '';
    document.body.style.overflowY = 'scroll';
}

// Toggle between sign in and sign up modes
function toggleAuthMode() {
    console.log('Toggle auth mode called. Current mode:', isSignUpMode);
    
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const authButton = document.getElementById('authButton');
    const authToggle = document.getElementById('authToggle');
    const nameGroup = document.getElementById('nameGroup');
    const signinOptions = document.getElementById('signinOptions');
    
    isSignUpMode = !isSignUpMode;
    console.log('New mode:', isSignUpMode);
    
    if (isSignUpMode) {
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Sign up to start shopping with us';
        authButton.textContent = 'Sign Up';
        authToggle.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode()">Sign in</a>';
        nameGroup.style.display = 'block';
        signinOptions.style.display = 'none';
    } else {
        authTitle.textContent = 'Welcome Back';
        authSubtitle.textContent = 'Sign in to your account to continue shopping';
        authButton.textContent = 'Sign In';
        authToggle.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Sign up</a>';
        nameGroup.style.display = 'none';
        signinOptions.style.display = 'flex';
    }
}

// Handle authentication form submission
async function handleAuthSubmit(e) {
    console.log('handleAuthSubmit called!');
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    
    console.log('Auth submit - Mode:', isSignUpMode, 'Email:', email, 'Name:', name);
    
    // Check if Firebase is available
    if (!window.firebaseAuth) {
        console.error('Firebase Auth not available');
        showNotification('Firebase not initialized. Please refresh the page.', 'error');
        return;
    }
    
    // Basic validation
    if (!email || !password) {
        window.firebaseAuth.showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        window.firebaseAuth.showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (isSignUpMode && !name) {
        window.firebaseAuth.showNotification('Please enter your full name', 'error');
        return;
    }
    
    try {
        addLoadingAnimation();
        
        if (isSignUpMode) {
            console.log('Attempting sign up...');
            await window.firebaseAuth.signUp(email, password, name);
        } else {
            console.log('Attempting sign in...');
            await window.firebaseAuth.signIn(email, password);
        }
        
        removeLoadingAnimation();
        closeSignIn();
        
        // Reset form
        document.getElementById('authForm').reset();
        
        // Reload products after successful authentication
        try {
            console.log('Reloading products after authentication...');
            await loadProductsFromFirebase();
        } catch (error) {
            console.error('Error reloading products after auth:', error);
            // Fallback to static data if Firebase fails
            loadProducts();
        }
        
    } catch (error) {
        removeLoadingAnimation();
        console.error('Authentication error:', error);
        // Show error notification
        if (window.firebaseAuth) {
            window.firebaseAuth.showNotification(error.message || 'Authentication failed', 'error');
        } else {
            showNotification('Authentication failed. Please try again.', 'error');
        }
    }
}

// Handle contact form submission
async function handleContactForm(e) {
    e.preventDefault();
    
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const message = e.target.querySelector('textarea').value;
    
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        showNotification('Sending message...', 'info');
        
        // Save to Firebase if available
        if (window.firebaseDB) {
            await window.firebaseDB.saveContactForm({ name, email, message });
        }
        
        showNotification('Message sent successfully!', 'success');
        e.target.reset();
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Error sending message. Please try again.', 'error');
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        color: white;
        font-weight: 600;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
            break;
        case 'info':
        default:
            notification.style.background = 'linear-gradient(135deg, #2196f3, #1976d2)';
            break;
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add loading animation for products
function addLoadingAnimation() {
    const loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #e91e63; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 1rem; color: #6c757d;">Loading beautiful flowers...</p>
        </div>
    `;
    
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
    
    productsGrid.appendChild(loadingDiv);
    
    // Remove loading after a short delay
    setTimeout(() => {
        if (loadingDiv.parentNode) {
            loadingDiv.parentNode.removeChild(loadingDiv);
        }
    }, 1000);
}

// Initialize loading animation
addLoadingAnimation(); 