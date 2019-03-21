import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { EventEmitter, ViewChild, ChangeDetectorRef, SimpleChanges, OnChanges, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { MediaQueriesService } from './../../../../services/media-queries.service';
import { Component, OnInit, Input, Output } from '@angular/core';
import { UserManagementService } from '../../../../services/user-management.service';

@Component({
  selector: 'wp-etl-users-mgmnt',
  templateUrl: './users-mgmnt.component.html',
  styleUrls: ['./users-mgmnt.component.scss']
})
export class UsersMgmntComponent implements OnInit , OnChanges, OnDestroy, AfterViewInit, AfterViewChecked{

  /**
   * 
   * *-------------
   * !   Variables
   * *-------------
   *  
   * @memberOf UsersMgmntComponent
   */

    selected = [];
    selection;
    selectedUser;
    selectedUserName;
    private currentComponentWidth;


    /**
   * 
   * *-----------------
   * !   Decorators    
   * *-----------------
   * @memberOf UsersMgmntComponent
   */


  @Input() usersLoadIndicator = false;
  @Input() data;
  @Output() userSelect = new EventEmitter();

  @ViewChild('tableWrapper') tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(public mdqSrv: MediaQueriesService,
              public ref: ChangeDetectorRef){

  }

                 

  ngOnInit() {

    //* Set the first jsonlike from the list
      //* to be the default selected.
      // this.selected = [this.data[0]];
      // console.log('init selection', this.selected)
      // this.defautJsonLike = (this.accntsLikeJson[0]) ? this.accntsLikeJson[0].accID : null;
      // if (typeof this.defautJsonLike === 'number') {
      //   this.JsonLikeSelect.emit(this.defautJsonLike);
      // } else if (this.defautJsonLike === null) {
      //   this.JsonLikeSelect.emit(null);
      // }
  }


  /**
   *  *--------------------
   *  ! ngAfterViewInit
   *  *--------------------
   * 
   *  This lifecycle hook method executes when the component’s view has been fully initialized.
   *  This method is initialized after Angular initializes the component’s view and child views
   *  It is called after ngAfterContentChecked().
   *  This lifecycle hook method only applies to components. 
   * 
   *  @memberOf JsonLikeListComponent
   */

  ngAfterViewInit() {

    this.table.columnMode = ColumnMode.force;

  }

  /**
   * *------------------
   * !   ngOnChanges 
   * *------------------
   * 
   *  This event executes every time when a value of an input control within the component has been changed.
   *  Actually, this event is fired first when a value of a bound property has been changed.
   *  It always receives a change data map, containing the current and previous value of the bound property wrapped
   *  in a SimpleChange.
   * 
   * @param {SimpleChanges} changes 
   * 
   * @memberOf JsonLikeListComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
      const curVal = JSON.stringify(changes['data'].currentValue);
      const prevVal = JSON.stringify(changes['data'].previousValue);
      if (curVal !== prevVal && prevVal) {
        this.selectedUser = changes['data'].currentValue[0];
        this.selectedUserName = this.selectedUser.name;
      }
    } 
  }


  /**
   * *---------------------
   * ! ngAfterViewChecked 
   * *---------------------
   * 
   *  This method is called after the ngAterViewInit() method. 
   *  It is executed every time the view of the given component has been checked 
   *  by the change detection algorithm of Angular. 
   *  This method executes after every subsequent execution of the ngAfterContentChecked(). 
   *  This method also executes when any binding of the children directives has been changed. 
   *  So this method is very useful when the component waits for some value which is coming 
   *  from its child components.
   * 
   * 
   * @memberOf JsonLikeListComponent
   */
  ngAfterViewChecked() {

    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this.ref.detectChanges();
    }

  }

  /**
   * *----------------
   * !  ngOnDestroy 
   * *----------------
   * 
   *  This method will be executed just before Angular destroys the components.
   *  This method is very useful for unsubscribing from the observables and detaching 
   *  the event handlers to avoid memory leaks. Actually, it is called just before the instance 
   *  of the component is finally destroyed. 
   *  This method is called just before the component is removed from the DOM.
   * 
   * 
   * @memberOf JsonLikeListComponent
   */
  ngOnDestroy(): void {
    // this.addAccountService.getJsonLikeList.unsubscribe();
  }


  /**
   * *--------------
   * !  onSelect
   * *--------------
   * 
   * @param {any} { selected } 
   * 
   * @memberOf UsersMgmntComponent
   */
  onSelect({ selected }) {

    this.selected = [...selected];
    this.selection = [...selected][0].name;
    // console.log('selected', this.selected);
    // this.userSelect.emit(this.selected);
    // this.selectedUser = this.selected;
    this.selectedUser = this.selected;
    this.selectedUserName = this.selection;
  }

  /**
   * *----------------------------
   * ! displaySelectedUser
   * *----------------------------
   * 
   * @param {any} name 
   * 
   * @memberOf JsonLikeListComponent
   */
  displaySelectedUser(name) {

    // if (name) {
    //   this.userSelect.emit(name);
    // }
    // console.log('displaySelectedUser', name)
  }

   removeUser(event, row) {
      // alert('remove-user')
      console.log('row', row)
   }

   editUser(event, row) {
      // alert('edit-user')
      console.log('row', row)
   }

}
