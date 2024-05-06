import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { InquiryComponent } from './components/inquiry/inquiry.component';
import { AddInquiryComponent } from './components/add-inquiry/add.inquiry.component';
import { HistoryComponent } from './components/history/history.component';

const routes: Routes = [
  {
    path: '',
    component: InquiryComponent,
    data: { pageId: Pages.PreSalesInquiry, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.COMMON.ADD,
    component: AddInquiryComponent,
    data: { pageId: Pages.PreSalesInquiry, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
  },
  {
    path: ROUTES.COMMON.EDIT,
    component: AddInquiryComponent,
    data: { pageId: Pages.PreSalesInquiry, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  },
  {
    path: ROUTES.PRE_SALES.INQUIRY.HISTORY,
    component: HistoryComponent,
    data: { pageId: Pages.PreSalesInquiry, permission: [PageAccessTypes.View] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InquiryRoutingModule { }
