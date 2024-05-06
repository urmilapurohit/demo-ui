import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ROUTES } from "@constants/routes";
import { DepartmentComponent } from "./components/department/department.component";
import { AddDepartmentComponent } from "./components/add-department/add.department.component";

const routes: Routes = [
    {
        path: '',
        component: DepartmentComponent,
        data: { pageId: Pages.Department, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddDepartmentComponent,
        data: { pageId: Pages.Department, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddDepartmentComponent,
        data: { pageId: Pages.Department, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepartmentRoutingModule { }
