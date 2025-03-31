// Simple JavaScript for SafetySync EHS App

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function()  {
    console.log('SafetySync EHS App loaded successfully!');
    
    // Add click handlers to all navigation links
    setupNavigation();
    
    // Add handlers to all forms
    setupForms();
    
    // Add click handlers to all buttons
    setupButtons();
});

// Set up navigation between pages
function setupNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav a, .nav-link, [data-nav]');
    
    // Add click handler to each link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Only handle links that should trigger navigation
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Get the target section ID
                const targetId = this.getAttribute('href').substring(1);
                
                // Navigate to that section
                navigateTo(targetId);
                
                console.log('Navigated to:', targetId);
            }
        });
    });
    
    console.log('Navigation setup complete');
}

// Handle form submissions
function setupForms() {
    // Get all forms
    const forms = document.querySelectorAll('form');
    
    // Add submit handler to each form
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            // Prevent default form submission
            e.preventDefault();
            
            // Show success message
            alert('Form submitted successfully! (This is a demo)');
            
            console.log('Form submitted:', this.id);
        });
    });
    
    console.log('Form handling setup complete');
}

// Set up button click handlers
function setupButtons() {
    // Get all buttons
    const buttons = document.querySelectorAll('button, .btn, [data-btn]');
    
    // Add click handler to each button
    buttons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            // Only handle buttons that aren't in forms (forms are handled separately)
            if (!this.closest('form')) {
                console.log('Button clicked:', this.textContent.trim());
                
                // If the button has a data-action attribute, handle it
                const action = this.getAttribute('data-action');
                if (action) {
                    handleButtonAction(action, this);
                }
            }
        });
    });
    
    console.log('Button handling setup complete');
}

// Navigate to a specific section
function navigateTo(sectionId) {
    // Hide all sections
    const allSections = document.querySelectorAll('.section, section, [data-section]');
    allSections.forEach(function(section) {
        section.style.display = 'none';
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    } else {
        console.error('Section not found:', sectionId);
    }
}

// Handle button actions
function handleButtonAction(action, button) {
    switch(action) {
        case 'login':
            alert('Login functionality would happen here');
            break;
        case 'report-incident':
            alert('Incident report submitted successfully!');
            break;
        case 'view-details':
            alert('Viewing details for item: ' + button.getAttribute('data-id'));
            break;
        default:
            console.log('Unknown action:', action);
    }
}
