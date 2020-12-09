const sgMail = require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


// Generates welcome email upon creating a user
exports.sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sandroarobeli77@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the Task Manager ${name}. Let me know if you have any questions so far.`
    })
}
// Generates feedback email upon user cancelling their account
exports.sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sandroarobeli77@gmail.com',
        subject: 'Sorry to see you go!',
        text: `We are sorry to see you cancel your account ${name}. Please let us know what we could have done differently to retain your business.`
    })
} 



