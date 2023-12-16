import { isAccelerator } from '.';
import { KeyCodesReg, ModifiersReg, IsMac, KeyToCodeMap } from '../constants';
import { IKeyEvent } from '../types';

const createDefaultKeyEvent = (event?: Partial<IKeyEvent>): IKeyEvent => {
  return Object.assign(
    {
      key: '',
      code: '',
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    },
    event
  );
};

const extractKeyCode = (event: IKeyEvent, key: string): IKeyEvent => {
  if (event.key || event.code) {
    throw new Error(`Duplicated keycode \`${key}\`.`);
  }
  let code: string = '';

  if (key in KeyToCodeMap) {
    code = KeyToCodeMap[key as keyof typeof KeyToCodeMap];
  }
  return { ...event, key, code };
};

const extractModifier = (event: IKeyEvent, modifier: string): IKeyEvent => {
  switch (modifier) {
    case 'command':
    case 'cmd': {
      if (!IsMac) {
        throw new Error("The platform isn't support Command Key");
      }
      if (event.metaKey) {
        throw new Error('Double `Command` modifier specified');
      }
      return { ...event, metaKey: true };
    }
    case 'super': {
      if (event.metaKey) {
        throw new Error('Double `Super` modifier specified');
      }
      return { ...event, metaKey: true };
    }
    case 'control':
    case 'ctrl': {
      if (event.ctrlKey) {
        throw new Error('Double `Control` modifier specified.');
      }
      return { ...event, ctrlKey: true };
    }
    case 'commandorcontrol':
    case 'cmdorctrl': {
      if (IsMac) {
        if (event.metaKey) {
          throw new Error('Double `Command` modifier specified.');
        }
        return { ...event, metaKey: true };
      } else {
        if (event.ctrlKey) {
          throw new Error('Double `Control` modifier specified.');
        }
        return { ...event, ctrlKey: true };
      }
    }
    case 'option':
    case 'altgr':
    case 'alt': {
      if (modifier === 'option' && !IsMac) {
        throw new Error('The Option Key is not supported by this platform');
      }
      if (event.altKey) {
        throw new Error('Double `Alt` modifier specified.');
      }
      return { ...event, altKey: true };
    }
    case 'shift': {
      if (event.shiftKey) {
        throw new Error('Double `Shift` modifier specified.');
      }
      return { ...event, shiftKey: true };
    }
    default:
      console.error(modifier);
      return { ...event };
  }
};

/**
 * Converts an accelerator string to a corresponding IKeyEvent object.
 * @param {string} accelerator - The accelerator string to be converted.
 * @returns {IKeyEvent} - The resulting IKeyEvent object.
 */
export const acceleratorToKeyEvent = (accelerator: string): IKeyEvent => {
  let event = createDefaultKeyEvent();
  // check if accelerator is valid
  if (!isAccelerator(accelerator)) {
    event.notValid = true;
    return event;
  }

  // extract every key from accelerator
  const parts = accelerator.split('+');
  for (const part of parts) {
    if (KeyCodesReg.test(part)) {
      // is simple key
      const key = part.toLowerCase();
      event = extractKeyCode(event, key);
    } else if (ModifiersReg.test(part)) {
      // is modifiers
      const modifier = part.toLowerCase();
      event = extractModifier(event, modifier);
    } else {
      // not a valid key
      throw new Error(`Unvalid key in accelerator: "${part}"`);
    }
  }
  return event;
};

/**
 * Converts the input captured in the before-input-event event to a standard Key Event.
 * @param {Electron.Input} input The input event captured in before-input-event.
 * @returns {IKeyEvent} The corresponding Key Event object.
 */
export const inputToKeyEvent = (input: Electron.Input): IKeyEvent => {
  const event = createDefaultKeyEvent({
    code: input.code,
    key: input.key.toLowerCase(),
  });

  (['alt', 'shift', 'meta'] as const).forEach(prop => {
    if (typeof input[prop] !== 'undefined') {
      event[`${prop}Key`] = input[prop];
    }
  });

  if (typeof input.control !== 'undefined') {
    event.ctrlKey = input.control;
  }

  return event;
};

/**
 * Determines if two objects satisfying the IKeyEvent interface are equal.
 * @param {IKeyEvent} event1 The first IKeyEvent object.
 * @param {IKeyEvent} event2 The second IKeyEvent object.
 * @returns {boolean} True if the two objects are equal, false otherwise.
 */
export const areKeyEventsEqual = (
  event1: IKeyEvent,
  event2: IKeyEvent
): boolean => {
  const properties: (keyof IKeyEvent)[] = [
    'key',
    'code',
    'altKey',
    'ctrlKey',
    'metaKey',
    'shiftKey',
  ];

  const areKeyPropertiesEqual = properties.every(
    property => event1[property] === event2[property]
  );

  const areNotValidPropertiesEqual =
    (typeof event1.notValid === 'undefined' &&
      typeof event2.notValid === 'undefined') ||
    event1.notValid === event2.notValid;

  return areKeyPropertiesEqual && areNotValidPropertiesEqual;
};
