import bcrypt from 'bcrypt';

/**
 * Hashes a password with the specified number of salt rounds.
 * 
 * @param password - The plain text password to hash.
 * @param saltRounds - The number of salt rounds (default: 10).
 * @returns A promise that resolves to the hashed password.
 * @throws An error if the hashing process fails.
 */
export async function hashPassword(password: string, saltRounds: number = 10): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error: unknown) {
    // Type assertion: tell TypeScript the error is an instance of Error
    if (error instanceof Error) {
      throw new Error(`Error hashing password: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while hashing the password');
    }
  }
}

/**
 * Compares a plain text password with its hashed counterpart.
 * 
 * @param plainPassword - The plain text password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating whether the passwords match.
 * @throws An error if the comparison process fails.
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match; // Returns true if matched, false otherwise
  } catch (error: unknown) {
    // Type assertion: tell TypeScript the error is an instance of Error
    if (error instanceof Error) {
      throw new Error(`Error comparing password: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while comparing the password');
    }
  }
}
