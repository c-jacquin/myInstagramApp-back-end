var SunCalc = require('suncalc');

exports.compute = function(req, res) {
    try {
        if (!req.body) {
            res.send({message: 'Invalid request'});
            return;
        }
        var data = SunCalc.getTimes(new Date(req.body.timestamp),
                req.body.coords.latitude,
                req.body.coords.longitude);
//        console.group('SUNCALC');
//        console.log('params : date %O, latitude %O, longitude %O: '
//                , req.body.date, req.body.latitude, req.body.longitude);
//        console.log('Suncalc : ' + data);
//        console.groupEnd();
        res.send(data);
    } catch (exception) {
        console.log('Erreur compute suncalc %O', exception);
    }
};

//SunCalc.getTimes(/*Date*/ date, /*Number*/ latitude, /*Number*/ longitude)
//Returns an object with the following properties (each is a Date object):
//
//sunrise: sunrise (top edge of the sun appears on the horizon)
//sunriseEnd: sunrise ends (bottom edge of the sun touches the horizon)
//goldenHourEnd: morning golden hour (soft light, best time for photography) ends
//solarNoon: solar noon (sun is in the highest position)
//goldenHour: evening golden hour starts
//sunsetStart: sunset starts (bottom edge of the sun touches the horizon)
//sunset: sunset (sun disappears below the horizon, evening civil twilight starts)
//dusk: dusk (evening nautical twilight starts)
//nauticalDusk: nautical dusk (evening astronomical twilight starts)
//night: night starts (dark enough for astronomical observations)
//nightEnd: night ends (morning astronomical twilight starts)
//nauticalDawn: nautical dawn (morning nautical twilight starts)
//dawn: dawn (morning nautical twilight ends, morning civil twilight starts)
//nadir: nadir (darkest moment of the night, sun is in the lowest position)


//Sun position
//
//SunCalc.getPosition(/*Date*/ timeAndDate, /*Number*/ latitude, /*Number*/ longitude)
//Returns an object with the following properties:
//
//altitude: sun altitude above the horizon in radians, e.g. 0 at the horizon and PI/2 at the zenith (straight over your head)
//azimuth: sun azimuth in radians (direction along the horizon, measured from south to west), e.g. 0 is south and Math.PI * 3/4 is northwest
//Moon position
//
//SunCalc.getMoonPosition(/*Date*/ timeAndDate, /*Number*/ latitude, /*Number*/ longitude)
//Returns an object with the following properties:
//
//altitude: moon altitude above the horizon in radians
//azimuth: moon azimuth in radians
//distance: distance to moon in kilometers
//Moon illumination
//
//SunCalc.getMoonIllumination(/*Date*/ timeAndDate)
//Returns an object with the following properties:
//
//fraction: illuminated fraction of the moon; varies from 0.0 (new moon) to 1.0 (full moon)
//angle: midpoint angle in radians of the illuminated limb of the moon reckoned eastward from the north point of the disk; the moon is waxing if the angle is negative, and waning if positive