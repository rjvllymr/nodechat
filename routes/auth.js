const { google } = require('googleapis');
var express = require('express');
var router = express.Router();
const opn = require('opn');
const path = require('path');
const fs = require('fs');

const keyfile = path.join(__dirname, 'credentials.json');
const keys = JSON.parse(fs.readFileSync(keyfile));
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// Create an oAuth2 client to authorize the API call
const client = new google.auth.OAuth2(
    keys.installed.client_id,
    keys.installed.client_secret,
    keys.installed.redirect_uris[0]
);
// Generate the url that will be used for authorization
this.authorizeUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

// Open an http server to accept the oauth callback. In this
// simple example, the only request to our webserver is to
// /oauth2callback?code=<code>

router.get('/', async (req, res) => {
    opn(this.authorizeUrl, { wait: false });
});

router.get('/oauth2callback', (req, res) => {
    const code = req.query.code;
    client.getToken(code, (err, tokens) => {
        if (err) {
            console.error('Error getting oAuth tokens:');
            throw err;
        }
        client.credentials = tokens;
        res.send('Authentication successful! Please return to the console.');
        server.close();
        listMajors(client);
    });
});
// const server = app.listen(3000, () => {
//     // open the browser to the authorize url to start the workflow
//     opn(this.authorizeUrl, { wait: false });
// });

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors(auth) {
    const sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: 'Class Data!A2:E'
    }, (err, res) => {
        if (err) {
            console.error('The API returned an error.');
            throw err;
        }
        const rows = res.data.values;
        if (rows.length === 0) {
            console.log('No data found.');
        } else {
            console.log('Name, Major:');
            for (const row of rows) {
                // Print columns A and E, which correspond to indices 0 and 4.
                console.log(`${row[0]}, ${row[4]}`);
            }
        }
    });
}