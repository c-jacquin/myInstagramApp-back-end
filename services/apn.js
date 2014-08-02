var apn = require('apn');
var q = require('q');


module.exports = {
    sendNotification : function(type,token,sender){
        var apnConnection = apn.Connection({
            cert : '../appleCertif/cert.pem',
            key : '../appleCertif/key.pem',
            address : 'gateway.sandbox.push.apple.com'
        });
        apnConnection.on('error', console.log('error'));
        apnConnection.on('transmitted', console.log('transmitted'));
        apnConnection.on('timeout', console.log('timeout'));
        apnConnection.on('connected', console.log('connected'));
        apnConnection.on('disconnected', console.log('disconnected'));
        apnConnection.on('socketError', console.log('socketError'));
        apnConnection.on('transmissionError', console.log('transmissionError'));
        apnConnection.on('cacheTooSmall', console.log('cacheTooSmall'));
        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        note.sound = "ping.aiff";
        switch(type){
            case 'phat':
                note.alert = "\uD83D\uDCE7 \u2709 You have a new phat";
                note.payload = {'messageFrom': sender};
                break;
            case 'follow':
                note.alert = "\uD83D\uDCE7 \u2709 You have a new follower";
                note.payload = {'messageFrom': sender.pseudo};
                break;
            case 'sunset':
                note.alert = "\uD83D\uDCE7 \u2709 Sunset !!!!";
            break;
            case 'sunrise':
                note.alert = "\uD83D\uDCE7 \u2709 Sunrise :(";
            break;
        }
        console.log('token', token)
        var device = new apn.Device(token);
        apnConnection.pushNotification(note, device);

    }
}