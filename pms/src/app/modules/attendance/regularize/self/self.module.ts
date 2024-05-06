import { CommonModule } from "@angular/common";
import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CoreModule } from "../../../../common/common.module";
import { AddSelfComponent } from "./components/add-self/add.self.component";
import { SelfComponent } from "./components/self/self.component";
import { SelfRoutingModule } from "./self.routing.module";

@NgModule({
  declarations: [
    SelfComponent,
    AddSelfComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule,
    SelfRoutingModule
  ]
})
export class SelfModule { }
