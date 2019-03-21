import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'wp-etl-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  {
    // TODO: change input to receive a Modal model {title, button texts etc...}
    @Input() modalObj: any;

    @Input() title = 'default title';
    @Input() aff_name = 'default aff name';
    @Input() cancel_btn = 'Cancel';
    @Input() ok_btn = 'OK';

    @ViewChild('content') private content;
    @Output() save: EventEmitter<any> = new EventEmitter();
    closeResult: string;

    constructor(private modalService: NgbModal) {}

    // Allows a parent component access the open modal function
    openModal() {
        // console.log('In myOpen function');
        this.open(this.content);
    }

    open(content) {
      const ngbModalOptions: NgbModalOptions = {
        backdrop : 'static',
        keyboard : false,
        windowClass: 'basic-modal'
  };
        this.modalService.open(content, ngbModalOptions).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return  `with: ${reason}`;
        }
      }

    // Click function to allow access from the modal to invoke a function in the parent component
    myClick() {
        this.save.emit('message sent from the modal component');
    }
}
