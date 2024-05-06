import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ROUTES } from "@constants/routes";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { DesignationComponent } from "./components/designation/designation.component";
import { AddDesignationComponent } from "./components/add-designation/add.designation.component";

const routes: Routes = [
    {
        path: '',
        component: DesignationComponent,
        data: { pageId: Pages.Designation, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddDesignationComponent,
        data: { pageId: Pages.Designation, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddDesignationComponent,
        data: { pageId: Pages.Designation, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DesignationRoutingModule { }
