
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  disabled?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const activeElement = document.activeElement;
    if (activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.getAttribute('contenteditable') === 'true'
    )) {
      return;
    }

    for (const shortcut of shortcuts) {
      if (shortcut.disabled) continue;

      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = !!shortcut.ctrlKey === (event.ctrlKey || event.metaKey);
      const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
      const altMatch = !!shortcut.altKey === event.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  const showShortcutsHelp = useCallback(() => {
    const shortcutList = shortcuts
      .filter(s => !s.disabled)
      .map(s => {
        const keys = [];
        if (s.ctrlKey) keys.push('Ctrl');
        if (s.shiftKey) keys.push('Shift');
        if (s.altKey) keys.push('Alt');
        keys.push(s.key.toUpperCase());
        return `${keys.join(' + ')}: ${s.description}`;
      })
      .join('\n');

    toast.info('Keyboard Shortcuts', {
      description: shortcutList,
      duration: 5000
    });
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { showShortcutsHelp };
};

// Common shortcuts for card workflows
export const useCardWorkflowShortcuts = (callbacks: {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  onHelp?: () => void;
  onToggleGrid?: () => void;
}) => {
  const shortcuts: ShortcutConfig[] = [
    {
      key: 'z',
      ctrlKey: true,
      action: callbacks.onUndo || (() => {}),
      description: 'Undo last action',
      disabled: !callbacks.onUndo
    },
    {
      key: 'y',
      ctrlKey: true,
      action: callbacks.onRedo || (() => {}),
      description: 'Redo last action',
      disabled: !callbacks.onRedo
    },
    {
      key: 's',
      ctrlKey: true,
      action: callbacks.onSave || (() => {}),
      description: 'Save progress',
      disabled: !callbacks.onSave
    },
    {
      key: 'Delete',
      action: callbacks.onDelete || (() => {}),
      description: 'Delete selected items',
      disabled: !callbacks.onDelete
    },
    {
      key: 'a',
      ctrlKey: true,
      action: callbacks.onSelectAll || (() => {}),
      description: 'Select all cards',
      disabled: !callbacks.onSelectAll
    },
    {
      key: '=',
      ctrlKey: true,
      action: callbacks.onZoomIn || (() => {}),
      description: 'Zoom in',
      disabled: !callbacks.onZoomIn
    },
    {
      key: '-',
      ctrlKey: true,
      action: callbacks.onZoomOut || (() => {}),
      description: 'Zoom out',
      disabled: !callbacks.onZoomOut
    },
    {
      key: '0',
      ctrlKey: true,
      action: callbacks.onResetView || (() => {}),
      description: 'Reset view',
      disabled: !callbacks.onResetView
    },
    {
      key: 'g',
      ctrlKey: true,
      action: callbacks.onToggleGrid || (() => {}),
      description: 'Toggle grid view',
      disabled: !callbacks.onToggleGrid
    },
    {
      key: '?',
      action: callbacks.onHelp || (() => {}),
      description: 'Show keyboard shortcuts',
      disabled: !callbacks.onHelp
    }
  ];

  return useKeyboardShortcuts(shortcuts);
};
