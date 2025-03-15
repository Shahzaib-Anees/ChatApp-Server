const emailTemplates = {
  registerVerificationEmail: (username, code) => {
    return `<h3>Dear ${username},</h3>
      <p>Thank you for registering with <strong>ChatBox</strong>! To complete your registration and activate your account, please enter the verification code provided below:</p>
      <p><strong>Verification Code: ${code}</strong></p>
      <p>This code will expire in <strong>1 minute</strong>. If you did not request this verification, please disregard this email.</p>
      <p>If you need further assistance, feel free to reach out to us at mohammadshahzaib046@gmail.com.</p>
      <br>
      <p>Welcome to the community,</p>
      <p>The <strong>ChatBox</strong> Team</p>`;
  },
  loginVerificationEmail: (username, code) => {
    return `<h3>Dear ${username},</h3>
  <p>To complete your login to <strong>ChatBox</strong>, please enter the verification code provided below:</p>
  <p><strong>Login Verification Code: ${code}</strong></p>
  <p>This code will expire in <strong>1 minute</strong>. If you did not request this login, please reset your password immediately.</p>
  <p>If you need further assistance, reach out to us at <a href="mailto:mohammadshahzaib046@gmail.com">mohammadshahzaib046@gmail.com</a>.</p>
  <br>
  <p>Stay secure,</p>
  <p>The <strong>ChatBox</strong> Team</p>
`;
  },
  accountRecoveryEmail: (username, code) => {
    return `<h3>Dear ${username},</h3>
<p>We received a request to recover your <strong>ChatBox</strong> account. To proceed, please use the verification code below:</p>
<p><strong>Account Recovery Code: ${code}</strong></p>
<p>This code will expire in <strong>1 minute</strong>. If you did not request this, please ignore this email.</p>
<p>If you need further assistance, reach out to us at <a href="mailto:mohammadshahzaib046@gmail.com">mohammadshahzaib046@gmail.com</a>.</p>
<br>
<p>Stay secure,</p>
<p>The <strong>ChatBox</strong> Team</p>
`;
  },
};

export { emailTemplates };
