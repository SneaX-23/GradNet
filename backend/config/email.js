// import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import {Resend} from "resend";
dotenv.config();

const resend  = new Resend(process.env.RESEND_API_KEY)
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default resend;