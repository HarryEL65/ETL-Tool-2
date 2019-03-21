import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'wp-etl-downtime-overlay',
  templateUrl: './downtime-overlay.component.html',
  styleUrls: ['./downtime-overlay.component.scss']
})
export class DowntimeOverlayComponent implements OnInit, OnChanges {

  @Input() messages;
  messagesAsString = '';
  isError = false;
  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.messagesAsString = '';
    if (changes.messages.currentValue && changes.messages.currentValue !== changes.messages.firstChange) {
      changes.messages.currentValue.map(ele => {
        this.messagesAsString +=  ele.msg + '         ';
      });
      this.messagesAsString.length > 0 ? this.isError = true : this.isError = false;
    }
  }

  // openOverlay(e) {
  //   // e.stopPropagation();
  //   // e.preventDefault();
  //   // const overlayEle = document.getElementById('app-overlay');
  //   this.isError = false;
  // }
  // closeOverlay(e) {
  //   // e.stopPropagation();
  //   // e.preventDefault();
  //   // const overlayEle = document.getElementById('app-overlay');
  //   this.isError = true;

  // }

}
