// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Tab switching between Login and Register
function switchTab(tab) {
    console.log('Switching to tab:', tab);
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (tab === 'login') {
        document.getElementById('loginTab').classList.add('active');
    } else {
        document.getElementById('registerTab').classList.add('active');
    }
    
    // Show/hide forms
    document.querySelectorAll('.auth-form-container').forEach(form => {
        form.classList.remove('active');
    });
    
    if (tab === 'login') {
        document.getElementById('loginForm').classList.add('active');
        
        // Load saved phone if exists
        const savedPhone = localStorage.getItem('savedPhone');
        if (savedPhone) {
            document.getElementById('loginPhone').value = savedPhone;
        }
    } else {
        document.getElementById('registerForm').classList.add('active');
        
        // Clear registration form
        document.getElementById('registerForm').reset();
        resetPasswordStrength();
    }
    
    // Clear any error messages
    clearFormErrors();
}

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

// Fill demo credentials
function fillDemo(type) {
    if (type === 'passenger') {
        document.getElementById('loginPhone').value = '0788123456';
        document.getElementById('loginPassword').value = '123456';
        showToast('Demo passenger credentials filled!', 'success');
    } else if (type === 'admin') {
        document.getElementById('loginPhone').value = '0788234567';
        document.getElementById('loginPassword').value = 'admin123';
        showToast('Demo admin credentials filled!', 'success');
    }
}

// Show forgot password modal
function showForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'flex';
    document.getElementById('resetPhone').focus();
}

// Close modal
function closeModal() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    document.getElementById('resetPhone').value = '';
}

// Send reset code
function sendResetCode() {
    const phone = document.getElementById('resetPhone').value.trim();
    
    if (!phone) {
        showToast('Please enter your phone number', 'error');
        return;
    }
    
    // Validate phone format
    const phoneRegex = /^\+250[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        showToast('Please enter a valid Rwandan phone number (+250XXXXXXXXX)', 'error');
        return;
    }
    
    // Show loading
    const sendBtn = document.querySelector('#forgotPasswordModal .btn-primary');
    const originalText = sendBtn.innerHTML;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        sendBtn.innerHTML = originalText;
        sendBtn.disabled = false;
        
        // Close modal
        closeModal();
        
        // Show success message
        showToast(`Reset code sent to ${phone}. Check your SMS.`, 'success');
        
        // In a real app, you would redirect to reset password page
        console.log('Reset code sent to:', phone);
        // window.location.href = 'reset-password.html?phone=' + encodeURIComponent(phone);
    }, 2000);
}

// Show terms and conditions
function showTerms() {
    const termsContent = `
        <h3>Terms & Conditions</h3>
        <div style="max-height: 300px; overflow-y: auto; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 10px 0;">
            <h4>1. Acceptance of Terms</h4>
            <p>By using TegaSmart, you agree to these terms and conditions.</p>
            
            <h4>2. Account Registration</h4>
            <p>You must provide accurate information when creating an account.</p>
            
            <h4>3. Ticket Purchase</h4>
            <p>Tickets are non-refundable except in exceptional circumstances.</p>
            
            <h4>4. Privacy</h4>
            <p>We protect your personal information as per our privacy policy.</p>
            
            <h4>5. Prohibited Activities</h4>
            <p>You may not misuse the service or attempt to hack the system.</p>
            
            <h4>6. Limitation of Liability</h4>
            <p>TegaSmart is not liable for delays or service interruptions.</p>
            
            <h4>7. Changes to Terms</h4>
            <p>We may update these terms at any time.</p>
        </div>
    `;
    
    showModal('Terms & Conditions', termsContent);
}

// Show privacy policy
function showPrivacy() {
    const privacyContent = `
        <h3>Privacy Policy</h3>
        <div style="max-height: 300px; overflow-y: auto; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 10px 0;">
            <h4>1. Information We Collect</h4>
            <p>We collect phone numbers, names, and travel history to provide our service.</p>
            
            <h4>2. How We Use Your Information</h4>
            <p>Your information is used for ticket processing, account management, and service improvement.</p>
            
            <h4>3. Data Security</h4>
            <p>We implement industry-standard security measures to protect your data.</p>
            
            <h4>4. Third-Party Services</h4>
            <p>We use MTN MoMo for payments and follow their privacy standards.</p>
            
            <h4>5. Your Rights</h4>
            <p>You can request to view, update, or delete your personal information.</p>
            
            <h4>6. Data Retention</h4>
            <p>We retain your data as long as your account is active or as required by law.</p>
            
            <h4>7. Contact Us</h4>
            <p>For privacy concerns, contact: privacy@tegasmart.rw</p>
        </div>
    `;
    
    showModal('Privacy Policy', privacyContent);
}

// Login with MTN MoMo
function loginWithMoMo() {
    const phone = prompt('Enter your MTN MoMo number (+250):', '+250');
    
    if (!phone) {
        showToast('Login cancelled', 'info');
        return;
    }
    
    // Validate phone
    const phoneRegex = /^\+250[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        showToast('Please enter a valid MTN Rwanda number (+250XXXXXXXXX)', 'error');
        return;
    }
    
    // Show loading
    const originalHTML = document.querySelector('.social-btn.momo').innerHTML;
    document.querySelector('.social-btn.momo').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    
    // Simulate MoMo authentication
    setTimeout(() => {
        // Reset button
        document.querySelector('.social-btn.momo').innerHTML = originalHTML;
        
        // Create mock user
        const user = {
            phone: phone,
            name: 'MoMo User',
            email: 'momo@example.com',
            balance: Math.floor(Math.random() * 50000) + 10000,
            role: 'passenger',
            cardId: 'RFID-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            registeredAt: new Date().toISOString(),
            authMethod: 'momo'
        };
        
        // Save user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'passenger');
        
        showToast('Login successful via MTN MoMo!', 'success');
        
        // Redirect to dashboard after delay
        setTimeout(() => {
            window.location.href = 'client-dashboard.html';
        }, 1500);
    }, 3000);
}

// Login with Google
function loginWithGoogle() {
    // Show loading
    const originalHTML = document.querySelector('.social-btn.google').innerHTML;
    document.querySelector('.social-btn.google').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    
    // Simulate Google OAuth
    setTimeout(() => {
        // Reset button
        document.querySelector('.social-btn.google').innerHTML = originalHTML;
        
        // Mock Google user data
        const user = {
            email: 'user@gmail.com',
            name: 'Google User',
            phone: '+250788000000',
            balance: 0,
            role: 'passenger',
            cardId: 'RFID-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            registeredAt: new Date().toISOString(),
            authMethod: 'google'
        };
        
        // Save session
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'passenger');
        
        showToast('Login successful via Google!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'client-dashboard.html';
        }, 1500);
    }, 2000);
}

// ============================================
// FORM VALIDATION FUNCTIONS
// ============================================

// Clear form errors
function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.form-group').forEach(el => {
        el.classList.remove('error');
        el.classList.remove('success');
    });
}

// Show error message
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Add error class
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    formGroup.appendChild(errorDiv);
    
    // Focus on input
    input.focus();
}

// Show success state
function showSuccess(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    // Remove error message if exists
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
}

// Validate phone number (Rwandan format)
function validatePhone(phone) {
    if (!phone) return false;
    
    // Remove any spaces or special characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid Rwandan number
    const rwandaRegex = /^(78|79|72|73)[0-9]{7}$/;
    return rwandaRegex.test(cleanPhone);
}

// Validate email
function validateEmail(email) {
    if (!email) return true; // Email is optional
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check password strength
function checkPasswordStrength(password) {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength++; // Uppercase
    if (/[a-z]/.test(password)) strength++; // Lowercase
    if (/[0-9]/.test(password)) strength++; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength++; // Special chars
    
    return strength;
}

// Update password strength UI
function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    const strength = checkPasswordStrength(password);
    let width = 0;
    let color = '#ef4444'; // red
    let text = 'Weak';
    
    if (strength >= 4) {
        width = 100;
        color = '#10b981'; // green
        text = 'Strong';
    } else if (strength >= 2) {
        width = 66;
        color = '#f59e0b'; // amber
        text = 'Medium';
    } else if (strength >= 1) {
        width = 33;
        text = 'Weak';
    }
    
    strengthBar.style.width = `${width}%`;
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `Password strength: ${text}`;
    strengthText.style.color = color;
}

// Reset password strength display
function resetPasswordStrength() {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (strengthBar && strengthText) {
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Password strength: Weak';
        strengthText.style.color = '#64748b';
    }
}

// Check if passwords match
function checkPasswordMatch() {
    const password = document.getElementById('registerPassword');
    const confirm = document.getElementById('confirmPassword');
    const hint = document.getElementById('passwordMatch');
    
    if (!password || !confirm || !hint) return;
    
    if (confirm.value === '') {
        hint.textContent = '';
        hint.style.color = '';
    } else if (password.value === confirm.value) {
        hint.textContent = '✓ Passwords match';
        hint.style.color = '#10b981';
    } else {
        hint.textContent = '✗ Passwords do not match';
        hint.style.color = '#ef4444';
    }
}

// ============================================
// FORM SUBMISSION HANDLERS
// ============================================

// Handle login form submission
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate phone
    if (!validatePhone(phone)) {
        showError('loginPhone', 'Please enter a valid MTN Rwanda number (78/79/72/73) followed by 7 digits');
        return;
    }
    
    // Validate password
    if (password.length < 6) {
        showError('loginPassword', 'Password must be at least 6 characters');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-login');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    
    btnText.style.display = 'none';
    spinner.style.display = 'block';
    submitBtn.disabled = true;
    
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const fullPhone = '+250' + phone;
    
    // Check if user exists
    const user = registeredUsers.find(u => u.phone === fullPhone && u.password === password);
    
    // Simulate API delay
    setTimeout(() => {
        // Reset button state
        btnText.style.display = 'flex';
        spinner.style.display = 'none';
        submitBtn.disabled = false;
        
        if (user) {
            // Successful login
            showSuccess('loginPhone');
            showSuccess('loginPassword');
            
            // Save session (remove password for security)
            const { password: _, ...userWithoutPassword } = user;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'passenger');
            
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('savedPhone', phone);
            }
            
            showToast('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'client-dashboard.html';
            }, 1000);
            
        } else {
            // Check demo accounts
            const demoAccounts = {
                '0788123456': { password: '123456', name: 'John Doe', balance: 15000 },
                '0788234567': { password: 'admin123', name: 'Admin User', balance: 50000 }
            };
            
            if (demoAccounts[phone] && demoAccounts[phone].password === password) {
                // Demo account login
                const demoUser = {
                    phone: fullPhone,
                    name: demoAccounts[phone].name,
                    balance: demoAccounts[phone].balance,
                    role: 'passenger',
                    cardId: 'RFID-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
                    registeredAt: new Date().toISOString(),
                    isDemo: true
                };
                
                localStorage.setItem('currentUser', JSON.stringify(demoUser));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'passenger');
                
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('savedPhone', phone);
                }
                
                showToast('Demo login successful!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'client-dashboard.html';
                }, 1000);
                
            } else {
                // Invalid credentials
                showError('loginPassword', 'Invalid phone number or password');
                showToast('Login failed. Please check your credentials.', 'error');
            }
        }
    }, 1500);
}

// Handle registration form submission
function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms')?.checked || false;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate full name
    if (!fullName || fullName.length < 2) {
        showError('fullName', 'Please enter your full name (at least 2 characters)');
        return;
    }
    
    // Validate phone
    if (!validatePhone(phone)) {
        showError('registerPhone', 'Please enter a valid MTN Rwanda number (78/79/72/73) followed by 7 digits');
        return;
    }
    
    // Validate email (optional)
    if (email && !validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        return;
    }
    
    // Validate password
    if (password.length < 6) {
        showError('registerPassword', 'Password must be at least 6 characters');
        return;
    }
    
    if (checkPasswordStrength(password) < 2) {
        showError('registerPassword', 'Password is too weak. Add uppercase letters, numbers, or special characters');
        return;
    }
    
    // Check password match
    if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        return;
    }
    
    // Check terms acceptance
    if (!termsAccepted) {
        showToast('Please accept the Terms & Conditions', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-register');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    
    btnText.style.display = 'none';
    spinner.style.display = 'block';
    submitBtn.disabled = true;
    
    // Get existing users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const fullPhone = '+250' + phone;
    
    // Check if user already exists
    const userExists = registeredUsers.some(u => u.phone === fullPhone);
    
    if (userExists) {
        // Reset button
        btnText.style.display = 'flex';
        spinner.style.display = 'none';
        submitBtn.disabled = false;
        
        showError('registerPhone', 'An account with this phone number already exists');
        showToast('User already registered. Please login instead.', 'error');
        return;
    }
    
    // Create new user object
    const newUser = {
        id: 'USER-' + Date.now(),
        fullName: fullName,
        phone: fullPhone,
        email: email || null,
        password: password, // In production, this should be hashed
        balance: 0,
        role: 'passenger',
        cardId: 'RFID-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        registeredAt: new Date().toISOString(),
        status: 'active',
        tickets: []
    };
    
    // Simulate API delay
    setTimeout(() => {
        // Add user to registered users
        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // Auto-login after registration
        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'passenger');
        localStorage.setItem('newRegistration', 'true');
        
        // Reset button
        btnText.style.display = 'flex';
        spinner.style.display = 'none';
        submitBtn.disabled = false;
        
        // Show success message
        const successMessage = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; color: #10b981; margin-bottom: 15px;">✓</div>
                <h3 style="color: #1e293b; margin-bottom: 10px;">Registration Successful!</h3>
                <p style="color: #475569; margin-bottom: 20px;">
                    Welcome to TegaSmart, ${fullName}!<br>
                    Your RFID Card ID: <strong>${newUser.cardId}</strong>
                </p>
                <p style="color: #64748b; font-size: 14px;">
                    Please remember your card ID for bus boarding.
                </p>
            </div>
        `;
        
        showModal('Welcome to TegaSmart!', successMessage);
        
        // Redirect after modal is closed
        setTimeout(() => {
            window.location.href = 'client-dashboard.html';
        }, 3000);
        
    }, 2000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icons for different toast types
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : 
                     type === 'error' ? '#ef4444' : 
                     type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    // Add close button styles
    toast.querySelector('.toast-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        font-size: 14px;
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Show modal
function showModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.getElementById('customModal');
    if (existingModal) existingModal.remove();
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0;">${title}</h3>
                <button onclick="closeCustomModal()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${content}
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="closeCustomModal()" class="btn btn-primary" style="padding: 10px 30px;">
                    OK
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Close custom modal
function closeCustomModal() {
    const modal = document.getElementById('customModal');
    if (modal) modal.remove();
}

// Check if user is already logged in
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    // If user is already logged in as passenger, redirect to dashboard
    if (isLoggedIn === 'true' && userRole === 'passenger') {
        const currentPage = window.location.pathname;
        if (currentPage.includes('login') || currentPage.includes('register')) {
            showToast('You are already logged in!', 'info');
            setTimeout(() => {
                window.location.href = 'client-dashboard.html';
            }, 1500);
        }
    }
}

// Initialize page
function initPage() {
    console.log('Initializing authentication page...');
    
    // Check auth status
    checkAuthStatus();
    
    // Set up form event listeners
    const loginForm = document.getElementById('clientLoginForm');
    const registerForm = document.getElementById('clientRegisterForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
    
    // Set up real-time validation for registration form
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (registerPassword) {
        registerPassword.addEventListener('input', function() {
            updatePasswordStrength(this.value);
            checkPasswordMatch();
        });
    }
    
    if (confirmPassword) {
        confirmPassword.addEventListener('input', checkPasswordMatch);
    }
    
    // Set up phone input formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Allow only numbers
            this.value = this.value.replace(/\D/g, '');
            
            // Auto-format as user types
            if (this.value.length > 9) {
                this.value = this.value.slice(0, 9);
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('forgotPasswordModal');
        if (modal && e.target === modal) {
            closeModal();
        }
        
        const customModal = document.getElementById('customModal');
        if (customModal && e.target === customModal) {
            closeCustomModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            closeCustomModal();
        }
    });
    
    // Load saved phone if remember me was checked
    const savedPhone = localStorage.getItem('savedPhone');
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (savedPhone && rememberMe === 'true') {
        document.getElementById('loginPhone').value = savedPhone;
        document.getElementById('rememberMe').checked = true;
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Page initialization complete');
}

// ============================================
// PAGE LOAD EVENT
// ============================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);

// Also initialize when window loads (fallback)
window.addEventListener('load', function() {
    // Double-check initialization
    if (!document.querySelector('.auth-form')) {
        setTimeout(initPage, 100);
    }
});