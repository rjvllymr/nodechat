var express = require('express');
var router = express.Router();
const { google } = require('googleapis');
const unirest = require('unirest');
const gkeys = require("../googlekeys.json");
const path = require('path');
const fs = require('fs');
const opn = require('opn');
var async = require('async');
const date = require('date-and-time');
var moment = require('moment');
var momentTZ = require('moment-timezone');
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const creds = require(`../timebot-sheet.json`);
const SPREADSHEET_ID = `12_MZL9hV1jzF4hdvl_a6Ys7BoQhlBeHz0qUISaotrIw`;
const keyfile = require('../hangout-sheet.json');
var doc = new GoogleSpreadsheet('12_MZL9hV1jzF4hdvl_a6Ys7BoQhlBeHz0qUISaotrIw');

//const keyfile = path.join(__dirname, '');
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

router.post("/test", (req, res) => {

//     let now = new Date().getTimezoneOffset();
//    console.log(now);
    var dateTime = momentTZ().tz("America/Los_Angeles").format('hh:mm A');
    var dateFunc = momentTZ().tz("America/Los_Angeles").format('DD/MM/YYYY');
    const { space, message } = req.body;
    console.log(req.body.type);
    console.log(space.type);
    console.log(message.text);
    if (req.body.type == 'MESSAGE') {
        if (message.text == 'start clock') {
            res.send(StartCardClock(req.body.user.displayName,false));
        }
        else if (message.text == 'stop clock') {
            doc.useServiceAccountAuth(gkeys, function (err) {
                doc.getRows(1, (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                    if (rows) {

                        let lastIndex = rows.length;
                        var newRows = rows.reverse();
                        var a = '';
                        for (let index = 0; index < newRows.length; index++) {
                            let element = newRows[index].name;
                            let clockTime = newRows[index].clock;
                            let caseVAl = newRows[index].case;
                            let taskVAl = newRows[index].task;
                            let previousTime = newRows[index].time;
                            let previosDate = newRows[index].date;
                            if (element == req.body.user.displayName && clockTime == 'In') {
                                console.log(previousTime.toString());
                                let currentdate = dateTime.toString();
                                var startTime = moment(previousTime.toString(), 'hh:mm A');
                                var endTime = moment(currentdate, "hh:mm A");
                                var duration = moment.duration(endTime.diff(startTime));
                                var hours = parseInt(duration.asHours());
                                var minutes = parseInt(duration.asMinutes()) % 60;
                               let dateRecord = hours + '.' + minutes + ' hrs.';

                                var options = {
                                    'time': dateTime,
                                    'date': dateFunc,
                                    'name': req.body.user.displayName,
                                    'clock': 'out',
                                    'total-time': dateRecord,
                                    'case': caseVAl,
                                    'task': taskVAl
                                };
                                doc.addRow(1, options, function (err, row) {
                                    if (err) {
                                        console.log('err');
                                    }
                                    if (rows) {
                                        res.send(StopCardClock(dateTime, dateFunc));
                                    }
                                });
                                break;
                            }
                        }

                    }
                });
            });
        }
    }
        if (req.body.type == "CARD_CLICKED") {
            if (req.body.action.actionMethodName == "Case_1") {
                var count = req.body.action.parameters[0].value;
                var key = req.body.action.parameters[0].key;
                res.send(getInteractiveCard(key,count));
            }
            if (req.body.action.actionMethodName == "Case_2") {
                var count = req.body.action.parameters[0].value;
                var key = req.body.action.parameters[0].key;
                res.send(getInteractiveCard(key, count));
            }
            if (req.body.action.actionMethodName == "Case_3") {
                var count = req.body.action.parameters[0].value;
                var key = req.body.action.parameters[0].key;
                res.send(getInteractiveCard(key, count));
            }
            if (req.body.action.actionMethodName == "Task 1") {
                var count = req.body.action.parameters[0].value;
                var key = req.body.action.parameters[0].key;
                doc.useServiceAccountAuth(gkeys, function (err) {
                    doc.getRows(1, (err, rows) => {
                        if (err) {
                            console.log(err);
                        }
                        if (rows) {
                            var options = {
                                'time': dateTime,
                                'date': dateFunc,
                                'name': req.body.user.displayName,
                                'clock': 'In',
                                'case': key,
                                'task':count
                            };
                            doc.addRow(1, options, function (err, row) {
                                if (err) {
                                    console.log('err');
                                }
                                if (rows) {
                                    console.log('row');
                                    res.send(CLockIn(dateTime, dateFunc));
                                }
                            });
                        }
                    });
                });
            }
            if (req.body.action.actionMethodName == "Task 2") {
                var count = req.body.action.parameters[0].value;
                var key = req.body.action.parameters[0].key;
                doc.useServiceAccountAuth(gkeys, function (err) {
                    doc.getRows(1, (err, rows) => {
                        if (err) {
                            console.log(err);
                        }
                        if (rows) {
                            var options = {
                                'time': dateTime,
                                'date': dateFunc,
                                'name': req.body.user.displayName,
                                'clock': 'In',
                                'case': key,
                                'task': count
                            };
                            doc.addRow(1, options, function (err, row) {
                                if (err) {
                                    console.log('err');
                                }
                                if (rows) {
                                    console.log('row');
                                    res.send(CLockIn(dateTime, dateFunc));
                                }
                            });
                        }
                    });
                });
            }
            if (req.body.action.actionMethodName == "Task 3") {
                var count = req.body.action.parameters[0].value;
                var key = req.body.action.parameters[0].key;
                doc.useServiceAccountAuth(gkeys, function (err) {
                    doc.getRows(1, (err, rows) => {
                        if (err) {
                            console.log(err);
                        }
                        if (rows) {
                            var options = {
                                'time': dateTime,
                                'date': dateFunc,
                                'name': req.body.user.displayName,
                                'clock': 'In',
                                'case': key,
                                'task': count
                            };
                            doc.addRow(1, options, function (err, row) {
                                if (err) {
                                    console.log('err');
                                }
                                if (rows) {
                                    console.log('row');
                                    res.send(CLockIn(dateTime, dateFunc));
                                }
                            });
                        }
                    });
                });
            }

        }


});


module.exports = router;

/**
 * Returns a Single Card with
 * @param {String} date
 * @return {Object}
 */

function StopCardClock(dateTime, dateFunc) {
    return {
        "cards": [
            {
                "sections": [
                    {
                        "widgets": [
                            {
                                "textParagraph": {
                                    "text": "Thanks, your clock has stopped at <b>"+dateTime+"</b> on <b>" + dateFunc +"</b>."
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
}


function StartCardClock(voter,update) {
    return {
        "actionResponse": { "type": update ? "UPDATE_MESSAGE" : "NEW_MESSAGE" },
        "cards": [{
            "header": { "title": `Hi  ${voter}!` },
            "sections": [{
                "widgets": [{
                    "textParagraph": { "text": `Please click any one of these cases !!` }
                }, {
                        "image": { "imageUrl": "https://media.giphy.com/media/5uwmDMF2FnKCY/giphy.gif" }
                    },{
                    "buttons": [{
                        "textButton": {
                            "text": "Case 1",
                            "onClick": {
                                "action": {
                                    "actionMethodName": "Case_1",
                                    "parameters": [
                                        {
                                            "key": "Case 1",
                                            "value": "Task 1"
                                        }
                                    ]
                                }
                            }
                        }
                    }, {
                        "textButton": {
                            "text": "Case 2",
                            "onClick": {
                                "action": {
                                    "actionMethodName": "Case_2",
                                    "parameters": [
                                        {
                                            "key": "Case 2",
                                            "value": "Task 2"
                                        }
                                    ]
                                }
                            }
                        }
                        }, {
                            "textButton": {
                                "text": "Case 3",
                                "onClick": {
                                    "action": {
                                        "actionMethodName": "Case_3",
                                        "parameters": [
                                            {
                                                "key": "Case 3",
                                                "value": "Task 3"
                                            }
                                        ]
                                    }
                                }
                            }
                    }]
                }]
            }]
        }]
    };
}


function getInteractiveCard(case_name,task_name) {
    return {
        cards: [{
            header: {
                title: 'Okay, here is the your Task'
            }, "sections": [{
                "widgets": [{
                    "textParagraph": { "text": `Please click on it !!` }
                }, {
                        "image": { "imageUrl": "https://media.giphy.com/media/xUOwGiewfQAm3tcIA8/giphy.gif" }
                }, {
                    "buttons": [{
                        "textButton": {
                            "text": task_name,
                            "onClick": {
                                "action": {
                                    "actionMethodName": task_name,
                                    "parameters": [
                                        {
                                            "key": case_name,
                                            "value": task_name
                                        }
                                    ]
                                }
                            }
                        }
                    }]
                }]
            }]
        }],
    };
}

function CLockIn(dateTime, dateFunc) {
    return {
        "cards": [
            {
                "sections": [
                    {
                        "widgets": [
                            {
                                "textParagraph": {
                                    "text": "Great, your clock has started at <b>" + dateTime + "</b> on <b>" + dateFunc + "</b>."
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

