import { MediaQueriesService } from './../../../../services/media-queries.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wp-etl-roles-mgmnt',
  templateUrl: './roles-mgmnt.component.html',
  styleUrls: ['./roles-mgmnt.component.scss']
})
export class RolesMgmntComponent implements OnInit {

  @Input() rolesLoadIndicator = false;
  @Input() data;

  constructor(public mdqSrv: MediaQueriesService){

  }

  ngOnInit() {
  }

}
