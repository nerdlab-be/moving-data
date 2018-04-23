const {google} = require('googleapis');
const privatekey = require("./privatekey.json");
const drive = google.drive('v3');

// configure a JWT auth client
const jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/drive']);

//authenticate request
jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Successfully connected!");
        listFiles();
    }
});

//Google Drive API
function listFiles(){
    const dataFolderId = "1x7rnAjJoCUWQYBTenJxAFP3qPuGaKCG2";
    const demoCaptureFolderId = "1B5hH1LUbDrqYyWsfhQR4Z9-Hv0otL4zq";

    drive.files.list({
        auth: jwtClient,
        q: `'${demoCaptureFolderId}' in parents`
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        var files = response.data.files;
        if (files.length == 0) {
            console.log('No files found.');
        } else {
            console.log('Files from Google Drive:');
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                console.log('%s (%s)', file.name, file.id);
            }
        }
    });
}