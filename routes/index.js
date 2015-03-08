var express = require('express'),
    nodemailer = require('nodemailer');
var router = express.Router();
var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASS || ''
        }
    });
var emailValidator = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
var EMAIL_TO = process.env.EMAIL_TO || '';
if (!EMAIL_TO || !emailValidator.test(EMAIL_TO)) {
    throw new Error("Invalid EMAIL_TO.");
}
var sendMail = transporter.sendMail.bind(transporter);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    'title': 'Castaway Labs LLC'
  });
});

router.post('/email', function(req, res) {
  var name = req.body.inputName || '';
  var email = req.body.inputEmail || '';
  var message = req.body.inputMessage || '';

  if(!name || !email || !message || !emailValidator.test(email)) { // Add more validation?
    res.send('nope');
    res.end();
    return;
  }

  sendMail({
    from: decodeURIComponent(name) + ' <' + decodeURIComponent(email) + '>',
    to: EMAIL_TO,
    subject: 'Response on Castawaylabs.com',
    text: decodeURIComponent(message)
  }, function(err, info) {
    if (!err) {
        res.send('ok');
        res.end();
        return;
    }
    console.log(err);
    res.send('failed');
    res.end();
  });
});

module.exports = router;
