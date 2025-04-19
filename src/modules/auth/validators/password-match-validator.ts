import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SignUpDto } from '../dtos/sign-up-dto';

@ValidatorConstraint({ name: 'passwordMatchValidator', async: false })
export class PasswordMatchValidator implements ValidatorConstraintInterface {
  validate(value: string, validationArguments: ValidationArguments): boolean {
    const object = validationArguments.object as SignUpDto;
    return value === object.password;
  }

  defaultMessage(): string {
    return `passwords do not match`;
  }
}
