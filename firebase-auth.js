// Firebase Authentication Service
class FirebaseAuthService {
    constructor() {
        this.auth = window.auth;
        this.currentUser = null;
        this.setupAuthStateListener();
    }

    // Setup authentication state listener
    setupAuthStateListener() {
        this.auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            this.updateUIForAuthState(user);
        });
    }

    // Update UI based on authentication state
    updateUIForAuthState(user) {
        const signInBtn = document.querySelector('.signin-btn');
        const signOutBtn = document.querySelector('.signout-btn');
        const signInModal = document.getElementById('signInModal');
        const cartModal = document.getElementById('cartModal');
        
        // Preserve cart modal state
        const wasCartOpen = cartModal && cartModal.style.display === 'block';
        
        if (user) {
            // User is signed in
            const displayName = user.displayName || user.email.split('@')[0];
            signInBtn.textContent = `Welcome, ${displayName}`;
            signInBtn.onclick = null; // Remove click handler
            signInBtn.style.cursor = 'default';
            signOutBtn.style.display = 'flex';
            signInModal.style.display = 'none';
            
            // Restore cart modal if it was open
            if (wasCartOpen && cartModal) {
                cartModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                document.body.style.overflowY = 'scroll';
                // Reload cart data for the authenticated user
                if (typeof loadCart === 'function') {
                    setTimeout(() => loadCart(), 100);
                }
            } else {
                // Ensure scrolling is enabled if cart is not open
                document.body.style.overflow = '';
                document.body.style.overflowX = '';
                document.body.style.overflowY = 'scroll';
            }
            
            // Show welcome notification
            this.showNotification(`Welcome back, ${displayName}!`, 'success');
            
            // Ensure scrolling is enabled after sign in
            setTimeout(() => {
                if (typeof forceEnableScrolling === 'function') {
                    forceEnableScrolling();
                }
            }, 500);
        } else {
            // User is signed out
            signInBtn.textContent = 'Sign In';
            signInBtn.onclick = () => openSignIn();
            signInBtn.style.cursor = 'pointer';
            signOutBtn.style.display = 'none';
            
            // Restore cart modal if it was open
            if (wasCartOpen && cartModal) {
                cartModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                document.body.style.overflowY = 'scroll';
                // Reload cart data for the unauthenticated user
                if (typeof loadCart === 'function') {
                    setTimeout(() => loadCart(), 100);
                }
            } else {
                // Ensure scrolling is enabled if cart is not open
                document.body.style.overflow = '';
                document.body.style.overflowX = '';
                document.body.style.overflowY = 'scroll';
            }
            
            // Ensure page styling is maintained
            this.ensurePageStyling();
            
            // Ensure scrolling is enabled after sign out
            setTimeout(() => {
                if (typeof forceEnableScrolling === 'function') {
                    forceEnableScrolling();
                }
            }, 500);
        }
    }
    
    // Ensure page styling is maintained after sign out
    ensurePageStyling() {
        // Force re-application of critical styles
        document.body.style.fontFamily = "'Poppins', 'Arial', sans-serif";
        document.body.style.backgroundColor = "#fff";
        
        // Always ensure scrolling is enabled with visible scrollbar
        document.body.style.overflow = '';
        document.body.style.overflowX = '';
        document.body.style.overflowY = 'scroll';
        
        // Ensure navigation is visible
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.background = "rgba(255, 255, 255, 0.95)";
            navbar.style.backdropFilter = "blur(10px)";
        }
        
        // Ensure sections have proper backgrounds
        const sections = document.querySelectorAll('.hero, .products, .about, .contact, .footer');
        sections.forEach(section => {
            if (section.classList.contains('hero')) {
                section.style.background = "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)";
            } else if (section.classList.contains('about')) {
                section.style.background = "#f8f9fa";
            } else if (section.classList.contains('footer')) {
                section.style.background = "#2c3e50";
                section.style.color = "#fff";
            } else {
                section.style.background = "#fff";
            }
        });
    }

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            this.showNotification('Successfully signed in!', 'success');
            return userCredential.user;
        } catch (error) {
            this.showNotification(this.getErrorMessage(error), 'error');
            throw error;
        }
    }

    // Sign up with email and password
    async signUp(email, password, displayName) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            
            // Update user profile with display name
            await userCredential.user.updateProfile({
                displayName: displayName
            });
            
            this.showNotification('Account created successfully!', 'success');
            return userCredential.user;
        } catch (error) {
            this.showNotification(this.getErrorMessage(error), 'error');
            throw error;
        }
    }

    // Sign out
    async signOut() {
        try {
            await this.auth.signOut();
            this.showNotification('Signed out successfully!', 'info');
            
            // Ensure page styling is maintained after sign out
            setTimeout(() => {
                this.ensurePageStyling();
            }, 100);
            
        } catch (error) {
            this.showNotification(this.getErrorMessage(error), 'error');
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get error message from Firebase error
    getErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'No account found with this email address.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            default:
                return error.message;
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4caf50, #45a049)' : 
                         type === 'error' ? 'linear-gradient(135deg, #f44336, #d32f2f)' :
                         'linear-gradient(135deg, #2196f3, #1976d2)'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize Firebase Auth Service
let firebaseAuth;
try {
    firebaseAuth = new FirebaseAuthService();
    window.firebaseAuth = firebaseAuth;
    console.log('Firebase Auth Service initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase Auth Service:', error);
    window.firebaseAuth = null;
}

// Global sign out function for HTML onclick
function signOut() {
    if (window.firebaseAuth) {
        window.firebaseAuth.signOut();
    }
}

// Make loadCart globally accessible (will be set by script.js)
window.loadCart = window.loadCart || function() {
    console.log('loadCart function not yet available');
}; 