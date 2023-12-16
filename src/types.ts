export interface IKeyEvent {
  key: string;
  code: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  /**
   * Identify whether the key event is valid
   */
  notValid?: boolean;
}

export interface IShortcutAction {
  event: IKeyEvent;
  callback: () => void;
}

export interface IShortcutActionSet {
  actions: IShortcutAction[];
  removeListener?: () => void;
}
