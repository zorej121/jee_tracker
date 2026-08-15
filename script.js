// ============================================
// JEE TRACKER - COMPLETE MAIN SCRIPT v2.0.0
// ============================================

// ============================================
// DEFAULT DATA (EMPTY - USER CREATES EVERYTHING)
// ============================================

const defaultData = {
    subjects: {
        physics: {
            name: 'Physics',
            color: '#9ca3af',
            icon: 'fa-atom',
            chapters: {},
            pinned: []
        },
        mathematics: {
            name: 'Mathematics',
            color: '#9ca3af',
            icon: 'fa-calculator',
            chapters: {},
            pinned: []
        },
        'inorganic-chemistry': {
            name: 'Inorganic Chemistry',
            color: '#9ca3af',
            icon: 'fa-flask',
            chapters: {},
            pinned: []
        },
        'organic-chemistry': {
            name: 'Organic Chemistry',
            color: '#9ca3af',
            icon: 'fa-vial',
            chapters: {},
            pinned: []
        },
        'physical-chemistry': {
            name: 'Physical Chemistry',
            color: '#9ca3af',
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
    joinDate: null,
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

// ============================================
// ACHIEVEMENTS LIST (EXPANDED)
// ============================================

const ACHIEVEMENTS = [
    { id: 'first-question', icon: '🌟', name: 'First Steps', desc: 'Mark your first question' },
    { id: 'q10', icon: '🎯', name: '10 Questions', desc: 'Solved 10 questions' },
    { id: 'q50', icon: '🎯', name: '50 Questions', desc: 'Solved 50 questions' },
    { id: 'q100', icon: '🏅', name: '100 Questions', desc: 'Solved 100 questions' },
    { id: 'q250', icon: '🥉', name: '250 Questions', desc: 'Solved 250 questions' },
    { id: 'q500', icon: '🥈', name: '500 Questions', desc: 'Solved 500 questions' },
    { id: 'q1000', icon: '🏆', name: '1000 Questions', desc: 'Solved 1000 questions' },
    { id: 'q2500', icon: '💎', name: '2500 Questions', desc: 'Solved 2500 questions' },
    { id: 'q5000', icon: '👑', name: '5000 Questions', desc: 'Solved 5000 questions' },
    { id: 'streak3', icon: '🔥', name: '3 Day Streak', desc: '3 days of consistency' },
    { id: 'streak7', icon: '🔥', name: '7 Day Streak', desc: '7 days of consistency' },
    { id: 'streak14', icon: '⚡', name: '14 Day Streak', desc: '14 days of consistency' },
    { id: 'streak30', icon: '🌟', name: '30 Day Streak', desc: '30 days of consistency' },
    { id: 'streak60', icon: '💪', name: '60 Day Streak', desc: '60 days of consistency' },
    { id: 'streak100', icon: '🏅', name: '100 Day Streak', desc: '100 days of consistency' },
    { id: 'subject-master', icon: '📚', name: 'Subject Master', desc: 'Complete all chapters in a subject' },
    { id: 'chapter-master', icon: '⭐', name: 'Chapter Master', desc: 'Complete all exercises in a chapter' },
    { id: 'all-subjects', icon: '🏆', name: 'JEE Master', desc: 'Master all 5 subjects' },
    { id: 'homework-10', icon: '📝', name: 'Homework Hero', desc: 'Complete 10 homework tasks' },
    { id: 'homework-50', icon: '📚', name: 'Homework Champion', desc: 'Complete 50 homework tasks' },
    { id: 'perfect-day', icon: '💯', name: 'Perfect Day', desc: 'Complete daily goal in one day' },
    { id: 'revision-5', icon: '🔄', name: 'Revision Master', desc: 'Create 5 revision lists' },
    { id: 'notes-10', icon: '📝', name: 'Note Taker', desc: 'Add notes to 10 questions' },
    { id: 'wrong-10', icon: '🔄', name: 'Learning from Mistakes', desc: 'Mark 10 questions as wrong' },
    { id: 'review-10', icon: '🔍', name: 'Reviewer', desc: 'Mark 10 questions for review' }
];

// ============================================
// STATE
// ============================================

let appData = {};
window.appData = appData;
let currentTheme = 'light';
let currentSubject = null;
let currentChapter = null;
let currentExercise = null;
let currentFilter = 'all';
let currentReviewFilter = 'all';
let currentWrongFilter = 'all';
let currentHwFilter = 'all';
let editingQuestionIndex = null;
let editingNotesSubject = null;
let editingNotesChapter = null;
let editingNotesExercise = null;
let isProfileEditMode = false;
let deleteMathAnswer = 0;
let currentPage = 'dashboard';
let homeworkSelectedExercises = [];
let homeworkSelectedQuestions = [];

// Question states
const STATES = {
    NOT_DONE: 'not-done',
    DONE: 'done',
    WRONG: 'wrong',
    REVIEW: 'review'
};

const STATE_ORDER = ['not-done', 'done', 'wrong', 'review'];
const STATE_ICONS = {
    'not-done': 'fa-circle',
    'done': 'fa-check-circle',
    'wrong': 'fa-times-circle',
    'review': 'fa-flag'
};

const CHAPTER_STATUSES = [
    'not-started',
    'in-progress',
    'completed-once',
    'revision-pending',
    'mastered'
];

// Page mapping
const PAGE_MAP = {
    'dashboard': 'pages/dashboard.html',
    'subjects': 'pages/subjects.html',
    'subject-detail': 'pages/subject-detail.html',
    'chapter-detail': 'pages/chapter-detail.html',
    'exercise-detail': 'pages/exercise-detail.html',
    'progress': 'pages/progress.html',
    'subject-progress': 'pages/subject-progress.html',
    'reviewbank': 'pages/review-bank.html',
    'wrongbank': 'pages/wrong-bank.html',
    'homework': 'pages/homework.html',
    'goals': 'pages/goals.html',
    'revision': 'pages/revision.html',
    'heatmap': 'pages/heatmap.html',
    'achievements': 'pages/achievements.html',
    'exam-mode': 'pages/exam-mode.html',
    'profile': 'pages/profile.html',
    'settings': 'pages/settings.html'
};

// ============================================
// DATA MANAGEMENT
// ============================================

function loadData() {
    const saved = localStorage.getItem('jeeTrackerData');
    
    if (saved) {
        try {
            appData = JSON.parse(saved);
            window.appData = appData;
            
            Object.keys(defaultData.subjects).forEach(key => {
                if (!appData.subjects[key]) {
                    appData.subjects[key] = JSON.parse(JSON.stringify(defaultData.subjects[key]));
                }
                if (!appData.subjects[key].pinned) {
                    appData.subjects[key].pinned = [];
                }
                // Update to grey color for existing users
                appData.subjects[key].color = '#9ca3af';
            });
            
            if (!appData.streak) {
                appData.streak = { current: 0, longest: 0, lastDate: null, todaySolved: 0 };
            }
            
            if (!appData.continueStudying) {
                appData.continueStudying = { subject: null, chapter: null, exercise: null, question: null };
            }
            
            if (!appData.questionNotes) appData.questionNotes = {};
            if (!appData.questionDifficulty) appData.questionDifficulty = {};
            if (!appData.questionRevision) appData.questionRevision = {};
            
            if (!appData.joinDate) {
                appData.joinDate = new Date().toISOString().split('T')[0];
            }
            
            if (!appData.homework) appData.homework = [];
            if (!appData.revisionLists) appData.revisionLists = [];
            
            if (!appData.goals) {
                appData.goals = {
                    daily: 50,
                    weekly: 350,
                    monthly: 1500,
                    dailyProgress: {},
                    weeklyProgress: {},
                    monthlyProgress: {}
                };
            }
            
            if (!appData.chapterStatus) appData.chapterStatus = {};
            if (!appData.achievements) appData.achievements = { unlocked: [] };
            if (!appData.heatmap) appData.heatmap = {};
            if (!appData.questionHistory) appData.questionHistory = {};
            
            if (appData.lastBackup === undefined) appData.lastBackup = null;
            if (appData.examMode === undefined) appData.examMode = false;
            
            if (!appData.profile) {
                appData.profile = {
                    name: '',
                    username: '',
                    phone: '',
                    class: '',
                    targetExam: 'JEE Main 2026',
                    coaching: '',
                    dailyGoal: 50,
                    avatarUrl: ''
                };
            }
            
            return;
            
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
    
    appData = JSON.parse(JSON.stringify(defaultData));
    window.appData = appData;
    
    appData.joinDate = new Date().toISOString().split('T')[0];
    
    saveData();
}

function saveData() {
    localStorage.setItem('jeeTrackerData', JSON.stringify(appData));
    updateLastBackup();
    if (typeof syncToSupabase === 'function' && typeof syncEnabled !== 'undefined' && syncEnabled) {
        syncToSupabase();
    }
    updateProfileUI();
}

function updateLastBackup() {
    appData.lastBackup = new Date().toISOString();
    const el = document.getElementById('lastBackupTime');
    if (el) {
        el.textContent = formatDate(appData.lastBackup);
    }
    const syncStatus = document.getElementById('syncStatus');
    if (syncStatus) {
        syncStatus.textContent = '☁ Synced';
        syncStatus.className = 'sync-status';
    }
    const lastSync = document.getElementById('lastSyncTime');
    if (lastSync) {
        lastSync.textContent = formatDate(appData.lastBackup);
    }
    const settingsLastSync = document.getElementById('settingsLastSync');
    if (settingsLastSync) {
        settingsLastSync.textContent = formatDate(appData.lastBackup);
    }
    const profileLastSync = document.getElementById('profileLastSync');
    if (profileLastSync) {
        profileLastSync.textContent = formatDate(appData.lastBackup);
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + 
           d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// ============================================
// THEME - Force Light Mode Only
// ============================================

function loadTheme() {
    // Force light mode only
    currentTheme = 'light';
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('jeeTheme', 'light');
}

// ============================================
// STREAK MANAGEMENT
// ============================================

function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const streak = appData.streak;
    
    if (streak.lastDate === today) {
        return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (streak.lastDate === yesterdayStr) {
        streak.current += 1;
    } else if (streak.lastDate !== today) {
        streak.current = 1;
    }
    
    if (streak.current > streak.longest) {
        streak.longest = streak.current;
    }
    
    streak.lastDate = today;
    saveData();
    updateStreakUI();
    updateProfileUI();
}

function updateStreakUI() {
    const val = appData.streak.current || 0;
    const el1 = document.getElementById('currentStreak');
    const el2 = document.getElementById('dashboardStreak');
    if (el1) el1.textContent = val;
    if (el2) el2.textContent = val;
    const profileStreak = document.getElementById('profileViewStreak');
    if (profileStreak) profileStreak.textContent = val + ' days';
}

function incrementTodaySolved() {
    const today = new Date().toISOString().split('T')[0];
    const streak = appData.streak;
    
    if (streak.lastDate !== today) {
        streak.todaySolved = 0;
        streak.lastDate = today;
    }
    
    streak.todaySolved += 1;
    
    if (!appData.heatmap[today]) {
        appData.heatmap[today] = 0;
    }
    appData.heatmap[today] += 1;
    
    saveData();
    updateStreakUI();
    checkAchievements();
    updateProfileUI();
}

// ============================================
// PAGE LOADING
// ============================================

function loadPage(page, params) {
    currentPage = page;
    const pagePath = PAGE_MAP[page];
    if (!pagePath) {
        console.error('Page not found:', page);
        return;
    }
    
    const content = document.getElementById('pageContent');
    const loader = document.getElementById('pageLoader');
    
    if (loader) loader.style.display = 'block';
    
    fetch(pagePath)
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(html => {
            if (loader) loader.style.display = 'none';
            if (content) {
                content.innerHTML = html;
                // Update nav
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.toggle('active', item.dataset.page === page);
                });
                // Initialize page
                initializePage(page, params);
                // Attach page-specific event listeners
                attachPageListeners(page);
                // Setup exercise add button if on chapter detail
                if (page === 'chapter-detail') {
                    setTimeout(setupExerciseAddButton, 200);
                }
            }
        })
        .catch(error => {
            console.error('Error loading page:', error);
            if (loader) loader.style.display = 'none';
            if (content) {
                content.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load page</p>
                        <span class="sub">Please try again</span>
                    </div>
                `;
            }
            showToast('Failed to load page', 'error');
        });
}

function initializePage(page, params) {
    switch(page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'subjects':
            renderSubjects();
            break;
        case 'subject-detail':
            if (params && params.subject) {
                currentSubject = params.subject;
                renderChapters(params.subject);
            }
            break;
        case 'chapter-detail':
            if (params && params.subject && params.chapter) {
                currentSubject = params.subject;
                currentChapter = params.chapter;
                renderExercises(params.subject, params.chapter);
                updatePinButton();
                setTimeout(setupExerciseAddButton, 200);
            }
            break;
        case 'exercise-detail':
            if (params && params.subject && params.chapter && params.exercise) {
                currentSubject = params.subject;
                currentChapter = params.chapter;
                currentExercise = params.exercise;
                renderQuestions(params.subject, params.chapter, params.exercise);
            }
            break;
        case 'progress':
            renderProgressPage();
            break;
        case 'subject-progress':
            if (params && params.subject) {
                renderSubjectProgressDetail(params.subject);
            }
            break;
        case 'reviewbank':
            renderReviewBank();
            break;
        case 'wrongbank':
            renderWrongBank();
            break;
        case 'homework':
            renderHomework();
            break;
        case 'goals':
            renderGoalsPage();
            break;
        case 'revision':
            renderRevisionPage();
            break;
        case 'heatmap':
            renderHeatmap();
            break;
        case 'achievements':
            renderAchievements();
            break;
        case 'exam-mode':
            renderExamMode();
            break;
        case 'profile':
            renderProfilePage();
            break;
        case 'settings':
            renderSettingsPage();
            break;
        default:
            break;
    }
}

// ============================================
// ATTACH PAGE-SPECIFIC EVENT LISTENERS
// ============================================

function attachPageListeners(page) {
    console.log('🔗 Attaching listeners for:', page);
    
    switch(page) {
        case 'subject-detail':
            document.getElementById('addChapterBtn')?.addEventListener('click', showAddChapterModal);
            document.getElementById('closeChapterModal')?.addEventListener('click', hideAddChapterModal);
            document.getElementById('cancelChapterBtn')?.addEventListener('click', hideAddChapterModal);
            document.getElementById('saveChapterBtn')?.addEventListener('click', addChapter);
            document.getElementById('chapterNameInput')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addChapter();
            });
            break;
            
        case 'chapter-detail':
            document.getElementById('pinChapterBtn')?.addEventListener('click', togglePinChapter);
            document.getElementById('editChapterBtn')?.addEventListener('click', showEditChapterModal);
            document.getElementById('closeEditChapterModal')?.addEventListener('click', hideEditChapterModal);
            document.getElementById('cancelEditChapterBtn')?.addEventListener('click', hideEditChapterModal);
            document.getElementById('saveEditChapterBtn')?.addEventListener('click', saveEditChapter);
            document.querySelectorAll('.status-btn').forEach(btn => {
                btn.onclick = () => setChapterStatus(btn.dataset.status);
            });
            // Add exercise button
            document.getElementById('addExerciseBtn')?.addEventListener('click', showAddExerciseModal);
            break;
            
        case 'exercise-detail':
            // Add Questions
            const addQuestionsBtn = document.getElementById('addQuestionsBtn');
            if (addQuestionsBtn) {
                addQuestionsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('➕ Add questions clicked');
                    showAddQuestionsModal();
                });
            }

            // Modal buttons
            const closeQuestions = document.getElementById('closeQuestionsModal');
            if (closeQuestions) {
                closeQuestions.addEventListener('click', function(e) {
                    e.preventDefault();
                    hideAddQuestionsModal();
                });
            }

            const cancelQuestions = document.getElementById('cancelQuestionsBtn');
            if (cancelQuestions) {
                cancelQuestions.addEventListener('click', function(e) {
                    e.preventDefault();
                    hideAddQuestionsModal();
                });
            }

            const saveQuestions = document.getElementById('saveQuestionsBtn');
            if (saveQuestions) {
                saveQuestions.addEventListener('click', function(e) {
                    e.preventDefault();
                    addQuestions();
                });
            }

            const questionCount = document.getElementById('questionCountInput');
            if (questionCount) {
                questionCount.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addQuestions();
                    }
                });
            }

            // Filter buttons
            document.querySelectorAll('#exerciseFilter .filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('#exerciseFilter .filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    if (currentExercise) {
                        renderQuestions(currentSubject, currentChapter, currentExercise);
                    }
                });
            });
            break;
            
        case 'homework':
            document.getElementById('addHomeworkBtn')?.addEventListener('click', showAddHomeworkModal);
            document.getElementById('closeHomeworkModal')?.addEventListener('click', hideAddHomeworkModal);
            document.getElementById('cancelHomeworkBtn')?.addEventListener('click', hideAddHomeworkModal);
            document.getElementById('saveHomeworkBtn')?.addEventListener('click', addHomework);
            document.querySelectorAll('.hw-filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.hw-filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentHwFilter = this.dataset.hwfilter;
                    renderHomework();
                });
            });
            // Homework cascading selectors
            document.getElementById('hwSubjectSelect')?.addEventListener('change', loadHomeworkChapters);
            document.getElementById('hwChapterSelect')?.addEventListener('change', loadHomeworkExercises);
            break;
            
        case 'goals':
            document.getElementById('saveDailyGoal')?.addEventListener('click', () => {
                const val = parseInt(document.getElementById('dailyGoalInput').value);
                if (val > 0) { appData.goals.daily = val; saveData(); renderGoalsPage(); }
            });
            document.getElementById('saveWeeklyGoal')?.addEventListener('click', () => {
                const val = parseInt(document.getElementById('weeklyGoalInput').value);
                if (val > 0) { appData.goals.weekly = val; saveData(); renderGoalsPage(); }
            });
            document.getElementById('saveMonthlyGoal')?.addEventListener('click', () => {
                const val = parseInt(document.getElementById('monthlyGoalInput').value);
                if (val > 0) { appData.goals.monthly = val; saveData(); renderGoalsPage(); }
            });
            break;
            
        case 'revision':
            document.getElementById('addRevisionBtn')?.addEventListener('click', showAddRevisionModal);
            document.getElementById('closeRevisionModal')?.addEventListener('click', hideAddRevisionModal);
            document.getElementById('cancelRevisionBtn')?.addEventListener('click', hideAddRevisionModal);
            document.getElementById('saveRevisionBtn')?.addEventListener('click', addRevision);
            break;
            
        case 'profile':
            document.getElementById('editProfileBtn')?.addEventListener('click', toggleProfileEdit);
            document.getElementById('profileEditCancelBtn')?.addEventListener('click', cancelProfileEdit);
            document.getElementById('profileEditSaveBtn')?.addEventListener('click', saveProfileEdit);
            document.getElementById('profileEditAvatarBtn')?.addEventListener('click', () => {
                document.getElementById('profileEditAvatarInput')?.click();
            });
            document.getElementById('profileEditAvatarInput')?.addEventListener('change', handleProfileAvatarUpload);
            break;
            
        case 'settings':
            document.getElementById('settingsSyncNow')?.addEventListener('click', syncNow);
            document.getElementById('settingsLogoutBtn')?.addEventListener('click', logoutUser);
            document.getElementById('settingsExportData')?.addEventListener('click', exportProgress);
            document.getElementById('settingsImportData')?.addEventListener('click', () => {
                document.getElementById('settingsImportFile')?.click();
            });
            document.getElementById('settingsImportFile')?.addEventListener('change', (e) => {
                if (e.target.files[0]) importProgress(e.target.files[0]);
                e.target.value = '';
            });
            // Theme toggle removed from settings
            break;
            
        case 'exam-mode':
            document.getElementById('examModeToggle')?.addEventListener('change', (e) => {
                appData.examMode = e.target.checked;
                saveData();
                renderExamMode();
            });
            break;
            
        case 'reviewbank':
        case 'wrongbank':
            document.querySelectorAll('.filter-bar .filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const bar = this.closest('.filter-bar');
                    bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    if (currentPage === 'reviewbank') {
                        currentReviewFilter = this.dataset.rfilter;
                        renderReviewBank();
                    } else if (currentPage === 'wrongbank') {
                        currentWrongFilter = this.dataset.wfilter;
                        renderWrongBank();
                    }
                });
            });
            break;
            
        default:
            console.log('⚠️ No specific listeners for page:', page);
            break;
    }
}

// ============================================
// NAVIGATION
// ============================================

function navigateTo(page, params) {
    // Close hamburger menu
    const hamburger = document.getElementById('hamburgerMenu');
    if (hamburger) hamburger.classList.remove('active');
    
    // Close search
    const searchBar = document.getElementById('searchBar');
    if (searchBar) searchBar.style.display = 'none';
    
    // Update browser history
    try {
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        if (params) {
            url.searchParams.set('params', JSON.stringify(params));
        }
        window.history.pushState({ page, params }, '', url);
    } catch (e) {
        console.warn('History update failed:', e);
    }
    
    // Load the page
    loadPage(page, params);
}

// Handle browser back/forward
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        loadPage(event.state.page, event.state.params);
    }
});

// ============================================
// GO BACK NAVIGATION
// ============================================

function goBack(from) {
    console.log('🔙 goBack called with:', from, 'Current subject:', currentSubject, 'Current chapter:', currentChapter);
    
    switch(from) {
        case 'subject-detail':
            if (currentSubject) {
                navigateTo('subjects');
            } else {
                navigateTo('dashboard');
            }
            break;
            
        case 'chapter-detail':
            if (currentSubject && currentChapter) {
                navigateTo('subject-detail', { subject: currentSubject });
            } else if (currentSubject) {
                navigateTo('subject-detail', { subject: currentSubject });
            } else {
                navigateTo('subjects');
            }
            break;
            
        case 'exercise-detail':
            if (currentSubject && currentChapter) {
                navigateTo('chapter-detail', { subject: currentSubject, chapter: currentChapter });
            } else if (currentSubject) {
                navigateTo('subject-detail', { subject: currentSubject });
            } else {
                navigateTo('subjects');
            }
            break;
            
        case 'subjectProgress':
            navigateTo('progress');
            break;
            
        case 'reviewBank':
        case 'wrongBank':
        case 'homework':
        case 'goals':
        case 'revision':
        case 'heatmap':
        case 'achievements':
        case 'examMode':
        case 'settings':
        case 'profile':
            navigateTo('dashboard');
            break;
            
        default:
            navigateTo('dashboard');
            break;
    }
}

// ============================================
// RESTORE PAGE FROM URL
// ============================================

function restorePageFromURL() {
    try {
        const url = new URL(window.location);
        const page = url.searchParams.get('page');
        const params = url.searchParams.get('params');
        
        if (page && page !== 'dashboard') {
            const parsedParams = params ? JSON.parse(params) : {};
            navigateTo(page, parsedParams);
            return true;
        }
    } catch (e) {
        console.warn('Failed to restore page from URL:', e);
    }
    return false;
}

// ============================================
// DASHBOARD
// ============================================

function renderDashboard() {
    const overall = calculateOverallProgress();
    const percent = Math.round(overall);
    
    const ring = document.getElementById('overallRing');
    if (ring) {
        const radius = 54;
        const circumference = 2 * Math.PI * radius;
        ring.style.strokeDasharray = circumference;
        const offset = circumference - (overall / 100) * circumference;
        ring.style.strokeDashoffset = offset;
    }
    
    const el1 = document.getElementById('overallPercentage');
    const el2 = document.getElementById('overallBadge');
    if (el1) el1.textContent = percent + '%';
    if (el2) el2.textContent = percent + '%';
    
    let totalChapters = 0;
    let totalQuestions = 0;
    let doneCount = 0;
    let wrongCount = 0;
    let reviewCount = 0;
    
    Object.keys(appData.subjects).forEach(subKey => {
        const subject = appData.subjects[subKey];
        Object.keys(subject.chapters).forEach(chKey => {
            totalChapters++;
            const chapter = subject.chapters[chKey];
            Object.keys(chapter.exercises).forEach(exKey => {
                const exercise = chapter.exercises[exKey];
                const questions = exercise.questions || [];
                totalQuestions += questions.length;
                doneCount += questions.filter(q => q === STATES.DONE).length;
                wrongCount += questions.filter(q => q === STATES.WRONG).length;
                reviewCount += questions.filter(q => q === STATES.REVIEW).length;
            });
        });
    });
    
    const ids = ['totalSubjects', 'totalChapters', 'totalQuestions', 'quickDone', 'quickWrong', 'quickReview'];
    const values = [Object.keys(appData.subjects).length, totalChapters, totalQuestions, doneCount, wrongCount, reviewCount];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = values[i];
    });
    
    const today = new Date().toISOString().split('T')[0];
    const streak = appData.streak;
    if (streak.lastDate !== today) {
        streak.todaySolved = 0;
    }
    const elToday = document.getElementById('todaySolved');
    if (elToday) elToday.textContent = streak.todaySolved || 0;
    
    const targetExam = appData.profile?.targetExam || 'JEE Main 2026';
    let targetDate = new Date('2026-05-01');
    if (targetExam.includes('2027')) targetDate = new Date('2027-05-01');
    if (targetExam.includes('Advanced 2026')) targetDate = new Date('2026-06-01');
    if (targetExam.includes('Advanced 2027')) targetDate = new Date('2027-06-01');
    const now = new Date();
    const days = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
    const elDays = document.getElementById('daysRemaining');
    if (elDays) elDays.textContent = Math.max(0, days);
    
    renderDailyGoal();
    renderHomeworkOverview();
    renderContinueStudying();
    renderSubjectProgressList();
    // renderWhatsNew(); - Removed
    
    updateStreakUI();
    updateLastBackup();
    updateProfileUI();
}

function renderDailyGoal() {
    const dailyGoal = appData.goals.daily || 50;
    const today = new Date().toISOString().split('T')[0];
    const todaySolved = appData.streak.todaySolved || 0;
    const progress = Math.min(100, (todaySolved / dailyGoal) * 100);
    
    const elTarget = document.getElementById('goalTarget');
    const elCompleted = document.getElementById('goalCompleted');
    const elProgress = document.getElementById('goalProgress');
    const elFill = document.getElementById('goalFill');
    const elRemaining = document.getElementById('goalRemaining');
    
    if (elTarget) elTarget.textContent = dailyGoal;
    if (elCompleted) elCompleted.textContent = todaySolved;
    if (elProgress) elProgress.textContent = Math.round(progress) + '%';
    if (elFill) elFill.style.width = progress + '%';
    if (elRemaining) elRemaining.textContent = Math.max(0, dailyGoal - todaySolved) + ' remaining';
}

function renderHomeworkOverview() {
    const homework = appData.homework || [];
    const today = new Date().toISOString().split('T')[0];
    
    let pending = 0;
    let dueToday = 0;
    let overdue = 0;
    let completed = 0;
    
    homework.forEach(hw => {
        if (hw.completed) {
            completed++;
            return;
        }
        pending++;
        if (hw.dueDate === today) dueToday++;
        if (hw.dueDate < today) overdue++;
    });
    
    const ids = ['hwPending', 'hwDueToday', 'hwOverdue', 'hwCompleted'];
    const values = [pending, dueToday, overdue, completed];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = values[i];
    });
}

function renderContinueStudying() {
    const container = document.getElementById('continueContent');
    if (!container) return;
    
    const cs = appData.continueStudying;
    
    if (cs.subject && cs.chapter && cs.exercise) {
        const subject = appData.subjects[cs.subject];
        const chapter = subject?.chapters[cs.chapter];
        const exercise = chapter?.exercises[cs.exercise];
        
        if (subject && chapter && exercise) {
            const total = exercise.questions.length;
            const done = exercise.questions.filter(q => q === STATES.DONE || q === STATES.WRONG).length;
            const qNum = cs.question !== null ? cs.question + 1 : done + 1;
            
            container.innerHTML = `
                <div class="continue-item" onclick="resumeStudying()">
                    <div class="continue-icon"><i class="fas fa-play"></i></div>
                    <div class="continue-info">
                        <strong>${subject.name} → ${chapter.name}</strong>
                        <span>${exercise.name} • Q${Math.min(qNum, total)}/${total}</span>
                    </div>
                    <i class="fas fa-chevron-right continue-arrow"></i>
                </div>
            `;
            return;
        }
    }
    
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-book-open"></i>
            <p>No active sessions</p>
            <span class="sub">Start a chapter to track progress</span>
        </div>
    `;
}

function renderSubjectProgressList() {
    const container = document.getElementById('subjectProgressList');
    if (!container) return;
    container.innerHTML = '';
    
    const colors = ['#9ca3af', '#9ca3af', '#9ca3af', '#9ca3af', '#9ca3af'];
    const icons = ['fa-atom', 'fa-calculator', 'fa-flask', 'fa-vial', 'fa-microscope'];
    let idx = 0;
    
    Object.keys(appData.subjects).forEach(key => {
        const subject = appData.subjects[key];
        const progress = calculateSubjectProgress(key);
        const color = colors[idx % colors.length];
        const icon = icons[idx % icons.length];
        idx++;
        
        const item = document.createElement('div');
        item.className = 'subject-progress-item';
        item.innerHTML = `
            <div class="subject-icon" style="background: #e5e7eb; color: #6b7280;"><i class="fas ${icon}"></i></div>
            <div class="subject-item-info">
                <div class="subject-item-name">${subject.name}</div>
                <div class="subject-item-progress">
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${Math.round(progress)}%; background: #9ca3af"></div>
                    </div>
                    <span class="subject-item-percent">${Math.round(progress)}%</span>
                </div>
            </div>
        `;
        item.addEventListener('click', () => openSubject(key));
        container.appendChild(item);
    });
}

function resumeStudying() {
    const cs = appData.continueStudying;
    if (cs.subject && cs.chapter && cs.exercise) {
        navigateTo('subject-detail', { subject: cs.subject });
        setTimeout(() => {
            navigateTo('chapter-detail', { subject: cs.subject, chapter: cs.chapter });
            setTimeout(() => {
                navigateTo('exercise-detail', { subject: cs.subject, chapter: cs.chapter, exercise: cs.exercise });
            }, 300);
        }, 300);
    }
}

// ============================================
// SUBJECTS
// ============================================

function renderSubjects() {
    const container = document.getElementById('subjectsList');
    if (!container) return;
    container.innerHTML = '';
    
    const colors = ['#9ca3af', '#9ca3af', '#9ca3af', '#9ca3af', '#9ca3af'];
    const icons = ['fa-atom', 'fa-calculator', 'fa-flask', 'fa-vial', 'fa-microscope'];
    let idx = 0;
    
    Object.keys(appData.subjects).forEach(key => {
        const subject = appData.subjects[key];
        const progress = calculateSubjectProgress(key);
        const color = colors[idx % colors.length];
        const icon = icons[idx % icons.length];
        const totalCh = Object.keys(subject.chapters).length;
        idx++;
        
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.style.setProperty('--subject-color', color);
        card.innerHTML = `
            <div class="subject-card-header">
                <div class="subject-card-left">
                    <div class="subject-card-icon" style="background: #e5e7eb; color: #6b7280;"><i class="fas ${icon}"></i></div>
                    <span class="subject-card-name">${subject.name}</span>
                </div>
                <span class="subject-card-percent">${Math.round(progress)}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${Math.round(progress)}%; background: #9ca3af"></div>
            </div>
            <div class="subject-card-chapters">
                <i class="fas fa-book" style="color: #9ca3af"></i>
                ${totalCh} Chapters
                ${subject.pinned && subject.pinned.length > 0 ? ` • ⭐ ${subject.pinned.length} pinned` : ''}
            </div>
        `;
        card.addEventListener('click', () => openSubject(key));
        container.appendChild(card);
    });
}

function openSubject(subjectKey) {
    currentSubject = subjectKey;
    navigateTo('subject-detail', { subject: subjectKey });
}

// ============================================
// CHAPTERS
// ============================================

function renderChapters(subjectKey) {
    const container = document.getElementById('chaptersContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const subject = appData.subjects[subjectKey];
    const pinnedKeys = subject.pinned || [];
    
    // ✅ Get chapters in the order they were added
    const order = ensureChapterOrder(subjectKey);
    
    // Separate pinned and unpinned chapters
    const pinnedChapters = order.filter(key => pinnedKeys.includes(key));
    const unpinnedChapters = order.filter(key => !pinnedKeys.includes(key));
    
    // Pinned chapters first, then unpinned (both in insertion order)
    const sortedKeys = [...pinnedChapters, ...unpinnedChapters];
    
    const title = document.getElementById('subjectDetailTitle');
    if (title) {
        title.innerHTML = `<i class="fas ${subject.icon}" style="color: #9ca3af"></i> ${subject.name}`;
    }
    
    if (sortedKeys.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-plus-circle"></i>
                <p>No chapters yet</p>
                <p class="sub">Click the + button to add one</p>
            </div>
        `;
        return;
    }
    
    sortedKeys.forEach(chKey => {
        const chapter = subject.chapters[chKey];
        const exerciseCount = Object.keys(chapter.exercises).length;
        const isPinned = pinnedKeys.includes(chKey);
        const status = appData.chapterStatus[`${subjectKey}_${chKey}`] || 'not-started';
        const statusLabels = {
            'not-started': '⬜ Not Started',
            'in-progress': '🔄 In Progress',
            'completed-once': '✅ Completed Once',
            'revision-pending': '📌 Revision Pending',
            'mastered': '⭐ Mastered'
        };
        
        const item = document.createElement('div');
        item.className = `chapter-item ${isPinned ? 'pinned' : ''}`;
        item.innerHTML = `
            <div class="chapter-icon"><i class="fas ${isPinned ? 'fa-thumbtack' : 'fa-book'}"></i></div>
            <div class="chapter-info">
                <span class="name">${chapter.name}</span>
                <span class="meta">${exerciseCount} exercises • ${statusLabels[status] || 'Not Started'}</span>
            </div>
            ${isPinned ? '<span class="pin-indicator"><i class="fas fa-thumbtack"></i></span>' : ''}
            <i class="fas fa-chevron-right chapter-arrow"></i>
        `;
        item.addEventListener('click', () => openChapter(subjectKey, chKey));
        container.appendChild(item);
    });
}

function openChapter(subjectKey, chapterKey) {
    currentChapter = chapterKey;
    navigateTo('chapter-detail', { subject: subjectKey, chapter: chapterKey });
}

// ============================================
// EXERCISES
// ============================================

function renderExercises(subjectKey, chapterKey) {
    const container = document.getElementById('exercisesContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const subject = appData.subjects[subjectKey];
    const chapter = subject.chapters[chapterKey];
    const exerciseKeys = Object.keys(chapter.exercises);
    
    // Set the chapter title
    const title = document.getElementById('chapterDetailTitle');
    if (title) {
        title.innerHTML = `<i class="fas fa-book"></i> ${chapter.name}`;
    }
    
    const statusKey = `${subjectKey}_${chapterKey}`;
    const currentStatus = appData.chapterStatus[statusKey] || 'not-started';
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === currentStatus);
    });
    
    if (exerciseKeys.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-plus-circle"></i>
                <p>No exercises yet</p>
                <p class="sub">Click the + button to add one</p>
            </div>
        `;
        return;
    }
    
    exerciseKeys.forEach(exKey => {
        const exercise = chapter.exercises[exKey];
        const questions = exercise.questions || [];
        const total = questions.length;
        const done = questions.filter(q => q === STATES.DONE).length;
        const wrong = questions.filter(q => q === STATES.WRONG).length;
        const review = questions.filter(q => q === STATES.REVIEW).length;
        const notDone = questions.filter(q => q === STATES.NOT_DONE).length;
        const progress = total > 0 ? ((done + wrong) / total) * 100 : 0;
        
        const item = document.createElement('div');
        item.className = 'exercise-item';
        item.innerHTML = `
            <div class="exercise-top">
                <span class="exercise-name"><i class="fas fa-list"></i> ${exercise.name}</span>
                <button class="exercise-delete-btn" onclick="event.stopPropagation(); deleteExercise('${exKey}')" title="Delete Exercise">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="exercise-stats-row">
                <span class="done"><i class="fas fa-check-circle"></i> ${done}</span>
                <span class="wrong"><i class="fas fa-times-circle"></i> ${wrong}</span>
                <span class="review"><i class="fas fa-flag"></i> ${review}</span>
                <span class="not-done"><i class="fas fa-circle"></i> ${notDone}</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${Math.round(progress)}%; background: #9ca3af"></div>
            </div>
            <div class="exercise-meta">${total} questions • ${Math.round(progress)}% complete</div>
        `;
        item.addEventListener('click', () => openExercise(subjectKey, chapterKey, exKey));
        container.appendChild(item);
    });
}

function openExercise(subjectKey, chapterKey, exerciseKey) {
    currentExercise = exerciseKey;
    appData.continueStudying = {
        subject: subjectKey,
        chapter: chapterKey,
        exercise: exerciseKey,
        question: null
    };
    saveData();
    navigateTo('exercise-detail', { subject: subjectKey, chapter: chapterKey, exercise: exerciseKey });
}

// ============================================
// CHAPTER STATUS
// ============================================

function setChapterStatus(status) {
    const key = `${currentSubject}_${currentChapter}`;
    appData.chapterStatus[key] = status;
    saveData();
    renderExercises(currentSubject, currentChapter);
}

// ============================================
// PIN CHAPTER
// ============================================

function togglePinChapter() {
    const subject = appData.subjects[currentSubject];
    if (!subject.pinned) subject.pinned = [];
    
    const index = subject.pinned.indexOf(currentChapter);
    if (index > -1) {
        subject.pinned.splice(index, 1);
    } else {
        subject.pinned.push(currentChapter);
    }
    
    saveData();
    renderChapters(currentSubject);
    updatePinButton();
}

function updatePinButton() {
    const subject = appData.subjects[currentSubject];
    const isPinned = subject.pinned && subject.pinned.includes(currentChapter);
    const btn = document.getElementById('pinChapterBtn');
    if (btn) {
        if (isPinned) {
            btn.classList.add('pinned');
            btn.innerHTML = '<i class="fas fa-thumbtack"></i>';
        } else {
            btn.classList.remove('pinned');
            btn.innerHTML = '<i class="fas fa-thumbtack"></i>';
        }
    }
}

// ============================================
// EDIT CHAPTER
// ============================================

function showEditChapterModal() {
    const modal = document.getElementById('editChapterModal');
    if (modal) modal.classList.add('active');
    const input = document.getElementById('editChapterNameInput');
    if (input) {
        const subject = appData.subjects[currentSubject];
        const chapter = subject.chapters[currentChapter];
        input.value = chapter.name || '';
        input.focus();
    }
}

function hideEditChapterModal() {
    const modal = document.getElementById('editChapterModal');
    if (modal) modal.classList.remove('active');
}

function saveEditChapter() {
    const input = document.getElementById('editChapterNameInput');
    const newName = input ? input.value.trim() : '';
    
    if (!newName) {
        showToast('Please enter a chapter name', 'error');
        return;
    }
    
    const subject = appData.subjects[currentSubject];
    const chapter = subject.chapters[currentChapter];
    const oldKey = currentChapter;
    const newKey = newName.toLowerCase().replace(/\s+/g, '-');
    
    if (oldKey !== newKey && subject.chapters[newKey]) {
        showToast('A chapter with this name already exists!', 'error');
        return;
    }
    
    chapter.name = newName;
    
    if (oldKey !== newKey) {
        subject.chapters[newKey] = chapter;
        delete subject.chapters[oldKey];
        currentChapter = newKey;
        
        if (subject.pinned && subject.pinned.includes(oldKey)) {
            const idx = subject.pinned.indexOf(oldKey);
            subject.pinned[idx] = newKey;
        }
    }
    
    saveData();
    hideEditChapterModal();
    renderChapters(currentSubject);
    renderExercises(currentSubject, currentChapter);
    showToast('✅ Chapter updated successfully!', 'success');
}

// ============================================
// QUESTIONS
// ============================================

function renderQuestions(subjectKey, chapterKey, exerciseKey) {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const subject = appData.subjects[subjectKey];
    const chapter = subject.chapters[chapterKey];
    const exercise = chapter.exercises[exerciseKey];
    const questions = exercise.questions || [];
    
    const title = document.getElementById('exerciseDetailTitle');
    if (title) {
        title.innerHTML = `<i class="fas fa-list-check"></i> ${exercise.name}`;
    }
    
    if (questions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-plus-circle"></i>
                <p>No questions yet</p>
                <p class="sub">Click the + button to add some</p>
            </div>
        `;
        return;
    }
    
    let filteredQuestions = questions.map((q, i) => ({ status: q, index: i }));
    
    if (currentFilter === 'done') {
        filteredQuestions = filteredQuestions.filter(q => q.status === STATES.DONE);
    } else if (currentFilter === 'wrong') {
        filteredQuestions = filteredQuestions.filter(q => q.status === STATES.WRONG);
    } else if (currentFilter === 'review') {
        filteredQuestions = filteredQuestions.filter(q => q.status === STATES.REVIEW);
    } else if (currentFilter === 'not-done') {
        filteredQuestions = filteredQuestions.filter(q => q.status === STATES.NOT_DONE);
    } else if (currentFilter === 'easy' || currentFilter === 'medium' || currentFilter === 'hard') {
        filteredQuestions = filteredQuestions.filter(q => {
            const key = `${subjectKey}_${chapterKey}_${exerciseKey}_${q.index}`;
            return appData.questionDifficulty[key] === currentFilter;
        });
    }
    
    if (filteredQuestions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-filter"></i>
                <p>No questions match this filter</p>
                <span class="sub">Try a different filter</span>
            </div>
        `;
        return;
    }
    
    filteredQuestions.forEach(({ status, index }) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        
        const noteKey = `${subjectKey}_${chapterKey}_${exerciseKey}_${index}`;
        const hasNote = appData.questionNotes[noteKey];
        const difficulty = appData.questionDifficulty[noteKey] || '';
        const revision = appData.questionRevision[noteKey];
        
        let revisionBadge = '';
        if (revision) {
            const today = new Date();
            const revDate = new Date(revision);
            const daysLeft = Math.ceil((revDate - today) / (1000 * 60 * 60 * 24));
            if (daysLeft > 0) {
                revisionBadge = `<span class="q-revision-badge">📅 ${daysLeft}d</span>`;
            } else {
                revisionBadge = `<span class="q-revision-badge" style="background: var(--red-bg); color: var(--red);">📅 Due!</span>`;
            }
        }
        
        item.innerHTML = `
            <span class="q-number">Q${index + 1}</span>
            <div class="q-options">
                <button class="${status === STATES.NOT_DONE ? 'active-not-done' : 'inactive'}" data-action="${STATES.NOT_DONE}">
                    <i class="far fa-circle"></i> Not Done
                </button>
                <button class="${status === STATES.DONE ? 'active-done' : 'inactive'}" data-action="${STATES.DONE}">
                    <i class="fas fa-check-circle"></i> Done
                </button>
                <button class="${status === STATES.WRONG ? 'active-wrong' : 'inactive'}" data-action="${STATES.WRONG}">
                    <i class="fas fa-times-circle"></i> Wrong
                </button>
                <button class="${status === STATES.REVIEW ? 'active-review' : 'inactive'}" data-action="${STATES.REVIEW}">
                    <i class="fas fa-flag"></i> Review
                </button>
            </div>
            <div class="q-status ${status}"><i class="fas ${STATE_ICONS[status] || 'fa-circle'}"></i></div>
            ${difficulty ? `<span class="q-difficulty ${difficulty}">${difficulty}</span>` : ''}
            ${revisionBadge}
            <div class="q-actions">
                <button class="note-btn" title="Add Note" onclick="openNotesModal('${subjectKey}', '${chapterKey}', '${exerciseKey}', ${index})">
                    <i class="fas fa-pen"></i>
                </button>
            </div>
            ${hasNote ? `<span class="q-note-preview">${hasNote.substring(0, 30)}${hasNote.length > 30 ? '...' : ''}</span>` : ''}
        `;
        
        const buttons = item.querySelectorAll('.q-options button');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                updateQuestionStatus(subjectKey, chapterKey, exerciseKey, index, action);
            });
        });
        
        container.appendChild(item);
    });
}

function updateQuestionStatus(subjectKey, chapterKey, exerciseKey, questionIndex, newStatus) {
    const subject = appData.subjects[subjectKey];
    const chapter = subject.chapters[chapterKey];
    const exercise = chapter.exercises[exerciseKey];
    
    const oldStatus = exercise.questions[questionIndex];
    
    if (oldStatus === newStatus) {
        const currentIndex = STATE_ORDER.indexOf(newStatus);
        const nextIndex = (currentIndex + 1) % STATE_ORDER.length;
        exercise.questions[questionIndex] = STATE_ORDER[nextIndex];
    } else {
        exercise.questions[questionIndex] = newStatus;
    }
    
    if ((newStatus === STATES.DONE || newStatus === STATES.WRONG) && oldStatus !== STATES.DONE && oldStatus !== STATES.WRONG) {
        incrementTodaySolved();
    }
    
    const historyKey = `${subjectKey}_${chapterKey}_${exerciseKey}_${questionIndex}`;
    if (!appData.questionHistory[historyKey]) {
        appData.questionHistory[historyKey] = [];
    }
    appData.questionHistory[historyKey].push({
        date: new Date().toISOString(),
        status: exercise.questions[questionIndex]
    });
    
    appData.continueStudying = {
        subject: subjectKey,
        chapter: chapterKey,
        exercise: exerciseKey,
        question: questionIndex
    };
    
    updateHomeworkProgress(subjectKey, chapterKey, exerciseKey);
    saveData();
    renderQuestions(subjectKey, chapterKey, exerciseKey);
    updateStreak();
    checkAchievements();
    
    if (currentPage === 'dashboard') {
        renderDashboard();
    }
}

// ============================================
// HOMEWORK PROGRESS SYNC
// ============================================

function updateHomeworkProgress(subjectKey, chapterKey, exerciseKey) {
    const homework = appData.homework || [];
    const subject = appData.subjects[subjectKey];
    const chapter = subject?.chapters[chapterKey];
    const exercise = chapter?.exercises[exerciseKey];
    if (!exercise) return;
    
    homework.forEach((hw) => {
        if (hw.completed) return;
        if (hw.subject !== subjectKey) return;
        if (hw.chapter !== chapter.name) return;
        
        const selectedQuestions = hw.selectedQuestions || [];
        if (selectedQuestions.length === 0) return;
        
        let totalSelected = 0;
        let doneCount = 0;
        let reviewCount = 0;
        
        selectedQuestions.forEach(qKey => {
            const [exKey, qIndex] = qKey.split('_');
            const idx = parseInt(qIndex);
            const ex = chapter.exercises[exKey];
            if (ex && ex.questions && ex.questions[idx] !== undefined) {
                totalSelected++;
                const status = ex.questions[idx];
                if (status === STATES.DONE) doneCount++;
                if (status === STATES.REVIEW) reviewCount++;
            }
        });
        
        const completedCount = doneCount + reviewCount;
        hw.progress = totalSelected > 0 ? Math.round((completedCount / totalSelected) * 100) : 0;
        hw.doneCount = doneCount;
        hw.reviewCount = reviewCount;
        hw.totalCount = totalSelected;
        
        if (totalSelected > 0 && completedCount === totalSelected) {
            hw.completed = true;
            hw.completedAt = new Date().toISOString();
        }
    });
    saveData();
}

// ============================================
// NOTES MODAL
// ============================================

let notesModalData = {};

function openNotesModal(subjectKey, chapterKey, exerciseKey, questionIndex) {
    notesModalData = { subjectKey, chapterKey, exerciseKey, questionIndex };
    const noteKey = `${subjectKey}_${chapterKey}_${exerciseKey}_${questionIndex}`;
    
    const idEl = document.getElementById('notesQuestionId');
    if (idEl) idEl.textContent = `#${questionIndex + 1}`;
    
    const noteEl = document.getElementById('questionNotesInput');
    if (noteEl) noteEl.value = appData.questionNotes[noteKey] || '';
    
    const currentDiff = appData.questionDifficulty[noteKey] || '';
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.remove('active-easy', 'active-medium', 'active-hard');
        if (btn.dataset.diff === currentDiff) {
            btn.classList.add(`active-${currentDiff}`);
        }
    });
    
    document.querySelectorAll('.rev-schedule-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const revDate = appData.questionRevision[noteKey];
    if (revDate) {
        const today = new Date();
        const revDateObj = new Date(revDate);
        const daysDiff = Math.ceil((revDateObj - today) / (1000 * 60 * 60 * 24));
        document.querySelectorAll('.rev-schedule-btn').forEach(btn => {
            if (parseInt(btn.dataset.days) === daysDiff) {
                btn.classList.add('active');
            }
        });
    }
    
    const modal = document.getElementById('notesModal');
    if (modal) modal.classList.add('active');
}

function closeNotesModal() {
    const modal = document.getElementById('notesModal');
    if (modal) modal.classList.remove('active');
}

function saveNotes() {
    const { subjectKey, chapterKey, exerciseKey, questionIndex } = notesModalData;
    const noteKey = `${subjectKey}_${chapterKey}_${exerciseKey}_${questionIndex}`;
    const noteEl = document.getElementById('questionNotesInput');
    const note = noteEl ? noteEl.value.trim() : '';
    
    if (note) {
        appData.questionNotes[noteKey] = note;
    } else {
        delete appData.questionNotes[noteKey];
    }
    
    let selectedDiff = '';
    document.querySelectorAll('.diff-btn').forEach(btn => {
        if (btn.classList.contains('active-easy') || btn.classList.contains('active-medium') || btn.classList.contains('active-hard')) {
            selectedDiff = btn.dataset.diff;
        }
    });
    if (selectedDiff) {
        appData.questionDifficulty[noteKey] = selectedDiff;
    } else {
        delete appData.questionDifficulty[noteKey];
    }
    
    let selectedRevDays = null;
    document.querySelectorAll('.rev-schedule-btn').forEach(btn => {
        if (btn.classList.contains('active')) {
            selectedRevDays = parseInt(btn.dataset.days);
        }
    });
    if (selectedRevDays) {
        const revDate = new Date();
        revDate.setDate(revDate.getDate() + selectedRevDays);
        appData.questionRevision[noteKey] = revDate.toISOString().split('T')[0];
    } else {
        delete appData.questionRevision[noteKey];
    }
    
    saveData();
    closeNotesModal();
    renderQuestions(subjectKey, chapterKey, exerciseKey);
}

// ============================================
// FILTER HANDLING
// ============================================

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('diff-btn')) {
        const btn = e.target;
        const diff = btn.dataset.diff;
        if (btn.classList.contains(`active-${diff}`)) {
            btn.classList.remove(`active-${diff}`);
        } else {
            document.querySelectorAll('.diff-btn').forEach(b => {
                b.classList.remove('active-easy', 'active-medium', 'active-hard');
            });
            btn.classList.add(`active-${diff}`);
        }
    }
    
    if (e.target.classList.contains('rev-schedule-btn')) {
        const btn = e.target;
        document.querySelectorAll('.rev-schedule-btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');
    }
});

// ============================================
// PROGRESS PAGE
// ============================================

function renderProgressPage() {
    const container = document.getElementById('progressGrid');
    if (!container) return;
    container.innerHTML = '';
    
    let totalQ = 0;
    let doneQ = 0;
    let wrongQ = 0;
    let reviewQ = 0;
    
    Object.keys(appData.subjects).forEach(subKey => {
        const subject = appData.subjects[subKey];
        Object.keys(subject.chapters).forEach(chKey => {
            const chapter = subject.chapters[chKey];
            Object.keys(chapter.exercises).forEach(exKey => {
                const exercise = chapter.exercises[exKey];
                const questions = exercise.questions || [];
                totalQ += questions.length;
                doneQ += questions.filter(q => q === STATES.DONE).length;
                wrongQ += questions.filter(q => q === STATES.WRONG).length;
                reviewQ += questions.filter(q => q === STATES.REVIEW).length;
            });
        });
    });
    
    const ids = ['summaryTotal', 'summaryDone', 'summaryWrong', 'summaryReview'];
    const values = [totalQ, doneQ, wrongQ, reviewQ];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = values[i];
    });
    
    // Forecast card removed
    
    const colors = ['#9ca3af', '#9ca3af', '#9ca3af', '#9ca3af', '#9ca3af'];
    const icons = ['fa-atom', 'fa-calculator', 'fa-flask', 'fa-vial', 'fa-microscope'];
    let idx = 0;
    
    Object.keys(appData.subjects).forEach(key => {
        const subject = appData.subjects[key];
        const progress = calculateSubjectProgress(key);
        const color = colors[idx % colors.length];
        const icon = icons[idx % icons.length];
        const totalCh = Object.keys(subject.chapters).length;
        
        let totalQSub = 0, doneQSub = 0, wrongQSub = 0, reviewQSub = 0, notDoneQSub = 0;
        Object.keys(subject.chapters).forEach(chKey => {
            const chapter = subject.chapters[chKey];
            Object.keys(chapter.exercises).forEach(exKey => {
                const exercise = chapter.exercises[exKey];
                const questions = exercise.questions || [];
                totalQSub += questions.length;
                doneQSub += questions.filter(q => q === STATES.DONE).length;
                wrongQSub += questions.filter(q => q === STATES.WRONG).length;
                reviewQSub += questions.filter(q => q === STATES.REVIEW).length;
                notDoneQSub += questions.filter(q => q === STATES.NOT_DONE).length;
            });
        });
        idx++;
        
        const card = document.createElement('div');
        card.className = 'progress-card';
        card.style.setProperty('--subject-color', color);
        card.innerHTML = `
            <div class="progress-card-header">
                <div class="progress-card-left">
                    <div class="progress-card-icon" style="background: #e5e7eb; color: #6b7280;"><i class="fas ${icon}"></i></div>
                    <span class="progress-card-name">${subject.name}</span>
                </div>
                <span class="progress-card-percent">${Math.round(progress)}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${Math.round(progress)}%; background: #9ca3af"></div>
            </div>
            <div class="progress-card-stats">
                <span class="stat-done"><i class="fas fa-check-circle"></i> ${doneQSub} Done</span>
                <span class="stat-wrong"><i class="fas fa-times-circle"></i> ${wrongQSub} Wrong</span>
                <span class="stat-review"><i class="fas fa-flag"></i> ${reviewQSub} Review</span>
                <span class="stat-not-done"><i class="fas fa-circle"></i> ${notDoneQSub} Pending</span>
                <span><i class="fas fa-book"></i> ${totalCh} Ch</span>
            </div>
        `;
        card.addEventListener('click', () => {
            navigateTo('subject-progress', { subject: key });
        });
        container.appendChild(card);
    });
}

function renderSubjectProgressDetail(subjectKey) {
    const subject = appData.subjects[subjectKey];
    const container = document.getElementById('subjectProgressDetail');
    if (!container) return;
    container.innerHTML = '';
    
    const title = document.getElementById('subjectProgressTitle');
    if (title) {
        title.innerHTML = `<i class="fas ${subject.icon}" style="color: #9ca3af"></i> ${subject.name} - Progress`;
    }
    
    let totalQ = 0, doneQ = 0, wrongQ = 0, reviewQ = 0, notDoneQ = 0;
    let chapterData = [];
    
    Object.keys(subject.chapters).forEach(chKey => {
        const chapter = subject.chapters[chKey];
        let chTotal = 0, chDone = 0, chWrong = 0, chReview = 0, chNotDone = 0;
        Object.keys(chapter.exercises).forEach(exKey => {
            const exercise = chapter.exercises[exKey];
            const questions = exercise.questions || [];
            chTotal += questions.length;
            chDone += questions.filter(q => q === STATES.DONE).length;
            chWrong += questions.filter(q => q === STATES.WRONG).length;
            chReview += questions.filter(q => q === STATES.REVIEW).length;
            chNotDone += questions.filter(q => q === STATES.NOT_DONE).length;
        });
        totalQ += chTotal;
        doneQ += chDone;
        wrongQ += chWrong;
        reviewQ += chReview;
        notDoneQ += chNotDone;
        chapterData.push({
            key: chKey,
            name: chapter.name,
            total: chTotal,
            done: chDone,
            wrong: chWrong,
            review: chReview,
            notDone: chNotDone,
            progress: chTotal > 0 ? ((chDone + chWrong) / chTotal) * 100 : 0
        });
    });
    
    const overallProgress = totalQ > 0 ? ((doneQ + wrongQ) / totalQ) * 100 : 0;
    const totalChapters = Object.keys(subject.chapters).length;
    
    const overview = document.createElement('div');
    overview.className = 'subject-overview';
    overview.innerHTML = `
        <div class="subject-overview-header">
            <div class="subject-overview-icon" style="background: #e5e7eb; color: #6b7280;"><i class="fas ${subject.icon}"></i></div>
            <div class="subject-overview-info">
                <h3>${subject.name}</h3>
                <p>${totalChapters} Chapters • ${totalQ} Questions</p>
            </div>
            <div style="font-size: 28px; font-weight: 800; color: #9ca3af">${Math.round(overallProgress)}%</div>
        </div>
        <div class="subject-overview-stats">
            <div class="subject-overview-stat"><span class="stat-number green"><i class="fas fa-check-circle"></i> ${doneQ}</span><span class="stat-label">Done</span></div>
            <div class="subject-overview-stat"><span class="stat-number red"><i class="fas fa-times-circle"></i> ${wrongQ}</span><span class="stat-label">Wrong</span></div>
            <div class="subject-overview-stat"><span class="stat-number yellow"><i class="fas fa-flag"></i> ${reviewQ}</span><span class="stat-label">Review</span></div>
            <div class="subject-overview-stat"><span class="stat-number gray"><i class="fas fa-circle"></i> ${notDoneQ}</span><span class="stat-label">Pending</span></div>
        </div>
    `;
    container.appendChild(overview);
    
    if (chapterData.length > 0) {
        const chapterTitle = document.createElement('h3');
        chapterTitle.style.cssText = 'font-size: 15px; font-weight: 600; margin: 16px 0 10px 0;';
        chapterTitle.innerHTML = `<i class="fas fa-book" style="color: #9ca3af"></i> Chapter-wise Progress`;
        container.appendChild(chapterTitle);
        
        const breakdown = document.createElement('div');
        breakdown.className = 'chapter-breakdown';
        chapterData.forEach(ch => {
            const item = document.createElement('div');
            item.className = 'chapter-breakdown-item';
            item.innerHTML = `
                <div class="chapter-row">
                    <span class="chapter-name">${ch.name}</span>
                    <span class="chapter-percent" style="color: #9ca3af">${Math.round(ch.progress)}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${Math.round(ch.progress)}%; background: #9ca3af"></div>
                </div>
                <div class="chapter-stats">
                    <span class="done"><i class="fas fa-check-circle"></i> ${ch.done}</span>
                    <span class="wrong"><i class="fas fa-times-circle"></i> ${ch.wrong}</span>
                    <span class="review"><i class="fas fa-flag"></i> ${ch.review}</span>
                    <span class="not-done"><i class="fas fa-circle"></i> ${ch.notDone}</span>
                    <span style="margin-left: auto;">${ch.total} total</span>
                </div>
            `;
            breakdown.appendChild(item);
        });
        container.appendChild(breakdown);
    } else {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-plus-circle"></i>
                <p>No chapters added yet</p>
                <p class="sub">Add chapters from the Subjects page</p>
            </div>
        `;
    }
}

// ============================================
// REVIEW BANK
// ============================================

function renderReviewBank() {
    const container = document.getElementById('reviewBankContainer');
    if (!container) return;
    container.innerHTML = '';
    
    let reviewQuestions = [];
    Object.keys(appData.subjects).forEach(subKey => {
        const subject = appData.subjects[subKey];
        if (currentReviewFilter !== 'all' && currentReviewFilter !== subKey) return;
        Object.keys(subject.chapters).forEach(chKey => {
            const chapter = subject.chapters[chKey];
            Object.keys(chapter.exercises).forEach(exKey => {
                const exercise = chapter.exercises[exKey];
                exercise.questions.forEach((status, index) => {
                    if (status === STATES.REVIEW) {
                        const noteKey = `${subKey}_${chKey}_${exKey}_${index}`;
                        reviewQuestions.push({
                            subject: subKey,
                            subjectName: subject.name,
                            subjectColor: '#9ca3af',
                            chapter: chKey,
                            chapterName: chapter.name,
                            exercise: exKey,
                            exerciseName: exercise.name,
                            questionIndex: index,
                            note: appData.questionNotes[noteKey] || '',
                            difficulty: appData.questionDifficulty[noteKey] || ''
                        });
                    }
                });
            });
        });
    });
    
    if (reviewQuestions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-flag"></i>
                <p>No questions marked for review</p>
                <span class="sub">Mark questions with "Review" to see them here</span>
            </div>
        `;
        return;
    }
    
    reviewQuestions.forEach((q) => {
        const item = document.createElement('div');
        item.className = 'bank-item';
        item.innerHTML = `
            <div class="bank-header">
                <span class="bank-question">Q${q.questionIndex + 1} - ${q.exerciseName}</span>
                <span class="bank-meta">
                    <span class="subject-tag" style="background: #e5e7eb; color: #6b7280;">${q.subjectName}</span>
                    <span>${q.chapterName}</span>
                    ${q.difficulty ? `<span class="q-difficulty ${q.difficulty}">${q.difficulty}</span>` : ''}
                </span>
            </div>
            <div class="bank-meta">
                <span>${q.exerciseName}</span>
                ${q.note ? `<span>📝 ${q.note}</span>` : ''}
            </div>
            <div class="bank-actions">
                <button class="view-btn" onclick="navigateToQuestion('${q.subject}', '${q.chapter}', '${q.exercise}', ${q.questionIndex})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="clear-btn" onclick="clearReviewStatus('${q.subject}', '${q.chapter}', '${q.exercise}', ${q.questionIndex})">
                    <i class="fas fa-check"></i> Clear Review
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

function navigateToQuestion(subjectKey, chapterKey, exerciseKey, questionIndex) {
    navigateTo('subject-detail', { subject: subjectKey });
    setTimeout(() => {
        navigateTo('chapter-detail', { subject: subjectKey, chapter: chapterKey });
        setTimeout(() => {
            navigateTo('exercise-detail', { subject: subjectKey, chapter: chapterKey, exercise: exerciseKey });
        }, 300);
    }, 300);
}

function clearReviewStatus(subjectKey, chapterKey, exerciseKey, questionIndex) {
    const subject = appData.subjects[subjectKey];
    const chapter = subject.chapters[chapterKey];
    const exercise = chapter.exercises[exerciseKey];
    exercise.questions[questionIndex] = STATES.NOT_DONE;
    saveData();
    renderReviewBank();
    renderDashboard();
}

// ============================================
// WRONG BANK
// ============================================

function renderWrongBank() {
    const container = document.getElementById('wrongBankContainer');
    if (!container) return;
    container.innerHTML = '';
    
    let wrongQuestions = [];
    Object.keys(appData.subjects).forEach(subKey => {
        const subject = appData.subjects[subKey];
        if (currentWrongFilter !== 'all' && currentWrongFilter !== subKey) return;
        Object.keys(subject.chapters).forEach(chKey => {
            const chapter = subject.chapters[chKey];
            Object.keys(chapter.exercises).forEach(exKey => {
                const exercise = chapter.exercises[exKey];
                exercise.questions.forEach((status, index) => {
                    if (status === STATES.WRONG) {
                        const noteKey = `${subKey}_${chKey}_${exKey}_${index}`;
                        wrongQuestions.push({
                            subject: subKey,
                            subjectName: subject.name,
                            subjectColor: '#9ca3af',
                            chapter: chKey,
                            chapterName: chapter.name,
                            exercise: exKey,
                            exerciseName: exercise.name,
                            questionIndex: index,
                            note: appData.questionNotes[noteKey] || '',
                            difficulty: appData.questionDifficulty[noteKey] || ''
                        });
                    }
                });
            });
        });
    });
    
    if (wrongQuestions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-times-circle"></i>
                <p>No questions marked as wrong</p>
                <span class="sub">Mark questions with "Wrong" to see them here</span>
            </div>
        `;
        return;
    }
    
    wrongQuestions.forEach((q) => {
        const item = document.createElement('div');
        item.className = 'bank-item';
        item.innerHTML = `
            <div class="bank-header">
                <span class="bank-question">Q${q.questionIndex + 1} - ${q.exerciseName}</span>
                <span class="bank-meta">
                    <span class="subject-tag" style="background: #e5e7eb; color: #6b7280;">${q.subjectName}</span>
                    <span>${q.chapterName}</span>
                    ${q.difficulty ? `<span class="q-difficulty ${q.difficulty}">${q.difficulty}</span>` : ''}
                </span>
            </div>
            <div class="bank-meta">
                <span>${q.exerciseName}</span>
                ${q.note ? `<span>📝 ${q.note}</span>` : ''}
            </div>
            <div class="bank-actions">
                <button class="view-btn" onclick="navigateToQuestion('${q.subject}', '${q.chapter}', '${q.exercise}', ${q.questionIndex})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="clear-btn" onclick="clearWrongStatus('${q.subject}', '${q.chapter}', '${q.exercise}', ${q.questionIndex})">
                    <i class="fas fa-check"></i> Clear Wrong
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

function clearWrongStatus(subjectKey, chapterKey, exerciseKey, questionIndex) {
    const subject = appData.subjects[subjectKey];
    const chapter = subject.chapters[chapterKey];
    const exercise = chapter.exercises[exerciseKey];
    exercise.questions[questionIndex] = STATES.NOT_DONE;
    saveData();
    renderWrongBank();
    renderDashboard();
}

// ============================================
// HOMEWORK
// ============================================

function renderHomework() {
    const container = document.getElementById('homeworkContainer');
    if (!container) return;
    container.innerHTML = '';
    
    let homework = appData.homework || [];
    const today = new Date().toISOString().split('T')[0];
    
    if (currentHwFilter === 'pending') {
        homework = homework.filter(h => !h.completed);
    } else if (currentHwFilter === 'due-today') {
        homework = homework.filter(h => !h.completed && h.dueDate === today);
    } else if (currentHwFilter === 'due-tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        homework = homework.filter(h => !h.completed && h.dueDate === tomorrowStr);
    } else if (currentHwFilter === 'overdue') {
        homework = homework.filter(h => !h.completed && h.dueDate < today);
    } else if (currentHwFilter === 'completed') {
        homework = homework.filter(h => h.completed);
    }
    
    if (homework.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>No homework found</p>
                <span class="sub">Click the + button to add homework</span>
            </div>
        `;
        return;
    }
    
    homework.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return a.dueDate.localeCompare(b.dueDate);
    });
    
    homework.forEach((hw, index) => {
        const isOverdue = !hw.completed && hw.dueDate < today;
        const isDueToday = !hw.completed && hw.dueDate === today;
        const priorityLabels = {
            'must-do': '🔥 Must Do',
            'important': '⭐ Important',
            'normal': '🟢 Normal'
        };
        
        if (hw.progress === undefined || hw.progress === null) {
            hw.progress = 0;
            hw.doneCount = 0;
            hw.reviewCount = 0;
            hw.totalCount = 0;
            
            const subject = appData.subjects[hw.subject];
            if (subject) {
                Object.keys(subject.chapters).forEach(chKey => {
                    const chapter = subject.chapters[chKey];
                    if (chapter.name === hw.chapter) {
                        const selectedQuestions = hw.selectedQuestions || [];
                        let total = 0, done = 0, review = 0;
                        
                        selectedQuestions.forEach(qKey => {
                            const [exKey, qIndex] = qKey.split('_');
                            const idx = parseInt(qIndex);
                            const ex = chapter.exercises[exKey];
                            if (ex && ex.questions && ex.questions[idx] !== undefined) {
                                total++;
                                const status = ex.questions[idx];
                                if (status === STATES.DONE) done++;
                                if (status === STATES.REVIEW) review++;
                            }
                        });
                        
                        hw.totalCount = total;
                        hw.doneCount = done;
                        hw.reviewCount = review;
                        hw.progress = total > 0 ? Math.round(((done + review) / total) * 100) : 0;
                        
                        if (total > 0 && (done + review) === total) {
                            hw.completed = true;
                            hw.completedAt = new Date().toISOString();
                        }
                    }
                });
            }
        }
        
        const item = document.createElement('div');
        item.className = `hw-item ${hw.completed ? 'completed' : ''}`;
        
        item.onclick = function(e) {
            if (e.target.closest('.hw-actions')) return;
            showHomeworkDetails(hw);
        };
        
        let progressColor = 'var(--red)';
        if (hw.progress >= 100) progressColor = 'var(--green)';
        else if (hw.progress >= 70) progressColor = 'var(--yellow)';
        else if (hw.progress >= 40) progressColor = 'var(--blue)';
        
        item.innerHTML = `
            <div class="hw-top">
                <span class="hw-title">${hw.subject} → ${hw.chapter}</span>
                <span class="hw-due ${isOverdue ? 'overdue' : isDueToday ? 'today' : ''}">
                    ${isOverdue ? '⚠️ Overdue' : isDueToday ? '📅 Due Today' : '📅 ' + formatDate(hw.dueDate)}
                </span>
            </div>
            <div class="hw-meta">
                <span>${hw.exercise}</span>
                <span class="hw-priority ${hw.priority || 'normal'}">${priorityLabels[hw.priority] || '🟢 Normal'}</span>
            </div>
            <div class="hw-progress">
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${hw.progress || 0}%; background: ${progressColor};"></div>
                </div>
                <div class="progress-label">
                    <span>${hw.doneCount || 0} Done + ${hw.reviewCount || 0} Review = ${hw.progress || 0}%</span>
                    <span>${hw.totalCount || 0} total</span>
                </div>
            </div>
            ${hw.completed ? '<span style="color: var(--green); font-size: 12px; font-weight: 600;">✅ Completed</span>' : ''}
            <div class="hw-actions">
                ${!hw.completed ? `
                    <button class="complete-btn" onclick="completeHomework(${index})"><i class="fas fa-check"></i> Complete</button>
                ` : `
                    <button onclick="uncompleteHomework(${index})"><i class="fas fa-undo"></i> Reopen</button>
                `}
                <button class="delete-btn" onclick="deleteHomework(${index})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function showHomeworkDetails(hw) {
    const oldPopup = document.getElementById('homeworkDetailsPopup');
    if (oldPopup) oldPopup.remove();
    
    const popup = document.createElement('div');
    popup.id = 'homeworkDetailsPopup';
    popup.className = 'hw-details-overlay';
    
    let questionDetails = [];
    let totalDone = 0;
    let totalReview = 0;
    let totalWrong = 0;
    let totalNotDone = 0;
    
    const selectedQuestions = hw.selectedQuestions || [];
    const subject = appData.subjects[hw.subject];
    
    if (subject) {
        Object.keys(subject.chapters).forEach(chKey => {
            const chapter = subject.chapters[chKey];
            if (chapter.name === hw.chapter) {
                selectedQuestions.forEach(qKey => {
                    const [exKey, qIndex] = qKey.split('_');
                    const idx = parseInt(qIndex);
                    const ex = chapter.exercises[exKey];
                    if (ex && ex.questions && ex.questions[idx] !== undefined) {
                        const status = ex.questions[idx];
                        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
                        const statusIcon = STATE_ICONS[status] || 'fa-circle';
                        const statusColor = status === STATES.DONE ? 'var(--green)' :
                            status === STATES.REVIEW ? 'var(--yellow)' :
                            status === STATES.WRONG ? 'var(--red)' : 'var(--text-muted)';
                        
                        if (status === STATES.DONE) totalDone++;
                        else if (status === STATES.REVIEW) totalReview++;
                        else if (status === STATES.WRONG) totalWrong++;
                        else totalNotDone++;
                        
                        questionDetails.push({
                            exercise: ex.name,
                            question: idx + 1,
                            status: status,
                            statusLabel: statusLabel,
                            statusIcon: statusIcon,
                            statusColor: statusColor,
                            isDone: status === STATES.DONE || status === STATES.REVIEW
                        });
                    }
                });
            }
        });
    }
    
    const totalQuestions = questionDetails.length;
    const completedQuestions = totalDone + totalReview;
    const progress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
    
    const summaryHTML = `
        <div class="hw-detail-summary">
            <div class="hw-detail-stat">
                <span class="stat-number green">${totalDone}</span>
                <span class="stat-label">Done</span>
            </div>
            <div class="hw-detail-stat">
                <span class="stat-number yellow">${totalReview}</span>
                <span class="stat-label">Review</span>
            </div>
            <div class="hw-detail-stat">
                <span class="stat-number red">${totalWrong}</span>
                <span class="stat-label">Wrong</span>
            </div>
            <div class="hw-detail-stat">
                <span class="stat-number gray">${totalNotDone}</span>
                <span class="stat-label">Pending</span>
            </div>
        </div>
    `;
    
    let questionBoxes = '';
    if (questionDetails.length > 0) {
        questionBoxes = questionDetails.map(q => `
            <div class="hw-detail-q ${q.status}" style="border-color: ${q.statusColor};">
                <span class="q-num">Q${q.question}</span>
                <span class="q-status-icon"><i class="fas ${q.statusIcon}" style="color: ${q.statusColor};"></i></span>
                <span class="q-status-label">${q.statusLabel}</span>
            </div>
        `).join('');
    } else {
        questionBoxes = `<div class="hw-detail-empty">No specific questions selected</div>`;
    }
    
    popup.innerHTML = `
        <div class="hw-details-card">
            <div class="hw-details-header">
                <div>
                    <div class="hw-details-label">📋 HOMEWORK</div>
                    <h3>${hw.subject || 'Subject'} → ${hw.chapter || 'Chapter'}</h3>
                </div>
                <button class="hw-details-close" onclick="closeHomeworkDetails()">×</button>
            </div>
            
            <div class="hw-detail-info-row">
                <div class="hw-detail-info-item">
                    <span class="label">Exercise</span>
                    <span class="value">${hw.exercise || '—'}</span>
                </div>
                <div class="hw-detail-info-item">
                    <span class="label">Due Date</span>
                    <span class="value">${hw.dueDate ? formatDate(hw.dueDate) : '—'}</span>
                </div>
                <div class="hw-detail-info-item">
                    <span class="label">Status</span>
                    <span class="value" style="color: ${hw.completed ? 'var(--green)' : 'var(--yellow)'}">
                        ${hw.completed ? '✅ Completed' : '🔄 In Progress'}
                    </span>
                </div>
            </div>
            
            <div class="hw-detail-progress">
                <div class="progress-track" style="height: 8px;">
                    <div class="progress-fill" style="width: ${progress}%; background: ${progress >= 100 ? 'var(--green)' : progress >= 70 ? 'var(--yellow)' : 'var(--blue)'};"></div>
                </div>
                <div class="progress-text">${progress}% Complete (${completedQuestions}/${totalQuestions})</div>
            </div>
            
            ${summaryHTML}
            
            <div class="hw-detail-questions-section">
                <div class="hw-detail-questions-title">
                    <i class="fas fa-list-check"></i> Questions
                    <span class="badge">${totalQuestions} total</span>
                </div>
                <div class="hw-detail-questions-grid">
                    ${questionBoxes}
                </div>
            </div>
            
            ${hw.completed ? `
                <div class="hw-detail-completed-badge">
                    <i class="fas fa-check-circle"></i> Completed on ${hw.completedAt ? formatDate(hw.completedAt) : 'recently'}
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(popup);
    
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closeHomeworkDetails();
        }
    });
}

function closeHomeworkDetails() {
    document.getElementById('homeworkDetailsPopup')?.remove();
}

function completeHomework(index) {
    appData.homework[index].completed = true;
    saveData();
    renderHomework();
    renderDashboard();
}

function uncompleteHomework(index) {
    appData.homework[index].completed = false;
    saveData();
    renderHomework();
    renderDashboard();
}

function deleteHomework(index) {
    if (confirm('Delete this homework?')) {
        appData.homework.splice(index, 1);
        saveData();
        renderHomework();
        renderDashboard();
    }
}

// ============================================
// HOMEWORK MODAL - CASCADING LOGIC
// ============================================

function showAddHomeworkModal() {
    const modal = document.getElementById('addHomeworkModal');
    if (modal) modal.classList.add('active');
    
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('hwDateInput');
    if (dateInput) dateInput.value = today;
    
    const deadlineInput = document.getElementById('hwDeadlineInput');
    if (deadlineInput) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        deadlineInput.value = nextWeek.toISOString().split('T')[0];
    }
    
    homeworkSelectedExercises = [];
    homeworkSelectedQuestions = [];
    
    const subjectSelect = document.getElementById('hwSubjectSelect');
    if (subjectSelect) {
        subjectSelect.innerHTML = '<option value="">Select a subject...</option>';
        Object.keys(appData.subjects).forEach(key => {
            const subject = appData.subjects[key];
            const option = document.createElement('option');
            option.value = key;
            option.textContent = subject.name;
            subjectSelect.appendChild(option);
        });
    }
    
    const chapterSelect = document.getElementById('hwChapterSelect');
    if (chapterSelect) {
        chapterSelect.innerHTML = '<option value="">Select a subject first...</option>';
        chapterSelect.disabled = true;
    }
    
    const exerciseContainer = document.getElementById('hwExerciseContainer');
    if (exerciseContainer) {
        exerciseContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">Select a chapter first...</p>';
    }
    
    const questionGrid = document.getElementById('hwQuestionGrid');
    if (questionGrid) {
        questionGrid.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">Select exercises first...</p>';
    }
    
    const selectedCount = document.getElementById('hwSelectedCount');
    if (selectedCount) selectedCount.textContent = '0';
}

function hideAddHomeworkModal() {
    const modal = document.getElementById('addHomeworkModal');
    if (modal) modal.classList.remove('active');
}

function loadHomeworkChapters() {
    const subjectSelect = document.getElementById('hwSubjectSelect');
    const subjectKey = subjectSelect ? subjectSelect.value : '';
    const chapterSelect = document.getElementById('hwChapterSelect');
    const exerciseContainer = document.getElementById('hwExerciseContainer');
    const questionGrid = document.getElementById('hwQuestionGrid');
    
    if (!subjectKey || !appData.subjects[subjectKey]) {
        if (chapterSelect) {
            chapterSelect.innerHTML = '<option value="">Select a subject first...</option>';
            chapterSelect.disabled = true;
        }
        if (exerciseContainer) {
            exerciseContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">Select a chapter first...</p>';
        }
        if (questionGrid) {
            questionGrid.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">Select exercises first...</p>';
        }
        return;
    }
    
    const subject = appData.subjects[subjectKey];
    const chapterKeys = Object.keys(subject.chapters);
    
    if (chapterSelect) {
        chapterSelect.innerHTML = '<option value="">Select a chapter...</option>';
        chapterKeys.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = subject.chapters[key].name;
            chapterSelect.appendChild(option);
        });
        chapterSelect.disabled = false;
    }
    
    if (exerciseContainer) {
        exerciseContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">Select a chapter first...</p>';
    }
    if (questionGrid) {
        questionGrid.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">Select exercises first...</p>';
    }
    
    homeworkSelectedExercises = [];
    homeworkSelectedQuestions = [];
    updateHomeworkSelectedCount();
}

function loadHomeworkExercises() {
    const subjectSelect = document.getElementById('hwSubjectSelect');
    const chapterSelect = document.getElementById('hwChapterSelect');
    const exerciseContainer = document.getElementById('hwExerciseContainer');
    const questionGrid = document.getElementById('hwQuestionGrid');
    
    const subjectKey = subjectSelect ? subjectSelect.value : '';
    const chapterKey = chapterSelect ? chapterSelect.value : '';
    
    if (!subjectKey || !chapterKey || !appData.subjects[subjectKey]) {
        if (exerciseContainer) {
            exerciseContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">Select a chapter first...</p>';
        }
        if (questionGrid) {
            questionGrid.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">Select exercises first...</p>';
        }
        return;
    }
    
    const subject = appData.subjects[subjectKey];
    const chapter = subject.chapters[chapterKey];
    const exerciseKeys = Object.keys(chapter.exercises);
    
    if (exerciseContainer) {
        exerciseContainer.innerHTML = '';
        exerciseKeys.forEach(key => {
            const exercise = chapter.exercises[key];
            const label = document.createElement('label');
            label.className = 'hw-exercise-checkbox';
            label.innerHTML = `
                <input type="checkbox" value="${key}">
                <span>${exercise.name} (${exercise.questions.length} Qs)</span>
            `;
            label.addEventListener('click', function(e) {
                e.preventDefault();
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                this.classList.toggle('selected', checkbox.checked);
                updateHomeworkExercises();
            });
            exerciseContainer.appendChild(label);
        });
    }
    
    homeworkSelectedExercises = [];
    homeworkSelectedQuestions = [];
    updateHomeworkSelectedCount();
    
    if (questionGrid) {
        questionGrid.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">Select exercises to see questions</p>';
    }
}

function updateHomeworkExercises() {
    const subjectSelect = document.getElementById('hwSubjectSelect');
    const chapterSelect = document.getElementById('hwChapterSelect');
    const questionGrid = document.getElementById('hwQuestionGrid');
    
    const subjectKey = subjectSelect ? subjectSelect.value : '';
    const chapterKey = chapterSelect ? chapterSelect.value : '';
    
    if (!subjectKey || !chapterKey || !appData.subjects[subjectKey]) {
        return;
    }
    
    const subject = appData.subjects[subjectKey];
    const chapter = subject.chapters[chapterKey];
    
    const exerciseContainer = document.getElementById('hwExerciseContainer');
    const checkboxes = exerciseContainer ? exerciseContainer.querySelectorAll('input[type="checkbox"]:checked') : [];
    homeworkSelectedExercises = Array.from(checkboxes).map(cb => cb.value);
    
    if (homeworkSelectedExercises.length === 0) {
        if (questionGrid) {
            questionGrid.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">Select exercises to see questions</p>';
        }
        homeworkSelectedQuestions = [];
        updateHomeworkSelectedCount();
        return;
    }
    
    let gridHtml = '';
    homeworkSelectedQuestions = [];
    
    homeworkSelectedExercises.forEach(exKey => {
        const exercise = chapter.exercises[exKey];
        const questions = exercise.questions || [];
        
        gridHtml += `<div class="hw-q-section">`;
        gridHtml += `<div class="hw-q-section-title">${exercise.name} (${questions.length} Qs)</div>`;
        gridHtml += `<div class="hw-q-grid">`;
        
        questions.forEach((status, idx) => {
            const qNum = idx + 1;
            const hasStatus = status !== STATES.NOT_DONE;
            const statusClass = hasStatus ? `has-status ${status}` : '';
            const selected = homeworkSelectedQuestions.includes(`${exKey}_${idx}`);
            
            gridHtml += `
                <div class="hw-q-box ${statusClass} ${selected ? 'selected' : ''}" 
                     data-exercise="${exKey}" 
                     data-index="${idx}"
                     onclick="toggleHomeworkQuestion('${exKey}', ${idx})">
                    ${qNum}
                </div>
            `;
        });
        
        gridHtml += `</div></div>`;
    });
    
    if (questionGrid) {
        questionGrid.innerHTML = gridHtml;
    }
    
    updateHomeworkSelectedCount();
}

function toggleHomeworkQuestion(exerciseKey, index) {
    console.log('🔘 Toggling question:', exerciseKey, index);
    const key = `${exerciseKey}_${index}`;
    const idx = homeworkSelectedQuestions.indexOf(key);
    
    if (idx > -1) {
        homeworkSelectedQuestions.splice(idx, 1);
        console.log('❌ Removed question:', key);
    } else {
        homeworkSelectedQuestions.push(key);
        console.log('✅ Added question:', key);
    }
    
    const grid = document.getElementById('hwQuestionGrid');
    if (grid) {
        const boxes = grid.querySelectorAll('.hw-q-box');
        boxes.forEach(box => {
            const exKey = box.dataset.exercise;
            const idx = parseInt(box.dataset.index);
            const boxKey = `${exKey}_${idx}`;
            if (homeworkSelectedQuestions.includes(boxKey)) {
                box.classList.add('selected');
            } else {
                box.classList.remove('selected');
            }
        });
    }
    
    updateHomeworkSelectedCount();
}

function updateHomeworkSelectedCount() {
    const countEl = document.getElementById('hwSelectedCount');
    if (countEl) {
        countEl.textContent = homeworkSelectedQuestions.length;
    }
}

function addHomework() {
    const subjectSelect = document.getElementById('hwSubjectSelect');
    const chapterSelect = document.getElementById('hwChapterSelect');
    const dateInput = document.getElementById('hwDateInput');
    const deadlineInput = document.getElementById('hwDeadlineInput');
    const prioritySelect = document.getElementById('hwPrioritySelect');
    
    const subject = subjectSelect ? subjectSelect.value : '';
    const chapterKey = chapterSelect ? chapterSelect.value : '';
    const dueDate = dateInput ? dateInput.value : '';
    const deadline = deadlineInput ? deadlineInput.value : '';
    const priority = prioritySelect ? prioritySelect.value : 'normal';
    
    if (!subject) {
        showToast('Please select a subject', 'error');
        return;
    }
    
    if (!chapterKey) {
        showToast('Please select a chapter', 'error');
        return;
    }
    
    if (homeworkSelectedExercises.length === 0) {
        showToast('Please select at least one exercise', 'error');
        return;
    }
    
    if (homeworkSelectedQuestions.length === 0) {
        showToast('Please select at least one question', 'error');
        return;
    }
    
    if (!dueDate) {
        showToast('Please select a homework date', 'error');
        return;
    }
    
    const subjectObj = appData.subjects[subject];
    const chapter = subjectObj.chapters[chapterKey];
    
    const exerciseNames = homeworkSelectedExercises.map(exKey => chapter.exercises[exKey].name);
    
    const questionNumbers = homeworkSelectedQuestions.map(q => {
        const [exKey, idx] = q.split('_');
        return `${chapter.exercises[exKey].name} Q${parseInt(idx) + 1}`;
    }).join(', ');
    
    if (!appData.homework) appData.homework = [];
    appData.homework.push({
        subject: subject,
        chapter: chapter.name,
        exercise: exerciseNames.join(', '),
        questions: questionNumbers,
        dueDate: dueDate,
        deadline: deadline || dueDate,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString(),
        progress: 0,
        doneCount: 0,
        totalCount: homeworkSelectedQuestions.length,
        selectedExercises: homeworkSelectedExercises,
        selectedQuestions: homeworkSelectedQuestions
    });
    
    saveData();
    hideAddHomeworkModal();
    renderHomework();
    renderDashboard();
    showToast('✅ Homework added successfully!', 'success');
}

// ============================================
// GOALS
// ============================================

function renderGoalsPage() {
    const dailyGoal = appData.goals.daily || 50;
    const weeklyGoal = appData.goals.weekly || 350;
    const monthlyGoal = appData.goals.monthly || 1500;
    
    const dg = document.getElementById('dailyGoalInput');
    const wg = document.getElementById('weeklyGoalInput');
    const mg = document.getElementById('monthlyGoalInput');
    if (dg) dg.value = dailyGoal;
    if (wg) wg.value = weeklyGoal;
    if (mg) mg.value = monthlyGoal;
    
    const today = new Date().toISOString().split('T')[0];
    const todaySolved = appData.streak.todaySolved || 0;
    const elToday = document.getElementById('goalsTodaySolved');
    const elDailyTarget = document.getElementById('goalsDailyTarget');
    const elDailyFill = document.getElementById('goalsDailyFill');
    if (elToday) elToday.textContent = todaySolved;
    if (elDailyTarget) elDailyTarget.textContent = dailyGoal;
    if (elDailyFill) elDailyFill.style.width = Math.min(100, (todaySolved / dailyGoal) * 100) + '%';
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    let weekSolved = 0;
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        weekSolved += appData.heatmap[dateStr] || 0;
    }
    const elWeekly = document.getElementById('goalsWeeklySolved');
    const elWeeklyTarget = document.getElementById('goalsWeeklyTarget');
    const elWeeklyFill = document.getElementById('goalsWeeklyFill');
    if (elWeekly) elWeekly.textContent = weekSolved;
    if (elWeeklyTarget) elWeeklyTarget.textContent = weeklyGoal;
    if (elWeeklyFill) elWeeklyFill.style.width = Math.min(100, (weekSolved / weeklyGoal) * 100) + '%';
    
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    let monthSolved = 0;
    for (const [date, count] of Object.entries(appData.heatmap)) {
        if (date >= monthStartStr) {
            monthSolved += count;
        }
    }
    const elMonthly = document.getElementById('goalsMonthlySolved');
    const elMonthlyTarget = document.getElementById('goalsMonthlyTarget');
    const elMonthlyFill = document.getElementById('goalsMonthlyFill');
    if (elMonthly) elMonthly.textContent = monthSolved;
    if (elMonthlyTarget) elMonthlyTarget.textContent = monthlyGoal;
    if (elMonthlyFill) elMonthlyFill.style.width = Math.min(100, (monthSolved / monthlyGoal) * 100) + '%';
}

// ============================================
// REVISION
// ============================================

function renderRevisionPage() {
    const container = document.getElementById('revisionContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const revisions = appData.revisionLists || [];
    if (revisions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sync"></i>
                <p>No revision lists yet</p>
                <span class="sub">Click the + button to create one</span>
            </div>
        `;
        return;
    }
    
    revisions.forEach((rev, index) => {
        const questions = rev.questions ? rev.questions.split(',').map(q => q.trim()) : [];
        const priorityLabels = {
            'must-do': '🔥 Must Do',
            'important': '⭐ Important',
            'normal': '🟢 Normal'
        };
        
        const item = document.createElement('div');
        item.className = 'revision-item';
        item.innerHTML = `
            <div class="rev-header">
                <span class="rev-name">${rev.name}</span>
                <span class="rev-priority ${rev.priority || 'normal'}">${priorityLabels[rev.priority] || '🟢 Normal'}</span>
            </div>
            <div class="rev-meta">${rev.subject} • ${questions.length} questions</div>
            <div class="rev-questions">${rev.questions || ''}</div>
            <div class="rev-actions">
                <button class="revise-btn" onclick="startRevision(${index})"><i class="fas fa-play"></i> Revise</button>
                <button class="delete-btn" onclick="deleteRevision(${index})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function startRevision(index) {
    const rev = appData.revisionLists[index];
    alert(`Starting revision: ${rev.name}\n${rev.subject}\nQuestions: ${rev.questions}`);
}

function deleteRevision(index) {
    if (confirm('Delete this revision list?')) {
        appData.revisionLists.splice(index, 1);
        saveData();
        renderRevisionPage();
    }
}

// ============================================
// HEATMAP
// ============================================

function renderHeatmap() {
    const container = document.getElementById('heatmapContainer');
    if (!container) return;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 6);
    
    let html = '';
    let currentMonth = '';
    
    html += `<div class="heatmap-day-labels">${days.map(d => `<span>${d[0]}</span>`).join('')}</div>`;
    html += `<div class="heatmap-grid">`;
    
    const currentDate = new Date(startDate);
    while (currentDate <= today) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = appData.heatmap[dateStr] || 0;
        let level = 0;
        if (count > 0) level = 1;
        if (count >= 5) level = 2;
        if (count >= 10) level = 3;
        if (count >= 20) level = 4;
        if (count >= 40) level = 5;
        
        const month = months[currentDate.getMonth()];
        if (month !== currentMonth) {
            currentMonth = month;
            html += `<div class="heatmap-month" style="grid-column: 1 / -1; margin-top: 4px;">${month}</div>`;
        }
        html += `<div class="heatmap-cell level-${level}" title="${dateStr}: ${count} questions"></div>`;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    html += `</div>`;
    html += `
        <div class="heatmap-legend">
            <span>Less</span>
            <div class="legend-dots">
                <span class="legend-dot l0"></span>
                <span class="legend-dot l1"></span>
                <span class="legend-dot l2"></span>
                <span class="legend-dot l3"></span>
                <span class="legend-dot l4"></span>
                <span class="legend-dot l5"></span>
            </div>
            <span>More</span>
        </div>
    `;
    container.innerHTML = html;
}

// ============================================
// ACHIEVEMENTS
// ============================================

function renderAchievements() {
    const container = document.getElementById('achievementsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    let totalQ = 0, doneQ = 0, subjectsComplete = 0, chaptersComplete = 0;
    let totalHomeworkCompleted = 0, totalNotes = 0, wrongCount = 0, reviewCount = 0;
    let revisionCount = appData.revisionLists?.length || 0;
    
    Object.keys(appData.subjects).forEach(subKey => {
        const subject = appData.subjects[subKey];
        let subComplete = true;
        Object.keys(subject.chapters).forEach(chKey => {
            const chapter = subject.chapters[chKey];
            let chComplete = true;
            Object.keys(chapter.exercises).forEach(exKey => {
                const exercise = chapter.exercises[exKey];
                const questions = exercise.questions || [];
                totalQ += questions.length;
                const done = questions.filter(q => q === STATES.DONE || q === STATES.WRONG).length;
                doneQ += done;
                if (done < questions.length) {
                    chComplete = false;
                    subComplete = false;
                }
            });
            if (chComplete) chaptersComplete++;
        });
        if (subComplete && Object.keys(subject.chapters).length > 0) subjectsComplete++;
    });
    
    totalHomeworkCompleted = appData.homework?.filter(h => h.completed).length || 0;
    totalNotes = Object.keys(appData.questionNotes).length || 0;
    wrongCount = Object.values(appData.subjects).reduce((acc, sub) => {
        Object.values(sub.chapters).forEach(ch => {
            Object.values(ch.exercises).forEach(ex => {
                acc += ex.questions?.filter(q => q === STATES.WRONG).length || 0;
            });
        });
        return acc;
    }, 0);
    reviewCount = Object.values(appData.subjects).reduce((acc, sub) => {
        Object.values(sub.chapters).forEach(ch => {
            Object.values(ch.exercises).forEach(ex => {
                acc += ex.questions?.filter(q => q === STATES.REVIEW).length || 0;
            });
        });
        return acc;
    }, 0);
    
    const unlocked = appData.achievements.unlocked || [];
    const streak = appData.streak.current || 0;
    
    const checkUnlocked = (id) => {
        if (id === 'first-question' && doneQ >= 1) return true;
        if (id === 'q10' && doneQ >= 10) return true;
        if (id === 'q50' && doneQ >= 50) return true;
        if (id === 'q100' && doneQ >= 100) return true;
        if (id === 'q250' && doneQ >= 250) return true;
        if (id === 'q500' && doneQ >= 500) return true;
        if (id === 'q1000' && doneQ >= 1000) return true;
        if (id === 'q2500' && doneQ >= 2500) return true;
        if (id === 'q5000' && doneQ >= 5000) return true;
        if (id === 'streak3' && streak >= 3) return true;
        if (id === 'streak7' && streak >= 7) return true;
        if (id === 'streak14' && streak >= 14) return true;
        if (id === 'streak30' && streak >= 30) return true;
        if (id === 'streak60' && streak >= 60) return true;
        if (id === 'streak100' && streak >= 100) return true;
        if (id === 'subject-master' && subjectsComplete >= 1) return true;
        if (id === 'chapter-master' && chaptersComplete >= 1) return true;
        if (id === 'all-subjects' && subjectsComplete >= 5) return true;
        if (id === 'homework-10' && totalHomeworkCompleted >= 10) return true;
        if (id === 'homework-50' && totalHomeworkCompleted >= 50) return true;
        if (id === 'perfect-day' && appData.streak.todaySolved >= appData.goals.daily) return true;
        if (id === 'revision-5' && revisionCount >= 5) return true;
        if (id === 'notes-10' && totalNotes >= 10) return true;
        if (id === 'wrong-10' && wrongCount >= 10) return true;
        if (id === 'review-10' && reviewCount >= 10) return true;
        return false;
    };
    
    ACHIEVEMENTS.forEach(ach => {
        const isUnlocked = checkUnlocked(ach.id);
        if (isUnlocked && !unlocked.includes(ach.id)) {
            unlocked.push(ach.id);
            appData.achievements.unlocked = unlocked;
            saveData();
            showToast(`🏆 New Achievement: ${ach.name}!`, 'success');
        }
        
        const item = document.createElement('div');
        item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        item.innerHTML = `
            <span class="achievement-icon">${ach.icon}</span>
            <span class="achievement-name">${ach.name}</span>
            <span class="achievement-desc">${ach.desc}</span>
            ${isUnlocked ? '<span style="color: var(--green); font-size: 11px;">✅ Unlocked</span>' : '<span style="color: var(--text-muted); font-size: 11px;">🔒 Locked</span>'}
        `;
        container.appendChild(item);
    });
}

function checkAchievements() {}

// ============================================
// EXAM MODE
// ============================================

function renderExamMode() {
    const toggle = document.getElementById('examModeToggle');
    if (toggle) toggle.checked = appData.examMode || false;
    
    let wrongCount = 0, reviewCount = 0, hardCount = 0, homeworkPending = 0;
    let examQuestions = [];
    
    Object.keys(appData.subjects).forEach(subKey => {
        const subject = appData.subjects[subKey];
        Object.keys(subject.chapters).forEach(chKey => {
            const chapter = subject.chapters[chKey];
            Object.keys(chapter.exercises).forEach(exKey => {
                const exercise = chapter.exercises[exKey];
                exercise.questions.forEach((status, index) => {
                    const noteKey = `${subKey}_${chKey}_${exKey}_${index}`;
                    const difficulty = appData.questionDifficulty[noteKey] || '';
                    if (status === STATES.WRONG) {
                        wrongCount++;
                        examQuestions.push({ subject: subKey, chapter: chKey, exercise: exKey, index, status: 'Wrong', difficulty, type: 'wrong' });
                    }
                    if (status === STATES.REVIEW) {
                        reviewCount++;
                        examQuestions.push({ subject: subKey, chapter: chKey, exercise: exKey, index, status: 'Review', difficulty, type: 'review' });
                    }
                    if (difficulty === 'hard' && status !== STATES.DONE) {
                        hardCount++;
                        examQuestions.push({ subject: subKey, chapter: chKey, exercise: exKey, index, status: 'Hard', difficulty, type: 'hard' });
                    }
                });
            });
        });
    });
    
    const homework = appData.homework || [];
    homeworkPending = homework.filter(h => !h.completed).length;
    
    // Update stats
    const ids = ['examWrong', 'examReview', 'examHard', 'examHomework'];
    const values = [wrongCount, reviewCount, hardCount, homeworkPending];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = values[i];
    });
    
    // Update count
    const countEl = document.getElementById('examQuestionsCount');
    if (countEl) {
        const filtered = getFilteredExamQuestions(examQuestions);
        countEl.textContent = filtered.length;
    }
    
    // Render questions
    renderExamQuestions(examQuestions);
}

// Separate function for filtering
function getFilteredExamQuestions(questions) {
    const filter = document.querySelector('.exam-filter-btn.active');
    const filterType = filter ? filter.dataset.filter : 'all';
    
    if (filterType === 'all') return questions;
    return questions.filter(q => q.type === filterType);
}

// Render questions with filter
function renderExamQuestions(allQuestions) {
    const container = document.getElementById('examQuestionsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const filtered = getFilteredExamQuestions(allQuestions);
    
    // Update count
    const countEl = document.getElementById('examQuestionsCount');
    if (countEl) countEl.textContent = filtered.length;
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <p>No questions to review</p>
                <span class="sub">Mark questions as Wrong, Review, or Hard to see them here</span>
            </div>
        `;
        return;
    }
    
    filtered.forEach((q) => {
        const item = document.createElement('div');
        item.className = 'exam-question-item';
        const statusClass = q.status.toLowerCase();
        const subjectName = appData.subjects[q.subject]?.name || q.subject;
        
        item.innerHTML = `
            <div class="exam-q-info">
                <span class="q-number">Q${q.index + 1}</span>
                <span class="q-path">${subjectName} → ${q.chapter}</span>
                <span class="exam-q-status ${statusClass}">${q.status}</span>
                ${q.difficulty ? `<span class="q-difficulty ${q.difficulty}">${q.difficulty}</span>` : ''}
            </div>
            <button class="exam-q-action" onclick="navigateToQuestion('${q.subject}', '${q.chapter}', '${q.exercise}', ${q.index})">
                <i class="fas fa-eye"></i> View
            </button>
        `;
        container.appendChild(item);
    });
}

// Filter function
function filterExamQuestions(type) {
    // Update active filter button
    document.querySelectorAll('.exam-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === type);
    });
    
    // Re-render questions
    const toggle = document.getElementById('examModeToggle');
    if (toggle) toggle.checked = appData.examMode || false;
    
    let examQuestions = [];
    Object.keys(appData.subjects).forEach(subKey => {
        const subject = appData.subjects[subKey];
        Object.keys(subject.chapters).forEach(chKey => {
            const chapter = subject.chapters[chKey];
            Object.keys(chapter.exercises).forEach(exKey => {
                const exercise = chapter.exercises[exKey];
                exercise.questions.forEach((status, index) => {
                    const noteKey = `${subKey}_${chKey}_${exKey}_${index}`;
                    const difficulty = appData.questionDifficulty[noteKey] || '';
                    if (status === STATES.WRONG) {
                        examQuestions.push({ subject: subKey, chapter: chKey, exercise: exKey, index, status: 'Wrong', difficulty, type: 'wrong' });
                    }
                    if (status === STATES.REVIEW) {
                        examQuestions.push({ subject: subKey, chapter: chKey, exercise: exKey, index, status: 'Review', difficulty, type: 'review' });
                    }
                    if (difficulty === 'hard' && status !== STATES.DONE) {
                        examQuestions.push({ subject: subKey, chapter: chKey, exercise: exKey, index, status: 'Hard', difficulty, type: 'hard' });
                    }
                });
            });
        });
    });
    
    renderExamQuestions(examQuestions);
}

// Expose filter function globally
window.filterExamQuestions = filterExamQuestions;

// ============================================
// PROFILE PAGE
// ============================================

function renderProfilePage() {
    const profile = appData.profile || { name: '', username: '', phone: '', class: '', targetExam: 'JEE Main 2026', coaching: '', dailyGoal: 50, avatarUrl: '' };
    
    const viewName = document.getElementById('profileViewName');
    const viewUsername = document.getElementById('profileViewUsername');
    const viewEmail = document.getElementById('profileViewEmail');
    const viewPhone = document.getElementById('profileViewPhone');
    const viewClass = document.getElementById('profileViewClass');
    const viewExam = document.getElementById('profileViewExam');
    const viewCoaching = document.getElementById('profileViewCoaching');
    const viewDailyGoal = document.getElementById('profileViewDailyGoal');
    const viewStreak = document.getElementById('profileViewStreak');
    const viewJoined = document.getElementById('profileViewJoined');
    const viewAvatar = document.getElementById('profileViewAvatar');
    const viewVersion = document.getElementById('profileViewVersion');
    const viewLastSync = document.getElementById('profileLastSync');
    
    if (viewName) viewName.textContent = profile.name || 'Not set';
    if (viewUsername) viewUsername.textContent = profile.username || 'username';
    if (viewEmail) viewEmail.textContent = localStorage.getItem('jeeUserEmail') || 'user@example.com';
    if (viewPhone) viewPhone.textContent = profile.phone || 'Not set';
    if (viewClass) viewClass.textContent = profile.class || 'Not set';
    if (viewExam) viewExam.textContent = profile.targetExam || 'JEE Main 2026';
    if (viewCoaching) viewCoaching.textContent = profile.coaching || 'Not set';
    if (viewDailyGoal) viewDailyGoal.textContent = profile.dailyGoal || 50;
    if (viewStreak) viewStreak.textContent = (appData.streak.current || 0) + ' days';
    if (viewJoined) viewJoined.textContent = appData.joinDate ? formatDate(appData.joinDate) : 'Not set';
    if (viewVersion) viewVersion.textContent = 'v1.0.0';
    if (viewLastSync) viewLastSync.textContent = appData.lastBackup ? formatDate(appData.lastBackup) : 'Never';
    
    if (viewAvatar) {
        if (profile.avatarUrl) {
            viewAvatar.src = profile.avatarUrl;
        } else if (profile.name) {
            viewAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=9ca3af&color=fff&size=100`;
        } else {
            viewAvatar.src = 'https://ui-avatars.com/api/?name=JEE&background=9ca3af&color=fff&size=100';
        }
    }
    
    const editName = document.getElementById('profileEditName');
    const editUsername = document.getElementById('profileEditUsername');
    const editPhone = document.getElementById('profileEditPhone');
    const editClass = document.getElementById('profileEditClass');
    const editTargetExam = document.getElementById('profileEditTargetExam');
    const editCoaching = document.getElementById('profileEditCoaching');
    const editDailyGoal = document.getElementById('profileEditDailyGoal');
    const editAvatar = document.getElementById('profileEditAvatar');
    
    if (editName) editName.value = profile.name || '';
    if (editUsername) editUsername.value = profile.username || '';
    if (editPhone) editPhone.value = profile.phone || '';
    if (editClass) editClass.value = profile.class || '11th';
    if (editTargetExam) editTargetExam.value = profile.targetExam || 'JEE Main 2026';
    if (editCoaching) editCoaching.value = profile.coaching || '';
    if (editDailyGoal) editDailyGoal.value = profile.dailyGoal || 50;
    
    if (editAvatar) {
        if (profile.avatarUrl) {
            editAvatar.src = profile.avatarUrl;
        } else if (profile.name) {
            editAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=9ca3af&color=fff&size=100`;
        } else {
            editAvatar.src = 'https://ui-avatars.com/api/?name=JEE&background=9ca3af&color=fff&size=100';
        }
    }
    
    let totalQ = 0, doneQ = 0, wrongQ = 0, reviewQ = 0;
    Object.keys(appData.subjects).forEach(subKey => {
        const subject = appData.subjects[subKey];
        Object.keys(subject.chapters).forEach(chKey => {
            const chapter = subject.chapters[chKey];
            Object.keys(chapter.exercises).forEach(exKey => {
                const exercise = chapter.exercises[exKey];
                const questions = exercise.questions || [];
                totalQ += questions.length;
                doneQ += questions.filter(q => q === STATES.DONE).length;
                wrongQ += questions.filter(q => q === STATES.WRONG).length;
                reviewQ += questions.filter(q => q === STATES.REVIEW).length;
            });
        });
    });
    
    const ids = ['profileTotalQuestions', 'profileDoneQuestions', 'profileWrongQuestions', 'profileReviewQuestions', 'profileStreak'];
    const values = [totalQ, doneQ, wrongQ, reviewQ, appData.streak.current || 0];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = values[i];
    });
    
    const syncStatus = document.getElementById('profileViewSyncStatus');
    if (syncStatus) syncStatus.textContent = typeof syncEnabled !== 'undefined' && syncEnabled ? '☁ Synced' : '☁ Local Only';
}

function updateProfileUI() {
    if (currentPage === 'profile') {
        renderProfilePage();
    }
}

function toggleProfileEdit() {
    isProfileEditMode = !isProfileEditMode;
    const viewMode = document.getElementById('profileViewMode');
    const editMode = document.getElementById('profileEditMode');
    const editBtn = document.getElementById('editProfileBtn');
    
    if (isProfileEditMode) {
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');
        if (editBtn) editBtn.innerHTML = '<i class="fas fa-times"></i>';
        renderProfilePage();
    } else {
        viewMode.classList.remove('hidden');
        editMode.classList.add('hidden');
        if (editBtn) editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        renderProfilePage();
    }
}

function cancelProfileEdit() {
    isProfileEditMode = false;
    const viewMode = document.getElementById('profileViewMode');
    const editMode = document.getElementById('profileEditMode');
    const editBtn = document.getElementById('editProfileBtn');
    viewMode.classList.remove('hidden');
    editMode.classList.add('hidden');
    if (editBtn) editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    renderProfilePage();
}

function saveProfileEdit() {
    const name = document.getElementById('profileEditName').value.trim();
    const username = document.getElementById('profileEditUsername').value.trim();
    const phone = document.getElementById('profileEditPhone').value.trim();
    const classVal = document.getElementById('profileEditClass').value;
    const targetExam = document.getElementById('profileEditTargetExam').value;
    const coaching = document.getElementById('profileEditCoaching').value.trim();
    const dailyGoal = parseInt(document.getElementById('profileEditDailyGoal').value) || 50;
    
    if (!name || !username || !phone || !classVal) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    appData.profile = {
        ...appData.profile,
        name: name,
        username: username,
        phone: phone,
        class: classVal,
        targetExam: targetExam,
        coaching: coaching,
        dailyGoal: dailyGoal
    };
    
    appData.goals.daily = dailyGoal;
    saveData();
    toggleProfileEdit();
    renderProfilePage();
    showToast('✅ Profile updated successfully!', 'success');
}

function handleProfileAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (typeof supabase !== 'undefined' && supabase) {
        const userEmail = localStorage.getItem('jeeUserEmail') || 'user';
        const fileName = `${userEmail}_${Date.now()}`;
        
        supabase.storage.from('avatars').upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        }).then(({ data, error }) => {
            if (error) throw error;
            if (data) {
                const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path);
                appData.profile.avatarUrl = urlData.publicUrl;
                saveData();
                renderProfilePage();
                showToast('✅ Avatar updated!', 'success');
            }
        }).catch(error => {
            console.error('Avatar upload error:', error);
            showToast('Failed to upload avatar', 'error');
        });
    }
}

// ============================================
// SETTINGS PAGE
// ============================================

function renderSettingsPage() {
    const syncStatus = document.getElementById('settingsSyncStatus');
    const lastSync = document.getElementById('settingsLastSync');
    const versionDisplay = document.getElementById('settingsVersion');
    const themeDisplay = document.getElementById('settingsThemeDisplay');
    
    // Check if user is logged in and sync is enabled
    const isLoggedIn = typeof currentUserId !== 'undefined' && currentUserId;
    const isSyncEnabled = typeof syncEnabled !== 'undefined' && syncEnabled;
    
    if (syncStatus) {
        if (isLoggedIn && isSyncEnabled) {
            syncStatus.textContent = '☁ Synced';
            syncStatus.style.color = 'var(--green)';
        } else {
            syncStatus.textContent = '💾 Local Only';
            syncStatus.style.color = 'var(--text-muted)';
        }
    }
    
    if (lastSync) lastSync.textContent = appData.lastBackup ? formatDate(appData.lastBackup) : 'Never';
    if (versionDisplay) versionDisplay.textContent = 'v1.0.0';
    if (themeDisplay) themeDisplay.textContent = '☀️ Light';
}

// ============================================
// CALCULATIONS
// ============================================

function calculateSubjectProgress(subjectKey) {
    const subject = appData.subjects[subjectKey];
    if (!subject || Object.keys(subject.chapters).length === 0) return 0;
    let total = 0, count = 0;
    Object.keys(subject.chapters).forEach(chKey => {
        total += calculateChapterProgress(subjectKey, chKey);
        count++;
    });
    return count > 0 ? total / count : 0;
}

function calculateChapterProgress(subjectKey, chapterKey) {
    const subject = appData.subjects[subjectKey];
    if (!subject) return 0;
    const chapter = subject.chapters[chapterKey];
    if (!chapter) return 0;
    let totalQ = 0, completedQ = 0;
    Object.keys(chapter.exercises).forEach(exKey => {
        const exercise = chapter.exercises[exKey];
        const questions = exercise.questions || [];
        totalQ += questions.length;
        completedQ += questions.filter(q => q === STATES.DONE || q === STATES.WRONG).length;
    });
    return totalQ > 0 ? (completedQ / totalQ) * 100 : 0;
}

function calculateOverallProgress() {
    let total = 0, count = 0;
    Object.keys(appData.subjects).forEach(key => {
        total += calculateSubjectProgress(key);
        count++;
    });
    return count > 0 ? total / count : 0;
}

// ============================================
// SEARCH
// ============================================

function toggleSearch() {
    const bar = document.getElementById('searchBar');
    const input = document.getElementById('searchInput');
    if (bar) {
        if (bar.style.display === 'none') {
            bar.style.display = 'block';
            if (input) input.focus();
        } else {
            bar.style.display = 'none';
            if (input) input.value = '';
            document.getElementById('searchResults').classList.remove('active');
        }
    }
}

function performSearch(query) {
    const results = document.getElementById('searchResults');
    if (!results) return;
    if (!query.trim()) {
        results.classList.remove('active');
        return;
    }
    const q = query.toLowerCase().trim();
    let matches = [];
    
    Object.keys(appData.subjects).forEach(subKey => {
        const subject = appData.subjects[subKey];
        if (subject.name.toLowerCase().includes(q)) {
            matches.push({ type: 'subject', name: subject.name, icon: 'fa-book-open', data: subKey });
        }
        Object.keys(subject.chapters).forEach(chKey => {
            const chapter = subject.chapters[chKey];
            if (chapter.name.toLowerCase().includes(q)) {
                matches.push({ type: 'chapter', name: `${subject.name} → ${chapter.name}`, icon: 'fa-book', data: { subject: subKey, chapter: chKey } });
            }
            Object.keys(chapter.exercises).forEach(exKey => {
                const exercise = chapter.exercises[exKey];
                if (exercise.name.toLowerCase().includes(q)) {
                    matches.push({ type: 'exercise', name: `${subject.name} → ${chapter.name} → ${exercise.name}`, icon: 'fa-list', data: { subject: subKey, chapter: chKey, exercise: exKey } });
                }
            });
        });
    });
    
    Object.keys(appData.questionNotes).forEach(key => {
        const note = appData.questionNotes[key];
        if (note.toLowerCase().includes(q)) {
            const parts = key.split('_');
            if (parts.length === 4) {
                const [subKey, chKey, exKey, qIndex] = parts;
                const subject = appData.subjects[subKey];
                if (subject) {
                    matches.push({ type: 'note', name: `📝 ${subject.name} → ${chKey} → Q${parseInt(qIndex) + 1}`, icon: 'fa-pen', data: { subject: subKey, chapter: chKey, exercise: exKey, question: parseInt(qIndex) } });
                }
            }
        }
    });
    
    (appData.homework || []).forEach((hw, index) => {
        if (hw.chapter.toLowerCase().includes(q) || hw.subject.toLowerCase().includes(q)) {
            matches.push({ type: 'homework', name: `📋 ${hw.subject} → ${hw.chapter}`, icon: 'fa-tasks', data: { homeworkIndex: index } });
        }
    });
    
    (appData.revisionLists || []).forEach((rev, index) => {
        if (rev.name.toLowerCase().includes(q) || rev.subject.toLowerCase().includes(q)) {
            matches.push({ type: 'revision', name: `🔄 ${rev.name} (${rev.subject})`, icon: 'fa-sync', data: { revisionIndex: index } });
        }
    });
    
    if (matches.length === 0) {
        results.innerHTML = `<div class="search-result-item"><span style="color: var(--text-muted);">No results found</span></div>`;
        results.classList.add('active');
        return;
    }
    
    results.innerHTML = matches.slice(0, 10).map(m => `
        <div class="search-result-item" onclick="searchResultClick('${m.type}', '${JSON.stringify(m.data).replace(/'/g, "&#39;")}')">
            <span class="result-icon"><i class="fas ${m.icon}"></i></span>
            <div class="result-info">
                <div class="result-title">${m.name}</div>
                <div class="result-sub">${m.type}</div>
            </div>
        </div>
    `).join('');
    results.classList.add('active');
}

function searchResultClick(type, dataStr) {
    try {
        const data = JSON.parse(dataStr);
        const bar = document.getElementById('searchBar');
        const results = document.getElementById('searchResults');
        const input = document.getElementById('searchInput');
        if (bar) bar.style.display = 'none';
        if (results) results.classList.remove('active');
        if (input) input.value = '';
        
        if (type === 'subject') {
            navigateTo('subject-detail', { subject: data });
        } else if (type === 'chapter') {
            navigateTo('subject-detail', { subject: data.subject });
            setTimeout(() => {
                navigateTo('chapter-detail', { subject: data.subject, chapter: data.chapter });
            }, 300);
        } else if (type === 'exercise') {
            navigateTo('subject-detail', { subject: data.subject });
            setTimeout(() => {
                navigateTo('chapter-detail', { subject: data.subject, chapter: data.chapter });
                setTimeout(() => {
                    navigateTo('exercise-detail', { subject: data.subject, chapter: data.chapter, exercise: data.exercise });
                }, 300);
            }, 300);
        } else if (type === 'note' || type === 'question') {
            navigateTo('subject-detail', { subject: data.subject });
            setTimeout(() => {
                navigateTo('chapter-detail', { subject: data.subject, chapter: data.chapter });
                setTimeout(() => {
                    navigateTo('exercise-detail', { subject: data.subject, chapter: data.chapter, exercise: data.exercise });
                }, 300);
            }, 300);
        } else if (type === 'homework') {
            navigateTo('homework');
        } else if (type === 'revision') {
            navigateTo('revision');
        }
    } catch (e) {
        console.error('Search result click error:', e);
        showToast('Error opening result', 'error');
    }
}

// ============================================
// ADD CHAPTER - FIXED WITH USER COUNTS
// ============================================

function showAddChapterModal() {
    const modal = document.getElementById('addChapterModal');
    if (modal) modal.classList.add('active');
    const input = document.getElementById('chapterNameInput');
    if (input) { input.value = ''; input.focus(); }
}

function hideAddChapterModal() {
    const modal = document.getElementById('addChapterModal');
    if (modal) modal.classList.remove('active');
}

function addChapter() {
    const nameInput = document.getElementById('chapterNameInput');
    const name = nameInput ? nameInput.value.trim() : '';
    
    if (!name) {
        showToast('Please enter a chapter name', 'error');
        return;
    }
    
    const subject = appData.subjects[currentSubject];
    const key = name.toLowerCase().replace(/\s+/g, '-');
    
    if (subject.chapters[key]) {
        showToast('Chapter already exists!', 'error');
        return;
    }
    
    const ex1Count = parseInt(document.getElementById('ex1Count')?.value) || 30;
    const ex2Count = parseInt(document.getElementById('ex2Count')?.value) || 25;
    const ex3Count = parseInt(document.getElementById('ex3Count')?.value) || 20;
    const jeeMainCount = parseInt(document.getElementById('jeeMainCount')?.value) || 15;
    const jeeAdvCount = parseInt(document.getElementById('jeeAdvCount')?.value) || 10;
    
    const createQuestions = (count) => {
        return new Array(Math.max(0, count)).fill(STATES.NOT_DONE);
    };
    
    subject.chapters[key] = {
        name: name,
        exercises: {
            'ex1': { name: 'Exercise 1', questions: createQuestions(ex1Count) },
            'ex2': { name: 'Exercise 2', questions: createQuestions(ex2Count) },
            'ex3': { name: 'Exercise 3', questions: createQuestions(ex3Count) },
            'jee-main': { name: 'JEE Main', questions: createQuestions(jeeMainCount) },
            'jee-advanced': { name: 'JEE Advanced', questions: createQuestions(jeeAdvCount) }
        }
    };
    
    // ✅ Add chapter to order list
if (!subject.chapterOrder) subject.chapterOrder = [];
if (!subject.chapterOrder.includes(key)) {
    subject.chapterOrder.push(key);
}
    
    saveData();
    hideAddChapterModal();
    renderChapters(currentSubject);
    showToast(`✅ Chapter "${name}" added successfully!`, 'success');
}

// ============================================
// ADD QUESTIONS
// ============================================

function showAddQuestionsModal() {
    const modal = document.getElementById('addQuestionsModal');
    if (modal) modal.classList.add('active');
    const input = document.getElementById('questionCountInput');
    if (input) { input.value = 10; input.focus(); }
}

function hideAddQuestionsModal() {
    const modal = document.getElementById('addQuestionsModal');
    if (modal) modal.classList.remove('active');
}

function addQuestions() {
    const input = document.getElementById('questionCountInput');
    const count = parseInt(input ? input.value : 0);
    if (!count || count < 1 || count > 100) {
        showToast('Please enter a number between 1 and 100', 'error');
        return;
    }
    const subject = appData.subjects[currentSubject];
    const chapter = subject.chapters[currentChapter];
    const exercise = chapter.exercises[currentExercise];
    for (let i = 0; i < count; i++) {
        exercise.questions.push(STATES.NOT_DONE);
    }
    saveData();
    hideAddQuestionsModal();
    renderQuestions(currentSubject, currentChapter, currentExercise);
    showToast(`✅ Added ${count} new questions!`, 'success');
}

// ============================================
// ADD REVISION
// ============================================

function showAddRevisionModal() {
    const modal = document.getElementById('addRevisionModal');
    if (modal) modal.classList.add('active');
    const input = document.getElementById('revisionName');
    if (input) input.focus();
}

function hideAddRevisionModal() {
    const modal = document.getElementById('addRevisionModal');
    if (modal) modal.classList.remove('active');
}

function addRevision() {
    const name = document.getElementById('revisionName').value.trim();
    const subject = document.getElementById('revSubject').value;
    const questions = document.getElementById('revQuestions').value.trim();
    const priority = document.getElementById('revPriority').value;
    if (!name || !questions) {
        showToast('Please fill all fields', 'error');
        return;
    }
    if (!appData.revisionLists) appData.revisionLists = [];
    appData.revisionLists.push({ name, subject, questions, priority, createdAt: new Date().toISOString() });
    saveData();
    hideAddRevisionModal();
    renderRevisionPage();
    showToast('✅ Revision list added successfully!', 'success');
}

// ============================================
// EXPORT / IMPORT / RESET
// ============================================

function exportProgress() {
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jee-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    updateLastBackup();
    showToast('✅ Data exported successfully!', 'success');
}

function importProgress(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.subjects) {
                appData = data;
                saveData();
                renderDashboard();
                showToast('✅ Import successful!', 'success');
            }
        } catch (err) {
            showToast('❌ Invalid file', 'error');
        }
    };
    reader.readAsText(file);
}

function resetProgress() {
    if (confirm('⚠️ Reset all progress? This cannot be undone.')) {
        if (confirm('⚠️ This will also clear your data from the cloud. Are you sure?')) {
            showToast('🔄 Resetting progress...', 'info');
            
            // Create a fresh default data
            const freshData = JSON.parse(JSON.stringify(defaultData));
            freshData.joinDate = new Date().toISOString().split('T')[0];
            
            // Keep profile info and streak
            if (appData.profile) {
                freshData.profile = appData.profile;
            }
            if (appData.streak) {
                freshData.streak = {
                    current: 0,
                    longest: 0,
                    lastDate: null,
                    todaySolved: 0
                };
            }
            if (appData.joinDate) {
                freshData.joinDate = appData.joinDate;
            }
            
            // Update local data
            appData = freshData;
            window.appData = appData;
            saveData();
            
            // Sync reset to Supabase
            if (typeof syncEnabled !== 'undefined' && syncEnabled && typeof currentUserId !== 'undefined' && currentUserId) {
                // Use the syncToSupabase function from auth.js
                if (typeof syncToSupabase === 'function') {
                    syncToSupabase().then(result => {
                        if (result) {
                            showToast('✅ Reset complete! Data synced to cloud.', 'success');
                        } else {
                            showToast('⚠️ Reset complete but cloud sync failed. Local data cleared.', 'warning');
                        }
                    }).catch(() => {
                        showToast('⚠️ Reset complete but cloud sync failed.', 'warning');
                    });
                } else {
                    // Fallback: directly save to Supabase
                    saveUserDataToSupabase(currentUserId, freshData).then(result => {
                        if (result) {
                            showToast('✅ Reset complete! Data synced to cloud.', 'success');
                        } else {
                            showToast('⚠️ Reset complete but cloud sync failed.', 'warning');
                        }
                    });
                }
            } else {
                showToast('✅ Reset complete! (Local only)', 'success');
            }
            
            renderDashboard();
            // Reload current page to reflect changes
            if (currentPage === 'dashboard') {
                renderDashboard();
            } else {
                navigateTo('dashboard');
            }
        }
    }
}

// Helper function to save directly to Supabase (fallback)
async function saveUserDataToSupabase(userId, data) {
    try {
        const { error } = await supabase
            .from('user_data')
            .upsert({
                user_id: userId,
                app_data: data,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            });
        
        if (error) {
            console.error('❌ Save to Supabase error:', error);
            return false;
        }
        
        console.log('✅ Data saved to Supabase successfully');
        return true;
    } catch (error) {
        console.error('❌ Save to Supabase exception:', error);
        return false;
    }
}

// Clear cloud data
async function clearCloudData() {
    // Check if user is logged in
    const userId = typeof currentUserId !== 'undefined' ? currentUserId : null;
    const isSyncEnabled = typeof syncEnabled !== 'undefined' ? syncEnabled : false;
    
    if (!userId || !isSyncEnabled) {
        showToast('❌ Not logged in or sync not enabled', 'error');
        return;
    }
    
    if (confirm('⚠️ Delete ALL your data from the cloud? This cannot be undone!')) {
        if (confirm('⚠️ Are you absolutely sure? This will delete everything from the server.')) {
            showToast('🔄 Clearing cloud data...', 'info');
            
            try {
                const { error } = await supabase
                    .from('user_data')
                    .delete()
                    .eq('user_id', userId);
                
                if (error) throw error;
                
                showToast('✅ Cloud data cleared successfully!', 'success');
                return true;
            } catch (error) {
                console.error('❌ Clear cloud data error:', error);
                showToast('❌ Failed to clear cloud data: ' + error.message, 'error');
                return false;
            }
        }
    }
}

// ============================================
// SYNC NOW
// ============================================

function syncNow() {
    if (typeof syncToSupabase === 'function' && typeof syncEnabled !== 'undefined' && syncEnabled && currentUserId) {
        showToast('🔄 Syncing...', 'info');
        syncToSupabase().then(result => {
            if (result) {
                showToast('✅ Sync complete!', 'success');
                renderProfilePage();
                renderSettingsPage();
            } else {
                showToast('❌ Sync failed', 'error');
            }
        });
    } else {
        showToast('⚠️ Not logged in or Supabase not configured', 'error');
    }
}

// ============================================
// LOGOUT
// ============================================

function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        if (typeof supabase !== 'undefined' && typeof supabase.auth !== 'undefined') {
            supabase.auth.signOut().then(() => {
                localStorage.removeItem('jeeTrackerData');
                localStorage.removeItem('jeeTheme');
                localStorage.removeItem('jeeUserEmail');
                window.location.reload();
            });
        } else {
            localStorage.removeItem('jeeTrackerData');
            localStorage.removeItem('jeeTheme');
            localStorage.removeItem('jeeUserEmail');
            window.location.reload();
        }
    }
}

// ============================================
// DEVELOPER INFO
// ============================================

function showDeveloperInfo() {
    const modal = document.getElementById('developerModal');
    if (modal) modal.classList.add('active');
}

function closeDeveloperInfo() {
    const modal = document.getElementById('developerModal');
    if (modal) modal.classList.remove('active');
}

// ============================================
// CHANGE PASSWORD
// ============================================

function showChangePassword() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.classList.add('active');
    modal.querySelectorAll('input').forEach(input => input.value = '');
}

function hideChangePassword() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.classList.remove('active');
}

async function handleChangePassword() {
    const current = document.getElementById('currentPasswordInput').value;
    const newPass = document.getElementById('newPasswordInput').value;
    const confirmPass = document.getElementById('confirmNewPasswordInput').value;
    if (!current || !newPass || !confirmPass) {
        showToast('Please fill all fields', 'error');
        return;
    }
    if (newPass.length < 6) {
        showToast('New password must be at least 6 characters', 'error');
        return;
    }
    if (newPass !== confirmPass) {
        showToast('Passwords do not match', 'error');
        return;
    }
    try {
        const { error } = await supabase.auth.updateUser({ password: newPass });
        if (error) throw error;
        showToast('✅ Password updated successfully!', 'success');
        hideChangePassword();
    } catch (error) {
        showToast('❌ Failed to update password: ' + error.message, 'error');
    }
}

// ============================================
// DELETE ACCOUNT
// ============================================

function confirmDeleteAccount() {
    const modal = document.getElementById('deleteAccountModal');
    if (modal) modal.classList.add('active');
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    deleteMathAnswer = num1 + num2;
    document.getElementById('deleteMathQuestion').textContent = `${num1} + ${num2} = ?`;
    ['deleteUsernameInput', 'deletePasswordInput', 'deleteMathInput'].forEach(id => {
        document.getElementById(id).value = '';
    });
    ['deleteUsernameMatch', 'deletePasswordMatch', 'deleteMathMatch'].forEach(id => {
        document.getElementById(id).textContent = '';
        document.getElementById(id).className = '';
    });
    document.getElementById('confirmDeleteAccountBtn').disabled = true;
    setupDeleteAccountValidation();
}

function hideDeleteAccount() {
    document.getElementById('deleteAccountModal').classList.remove('active');
}

function setupDeleteAccountValidation() {
    const usernameInput = document.getElementById('deleteUsernameInput');
    const passwordInput = document.getElementById('deletePasswordInput');
    const mathInput = document.getElementById('deleteMathInput');
    const confirmBtn = document.getElementById('confirmDeleteAccountBtn');
    
    usernameInput.oninput = function() {
        const username = this.value.trim();
        const match = document.getElementById('deleteUsernameMatch');
        const profile = appData.profile || {};
        if (username && username === profile.username) {
            match.textContent = '✅ Username matched';
            match.className = 'valid';
        } else if (username) {
            match.textContent = '❌ Username does not match';
            match.className = 'invalid';
        } else {
            match.textContent = '';
            match.className = '';
        }
        checkDeleteAccountReady();
    };
    
    passwordInput.oninput = function() {
        const password = this.value;
        const match = document.getElementById('deletePasswordMatch');
        if (password.length >= 6) {
            match.textContent = '✅ Password entered';
            match.className = 'valid';
        } else if (password.length > 0) {
            match.textContent = '❌ Password too short (min 6)';
            match.className = 'invalid';
        } else {
            match.textContent = '';
            match.className = '';
        }
        checkDeleteAccountReady();
    };
    
    mathInput.oninput = function() {
        const answer = parseInt(this.value);
        const match = document.getElementById('deleteMathMatch');
        if (!isNaN(answer) && answer === deleteMathAnswer) {
            match.textContent = '✅ Correct!';
            match.className = 'valid';
        } else if (this.value) {
            match.textContent = '❌ Incorrect answer';
            match.className = 'invalid';
        } else {
            match.textContent = '';
            match.className = '';
        }
        checkDeleteAccountReady();
    };
}

function checkDeleteAccountReady() {
    const username = document.getElementById('deleteUsernameInput').value.trim();
    const password = document.getElementById('deletePasswordInput').value;
    const mathAnswer = parseInt(document.getElementById('deleteMathInput').value);
    const confirmBtn = document.getElementById('confirmDeleteAccountBtn');
    const profile = appData.profile || {};
    const usernameValid = username === profile.username;
    const passwordValid = password.length >= 6;
    const mathValid = !isNaN(mathAnswer) && mathAnswer === deleteMathAnswer;
    confirmBtn.disabled = !(usernameValid && passwordValid && mathValid);
}

async function handleDeleteAccount() {
    if (!confirm('⚠️ Are you sure you want to permanently delete your account? This cannot be undone!')) return;
    try {
        if (appData.profile?.avatarUrl) {
            try {
                const path = appData.profile.avatarUrl.split('/').pop();
                await supabase.storage.from('avatars').remove([path]);
            } catch (e) {}
        }
        const { error: dataError } = await supabase.from('user_data').delete().eq('user_id', currentUserId);
        if (dataError) throw dataError;
        await supabase.auth.signOut();
        localStorage.clear();
        showToast('✅ Account deleted successfully', 'success');
        hideDeleteAccount();
        window.location.reload();
    } catch (error) {
        showToast('❌ Failed to delete account: ' + error.message, 'error');
    }
}

// ============================================
// FORGOT PASSWORD
// ============================================

function showForgotPassword() {
    document.getElementById('forgotPasswordModal').classList.add('active');
    document.getElementById('resetEmailInput').value = '';
    document.getElementById('resetEmailInput').focus();
}

function hideForgotPassword() {
    document.getElementById('forgotPasswordModal').classList.remove('active');
}

async function handleForgotPassword() {
    const email = document.getElementById('resetEmailInput').value.trim();
    if (!email) {
        showToast('Please enter your email', 'error');
        return;
    }
    try {
        const redirectUrl = 'https://zorej121.github.io/jee_tracker/';
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl
        });
        if (error) throw error;
        showToast('✅ Password reset email sent! Check your inbox.', 'success');
        hideForgotPassword();
    } catch (error) {
        showToast('❌ Failed to send reset email: ' + error.message, 'error');
    }
}

// ============================================
// TOAST
// ============================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// HAMBURGER MENU
// ============================================

function toggleHamburger() {
    const menu = document.getElementById('hamburgerMenu');
    if (!menu) {
        console.warn('Hamburger menu element not found');
        return;
    }
    menu.classList.toggle('active');
}

// ============================================
// EXERCISE MANAGEMENT - ADD & DELETE
// ============================================

function setupExerciseAddButton() {
    const addBtn = document.getElementById('addExerciseBtn');
    if (addBtn) {
        const newBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newBtn, addBtn);
        newBtn.addEventListener('click', showAddExerciseModal);
    }
}

function showAddExerciseModal() {
    if (!currentSubject || !currentChapter) {
        showToast('Please select a subject and chapter first', 'error');
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'addExerciseModal';
    overlay.className = 'modal active';
    overlay.style.display = 'flex';
    
    overlay.innerHTML = `
        <div class="modal-content glass-3d" style="max-width: 400px; width: 100%;">
            <div class="modal-header">
                <h3><i class="fas fa-plus-circle"></i> Add New Exercise</h3>
                <button class="modal-close" onclick="closeAddExerciseModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label><i class="fas fa-book"></i> Subject</label>
                    <input type="text" id="addExSubject" class="form-input" value="${appData.subjects[currentSubject].name}" disabled>
                </div>
                <div class="form-group" style="margin-top: 12px;">
                    <label><i class="fas fa-book-open"></i> Chapter</label>
                    <input type="text" id="addExChapter" class="form-input" value="${appData.subjects[currentSubject].chapters[currentChapter].name}" disabled>
                </div>
                <div class="form-group" style="margin-top: 12px;">
                    <label><i class="fas fa-tag"></i> Exercise Name <span style="color: var(--red);">*</span></label>
                    <input type="text" id="addExerciseName" class="form-input" placeholder="e.g., Exercise 4, Practice Set 1" autofocus>
                </div>
                <div class="form-group" style="margin-top: 12px;">
                    <label><i class="fas fa-question-circle"></i> Number of Questions</label>
                    <input type="number" id="addExerciseQuestions" class="form-input" value="20" min="1" max="200">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeAddExerciseModal()">Cancel</button>
                <button class="btn-primary" onclick="addExercise()">
                    <i class="fas fa-plus"></i> Add Exercise
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
        const input = document.getElementById('addExerciseName');
        if (input) input.focus();
    }, 100);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeAddExerciseModal();
        }
    });

    document.getElementById('addExerciseName')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addExercise();
        }
    });

    document.getElementById('addExerciseQuestions')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addExercise();
        }
    });
}

function closeAddExerciseModal() {
    const modal = document.getElementById('addExerciseModal');
    if (modal) modal.remove();
}

function addExercise() {
    const nameInput = document.getElementById('addExerciseName');
    const questionsInput = document.getElementById('addExerciseQuestions');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const questionCount = parseInt(questionsInput ? questionsInput.value : 20) || 20;

    if (!name) {
        showToast('Please enter an exercise name', 'error');
        nameInput?.focus();
        return;
    }

    if (questionCount < 1 || questionCount > 200) {
        showToast('Please enter a valid question count (1-200)', 'error');
        questionsInput?.focus();
        return;
    }

    const subject = appData.subjects[currentSubject];
    const chapter = subject.chapters[currentChapter];

    const exerciseKey = name.toLowerCase().replace(/\s+/g, '-');
    if (chapter.exercises[exerciseKey]) {
        showToast('An exercise with this name already exists!', 'error');
        nameInput?.focus();
        return;
    }

    const questions = new Array(questionCount).fill(STATES.NOT_DONE);
    
    chapter.exercises[exerciseKey] = {
        name: name,
        questions: questions
    };

    saveData();
    closeAddExerciseModal();
    renderExercises(currentSubject, currentChapter);
    showToast(`✅ Exercise "${name}" added with ${questionCount} questions!`, 'success');
}

function deleteExercise(exerciseKey) {
    if (!currentSubject || !currentChapter || !exerciseKey) {
        showToast('Error: Missing data', 'error');
        return;
    }

    const subject = appData.subjects[currentSubject];
    const chapter = subject.chapters[currentChapter];
    const exercise = chapter.exercises[exerciseKey];

    if (!exercise) {
        showToast('Exercise not found', 'error');
        return;
    }

    const totalQuestions = exercise.questions?.length || 0;
    const doneQuestions = exercise.questions?.filter(q => q === STATES.DONE || q === STATES.WRONG).length || 0;

    const overlay = document.createElement('div');
    overlay.id = 'deleteExerciseModal';
    overlay.className = 'modal active';
    overlay.style.display = 'flex';

    overlay.innerHTML = `
        <div class="modal-content glass-3d" style="max-width: 380px; width: 100%;">
            <div class="modal-header">
                <h3 style="color: var(--red);"><i class="fas fa-exclamation-triangle"></i> Delete Exercise</h3>
                <button class="modal-close" onclick="closeDeleteExerciseModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">
                    Are you sure you want to delete "<strong>${exercise.name}</strong>"?
                </p>
                <div style="background: var(--bg-primary); border-radius: var(--radius-sm); padding: 12px; margin: 12px 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
                        <span style="color: var(--text-muted);">Total Questions:</span>
                        <span style="font-weight: 600;">${totalQuestions}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
                        <span style="color: var(--text-muted);">Completed:</span>
                        <span style="font-weight: 600; color: var(--green);">${doneQuestions}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; border-top: 1px solid var(--border-color); margin-top: 4px; padding-top: 8px;">
                        <span style="color: var(--text-muted);">Remaining:</span>
                        <span style="font-weight: 600; color: var(--red);">${totalQuestions - doneQuestions}</span>
                    </div>
                </div>
                <p style="font-size: 13px; color: var(--red);">
                    ⚠️ This action cannot be undone!
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeDeleteExerciseModal()">Cancel</button>
                <button class="btn-primary" style="background: var(--red);" onclick="confirmDeleteExercise('${exerciseKey}')">
                    <i class="fas fa-trash"></i> Delete Exercise
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeDeleteExerciseModal();
        }
    });
}

function closeDeleteExerciseModal() {
    const modal = document.getElementById('deleteExerciseModal');
    if (modal) modal.remove();
}

function confirmDeleteExercise(exerciseKey) {
    if (!currentSubject || !currentChapter) {
        showToast('Error: Missing data', 'error');
        return;
    }

    const subject = appData.subjects[currentSubject];
    const chapter = subject.chapters[currentChapter];
    const exercise = chapter.exercises[exerciseKey];

    if (!exercise) {
        showToast('Exercise not found', 'error');
        return;
    }

    const exerciseName = exercise.name;

    delete chapter.exercises[exerciseKey];

    if (appData.homework) {
        appData.homework = appData.homework.filter(hw => {
            if (hw.subject === currentSubject && hw.chapter === chapter.name) {
                const selectedExercises = hw.selectedExercises || [];
                if (selectedExercises.includes(exerciseKey)) {
                    return false;
                }
            }
            return true;
        });
    }

    const notesToRemove = [];
    Object.keys(appData.questionNotes).forEach(key => {
        const parts = key.split('_');
        if (parts.length === 4) {
            const [subKey, chKey, exKey] = parts;
            if (subKey === currentSubject && chKey === currentChapter && exKey === exerciseKey) {
                notesToRemove.push(key);
            }
        }
    });
    notesToRemove.forEach(key => {
        delete appData.questionNotes[key];
        delete appData.questionDifficulty[key];
        delete appData.questionRevision[key];
        delete appData.questionHistory[key];
    });

    if (appData.continueStudying) {
        const cs = appData.continueStudying;
        if (cs.subject === currentSubject && cs.chapter === currentChapter && cs.exercise === exerciseKey) {
            appData.continueStudying = { subject: null, chapter: null, exercise: null, question: null };
        }
    }

    saveData();
    closeDeleteExerciseModal();
    renderExercises(currentSubject, currentChapter);
    showToast(`🗑️ Exercise "${exerciseName}" deleted successfully!`, 'success');
}

// ============================================
// EXPOSE FUNCTIONS FOR GLOBAL USE
// ============================================

window.restorePageFromURL = restorePageFromURL;
window.showAddExerciseModal = showAddExerciseModal;
window.closeAddExerciseModal = closeAddExerciseModal;
window.addExercise = addExercise;
window.deleteExercise = deleteExercise;
window.closeDeleteExerciseModal = closeDeleteExerciseModal;
window.confirmDeleteExercise = confirmDeleteExercise;
window.setupExerciseAddButton = setupExerciseAddButton;

// ============================================
// INIT
// ============================================

function initApp() {
    loadData();
    loadTheme();
    
        // ✅ ADD THIS LINE HERE (after loadTheme)
    initTemplateFeature();
    
    // Navigation - Bottom Nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.dataset.page);
        });
    });
    
    // Navigation - Hamburger Menu
    document.querySelectorAll('.hamburger-item').forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.dataset.page);
        });
    });
    
    // Theme toggle removed from header
    
    // Back buttons
    const backButtons = {
        'backFromSubject': 'subject-detail',
        'backFromChapter': 'chapter-detail',
        'backFromExercise': 'exercise-detail',
        'backFromSubjectProgress': 'subjectProgress',
        'backFromReviewBank': 'reviewBank',
        'backFromWrongBank': 'wrongBank',
        'backFromHomework': 'homework',
        'backFromGoals': 'goals',
        'backFromRevision': 'revision',
        'backFromHeatmap': 'heatmap',
        'backFromAchievements': 'achievements',
        'backFromExamMode': 'examMode',
        'backFromSettings': 'settings',
        'backFromProfile': 'profile'
    };
    
    document.getElementById('pageContent')?.addEventListener('click', function(e) {
        const button = e.target.closest('.back-btn');
        if (!button) return;
        const destination = backButtons[button.id];
        if (!destination) {
            console.warn('⚠️ No back destination configured for:', button.id);
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        console.log('🔙 Back button clicked:', button.id, '→', destination);
        goBack(destination);
    });
    
    // Notes Modal
    document.getElementById('closeNotesModal')?.addEventListener('click', closeNotesModal);
    document.getElementById('cancelNotesBtn')?.addEventListener('click', closeNotesModal);
    document.getElementById('saveNotesBtn')?.addEventListener('click', saveNotes);
    
    // Forgot Password
    document.getElementById('showForgotPassword')?.addEventListener('click', showForgotPassword);
    document.getElementById('closeForgotPassword')?.addEventListener('click', hideForgotPassword);
    document.getElementById('cancelResetBtn')?.addEventListener('click', hideForgotPassword);
    document.getElementById('sendResetBtn')?.addEventListener('click', handleForgotPassword);
    document.getElementById('resetEmailInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleForgotPassword();
    });
    
    // Change Password
    document.getElementById('closeChangePasswordModal')?.addEventListener('click', hideChangePassword);
    document.getElementById('cancelChangePasswordBtn')?.addEventListener('click', hideChangePassword);
    document.getElementById('saveChangePasswordBtn')?.addEventListener('click', handleChangePassword);
    
    // Delete Account
    document.getElementById('closeDeleteAccountModal')?.addEventListener('click', hideDeleteAccount);
    document.getElementById('cancelDeleteAccountBtn')?.addEventListener('click', hideDeleteAccount);
    document.getElementById('confirmDeleteAccountBtn')?.addEventListener('click', handleDeleteAccount);
    
    // Developer Info
    document.getElementById('closeDeveloperModal')?.addEventListener('click', closeDeveloperInfo);
    
    // Search
    document.getElementById('searchToggle')?.addEventListener('click', toggleSearch);
    document.getElementById('closeSearch')?.addEventListener('click', toggleSearch);
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(e.target.value);
    });
    
    // Hamburger
    document.getElementById('hamburgerBtn')?.addEventListener('click', toggleHamburger);
    document.getElementById('closeHamburger')?.addEventListener('click', toggleHamburger);
    document.getElementById('hamburgerMenu')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) toggleHamburger();
    });
    
    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });
    
    // Logout buttons
    document.getElementById('logoutBtn')?.addEventListener('click', logoutUser);
    
    // Exercise add button setup on chapter detail
    if (currentPage === 'chapter-detail') {
        setTimeout(setupExerciseAddButton, 200);
    }
}

// ============================================
// DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', initApp);

// ============================================
// EXERCISE MANAGEMENT - ADD & DELETE
// ============================================

function setupExerciseAddButton() {
    const addBtn = document.getElementById('addExerciseBtn');
    if (addBtn) {
        const newBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newBtn, addBtn);
        newBtn.addEventListener('click', showAddExerciseModal);
    }
}

function showAddExerciseModal() {
    if (!currentSubject || !currentChapter) {
        showToast('Please select a subject and chapter first', 'error');
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'addExerciseModal';
    overlay.className = 'modal active';
    overlay.style.display = 'flex';
    
    overlay.innerHTML = `
        <div class="modal-content glass-3d" style="max-width: 400px; width: 100%;">
            <div class="modal-header">
                <h3><i class="fas fa-plus-circle"></i> Add New Exercise</h3>
                <button class="modal-close" onclick="closeAddExerciseModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label><i class="fas fa-book"></i> Subject</label>
                    <input type="text" id="addExSubject" class="form-input" value="${appData.subjects[currentSubject].name}" disabled>
                </div>
                <div class="form-group" style="margin-top: 12px;">
                    <label><i class="fas fa-book-open"></i> Chapter</label>
                    <input type="text" id="addExChapter" class="form-input" value="${appData.subjects[currentSubject].chapters[currentChapter].name}" disabled>
                </div>
                <div class="form-group" style="margin-top: 12px;">
                    <label><i class="fas fa-tag"></i> Exercise Name <span style="color: var(--red);">*</span></label>
                    <input type="text" id="addExerciseName" class="form-input" placeholder="e.g., Exercise 4, Practice Set 1" autofocus>
                </div>
                <div class="form-group" style="margin-top: 12px;">
                    <label><i class="fas fa-question-circle"></i> Number of Questions</label>
                    <input type="number" id="addExerciseQuestions" class="form-input" value="20" min="1" max="200">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeAddExerciseModal()">Cancel</button>
                <button class="btn-primary" onclick="addExercise()">
                    <i class="fas fa-plus"></i> Add Exercise
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        const input = document.getElementById('addExerciseName');
        if (input) input.focus();
    }, 100);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeAddExerciseModal();
        }
    });
    
    document.getElementById('addExerciseName')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addExercise();
        }
    });
    
    document.getElementById('addExerciseQuestions')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addExercise();
        }
    });
}

function closeAddExerciseModal() {
    const modal = document.getElementById('addExerciseModal');
    if (modal) modal.remove();
}

function addExercise() {
    const nameInput = document.getElementById('addExerciseName');
    const questionsInput = document.getElementById('addExerciseQuestions');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const questionCount = parseInt(questionsInput ? questionsInput.value : 20) || 20;
    
    if (!name) {
        showToast('Please enter an exercise name', 'error');
        nameInput?.focus();
        return;
    }
    
    if (questionCount < 1 || questionCount > 200) {
        showToast('Please enter a valid question count (1-200)', 'error');
        questionsInput?.focus();
        return;
    }
    
    const subject = appData.subjects[currentSubject];
    const chapter = subject.chapters[currentChapter];
    
    const exerciseKey = name.toLowerCase().replace(/\s+/g, '-');
    if (chapter.exercises[exerciseKey]) {
        showToast('An exercise with this name already exists!', 'error');
        nameInput?.focus();
        return;
    }
    
    const questions = new Array(questionCount).fill(STATES.NOT_DONE);
    
    chapter.exercises[exerciseKey] = {
        name: name,
        questions: questions
    };
    
    saveData();
    closeAddExerciseModal();
    renderExercises(currentSubject, currentChapter);
    showToast(`✅ Exercise "${name}" added with ${questionCount} questions!`, 'success');
}

function deleteExercise(exerciseKey) {
    if (!currentSubject || !currentChapter || !exerciseKey) {
        showToast('Error: Missing data', 'error');
        return;
    }
    
    const subject = appData.subjects[currentSubject];
    const chapter = subject.chapters[currentChapter];
    const exercise = chapter.exercises[exerciseKey];
    
    if (!exercise) {
        showToast('Exercise not found', 'error');
        return;
    }
    
    const totalQuestions = exercise.questions?.length || 0;
    const doneQuestions = exercise.questions?.filter(q => q === STATES.DONE || q === STATES.WRONG).length || 0;
    
    const overlay = document.createElement('div');
    overlay.id = 'deleteExerciseModal';
    overlay.className = 'modal active';
    overlay.style.display = 'flex';
    
    overlay.innerHTML = `
        <div class="modal-content glass-3d" style="max-width: 380px; width: 100%;">
            <div class="modal-header">
                <h3 style="color: var(--red);"><i class="fas fa-exclamation-triangle"></i> Delete Exercise</h3>
                <button class="modal-close" onclick="closeDeleteExerciseModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">
                    Are you sure you want to delete "<strong>${exercise.name}</strong>"?
                </p>
                <div style="background: var(--bg-primary); border-radius: var(--radius-sm); padding: 12px; margin: 12px 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
                        <span style="color: var(--text-muted);">Total Questions:</span>
                        <span style="font-weight: 600;">${totalQuestions}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
                        <span style="color: var(--text-muted);">Completed:</span>
                        <span style="font-weight: 600; color: var(--green);">${doneQuestions}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; border-top: 1px solid var(--border-color); margin-top: 4px; padding-top: 8px;">
                        <span style="color: var(--text-muted);">Remaining:</span>
                        <span style="font-weight: 600; color: var(--red);">${totalQuestions - doneQuestions}</span>
                    </div>
                </div>
                <p style="font-size: 13px; color: var(--red);">
                    ⚠️ This action cannot be undone!
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeDeleteExerciseModal()">Cancel</button>
                <button class="btn-primary" style="background: var(--red);" onclick="confirmDeleteExercise('${exerciseKey}')">
                    <i class="fas fa-trash"></i> Delete Exercise
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeDeleteExerciseModal();
        }
    });
}

function closeDeleteExerciseModal() {
    const modal = document.getElementById('deleteExerciseModal');
    if (modal) modal.remove();
}

function confirmDeleteExercise(exerciseKey) {
    if (!currentSubject || !currentChapter) {
        showToast('Error: Missing data', 'error');
        return;
    }
    
    const subject = appData.subjects[currentSubject];
    const chapter = subject.chapters[currentChapter];
    const exercise = chapter.exercises[exerciseKey];
    
    if (!exercise) {
        showToast('Exercise not found', 'error');
        return;
    }
    
    const exerciseName = exercise.name;
    
    delete chapter.exercises[exerciseKey];
    
    if (appData.homework) {
        appData.homework = appData.homework.filter(hw => {
            if (hw.subject === currentSubject && hw.chapter === chapter.name) {
                const selectedExercises = hw.selectedExercises || [];
                if (selectedExercises.includes(exerciseKey)) {
                    return false;
                }
            }
            return true;
        });
    }
    
    const notesToRemove = [];
    Object.keys(appData.questionNotes).forEach(key => {
        const parts = key.split('_');
        if (parts.length === 4) {
            const [subKey, chKey, exKey] = parts;
            if (subKey === currentSubject && chKey === currentChapter && exKey === exerciseKey) {
                notesToRemove.push(key);
            }
        }
    });
    notesToRemove.forEach(key => {
        delete appData.questionNotes[key];
        delete appData.questionDifficulty[key];
        delete appData.questionRevision[key];
        delete appData.questionHistory[key];
    });
    
    if (appData.continueStudying) {
        const cs = appData.continueStudying;
        if (cs.subject === currentSubject && cs.chapter === currentChapter && cs.exercise === exerciseKey) {
            appData.continueStudying = { subject: null, chapter: null, exercise: null, question: null };
        }
    }
    
    saveData();
    closeDeleteExerciseModal();
    renderExercises(currentSubject, currentChapter);
    showToast(`🗑️ Exercise "${exerciseName}" deleted successfully!`, 'success');
}

// Expose functions globally
window.showAddExerciseModal = showAddExerciseModal;
window.closeAddExerciseModal = closeAddExerciseModal;
window.addExercise = addExercise;
window.deleteExercise = deleteExercise;
window.closeDeleteExerciseModal = closeDeleteExerciseModal;
window.confirmDeleteExercise = confirmDeleteExercise;
window.setupExerciseAddButton = setupExerciseAddButton;

// ============================================
// EXERCISE EDIT MODE
// Move Up / Move Down / Delete
// ============================================

let exerciseEditMode = false;

function ensureExerciseOrder(chapter) {
    if (!chapter || !chapter.exercises) return [];

    const existingKeys = Object.keys(chapter.exercises);

    if (!Array.isArray(chapter.exerciseOrder)) {
        chapter.exerciseOrder = existingKeys.slice();
    } else {
        // Remove deleted exercises
        chapter.exerciseOrder = chapter.exerciseOrder.filter(
            key => chapter.exercises[key]
        );

        // Add any newly-created exercises
        existingKeys.forEach(key => {
            if (!chapter.exerciseOrder.includes(key)) {
                chapter.exerciseOrder.push(key);
            }
        });
    }

    return chapter.exerciseOrder;
}


// Toggle Edit Mode
function toggleExerciseEditMode() {
    exerciseEditMode = !exerciseEditMode;

    const btn = document.getElementById('editExercisesBtn');

    if (btn) {
        btn.classList.toggle('active', exerciseEditMode);

        btn.title = exerciseEditMode
            ? 'Done Editing'
            : 'Edit Exercises';

        btn.innerHTML = exerciseEditMode
            ? '<i class="fas fa-check"></i>'
            : '<i class="fas fa-pen"></i>';
    }

    renderExercises(currentSubject, currentChapter);
}


// Move Exercise
function moveExercise(exerciseKey, direction) {

    if (!currentSubject || !currentChapter) return;

    const chapter =
        appData.subjects[currentSubject]?.chapters[currentChapter];

    if (!chapter) return;

    const order = ensureExerciseOrder(chapter);

    const index = order.indexOf(exerciseKey);

    if (index === -1) return;

    const newIndex =
        direction === 'up'
            ? index - 1
            : index + 1;

    // Already at top/bottom
    if (newIndex < 0 || newIndex >= order.length) {
        showToast(
            direction === 'up'
                ? 'Already at the top'
                : 'Already at the bottom',
            'info'
        );
        return;
    }

    // Swap positions
    [order[index], order[newIndex]] =
        [order[newIndex], order[index]];

    saveData();

    renderExercises(
        currentSubject,
        currentChapter
    );
}


// ============================================
// EDIT BUTTON LISTENER
// ============================================

document.addEventListener('click', function(e) {

    const editBtn =
        e.target.closest('#editExercisesBtn');

    if (editBtn) {
        e.stopPropagation();
        toggleExerciseEditMode();
    }

});


// ============================================
// REPLACE EXERCISE RENDERER
// ============================================

const originalRenderExercises = renderExercises;

renderExercises = function(subjectKey, chapterKey) {

    const container =
        document.getElementById('exercisesContainer');

    if (!container) return;

    const subject =
        appData.subjects[subjectKey];

    const chapter =
        subject?.chapters[chapterKey];

    if (!subject || !chapter) return;

    const order =
        ensureExerciseOrder(chapter);

    container.innerHTML = '';

    const title =
        document.getElementById('chapterDetailTitle');

    if (title) {
        title.innerHTML =
            `<i class="fas fa-book"></i> ${chapter.name}`;
    }

    // Chapter status
    const statusKey =
        `${subjectKey}_${chapterKey}`;

    const currentStatus =
        appData.chapterStatus[statusKey] ||
        'not-started';

    document
        .querySelectorAll('.status-btn')
        .forEach(btn => {

            btn.classList.toggle(
                'active',
                btn.dataset.status === currentStatus
            );

        });


    // No exercises
    if (order.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-plus-circle"></i>
                <p>No exercises yet</p>
                <p class="sub">
                    Click the + button to add one
                </p>
            </div>
        `;

        return;
    }


    // Render exercises
    order.forEach((exKey, index) => {

        const exercise =
            chapter.exercises[exKey];

        if (!exercise) return;

        const questions =
            exercise.questions || [];

        const total =
            questions.length;

        const done =
            questions.filter(
                q => q === STATES.DONE
            ).length;

        const wrong =
            questions.filter(
                q => q === STATES.WRONG
            ).length;

        const review =
            questions.filter(
                q => q === STATES.REVIEW
            ).length;

        const notDone =
            questions.filter(
                q => q === STATES.NOT_DONE
            ).length;

        const progress =
            total > 0
                ? ((done + wrong) / total) * 100
                : 0;


        const item =
            document.createElement('div');

        item.className =
            exerciseEditMode
                ? 'exercise-item exercise-editing'
                : 'exercise-item';


        item.innerHTML = `

            <div class="exercise-top">

                <span class="exercise-name">
                    <i class="fas fa-list"></i>
                    ${exercise.name}
                </span>


                ${
                    exerciseEditMode
                    ? `

                    <div class="exercise-actions">

                        <button
                            class="exercise-move-btn"
                            data-action="move-up"
                            title="Move Up"
                            ${index === 0 ? 'disabled' : ''}>

                            <i class="fas fa-chevron-up"></i>

                        </button>


                        <button
                            class="exercise-move-btn"
                            data-action="move-down"
                            title="Move Down"
                            ${index === order.length - 1 ? 'disabled' : ''}>

                            <i class="fas fa-chevron-down"></i>

                        </button>


                        <button
                            class="exercise-delete-btn"
                            data-action="delete"
                            title="Delete Exercise">

                            <i class="fas fa-trash"></i>

                        </button>

                    </div>

                    `
                    : ''
                }

            </div>


            <div class="exercise-stats-row">

                <span class="done">
                    <i class="fas fa-check-circle"></i>
                    ${done}
                </span>

                <span class="wrong">
                    <i class="fas fa-times-circle"></i>
                    ${wrong}
                </span>

                <span class="review">
                    <i class="fas fa-flag"></i>
                    ${review}
                </span>

                <span class="not-done">
                    <i class="fas fa-circle"></i>
                    ${notDone}
                </span>

            </div>


            <div class="progress-track">

                <div
                    class="progress-fill"
                    style="
                        width: ${Math.round(progress)}%;
                        background: #9ca3af;
                    ">
                </div>

            </div>


            <div class="exercise-meta">
                ${total} questions •
                ${Math.round(progress)}% complete
            </div>

        `;


        // ========================================
        // EDIT MODE BUTTONS
        // ========================================

        if (exerciseEditMode) {

            // Move Up
            item
                .querySelector('[data-action="move-up"]')
                ?.addEventListener('click', function(e) {

                    e.stopPropagation();

                    moveExercise(
                        exKey,
                        'up'
                    );

                });


            // Move Down
            item
                .querySelector('[data-action="move-down"]')
                ?.addEventListener('click', function(e) {

                    e.stopPropagation();

                    moveExercise(
                        exKey,
                        'down'
                    );

                });


            // Delete
            item
                .querySelector('[data-action="delete"]')
                ?.addEventListener('click', function(e) {

                    e.stopPropagation();

                    deleteExercise(exKey);

                });

        }

        // Normal mode
        else {

            item.addEventListener(
                'click',
                function() {

                    openExercise(
                        subjectKey,
                        chapterKey,
                        exKey
                    );

                }
            );

        }


        container.appendChild(item);

    });

};


// ============================================
// RESET EDIT MODE WHEN OPENING A CHAPTER
// ============================================

const originalInitializePage =
    initializePage;

initializePage = function(page, params) {

    if (page === 'chapter-detail') {
        exerciseEditMode = false;

        setTimeout(function() {

            const btn =
                document.getElementById(
                    'editExercisesBtn'
                );

            if (btn) {
                btn.innerHTML =
                    '<i class="fas fa-pen"></i>';

                btn.classList.remove('active');

                btn.title =
                    'Edit Exercises';
            }

        }, 50);
    }

    return originalInitializePage(
        page,
        params
    );
};


// ============================================
// GLOBAL FUNCTIONS
// ============================================

window.toggleExerciseEditMode =
    toggleExerciseEditMode;

window.moveExercise =
    moveExercise;

window.ensureExerciseOrder =
    ensureExerciseOrder;
    
    // ============================================
// TEMPLATE FUNCTIONS
// ============================================

// Add template page to navigation
const TEMPLATE_PAGE = 'template';
PAGE_MAP['template'] = 'pages/template.html';

// Template data cache
const templateCache = {};

/**
 * Load a template from the template folder
 */
async function loadTemplate(subjectKey) {
    // Check cache first
    if (templateCache[subjectKey]) {
        return templateCache[subjectKey];
    }

    try {
        const response = await fetch(`template/${subjectKey}_template.json`);
        if (!response.ok) {
            throw new Error(`Failed to load template for ${subjectKey}`);
        }
        const data = await response.json();
        templateCache[subjectKey] = data;
        return data;
    } catch (error) {
        console.error('❌ Error loading template:', error);
        showToast(`Failed to load template: ${error.message}`, 'error');
        return null;
    }
}

/**
 * Show import modal with options
 */
async function showImportModal(subjectKey) {
    const template = await loadTemplate(subjectKey);
    if (!template) return;

    const subject = appData.subjects[subjectKey];
    const subjectName = subject ? subject.name : subjectKey;

    // Count existing chapters and exercises
    const existingChapters = subject ? Object.keys(subject.chapters).length : 0;
    const templateChapters = Object.keys(template.chapters).length;

    // Calculate what will be added
    let newChapters = 0;
    let newExercises = 0;
    let newQuestions = 0;

    if (subject) {
        const existingChapterKeys = Object.keys(subject.chapters);
        Object.keys(template.chapters).forEach(chKey => {
            if (!subject.chapters[chKey]) {
                newChapters++;
            } else {
                const templateChapter = template.chapters[chKey];
                const existingChapter = subject.chapters[chKey];
                Object.keys(templateChapter.exercises).forEach(exKey => {
                    if (!existingChapter.exercises[exKey]) {
                        newExercises++;
                    } else {
                        const templateCount = templateChapter.exercises[exKey].questions;
                        const existingCount = existingChapter.exercises[exKey].questions.length;
                        if (templateCount > existingCount) {
                            newQuestions += templateCount - existingCount;
                        }
                    }
                });
            }
        });
    } else {
        newChapters = templateChapters;
        // Count all questions in template
        Object.keys(template.chapters).forEach(chKey => {
            const chapter = template.chapters[chKey];
            Object.keys(chapter.exercises).forEach(exKey => {
                newQuestions += chapter.exercises[exKey].questions;
                newExercises++;
            });
        });
    }

    // Build modal
    const overlay = document.createElement('div');
    overlay.id = 'importModal';
    overlay.className = 'modal active';
    overlay.style.display = 'flex';

    overlay.innerHTML = `
        <div class="modal-content import-modal-content glass-3d">
            <div class="modal-header">
                <h3><i class="fas fa-file-import"></i> Import ${subjectName}</h3>
                <button class="modal-close" onclick="closeImportModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="import-preview">
                    <div class="import-preview-item">
                        <span class="label">Template Chapters</span>
                        <span class="value">${templateChapters}</span>
                    </div>
                    <div class="import-preview-item">
                        <span class="label">Existing Chapters</span>
                        <span class="value">${existingChapters}</span>
                    </div>
                    ${newChapters > 0 ? `
                        <div class="import-preview-item" style="color: var(--green);">
                            <span class="label">✦ New Chapters</span>
                            <span class="value">+${newChapters}</span>
                        </div>
                    ` : `
                        <div class="import-preview-item">
                            <span class="label">New Chapters</span>
                            <span class="value" style="color: var(--text-muted);">0</span>
                        </div>
                    `}
                    ${newExercises > 0 ? `
                        <div class="import-preview-item" style="color: var(--blue);">
                            <span class="label">✦ New Exercises</span>
                            <span class="value">+${newExercises}</span>
                        </div>
                    ` : `
                        <div class="import-preview-item">
                            <span class="label">New Exercises</span>
                            <span class="value" style="color: var(--text-muted);">0</span>
                        </div>
                    `}
                    ${newQuestions > 0 ? `
                        <div class="import-preview-item" style="color: var(--yellow);">
                            <span class="label">✦ New Questions</span>
                            <span class="value">+${newQuestions}</span>
                        </div>
                    ` : `
                        <div class="import-preview-item">
                            <span class="label">New Questions</span>
                            <span class="value" style="color: var(--text-muted);">0</span>
                        </div>
                    `}
                </div>

                <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px;">
                    <i class="fas fa-info-circle" style="color: var(--blue);"></i>
                    Choose how you want to import this template:
                </p>

                <div class="import-options">
                    <button class="import-option-btn" onclick="executeImport('${subjectKey}', 'replace')">
                        <div class="option-icon replace">
                            <i class="fas fa-undo-alt"></i>
                        </div>
                        <div class="option-info">
                            <h4>🔄 Replace / Overwrite</h4>
                            <p>Completely replace the subject with the template. <strong>All existing progress will be lost.</strong></p>
                        </div>
                    </button>
                    <button class="import-option-btn" onclick="executeImport('${subjectKey}', 'update')">
                        <div class="option-icon update">
                            <i class="fas fa-plus-circle"></i>
                        </div>
                        <div class="option-info">
                            <h4>➕ Add / Update</h4>
                            <p>Keep existing data. Add new chapters/exercises/questions. <strong>Your progress is preserved.</strong></p>
                        </div>
                    </button>
                </div>

                <p style="font-size: 12px; color: var(--text-muted); text-align: center; margin-top: 12px;">
                    ⚡ This will sync your data to the cloud.
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeImportModal();
        }
    });
}

/**
 * Close the import modal
 */
function closeImportModal() {
    const modal = document.getElementById('importModal');
    if (modal) modal.remove();
}

/**
 * Execute the import
 */
async function executeImport(subjectKey, mode) {
    const template = await loadTemplate(subjectKey);
    if (!template) {
        closeImportModal();
        return;
    }

    // Show loading
    if (typeof showLoading === 'function') {
        showLoading(true);
    }

    try {
        if (mode === 'replace') {
            await importReplace(subjectKey, template);
        } else if (mode === 'update') {
            await importUpdate(subjectKey, template);
        }

        // Save and sync
        if (typeof saveData === 'function') {
            saveData();
        }
        
        if (typeof syncToSupabase === 'function') {
            await syncToSupabase();
        }

        // Close modal and refresh
        closeImportModal();
        
        if (typeof showLoading === 'function') {
            showLoading(false);
        }

        const subject = appData.subjects[subjectKey];
        showToast(`✅ ${subject.name} imported successfully!`, 'success');

        // Refresh current view
        if (currentPage === 'template') {
            renderTemplatePage();
        } else if (currentPage === 'subjects') {
            renderSubjects();
        } else if (currentPage === 'subject-detail' && currentSubject === subjectKey) {
            renderChapters(subjectKey);
        }

        // Refresh dashboard if needed
        if (currentPage === 'dashboard') {
            renderDashboard();
        }

    } catch (error) {
        console.error('❌ Import error:', error);
        if (typeof showLoading === 'function') {
            showLoading(false);
        }
        showToast(`❌ Import failed: ${error.message}`, 'error');
    }
}

/**
 * Replace: Completely overwrite the subject
 */
function importReplace(subjectKey, template) {
    console.log(`🔄 Replacing ${subjectKey} with template`);

    const subject = appData.subjects[subjectKey];
    if (!subject) {
        throw new Error(`Subject ${subjectKey} not found`);
    }

    // Clear existing chapters
    subject.chapters = {};
    
    // Reset chapter order
subject.chapterOrder = [];

    // Create new chapters from template
    Object.keys(template.chapters).forEach(chKey => {
        const templateChapter = template.chapters[chKey];
        
        // Create exercises
        const exercises = {};
        Object.keys(templateChapter.exercises).forEach(exKey => {
            const templateExercise = templateChapter.exercises[exKey];
            const count = templateExercise.questions || 0;
            exercises[exKey] = {
                name: templateExercise.name,
                questions: new Array(count).fill(STATES.NOT_DONE)
            };
        });

        // Add chapter
        subject.chapters[chKey] = {
            name: templateChapter.name,
            exercises: exercises
        };
    });
    
    // Add all chapters to order
subject.chapterOrder = Object.keys(template.chapters);

    // Reset pinned chapters
    subject.pinned = [];

    // Clear chapter status for this subject
    Object.keys(appData.chapterStatus).forEach(key => {
        if (key.startsWith(`${subjectKey}_`)) {
            delete appData.chapterStatus[key];
        }
    });

    // Clear question notes/difficulty/revision/history for this subject
    const toRemove = [];
    Object.keys(appData.questionNotes).forEach(key => {
        if (key.startsWith(`${subjectKey}_`)) {
            toRemove.push(key);
        }
    });
    toRemove.forEach(key => {
        delete appData.questionNotes[key];
        delete appData.questionDifficulty[key];
        delete appData.questionRevision[key];
        delete appData.questionHistory[key];
    });

    console.log(`✅ ${subjectKey} replaced successfully`);
}

/**
 * Update: Add new content, preserve existing progress
 */
function importUpdate(subjectKey, template) {
    console.log(`➕ Updating ${subjectKey} with template`);

    const subject = appData.subjects[subjectKey];
    if (!subject) {
        throw new Error(`Subject ${subjectKey} not found`);
    }

    let newChapters = 0;
    let newExercises = 0;
    let newQuestions = 0;

    // Iterate through template chapters
    Object.keys(template.chapters).forEach(chKey => {
        const templateChapter = template.chapters[chKey];

        // If chapter doesn't exist, create it
        if (!subject.chapters[chKey]) {
            const exercises = {};
            Object.keys(templateChapter.exercises).forEach(exKey => {
                const templateExercise = templateChapter.exercises[exKey];
                const count = templateExercise.questions || 0;
                exercises[exKey] = {
                    name: templateExercise.name,
                    questions: new Array(count).fill(STATES.NOT_DONE)
                };
                newExercises++;
                newQuestions += count;
            });

            subject.chapters[chKey] = {
                name: templateChapter.name,
                exercises: exercises
            };
            newChapters++;
            
            console.log(`  📁 Added new chapter: ${templateChapter.name}`);
            return;
        }

        // Chapter exists - update exercises
        const existingChapter = subject.chapters[chKey];

        Object.keys(templateChapter.exercises).forEach(exKey => {
            const templateExercise = templateChapter.exercises[exKey];
            const templateCount = templateExercise.questions || 0;

            // If exercise doesn't exist, create it
            if (!existingChapter.exercises[exKey]) {
                existingChapter.exercises[exKey] = {
                    name: templateExercise.name,
                    questions: new Array(templateCount).fill(STATES.NOT_DONE)
                };
                newExercises++;
                newQuestions += templateCount;
                console.log(`    📄 Added new exercise: ${templateExercise.name}`);
                return;
            }

            // Exercise exists - add missing questions if needed
            const existingExercise = existingChapter.exercises[exKey];
            const existingCount = existingExercise.questions.length;

            if (templateCount > existingCount) {
                const missing = templateCount - existingCount;
                for (let i = 0; i < missing; i++) {
                    existingExercise.questions.push(STATES.NOT_DONE);
                }
                newQuestions += missing;
                console.log(`    🔢 Added ${missing} questions to: ${templateExercise.name}`);
            } else if (templateCount < existingCount) {
                // Template has fewer questions - keep existing (don't remove)
                console.log(`    ⚠️ Template has fewer questions (${templateCount}) than existing (${existingCount}) for ${templateExercise.name}. Keeping all existing questions.`);
            }
        });
    });

    // Remove chapters that are in the subject but not in the template (only for update?)
    // We'll keep them - users might have added their own content

    // Also check: if a chapter exists in subject but not template, it's preserved
    
    // ✅ Add new chapters to order (in template order)
if (!subject.chapterOrder) subject.chapterOrder = [];
Object.keys(template.chapters).forEach(chKey => {
    if (!subject.chapterOrder.includes(chKey)) {
        subject.chapterOrder.push(chKey);
    }
});

    console.log(`✅ ${subjectKey} updated: +${newChapters} chapters, +${newExercises} exercises, +${newQuestions} questions`);
}

/**
 * Render the template page
 */
function renderTemplatePage() {
    // The template page is static HTML, but we need to attach event listeners
    setTimeout(() => {
        document.querySelectorAll('.import-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const subject = this.dataset.subject;
                showImportModal(subject);
            });
        });
    }, 100);
}

// Add template to navigation
function setupTemplateNavigation() {
    // Add template to hamburger menu if not already there
    const hamburgerItems = document.getElementById('hamburgerMenu')?.querySelector('.hamburger-items');
    if (hamburgerItems) {
        // Check if template item already exists
        const existing = hamburgerItems.querySelector('[data-page="template"]');
        if (!existing) {
            const templateItem = document.createElement('div');
            templateItem.className = 'hamburger-item';
            templateItem.dataset.page = 'template';
            templateItem.innerHTML = '<i class="fas fa-file-import"></i> Templates';
            
            // Insert before settings
            const settingsItem = hamburgerItems.querySelector('[data-page="settings"]');
            if (settingsItem) {
                hamburgerItems.insertBefore(templateItem, settingsItem);
            } else {
                hamburgerItems.appendChild(templateItem);
            }
            
            templateItem.addEventListener('click', () => {
                navigateTo('template');
            });
        }
    }
}

// Override initializePage to handle template page
const originalInitPage = initializePage;
initializePage = function(page, params) {
    if (page === 'template') {
        renderTemplatePage();
        return;
    }
    originalInitPage(page, params);
};

// Call this after app initialization
function initTemplateFeature() {
    setupTemplateNavigation();
    console.log('✅ Template feature initialized');
}

// Expose functions globally
window.showImportModal = showImportModal;
window.closeImportModal = closeImportModal;
window.executeImport = executeImport;
window.importReplace = importReplace;
window.importUpdate = importUpdate;
window.renderTemplatePage = renderTemplatePage;
window.initTemplateFeature = initTemplateFeature;

// Ensure chapter order exists for a subject
function ensureChapterOrder(subjectKey) {
    const subject = appData.subjects[subjectKey];
    if (!subject) return [];
    
    // If chapterOrder doesn't exist, create it from existing chapters
    if (!subject.chapterOrder) {
        subject.chapterOrder = Object.keys(subject.chapters);
    } else {
        // Remove deleted chapters (clean up)
        subject.chapterOrder = subject.chapterOrder.filter(key => subject.chapters[key]);
        
        // Add new chapters that aren't in order yet
        Object.keys(subject.chapters).forEach(key => {
            if (!subject.chapterOrder.includes(key)) {
                subject.chapterOrder.push(key);
            }
        });
    }
    
    return subject.chapterOrder;
}

// ============================================
// FIX: Template Page Back Button
// ============================================

// Fix back button when template page loads
const originalRenderTemplatePage = window.renderTemplatePage || function() {};

window.renderTemplatePage = function() {
    // Call original function if it exists
    if (typeof originalRenderTemplatePage === 'function') {
        originalRenderTemplatePage();
    }
    
    // Fix back button
    setTimeout(() => {
        const backBtn = document.getElementById('backFromTemplate');
        if (backBtn) {
            // Remove existing listeners
            const newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);
            
            newBackBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                navigateTo('dashboard');
            });
        }
    }, 150);
};

// Also fix goBack to handle template
const originalGoBack = window.goBack || function() {};

window.goBack = function(from) {
    if (from === 'template') {
        navigateTo('dashboard');
        return;
    }
    // Call original goBack for other pages
    if (typeof originalGoBack === 'function') {
        originalGoBack(from);
    } else {
        navigateTo('dashboard');
    }
};

console.log('✅ Template back button fix applied');