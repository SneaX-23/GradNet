import db from "../config/database.js";
import sgMail from "../config/email.js";
export const sendMail = async (req, res)=>{
    await db.query("DELETE FROM otp_verifications WHERE expires_at < NOW() OR is_used = true");
    const in_usn = req.body.usn;

    const result = await db.query("SELECT email from users WHERE usn = $1", [in_usn]);
    const email = result.rows[0]?.email;
    console.log(email);
    req.session.gmail = email;
    
    if (email){
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp);
        const expire_at = new Date(Date.now() + 10 * 60 * 1000);
        await db.query("DELETE FROM otp_verifications WHERE email = $1", [email]);
        try{
            await db.query(
                "INSERT INTO otp_verifications (email, otp_code, expires_at, purpose) VALUES($1, $2, $3, 'login')", [email, otp, expire_at]
            );
        }catch(err){
            console.log(err)
        }
        
        const msg = {
            to: email,
            from: process.env.SENDER_EMAIL,
            subject: 'OTP for GradNet registration',
            text: `Your otp is ${otp}.`,
            html: `Your otp is <strong>${otp}</strong>.`,
        }
        
        sgMail
            .send(msg)
            .then(() => {
            console.log('Email sent')
            })
            .catch((error) => {
            console.error(error)
            })


        res.render("login.ejs", {mail: email})
    }else{
        res.redirect("/");
    }
}