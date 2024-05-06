import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { CoreModule } from "../../../../common/common.module";
import { AddProjectRoleComponent } from "./components/add-project-role/add.project.role.component";
import { ProjectRoleComponent } from "./components/project-role/project.role.component";
import { ProjectRoleRoutingModule } from "./project-role-routing.module";

@NgModule({
    declarations: [
        AddProjectRoleComponent,
        ProjectRoleComponent
    ],
    imports: [
        CommonModule,
        ProjectRoleRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})
export class ProjectRoleModule { }
