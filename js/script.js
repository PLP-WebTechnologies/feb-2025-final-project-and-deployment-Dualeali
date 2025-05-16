/**
 * Habaswein Digital Market - Main JavaScript File
 * Contains all interactive functionality for the e-commerce site
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLoadingScreen();
    initMobileMenu();
    initDropdowns();
    initModals();
    initProductSlider();
    initTestimonialSlider();
    initDealTimer();
    initCartFunctionality();
    initQuickView();
    initNewsletterForm();
    initBackToTop();
    initProductInteractions();
    initUserAuthentication();
});

// ====================== CORE FUNCTIONALITY ======================

/**
 * Loading Screen - Shows while page loads, then fades out
 */
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;

    // Minimum show time of 1 second (even if page loads faster)
    setTimeout(() => {
        loadingScreen.classList.add('hide');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 1000);
}

/**
 * Mobile Menu Toggle - Handles hamburger menu functionality
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navContainer = document.querySelector('.nav-container');
    
    if (!hamburger || !navContainer) return;
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navContainer.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
}

/**
 * Dropdown Menus - Handles category dropdowns
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('a');
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

// ====================== MODAL FUNCTIONALITY ======================

/**
 * Initialize all modal windows
 */
function initModals() {
    // User Modal
    const userBtn = document.getElementById('user-btn');
    const userModal = document.querySelector('.user-modal');
    const closeUserModal = userModal.querySelector('.close-modal');
    
    if (userBtn && userModal) {
        userBtn.addEventListener('click', () => {
            userModal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
        
        closeUserModal.addEventListener('click', () => {
            userModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Close modals when clicking outside content
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('user-modal')) {
            e.target.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

// ====================== PRODUCT SLIDER ======================

/**
 * Hero Product Slider - Auto-rotating banner
 */
function initProductSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;
    
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slide-dots');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 seconds
    
    // Create dots for each slide
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Start auto-sliding
    startSlider();
    
    function startSlider() {
        slideInterval = setInterval(nextSlide, slideDuration);
    }
    
    function resetSlider() {
        clearInterval(slideInterval);
        startSlider();
    }
    
    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }
    
    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }
    
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        resetSlider();
    }
    
    // Navigation controls
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlider();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlider();
        });
    }
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', startSlider);
}

// ====================== TESTIMONIAL SLIDER ======================

/**
 * Customer Testimonial Slider
 */
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    const testimonials = document.querySelectorAll('.testimonial');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    let currentTestimonial = 0;
    const testimonialDuration = 8000; // 8 seconds
    
    // Create dots for each testimonial
    testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showTestimonial(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    
    // Start auto-rotating
    let testimonialInterval = setInterval(nextTestimonial, testimonialDuration);
    
    function nextTestimonial() {
        showTestimonial((currentTestimonial + 1) % testimonials.length);
    }
    
    function showTestimonial(index) {
        testimonials[currentTestimonial].classList.remove('active');
        dots[currentTestimonial].classList.remove('active');
        
        currentTestimonial = index;
        
        testimonials[currentTestimonial].classList.add('active');
        dots[currentTestimonial].classList.add('active');
        
        // Reset timer
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(nextTestimonial, testimonialDuration);
    }
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(nextTestimonial, testimonialDuration);
    });
}

// ====================== DEAL OF THE DAY TIMER ======================

/**
 * Countdown Timer for Daily Deal
 */
function initDealTimer() {
    const timerElement = document.querySelector('.deal-timer');
    if (!timerElement) return;
    
    // Set deal end time (24 hours from now)
    const dealEndTime = new Date();
    dealEndTime.setHours(dealEndTime.getHours() + 24);
    
    function updateTimer() {
        const now = new Date();
        const diff = dealEndTime - now;
        
        if (diff <= 0) {
            // Deal has ended
            document.querySelector('.deal-timer h4').textContent = 'Deal has ended!';
            document.querySelector('.timer').style.display = 'none';
            return;
        }
        
        // Calculate time remaining
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Update display
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update immediately and then every second
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ====================== CART FUNCTIONALITY ======================
function initCartFunctionality() {
  // Cache DOM
  const cartCountEl    = document.querySelector('.cart-count');
  const emptyCartDiv   = document.getElementById('empty-cart');
  const cartContentDiv = document.getElementById('cart-content');
  const cartItemsTbody = document.getElementById('cart-items');
  const cartTotalEl    = document.getElementById('cart-total');

  // Load or initialize cart
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update the floating cart count (in header)
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) cartCountEl.textContent = totalItems;
  }

  // **Call it immediately** so the header count is correct on page load
  updateCartCount();



  // Render the full cart table or empty state
  function displayCartItems() {
    // Reload from storage in case it changed
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
      emptyCartDiv.style.display   = 'block';
      cartContentDiv.style.display = 'none';
      updateCartCount();
      return;
    }
    emptyCartDiv.style.display   = 'none';
    cartContentDiv.style.display = 'block';

    // Clear existing rows
    cartItemsTbody.innerHTML = '';

    // Build a <tr> per item
    cart.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="product-cell">
          <img src="${item.image}" alt="${item.name}" />
          <span>${item.name}</span>
        </td>
        <td class="price-cell">Ksh ${item.price.toLocaleString()}</td>
        <td class="qty-cell">
          <button class="decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-id="${item.id}">+</button>
        </td>
        <td class="subtotal-cell">
          Ksh ${(item.price * item.quantity).toLocaleString()}
        </td>
        <td class="remove-cell">
          <button class="remove-item" data-id="${item.id}">&times;</button>
        </td>
      `;
      cartItemsTbody.appendChild(tr);
    });

    updateCartTotal();
    updateCartCount();
  }

  // Update the numeric total at bottom
  function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (cartTotalEl) cartTotalEl.textContent = `Ksh ${total.toLocaleString()}`;
  }

  // Listen for clicks to add/increase/decrease/remove
  document.addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (!id) return;

    // Add to cart from product card
    if (e.target.classList.contains('add-to-cart')) {
      const productCard = e.target.closest('.product-card');
      const name  = productCard.querySelector('h3').textContent;
      const price = parseFloat(
        productCard.querySelector('.current-price')
          .textContent.replace(/[^\d.]/g, '')
      );
      const image = productCard.querySelector('img').src;

      const existing = cart.find(i => i.id === id);
      if (existing) existing.quantity++;
      else cart.push({ id, name, price, image, quantity: 1 });

      localStorage.setItem('cart', JSON.stringify(cart));
      showAddToCartNotification(name);
      displayCartItems();
    }

    // Increase quantity
    if (e.target.classList.contains('increase')) {
      cart.find(i => i.id === id).quantity++;
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCartItems();
    }

    // Decrease quantity / remove if zero
    if (e.target.classList.contains('decrease')) {
      const item = cart.find(i => i.id === id);
      if (item.quantity > 1) item.quantity--;
      else cart = cart.filter(i => i.id !== id);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCartItems();
    }

    // Remove item
    if (e.target.classList.contains('remove-item')) {
      cart = cart.filter(i => i.id !== id);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCartItems();
    }
  });

  // Feedback toast
  function showAddToCartNotification(productName) {
    const notif = document.createElement('div');
    notif.className = 'cart-notification';
    notif.textContent = `"${productName}" added to cart!`;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('show'), 50);
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }

  // Initial render
  displayCartItems();
}

// Finally, **call** this in your DOMContentLoaded:
document.addEventListener('DOMContentLoaded', initCartFunctionality);

// ====================== QUICK VIEW MODAL ======================

/**
 * Product Quick View Functionality
 */
function initQuickView() {
    const quickViewModal = document.querySelector('.quick-view-modal');
    if (!quickViewModal) return;
    
    const closeModal = quickViewModal.querySelector('.close-modal');
    const modalBody = quickViewModal.querySelector('.modal-body');
    
    // Close modal
    closeModal.addEventListener('click', () => {
        quickViewModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
    
    // Close when clicking outside
    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) {
            quickViewModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
    
    // Quick view buttons
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productCard = this.closest('.product-card');
            
            // Get product details
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productImage = productCard.querySelector('img').src;
            const productRating = productCard.querySelector('.product-rating').innerHTML;
            
            // Populate modal
            modalBody.innerHTML = `
                <div class="modal-product-image">
                    <img src="${productImage}" alt="${productName}">
                </div>
                <div class="modal-product-info">
                    <h2>${productName}</h2>
                    <div class="modal-product-rating">
                        ${productRating}
                    </div>
                    <div class="modal-product-price">
                        ${productPrice}
                    </div>
                    <p class="modal-product-description">
                        This premium product offers excellent quality and value. Perfect for everyday use with durable 
                        materials and cutting-edge technology. Satisfaction guaranteed or your money back.
                    </p>
                    <div class="modal-product-actions">
                        <div class="quantity-selector">
                            <button class="decrement">-</button>
                            <input type="number" value="1" min="1">
                            <button class="increment">+</button>
                        </div>
                        <button class="btn modal-add-to-cart" data-id="${productId}">Add to Cart</button>
                    </div>
                    <div class="modal-product-meta">
                        <p><span>Category:</span> <span>Electronics</span></p>
                        <p><span>Availability:</span> <span>In Stock (20+ items)</span></p>
                        <p><span>SKU:</span> <span>HDM-${productId}</span></p>
                    </div>
                </div>
            `;
            
            // Show modal
            quickViewModal.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // Add quantity selector functionality
            const quantityInput = modalBody.querySelector('.quantity-selector input');
            modalBody.querySelector('.decrement').addEventListener('click', () => {
                if (quantityInput.value > 1) {
                    quantityInput.value--;
                }
            });
            
            modalBody.querySelector('.increment').addEventListener('click', () => {
                quantityInput.value++;
            });
            
            // Add to cart from modal
            modalBody.querySelector('.modal-add-to-cart').addEventListener('click', function() {
                // Similar to regular add to cart but with quantity
                alert('Added to cart!');
                quickViewModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    });
}

// ====================== NEWSLETTER FORM ======================

/**
 * Newsletter Subscription Form
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const messageDiv = this.querySelector('.form-message');
        
        // Simple validation
        if (!emailInput.value || !emailInput.value.includes('@')) {
            showMessage(messageDiv, 'Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate AJAX submission
        showMessage(messageDiv, 'Subscribing...', 'info');
        
        setTimeout(() => {
            showMessage(messageDiv, 'Thank you for subscribing!', 'success');
            emailInput.value = '';
            
            // Reset after 3 seconds
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'form-message';
            }, 3000);
        }, 1500);
    });
    
    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = 'form-message ' + type;
    }
}

// ====================== UTILITY FUNCTIONS ======================

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-slide');
const nextBtn = document.querySelector('.next-slide');

let current = 0;
let slideInterval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

function prevSlide() {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

// Button controls
nextBtn.addEventListener('click', () => {
  nextSlide();
  resetInterval();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  resetInterval();
});

function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
}


/**
 * Product Interactions (Wishlist, etc.)
 */
function initProductInteractions() {
    // Wishlist functionality
    document.querySelectorAll('.add-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            this.innerHTML = this.classList.contains('active') ? 
                '<i class="fas fa-heart"></i>' : 
                '<i class="far fa-heart"></i>';
            
            // Show feedback
            const feedback = document.createElement('div');
            feedback.className = 'wishlist-feedback';
            feedback.textContent = this.classList.contains('active') ? 
                'Added to wishlist!' : 'Removed from wishlist!';
            
            this.appendChild(feedback);
            
            setTimeout(() => {
                feedback.remove();
            }, 2000);
        });
    });
}

/**
 * User Authentication Simulation
 */
function initUserAuthentication() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        // Simple validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate login
        alert(`Welcome back! You're now logged in as ${email}`);
        document.querySelector('.user-modal').classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
    
    
    // Register link
    const registerLink = document.getElementById('show-register');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Registration form would appear here');
        });
    }
    document.addEventListener('DOMContentLoaded', () => {
  const categoryLinks = document.querySelectorAll('.category-card');
  const productCards = document.querySelectorAll('.product-card');
  const noProductsMsg = document.getElementById('no-products-msg');

  categoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const selectedCategory = this.dataset.filter;
      let anyVisible = false;

      productCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (selectedCategory === 'all' || selectedCategory === cardCategory) {
          card.style.display = 'block';
          anyVisible = true;
        } else {
          card.style.display = 'none';
        }
      });

      if (noProductsMsg) {
        noProductsMsg.style.display = anyVisible ? 'none' : 'block';
      }
    });
  });
});
// =========================
// GLOBAL CART FUNCTIONALITY
// =========================

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to Cart Handler (used on product pages)
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('add-to-cart')) {
    const productCard = e.target.closest('.product-card');
    const id = e.target.dataset.id;
    const name = productCard.querySelector('h3').textContent;
    const priceText = productCard.querySelector('.current-price').textContent.replace('Ksh', '').trim();
    const price = parseFloat(priceText.replace(',', ''));
    const image = productCard.querySelector('img').getAttribute('src');

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showAddToCartNotification(name);
  }
});

// Show add to cart notification
function showAddToCartNotification(productName) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = `"${productName}" added to cart!`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 50);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// inside your DOMContentLoaded
document.addEventListener('click', function(e) {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('remove-item')) {
    cart = cart.filter(item => item.id !== id);
  }
  if (e.target.classList.contains('increase')) {
    cart.find(item => item.id === id).quantity++;
  }
  if (e.target.classList.contains('decrease')) {
    const item = cart.find(item => item.id === id);
    if (item.quantity > 1) item.quantity--;
    else cart = cart.filter(item => item.id !== id);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  displayCartItems();
});
// ============================
// js/script.js for checkout.html
// ============================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Load cart from localStorage
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch (err) {
    console.warn('Could not parse cart:', err);
  }
  console.log('Cart contents:', cart);

  // 2. Grab DOM elements
  const summaryItemsEl   = document.querySelector('.summary-items');
  const totalPriceEl     = document.getElementById('total-price');
  const form             = document.querySelector('.checkout-form');
  const paymentOptions   = document.querySelectorAll('.payment-option');

  // 3. Utility: format number as Kenyan shillings
  function formatKES(n) {
    return Number(n).toLocaleString('en-KE');
  }

  // 4. Render cart items & total
  function renderCart() {
    summaryItemsEl.innerHTML = '';
    let total = 0;

    if (!Array.isArray(cart) || cart.length === 0) {
      summaryItemsEl.innerHTML = `
        <p class="empty-cart">
          Your cart is empty. <a href="products.html">Continue shopping</a>
        </p>`;
      document.querySelector('.btn-primary').disabled = true;
      totalPriceEl.textContent = '0';
      return;
    }

    cart.forEach(item => {
      const name     = item.name || item.title || 'Unnamed';
      const price    = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity, 10) || 1;
      const lineTot  = price * quantity;
      total += lineTot;

      const row = document.createElement('div');
      row.className = 'summary-item';
      row.innerHTML = `
        <span class="item-name">${name} <strong>x${quantity}</strong></span>
        <span class="item-price">Ksh ${formatKES(lineTot)}</span>
      `;
      summaryItemsEl.appendChild(row);
    });

    totalPriceEl.textContent = formatKES(total);
  }

  // 5. Highlight selected payment option
  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
    });
  });

  // 6. Confirmation popup and cleanup
  function confirmOrder(data) {
    const itemsList = cart
      .map(i => `${i.name || i.title} x${i.quantity}`)
      .join('\n');

    const msg = 
`🎉 Order Confirmed!
--------------------
Name: ${data.fullname}
Email: ${data.email}
Phone: ${data.phone}
Address: ${data.address}
Payment: ${data.payment}

🛒 Items:
${itemsList}

💰 Total: Ksh ${data.total}

Thank you for shopping with Habaswein!`;

    alert(msg);
    localStorage.removeItem('cart');
    window.location.href = 'products.html';
  }

  // 7. Form submission handler
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const order = {
      fullname: fd.get('fullname').trim(),
      email:    fd.get('email').trim(),
      phone:    fd.get('phone').trim(),
      address:  fd.get('address').trim(),
      payment:  fd.get('payment'),
      total:    totalPriceEl.textContent
    };

    // validate
    if (!order.fullname || !order.email || !order.phone || !order.address) {
      alert('Please fill in all billing fields before placing your order.');
      return;
    }

    confirmOrder(order);
  });

  // Initial render on load
  renderCart();
});

    
}