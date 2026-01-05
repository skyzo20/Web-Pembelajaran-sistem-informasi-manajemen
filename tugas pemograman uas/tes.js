// script.js - Interactive Learning Platform Sistem Informasi Manajemen
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 SIM Learning Platform Loaded Successfully!');
    
    // Initialize Accordion System
    initAccordion();
    
    // Add Progress Tracking
    initProgressTracker();
    
    // Add Search Functionality
    initSearch();
    
    // Add Keyboard Navigation
    initKeyboardNavigation();
    
    // Add Local Storage for Progress
    initLocalStorage();
    
    // Add Print Functionality
    initPrintFunction();
});

// 1. Enhanced Accordion System
function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', function(e) {
            e.preventDefault();
            toggleAccordionItem(this);
        });
        
        // Keyboard support
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccordionItem(this);
            }
        });
    });
}

function toggleAccordionItem(header) {
    const content = header.nextElementSibling;
    const isActive = content.classList.contains('active');
    const currentIcon = header.querySelector('.accordion-icon');
    
    // Close all accordions first
    document.querySelectorAll('.accordion-content').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.accordion-header').forEach(h => {
        h.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        content.classList.add('active');
        header.classList.add('active');
        
        // Scroll to active content
        content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Update progress
        updateProgress(header);
        
        // Add slide-in animation
        setTimeout(() => {
            content.style.opacity = '1';
        }, 100);
    }
    
    // Play sound effect (optional)
    playToggleSound();
}

// 2. Progress Tracking System
function initProgressTracker() {
    const progressContainer = document.createElement('div');
    progressContainer.id = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
        </div>
        <span id="progress-text">Progres: 0/14 Pertemuan (0%)</span>
    `;
    document.querySelector('.content').insertBefore(progressContainer, document.querySelector('.accordion'));
    
    loadProgress();
}

function updateProgress(header) {
    const meetingNumber = header.textContent.match(/Pertemuan (\d+)/)?.[1];
    if (meetingNumber) {
        const meetings = JSON.parse(localStorage.getItem('sim-progress') || '[]');
        const index = meetings.indexOf(meetingNumber);
        
        if (index === -1) {
            meetings.push(meetingNumber);
            localStorage.setItem('sim-progress', JSON.stringify(meetings));
            updateProgressDisplay(meetings.length);
        }
    }
}

function updateProgressDisplay(count) {
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    
    const percentage = Math.round((count / 14) * 100);
    fill.style.width = percentage + '%';
    text.textContent = `Progres: ${count}/14 Pertemuan (${percentage}%)`;
}

function loadProgress() {
    const meetings = JSON.parse(localStorage.getItem('sim-progress') || '[]');
    updateProgressDisplay(meetings.length);
}

// 3. Search Functionality
function initSearch() {
    const searchHTML = `
        <div class="search-container">
            <input type="text" id="search-input" placeholder="🔍 Cari materi... (contoh: ERP, Database, DSS)">
            <button id="clear-search">✕</button>
        </div>
    `;
    document.querySelector('.content h2').insertAdjacentHTML('afterend', searchHTML);
    
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        filterAccordion(query);
    });
    
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        filterAccordion('');
    });
}

function filterAccordion(query) {
    const items = document.querySelectorAll('.accordion-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const header = item.querySelector('.accordion-header');
        
        if (query && text.includes(query)) {
            item.style.display = 'block';
            item.style.background = 'rgba(102, 126, 234, 0.1)';
            header.scrollIntoView({ behavior: 'smooth' });
        } else if (!query) {
            item.style.display = 'block';
            item.style.background = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// 4. Keyboard Navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('.accordion-header')) return;
        
        const activeHeader = document.querySelector('.accordion-header.active');
        const headers = Array.from(document.querySelectorAll('.accordion-header'));
        const currentIndex = headers.indexOf(activeHeader);
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
            if (headers[nextIndex]) {
                headers[nextIndex].focus();
                toggleAccordionItem(headers[nextIndex]);
            }
        }
    });
}

// 5. Local Storage Management
function initLocalStorage() {
    // Auto-save opened sections
    document.addEventListener('click', function(e) {
        if (e.target.closest('.accordion-header')) {
            const header = e.target.closest('.accordion-header');
            const meetingNumber = header.textContent.match(/Pertemuan (\d+)/)?.[1];
            if (meetingNumber) {
                const opened = JSON.parse(localStorage.getItem('sim-opened') || '[]');
                const index = opened.indexOf(meetingNumber);
                if (index === -1) opened.push(meetingNumber);
                localStorage.setItem('sim-opened', JSON.stringify(opened.slice(-5))); // Last 5
            }
        }
    });
}

// 6. Print Functionality
function initPrintFunction() {
    const printBtn = document.createElement('button');
    printBtn.id = 'print-btn';
    printBtn.innerHTML = '🖨️ Cetak Materi';
    printBtn.className = 'action-btn';
    document.querySelector('.content').appendChild(printBtn);
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
}

// 7. Utility Functions
function playToggleSound() {
    // Create subtle click sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Auto-open last viewed section on load
window.addEventListener('load', function() {
    const opened = JSON.parse(localStorage.getItem('sim-opened') || '[]');
    if (opened.length > 0) {
        const lastOpened = opened[opened.length - 1];
        const targetHeader = Array.from(document.querySelectorAll('.accordion-header'))
            .find(h => h.textContent.includes(`Pertemuan ${lastOpened}`));
        if (targetHeader) {
            setTimeout(() => toggleAccordionItem(targetHeader), 500);
        }
    }
});

// PWA Ready - Add to home screen prompt (optional)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
});

// Export functions for debugging
window.SIMLearning = {
    toggleAccordionItem,
    updateProgress,
    filterAccordion
};
