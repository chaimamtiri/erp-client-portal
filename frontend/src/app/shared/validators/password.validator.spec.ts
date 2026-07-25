import { FormControl } from '@angular/forms';
import { passwordStrengthValidator } from './password.validator';
import { describe, it, expect } from 'vitest';

describe('passwordStrengthValidator', () => {
  const validator = passwordStrengthValidator();

  it('should validate exactly 12 characters', () => {
    const controlShort = new FormControl('Ab1');
    const controlLong = new FormControl('Ab12345678901');
    const controlExact = new FormControl('Ab1234567890'); // 12 chars

    expect(validator(controlShort)).toEqual(expect.objectContaining({
      passwordStrength: expect.objectContaining({ invalidLength: true })
    }));
    expect(validator(controlLong)).toEqual(expect.objectContaining({
      passwordStrength: expect.objectContaining({ invalidLength: true })
    }));
    expect(validator(controlExact)).toBeNull();
  });

  it('should require at least one uppercase letter', () => {
    const controlNoUpper = new FormControl('ab1234567890');
    const controlWithUpper = new FormControl('Ab1234567890');

    expect(validator(controlNoUpper)).toEqual(expect.objectContaining({
      passwordStrength: expect.objectContaining({ missingUppercase: true })
    }));
    expect(validator(controlWithUpper)).toBeNull();
  });

  it('should require at least one lowercase letter', () => {
    const controlNoLower = new FormControl('AB1234567890');
    const controlWithLower = new FormControl('Ab1234567890');

    expect(validator(controlNoLower)).toEqual(expect.objectContaining({
      passwordStrength: expect.objectContaining({ missingLowercase: true })
    }));
    expect(validator(controlWithLower)).toBeNull();
  });

  it('should require at least one digit', () => {
    const controlNoDigit = new FormControl('Abcdefghijkl');
    const controlWithDigit = new FormControl('Abcdefghijk1');

    expect(validator(controlNoDigit)).toEqual(expect.objectContaining({
      passwordStrength: expect.objectContaining({ missingDigit: true })
    }));
    expect(validator(controlWithDigit)).toBeNull();
  });
});
