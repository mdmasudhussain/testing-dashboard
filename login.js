document.addEventListener('DOMContentLoaded', function() {
    
    // --- LOGIN AUTHORIZATION ---
    const AUTHORIZED_USERS = [
        "contact", "mdmasud", "masud", "amit",
        "dmarc-report", "admin", "bibek", "founder"
    ];
    
    // --- HELP SECTION AUTHORIZED PERSONAL EMAILS ---
    const AUTHORIZED_HELP_EMAILS = [
        "admin@forbenext.indevs.in", // Add your authorized personal emails here
        "amitbcompjc@gmail.com",
        "masudbcompjc@gmail.com",
        "contact@forbenext.indevs.in",
        "mdmasud@forbenext.indevs.in",
        "masud@forbenext.indevs.in",
        "amit@forbenext.indevs.in",
        "itdept@forbenext.indevs.in"
    ];
    
    localStorage.setItem('authorizedUsers', JSON.stringify(AUTHORIZED_USERS));

    try {
        // --- EXISTING LOGIN LOGIC ---
        var loginCard = document.getElementById('loginCard');
        if (loginCard) {
            setTimeout(function() { loginCard.classList.add('active'); }, 100);
        }

        var loginForm = document.getElementById('loginForm');
        var loginBtn = document.getElementById('loginAction');
        var userInput = document.getElementById('username');
        var passInput = document.getElementById('password');
        var errorBox = document.getElementById('errorBox');

        if (userInput) {
            userInput.addEventListener('input', function() {
                if (errorBox) errorBox.style.display = 'none';
            });
        }
        
        if (passInput) {
            passInput.addEventListener('input', function() {
                if (errorBox) errorBox.style.display = 'none';
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var user = userInput.value.trim().toLowerCase(); 
                var pass = passInput.value.trim();
                
                if (!user || !pass) return;

                // Simple check: user must be authorized and password must be "admin123" or similar
                // For demonstration, let's say any password works if user is in AUTHORIZED_USERS
                // or we can set a default password.
                if (!AUTHORIZED_USERS.includes(user)) {
                    if (errorBox) {
                        errorBox.innerText = "Access Denied: Username is not authorized.";
                        errorBox.style.display = 'block';
                    }
                    userInput.value = '';
                    userInput.focus();
                    return;
                }

                // If you want a specific password, add it here.
                 // For now, let's just allow any password as long as it's not empty (which 'required' handles)
                 // but to make it feel like real auth, I'll add a check for a sample password.
                 if (pass !== "forbenext") {
                     if (errorBox) {
                         errorBox.innerText = "Access Denied: Invalid password.";
                         errorBox.style.display = 'block';
                     }
                     passInput.value = '';
                     passInput.focus();
                     return;
                 }

                if (errorBox) errorBox.style.display = 'none';
                loginBtn.innerText = "Authenticating...";
                loginBtn.classList.add('loading');

                // Store user info for dashboard
                localStorage.setItem('currentUser', user);

                setTimeout(function() { 
                    window.location.href = "dashboard.html"; 
                }, 800);
            });
        }

        // --- NEW HELP SECTION LOGIC ---
        var helpToggle = document.getElementById('helpToggleLink');
        var helpSection = document.getElementById('helpSection');
        var sendHelpBtn = document.getElementById('sendHelpRequest');
        var helpErrorBox = document.getElementById('helpErrorBox');

        if (helpToggle && helpSection) {
            helpToggle.addEventListener('click', function() {
                if (helpSection.style.display === 'none') {
                    helpSection.style.display = 'block';
                    helpToggle.innerText = 'Close Help';
                } else {
                    helpSection.style.display = 'none';
                    helpToggle.innerText = 'Forgot username? / Help';
                }
            });
        }

        // --- NEW HELP SENDING LOGIC ---
        if (sendHelpBtn) {
            sendHelpBtn.addEventListener('click', function() {
                var emailInput = document.getElementById('personalEmail').value.trim().toLowerCase();
                var messageInput = document.getElementById('helpMessage').value.trim();
                var helpErrorBox = document.getElementById('helpErrorBox');
                var helpSuccessBox = document.getElementById('helpSuccessBox');

                // 1. Reset visibility of message boxes
                if (helpErrorBox) helpErrorBox.style.display = 'none';
                if (helpSuccessBox) helpSuccessBox.style.display = 'none';

                // 2. Basic Validation
                if (!emailInput || !messageInput) {
                    alert("Please enter both your email and a message.");
                    return;
                }

                // 3. Security Authorization Check
                if (!AUTHORIZED_HELP_EMAILS.includes(emailInput)) {
                    if (helpErrorBox) {
                        helpErrorBox.style.display = 'block';
                    }
                    return;
                }

                // 4. Send the Request to your inbox via Formspree
                // REMINDER: Replace YOUR_ID_HERE with your Formspree ID
                fetch("https://formspree.io/f/maqpqldr", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: emailInput,
                        message: messageInput,
                        _subject: "Portal Help Request from " + emailInput
                    })
                })
                .then(response => {
                    if (response.ok) {
                        // SUCCESS: Hide inputs and button
                        document.getElementById('personalEmail').style.display = 'none';
                        document.getElementById('helpMessage').style.display = 'none';
                        document.getElementById('sendHelpRequest').style.display = 'none';

                        // Show the Dark Green Success Box
                        if (helpSuccessBox) {
                            helpSuccessBox.style.display = 'block';
                        }

                        // Clear the text fields
                        document.getElementById('personalEmail').value = "";
                        document.getElementById('helpMessage').value = "";

                        // Wait 5 seconds, then reset everything back to normal
                        setTimeout(function() {
                            if (helpSuccessBox) helpSuccessBox.style.display = 'none';
                            document.getElementById('personalEmail').style.display = 'block';
                            document.getElementById('helpMessage').style.display = 'block';
                            document.getElementById('sendHelpRequest').style.display = 'block';
                        }, 5000);

                    } else {
                        alert("There was a problem sending your request. Please try again.");
                    }
                })
                .catch(error => {
                    alert("Network error. Please check your connection.");
                    console.error("Error:", error);
                });
            });
        }

    } catch (e) {
        console.error('An unexpected error occurred:', e);
    }
});