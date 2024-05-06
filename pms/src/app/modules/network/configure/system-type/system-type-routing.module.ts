import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ROUTES } from "@constants/routes";
import { SystemTypeComponent } from "./components/system-type/system.type.component";
import { AddSystemTypeComponent } from "./components/add-system-type/add.system.type.component";

const routes: Routes = [
    {
        path: '',
        component: SystemTypeComponent,
        data: { pageId: Pages.NetworkSystemType, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddSystemTypeComponent,
        data: { pageId: Pages.NetworkSystemType, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddSystemTypeComponent,
        data: { pageId: Pages.NetworkSystemType, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemTypeRoutingModule { }
