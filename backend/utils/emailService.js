import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"TravelWorld" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Verification Code - TravelWorld',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #333; text-align: center; margin-bottom: 30px;">🏝️ TravelWorld</h1>
            
            <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">رمز التحقق</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
              مرحباً بك في TravelWorld! لإكمال عملية التسجيل، يرجى إدخال رمز التحقق التالي:
            </p>
            
            <div style="background-color: #f8f9fa; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${otp}</span>
            </div>
            
            <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
              هذا الرمز صالح لمدة 10 دقائق فقط. لا تشاركه مع أي شخص.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              إذا لم تقم بطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

export const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"TravelWorld" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to TravelWorld! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #333; text-align: center; margin-bottom: 30px;">🏝️ TravelWorld</h1>
            
            <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">أهلاً وسهلاً ${userName}!</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
              شكراً لتسجيلك في TravelWorld! حسابك تم تفعيله بنجاح ويمكنك الآن استكشاف رحلاتنا المذهلة حول العالم.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173" 
                 style="background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                ابدأ رحلتك الآن
              </a>
            </div>
            
            <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
              نتمنى لك رحلة ممتعة مع TravelWorld! 🌟
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};
