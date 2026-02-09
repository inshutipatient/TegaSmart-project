// PWA Installation
let deferredPrompt;
const pwaStatus = document.getElementById('pwa-status');
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
    pwaStatus.textContent = 'Ready to install';
    pwaStatus.style.color = '#10b981';
});

installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        installBtn.style.display = 'none';
        pwaStatus.textContent = 'App installed!';
    }
    
    deferredPrompt = null;
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => {
                console.log('Service Worker registered:', reg);
                pwaStatus.textContent = 'PWA Ready';
            })
            .catch(err => {
                console.log('Service Worker registration failed:', err);
                pwaStatus.textContent = 'PWA Not Available';
                pwaStatus.style.color = '#ef4444';
            });
    });
}

// Toggle Mobile Menu
document.getElementById('menuBtn')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('show');
});

// Mock Ticket Purchase
function buyTicket() {
    const route = 'Kigali → Huye';
    const price = '2,500 RWF';
    
    if (confirm(`Buy ticket for ${route}?\nPrice: ${price}\n\nThis is a simulation.`)) {
        // Store in localStorage (temporary)
        const ticket = {
            id: Date.now(),
            route: route,
            price: price,
            purchaseDate: new Date().toLocaleString(),
            expiryDate: new Date(Date.now() + 2*60*60*1000).toLocaleString() // 2 hours
        };
        
        let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        tickets.push(ticket);
        localStorage.setItem('tickets', JSON.stringify(tickets));
        
        alert(`✅ Ticket purchased!\nRoute: ${route}\nValid for 2 hours\n\nGo to Dashboard to view tickets.`);
    }
}

// Check PWA Capabilities
function checkPWASupport() {
    const supports = {
        installable: !!window.deferredPrompt,
        offline: 'serviceWorker' in navigator,
        storage: 'localStorage' in window,
        notifications: 'Notification' in window,
        geolocation: 'geolocation' in navigator
    };
    
    console.log('PWA Support:', supports);
    return supports;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkPWASupport();
    
    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});


// ============================================
// GENERAL APP FUNCTIONS
// ============================================

// Show loading overlay
function showLoading(message = 'Loading...') {
    // Remove existing loader
    hideLoading();
    
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
    
    // Add styles if not present
    if (!document.querySelector('#loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            .loading-content {
                background: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .loading-content .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loader);
}

// Hide loading overlay
function hideLoading() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) loader.remove();
}

// Check if user is logged in (for other pages)
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    // If not logged in and trying to access protected pages
    if (!isLoggedIn && currentPage.includes('dashboard')) {
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('rememberMe');
        
        showToast('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if user has a valid session
function hasValidSession() {
    const user = getCurrentUser();
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    return user && isLoggedIn === 'true';
}

// Initialize app
function initApp() {
    console.log('TegaSmart App Initialized');
    
    // Check login status for protected pages
    checkLoginStatus();
    
    // Add any global event listeners
    document.addEventListener('keydown', function(e) {
        // Ctrl + L for logout
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            logout();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}