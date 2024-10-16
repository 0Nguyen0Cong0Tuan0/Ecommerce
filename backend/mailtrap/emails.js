const { client, sender } = require('../mailtrap/mailtrap.config');
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require('./emailTemplates');

const sendVerificationEmail = async(email, name, verificationToken) => {
    const recipient = [ {email} ]

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE
                    .replace("{verificationCode}", verificationToken)
                    .replace("{userName}", name),
            category: 'Email Verification',
        })

        console.log('Email sent successfully', response);
    } catch (error) {
        console.error('Error sending verification email ', error);
        throw new Error(`Error sending verification email: ${error}`);
    }
}

const sendWelcomeEmail = async(email, name) => {
    const recipient = [{ email }];

    try {
        await client.send({
            from: sender,
            to: recipient,
            template_uuid: "1b19cc09-8487-4454-b09b-a254a010645e",
            template_variables: {
                name: name,
                company_info_name: "E-Shop",
                company_info_address: "154/71/22 ADLs, W8, HCM City",
                company_info_city: "Food and Services",
                company_info_zip_code: "73000",
                company_info_country: "Viet Nam"
              }
        })
    } catch(error) {
        console.error('Error sending welcome email ', error);
        throw new Error(`Error sending welcome email: ${error}`);
    }

}

const sendPasswordResetEmail = async(email, resetURL) => {
    const recipient = [ {email} ];

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE
                        .replace('{resetURL}', resetURL),
            category: 'Password Reset',
        })
    } catch (error) {
        console.error('Error sending password reset email', error);

        throw new Error(`Error sending password reset email ${error}`);
    }
}

const sendResetSuccessEmail = async(email) => {
    const recipient = [{ email }];

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: 'Password Reset Successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: 'Password Reset'
        });

        console.log('Password reset email sent successfully', response);
        
    } catch(error) {
        console.error('Error sending password reset success email ', error);
        
        throw new Error(`Error sending password reset success email: ${error}`);
    }
}

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail };