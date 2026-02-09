// ============================================
// DASHBOARD FUNCTIONS
// ============================================

// Global variables
let currentUser = null;
let activePaymentMethod = 'momo';

// Initialize dashboard
function initDashboard() {
    console.log('Initializing dashboard...');
    
    // Check if user is logged in
    if (!checkLogin()) {
        return;
    }
    
    // Load user data
    loadUserData();
    
    // Load active tickets
    loadActiveTickets();
    
    // Load recent trips
    loadRecentTrips();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show welcome message if new registration
    checkNewRegistration();
}

// Check if user is logged in
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !userData) {
        showToast('Please login first', 'error');
        setTimeout(() => {
            window.location.href = 'client-login.html';
        }, 1500);
        return false;
    }
    
    currentUser = JSON.parse(userData);
    return true;
}

// Load user data
function loadUserData() {
    if (!currentUser) return;
    
    // Update user name
    document.getElementById('userName').textContent = currentUser.name || currentUser.fullName || 'Passenger';
    
    // Update balance
    const balance = currentUser.balance || 0;
    document.getElementById('userBalance').textContent = formatCurrency(balance);
    
    // Update card ID
    document.getElementById('cardId').textContent = currentUser.cardId || 'Not Linked';
    
    // Update stats
    updateStats();
}

// Format currency
function formatCurrency(amount) {
    return amount.toLocaleString('en-RW', {
        style: 'currency',
        currency: 'RWF',
        minimumFractionDigits: 0
    });
}

// Update dashboard stats
function updateStats() {
    // Get tickets from localStorage
    const tickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    
    // Count active tickets
    const activeTickets = tickets.filter(ticket => 
        new Date(ticket.expiryDate) > new Date() && ticket.status === 'active'
    ).length;
    
    document.getElementById('activeTickets').textContent = activeTickets;
    
    // Count total trips (from localStorage or default)
    const trips = JSON.parse(localStorage.getItem('userTrips') || '[]');
    document.getElementById('totalTrips').textContent = trips.length;
}

// Load active tickets
function loadActiveTickets() {
    const container = document.getElementById('activeTicketsList');
    const tickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    
    // Filter active tickets
    const activeTickets = tickets.filter(ticket => 
        new Date(ticket.expiryDate) > new Date() && ticket.status === 'active'
    );
    
    if (activeTickets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ticket-alt"></i>
                <p>No active tickets</p>
                <button class="btn btn-primary" onclick="buyTicket()">
                    <i class="fas fa-plus"></i> Buy Your First Ticket
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activeTickets.map(ticket => `
        <div class="ticket-card">
            <div class="ticket-info">
                <h4>${ticket.route}</h4>
                <p>Purchase: ${formatDate(ticket.purchaseDate)}</p>
                <p>Expires: ${formatDate(ticket.expiryDate)}</p>
            </div>
            <div class="ticket-status">
                <span class="status active">Active</span>
                <div class="ticket-actions">
                    <button class="btn btn-sm btn-secondary" onclick="viewTicket('${ticket.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="useTicket('${ticket.id}')">
                        <i class="fas fa-bus"></i> Use
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load recent trips
function loadRecentTrips() {
    const container = document.getElementById('recentTrips');
    const trips = JSON.parse(localStorage.getItem('userTrips') || '[]');
    
    // Sort by date (newest first)
    const sortedTrips = trips.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    ).slice(0, 5); // Get only 5 most recent
    
    if (sortedTrips.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-route"></i>
                <p>No trip history yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = sortedTrips.map(trip => `
        <div class="trip-item">
            <div class="trip-details">
                <h4>${trip.route}</h4>
                <p>${trip.departure} → ${trip.arrival}</p>
            </div>
            <div class="trip-date">
                ${formatDate(trip.date)}
            </div>
        </div>
    `).join('');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-RW', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Buy Ticket Function
function buyTicket() {
    // Reset modal
    document.getElementById('selectRoute').value = '';
    document.querySelectorAll('.payment-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.payment-option').classList.add('active');
    activePaymentMethod = 'momo';
    updateTicketPrice();
    
    // Show modal
    document.getElementById('buyTicketModal').style.display = 'flex';
}

// Quick buy from route cards
function quickBuy(route) {
    const routeMap = {
        'Kigali → Huye': 'kigali-huye',
        'Kigali → Musanze': 'kigali-musanze',
        'Kigali → Rubavu': 'kigali-rubavu'
    };
    
    const routeValue = routeMap[route];
    if (routeValue) {
        document.getElementById('selectRoute').value = routeValue;
        updateTicketPrice();
        document.getElementById('buyTicketModal').style.display = 'flex';
    }
}

// Select payment method
function selectPayment(method) {
    activePaymentMethod = method;
    
    // Update UI
    document.querySelectorAll('.payment-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (method === 'momo') {
        document.querySelector('.payment-option.momo').classList.add('active');
    } else {
        document.querySelector('.payment-option:not(.momo)').classList.add('active');
    }
}

// Update ticket price display
function updateTicketPrice() {
    const routeSelect = document.getElementById('selectRoute');
    const priceDisplay = document.getElementById('ticketPrice');
    
    const prices = {
        'kigali-huye': '2,500',
        'kigali-musanze': '3,000',
        'kigali-rubavu': '3,500',
        'kigali-nyagatare': '4,000',
        'huye-kigali': '2,500'
    };
    
    const price = prices[routeSelect.value] || '0';
    priceDisplay.textContent = price;
}

// Process payment
function processPayment() {
    const routeSelect = document.getElementById('selectRoute');
    const cardConfirmed = document.getElementById('confirmCard')?.checked || true;
    
    if (!routeSelect.value) {
        showToast('Please select a route', 'error');
        return;
    }
    
    if (!currentUser.cardId || currentUser.cardId === 'Not Linked') {
        showToast('Please link an RFID card first', 'error');
        closeBuyTicketModal();
        setTimeout(() => showLinkCardModal(), 500);
        return;
    }
    
    // Get ticket price
    const prices = {
        'kigali-huye': 2500,
        'kigali-musanze': 3000,
        'kigali-rubavu': 3500,
        'kigali-nyagatare': 4000,
        'huye-kigali': 2500
    };
    
    const price = prices[routeSelect.value];
    const routeText = routeSelect.options[routeSelect.selectedIndex].text;
    
    // Check balance if paying with card
    if (activePaymentMethod === 'card') {
        if (currentUser.balance < price) {
            showToast('Insufficient balance. Please add funds.', 'error');
            return;
        }
    }
    
    // Show loading
    const payBtn = document.querySelector('#buyTicketModal .btn-success');
    const originalText = payBtn.innerHTML;
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    payBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Reset button
        payBtn.innerHTML = originalText;
        payBtn.disabled = false;
        
        // Create ticket
        const ticketId = 'TICKET-' + Date.now();
        const purchaseDate = new Date();
        const expiryDate = new Date(purchaseDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours
        
        const newTicket = {
            id: ticketId,
            route: routeText.split(' (')[0],
            price: price,
            purchaseDate: purchaseDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
            status: 'active',
            paymentMethod: activePaymentMethod,
            cardId: currentUser.cardId
        };
        
        // Update balance if paying with card
        if (activePaymentMethod === 'card') {
            currentUser.balance -= price;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        // Save ticket
        const tickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
        tickets.push(newTicket);
        localStorage.setItem('userTickets', JSON.stringify(tickets));
        
        // Close modal
        closeBuyTicketModal();
        
        // Show success
        const successMessage = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; color: #10b981; margin-bottom: 15px;">✓</div>
                <h3 style="color: #1e293b; margin-bottom: 10px;">Ticket Purchased!</h3>
                <p style="color: #475569; margin-bottom: 10px;">
                    <strong>${routeText.split(' (')[0]}</strong>
                </p>
                <p style="color: #64748b; margin-bottom: 20px;">
                    Price: ${price.toLocaleString()} RWF<br>
                    Valid until: ${formatDate(expiryDate)}
                </p>
                <p style="color: #3b82f6; font-size: 14px;">
                    Tap your RFID card to board the bus
                </p>
            </div>
        `;
        
        showModal('Ticket Confirmation', successMessage);
        
        // Refresh dashboard
        setTimeout(() => {
            refreshDashboard();
        }, 1000);
        
    }, 2000);
}

// Close buy ticket modal
function closeBuyTicketModal() {
    document.getElementById('buyTicketModal').style.display = 'none';
}

// Show link card modal
function showLinkCardModal() {
    document.getElementById('linkCardModal').style.display = 'flex';
    document.getElementById('cardNumber').value = '';
    document.getElementById('confirmCard').checked = false;
}

// Close link card modal
function closeLinkCardModal() {
    document.getElementById('linkCardModal').style.display = 'none';
}

// Link RFID card
function linkCard() {
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const confirmed = document.getElementById('confirmCard').checked;
    
    if (!cardNumber || cardNumber.length < 10) {
        showToast('Please enter a valid card number (10-12 digits)', 'error');
        return;
    }
    
    if (!confirmed) {
        showToast('Please confirm this is your personal card', 'error');
        return;
    }
    
    // Update user's card ID
    currentUser.cardId = 'RFID-' + cardNumber;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Close modal
    closeLinkCardModal();
    
    // Show success
    showToast('RFID card linked successfully!', 'success');
    
    // Update display
    document.getElementById('cardId').textContent = currentUser.cardId;
    
    // Refresh stats
    updateStats();
}

// View ticket details
function viewTicket(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (ticket) {
        const modalContent = `
            <div style="padding: 20px;">
                <div class="ticket-card" style="margin-bottom: 20px;">
                    <div class="ticket-info">
                        <h4>${ticket.route}</h4>
                        <p><strong>Ticket ID:</strong> ${ticket.id}</p>
                        <p><strong>Price:</strong> ${ticket.price.toLocaleString()} RWF</p>
                        <p><strong>Purchase Date:</strong> ${formatDate(ticket.purchaseDate)}</p>
                        <p><strong>Expiry Date:</strong> ${formatDate(ticket.expiryDate)}</p>
                        <p><strong>Payment Method:</strong> ${ticket.paymentMethod === 'momo' ? 'MTN MoMo' : 'Card Balance'}</p>
                        <p><strong>Status:</strong> ${new Date(ticket.expiryDate) > new Date() ? 'Active' : 'Expired'}</p>
                    </div>
                </div>
                ${new Date(ticket.expiryDate) > new Date() ? `
                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn btn-primary" onclick="useTicket('${ticket.id}'); closeCustomModal();">
                        <i class="fas fa-bus"></i> Use This Ticket
                    </button>
                </div>
                ` : ''}
            </div>
        `;
        
        showModal('Ticket Details', modalContent);
    }
}

// Use ticket (simulate boarding)
function useTicket(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) {
        showToast('Ticket not found', 'error');
        return;
    }
    
    if (new Date(ticket.expiryDate) < new Date()) {
        showToast('Ticket has expired', 'error');
        return;
    }
    
    // Simulate boarding process
    showLoading('Boarding bus...');
    
    setTimeout(() => {
        hideLoading();
        
        // Create trip record
        const trip = {
            id: 'TRIP-' + Date.now(),
            ticketId: ticketId,
            route: ticket.route,
            departure: ticket.route.split('→')[0].trim(),
            arrival: ticket.route.split('→')[1].trim(),
            date: new Date().toISOString(),
            fare: ticket.price
        };
        
        // Save trip
        const trips = JSON.parse(localStorage.getItem('userTrips') || '[]');
        trips.push(trip);
        localStorage.setItem('userTrips', JSON.stringify(trips));
        
        // Mark ticket as used
        const updatedTickets = tickets.map(t => 
            t.id === ticketId ? { ...t, status: 'used' } : t
        );
        localStorage.setItem('userTickets', JSON.stringify(updatedTickets));
        
        // Show success
        showToast(`Ticket scanned! Welcome aboard ${ticket.route}`, 'success');
        
        // Refresh dashboard
        setTimeout(() => {
            refreshDashboard();
        }, 1000);
        
    }, 1500);
}

// Add funds to account
function addFunds() {
    const amount = prompt('Enter amount to add (RWF):', '5000');
    
    if (!amount || isNaN(amount) || amount < 1000) {
        showToast('Please enter a valid amount (min 1,000 RWF)', 'error');
        return;
    }
    
    showLoading('Adding funds...');
    
    setTimeout(() => {
        hideLoading();
        
        // Update balance
        currentUser.balance = (currentUser.balance || 0) + parseInt(amount);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update display
        document.getElementById('userBalance').textContent = formatCurrency(currentUser.balance);
        
        showToast(`${parseInt(amount).toLocaleString()} RWF added to your account!`, 'success');
    }, 1500);
}

// View travel history
function viewHistory() {
    showModal('Travel History', `
        <div style="max-height: 400px; overflow-y: auto;">
            <h4 style="margin-bottom: 15px;">Your Journey History</h4>
            <div id="fullHistoryList">
                <!-- History will be loaded here -->
            </div>
        </div>
    `);
    
    // Load full history
    const trips = JSON.parse(localStorage.getItem('userTrips') || '[]');
    const historyList = document.getElementById('fullHistoryList');
    
    if (trips.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">No travel history yet</p>';
        return;
    }
    
    historyList.innerHTML = trips.map(trip => `
        <div class="trip-item" style="margin-bottom: 10px;">
            <div class="trip-details">
                <h4 style="margin: 0 0 5px 0;">${trip.route}</h4>
                <p style="margin: 0; color: #64748b;">${trip.departure} → ${trip.arrival}</p>
            </div>
            <div class="trip-date">
                ${formatDate(trip.date)}
            </div>
        </div>
    `).join('');
}

// View all tickets
function viewAllTickets() {
    const tickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    
    const modalContent = `
        <div style="max-height: 400px; overflow-y: auto;">
            <h4 style="margin-bottom: 15px;">All Tickets</h4>
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button class="btn btn-sm ${!ticketFilter ? 'btn-primary' : 'btn-secondary'}" onclick="filterTickets('all')">All</button>
                <button class="btn btn-sm ${ticketFilter === 'active' ? 'btn-primary' : 'btn-secondary'}" onclick="filterTickets('active')">Active</button>
                <button class="btn btn-sm ${ticketFilter === 'expired' ? 'btn-primary' : 'btn-secondary'}" onclick="filterTickets('expired')">Expired</button>
                <button class="btn btn-sm ${ticketFilter === 'used' ? 'btn-primary' : 'btn-secondary'}" onclick="filterTickets('used')">Used</button>
            </div>
            <div id="allTicketsList">
                <!-- Tickets will be loaded here -->
            </div>
        </div>
    `;
    
    showModal('All Tickets', modalContent);
    filterTickets('all');
}

let ticketFilter = 'all';

function filterTickets(filter) {
    ticketFilter = filter;
    const tickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    const now = new Date();
    
    let filteredTickets = tickets;
    
    if (filter === 'active') {
        filteredTickets = tickets.filter(t => 
            new Date(t.expiryDate) > now && t.status === 'active'
        );
    } else if (filter === 'expired') {
        filteredTickets = tickets.filter(t => 
            new Date(t.expiryDate) < now
        );
    } else if (filter === 'used') {
        filteredTickets = tickets.filter(t => t.status === 'used');
    }
    
    const ticketsList = document.getElementById('allTicketsList');
    
    if (filteredTickets.length === 0) {
        ticketsList.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">No tickets found</p>';
        return;
    }
    
    ticketsList.innerHTML = filteredTickets.map(ticket => `
        <div class="ticket-card" style="margin-bottom: 10px;">
            <div class="ticket-info">
                <h4 style="margin: 0 0 5px 0;">${ticket.route}</h4>
                <p style="margin: 0 0 3px 0; font-size: 0.9em;">ID: ${ticket.id}</p>
                <p style="margin: 0; font-size: 0.9em; color: #64748b;">
                    ${formatDate(ticket.purchaseDate)} - ${formatDate(ticket.expiryDate)}
                </p>
            </div>
            <div class="ticket-status">
                <span class="status ${new Date(ticket.expiryDate) > now ? 'active' : 'expired'}">
                    ${ticket.status === 'used' ? 'Used' : (new Date(ticket.expiryDate) > now ? 'Active' : 'Expired')}
                </span>
                <button class="btn btn-sm btn-secondary" onclick="viewTicket('${ticket.id}'); closeCustomModal();">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Refresh dashboard
function refreshDashboard() {
    showLoading('Refreshing...');
    
    setTimeout(() => {
        hideLoading();
        loadUserData();
        loadActiveTickets();
        loadRecentTrips();
        showToast('Dashboard refreshed', 'success');
    }, 1000);
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showLoading('Logging out...');
        
        setTimeout(() => {
            hideLoading();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('newRegistration');
            
            showToast('Logged out successfully', 'success');
            
            setTimeout(() => {
                window.location.href = 'client-login.html';
            }, 1000);
        }, 1000);
    }
}

// Check if this is a new registration
function checkNewRegistration() {
    const isNew = localStorage.getItem('newRegistration');
    
    if (isNew === 'true') {
        showModal('Welcome to TegaSmart!', `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; color: #3b82f6; margin-bottom: 15px;">🎉</div>
                <h3 style="color: #1e293b; margin-bottom: 10px;">Welcome ${currentUser.name || currentUser.fullName}!</h3>
                <p style="color: #475569; margin-bottom: 20px;">
                    Your TegaSmart account is ready to use.<br>
                    Start by buying your first ticket!
                </p>
                <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">
                        <strong>Your RFID Card ID:</strong><br>
                        ${currentUser.cardId}
                    </p>
                </div>
                <button class="btn btn-primary" onclick="closeCustomModal(); buyTicket();">
                    <i class="fas fa-ticket-alt"></i> Buy First Ticket
                </button>
            </div>
        `);
        
        localStorage.removeItem('newRegistration');
    }
}

// Support functions
function showHelp() {
    showModal('Help & Support', `
        <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
            <h4>Frequently Asked Questions</h4>
            
            <div style="margin: 15px 0;">
                <p><strong>Q: How do I buy a ticket?</strong></p>
                <p>A: Click "Buy Ticket" button and select your route.</p>
            </div>
            
            <div style="margin: 15px 0;">
                <p><strong>Q: How do I link my RFID card?</strong></p>
                <p>A: Go to the "Link New Card" section on your dashboard.</p>
            </div>
            
            <div style="margin: 15px 0;">
                <p><strong>Q: What if I lose my RFID card?</strong></p>
                <p>A: Contact support immediately to block the card.</p>
            </div>
            
            <div style="margin: 15px 0;">
                <p><strong>Q: How long are tickets valid?</strong></p>
                <p>A: Tickets are valid for 2 hours after purchase.</p>
            </div>
            
            <div style="margin: 15px 0;">
                <p><strong>Q: Can I get a refund?</strong></p>
                <p>A: Tickets are non-refundable except in special cases.</p>
            </div>
        </div>
    `);
}

function callSupport() {
    window.open('tel:+250788123456');
}

function whatsappSupport() {
    window.open('https://wa.me/250788123456');
}

function emailSupport() {
    window.open('mailto:support@tegasmart.rw');
}

// View full history
function viewFullHistory() {
    viewHistory();
}

// Set up event listeners
function setupEventListeners() {
    // Route select change
    const routeSelect = document.getElementById('selectRoute');
    if (routeSelect) {
        routeSelect.addEventListener('change', updateTicketPrice);
    }
    
    // Modal close on outside click
    window.addEventListener('click', function(e) {
        const modals = ['linkCardModal', 'buyTicketModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && e.target === modal) {
                if (modalId === 'linkCardModal') closeLinkCardModal();
                if (modalId === 'buyTicketModal') closeBuyTicketModal();
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLinkCardModal();
            closeBuyTicketModal();
            closeCustomModal();
        }
    });
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initDashboard);