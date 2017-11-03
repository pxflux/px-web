const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// exports.touch = functions.database.ref('/artists/{artistId}').onWrite(
//   event => admin.database().ref('/lastmodified').set(event.timestamp));
