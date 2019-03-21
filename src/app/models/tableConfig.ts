export interface Column {

  // title:          string;
  name:           string;
  prop:           string;
  isTitleVisible: boolean;
  colClass:       string;
  type:           string;
  // width:          number;
  minWidth:       number;
  maxWidth:       number;
  resizeable:     boolean;
  isSortable:     boolean;
  isDisabled:     boolean;
  tooltip:        string;
  cellTemplate?:  string;

}

export interface Sort {
    prop: string;
    dir: string;
}
export interface Table {

  title:          string;
  columns:        Column[];
  // sorts:          Sort[];

}
