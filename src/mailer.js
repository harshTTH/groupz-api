import nodemailer from 'nodemailer';
const from = '"Groupz <info@groupz.com>"';

function getTransport(){
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

export const sendConfirmationEmail = (user) =>{
  const transport = getTransport();
  let email = {
        from: from,
        to: user.email,
        subject:"Groupz : Verification",
        text: `
          Welcome to Groupz, Please verify your email
          ${user.getConfirmationEmail()}    `
  };
  transport.sendMail(email,(err,info)=>{if(err)console.log(err)});
}

export const sendResetPasswordLink = (user) =>{
  const transport = getTransport();
  let email = {
        from: from,
        to: user.email,
        subject:"Reset Password",
        text: `
          Follow link for further instructions :
          ${user.generateResetPasswordLink()}    `
  };
  transport.sendMail(email);
}
