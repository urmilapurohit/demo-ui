import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ROUTES } from "@constants/routes";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ProjectRoleComponent } from "./components/project-role/project.role.component";
import { AddProjectRoleComponent } from "./components/add-project-role/add.project.role.component";

const routes: Routes = [
    {
        path: '',
        component: ProjectRoleComponent,
        data: { pageId: Pages.ProjectRole, permission: [PageAccessTypes.View] },
      },
      {
        path: ROUTES.COMMON.ADD,
        component: AddProjectRoleComponent,
        data: { pageId: Pages.ProjectRole, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
      },
      {
        path: ROUTES.COMMON.EDIT,
        component: AddProjectRoleComponent,
        data: { pageId: Pages.ProjectRole, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoleRoutingModule { }
