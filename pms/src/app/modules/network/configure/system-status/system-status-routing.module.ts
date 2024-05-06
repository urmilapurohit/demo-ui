import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Pages, PageAccessTypes } from "@constants/Enums";
import { ROUTES } from "@constants/routes";
import { SystemStatusComponent } from "./components/system-status/system.status.component";
import { AddSystemStatusComponent } from "./components/add-system-status/add.system.status.component";

const routes: Routes = [
    {
        path: '',
        component: SystemStatusComponent,
        data: { pageId: Pages.SystemStatus, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddSystemStatusComponent,
        data: { pageId: Pages.SystemStatus, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddSystemStatusComponent,
        data: { pageId: Pages.SystemStatus, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SystemStatusRoutingModule { }
