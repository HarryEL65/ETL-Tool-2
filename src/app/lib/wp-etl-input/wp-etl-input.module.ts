import { InputRefDirective } from './../common/input-ref.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';

@NgModule({
  declarations: [InputComponent,
                 InputRefDirective],
  imports: [
    CommonModule
  ],
  exports: [InputComponent, InputRefDirective]
  
})
export class WpEtlInputModule { }
