import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import logger from '../utils/logger';
import { env } from '../config/env';

// Encryption method using bcrypt
// In other languages, use bcrypt with:
// - 12 rounds (cost factor)
// - salt automatically generated
// Example in other languages:
// Python: bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12))
// Node.js: bcrypt.hash(password, 12)
// PHP: password_hash($password, PASSWORD_BCRYPT, ['cost' => 12])
// Go: 
//   import "golang.org/x/crypto/bcrypt"
//   hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 12)
// Java:
//   import org.mindrot.jbcrypt.BCrypt;
//   String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(12));
// C#:
//   using BCrypt.Net;
//   string hashedPassword = BCrypt.HashPassword(password, 12);
// Ruby:
//   require 'bcrypt'
//   hashedPassword = BCrypt::Password.create(password, cost: 12)
// Rust:
//   use argon2;
//   let hashed_password = argon2::Argon2::default().hash_password(password.as_bytes(), &salt).unwrap();

async function encryptPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function updateUserPasswords() {
  try {
    // Get initial password from environment
    const initialPassword = env.INITIAL_USER_PASSWORD;
    if (!initialPassword) {
      throw new Error('INITIAL_USER_PASSWORD environment variable is not set');
    }

    // Get all users
    const users = await User.findAll();
    
    for (const user of users) {
      // Encrypt the password
      const hashedPassword = await encryptPassword(initialPassword);
      
      // Update user's password
      await user.update({ password: hashedPassword });
      
      logger.info(`Updated password for user: ${user.email}`);
    }
    
    logger.info('All user passwords have been updated successfully');
  } catch (error) {
    logger.error('Error updating user passwords:', error);
    process.exit(1);
  }
}

// Run the script
updateUserPasswords(); 