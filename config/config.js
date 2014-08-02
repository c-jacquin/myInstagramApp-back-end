module.exports = {
    production: {
        mongo_uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI,
        public_url: 'http://fdtd.herokuapp.com',
        mailjet_apikey: '174fb382f200f174062a172160b52772',
        mailjet_secretkey: 'e7e1552922ea39b001d094ae7c927483',
        allowedDomains: '*',
        prerenderToken: 'lQQXakLudFESzoToNMfW',
        aws_s3_url : 'https://s3.amazonaws.com/ChoozForMeBucket/',
        thumbs: {
            dimBorder: 0,
            width: 250,
            height: 250
        }
    },
    development: {
        mongo_uri: "mongodb://localhost:27017/cfm",
        public_url: '127.0.0.1:5000',
        mailjet_apikey: 'c554676e5b5d4498f36d5ee5de0798de',
        mailjet_secretkey: '5d9bba47f522b4276a90330223ed47ad',
        allowedDomains: '*',
        prerenderToken: 'as6wgolNcAm05wm8EYB2',
        aws_s3_url : 'https://s3.amazonaws.com/ChoozForMeBucket/',
        thumbs: {
            dimBorder: 0,
            width: 250,
            height: 250
        }
    }
};