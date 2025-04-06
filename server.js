import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import ImageKit from 'imagekit';
import { randomUUID } from 'node:crypto';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

console.log('ImageKit Config:', {
  endpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY?.slice(0, 12) + '...',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY?.slice(0, 12) + '...'
});

app.get('/api/imagekit-auth', (req, res) => {
  try {
    const token = randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 60 * 30;
    const signature = CryptoJS.HmacSHA1(`${token}${expire}`, process.env.IMAGEKIT_PRIVATE_KEY).toString(CryptoJS.enc.Hex);
    res.json({
      token,
      signature,
      expire,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY
    });
  } catch (error) {
    console.error('ImageKit auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
