import { CommonModule } from "@angular/common";
import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CoreModule } from "../../../../common/common.module";
import { ManageComponent } from "./components/manage/manage.component";
import { ManageRoutingModule } from "./manage.routing.module";
import { AddManageComponent } from "./components/add-manage/add.manage.component";

@NgModule({
  declarations: [
    ManageComponent,
    AddManageComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule,
    ManageRoutingModule
  ]
})
export class ManageModule { }
