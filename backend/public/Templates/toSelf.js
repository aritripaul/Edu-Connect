const template = (
    to,
    name,
    message,
    email,
    ip = 'N/A',
    city = 'N/A',
    region = 'N/A',
    country = 'N/A',
    latitude = 'N/A',
    longitude = 'N/A'
) => {
    return `<div style="width:100%;padding:25px;background-color:#7f8c8d;box-sizing:border-box">
    <div style="border-radius:15px 15px 0px 0px;max-width:800px;width:80%;padding:25px;background-color:white;margin:auto;min-height:200px">
        <a href="https://dncjgec.in" ><img alt="DnC logo" src="https://dncjgec.in/static/media/Logo.f24318f8.png" style=height:40px;width:auto></img></a>
        <p>From <strong>${name},</strong></p>
        <p>${message}</p>
    </div>
    <div style="border-radius:0px 0px 15px 15px;max-width:800px;width:80%;padding:25px;background-color:white;margin:auto;">
        <p style=float:bottom><strong>Sender's Details:</strong><a href="mailto: ${email}">${email}</a> </p>
    </div>
    <div style="color:white;text-align:center;margin:20px 0px 0px 0px"><i>Copyright @ <a href="https://dncjgec.in" style="color:white;text-decoration:none"><u>Divide & Conquer</u></a><br>This mail was sent to${to}</i></div>
<div></div>`
}

const textTemplate = (to, name, message, email) => {
    return `From ${name}, \n\n ${message} \n\n Details: Email: ${email} \n This Message was sent to ${to}`
}

module.exports.toSelfHtml = template
module.exports.toSelfText = textTemplate
