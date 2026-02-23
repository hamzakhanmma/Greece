// ============================================
// COUNTDOWN TIMER FUNCTIONALITY
// ============================================
document.addEventListener("DOMContentLoaded", function () {

    const departureDate = new Date("June 1, 2026 00:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = departureDate - now;

        if (difference <= 0) {
            document.querySelector(".countdown-container").innerHTML =
                "<h2>We are in Greece! 🇬🇷</h2>";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days;
        document.getElementById("hours").textContent = hours;
        document.getElementById("minutes").textContent = minutes;
        document.getElementById("seconds").textContent = seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});

// ============================================
// DIARY FUNCTIONALITY
// ============================================
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File too large! Please select an image under 5MB.');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        localStorage.setItem('currentDiaryPhoto', e.target.result);
        
        const preview = document.getElementById('photo-preview');
        const container = document.getElementById('photo-preview-container');
        
        if (preview) {
            preview.src = e.target.result;
            container.style.display = 'block';
        }
    };
    
    reader.readAsDataURL(file);
}

function removePhoto() {
    const input = document.getElementById('photo-upload');
    const container = document.getElementById('photo-preview-container');
    
    if (input) input.value = '';
    if (container) container.style.display = 'none';
    localStorage.removeItem('currentDiaryPhoto');
}

function saveDiaryEntry(event) {
    if (event) event.preventDefault();
    
    const entryDate = document.getElementById('entryDate');
    const entryTitle = document.getElementById('entryTitle');
    const entryContent = document.getElementById('entryContent');
    
    if (!entryDate || !entryTitle || !entryContent) {
        console.error('Diary form elements not found');
        return;
    }
    
    const entryData = {
        id: Date.now(),
        date: entryDate.value,
        title: entryTitle.value,
        content: entryContent.value,
        photo: localStorage.getItem('currentDiaryPhoto'),
        timestamp: new Date().toISOString()
    };
    
    // Validate required fields
    if (!entryData.date || !entryData.title || !entryData.content) {
        alert('Please fill in all required fields: Date, Title, and Reflection.');
        return;
    }
    
    const existingEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    existingEntries.unshift(entryData); // Add to beginning
    localStorage.setItem('diaryEntries', JSON.stringify(existingEntries));
    
    // Clear form
    document.getElementById('diaryForm').reset();
    removePhoto();
    
    // Refresh entries display
    displayDiaryEntries();
    
    alert('Diary entry saved successfully!');
}

function displayDiaryEntries() {
    const entriesContainer = document.getElementById('diary-entries-container');
    if (!entriesContainer) return;
    
    const existingEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    
    if (existingEntries.length === 0) {
        entriesContainer.innerHTML = `
            <div class="card">
                <p><em>No diary entries saved yet. Create your first entry above!</em></p>
            </div>
        `;
        return;
    }
    
    let entriesHTML = '';
    existingEntries.forEach(entry => {
        const dateObj = new Date(entry.date);
        const formattedDate = dateObj.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        entriesHTML += `
            <div class="diary-entry card">
                <div class="entry-header">
                    <h3>${entry.title}</h3>
                    <span class="entry-date">${formattedDate}</span>
                </div>
                <div class="entry-content">
                    <p>${entry.content.replace(/\n/g, '<br>')}</p>
                </div>
                ${entry.photo ? `
                <div class="entry-photo">
                    <img src="${entry.photo}" alt="Diary photo" style="max-width: 300px; border-radius: 5px;">
                </div>
                ` : ''}
                <div class="entry-footer">
                    <small>Added: ${new Date(entry.timestamp).toLocaleString()}</small>
                    <button onclick="deleteDiaryEntry(${entry.id})" class="btn-secondary btn-small">Delete</button>
                </div>
            </div>
        `;
    });
    
    entriesContainer.innerHTML = entriesHTML;
}

function deleteDiaryEntry(entryId) {
    if (!confirm('Are you sure you want to delete this diary entry?')) return;
    
    const existingEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    const filteredEntries = existingEntries.filter(entry => entry.id !== entryId);
    localStorage.setItem('diaryEntries', JSON.stringify(filteredEntries));
    
    displayDiaryEntries();
    alert('Entry deleted successfully!');
}

// ============================================
// REGISTRATION FUNCTIONALITY
// ============================================
function handleRegistrationSubmit(event) {
    if (event) event.preventDefault();
    
    const registrationData = {
        id: Date.now(),
        name: document.getElementById('student-name').value,
        studentId: document.getElementById('student-id').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        emergencyContact: document.getElementById('emergency-contact').value,
        dietary: document.getElementById('dietary').value,
        confirmedRules: document.getElementById('confirm-rules').checked,
        confirmedThreeStrike: document.getElementById('confirm-three-strike').checked,
        confirmedHealth: document.getElementById('confirm-health').checked,
        timestamp: new Date().toISOString()
    };
    
    // Validate required fields
    if (!registrationData.name || !registrationData.studentId || !registrationData.email) {
        alert('Please fill in all required fields: Name, Student ID, and Email.');
        return;
    }
    
    if (!registrationData.confirmedRules || !registrationData.confirmedThreeStrike || !registrationData.confirmedHealth) {
        alert('Please check all confirmation boxes.');
        return;
    }
    
    localStorage.setItem('studentRegistration', JSON.stringify(registrationData));
    
    // Also save to array for multiple registrations (for admin view)
    const existingRegs = JSON.parse(localStorage.getItem('allRegistrations') || '[]');
    existingRegs.push(registrationData);
    localStorage.setItem('allRegistrations', JSON.stringify(existingRegs));
    
    alert(`Registration successful!\n\nThank you ${registrationData.name} (ID: ${registrationData.studentId}).\nYour registration has been recorded.`);
    
    // Clear form
    document.getElementById('registration-form').reset();
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Set diary date picker to today by default
    const entryDate = document.getElementById('entryDate');
    if (entryDate) {
        const today = new Date().toISOString().split('T')[0];
        entryDate.value = today;
        entryDate.max = today; // Can't select future dates for diary
    }
    
    // Diary form event listener
    const diaryForm = document.getElementById('diaryForm');
    if (diaryForm) {
        diaryForm.addEventListener('submit', saveDiaryEntry);
    }
    
    // Display existing diary entries
    displayDiaryEntries();
    
    // Registration form event listener
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
    }
    
    // Check if user is already registered
    const isRegistered = localStorage.getItem('studentRegistration');
    if (isRegistered && document.getElementById('registration-status')) {
        const data = JSON.parse(isRegistered);
        document.getElementById('registration-status').innerHTML = `
            <div class="alert alert-success">
                ✅ You are registered!<br>
                Name: ${data.name}<br>
                Student ID: ${data.studentId}<br>
                Date: ${new Date(data.timestamp).toLocaleDateString()}
            </div>
        `;
    }

});

db.collection("registrations").add({
  name,
  studentId,
  email,
  timestamp: new Date()
});

db.collection("registrations").get().then(snapshot => {
  snapshot.forEach(doc => {
    // show student + delete button
  });
});


