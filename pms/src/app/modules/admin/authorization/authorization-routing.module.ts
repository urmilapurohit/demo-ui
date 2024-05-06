import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { DesignationWiseComponent } from './designation-wise/components/designation-wise/designation.wise.component';
import { MemberWiseComponent } from './member-wise/components/member-wise/member.wise.component';

const routes: Routes = [
  {
    path: ROUTES.ADMIN.AUTHORIZE.DESIGNATION_WISE.DESIGNATION_WISE,
    component: DesignationWiseComponent,
    data: { pageId: Pages.AuthorizationByDesignation, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.AUTHORIZE.MEMBER_WISE.MEMBER_WISE,
    component: MemberWiseComponent,
    data: { pageId: Pages.AuthorizationByMember, permission: [PageAccessTypes.View] },
  },
  { path: '', redirectTo: ROUTES.ADMIN.AUTHORIZE.DESIGNATION_WISE.DESIGNATION_WISE, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorizationRoutingModule { }
