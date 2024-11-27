// Load the Google Sheets API client
function loadClient() {
    gapi.load('client:auth2', initClient);
}

// Initialize the Google API client with OAuth2
function initClient() {
    gapi.client.init({
        'apiKey': 'AIzaSyDetKqtreyo27j_0qebUiweusPeNAkQnkc', // Retain the API Key for read-only operations
        'clientId': '1099028325374-lmj5a8i2pnnel1bs2ot8i1rbrnap2h5b.apps.googleusercontent.com', // Replace with your OAuth2 Client ID
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        'scope': 'https://www.googleapis.com/auth/spreadsheets' // Scope to access and modify Google Sheets
    }).then(function() {
        // Ensure the user is signed in before allowing operations
        gapi.auth2.getAuthInstance().signIn().then(function() {
            console.log("Signed in successfully");
        });
    }, function(error) {
        console.error("Error initializing Google API client for Sheets!", error);
    });
}

// Append a new user to the Google Sheet
function appendUserToSheet(username, email, password) {
    const values = [
        [username, email, password, 0] // The new user row, with admin set to 0
    ];

    const body = {
        values: values
    };

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: '1yHbwo2y4FuVg9qpc0pQ2FRnBIsGF-ZlnShuZj77GG6A', // Replace with your Google Sheet ID
        range: 'Folha1!A2:D', // Adjust range if necessary
        valueInputOption: 'RAW',
        resource: body
    }).then(function(response) {
        const result = response.result;
        if (result.updates.updatedRows > 0) {
            document.getElementById('success-message').textContent = "User registered successfully!";
            setTimeout(() => {
                window.location.href = 'index.html'; // Redirect to login page after success
            }, 2000); // Delay before redirecting
        } else {
            document.getElementById('error-message').textContent = "Error registering user.";
        }
    }, function(error) {
        console.error("Error registering user!", error);
        document.getElementById('error-message').textContent = "Error registering user.";
    });
}

// Handle form submission
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simple validation (you can expand this as needed)
    if (!username || !email || !password) {
        document.getElementById('error-message').textContent = "All fields are required!";
        return;
    }

    document.getElementById('error-message').textContent = "";
    appendUserToSheet(username, email, password);
});

// Load the Google Sheets API client when the page loads
gapi.load('client:auth2', loadClient);
