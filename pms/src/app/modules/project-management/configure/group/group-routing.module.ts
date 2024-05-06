import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ROUTES } from "@constants/routes";
import { GroupComponent } from "./components/group/group.component";
import { AddGroupComponent } from "./components/add-group/add.group.component";

const routes: Routes = [
    {
        path: '',
        component: GroupComponent,
        data: { pageId: Pages.ProjectGroup, permission: [PageAccessTypes.View] },
      },
      {
        path: ROUTES.COMMON.ADD,
        component: AddGroupComponent,
        data: { pageId: Pages.ProjectGroup, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
      },
      {
        path: ROUTES.COMMON.EDIT,
        component: AddGroupComponent,
        data: { pageId: Pages.ProjectGroup, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GroupRoutingModule { }
