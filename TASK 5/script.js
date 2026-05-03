const AppState = {
    isAuthenticated: false,
    currentUser: null,
    currentSection: 'browse',
    savedNotes: [],
    pendingSubmissions: []
};

// ===================================
// DOM Elements
// ===================================

const elements = {
    authBtn: document.getElementById('authBtn'),
    signOutBtn: document.getElementById('signOutBtn'),
    userMenu: document.getElementById('userMenu'),
    userName: document.getElementById('userName'),
    userRole: document.getElementById('userRole'),
    userInitial: document.getElementById('userInitial'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: {
        browse: document.getElementById('browse'),
        submit: document.getElementById('submit'),
        offline: document.getElementById('offline'),
        moderation: document.getElementById('moderation')
    },
    notesGrid: document.getElementById('notesGrid'),
    offlineGrid: document.getElementById('offlineGrid'),
    offlineEmpty: document.getElementById('offlineEmpty'),
    submitForm: document.getElementById('submitForm'),
    rejectModal: document.getElementById('rejectModal'),
    filters: {
        subject: document.getElementById('subjectFilter'),
        unit: document.getElementById('unitFilter'),
        search: document.getElementById('searchFilter')
    }
};

// ===================================
// Authentication
// ===================================

function handleSignIn() {
    // Simulate Internet Identity sign-in
    // In production, this would integrate with Internet Identity
    
    const mockUsers = [
        { name: 'Alex Kumar', email: 'alex.kumar@college.edu', role: 'student' },
        { name: 'Priyanshu Kumar', email: 'sarah.mod@college.edu', role: 'moderator' }
    ];
    
    // Randomly assign user for demo
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    
    AppState.isAuthenticated = true;
    AppState.currentUser = user;
    
    updateAuthUI();
    
    // Show success message
    console.log('Signed in as:', user.name);
}

function handleSignOut() {
    AppState.isAuthenticated = false;
    AppState.currentUser = null;
    
    updateAuthUI();
    
    // Navigate back to browse
    navigateToSection('browse');
    
    console.log('Signed out successfully');
}

function updateAuthUI() {
    if (AppState.isAuthenticated && AppState.currentUser) {
        elements.authBtn.classList.add('hidden');
        elements.userMenu.classList.remove('hidden');
        
        elements.userName.textContent = AppState.currentUser.name;
        elements.userRole.textContent = AppState.currentUser.role === 'moderator' ? 'Moderator' : 'Student';
        elements.userInitial.textContent = AppState.currentUser.name.charAt(0);
        
        // Show/hide moderator-only elements
        const modElements = document.querySelectorAll('.mod-only');
        modElements.forEach(el => {
            if (AppState.currentUser.role === 'moderator') {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
    } else {
        elements.authBtn.classList.remove('hidden');
        elements.userMenu.classList.add('hidden');
        
        // Hide all moderator-only elements
        const modElements = document.querySelectorAll('.mod-only');
        modElements.forEach(el => el.classList.add('hidden'));
    }
}

// ===================================
// Navigation
// ===================================

function navigateToSection(sectionName) {
    AppState.currentSection = sectionName;
    
    // Update nav links
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionName}`) {
            link.classList.add('active');
        }
    });
    
    // Hide all sections
    Object.values(elements.sections).forEach(section => {
        if (section) section.classList.add('hidden');
    });
    
    // Show current section
    const currentSection = elements.sections[sectionName];
    if (currentSection) {
        currentSection.classList.remove('hidden');
    }
    
    // Special handling for offline section
    if (sectionName === 'offline') {
        updateOfflineView();
    }
}

// ===================================
// Notes Management
// ===================================

function toggleSaveNote(noteId, button) {
    const isSaved = button.classList.contains('saved');
    
    if (isSaved) {
        // Remove from saved notes
        AppState.savedNotes = AppState.savedNotes.filter(id => id !== noteId);
        button.classList.remove('saved');
        button.querySelector('svg').setAttribute('fill', 'none');
        console.log('Note removed from offline:', noteId);
    } else {
        // Add to saved notes
        AppState.savedNotes.push(noteId);
        button.classList.add('saved');
        button.querySelector('svg').setAttribute('fill', 'currentColor');
        console.log('Note saved for offline:', noteId);
    }
}

function updateOfflineView() {
    if (AppState.savedNotes.length === 0) {
        elements.offlineGrid.classList.add('hidden');
        elements.offlineEmpty.classList.remove('hidden');
    } else {
        elements.offlineGrid.classList.remove('hidden');
        elements.offlineEmpty.classList.add('hidden');
    }
}

// ===================================
// Filters
// ===================================

function applyFilters() {
    const subject = elements.filters.subject.value;
    const unit = elements.filters.unit.value;
    const search = elements.filters.search.value.toLowerCase();
    
    const noteCards = elements.notesGrid.querySelectorAll('.note-card');
    
    noteCards.forEach(card => {
        const cardSubject = card.querySelector('.note-subject').textContent.toLowerCase();
        const cardUnit = card.querySelector('.note-unit').textContent;
        const cardTitle = card.querySelector('.note-title').textContent.toLowerCase();
        const cardDescription = card.querySelector('.note-description').textContent.toLowerCase();
        
        const subjectMatch = !subject || cardSubject.includes(subject.toLowerCase());
        const unitMatch = !unit || cardUnit.includes(unit);
        const searchMatch = !search || cardTitle.includes(search) || cardDescription.includes(search);
        
        if (subjectMatch && unitMatch && searchMatch) {
            card.style.display = 'block';
            
            // Add fade-in animation
            card.style.animation = 'fadeIn 0.4s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log('Filters applied:', { subject, unit, search });
}

// ===================================
// Form Submission
// ===================================

function handleSubmitForm(event) {
    event.preventDefault();
    
    if (!AppState.isAuthenticated) {
        alert('Please sign in to submit notes');
        return;
    }
    
    const formData = {
        subject: document.getElementById('noteSubject').value,
        unit: document.getElementById('noteUnit').value,
        title: document.getElementById('noteTitle').value,
        description: document.getElementById('noteDescription').value,
        file: document.getElementById('noteFile').files[0]
    };
    
    // Validate form
    if (!formData.subject || !formData.unit || !formData.title || !formData.description || !formData.file) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate file size (10MB max)
    if (formData.file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }
    
    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = formData.file.name.substring(formData.file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
        alert('Only PDF, DOC, and DOCX files are allowed');
        return;
    }
    
    // Submit to backend (simulated)
    console.log('Submitting note:', formData);
    
    // Add to pending submissions
    AppState.pendingSubmissions.push({
        id: Date.now(),
        ...formData,
        status: 'pending',
        submittedAt: new Date()
    });
    
    // Show success message
    alert('Your note has been submitted for review!');
    
    // Reset form
    elements.submitForm.reset();
    
    console.log('Note submitted successfully');
}

// ===================================
// Moderation
// ===================================

function handleVerifyNote(noteId) {
    console.log('Verifying note:', noteId);
    alert('Note verified and published!');
    // In production, this would call the backend API
}

function handleRejectNote(noteId) {
    // Show rejection modal
    elements.rejectModal.classList.remove('hidden');
    
    // Store noteId for later use
    elements.rejectModal.dataset.noteId = noteId;
    
    console.log('Rejecting note:', noteId);
}

function confirmRejection() {
    const noteId = elements.rejectModal.dataset.noteId;
    const reason = elements.rejectModal.querySelector('.form-textarea').value;
    
    if (!reason.trim()) {
        alert('Please provide a reason for rejection');
        return;
    }
    
    console.log('Note rejected:', { noteId, reason });
    alert('Note has been rejected with feedback sent to submitter');
    
    // Close modal
    closeModal();
    
    // In production, this would call the backend API
}

function closeModal() {
    elements.rejectModal.classList.add('hidden');
    elements.rejectModal.querySelector('.form-textarea').value = '';
}

// ===================================
// File Upload
// ===================================

function handleFileChange(event) {
    const file = event.target.files[0];
    const label = event.target.nextElementSibling;
    
    if (file) {
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB
        
        label.querySelector('.file-text').textContent = fileName;
        label.querySelector('.file-info').textContent = `${fileSize} MB`;
    } else {
        label.querySelector('.file-text').textContent = 'Choose file or drag here';
        label.querySelector('.file-info').textContent = 'PDF, DOC, DOCX (Max 10MB)';
    }
}

// ===================================
// Event Listeners
// ===================================

function initializeEventListeners() {
    // Authentication
    if (elements.authBtn) {
        elements.authBtn.addEventListener('click', handleSignIn);
    }
    
    if (elements.signOutBtn) {
        elements.signOutBtn.addEventListener('click', handleSignOut);
    }
    
    // Navigation
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = link.getAttribute('href').substring(1);
            navigateToSection(sectionName);
        });
    });
    
    // Save buttons
    const saveButtons = document.querySelectorAll('.btn-save');
    saveButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            toggleSaveNote(`note-${index}`, button);
        });
    });
    
    // Filter button
    const filterButton = document.querySelector('.btn-filter');
    if (filterButton) {
        filterButton.addEventListener('click', applyFilters);
    }
    
    // Submit form
    if (elements.submitForm) {
        elements.submitForm.addEventListener('submit', handleSubmitForm);
    }
    
    // File upload
    const fileInput = document.getElementById('noteFile');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileChange);
    }
    
    // Moderation buttons
    const verifyButtons = document.querySelectorAll('.btn-verify');
    verifyButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            handleVerifyNote(`pending-${index}`);
        });
    });
    
    const rejectButtons = document.querySelectorAll('.btn-reject');
    rejectButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            handleRejectNote(`pending-${index}`);
        });
    });
    
    // Modal close
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Modal confirm button
    const modalConfirm = elements.rejectModal?.querySelector('.btn-submit');
    if (modalConfirm) {
        modalConfirm.addEventListener('click', confirmRejection);
    }
    
    // Modal cancel button
    const modalCancel = elements.rejectModal?.querySelector('.btn-secondary');
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }
    
    // Offline remove buttons
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            console.log('Removing offline note:', index);
            button.closest('.offline-card').remove();
            updateOfflineView();
        });
    });
    
    // Real-time search
    if (elements.filters.search) {
        elements.filters.search.addEventListener('input', debounce(applyFilters, 300));
    }
}

// ===================================
// Utility Functions
// ===================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// Initialization
// ===================================

function init() {
    console.log('Nota Bene Portal Initialized');
    
    // Set initial state
    updateAuthUI();
    navigateToSection('browse');
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Check for saved notes in localStorage (for offline functionality)
    const savedNotes = localStorage.getItem('notaBeneSavedNotes');
    if (savedNotes) {
        AppState.savedNotes = JSON.parse(savedNotes);
        
        // Update UI for saved notes
        AppState.savedNotes.forEach(noteId => {
            const button = document.querySelector(`[data-note-id="${noteId}"]`);
            if (button) {
                button.classList.add('saved');
                button.querySelector('svg').setAttribute('fill', 'currentColor');
            }
        });
    }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Save state to localStorage before page unload
window.addEventListener('beforeunload', () => {
    localStorage.setItem('notaBeneSavedNotes', JSON.stringify(AppState.savedNotes));
});

// ===================================
// Service Worker Registration (for offline functionality)
// ===================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
