const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(to, subject, text, html) {
    try {
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'educonnect.ms@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        })
        const mailOptions = {
            from: 'Edu Connect Mailer 📧 <educonnect.ms@gmail.com>',
            to: to ? to : 'aritripaul.paul@gmail.com',
            subject,
            text,
            html,
        }
        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        console.log(error)
        return error
    }
}

module.exports.sendMail = sendMail
