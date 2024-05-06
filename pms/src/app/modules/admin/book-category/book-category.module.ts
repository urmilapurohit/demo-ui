import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoreModule } from "../../../common/common.module";
import { BookCategoryComponent } from "./components/book-category/book.category.component";
import { AddBookCategoryComponent } from "./components/add-book-category/add.book.category.component";
import { BookCategoryRoutingModule } from "./book-category-routing.module";

@NgModule({
    declarations: [
        BookCategoryComponent,
        AddBookCategoryComponent
    ],
    imports: [
        CommonModule,
        BookCategoryRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class BookCategoryModule { }
