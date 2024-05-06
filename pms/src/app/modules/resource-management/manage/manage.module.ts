import { CommonModule } from "@angular/common";
import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CoreModule } from "../../../common/common.module";
import { ManageComponent } from "./components/manage/manage.component";
import { ImmediateSeniorHistoryComponent } from "./components/immediate-senior-history/immediate.senior.history.component";
import { ManageRoutingModule } from "./manage.routing.module";

@NgModule({
  declarations: [
    ManageComponent,
    ImmediateSeniorHistoryComponent
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})

export class ManageModule { }
