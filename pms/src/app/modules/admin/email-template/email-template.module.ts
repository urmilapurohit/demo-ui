import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkspaceLibraryModule } from 'workspace-library';
import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { EditEmailTemplateComponent } from './components/edit-email-template/edit.email.template.component';
import { EmailTemplateComponent } from './components/email-template/email.template.component';
import { PreviewEmailTemplateComponent } from './components/preview-email-template/preview.email.template.component';
import { CoreModule } from '../../../common/common.module';

@NgModule({
  declarations: [
    EmailTemplateComponent,
    EditEmailTemplateComponent,
    PreviewEmailTemplateComponent,
  ],
  imports: [
    CommonModule,
    EmailTemplateRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})
export class EmailTemplateModule { }
