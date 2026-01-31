/* ============================================
   Lavs Boutique - JavaScript Functions
   ============================================ */

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // If on cart page, render cart items
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
    
    // Add animation on scroll
    observeElements();
});

/* === CART FUNCTIONS === */

// Add item to cart
function addToCart(id, name, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${name} added to cart!`);
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    showNotification('Item removed from cart');
}

// Update item quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }
}

// Update cart count display
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
}

// Render cart items on cart page
function renderCart() {
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItemsList.style.display = 'none';
        cartSummary.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItemsList.style.display = 'flex';
    cartSummary.style.display = 'block';
    
    // Clear existing items
    cartItemsList.innerHTML = '';
    
    // Render each cart item
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <div class="placeholder-img"></div>
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsList.appendChild(itemElement);
    });
    
    // Update summary
    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    alert('Proceeding to checkout...\nThis is a demo. In a real application, this would redirect to a secure checkout page.');
}

// Apply promo code
function applyPromoCode(event) {
    event.preventDefault();
    const promoInput = document.getElementById('promoInput');
    const promoMessage = document.getElementById('promoMessage');
    const code = promoInput.value.trim().toUpperCase();
    
    const validCodes = {
        'WELCOME10': 10,
        'SAVE20': 20,
        'FREESHIP': 'free_shipping'
    };
    
    if (validCodes[code]) {
        promoMessage.className = 'promo-message success';
        if (code === 'FREESHIP') {
            promoMessage.textContent = 'Free shipping applied!';
        } else {
            promoMessage.textContent = `${validCodes[code]}% discount applied!`;
        }
        promoMessage.style.display = 'block';
    } else {
        promoMessage.className = 'promo-message error';
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.style.display = 'block';
    }
    
    promoInput.value = '';
}

/* === FORM FUNCTIONS === */

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formMessage = document.getElementById('formMessage');
    
    // Get form data
    const formData = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        phone: form.phone.value,
        subject: form.subject.value,
        message: form.message.value,
        newsletter: form.newsletter.checked
    };
    
    // Simulate form submission
    formMessage.className = 'form-message success';
    formMessage.textContent = 'Thank you for your message! We\'ll get back to you within 24 hours.';
    formMessage.style.display = 'block';
    
    // Reset form
    form.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
    
    console.log('Form submitted:', formData);
}

// Handle newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    // Simulate subscription
    showNotification(`Successfully subscribed with ${email}!`);
    
    // Reset form
    form.reset();
}

/* === FILTER FUNCTIONS === */

// Clear all filters
function clearFilters() {
    const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    showNotification('Filters cleared');
}

/* === NOTIFICATION SYSTEM === */

// Show notification toast
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification-toast');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#7ba87b' : '#c87272'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        font-family: 'Raleway', sans-serif;
        font-size: 0.95rem;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in-up.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

/* === SCROLL ANIMATIONS === */

// Observe elements for scroll animations
function observeElements() {
    const elements = document.querySelectorAll('.product-card, .category-card, .value-card, .team-member');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up', 'visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.classList.add('fade-in-up');
        observer.observe(element);
    });
}

/* === SEARCH FUNCTIONALITY === */

// Handle search button click
document.querySelectorAll('.search-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const searchQuery = prompt('What are you looking for?');
        if (searchQuery) {
            showNotification(`Searching for "${searchQuery}"...`);
            // In a real application, this would redirect to search results
        }
    });
});

/* === WISHLIST FUNCTIONALITY === */

// Toggle wishlist
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

document.addEventListener('click', function(e) {
    if (e.target.closest('.wishlist-btn')) {
        const btn = e.target.closest('.wishlist-btn');
        const productCard = btn.closest('.product-card');
        const productId = productCard.dataset.productId;
        
        if (wishlist.includes(productId)) {
            // Remove from wishlist
            wishlist = wishlist.filter(id => id !== productId);
            btn.style.color = '';
            showNotification('Removed from wishlist');
        } else {
            // Add to wishlist
            wishlist.push(productId);
            btn.style.color = 'var(--color-primary)';
            showNotification('Added to wishlist!');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
});

// Mark wishlist items on page load
document.addEventListener('DOMContentLoaded', function() {
    wishlist.forEach(id => {
        const productCard = document.querySelector(`[data-product-id="${id}"]`);
        if (productCard) {
            const wishlistBtn = productCard.querySelector('.wishlist-btn');
            if (wishlistBtn) {
                wishlistBtn.style.color = 'var(--color-primary)';
            }
        }
    });
});

/* === UTILITY FUNCTIONS === */

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Format currency
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

console.log('Lavs Boutique - JavaScript Loaded Successfully ✨');
