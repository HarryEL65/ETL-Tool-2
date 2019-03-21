import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal.component';
import { JsonLikeViewComponent } from '../../json-like-view/json-like-view.component';
import { Globals } from '../../../../utilities/globals';


@Component({
  selector: 'wp-etl-modal-config',
  templateUrl: './modal-config.component.html',
  styleUrls: ['./modal-config.component.scss']
})
export class ModalConfigComponent extends ModalComponent {
  globalData;

  @Input() mdqSrv;
  @Input() title;
  @Input() data;
  @Input() accountId;
  @Input() recordType;
  @ViewChild('modalConfig') private modalConfig;


  // Allows a parent component access the open modal function
  openModal() {
      this.globalData = {};
      this.globalData.accName = this.title;
      this.globalData.recordType = this.recordType;
      this.globalData.accID = this.accountId;

    // console.log('1-----> ',this.data)
      // this.data.accName = this.title;
      // this.data.recordType = this.recordType;
      // this.data.accID = this.accountId;
      // console.log('2-----> ',this.data)
      this.open(this.modalConfig);
  }

}
