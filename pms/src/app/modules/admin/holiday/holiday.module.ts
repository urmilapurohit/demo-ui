import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ReactiveFormsModule } from '@angular/forms';
import { HolidayRoutingModule } from './holiday-routing.module';
import { AddPublicHolidayComponent } from './components/holiday/add-public-holiday/add.public.holiday.component';
import { HolidayComponent } from './components/holiday/holiday.component';
import { CoreModule } from '../../../common/common.module';
import { AddWeekoffComponent } from './components/holiday/add-weekoff/add.weekoff.component';

@NgModule({
  declarations: [
    AddPublicHolidayComponent,
    AddWeekoffComponent,
    HolidayComponent
  ],
  imports: [
    CommonModule,
    HolidayRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})
export class HolidayModule { }
