import { MediaQueriesService } from './../../../../services/media-queries.service';
import { Globals } from './../../../../utilities/globals';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wp-etl-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  @Input() state: boolean;
  constructor(public globals: Globals,
    public mdqSrv: MediaQueriesService) { }

  ngOnInit() {
  }

}
