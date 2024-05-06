import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoreModule } from "../../../common/common.module";
import { AuditLogComponent } from "./components/audit-log/audit.log.component";
import { AuditLogRoutingModule } from "./audit.log.routing.module";

@NgModule({
    declarations: [
        AuditLogComponent,
    ],
    imports: [
        CommonModule,
        AuditLogRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class AuditLogModule { }
