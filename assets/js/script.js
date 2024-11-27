// Load the Google Sheets API client
function loadClient() {
    gapi.client.init({
        'apiKey': 'AIzaSyDetKqtreyo27j_0qebUiweusPeNAkQnkc', // Replace with your Google Sheets API key
    }).then(function() {
        console.log("Google API client loaded for Sheets");
        getData();
    }, function(error) {
        console.error("Error loading Google API client for Sheets!", error);
    });
}

// Fetch data from the Google Sheet
function getData() {
    gapi.client.load("sheets", "v4", function() {
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1yHbwo2y4FuVg9qpc0pQ2FRnBIsGF-ZlnShuZj77GG6A', // Replace with your Google Sheet ID
            range: 'Folha1!A2:D', // Adjusted to fetch all relevant columns
        }).then(function(response) {
            const rows = response.result.values;
            document.getElementById('login-form').addEventListener('submit', function(e) {
                e.preventDefault();
                checkLogin(rows);
            });
        });
    });
}

// Check the login credentials
// Check the login credentials
function checkLogin(rows) {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    let valid = false;
    let username = '';

    for (let i = 0; i < rows.length; i++) {
        const [usernameFromSheet, email, password, admin] = rows[i]; // Adjusted to match columns in sheet
        if (usernameFromSheet === usernameInput && password === passwordInput) {
            valid = true;
            username = usernameFromSheet;
            break;
        }
    }

    if (valid) {
        errorMessage.textContent = "Login successful!";
        // Pass the username to the welcome page using URL parameters
        window.location.href = `welcome.html?username=${encodeURIComponent(username)}`;
    } else {
        errorMessage.textContent = "Invalid username or password!";
    }
}


// Load the Google Sheets API client when the page loads
gapi.load('client', loadClient);
