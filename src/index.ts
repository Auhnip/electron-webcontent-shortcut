import type { WebContents } from 'electron';
import _debug from 'debug';
import type { IShortcutActionSet } from './types';
import {
  acceleratorToKeyEvent,
  areKeyEventsEqual,
  inputToKeyEvent,
  isAccelerator,
} from './utils';

const debug = _debug('electron-webcontents-localshortcut');

const webContentsToShortcut = new WeakMap<WebContents, IShortcutActionSet>();

const title = (webContents: WebContents) => {
  if (webContents) {
    try {
      return webContents.getTitle();
    } catch (error) {
      return 'A destroyed window';
    }
  }
  return 'An falsy value';
};

const unregisterAll = (webContents: WebContents): void => {
  debug(`Unregistering all shortcuts on webContents ${title(webContents)}`);
  const shortcutsOfWebContents = webContentsToShortcut.get(webContents);
  if (shortcutsOfWebContents && shortcutsOfWebContents.removeListener) {
    // Remove listener from window
    shortcutsOfWebContents.removeListener();
    webContentsToShortcut.delete(webContents);
  }
};

const beforeInputHandlerCreator =
  (shortcutsOfWebContents: IShortcutActionSet) =>
  (_e: Electron.Event, input: Electron.Input) => {
    if (input.type === 'keyUp') {
      return;
    }

    const eventFromInput = inputToKeyEvent(input);

    debug(
      `before-input-event: ${JSON.stringify(
        input
      )} is translated to: ${JSON.stringify(eventFromInput)}`
    );

    for (const { event, callback } of shortcutsOfWebContents.actions) {
      if (areKeyEventsEqual(eventFromInput, event)) {
        debug(`event: ${JSON.stringify(event)} match`);
        callback();
        return;
      }

      debug(`event: ${JSON.stringify(event)} no match`);
    }
  };

const register = (
  webContents: WebContents,
  accelerator: string | string[],
  callback: () => void
) => {
  if (Array.isArray(accelerator) === true) {
    accelerator.forEach(accelerator => {
      if (typeof accelerator === 'string') {
        register(webContents, accelerator, callback);
      }
    });
    return;
  }

  debug(
    `Registering callback for ${accelerator} on webcontents ${title(
      webContents
    )}`
  );

  if (!isAccelerator(accelerator)) {
    throw new Error(`${accelerator} is not a valid shortcut sequence`);
  }

  let shortcutsOfWebContents: IShortcutActionSet | undefined = void 0;

  if (webContentsToShortcut.has(webContents)) {
    debug(
      `this webcontents ${title(webContents)} has others shortcuts registered`
    );
    shortcutsOfWebContents = webContentsToShortcut.get(webContents)!;
  } else {
    debug('This is the first shortcut of the webcontents');
    shortcutsOfWebContents = { actions: [] };
    webContentsToShortcut.set(webContents, shortcutsOfWebContents);

    const beforeInputHandler = beforeInputHandlerCreator(
      shortcutsOfWebContents
    );
    webContents.on('before-input-event', beforeInputHandler);

    shortcutsOfWebContents.removeListener = () => {
      webContents.removeListener('before-input-event', beforeInputHandler);
    };
    webContents.once('destroyed', shortcutsOfWebContents.removeListener);
  }

  debug('Adding shortcut to webcontents set');

  const event = acceleratorToKeyEvent(accelerator);

  shortcutsOfWebContents.actions.push({
    event,
    callback,
  });

  debug('Shortcut registered');
};

const unregister = (
  webContents: WebContents,
  accelerator: string | string[]
): void => {
  if (webContents.isDestroyed()) {
    return;
  }

  if (Array.isArray(accelerator) === true) {
    accelerator.forEach(accelerator => {
      if (typeof accelerator === 'string') {
        unregister(webContents, accelerator);
      }
    });
    return;
  }

  debug(
    `Unregistering callback for ${accelerator} on webcontents ${title(
      webContents
    )}`
  );

  if (!isAccelerator(accelerator)) {
    throw new Error(`${accelerator} is not a valid shortcut sequence`);
  }

  if (!webContentsToShortcut.has(webContents)) {
    debug(
      'Early return because webcontents has never had shortcuts registered.'
    );
    return;
  }

  const shortcutsOfWebContents = webContentsToShortcut.get(webContents)!;

  const event = acceleratorToKeyEvent(accelerator);
  const shortcutIdx = shortcutsOfWebContents.actions.findIndex(action =>
    areKeyEventsEqual(action.event, event)
  );
  if (shortcutIdx === -1) {
    return;
  }

  shortcutsOfWebContents.actions.splice(shortcutIdx, 1);

  if (shortcutsOfWebContents.actions.length === 0) {
    shortcutsOfWebContents.removeListener?.();
    webContentsToShortcut.delete(webContents);
  }
};

function isRegistered(webContents: WebContents, accelerator: string): boolean {
  if (!isAccelerator(accelerator)) {
    throw new Error(`${accelerator} is not a valid shortcut sequence`);
  }
  const shortcutsOfWebContents = webContentsToShortcut.get(webContents);
  const event = acceleratorToKeyEvent(accelerator);

  return (
    !!shortcutsOfWebContents?.actions &&
    shortcutsOfWebContents.actions.findIndex(action =>
      areKeyEventsEqual(action.event, event)
    ) !== -1
  );
}

export { register, unregister, isRegistered, unregisterAll, isAccelerator };
