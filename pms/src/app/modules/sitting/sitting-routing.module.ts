import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArrangementComponent } from './arrangement/components/arrangement/arrangement.component';

const routes: Routes = [
  {
    path: 'sitting-arrangement',
    component: ArrangementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SittingRoutingModule { }
