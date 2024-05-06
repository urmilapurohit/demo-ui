import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { AuditLogComponent } from "./components/audit-log/audit.log.component";

const routes: Routes = [
    {
        path: '',
        component: AuditLogComponent,
        data: { pageId: Pages.AdminAuditLog, permission: [PageAccessTypes.View] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuditLogRoutingModule { }
