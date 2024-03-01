const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Read JSON data
const userData = require('./data/user.json');
const addressData = require('./data/address.json');
const userAddressData = require('./data/user_address.json');
const employerData = require('./data/employer.json');
const empAddressData = require('./data/empaddress.json');

// Route to render index page
app.get('/', (req, res) => {
    res.render('index');
});

// Route to handle search request
app.post('/search', (req, res) => {
    const username = req.body.username;

    // Validate if the input contains only alphabets
    if (!/^[a-zA-Z]+$/.test(username)) {
        res.render('searchResults', { error: "Invalid input. Please enter alphabets only." });
        return;
    }

    const user = userData.find(user => user.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
        res.render('searchResults', { user: null, error: "User not found!" });
        return;
    }

    const userId = user.userid;
    const userAddress = userAddressData.find(data => data.userid === userId);
    const address = addressData.find(addr => addr.addressid === (userAddress ? userAddress.addressid : null));

    const employer = employerData.find(emp => emp.userid === userId);
    const empAddress = empAddressData.find(emp => emp.empid === (employer ? employer.empid : null));

    res.render('searchResults', { user, address, employer, empAddress });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
