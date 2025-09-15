import sgMail from "../config/email.js";

export const sendMail = sgMail
    .send(msg)
    .then(() => {
        console.log("Email Sent")
    })
    .catch((error) => {
        console.error(error)
    })



    