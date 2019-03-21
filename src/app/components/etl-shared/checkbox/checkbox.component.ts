import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wp-etl-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input() name;
  @Input() data;
  @Input() isChecked;
  @Input() text;
  @Input() isSubmitted;

  @Output() inputChange = new EventEmitter();


  inputValue;

  constructor() {
    // initialize the checkbox with a default value or predifine value;
    !this.isChecked ? this.inputValue = false : this.inputValue = this.isChecked;
  }

  ngOnInit() {
  }

  onCheckboxChange(event) {
    // this.inputValue = !this.inputValue;
    this.inputChange.emit(this.inputValue);
  }

}
