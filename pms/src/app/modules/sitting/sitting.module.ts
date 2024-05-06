import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SittingRoutingModule } from './sitting-routing.module';
import { CoreModule } from '../../common/common.module';
import { ArrangementComponent } from './arrangement/components/arrangement/arrangement.component';

@NgModule({
  declarations: [
    ArrangementComponent
  ],
  imports: [
    CommonModule,
    SittingRoutingModule,
    CoreModule
  ]
})
export class SittingModule { }
