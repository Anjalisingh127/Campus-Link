import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

if (!env.adminEmail || !env.adminPassword || env.adminPassword.length < 12) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters) must be configured');
}

try {
  await connectDatabase();
  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  const user = await User.findOneAndUpdate(
    { email: env.adminEmail.trim().toLowerCase() },
    { name: 'CampusConnect Admin', passwordHash, role: 'admin' },
    { new: true, upsert: true, runValidators: true },
  );
  console.log(`Admin account ready: ${user.email}`);
} finally {
  await disconnectDatabase();
}
