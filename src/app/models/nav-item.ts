export interface NavItem {
  path?: string;
  title: string;
  iconName?: string;
  disabled?: boolean;
  hasChildren: boolean;
  childrens?: NavItem[];
  level?: number;
}
