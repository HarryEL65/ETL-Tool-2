import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'wp-etl-user-card-details',
  templateUrl: './user-card-details.component.html',
  styleUrls: ['./user-card-details.component.scss']
})
export class UserCardDetailsComponent implements OnInit {

  @Input() loadingIndicator= false;
  @Input() selectedUser;
  @Output() isUserListLocked

  constructor() { }

  ngOnInit() {

  }

}
