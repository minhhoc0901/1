const transporter = require('../config/emailConfig');


const sendOTPEmail = async (to, otp, username, isPasswordReset = false) => {
    try {
        const subject = isPasswordReset ? "Đặt lại mật khẩu - Travel PY" : "Xác thực email - Travel PY";
        const title = isPasswordReset ? "Đặt lại mật khẩu" : "Xác thực Email của bạn";
        const message = isPasswordReset 
            ? "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn." 
            : "Cảm ơn bạn đã đăng ký tài khoản tại Travel PY.";

        await transporter.sendMail({
            from: '"Travel PY" <your-email@gmail.com>',
            to: to,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
                        <img src="https://dongphuchaianh.com/wp-content/uploads/2022/05/logo-ao-lop-hinh-may-bay-noi-bat.jpg" alt="Travel PY Logo" style="max-width: 150px; margin-bottom: 20px;"/>
                        <h2 style="color: #0072bb;">${title}</h2>
                        <p style="margin: 15px 0;">
                            Xin chào ${username}! <br>
                            ${message}
                            Vui lòng sử dụng mã OTP dưới đây:
                        </p>
                        <div style="background: #fff; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #0072bb; letter-spacing: 5px; margin: 0;">${otp}</h1>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            Mã này sẽ hết hạn sau 60 giây. 
                            ${isPasswordReset ? 'Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.' : ''}
                            Vui lòng không chia sẻ mã này với bất kỳ ai.
                        </p>
                    </div>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error('Send email error:', error);
        return false;
    }
};

module.exports = { sendOTPEmail };