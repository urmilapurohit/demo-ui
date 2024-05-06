import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';

const routes: Routes = [
  {
    path: ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.TECHNOLOGY,
    loadChildren: () => import('./configure/technology/technology.module').then((m) => m.TechnologyModule),
    data: { pageId: Pages.PreSalesTechnology, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.PRE_SALES.CONFIGURATION.STATUS.STATUS,
    loadChildren: () => import('./configure/status/status.module').then((m) => m.StatusModule),
    data: { pageId: Pages.PreSalesStatus, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.MEMBER_ROLE,
    loadChildren: () => import('./configure/member-role/member-role.module').then((m) => m.MemberRoleModule),
    data: { pageId: Pages.PreSalesMemberRole, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.PRE_SALES.INQUIRY.INQUIRY,
    loadChildren: () => import('./inquiry/inquiry.module').then((m) => m.InquiryModule),
    data: { pageId: Pages.PreSalesInquiry, permission: [PageAccessTypes.View] }
  },
  { path: '', redirectTo: ROUTES.PRE_SALES.INQUIRY.INQUIRY, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresalesRoutingModule { }
