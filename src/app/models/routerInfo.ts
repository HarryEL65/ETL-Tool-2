import { Observable } from 'rxjs/Observable';
export interface RouteInfo {
  path: string;
  id: string;
  title: string;
  icon: string;
  class: string;
  parent?: string;
  // isDisplayed: Observable<boolean>;
  isDisplayed: any;
  hasChildren: boolean;
  childrens?: RouteInfo[];
}
