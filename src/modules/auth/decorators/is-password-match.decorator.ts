import { Validate, ValidationOptions } from 'class-validator';
import { PasswordMatchValidator } from '../validators/password-match-validator';

export function IsPasswordMatch(validationOptions?: ValidationOptions) {
  return Validate(PasswordMatchValidator, validationOptions);
}
