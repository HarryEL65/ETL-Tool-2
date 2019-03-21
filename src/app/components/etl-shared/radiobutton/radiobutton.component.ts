import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TruncateModule } from 'ng2-truncate';


@Component({
  selector: 'wp-etl-radiobutton',
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.scss']
})
export class RadiobuttonComponent implements OnInit{

  // defaultSelection = 0;
  jsonSelection = 0;
  @Input() mdqSrv;
  @Input() text;
  @Input() name;
  @Input() value;

  // defining 2 way data binding on the selection attribute
  @Input()
  get selection() {
    return this.jsonSelection;
  }
  @Output() selectionChange = new EventEmitter();
  set selection(value) {
    this.jsonSelection = value;
    this.selectionChange.emit(this.jsonSelection);
  }

  @Output() change = new EventEmitter();

  ngOnInit() {
    // if (this.value === this.jsonSelection) {
    //  this.change.emit(this.jsonSelection); // simulate programtticaly the selection of the first json like;
    // }
  }

  onRadioBtnChange($event, value) {
    if (value !== this.jsonSelection) {
      this.selection = value;
      this.change.emit(value);
    }
  }

}
