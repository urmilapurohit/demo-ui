import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoreModule } from "../../../common/common.module";
import { BookComponent } from "./components/book/book.component";
import { AddBookComponent } from "./components/add-book/add.book.component";
import { BookRoutingModule } from "./book-routing.module";

@NgModule({
    declarations: [
        AddBookComponent,
        BookComponent
    ],
    imports: [
        CommonModule,
        BookRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class BookModule { }
