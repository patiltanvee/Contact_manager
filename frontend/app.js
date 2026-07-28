const API_URL = "https://contact-hub-j1g5.onrender.com";

// ========================================================================= //
// INITIAL / DEFAULT DATA                                                    //
// ========================================================================= //

const DEFAULT_CONTACTS = [
    {
        id: "1",
        name: "Jane Cooper",
        email: "jane.cooper@acme.com",
        phone: "+1 234 567 8900",
        company: "Acme Corporation",
        profile_image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        lastConnected: "2 hours ago",
        role: "Director of Ops",
        category: "Operations"
    },
    {
        id: "2",
        name: "Robert Fox",
        email: "robert.fox@tech.com",
        phone: "+1 987 654 3210",
        company: "Tech Solutions",
        profile_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        lastConnected: "Yesterday",
        role: "Project Manager",
        category: "Management"
    },
    {
        id: "3",
        name: "Cody Fisher",
        email: "cody.fisher@creative.com",
        phone: "+1 456 789 0123",
        company: "Creative Studio",
        profile_image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        lastConnected: "3 days ago",
        role: "Creative Lead",
        category: "Design"
    },
    {
        id: "4",
        name: "Wade Warren",
        email: "wade.warren@enterprise.com",
        phone: "+1 321 654 0987",
        company: "Warren Enterprises",
        profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        lastConnected: "3 days ago",
        role: "CEO",
        category: "Management"
    },
    {
        id: "5",
        name: "Savannah Green",
        email: "savannah.green@greenlabs.com",
        phone: "+1 654 321 0987",
        company: "Green Labs",
        profile_image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        lastConnected: "1 week ago",
        role: "Developer",
        category: "Engineering"
    },
    {
        id: "6",
        name: "Dianne Russell",
        email: "dianne.russell@business.com",
        phone: "+1 789 123 4567",
        company: "Business Co.",
        profile_image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
        lastConnected: "1 month ago",
        role: "HR Partner",
        category: "Operations"
    }
];

// ========================================================================= //
// STATE MANAGEMENT & DATA PERSISTENCE                                       //
// ========================================================================= //

let state = {
    contacts: [],
    currentView: 'contacts', // 'landing', 'contacts', 'add-contact', 'edit-contact', 'about'
    darkMode: false,
    selectedCategory: 'all'
};

// Image Upload temporary state variables
let addPhotoBase64 = "";
let editPhotoBase64 = "";


// Load contacts from LocalStorage or initialize with defaults
async function initData() {

    try {

        const response = await fetch("http://127.0.0.1:5000/contacts");
        const data = await response.json();

        if (data.success) {

            state.contacts = data.contacts;

        } else {

            state.contacts = [];

        }

        const savedTheme = localStorage.getItem('contacthub_dark_mode');
        state.darkMode = savedTheme !== 'false';

        renderContactsList();

    } catch (error) {

        console.error(error);

        alert("Unable to connect to Flask backend.");

    }

}

// ========================================================================= //
// ROUTING / VIEW CONTROLLER                                                 //
// ========================================================================= //

function showView(viewName) {

    const landingView = document.getElementById('landing-view');
    const dashboardView = document.getElementById('dashboard-view');

    if (!landingView || !dashboardView) return;

    const isLandingActive = landingView.classList.contains('active');
    state.currentView = viewName;

    // Scroll to top
    if (!isLandingActive || (viewName !== 'landing' && viewName !== 'contacts')) {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }

    // Dashboard screens
    const screens = {
        contacts: document.getElementById('screen-contacts'),
        'add-contact': document.getElementById('screen-add-contact'),
        'edit-contact': document.getElementById('screen-edit-contact'),
        about: document.getElementById('screen-about')
    };

    if (viewName === 'landing' || viewName === 'contacts') {

        landingView.classList.add('active');
        dashboardView.classList.add('active');

        Object.keys(screens).forEach(key => {
            if (!screens[key]) return;

            if (key === 'contacts')
                screens[key].classList.add('active');
            else
                screens[key].classList.remove('active');
        });

    } else {

        landingView.classList.remove('active');
        dashboardView.classList.add('active');

        Object.keys(screens).forEach(key => {
            if (!screens[key]) return;

            if (key === viewName)
                screens[key].classList.add('active');
            else
                screens[key].classList.remove('active');
        });

    }

    // Sidebar buttons (safe)
    const sideContactsBtn = document.getElementById('side-contacts-btn');
    const sideAddBtn = document.getElementById('side-add-btn');
    const sideAboutBtn = document.getElementById('side-about-btn');

    if (sideContactsBtn) sideContactsBtn.classList.remove('active');
    if (sideAddBtn) sideAddBtn.classList.remove('active');
    if (sideAboutBtn) sideAboutBtn.classList.remove('active');

    if (viewName === 'contacts' && sideContactsBtn)
        sideContactsBtn.classList.add('active');

    if (viewName === 'add-contact' && sideAddBtn)
        sideAddBtn.classList.add('active');

    if (viewName === 'about' && sideAboutBtn)
        sideAboutBtn.classList.add('active');

    // Scroll dashboard panel to top
    const mainPanel = document.querySelector('.main-panel');

    if (mainPanel) {
        mainPanel.scrollTop = 0;
    }
}

// ========================================================================= //
// UTILITY HELPERS                                                           //
// ========================================================================= //

// Get initials from a full name (e.g. "Jane Doe" -> "JD")
function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Assign a deterministic pastel badge class based on name letters
function getAvatarColorClass(name) {
    const classes = ['initials-blue', 'initials-green', 'initials-pink', 'initials-orange', 'initials-purple'];
    if (!name) return classes[0];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i);
    }
    return classes[sum % classes.length];
}

// Validate email string structure
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validate phone number string (Allow digits, +, space, dashes, brackets; digits length 7-15)
function isValidPhone(phone) {
    const cleanDigits = phone.replace(/[\s\-\(\)\+]/g, '');
    const isDigitsOnly = /^\d+$/.test(cleanDigits);
    return isDigitsOnly && cleanDigits.length >= 7 && cleanDigits.length <= 15;
}

// Check for duplicate email across other contacts
function isDuplicateEmail(email, currentId = null) {
    const lowerEmail = email.trim().toLowerCase();
    return state.contacts.some(contact => {
        if (currentId && contact.id === currentId) {
            return false; // Skip the contact itself when editing
        }
        return contact.email.toLowerCase() === lowerEmail;
    });
}

// ========================================================================= //
// CONTACTS RENDERING ENGINE                                                 //
// ========================================================================= //

function renderContactsList() {
    const container = document.getElementById('contacts-grid-container');
    const emptyState = document.getElementById('empty-state-container');

    // 1. Filter contacts
    let contactsToRender = [...state.contacts];

    // Category filter
    if (state.selectedCategory && state.selectedCategory !== 'all') {
        contactsToRender = contactsToRender.filter(c => c.category === state.selectedCategory);
    }

    // Search query filter
    const searchInput = document.getElementById('contact-search-input');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    if (query) {
        contactsToRender = contactsToRender.filter(c => 
            c.name.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query) ||
            c.phone.toLowerCase().includes(query) ||
            (c.company && c.company.toLowerCase().includes(query)) ||
            (c.role && c.role.toLowerCase().includes(query))
        );
    }

    // Sort
    const sortSelect = document.getElementById('directory-sort-select');
    const sortVal = sortSelect ? sortSelect.value : "name-asc";
    if (sortVal === "name-asc") {
        contactsToRender.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortVal === "name-desc") {
        contactsToRender.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortVal === "company-asc") {
        contactsToRender.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
    }


    // Clear previous rendering
    container.innerHTML = "";

    if (contactsToRender.length === 0) {
        container.style.display = "none";
        emptyState.style.display = "flex";
        return;
    }

    container.style.display = "grid";
    emptyState.style.display = "none";

    // 3. Render contacts grid cards
    contactsToRender.forEach(contact => {
        const card = document.createElement('div');
        card.className = "contact-card";
        card.dataset.id = contact.id;

        // Create Avatar HTML
        let avatarHtml = "";
        if (contact.profile_image_url && contact.profile_image_url.trim() !== "") {
            avatarHtml = `<img src="${escapeHtml(contact.profile_image_url)}" class="contact-avatar" alt="${escapeHtml(contact.name)}" onerror="this.outerHTML='<div class=\\'contact-initials ${getAvatarColorClass(contact.name)}\\'>${getInitials(contact.name)}</div>'">`;
        } else {
            avatarHtml = `<div class="contact-initials ${getAvatarColorClass(contact.name)}">${getInitials(contact.name)}</div>`;
        }

        // Create Company & Role subtitle HTML
        const subtitle = (contact.role && contact.role.trim() !== "")
            ? `${contact.company || 'Professional'} • ${contact.role}`
            : (contact.company || 'Professional');

        card.innerHTML = `
            <div class="contact-card-badge-container">
                <span class="contact-category-badge">${escapeHtml(contact.category || 'General')}</span>
            </div>
            <div class="contact-card-header">
                ${avatarHtml}
                <div class="contact-main-info">
                    <h3 class="contact-name" title="${escapeHtml(contact.name)}">${escapeHtml(contact.name)}</h3>
                    <div class="contact-company" title="${escapeHtml(subtitle)}">${escapeHtml(subtitle)}</div>
                </div>
            </div>
            
            <div class="contact-details">
                <div class="detail-item">
                    <span class="detail-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </span>
                    <span>${escapeHtml(contact.email)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </span>
                    <span>${escapeHtml(contact.phone)}</span>
                </div>
            </div>

            <div class="contact-card-overlay">
                <button class="overlay-action-btn message-btn" title="Message" onclick="handleMessageClick('${contact.id}', event)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span>MESSAGE</span>
                </button>
                <button class="overlay-action-btn edit-btn" title="Edit" onclick="handleEditClick('${contact.id}', event)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    <span>EDIT</span>
                </button>
                <button class="overlay-action-btn delete-btn" title="Remove" onclick="handleDeleteClick('${contact.id}', event)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    <span>REMOVE</span>
                </button>
            </div>
        `;

        container.appendChild(card);
    });

    // 4. Render "+ INITIALIZE NEW ENTITY" card at the end of grid (inspo from second image)
    const addCard = document.createElement('div');
    addCard.className = "contact-card add-entity-card";
    addCard.innerHTML = `
        <div class="add-entity-content">
            <div class="add-entity-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <span class="add-entity-label">INITIALIZE NEW ENTITY</span>
        </div>
    `;
    addCard.addEventListener('click', () => {
        document.getElementById('add-contact-form').reset();
        clearFormErrors('add-contact-form');
        showView('add-contact');
    });
    container.appendChild(addCard);

    // Render the recently connected stack
    renderRecentStack();
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

let stackOffset = 0;

function renderRecentStack() {
    const recentContacts = state.contacts.slice(0, 3);
    
    // Render to landing page mockup stack
    renderStackContainer('landing-recent-card-stack', recentContacts);
}

function renderStackContainer(containerId, recentContacts) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const section = container.closest('.recently-connected-section');
    
    if (recentContacts.length === 0) {
        if (section) section.style.display = 'none';
        return;
    } else {
        if (section) section.style.display = 'flex';
    }

    container.innerHTML = '';
    const maxCards = Math.min(recentContacts.length, 3);
    
    for (let i = 0; i < maxCards; i++) {
        const contactIndex = (stackOffset + i) % recentContacts.length;
        const contact = recentContacts[contactIndex];
        if (!contact) continue;

        const card = document.createElement('div');
        card.className = `stack-card pos-${i}`;
        card.dataset.index = i;
        card.dataset.contactId = contact.id;

        let avatarHTML = '';
        if (contact.profile_image_url && contact.profile_image_url.trim() !== '') {
            avatarHTML = `<img src="${contact.profile_image_url}" alt="${contact.name}">`;
        } else {
            const initials = getInitials(contact.name);
            const colorClass = getAvatarColorClass(contact.name);
            avatarHTML = `<div class="stack-avatar-initials" style="background-color: var(--avatar-${colorClass}); color: var(--avatar-${colorClass}-text);">${initials}</div>`;
        }

        card.innerHTML = `
            <div class="stack-card-badge-container">
                <span class="active-badge">ACTIVE</span>
            </div>
            <div class="stack-card-top-centered">
                <div class="stack-avatar-large">
                    ${avatarHTML}
                </div>
                <h3 class="stack-card-name-large">${escapeHtml(contact.name)}</h3>
                <span class="stack-card-role-large">${escapeHtml(contact.company || 'Professional')} • ${escapeHtml(contact.role || 'Collaborator')}</span>
            </div>
            <div class="stack-card-divider"></div>
            <div class="stack-card-details-centered">
                <div class="stack-detail-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span>${escapeHtml(contact.email)}</span>
                </div>
                <div class="stack-detail-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 9.92z"/></svg>
                    <span>${escapeHtml(contact.phone)}</span>
                </div>
            </div>
            <div class="stack-card-footer-centered">
                <span class="stack-last-contact-badge">
                    ${escapeHtml(contact.lastConnected || "Available")}
                </span>
            </div
        `;

        if (i === 0) {
            card.addEventListener('click', () => {
                cycleStack(recentContacts, containerId);
            });
        }

        container.appendChild(card);
    }
}

function cycleStack(recentContacts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cards = container.querySelectorAll('.stack-card');
    if (cards.length <= 1) return;

    const frontCard = container.querySelector('.stack-card.pos-0');
    if (!frontCard) return;

    frontCard.classList.add('swipe-exit');

    setTimeout(() => {
        stackOffset = (stackOffset + 1) % recentContacts.length;
        renderRecentStack();
    }, 300);
}

// ========================================================================= //
// FORM VALIDATIONS & ACTIONS                                                //
// ========================================================================= //

// Clean up form validation UI states
function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('invalid'));

    const errorMsgs = form.querySelectorAll('.error-msg');
    errorMsgs.forEach(msg => msg.textContent = "");
}

// Set error message on a field
function setFieldError(fieldId, errorMsgId, message) {
    const input = document.getElementById(fieldId);
    const errorContainer = document.getElementById(errorMsgId);
    
    input.closest('.form-group').classList.add('invalid');
    errorContainer.textContent = message;
}

// Add Contact form submission handler
async function handleAddFormSubmit(e) {

    e.preventDefault();

    clearFormErrors('add-contact-form');

    const nameInput = document.getElementById('add-name');
    const emailInput = document.getElementById('add-email');
    const phoneInput = document.getElementById('add-phone');
    const companyInput = document.getElementById('add-company');
    const roleInput = document.getElementById('add-role');
    const categorySelect = document.getElementById('add-category');
    const photoInput = document.getElementById('add-photo');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const company = companyInput.value.trim();
    const role = roleInput.value.trim();
    const category = categorySelect.value;
    const profile_image_url = addPhotoBase64 || photoInput.value.trim();

    let isValid = true;

    // Name validation
    if (!name) {
        setFieldError('add-name', 'add-name-error', 'Name is required.');
        isValid = false;
    }

    // Email validation
    if (!email) {
        setFieldError('add-email', 'add-email-error', 'Email is required.');
        isValid = false;
    } else if (!isValidEmail(email)) {
        setFieldError('add-email', 'add-email-error', 'Invalid email format.');
        isValid = false;
    }

    // Phone validation
    if (!phone) {
        setFieldError('add-phone', 'add-phone-error', 'Phone number is required.');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        setFieldError('add-phone', 'add-phone-error', 'Invalid phone number.');
        isValid = false;
    }
    if (!isValid) return;
    const newContact = {
        name,
        email,
        phone,
        company,
        role,
        category,
        profile_image_url
    };
    try {
        const response = await fetch("http://127.0.0.1:5000/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newContact)
        });
        const result = await response.json();
        if (!result.success) {
            alert(result.message);
            return;
        }

        document.getElementById("add-contact-form").reset();
        addPhotoBase64 = "";
        await initData();
        showView("contacts");
    }
    catch (error) {
        console.error(error);
        alert("Unable to connect to backend.");
    }
}

// Edit Contact form submission handler
async function handleEditFormSubmit(e) {

    e.preventDefault();

    clearFormErrors('edit-contact-form');

    const id = document.getElementById('edit-contact-id').value;

    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const phoneInput = document.getElementById('edit-phone');
    const companyInput = document.getElementById('edit-company');
    const roleInput = document.getElementById('edit-role');
    const categorySelect = document.getElementById('edit-category');
    const photoInput = document.getElementById('edit-photo');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const company = companyInput.value.trim();
    const role = roleInput.value.trim();
    const category = categorySelect.value;
    const profile_image_url = editPhotoBase64 || photoInput.value.trim();

    let isValid = true;

    if (!name) {
        setFieldError('edit-name', 'edit-name-error', 'Name is required.');
        isValid = false;
    }

    if (!email) {
        setFieldError('edit-email', 'edit-email-error', 'Email is required.');
        isValid = false;
    } else if (!isValidEmail(email)) {
        setFieldError('edit-email', 'edit-email-error', 'Invalid email format.');
        isValid = false;
    }

    if (!phone) {
        setFieldError('edit-phone', 'edit-phone-error', 'Phone number is required.');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        setFieldError('edit-phone', 'edit-phone-error', 'Invalid phone number.');
        isValid = false;
    }

    if (!isValid) return;

    try {
        const response = await fetch(`http://127.0.0.1:5000/contacts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                phone,
                company,
                role,
                category,
                profile_image_url
            })
        });
        const result = await response.json();
        if (!result.success) {
            alert(result.message);
            return;
        }
        editPhotoBase64 = "";
        await initData();
        showView("contacts");
    }
    catch (error) {
        console.error(error);
        alert("Unable to connect to backend.");
    }
}

// ========================================================================= //
// EVENT HANDLERS & MODAL DIALOGS                                            //
// ========================================================================= //

// Global functions for card click handlers (invoked via inline HTML calls)
window.handleEditClick = function(id, event) {
    if (event) event.stopPropagation();
    const contact = state.contacts.find(c => c.id === id);
    if (!contact) return;

    // Load inputs
    document.getElementById('edit-contact-id').value = contact.id;
    document.getElementById('edit-name').value = contact.name;
    document.getElementById('edit-email').value = contact.email;
    document.getElementById('edit-phone').value = contact.phone;
    document.getElementById('edit-company').value = contact.company || "";
    document.getElementById('edit-role').value = contact.role || "";
    document.getElementById('edit-category').value = contact.category || "General";
    
    // Clear and set image preview
    const preview = document.getElementById('edit-preview-container');
    const clearBtn = document.getElementById('edit-clear-photo');
    const photoInput = document.getElementById('edit-photo');
    document.getElementById('edit-photo-file').value = "";
    
    if (contact.profile_image_url && contact.profile_image_url.trim() !== "") {
        if (contact.profile_image_url.startsWith('data:')) {
            editPhotoBase64 = contact.profile_image_url;
            photoInput.value = "";
        } else {
            editPhotoBase64 = "";
            photoInput.value = contact.profile_image_url;
        }
        preview.innerHTML = `<img src="${contact.profile_image_url}" style="width: 100%; height: 100%; object-fit: cover;">`;
        clearBtn.style.display = "block";
    } else {
        editPhotoBase64 = "";
        photoInput.value = "";
        preview.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span class="upload-label">Upload Image</span>
        `;
        clearBtn.style.display = "none";
    }

    // Clear warnings & render
    clearFormErrors('edit-contact-form');
    showView('edit-contact');
};

window.handleDeleteClick = function(id, event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('delete-modal');
    document.getElementById('delete-contact-id').value = id;
    
    // Activate overlay modal
    modal.classList.add('active');
};

window.handleMessageClick = function(id, event) {
    if (event) event.stopPropagation();
    const contact = state.contacts.find(c => c.id === id);
    if (contact) {
        window.location.href = `mailto:${contact.email}`;
    }
};

// Search Filtering Logic
function handleSearch(e) {
    renderContactsList();
}

// Theme toggler
function handleThemeToggle() {
    state.darkMode = !state.darkMode;
    const isDark = state.darkMode;
    
    const appEl = document.getElementById('app');
    if (isDark) {
        appEl.classList.remove('light-mode');
        appEl.classList.add('dark-mode');
    } else {
        appEl.classList.remove('dark-mode');
        appEl.classList.add('light-mode');
    }
    
    localStorage.setItem('contacthub_dark_mode', isDark);
}

// ========================================================================= //
// APPLICATION BOOTSTRAPPER                                                  //
// ========================================================================= //

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize data & states
    initData();

    // 2. Set up initial theme class on App
    const appEl = document.getElementById('app');
    if (state.darkMode) {
        appEl.classList.remove('light-mode');
        appEl.classList.add('dark-mode');
    } else {
        appEl.classList.remove('dark-mode');
        appEl.classList.add('light-mode');
    }

    // 3. Render contacts list
    

    // Category filter tabs binding
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            state.selectedCategory = e.target.dataset.category;
            renderContactsList();
        });
    });

    // Sort select binding
    const sortSelect = document.getElementById('directory-sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => renderContactsList());
    }

    // 4. Attach Navigation / View triggers
    // Get Started Hero Button
    document.getElementById('get-started-btn').addEventListener('click', () => {
        showView('contacts');
        document.getElementById('screen-contacts').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('how-it-works-btn').addEventListener('click', () => {
        document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Top nav Logo trigger
    document.getElementById('logo-home-trigger').addEventListener('click', () => {
        showView('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Top nav Contacts trigger
    document.getElementById('nav-contacts-trigger').addEventListener('click', (e) => {
        e.preventDefault();
        showView('contacts');
        document.getElementById('screen-contacts').scrollIntoView({ behavior: 'smooth' });
    });

    // Top nav Add Contact trigger
    document.getElementById('nav-add-trigger').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('add-contact-form').reset();
        clearFormErrors('add-contact-form');
        showView('add-contact');
    });

    // Landing nav About trigger
    document.getElementById('nav-about-trigger').addEventListener('click', (e) => {
        e.preventDefault();
        showView('about');
    });

    // Dashboard '+ Add New Contact' button
    document.getElementById('dashboard-add-contact-btn').addEventListener('click', () => {
        document.getElementById('add-contact-form').reset();
        clearFormErrors('add-contact-form');
        showView('add-contact');
    });

    // Back to Dashboard / Cancel buttons
    document.querySelectorAll('.btn-back-dashboard, .btn-cancel-dashboard').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear photo states
            document.getElementById('add-clear-photo').click();
            document.getElementById('edit-clear-photo').click();
            showView('contacts');
            document.getElementById('screen-contacts').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 5. Attach input & form listeners
    // Search input box
    document.getElementById('contact-search-input').addEventListener('input', handleSearch);

    // Form Submissions
    document.getElementById('add-contact-form').addEventListener('submit', handleAddFormSubmit);
    document.getElementById('edit-contact-form').addEventListener('submit', handleEditFormSubmit);

    // Photo Upload Listeners
    // Add Contact Photo
    const addPhotoBox = document.getElementById('add-photo-box');
    const addPhotoFile = document.getElementById('add-photo-file');
    const addPreview = document.getElementById('add-preview-container');
    const addClear = document.getElementById('add-clear-photo');
    const addUrlInput = document.getElementById('add-photo');

    addPhotoBox.addEventListener('click', () => addPhotoFile.click());
    addPhotoFile.addEventListener('click', (e) => e.stopPropagation()); // prevent double click
    addPhotoFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                addPhotoBase64 = evt.target.result;
                addPreview.innerHTML = `<img src="${addPhotoBase64}" style="width: 100%; height: 100%; object-fit: cover;">`;
                addClear.style.display = 'block';
                addUrlInput.value = ""; // clear URL input if file is chosen
            };
            reader.readAsDataURL(file);
        }
    });
    addClear.addEventListener('click', (e) => {
        e.stopPropagation();
        addPhotoBase64 = "";
        addPhotoFile.value = "";
        addUrlInput.value = "";
        addPreview.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span class="upload-label">Upload Photo</span>
        `;
        addClear.style.display = 'none';
    });
    addUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url) {
            addPhotoBase64 = "";
            addPhotoFile.value = "";
            addPreview.innerHTML = `<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.outerHTML='<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\' ry=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><polyline points=\\'21 15 16 10 5 21\\'/></svg>'">`;
            addClear.style.display = 'block';
        } else {
            addClear.click();
        }
    });

    // Edit Contact Photo
    const editPhotoBox = document.getElementById('edit-photo-box');
    const editPhotoFile = document.getElementById('edit-photo-file');
    const editPreview = document.getElementById('edit-preview-container');
    const editClear = document.getElementById('edit-clear-photo');
    const editUrlInput = document.getElementById('edit-photo');

    editPhotoBox.addEventListener('click', () => editPhotoFile.click());
    editPhotoFile.addEventListener('click', (e) => e.stopPropagation()); // prevent double click
    editPhotoFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                editPhotoBase64 = evt.target.result;
                editPreview.innerHTML = `<img src="${editPhotoBase64}" style="width: 100%; height: 100%; object-fit: cover;">`;
                editClear.style.display = 'block';
                editUrlInput.value = ""; // clear URL input if file is chosen
            };
            reader.readAsDataURL(file);
        }
    });
    editClear.addEventListener('click', (e) => {
        e.stopPropagation();
        editPhotoBase64 = "";
        editPhotoFile.value = "";
        editUrlInput.value = "";
        editPreview.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span class="upload-label">Upload Photo</span>
        `;
        editClear.style.display = 'none';
    });
    editUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url) {
            editPhotoBase64 = "";
            editPhotoFile.value = "";
            editPreview.innerHTML = `<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.outerHTML='<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\' ry=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><polyline points=\\'21 15 16 10 5 21\\'/></svg>'">`;
            editClear.style.display = 'block';
        } else {
            editClear.click();
        }
    });

    // Dark Mode Toggle Button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', handleThemeToggle);
    }

    // 6. Set up delete confirmation modal listeners
    const modal = document.getElementById('delete-modal');
    const closeIcon = document.getElementById('modal-close-icon');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    const closeModal = () => {
        modal.classList.remove('active');
        document.getElementById('delete-contact-id').value = "";
    };

    closeIcon.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Clicking backdrop closes modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    confirmBtn.addEventListener("click", async () => {

    const idToDelete = document.getElementById("delete-contact-id").value;

    if (!idToDelete) return;

    try {
        const response = await fetch(
            `http://127.0.0.1:5000/contacts/${idToDelete}`,
            {
                method: "DELETE"
            }
        );
        const result = await response.json();
        if (!result.success) {
            alert(result.message);
            return;
        }
        await initData();
        closeModal();
    } catch (error) {
        console.error(error);
        alert("Unable to connect to backend.");
    }
});

    // Initialize the starting view
    showView(state.currentView);
});
