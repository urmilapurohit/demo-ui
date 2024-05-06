import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';
import { EmailTemplateComponent } from './components/email-template/email.template.component';
import { EditEmailTemplateComponent } from './components/edit-email-template/edit.email.template.component';
import { PreviewEmailTemplateComponent } from './components/preview-email-template/preview.email.template.component';

const routes: Routes = [
  {
    path: '',
    component: EmailTemplateComponent,
    data: { pageId: Pages.EmailTemplate, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.COMMON.EDIT,
    component: EditEmailTemplateComponent,
    data: { pageId: Pages.EmailTemplate, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  },
  {
    path: ROUTES.COMMON.PREVIEW,
    component: PreviewEmailTemplateComponent,
    data: { pageId: Pages.EmailTemplate, permission: [PageAccessTypes.View] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailTemplateRoutingModule { }
