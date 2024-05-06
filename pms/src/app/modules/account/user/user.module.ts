import { CommonModule } from "@angular/common";
import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CoreModule } from "../../../common/common.module";
import { ProfileComponent } from "./components/profile/profile.component";
import { SystemConfigurationComponent } from "./components/system-configuration/system.configuration.component";
import { UserRoutingModule } from "./user.routing.module";

@NgModule({
  declarations: [
    ProfileComponent,
    SystemConfigurationComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})

export class UserModule { }
