import * as bcrypt from 'bcrypt';

export class BrcyptHelper {
  private static async generateSalt(rounds: number): Promise<string> {
    return bcrypt.genSalt(rounds);
  }

  /**
   * Hashes a raw password using bcrypt with a generated salt.
   *
   * This function generates a salt and hashes the provided raw password using bcrypt.
   *
   * @param {string} raw - The plain text password to be hashed.
   * @returns {Promise<string>} - A promise that resolves to the hashed password.
   * @example
   * // Result = $2b$10$gtPt7eX4m4WLOU4bbUizuO1cjibNdVmKOhaXurcXFOxnc./Qf4AbG
   * hash(asdqwe123)
   */
  static async hash(raw: string): Promise<string> {
    const salt = await this.generateSalt(10);
    return bcrypt.hash(raw, salt);
  }

  /**
   * Compares a raw password with a hashed password to check if they match.
   *
   * This function uses bcrypt to compare the raw password with the hashed password.
   *
   * @param {string} rawPassword - The plain text password to compare.
   * @param {string} password - The hashed password to compare against.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the passwords match, `false` otherwise.
   */
  static async compare(
    rawPassword: string,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(rawPassword, password);
  }
}
