import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { User } from "../../../entity/User";

@ValidatorConstraint({ async: true })
export class IsHandleAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  validate(handle: string) {
    return User.findOne({ handle }).then((user) => {
      if (user) return false;
      return true;
    });
  }
}

export function IsHandleAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsHandleAlreadyExistConstraint,
    });
  };
}
