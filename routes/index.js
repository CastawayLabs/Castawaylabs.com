var express = require('express'),
	nodemailer = require('nodemailer'),
	router = express.Router(),
	transporter = nodemailer.createTransport({
		port: 2525,
		service: 'Mandrill',
		auth: {
			user: process.env.EMAIL_USER || '',
			pass: process.env.EMAIL_PASS || ''
		}
	}),
	sendMail = transporter.sendMail.bind(transporter),
	emailValidator = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
	EMAIL_TO = process.env.EMAIL_TO || '';

if (!EMAIL_TO || !emailValidator.test(EMAIL_TO)) {
		throw new Error("Invalid EMAIL_TO.");
}

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', {
		'title': 'Castaway Labs LLC'
	});
});

router.post('/email', function(req, res) {
	var name = req.body.inputName || '',
		email = req.body.inputEmail || '',
		message = req.body.inputMessage || '';

	if(!name || !email || !message || !emailValidator.test(decodeURIComponent(email))) {
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
