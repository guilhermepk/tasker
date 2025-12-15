import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'isID', async: false })
export class IsIDConstraint implements ValidatorConstraintInterface {
  isValid(val: any) {
    const num = Number(val);
    return Number.isInteger(num) && num > 0;
  }

  validate(value: any) {
    if (value === undefined || value === null) {
      return true;
    }

    if (Array.isArray(value)) {
      return value.every(this.isValid);
    }

    return this.isValid(value);
  }

  defaultMessage(args: ValidationArguments) {
    const { value } = args;

    if (Array.isArray(value)) {
      const msgs = value
        .map((value, index) =>
          this.isValid(value)
            ? null
            : `Índice [${index}] deveria ser um número inteiro positivo`,
        )
        .filter(Boolean);

      return msgs.join('; ');
    }

    return `'${args.property}' deve ser um número inteiro positivo`;
  }
}


export function IsID(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIDConstraint,
    });
  };
}