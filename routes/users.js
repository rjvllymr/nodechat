var express = require('express');
var router = express.Router();
const { google } = require('googleapis');
const unirest = require('unirest');
var GoogleSpreadsheet = require('google-spreadsheet');
const gkeys = require("../googlekeys.json");
const path = require('path');
const fs = require('fs');
var request = require('request');
var doc = new GoogleSpreadsheet('12_MZL9hV1jzF4hdvl_a6Ys7BoQhlBeHz0qUISaotrIw');

var format = 'tsv';         // Format you'd like to parse. `tsv` or `csv`
var id = '12_MZL9hV1jzF4hdvl_a6Ys7BoQhlBeHz0qUISaotrIw'; // The Google Sheet ID found in the URL of your Google Sheet.
var sheetId = 25342101;            // The Page ID of the Sheet you'd like to export. Found as `gid` in the URL.

router.get('/test', function (req, res) {
    doc.useServiceAccountAuth(gkeys, function (err) {
        // doc.getInfo(function (err, info) {
        //     console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
        //    var  sheet = info.worksheets[0];
        //     console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);
        //     res.send(sheet.title);
        // });

        // getinfo code
        /*doc.getInfo(function (error, info) {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                var sheet = info.worksheets[0];
                console.log(sheet);
                res.send("DSgdsg");
            }
        });*/

        // doc.addRow({
        //     offset: 1,
        //     limit: 20,
        //     orderby: 'col2'
        // }, function (err, rows) {
        //     console.log('Read ' + rows.length + ' rows');

        //     // the row is an object with keys set by the column headers
        //     rows[0].colname = 'new val';
        //     rows[0].save(); // this is async

        //     // deleting a row
        //     rows[0].del();  // this is async

        //     res.send("dsggdsgdsggd");
        // });
        // doc.addRow(1, { last_name: 'Agnew', first_name: 'Samuel' }, function (err) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log("sddsgdsg");
        //         res.send("ddsgsg");
        //     }
        // });
        // doc.addWorksheet({
        //     title: 'my new sheet'
        // }, function (err, sheet) {

        //     // change a sheet's title
        //     sheet.setTitle('new title'); //async

        //     //resize a sheet
        //     sheet.resize({ rowCount: 50, colCount: 20 }); //async

        //     sheet.setHeaderRow(['name', 'age', 'phone']); //async

        //     // removing a worksheet
        //   //  sheet.del(); //async

        //     });

        // doc.addRow(1, { last_name: 'Agnew', first_name: 'Samuel' }, function (err) {
        //     if (err) {
        //         console.log(err);
        //     }
        // });

        // doc.getRows({
        //     offset: 1
        // }, function (err, rows) {
        //     if (err) {
        //         console.log("error");
        //     }
        //     if (rows) {
        //         console.log("rows");
        //     }
        // });
        doc.getRows(1, (err, rows) => {
            if (err) {
                console.log(err);
            }
            if (rows) {
                doc.addRow(1, { name: 'Agnew', age: 'Samuel', phone:'sdfsaf' }, function (err,row) {
                    if (err) {
                        console.log('err');
                    }
                    if (rows) {
                        console.log(row);
                        res.send("Dgssgds");
                    }
                });
            }
        });




    });
});
function getJWT() {
    return new Promise((resolve, reject) => {
        let jwtClient = new google.auth.JWT(
            gkeys.client_email,
            null,
            gkeys.private_key, ['https://www.googleapis.com/auth/chat.bot']);
        jwtClient.authorize((err, tokens) => {
            if (err) {
                console.log('Error create JWT hangoutchat');
                reject(err);
            } else {
                resolve(tokens.access_token);
                console.log('tokens: ', tokens.access_token);
            }
        });
    });
}



module.exports = router;