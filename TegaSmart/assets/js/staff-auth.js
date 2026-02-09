// ============================================
// STAFF AUTHENTICATION FUNCTIONS
// ============================================

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.parentElement.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Fill staff demo credentials
function fillStaffDemo(role) {
    const demos = {
        driver: {
            id: 'STAFF-00123',
            password: 'driver123',
            role: 'driver',
            station: 'bus-101'
        },
        conductor: {
            id: 'STAFF-00456',
            password: 'conductor123',
            role: 'conductor',
            station: 'nyabugogo'
        },
        admin: {
            id: 'STAFF-00001',
            password: 'admin123',
            role: 'admin',
            station: 'headquarters'
        }
    };
    
    const demo = demos[role];
    if (demo) {
        document.getElementById('staffId').value = demo.id;
        document.getElementById('staffPassword').value = demo.password;
        document.getElementById('staffRole').value = demo.role;
        document.getElementById('station').value = demo.station;
        
        showToast(`${role.charAt(0).toUpperCase() + role.slice(1)} demo credentials filled`, 'success');
    }
}

// Quick staff login for different roles
function quickStaffLogin(role) {
    const credentials = {
        driver: {
            id: 'STAFF-DRIVER',
            password: 'driver123',
            role: 'driver',
            station: 'bus-101',
            name: 'Driver James'
        },
        conductor: {
            id: 'STAFF-CONDUCTOR',
            password: 'conductor123',
            role: 'conductor',
            station: 'nyabugogo',
            name: 'Conductor Sarah'
        },
        admin: {
            id: 'STAFF-ADMIN',
            password: 'admin123',
            role: 'admin',
            station: 'headquarters',
            name: 'Admin Manager'
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
            document.getElementById('staffLoginForm').dispatchEvent(new Event('submit'));
        }, 1000);
    }
}

// Show staff forgot password modal
function showStaffForgotPassword() {
    document.getElementById('staffForgotPasswordModal').style.display = 'flex';
    document.getElementById('staffResetId').focus();
}

// Close staff forgot password modal
function closeStaffForgotPasswordModal() {
    document.getElementById('staffForgotPasswordModal').style.display = 'none';
    document.getElementById('staffResetId').value = '';
    document.getElementById('adminCode').value = '';
}

// Request staff password reset
function requestStaffPasswordReset() {
    const staffId = document.getElementById('staffResetId').value.trim();
    const adminCode = document.getElementById('adminCode').value.trim();
    
    if (!staffId) {
        showToast('Please enter your Staff ID', 'error');
        return;
    }
    
    // Validate staff ID format
    const staffIdRegex = /^STAFF-[0-9]{5}$/;
    if (!staffIdRegex.test(staffId)) {
        showToast('Please enter a valid Staff ID (STAFF-XXXXX)', 'error');
        return;
    }
    
    // Show loading
    const requestBtn = document.querySelector('#staffForgotPasswordModal .btn-primary');
    const originalText = requestBtn.innerHTML;
    requestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    requestBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        requestBtn.innerHTML = originalText;
        requestBtn.disabled = false;
        
        // Close modal
        closeStaffForgotPasswordModal();
        
        // Show success message
        if (adminCode) {
            showToast(`Password reset approved for ${staffId}. Check your email.`, 'success');
        } else {
            showToast(`Reset request sent for ${staffId}. Administrator will contact you.`, 'success');
        }
        
        console.log(`Staff password reset requested for: ${staffId}`);
    }, 2000);
}

// Contact administrator
function contactAdmin() {
    const contactInfo = `
        <div style="text-align: center; padding: 20px;">
            <h4><i class="fas fa-headset"></i> Contact Administration</h4>
            <div style="margin: 20px 0;">
                <p><strong>Administrator:</strong> John Smith</p>
                <p><strong>Phone:</strong> +250 788 654 321</p>
                <p><strong>Email:</strong> admin@tegasmart.rw</p>
                <p><strong>Office:</strong> Headquarters, 2nd Floor</p>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="btn btn-primary" onclick="window.open('tel:+250788654321')">
                    <i class="fas fa-phone"></i> Call Now
                </button>
                <button class="btn btn-success" onclick="window.open('mailto:admin@tegasmart.rw')">
                    <i class="fas fa-envelope"></i> Send Email
                </button>
            </div>
        </div>
    `;
    
    showModal('Contact Administrator', contactInfo);
}

// Validate staff credentials
function validateStaffCredentials(staffId, password, role, station) {
    // Validate staff ID format
    const staffIdRegex = /^STAFF-[0-9]{5}$/;
    if (!staffIdRegex.test(staffId)) {
        return { valid: false, message: 'Invalid Staff ID format (STAFF-XXXXX)' };
    }
    
    // Validate password
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }
    
    // Validate role
    const validRoles = ['driver', 'conductor', 'admin', 'manager', 'support', 'supervisor'];
    if (!validRoles.includes(role)) {
        return { valid: false, message: 'Please select a valid role' };
    }
    
    // Validate station/bus
    if (!station) {
        return { valid: false, message: 'Please select a station or bus' };
    }
    
    return { valid: true };
}

// Get staff permissions based on role
function getStaffPermissions(role) {
    const permissions = {
        driver: [
            'validate_tickets',
            'start_trip',
            'end_trip',
            'view_schedule',
            'report_issues'
        ],
        conductor: [
            'validate_tickets',
            'sell_tickets',
            'manage_passengers',
            'collect_fares',
            'report_issues'
        ],
        admin: [
            'all_permissions',
            'manage_staff',
            'view_reports',
            'manage_buses',
            'manage_routes',
            'system_settings'
        ],
        manager: [
            'view_reports',
            'manage_staff',
            'manage_buses',
            'approve_requests',
            'financial_reports'
        ],
        support: [
            'view_tickets',
            'assist_passengers',
            'handle_complaints',
            'issue_refunds'
        ],
        supervisor: [
            'monitor_operations',
            'approve_schedule',
            'manage_drivers',
            'view_all_reports'
        ]
    };
    
    return permissions[role] || [];
}

// Get current shift
function getCurrentShift() {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
}

// Handle staff login form submission
function handleStaffLoginSubmit(e) {
    e.preventDefault();
    
    const staffId = document.getElementById('staffId').value.trim();
    const password = document.getElementById('staffPassword').value;
    const role = document.getElementById('staffRole').value;
    const station = document.getElementById('station').value;
    const pin = document.getElementById('pin').value;
    const rememberDevice = document.getElementById('rememberDevice')?.checked || false;
    
    // Validate credentials
    const validation = validateStaffCredentials(staffId, password, role, station);
    if (!validation.valid) {
        showToast(validation.message, 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-staff-login');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    
    btnText.style.display = 'none';
    spinner.style.display = 'block';
    submitBtn.disabled = true;
    
    // Get registered staff from localStorage
    const registeredStaff = JSON.parse(localStorage.getItem('registeredStaff') || '[]');
    
    // Check if staff exists
    const staff = registeredStaff.find(s => 
        s.staffId === staffId && s.password === password
    );
    
    // Simulate API delay
    setTimeout(() => {
        // Reset button state
        btnText.style.display = 'flex';
        spinner.style.display = 'none';
        submitBtn.disabled = false;
        
        if (staff) {
            // Successful login for registered staff
            completeStaffLogin(staff, role, station, pin, rememberDevice);
            
        } else {
            // Check demo staff accounts
            const demoStaff = {
                'STAFF-00123': { password: 'driver123', name: 'Driver James', permissions: ['driver'] },
                'STAFF-00456': { password: 'conductor123', name: 'Conductor Sarah', permissions: ['conductor'] },
                'STAFF-00001': { password: 'admin123', name: 'Admin Manager', permissions: ['admin'] },
                'STAFF-DRIVER': { password: 'driver123', name: 'Demo Driver', permissions: ['driver'] },
                'STAFF-CONDUCTOR': { password: 'conductor123', name: 'Demo Conductor', permissions: ['conductor'] },
                'STAFF-ADMIN': { password: 'admin123', name: 'Demo Admin', permissions: ['admin'] }
            };
            
            if (demoStaff[staffId] && demoStaff[staffId].password === password) {
                // Demo staff login
                const demoStaffData = {
                    staffId: staffId,
                    name: demoStaff[staffId].name,
                    role: role,
                    station: station,
                    permissions: getStaffPermissions(role),
                    shift: getCurrentShift(),
                    loginTime: new Date().toISOString(),
                    isDemo: true
                };
                
                completeStaffLogin(demoStaffData, role, station, pin, rememberDevice);
                
            } else {
                // Invalid credentials
                showToast('Invalid staff credentials. Please try again.', 'error');
            }
        }
    }, 1500);
}

// Complete staff login process
function completeStaffLogin(staffData, role, station, pin, rememberDevice) {
    // Add additional data to staff object
    const staffSession = {
        ...staffData,
        role: role,
        station: station,
        permissions: getStaffPermissions(role),
        shift: getCurrentShift(),
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        quickPin: pin || null
    };
    
    // Save session
    localStorage.setItem('currentStaff', JSON.stringify(staffSession));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'staff');
    
    if (rememberDevice) {
        localStorage.setItem('rememberDevice', 'true');
        localStorage.setItem('lastStaffId', staffData.staffId);
    }
    
    // Save PIN if provided (in real app, this should be encrypted)
    if (pin) {
        localStorage.setItem('staffQuickPin', pin);
    }
    
    // Show success message
    const roleNames = {
        driver: 'Driver',
        conductor: 'Conductor',
        admin: 'Administrator',
        manager: 'Manager',
        support: 'Support Staff',
        supervisor: 'Supervisor'
    };
    
    showToast(`Welcome ${roleNames[role]}! Redirecting to dashboard...`, 'success');
    
    // Log login event
    logStaffActivity('login', { staffId: staffData.staffId, role: role, station: station });
    
    // Redirect to staff dashboard
    setTimeout(() => {
        window.location.href = 'staff-dashboard.html';
    }, 1000);
}

// Log staff activity
function logStaffActivity(action, details) {
    const activities = JSON.parse(localStorage.getItem('staffActivities') || '[]');
    
    const activity = {
        action: action,
        details: details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    activities.push(activity);
    localStorage.setItem('staffActivities', JSON.stringify(activities));
}

// Check if staff is already logged in
function checkStaffAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const currentStaff = localStorage.getItem('currentStaff');
    
    // If on staff login page but already logged in as staff, redirect to dashboard
    if (isLoggedIn === 'true' && userRole === 'staff' && currentStaff) {
        const currentPage = window.location.pathname;
        if (currentPage.includes('staff-login')) {
            showToast('You are already logged in!', 'info');
            setTimeout(() => {
                window.location.href = 'staff-dashboard.html';
            }, 1500);
        }
    }
    
    // If on staff dashboard but not logged in, redirect to login
    if (!isLoggedIn && window.location.pathname.includes('staff-dashboard')) {
        window.location.href = 'staff-login.html';
    }
}

// Setup event listeners for staff page
function setupStaffPage() {
    // Check auth status
    checkStaffAuth();
    
    // Set up form submission
    const staffLoginForm = document.getElementById('staffLoginForm');
    if (staffLoginForm) {
        staffLoginForm.addEventListener('submit', handleStaffLoginSubmit);
    }
    
    // Set up PIN input formatting
    const pinInput = document.getElementById('pin');
    if (pinInput) {
        pinInput.addEventListener('input', function(e) {
            // Allow only numbers
            this.value = this.value.replace(/\D/g, '');
            
            // Auto-format as user types
            if (this.value.length > 4) {
                this.value = this.value.slice(0, 4);
            }
        });
    }
    
    // Load last staff ID if remember device was checked
    const lastStaffId = localStorage.getItem('lastStaffId');
    const rememberDevice = localStorage.getItem('rememberDevice');
    
    if (lastStaffId && rememberDevice === 'true') {
        document.getElementById('staffId').value = lastStaffId;
        document.getElementById('rememberDevice').checked = true;
    }
    
    // Set up modal close handlers
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('staffForgotPasswordModal');
        if (modal && e.target === modal) {
            closeStaffForgotPasswordModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeStaffForgotPasswordModal();
        }
    });
}

// Initialize staff page
document.addEventListener('DOMContentLoaded', setupStaffPage);