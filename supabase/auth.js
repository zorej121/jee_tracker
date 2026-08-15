// ============================================
// SUPABASE AUTHENTICATION & SYNC
// ============================================

// State
let currentUser = null;
let currentUserId = null;
let syncEnabled = false;
let syncInProgress = false;

console.log('✅ auth.js loaded');

// ============================================
// AUTH FUNCTIONS
// ============================================

// Sign Up
async function signUp(email, password) {
    console.log('📝 SignUp called with:', email);
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: 'https://zorej121.github.io/jee_tracker/'
            }
        });
        
        if (error) {
            console.error('❌ SignUp error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ SignUp success:', data);
        
        if (!data.user) {
            return {
                success: false,
                error: 'Signup failed - no user returned'
            };
        }
        
        // Email verification is required.
        // Don't create/save app data until the user verifies the email.
        if (!data.session) {
            console.log('📧 Verification required. Waiting for email confirmation.');
            
            localStorage.setItem('jeeUserEmail', email);
            
            return {
                success: true,
                user: data.user,
                verificationRequired: true
            };
        }
        
        // If email verification is disabled and a session exists,
        // initialize the user's data immediately.
        currentUser = data.user;
        currentUserId = data.user.id;
        localStorage.setItem('jeeUserEmail', email);
        
        const emptyData = getEmptyData();
        const saved = await saveUserData(currentUserId, emptyData);
        
        if (!saved) {
            return {
                success: false,
                error: 'Failed to save initial data'
            };
        }
        
        appData = emptyData;
        window.appData = appData;
        
        if (typeof saveData === 'function') {
            saveData();
        }
        
        syncEnabled = true;
        
        return {
            success: true,
            user: data.user,
            verificationRequired: false
        };
        
    } catch (error) {
        console.error('❌ SignUp exception:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Login
async function login(email, password) {
    console.log('🔑 Login called with:', email);
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            console.error('❌ Login error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ Login success:', data);
        
        if (data.user) {
            currentUser = data.user;
            currentUserId = data.user.id;
            localStorage.setItem('jeeUserEmail', email);
            
            // Load user data from Supabase
            const loaded = await loadUserData(currentUserId);
            
            if (loaded) {
                // CRITICAL FIX: Update both appData and window.appData
                appData = (typeof ensureDataDefaults === 'function') ? ensureDataDefaults(loaded) : loaded;
                window.appData = appData;
                if (typeof saveData === 'function') {
                    saveData();
                }
                syncEnabled = true;
                if (typeof showToast === 'function') {
                    showToast('👋 Welcome back!', 'success');
                }
                return { success: true, user: data.user };
            } else {
                // No data found, create new
                const emptyData = getEmptyData();
                // CRITICAL FIX: Update both appData and window.appData
                appData = emptyData;
                window.appData = appData;
                if (typeof saveData === 'function') {
                    saveData();
                }
                await saveUserData(currentUserId, emptyData);
                syncEnabled = true;
                return { success: true, user: data.user };
            }
        }
        return { success: false, error: 'Login failed' };
    } catch (error) {
        console.error('❌ Login exception:', error);
        return { success: false, error: error.message };
    }
}

// Logout
async function logout() {
    console.log('🚪 Logout called');
    
    try {
        await supabase.auth.signOut();
        currentUser = null;
        currentUserId = null;
        syncEnabled = false;
        localStorage.removeItem('jeeUserEmail');
        if (typeof showToast === 'function') {
            showToast('👋 Logged out', 'info');
        }
        return { success: true };
    } catch (error) {
        console.error('❌ Logout error:', error);
        return { success: false, error: error.message };
    }
}

// Check auth status
async function checkAuth() {
    console.log('🔍 Checking auth...');
    
    try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('❌ Check auth error:', error);
            return { success: false };
        }
        
        if (data.session) {
            console.log('✅ Session found:', data.session.user.email);
            
            currentUser = data.session.user;
            currentUserId = data.session.user.id;
            localStorage.setItem('jeeUserEmail', data.session.user.email);
            
            // Load user data
            const loaded = await loadUserData(currentUserId);
            
            if (loaded) {
                // CRITICAL FIX: Update both appData and window.appData
                appData = (typeof ensureDataDefaults === 'function') ? ensureDataDefaults(loaded) : loaded;
                window.appData = appData;
                if (typeof saveData === 'function') {
                    saveData();
                }
                syncEnabled = true;
                return { success: true, user: data.session.user };
            } else {
                // No data found, create new
                const emptyData = getEmptyData();
                // CRITICAL FIX: Update both appData and window.appData
                appData = emptyData;
                window.appData = appData;
                if (typeof saveData === 'function') {
                    saveData();
                }
                await saveUserData(currentUserId, emptyData);
                syncEnabled = true;
                return { success: true, user: data.session.user };
            }
        } else {
            console.log('❌ No session found');
            syncEnabled = false;
            return { success: false };
        }
    } catch (error) {
        console.error('❌ Check auth exception:', error);
        syncEnabled = false;
        return { success: false, error: error.message };
    }
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Get current user ID
function getCurrentUserId() {
    return currentUserId;
}

// ============================================
// DATA FUNCTIONS
// ============================================

// Get empty data structure
function getEmptyData() {
    console.log('📦 Creating empty data structure');
    
    return {
        subjects: {
            physics: {
                name: 'Physics',
                color: '#667eea',
                icon: 'fa-atom',
                chapters: {},
                pinned: []
            },
            mathematics: {
                name: 'Mathematics',
                color: '#8b5cf6',
                icon: 'fa-calculator',
                chapters: {},
                pinned: []
            },
            'inorganic-chemistry': {
                name: 'Inorganic Chemistry',
                color: '#10b981',
                icon: 'fa-flask',
                chapters: {},
                pinned: []
            },
            'organic-chemistry': {
                name: 'Organic Chemistry',
                color: '#f59e0b',
                icon: 'fa-vial',
                chapters: {},
                pinned: []
            },
            'physical-chemistry': {
                name: 'Physical Chemistry',
                color: '#ef4444',
                icon: 'fa-microscope',
                chapters: {},
                pinned: []
            }
        },
        continueStudying: {
            subject: null,
            chapter: null,
            exercise: null,
            question: null
        },
        streak: {
            current: 0,
            longest: 0,
            lastDate: null,
            todaySolved: 0
        },
        joinDate: new Date().toISOString().split('T')[0],
        questionNotes: {},
        questionDifficulty: {},
        questionRevision: {},
        homework: [],
        revisionLists: [],
        goals: {
            daily: 50,
            weekly: 350,
            monthly: 1500,
            dailyProgress: {},
            weeklyProgress: {},
            monthlyProgress: {}
        },
        chapterStatus: {},
        lastBackup: null,
        examMode: false,
        achievements: {
            unlocked: []
        },
        heatmap: {},
        questionHistory: {},
        profile: {
            name: '',
            username: '',
            phone: '',
            class: '',
            targetExam: 'JEE Main 2026',
            coaching: '',
            dailyGoal: 50,
            avatarUrl: ''
        }
    };
}

// Load user data from Supabase
async function loadUserData(userId) {
    console.log('📥 Loading user data for:', userId);
    
    try {
        const { data, error } = await supabase
            .from('user_data')
            .select('app_data')
            .eq('user_id', userId)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                console.log('ℹ️ No data found for user');
                return null;
            }
            console.error('❌ Load data error:', error);
            throw error;
        }
        
        if (data && data.app_data) {
            console.log('✅ Data loaded successfully');
            return data.app_data;
        }
        
        return null;
    } catch (error) {
        console.error('❌ Load data exception:', error);
        return null;
    }
}

// Save user data to Supabase
async function saveUserData(userId, data) {
    console.log('💾 Saving user data for:', userId);
    
    try {
        // Check if user has existing data
        const { data: existing, error: checkError } = await supabase
            .from('user_data')
            .select('id')
            .eq('user_id', userId)
            .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
            console.error('❌ Check error:', checkError);
            throw checkError;
        }
        
        if (existing) {
            console.log('📝 Updating existing record');
            
            // Update existing record
            const { error } = await supabase
                .from('user_data')
                .update({ app_data: data })
                .eq('user_id', userId);
            
            if (error) throw error;
        } else {
            console.log('📝 Inserting new record');
            
            // Insert new record
            const { error } = await supabase
                .from('user_data')
                .insert({
                    user_id: userId,
                    app_data: data
                });
            
            if (error) throw error;
        }
        
        console.log('✅ Data saved successfully');
        return true;
    } catch (error) {
        console.error('❌ Save data error:', error);
        return false;
    }
}

// Sync current appData to Supabase
async function syncToSupabase() {
    if (!syncEnabled || !currentUserId || syncInProgress) {
        console.log('⏭️ Sync skipped:', { syncEnabled, currentUserId, syncInProgress });
        return false;
    }
    
    console.log('🔄 Syncing to Supabase...');
    syncInProgress = true;
    
    try {
        // Use window.appData or appData - they should be the same now
        const dataToSync = window.appData || appData;
        const result = await saveUserData(currentUserId, dataToSync);
        
        if (result) {
            if (window.appData) {
                window.appData.lastBackup = new Date().toISOString();
            }
            if (typeof appData !== 'undefined') {
                appData.lastBackup = new Date().toISOString();
            }
            localStorage.setItem('jeeTrackerData', JSON.stringify(window.appData || appData));
            console.log('✅ Sync complete');
        }
        
        syncInProgress = false;
        return result;
    } catch (error) {
        console.error('❌ Sync error:', error);
        syncInProgress = false;
        return false;
    }
}

// ============================================
// UI FUNCTIONS
// ============================================

// Show auth screen
function showAuthScreen() {
    console.log('📱 Showing auth screen');
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (authScreen) authScreen.style.display = 'flex';
    if (appContainer) appContainer.classList.add('hidden');
}

// Show app screen
function showAppScreen() {
    console.log('📱 Showing app screen');
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (authScreen) authScreen.style.display = 'none';
    if (appContainer) appContainer.classList.remove('hidden');
}

// Show loading
function showLoading(show) {
    const loader = document.getElementById('loadingOverlay');
    if (loader) {
        loader.classList.toggle('hidden', !show);
    }
}

// ============================================
// HELPER FUNCTIONS FOR AUTH
// ============================================

function showLoginForm() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    if (signupForm) {
        // Reload to reset the form
        window.location.reload();
        return;
    }
    
    if (loginForm) {
        loginForm.classList.remove('hidden');
    }
}

async function resendVerification(email) {
    console.log('📧 Resending verification to:', email);
    
    try {
        if (typeof showToast === 'function') {
            showToast('📧 Sending verification email...', 'info');
        }
        
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: 'https://zorej121.github.io/jee_tracker/'
            }
        });
        
        if (error) throw error;
        
        if (typeof showToast === 'function') {
            showToast('✅ Verification email resent! Check your inbox.', 'success');
        }
    } catch (error) {
        console.error('❌ Resend error:', error);
        if (typeof showToast === 'function') {
            showToast('❌ Failed to resend: ' + error.message, 'error');
        }
    }
}

// ============================================
// HANDLE SIGNUP
// ============================================

async function handleSignup() {
    console.log('📝 handleSignup called');
    
    const email = document.getElementById('signupEmail');
    const password = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('signupConfirmPassword');
    
    if (!email || !password || !confirmPassword) {
        console.error('❌ Input fields not found');
        if (typeof showToast === 'function') {
            showToast('Please fill in all fields', 'error');
        }
        return;
    }
    
    const emailValue = email.value.trim();
    const passwordValue = password.value;
    const confirmValue = confirmPassword.value;
    
    console.log('📧 Email:', emailValue);
    console.log('🔑 Password length:', passwordValue.length);
    
    // Validation
    if (!emailValue || !passwordValue || !confirmValue) {
        if (typeof showToast === 'function') {
            showToast('Please fill in all fields', 'error');
        }
        return;
    }
    
    if (passwordValue !== confirmValue) {
        if (typeof showToast === 'function') {
            showToast('Passwords do not match', 'error');
        }
        return;
    }
    
    if (passwordValue.length < 6) {
        if (typeof showToast === 'function') {
            showToast('Password must be at least 6 characters', 'error');
        }
        return;
    }
    
    // Show loading
    if (typeof showLoading === 'function') {
        showLoading(true);
    }
    
    // Call signup
    const result = await signUp(emailValue, passwordValue);
    
    // Hide loading
    if (typeof showLoading === 'function') {
        showLoading(false);
    }
    
    if (result.success) {
        console.log('✅ Signup successful!');
        
        // ===== SHOW "CHECK YOUR EMAIL" MESSAGE =====
        const signupForm = document.getElementById('signupForm');
        const loginForm = document.getElementById('loginForm');
        
        if (signupForm) {
            // Replace the signup form with verification message
            signupForm.innerHTML = `
                <div class="auth-header">
                    <div class="auth-icon-wrapper" style="background: rgba(255, 255, 255, 0.05);">
                        <i class="fas fa-envelope" style="font-size: 36px; color: var(--text-primary);"></i>
                    </div>
                    <h1 style="font-size: 28px;">Check Your Email! 📧</h1>
                    <p style="font-size: 16px; color: var(--text-secondary);">
                        We've sent a verification link to:
                    </p>
                    <p style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin-top: 4px;">
                        ${emailValue}
                    </p>
                    <p style="font-size: 14px; color: var(--text-muted); margin-top: 12px; max-width: 320px; margin-left: auto; margin-right: auto;">
                        Click the link in the email to verify your account and start tracking your JEE progress!
                    </p>
                </div>
                <div class="auth-body" style="margin-top: 8px;">
                    <button onclick="showLoginForm()" class="btn-primary" style="width: 100%;">
                        <i class="fas fa-arrow-left"></i> Back to Login
                    </button>
                    <p style="text-align: center; font-size: 14px; color: var(--text-muted); margin-top: 16px;">
                        Didn't receive the email? 
                        <a href="#" onclick="resendVerification('${emailValue}')" style="color: var(--text-primary); font-weight: 600; text-decoration: none;">
                            Resend
                        </a>
                    </p>
                </div>
            `;
            
            // Hide login form if visible
            if (loginForm) loginForm.classList.add('hidden');
        }
        
        // Show toast notification too
        if (typeof showToast === 'function') {
            showToast('📧 Verification email sent! Check your inbox.', 'success');
        }
        
    } else {
        console.error('❌ Signup failed:', result.error);
        if (typeof showToast === 'function') {
            showToast(result.error || 'Signup failed', 'error');
        }
    }
}

// ============================================
// HANDLE LOGIN
// ============================================

async function handleLogin() {
    console.log('🔑 handleLogin called');
    
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    
    if (!email || !password) {
        console.error('❌ Input fields not found');
        if (typeof showToast === 'function') {
            showToast('Please fill in all fields', 'error');
        }
        return;
    }
    
    const emailValue = email.value.trim();
    const passwordValue = password.value;
    
    console.log('📧 Email:', emailValue);
    console.log('🔑 Password length:', passwordValue.length);
    
    if (!emailValue || !passwordValue) {
        if (typeof showToast === 'function') {
            showToast('Please fill in all fields', 'error');
        }
        return;
    }
    
    // Show loading
    if (typeof showLoading === 'function') {
        showLoading(true);
    }
    
    // Call login
    const result = await login(emailValue, passwordValue);
    
    // Hide loading
    if (typeof showLoading === 'function') {
        showLoading(false);
    }
    
    if (result.success) {
        console.log('✅ Login successful!');
        showAppScreen();
        if (typeof navigateTo === 'function') {
            navigateTo('dashboard');
        }
    } else {
        console.error('❌ Login failed:', result.error);
        if (typeof showToast === 'function') {
            showToast(result.error || 'Login failed', 'error');
        }
    }
}

// ============================================
// CHECK AUTH ON LOAD - FIXED WITH TIMEOUT
// ============================================

async function checkAuthOnLoad() {
    console.log('🔍 Checking auth on load...');
    
    if (typeof showLoading === 'function') {
        showLoading(true);
    }
    
    try {
        // Race with timeout - prevents infinite loading
        const result = await Promise.race([
            checkAuth(),
            new Promise(resolve => setTimeout(() => resolve({ success: false, timeout: true }), 8000))
        ]);
        
        if (typeof showLoading === 'function') {
            showLoading(false);
        }
        
        if (result.success) {
            console.log('✅ User already logged in');
            showAppScreen();
            // Try to restore deep link, fallback to dashboard
            if (typeof window.restorePageFromURL === 'function') {
                if (!window.restorePageFromURL()) {
                    if (typeof navigateTo === 'function') navigateTo('dashboard');
                }
            } else {
                if (typeof navigateTo === 'function') navigateTo('dashboard');
            }
        } else {
            console.log('❌ No session, showing auth screen');
            showAuthScreen();
        }
    } catch (error) {
        console.error('❌ Auth check error:', error);
        if (typeof showLoading === 'function') {
            showLoading(false);
        }
        showAuthScreen();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, setting up auth event listeners...');
    
    // ============================================
    // 1. SIGN UP BUTTON
    // ============================================
    const signupSubmit = document.getElementById('signupSubmit');
    if (signupSubmit) {
        console.log('✅ Found signupSubmit button');
        signupSubmit.addEventListener('click', handleSignup);
    } else {
        console.error('❌ signupSubmit button not found!');
    }
    
    // ============================================
    // 2. LOGIN BUTTON
    // ============================================
    const loginSubmit = document.getElementById('loginSubmit');
    if (loginSubmit) {
        console.log('✅ Found loginSubmit button');
        loginSubmit.addEventListener('click', handleLogin);
    } else {
        console.error('❌ loginSubmit button not found!');
    }
    
    // ============================================
    // 3. FORM SWITCHING
    // ============================================
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (showSignup) {
        console.log('✅ Found showSignup link');
        showSignup.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Switching to signup form');
            if (loginForm) loginForm.classList.add('hidden');
            if (signupForm) signupForm.classList.remove('hidden');
        });
    } else {
        console.error('❌ showSignup link not found!');
    }
    
    if (showLogin) {
        console.log('✅ Found showLogin link');
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Switching to login form');
            if (signupForm) signupForm.classList.add('hidden');
            if (loginForm) loginForm.classList.remove('hidden');
        });
    } else {
        console.error('❌ showLogin link not found!');
    }
    
    // ============================================
    // 4. ENTER KEY SUPPORT
    // ============================================
    const loginPassword = document.getElementById('loginPassword');
    if (loginPassword) {
        loginPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    const loginEmail = document.getElementById('loginEmail');
    if (loginEmail) {
        loginEmail.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword) {
        signupPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSignup();
        });
    }
    
    const signupEmail = document.getElementById('signupEmail');
    if (signupEmail) {
        signupEmail.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSignup();
        });
    }
    
    const signupConfirm = document.getElementById('signupConfirmPassword');
    if (signupConfirm) {
        signupConfirm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSignup();
        });
    }
    
    // ============================================
    // 5. CHECK AUTH ON LOAD
    // ============================================
    console.log('🔍 Running initial auth check...');
    checkAuthOnLoad();
});

// ============================================
// EXPOSE FUNCTIONS
// ============================================

console.log('📦 Exposing auth functions...');

window.signUp = signUp;
window.login = login;
window.logout = logout;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.getCurrentUserId = getCurrentUserId;
window.syncToSupabase = syncToSupabase;
window.syncEnabled = syncEnabled;
window.currentUserId = currentUserId;
window.showAuthScreen = showAuthScreen;
window.showAppScreen = showAppScreen;
window.showLoading = showLoading;
window.showLoginForm = showLoginForm;
window.resendVerification = resendVerification;
window.handleSignup = handleSignup;
window.handleLogin = handleLogin;

console.log('✅ Auth functions exposed!');