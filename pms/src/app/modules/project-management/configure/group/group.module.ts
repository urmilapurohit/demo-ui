import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { AddGroupComponent } from "./components/add-group/add.group.component";
import { GroupComponent } from "./components/group/group.component";
import { GroupRoutingModule } from "./group-routing.module";
import { CoreModule } from "../../../../common/common.module";

@NgModule({
    declarations: [
        GroupComponent,
        AddGroupComponent
    ],
    imports: [
        CommonModule,
        GroupRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})
export class GroupModule { }
