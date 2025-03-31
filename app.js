// Enhanced JavaScript for SafetySync EHS App

// Store user data (in a real app, this would be server-side)
const users = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
    { username: 'user', password: 'user123', role: 'user', name: 'Regular User' }
];

// Store for form submissions and data
const appData = {
    incidents: [
        { id: 'INC-001', title: 'Chemical Spill in Lab', status: 'In Progress', date: 'Mar 28, 2025', description: 'Minor chemical spill in the science lab.' },
        { id: 'INC-002', title: 'Slip and Fall in Hallway', status: 'Resolved', date: 'Mar 25, 2025', description: 'Student slipped on wet floor in main hallway.' },
        { id: 'INC-003', title: 'Electrical Outage', status: 'Critical', date: 'Mar 30, 2025', description: 'Power outage affecting east wing of building.' }
    ],
    maintenanceRequests: [],
    tasks: []
};

// Current user session
let currentUser = null;

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SafetySync EHS App loaded successfully!');
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Add click handlers to all navigation links
    setupNavigation();
    
    // Add handlers to all forms
    setupForms();
    
    // Add click handlers to all buttons
    setupButtons();
    
    // Setup login form if on login page
    setupLoginForm();
});

// Check if user is logged in
function checkAuthStatus() {
    // In a real app, this would check a session cookie or token
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        console.log('User is logged in:', currentUser.name);
        
        // Update UI to show logged in user
        updateUserInfo();
        
        // If on login page, redirect to dashboard
        if (window.location.pathname.includes('login.html')) {
            window.location.href = '/dashboard.html';
        }
    } else {
        console.log('No user logged in');
        
        // If not on login page, redirect to login
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = '/login.html';
        }
    }
}

// Update UI with user info
function updateUserInfo() {
    if (!currentUser) return;
    
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        userInfoElement.textContent = currentUser.name;
    }
    
    // Show admin controls if user is admin
    if (currentUser.role === 'admin') {
        const adminControls = document.querySelectorAll('.admin-only');
        adminControls.forEach(control => {
            control.style.display = 'block';
        });
    }
}

// Set up login form
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Find user
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Store user info (in a real app, this would be a session token)
            currentUser = {
                username: user.username,
                role: user.role,
                name: user.name
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Redirect to dashboard
            window.location.href = '/dashboard.html';
        } else {
            // Show error message
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) {
                errorMessage.style.display = 'block';
            }
        }
    });
}

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
                
                // Update active class
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
                
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
        // Skip login form (handled separately)
        if (form.id === 'loginForm') return;
        
        form.addEventListener('submit', function(e) {
            // Prevent default form submission
            e.preventDefault();
            
            // Handle different form types
            if (form.id === 'incidentForm') {
                handleIncidentSubmission(form);
            } else if (form.id === 'maintenanceForm') {
                handleMaintenanceSubmission(form);
            } else {
                // Generic form handling
                alert('Form submitted successfully! (This is a demo)');
            }
            
            console.log('Form submitted:', this.id);
        });
    });
    
    console.log('Form handling setup complete');
}

// Handle incident report submission
function handleIncidentSubmission(form) {
    // Get form values
    const title = form.querySelector('[name="incidentTitle"]') ? 
                 form.querySelector('[name="incidentTitle"]').value : 'New Incident';
    
    const location = form.querySelector('[name="incidentLocation"]') ?
                    form.querySelector('[name="incidentLocation"]').value : 'Unknown';
    
    const description = form.querySelector('[name="incidentDescription"]') ?
                       form.querySelector('[name="incidentDescription"]').value : '';
    
    const severity = form.querySelector('[name="incidentSeverity"]') ?
                    form.querySelector('[name="incidentSeverity"]').value : 'medium';
    
    // Create new incident
    const newIncident = {
        id: 'INC-' + (appData.incidents.length + 1).toString().padStart(3, '0'),
        title: title,
        location: location,
        description: description,
        severity: severity,
        status: 'New',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        reportedBy: currentUser ? currentUser.name : 'Anonymous'
    };
    
    // Add to incidents array
    appData.incidents.push(newIncident);
    
    // Save to localStorage (in a real app, this would be sent to a server)
    localStorage.setItem('appData', JSON.stringify(appData));
    
    // Show success message
    alert('Incident reported successfully! Incident ID: ' + newIncident.id);
    
    // Reset form
    form.reset();
    
    // Refresh incidents list if visible
    refreshIncidentsList();
}

// Handle maintenance request submission
function handleMaintenanceSubmission(form) {
    // Get form values
    const title = form.querySelector('[name="requestTitle"]') ? 
                 form.querySelector('[name="requestTitle"]').value : 'New Request';
    
    const location = form.querySelector('[name="requestLocation"]') ?
                    form.querySelector('[name="requestLocation"]').value : 'Unknown';
    
    const description = form.querySelector('[name="requestDescription"]') ?
                       form.querySelector('[name="requestDescription"]').value : '';
    
    const priority = form.querySelector('[name="requestPriority"]') ?
                    form.querySelector('[name="requestPriority"]').value : 'medium';
    
    // Create new maintenance request
    const newRequest = {
        id: 'MNT-' + (appData.maintenanceRequests.length + 1).toString().padStart(3, '0'),
        title: title,
        location: location,
        description: description,
        priority: priority,
        status: 'New',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        requestedBy: currentUser ? currentUser.name : 'Anonymous'
    };
    
    // Add to maintenance requests array
    appData.maintenanceRequests.push(newRequest);
    
    // Save to localStorage (in a real app, this would be sent to a server)
    localStorage.setItem('appData', JSON.stringify(appData));
    
    // Show success message
    alert('Maintenance request submitted successfully! Request ID: ' + newRequest.id);
    
    // Reset form
    form.reset();
}

// Refresh the incidents list in the UI
function refreshIncidentsList() {
    const incidentsTable = document.querySelector('#dashboard table tbody');
    if (!incidentsTable) return;
    
    // Clear existing rows
    incidentsTable.innerHTML = '';
    
    // Get the most recent 3 incidents
    const recentIncidents = [...appData.incidents].reverse().slice(0, 3);
    
    // Add rows for each incident
    recentIncidents.forEach(incident => {
        const row = document.createElement('tr');
        
        // Create status class
        let statusClass = 'in-progress';
        if (incident.status === 'Resolved') statusClass = 'resolved';
        if (incident.status === 'Critical') statusClass = 'critical';
        
        row.innerHTML = `
            <td>${incident.id}</td>
            <td>${incident.title}</td>
            <td><span class="status ${statusClass}">${incident.status}</span></td>
            <td>${incident.date}</td>
            <td><button class="view-btn" data-action="view-details" data-id="${incident.id}">View</button></td>
        `;
        
        incidentsTable.appendChild(row);
    });
}

// Set up button click handlers
function setupButtons() {
    // Get all buttons
    const buttons = document.querySelectorAll('button, .btn, [data-btn]');
    
    // Add click handler to each button
    buttons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            // Only handle buttons that aren't in forms (forms are handled separately)
            if (!this.closest('form') || this.getAttribute('data-action')) {
                const action = this.getAttribute('data-action');
                if (action) {
                    e.preventDefault(); // Prevent form submission if in a form
                    handleButtonAction(action, this);
                }
            }
        });
    });
    
    // Add logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
    
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
            // Handled by form submission
            break;
            
        case 'logout':
            logout();
            break;
            
        case 'report-incident':
            // Handled by form submission
            break;
            
        case 'view-details':
            const id = button.getAttribute('data-id');
            viewItemDetails(id);
            break;
            
        case 'edit-item':
            const editId = button.getAttribute('data-id');
            editItem(editId);
            break;
            
        case 'delete-item':
            const deleteId = button.getAttribute('data-id');
            deleteItem(deleteId);
            break;
            
        default:
            console.log('Unknown action:', action);
    }
}

// View details of an item
function viewItemDetails(id) {
    // Find the item
    let item = null;
    
    if (id.startsWith('INC-')) {
        item = appData.incidents.find(inc => inc.id === id);
    } else if (id.startsWith('MNT-')) {
        item = appData.maintenanceRequests.find(req => req.id === id);
    }
    
    if (item) {
        // In a real app, this would open a modal or navigate to a details page
        let details = `
            ID: ${item.id}
            Title: ${item.title}
            Status: ${item.status}
            Date: ${item.date}
            ${item.description ? 'Description: ' + item.description : ''}
        `;
        
        alert(details);
    } else {
        alert('Item not found');
    }
}

// Edit an item
function editItem(id) {
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Only administrators can edit items');
        return;
    }
    
    // Find the item
    let item = null;
    let itemType = '';
    
    if (id.startsWith('INC-')) {
        item = appData.incidents.find(inc => inc.id === id);
        itemType = 'incident';
    } else if (id.startsWith('MNT-')) {
        item = appData.maintenanceRequests.find(req => req.id === id);
        itemType = 'maintenance request';
    }
    
    if (item) {
        // In a real app, this would open a form for editing
        const newTitle = prompt('Edit title:', item.title);
        if (newTitle && newTitle.trim() !== '') {
            item.title = newTitle;
            
            // Save changes
            localStorage.setItem('appData', JSON.stringify(appData));
            
            alert(`${itemType} updated successfully`);
            
            // Refresh UI
            refreshIncidentsList();
        }
    } else {
        alert('Item not found');
    }
}

// Delete an item
function deleteItem(id) {
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Only administrators can delete items');
        return;
    }
    
    // Find the item
    let itemIndex = -1;
    let itemArray = null;
    let itemType = '';
    
    if (id.startsWith('INC-')) {
        itemIndex = appData.incidents.findIndex(inc => inc.id === id);
        itemArray = appData.incidents;
        itemType = 'incident';
    } else if (id.startsWith('MNT-')) {
        itemIndex = appData.maintenanceRequests.findIndex(req => req.id === id);
        itemArray = appData.maintenanceRequests;
        itemType = 'maintenance request';
    }
    
    if (itemIndex !== -1) {
        if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
            // Remove the item
            itemArray.splice(itemIndex, 1);
            
            // Save changes
            localStorage.setItem('appData', JSON.stringify(appData));
            
            alert(`${itemType} deleted successfully`);
            
            // Refresh UI
            refreshIncidentsList();
        }
    } else {
        alert('Item not found');
    }
}

// Logout function
function logout() {
    // Clear user data
    localStorage.removeItem('currentUser');
    currentUser = null;
    
    // Redirect to login page
    window.location.href = '/login.html';
}

// Load saved data on startup
(function loadSavedData() {
    const savedData = localStorage.getItem('appData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Merge saved data with default data
            appData.incidents = parsedData.incidents || appData.incidents;
            appData.maintenanceRequests = parsedData.maintenanceRequests || appData.maintenanceRequests;
            appData.tasks = parsedData.tasks || appData.tasks;
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
})();
