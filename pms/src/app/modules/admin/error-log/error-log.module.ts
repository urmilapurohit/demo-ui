import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoreModule } from "../../../common/common.module";
import { ErrorLogComponent } from "./components/error-log/error.log.component";
import { ErrorLogRoutingModule } from "./error-log-routing.module";
import { ErrorLogDetailsComponent } from './components/error-log-details/error.log.details.component';

@NgModule({
    declarations: [
        ErrorLogComponent,
        ErrorLogDetailsComponent
    ],
    imports: [
        CommonModule,
        ErrorLogRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class ErrorLogModule { }
