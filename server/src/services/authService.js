import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

const SALT_ROUNDS = 12;

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function createToken(user) {
  return jwt.sign(
    { email: user.email, role: user.role },
    env.jwtSecret,
    { subject: user.id, expiresIn: env.jwtExpiresIn },
  );
}

export async function register({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    throw new AppError(409, 'EMAIL_IN_USE', 'An account already exists for this email');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
  return { token: createToken(user), user: publicUser(user) };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
  }
  return { token: createToken(user), user: publicUser(user) };
}

export function getPublicUser(user) {
  return publicUser(user);
}
