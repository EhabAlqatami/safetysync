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
    maintenanceRequests: [
        { id: 'MNT-001', title: 'Broken Window', status: 'Pending', date: 'Mar 29, 2025', description: 'Window broken in classroom 101.' },
        { id: 'MNT-002', title: 'AC Not Working', status: 'In Progress', date: 'Mar 27, 2025', description: 'Air conditioning unit not functioning in office area.' }
    ],
    documents: [
        { id: 'DOC-001', title: 'Emergency Response Plan', type: 'PDF', date: 'Jan 15, 2025', uploadedBy: 'Administrator' },
        { id: 'DOC-002', title: 'Chemical Safety Guidelines', type: 'DOCX', date: 'Feb 10, 2025', uploadedBy: 'Administrator' }
    ],
    settings: {
        notificationsEnabled: true,
        autoLogout: 30,
        theme: 'light'
    }
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
    
    // Load data into UI
    loadDataIntoUI();
    
    // Show admin controls if user is admin
    updateUIForRole();
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
}

// Update UI based on user role
function updateUIForRole() {
    if (!currentUser) return;
    
    // Show admin controls if user is admin
    if (currentUser.role === 'admin') {
        const adminControls = document.querySelectorAll('.admin-only');
        adminControls.forEach(control => {
            control.style.display = 'inline-block';
        });
    }
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
        form.addEventListener('submit', function(e) {
            // Prevent default form submission
            e.preventDefault();
            
            // Handle different form types
            if (form.id === 'incidentForm') {
                handleIncidentSubmission(form);
            } else if (form.id === 'maintenanceForm') {
                handleMaintenanceSubmission(form);
            } else if (form.id === 'documentUploadForm') {
                handleDocumentUpload(form);
            } else if (form.id === 'settingsForm') {
                handleSettingsUpdate(form);
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
    
    // Refresh maintenance list if visible
    refreshMaintenanceList();
}

// Handle document upload
function handleDocumentUpload(form) {
    // Get form values
    const title = form.querySelector('[name="documentTitle"]') ? 
                 form.querySelector('[name="documentTitle"]').value : 'New Document';
    
    const fileInput = form.querySelector('[name="documentFile"]');
    let fileType = 'Unknown';
    
    if (fileInput && fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        fileType = fileName.split('.').pop().toUpperCase();
    }
    
    // Create new document
    const newDocument = {
        id: 'DOC-' + (appData.documents.length + 1).toString().padStart(3, '0'),
        title: title,
        type: fileType,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        uploadedBy: currentUser ? currentUser.name : 'Anonymous'
    };
    
    // Add to documents array
    appData.documents.push(newDocument);
    
    // Save to localStorage (in a real app, this would be sent to a server)
    localStorage.setItem('appData', JSON.stringify(appData));
    
    // Show success message
    alert('Document uploaded successfully! Document ID: ' + newDocument.id);
    
    // Reset form
    form.reset();
    
    // Refresh documents list if visible
    refreshDocumentsList();
}

// Handle settings update
function handleSettingsUpdate(form) {
    // Get form values
    const notificationsEnabled = form.querySelector('[name="notificationsEnabled"]') ? 
                               form.querySelector('[name="notificationsEnabled"]').checked : true;
    
    const autoLogout = form.querySelector('[name="autoLogout"]') ?
                      parseInt(form.querySelector('[name="autoLogout"]').value) : 30;
    
    const theme = form.querySelector('[name="theme"]') ?
                 form.querySelector('[name="theme"]').value : 'light';
    
    // Update settings
    appData.settings = {
        notificationsEnabled: notificationsEnabled,
        autoLogout: autoLogout,
        theme: theme
    };
    
    // Save to localStorage (in a real app, this would be sent to a server)
    localStorage.setItem('appData', JSON.stringify(appData));
    
    // Show success message
    alert('Settings updated successfully!');
    
    // Apply theme if changed
    applyTheme(theme);
}

// Apply theme
function applyTheme(theme) {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
}

// Load data into UI
function loadDataIntoUI() {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('appData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Merge saved data with default data
            appData.incidents = parsedData.incidents || appData.incidents;
            appData.maintenanceRequests = parsedData.maintenanceRequests || appData.maintenanceRequests;
            appData.documents = parsedData.documents || appData.documents;
            appData.settings = parsedData.settings || appData.settings;
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
    
    // Refresh all lists
    refreshIncidentsList();
    refreshMaintenanceList();
    refreshDocumentsList();
    
    // Load settings
    loadSettings();
}

// Refresh the incidents list in the UI
function refreshIncidentsList() {
    const incidentsTable = document.querySelector('#incidents table tbody');
    if (!incidentsTable) return;
    
    // Clear existing rows
    incidentsTable.innerHTML = '';
    
    // Add rows for each incident
    appData.incidents.forEach(incident => {
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
            <td>
                <button class="view-btn" data-action="view-details" data-id="${incident.id}">View</button>
                <button class="edit-btn admin-only" data-action="edit-item" data-id="${incident.id}" style="display: none;">Edit</button>
                <button class="delete-btn admin-only" data-action="delete-item" data-id="${incident.id}" style="display: none;">Delete</button>
            </td>
        `;
        
        incidentsTable.appendChild(row);
    });
    
    // Update dashboard summary if exists
    updateDashboardSummary();
}

// Refresh the maintenance requests list in the UI
function refreshMaintenanceList() {
    const maintenanceTable = document.querySelector('#maintenance table tbody');
    if (!maintenanceTable) return;
    
    // Clear existing rows
    maintenanceTable.innerHTML = '';
    
    // Add rows for each maintenance request
    appData.maintenanceRequests.forEach(request => {
        const row = document.createElement('tr');
        
        // Create status class
        let statusClass = 'pending';
        if (request.status === 'In Progress') statusClass = 'in-progress';
        if (request.status === 'Completed') statusClass = 'resolved';
        
        row.innerHTML = `
            <td>${request.id}</td>
            <td>${request.title}</td>
            <td><span class="status ${statusClass}">${request.status}</span></td>
            <td>${request.date}</td>
            <td>
                <button class="view-btn" data-action="view-details" data-id="${request.id}">View</button>
                <button class="edit-btn admin-only" data-action="edit-item" data-id="${request.id}" style="display: none;">Edit</button>
                <button class="delete-btn admin-only" data-action="delete-item" data-id="${request.id}" style="display: none;">Delete</button>
            </td>
        `;
        
        maintenanceTable.appendChild(row);
    });
    
    // Update dashboard summary if exists
    updateDashboardSummary();
}

// Refresh the documents list in the UI
function refreshDocumentsList() {
    const documentsTable = document.querySelector('#documents table tbody');
    if (!documentsTable) return;
    
    // Clear existing rows
    documentsTable.innerHTML = '';
    
    // Add rows for each document
    appData.documents.forEach(document => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${document.id}</td>
            <td>${document.title}</td>
            <td>${document.type}</td>
            <td>${document.date}</td>
            <td>
                <button class="view-btn" data-action="view-details" data-id="${document.id}">View</button>
                <button class="delete-btn admin-only" data-action="delete-item" data-id="${document.id}" style="display: none;">Delete</button>
            </td>
        `;
        
        documentsTable.appendChild(row);
    });
}

// Load settings into UI
function loadSettings() {
    const settingsForm = document.getElementById('settingsForm');
    if (!settingsForm) return;
    
    const notificationsCheckbox = settingsForm.querySelector('[name="notificationsEnabled"]');
    if (notificationsCheckbox) {
        notificationsCheckbox.checked = appData.settings.notificationsEnabled;
    }
    
    const autoLogoutSelect = settingsForm.querySelector('[name="autoLogout"]');
    if (autoLogoutSelect) {
        autoLogoutSelect.value = appData.settings.autoLogout;
    }
    
    const themeSelect = settingsForm.querySelector('[name="theme"]');
    if (themeSelect) {
        themeSelect.value = appData.settings.theme;
    }
    
    // Apply current theme
    applyTheme(appData.settings.theme);
}

// Update dashboard summary
function updateDashboardSummary() {
    // Update open incidents count
    const openIncidentsCount = document.getElementById('openIncidentsCount');
    if (openIncidentsCount) {
        openIncidentsCount.textContent = appData.incidents.length;
    }
    
    // Update maintenance requests count
    const maintenanceRequestsCount = document.getElementById('maintenanceRequestsCount');
    if (maintenanceRequestsCount) {
        maintenanceRequestsCount.textContent = appData.maintenanceRequests.length;
    }
    
    // Update recent incidents table
    const recentIncidentsTable = document.querySelector('#dashboard table tbody');
    if (recentIncidentsTable) {
        // Clear existing rows
        recentIncidentsTable.innerHTML = '';
        
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
            
            recentIncidentsTable.appendChild(row);
        });
    }
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
    } else if (id.startsWith('DOC-')) {
        item = appData.documents.find(doc => doc.id === id);
    }
    
    if (item) {
        // In a real app, this would open a modal or navigate to a details page
        let details = `
ID: ${item.id}
Title: ${item.title}
Status: ${item.status || 'N/A'}
Date: ${item.date}
${item.description ? 'Description: ' + item.description : ''}
${item.type ? 'Type: ' + item.type : ''}
${item.uploadedBy ? 'Uploaded By: ' + item.uploadedBy : ''}
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
    } else if (id.startsWith('DOC-')) {
        item = appData.documents.find(doc => doc.id === id);
        itemType = 'document';
    }
    
    if (item) {
        // In a real app, this would open a form for editing
        const newTitle = prompt('Edit title:', item.title);
        if (newTitle && newTitle.trim() !== '') {
            item.title = newTitle;
            
            // If it's an incident or maintenance request, also edit status
            if (id.startsWith('INC-') || id.startsWith('MNT-')) {
                const statusOptions = ['New', 'In Progress', 'Resolved', 'Critical', 'Pending', 'Completed'];
                const newStatus = prompt('Edit status (' + statusOptions.join(', ') + '):', item.status);
                if (newStatus && statusOptions.includes(newStatus)) {
                    item.status = newStatus;
                }
            }
            
            // Save changes
            localStorage.setItem('appData', JSON.stringify(appData));
            
            alert(`${itemType} updated successfully`);
            
            // Refresh UI
            refreshIncidentsList();
            refreshMaintenanceList();
            refreshDocumentsList();
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
    } else if (id.startsWith('DOC-')) {
        itemIndex = appData.documents.findIndex(doc => doc.id === id);
        itemArray = appData.documents;
        itemType = 'document';
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
            refreshMaintenanceList();
            refreshDocumentsList();
            updateDashboardSummary();
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
