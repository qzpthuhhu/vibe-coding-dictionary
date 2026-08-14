// EXPORTS: IFabAction, MOCK_FAB_ACTIONS

export interface IFabAction {
  id: string;
  label: string;
  icon: 'sun' | 'moon' | 'arrow-up' | 'command';
  action: 'toggleTheme' | 'scrollTop' | 'openCommandPalette';
  order: number;
}

export const MOCK_FAB_ACTIONS: IFabAction[] = [
  { id: '1', label: '切换主题', icon: 'sun', action: 'toggleTheme', order: 1 },
  { id: '2', label: '返回顶部', icon: 'arrow-up', action: 'scrollTop', order: 2 },
  { id: '3', label: '命令面板', icon: 'command', action: 'openCommandPalette', order: 3 },
];
