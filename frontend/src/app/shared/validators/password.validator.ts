import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateur personnalisé pour la force du mot de passe.
 * Le mot de passe doit faire exactement 12 caractères et contenir :
 * - au moins une lettre majuscule
 * - au moins une lettre minuscule
 * - au moins un chiffre
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasDigit = /[0-9]/.test(value);
    const hasExactLength = value.length === 12;

    const isValid = hasUppercase && hasLowercase && hasDigit && hasExactLength;

    if (isValid) {
      return null;
    }

    return {
      passwordStrength: {
        requiredLength: 12,
        actualLength: value.length,
        missingUppercase: !hasUppercase,
        missingLowercase: !hasLowercase,
        missingDigit: !hasDigit,
        invalidLength: !hasExactLength
      }
    };
  };
}
