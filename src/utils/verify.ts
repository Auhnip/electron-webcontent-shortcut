import { KeyCodesReg, ModifiersReg } from '../constants';

/**
 * Checks whether a given string is a valid representation of a keyboard accelerator.
 * A valid accelerator should consist of any number of modifier keys followed by a regular key.
 * @param {string} input The string representing a potential keyboard accelerator.
 * @returns {boolean} Whether the string is a valid keyboard accelerator expression.
 */
export const isAccelerator = (input: string): boolean => {
  let parts = input.split('+');

  // Counter to track the number of regular keys found in the accelerator.
  let keyFound = 0;

  // Check if every part of the accelerator is either a valid key code or a modifier.
  const everyKeyIsValid = parts.every(val => {
    const isKey = KeyCodesReg.test(val);
    const isModifier = ModifiersReg.test(val);

    if (isKey) {
      keyFound += 1;
    }

    return isKey || isModifier;
  });

  // The accelerator is valid if every part is valid and there is exactly one regular key.
  return everyKeyIsValid && keyFound === 1;
};
