// main.js - Client-side functionality for SafetySync EHS App

document.addEventListener('DOMContentLoaded', function()  {
    // Initialize interactive elements
    initializeNavigation();
    initializeFormHandling();
    
    // Check if user is logged in
    checkAuthStatus();
});

// Handle navigation between pages
function initializeNavigation() {
    const navLinks = document.querySelectorAll('nav a, .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetPage = this.getAttribute('href').substring(1);
                navigateTo(targetPage);
            }
        });
    });
}

// Handle form submissions
function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formId = this.id;
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Handle different form types
            if (formId === 'loginForm') {
                handleLogin(formObject);
            } else if (formId === 'incidentForm') {
                submitIncidentReport(formObject);
            } else if (formId === 'inspectionForm') {
                submitInspection(formObject);
            } else {
                // Generic form handling
                submitFormData(formId, formObject);
            }
        });
    });
}

// Check authentication status
function checkAuthStatus() {
    fetch('/api/auth/status')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                showAuthenticatedUI(data.user);
            } else {
                showLoginUI();
            }
        })
        .catch(error => {
            console.error('Auth check failed:', error);
            showLoginUI();
        });
}

// Handle login form submission
function handleLogin(credentials) {
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAuthenticatedUI(data.user);
        } else {
            showLoginError(data.message);
        }
    })
    .catch(error => {
        console.error('Login failed:', error);
        showLoginError('Login failed. Please try again.');
    });
}

// Submit incident report
function submitIncidentReport(reportData) {
    fetch('/api/incidents/report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessMessage('Incident reported successfully!');
        } else {
            showErrorMessage(data.message);
        }
    })
    .catch(error => {
        console.error('Report submission failed:', error);
        showErrorMessage('Failed to submit report. Please try again.');
    });
}

// Helper functions for UI updates
function navigateTo(page) {
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(page);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

function showAuthenticatedUI(user) {
  const loginSection = document.getElementById('loginSection');
  const dashboardSection = document.getElementById('dashboardSection');
  
  if (loginSection) {
    loginSection.style.display = 'none';
  }
  
  if (dashboardSection) {
    dashboardSection.style.display = 'block';
  }
  
  // Update user info display
  const userInfoElement = document.getElementById('userInfo');
  if (userInfoElement) {
    userInfoElement.textContent = `Welcome, ${user.name}`;
  }
}

function showLoginUI() {
  const loginSection = document.getElementById('loginSection');
  const dashboardSection = document.getElementById('dashboardSection');
  
  if (loginSection) {
    loginSection.style.display = 'block';
  }
  
  if (dashboardSection) {
    dashboardSection.style.display = 'none';
  }
}

function showSuccessMessage(message) {
    alert(message); // Replace with better UI feedback in production
}

function showErrorMessage(message) {
    alert('Error: ' + message); // Replace with better UI feedback in production
}
