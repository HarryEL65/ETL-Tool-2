import { Component, OnInit, ViewChild } from '@angular/core';

import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { animateSnackBarStateTrigger } from './snackbar.animation';


@Component({
  selector: 'wp-etl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [animateSnackBarStateTrigger]
})
export class AppComponent implements OnInit {
  title = 'wp-etl';

  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  // constructor(private snackbarService: SnackbarService) {}
  constructor(private toastr: ToastrService) {}

  ngOnInit() {
    // this.toastr.overlayContainer = this.toastContainer;
    //  setTimeout( () =>  {

    //   // this.toastr.success('Welcome to the ETL Tool!!! :-)');
    //   //  this.toastr.warning('Pay attention!!!...this is just a warning. :-)');
    //   //  this.toastr.error('OMG!!!...Sorry try again. :-(');
    //   //  this.toastr.info('Did you know? ...Your doing well. :-(');

    // }, 5000 );
  }
}
