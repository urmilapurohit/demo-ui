import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';
import { MemberRoleComponent } from './component/member-role/member.role.component';
import { AddMemberRoleComponent } from './component/add-member-role/add.member.role.component';

const routes: Routes = [
  {
    path: '',
    component: MemberRoleComponent,
    data: { pageId: Pages.PreSalesMemberRole, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.COMMON.ADD,
    component: AddMemberRoleComponent,
    data: { pageId: Pages.PreSalesMemberRole, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
  },
  {
    path: ROUTES.COMMON.EDIT,
    component: AddMemberRoleComponent,
    data: { pageId: Pages.PreSalesMemberRole, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoleRoutingModule { }
