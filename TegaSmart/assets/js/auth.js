// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Fill demo credentials for passenger
function fillDemo(type) {
    if (type === 'passenger') {
        document.getElementById('phone').value = '0788123456';
        document.getElementById('password').value = '123456';
    } else {
        document.getElementById('phone').value = '0788234567';
        document.getElementById('password').value = 'admin123';
    }
}

// Fill demo credentials for staff
function fillStaffDemo(type) {
    if (type === 'driver') {
        document.getElementById('staffId').value = 'STAFF-00123';
        document.getElementById('staffPassword').value = 'driver123';
        document.getElementById('staffRole').value = 'driver';
        document.getElementById('station').value = 'bus-101';
    } else {
        document.getElementById('staffId').value = 'STAFF-00001';
        document.getElementById('staffPassword').value = 'admin123';
        document.getElementById('staffRole').value = 'admin';
        document.getElementById('station').value = 'nyabugogo';
    }
}

// Quick login for staff
function quickLogin(role) {
    const credentials = {
        driver: {
            id: 'STAFF-DRIVER',
            password: 'driver123',
            role: 'driver',
            station: 'bus-101'
        },
        conductor: {
            id: 'STAFF-COND',
            password: 'conductor123',
            role: 'conductor',
            station: 'nyabugogo'
        }
    };
    
    const cred = credentials[role];
    if (cred) {
        document.getElementById('staffId').value = cred.id;
        document.getElementById('staffPassword').value = cred.password;
        document.getElementById('staffRole').value = cred.role;
        document.getElementById('station').value = cred.station;
        
        // Auto submit after 1 second
        setTimeout(() => {
            document.getElementById('staffLoginForm').submit();
        }, 1000);
    }
}

// MTN MoMo login simulation
function loginWithMoMo() {
    const phone = prompt('Enter your MTN MoMo number (+250):');
    if (phone && phone.length === 12) {
        showLoading('Authenticating with MoMo...');
        
        // Simulate MoMo authentication
        setTimeout(() => {
            hideLoading();
            
            // Mock user data
            const user = {
                phone: phone,
                name: 'MoMo User',
                role: 'passenger',
                balance: Math.floor(Math.random() * 50000) + 10000
            };
            
            // Store session
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'passenger');
            
            // Redirect to dashboard
            window.location.href = 'client-dashboard.html';
        }, 2000);
    }
}

// Google login simulation
function loginWithGoogle() {
    showLoading('Connecting to Google...');
    
    setTimeout(() => {
        hideLoading();
        
        // Mock user data
        const user = {
            email: 'user@gmail.com',
            name: 'Google User',
            role: 'passenger'
        };
        
        // Store session
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'passenger');
        
        // Redirect to dashboard
        window.location.href = 'client-dashboard.html';
    }, 1500);
}

// Client login form submission
document.getElementById('clientLoginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Show loading
    const btnText = this.querySelector('.btn-text');
    const btnLoading = this.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    // Simulate API call
    setTimeout(() => {
        // Mock validation
        if (phone && password.length >= 6) {
            // Mock user data
            const user = {
                phone: '+250' + phone,
                name: phone === '0788123456' ? 'John Doe' : 'Demo User',
                role: 'passenger',
                balance: 15000,
                cardId: 'RFID-' + Math.random().toString(36).substr(2, 8).toUpperCase()
            };
            
            // Store session
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'passenger');
            
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('savedPhone', phone);
            }
            
            // Redirect to dashboard
            window.location.href = 'client-dashboard.html';
        } else {
            alert('Invalid credentials. Phone must be 9 digits and password at least 6 characters.');
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }, 1500);
});

// Staff login form submission
document.getElementById('staffLoginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const staffId = document.getElementById('staffId').value;
    const password = document.getElementById('staffPassword').value;
    const role = document.getElementById('staffRole').value;
    const station = document.getElementById('station').value;
    
    // Show loading
    const btnText = this.querySelector('.btn-text');
    const btnLoading = this.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    // Simulate API call
    setTimeout(() => {
        // Mock validation
        if (staffId && password && role && station) {
            // Mock staff data
            const staff = {
                id: staffId,
                name: role === 'driver' ? 'Driver James' : 
                      role === 'admin' ? 'Admin Sarah' : 'Staff Member',
                role: role,
                station: station,
                permissions: getPermissions(role),
                shift: getCurrentShift()
            };
            
            // Store session
            localStorage.setItem('currentStaff', JSON.stringify(staff));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'staff');
            
            // Redirect to staff dashboard
            window.location.href = 'staff-dashboard.html';
        } else {
            alert('Please fill all required fields.');
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }, 1500);
});

// Helper functions
function showLoading(message) {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) loader.remove();
}

function getPermissions(role) {
    const permissions = {
        driver: ['validate_tickets', 'view_schedule', 'start_trip'],
        conductor: ['validate_tickets', 'sell_tickets', 'manage_passengers'],
        admin: ['all'],
        manager: ['view_reports', 'manage_staff', 'manage_buses'],
        support: ['view_tickets', 'assist_passengers']
    };
    return permissions[role] || [];
}

function getCurrentShift() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
}

// Check if user is already logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const currentPage = window.location.pathname;
    
    // If on login page but already logged in, redirect to dashboard
    if (isLoggedIn === 'true' && currentPage.includes('login')) {
        if (userRole === 'passenger') {
            window.location.href = 'client-dashboard.html';
        } else if (userRole === 'staff') {
            window.location.href = 'staff-dashboard.html';
        }
    }
    
    // If on dashboard but not logged in, redirect to login
    if (!isLoggedIn && (currentPage.includes('dashboard'))) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentStaff');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    window.location.href = '../index.html';
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', checkAuth);