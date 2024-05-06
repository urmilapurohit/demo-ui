import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "../../common/common.module";
import { DocumentsRoutingModule } from "./documents-routing.module";
import { DocumentsComponent } from "./components/documents/documents.component";

@NgModule({
    declarations: [
        DocumentsComponent
    ],
    imports: [
        DocumentsRoutingModule,
        CommonModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule,
    ]
})
export class DocumentsModule { }
