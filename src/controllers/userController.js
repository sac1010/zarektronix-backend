const User = require("../models/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "sachingirish101@gmail.com",
    pass: process.env.gmailPass,
  },
});

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser, "user")
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Generate a random verification token
    const verificationToken = Math.random().toString(36).substring(7);

    // Create a new user
    const newUser = new User({ name, email, password, verificationToken });
    await newUser.save();

    // Send verification email
    const mailOptions = {
      from: "Sachin Girish",
      to: email,
      subject: "Verify your email",
      text: `Please use this otp to verify your mail: ${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Signup successful. Check your email for verification.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Find the user with the verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ error: 'User not found or already verified.' });
    }

    // Update user's verification status
    user.isVerified = true;
    user.verificationToken = undefined; 

    await user.save();

    return res.status(200).json({ message: 'Email verification successful.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { signUp, verifyEmail };
