import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'wp-etl-message-area',
  templateUrl: './message-area.component.html',
  styleUrls: ['./message-area.component.scss']
})
  export class MessageAreaComponent implements OnInit, OnChanges {
  // isError = false;
  @Input() messages;
  messagesAsString = '';
  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.messagesAsString = '';
    if (changes.messages.currentValue && changes.messages.currentValue !== changes.messages.firstChange) {
      changes.messages.currentValue.map(ele => {
        this.messagesAsString +=  ele.msg + '         ';
      });
    }
  }

}
