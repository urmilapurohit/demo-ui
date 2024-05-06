import { CommonModule } from "@angular/common";
import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { AddDepartmentComponent } from "./components/add-department/add.department.component";
import { DepartmentComponent } from "./components/department/department.component";
import { DepartmentRoutingModule } from "./department-routing.module";
import { CoreModule } from "../../../common/common.module";

@NgModule({
  declarations: [
    AddDepartmentComponent,
    DepartmentComponent
  ],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})

export class DepartmentModule { }
