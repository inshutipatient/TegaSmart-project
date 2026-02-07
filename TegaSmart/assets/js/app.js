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