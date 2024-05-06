import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { WorkspaceLibraryModule } from "workspace-library";
import { CoreModule } from "../../../common/common.module";
import { CorrectRoutingModule } from "./correct-routing.module";
import { CorrectComponent } from "./components/correct/correct.component";

@NgModule({
    declarations: [
        CorrectComponent
    ],
    imports: [
        CommonModule,
        CorrectRoutingModule,
        CoreModule,
        WorkspaceLibraryModule
    ]
})
export class CorrectModule { }
