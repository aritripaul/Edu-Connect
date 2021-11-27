const 
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

const drive = google.drive({
    version:'v3',
    auth:oAuth2Client
})

async function upload(to, subject, text, html) {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const response = drive.files({request})
    } catch (error) {
        return error
    }
}

module.exports.upload = upload
