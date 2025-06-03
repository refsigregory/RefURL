import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import logger from '../utils/logger';

async function updateUserPasswords() {
  try {
    // Get all users
    const users = await User.findAll();
    
    for (const user of users) {
      // Generate a new password (you can modify this to use a specific password)
      const newPassword = 'admin123'; // Change this to your desired password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
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