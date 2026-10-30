import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
});

transporter
    .verify()
    .then(() => console.log('Email Transporter is Ready to send emails'))
    .catch((err) => console.error('Email transporter verification failed:', err.message)); 

export async function sendEmail({to, subject, html}) {
    const mailOptions = {
        from: `QueryMind <${process.env.GOOGLE_USER}>`,
        to,
        subject,
        html,
        text: html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), // plain-text fallback
    };  

    const details = await transporter.sendMail(mailOptions);
    console.log('Email sent:', details);
    return details;
}

