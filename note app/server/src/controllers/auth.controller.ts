import { Request, Response } from 'express';
import { generateToken } from '../config/jwt';
import { User } from '../models/User';
import { OTP } from '../models/OTP';
import { sendOTPEmail } from '../services/email.service';
import crypto from 'crypto';

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );
    
    await sendOTPEmail(email, otp);
    
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }
    
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, isVerified: true });
    } else {
      user.isVerified = true;
      await user.save();
    }
    
    // Generate JWT
    const token = generateToken(user._id);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// Google OAuth controllers would go here