import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { DocumentComponent } from "./components/document/document.component";
import { AddDocumentComponent } from "./components/add-document/add.document.component";
import { CoreModule } from "../../../common/common.module";
import { DocumentRoutingModule } from "./document-routing.module";

@NgModule({
    declarations: [
        DocumentComponent,
        AddDocumentComponent
    ],
    imports: [
        CommonModule,
        DocumentRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class DocumentModule { }
