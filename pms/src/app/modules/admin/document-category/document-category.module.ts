import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoreModule } from "../../../common/common.module";
import { DocumentCategoryComponent } from "./components/document-category/document.category.component";
import { AddDocumentCategoryComponent } from "./components/add-document-category/add.document.category.component";
import { DocumentCategoryRoutingModule } from "./document-category-routing.module";

@NgModule({
    declarations: [
        DocumentCategoryComponent,
        AddDocumentCategoryComponent
    ],
    imports: [
        CommonModule,
        DocumentCategoryRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class DocumentCategoryModule { }
