import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkspaceLibraryModule } from 'workspace-library';
import { InquiryRoutingModule } from './inquiry-routing.module';
import { InquiryComponent } from './components/inquiry/inquiry.component';
import { AddInquiryComponent } from './components/add-inquiry/add.inquiry.component';
import { CoreModule } from '../../../common/common.module';
import { HistoryComponent } from './components/history/history.component';

@NgModule({
  declarations: [
    InquiryComponent,
    AddInquiryComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    InquiryRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})
export class InquiryModule { }
