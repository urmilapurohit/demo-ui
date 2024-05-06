import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ROUTES } from "@constants/routes";
import { BookCategoryComponent } from "./components/book-category/book.category.component";
import { AddBookCategoryComponent } from "./components/add-book-category/add.book.category.component";

const routes: Routes = [
    {
        path: '',
        component: BookCategoryComponent,
        data: { pageId: Pages.BookCategory, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddBookCategoryComponent,
        data: { pageId: Pages.BookCategory, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddBookCategoryComponent,
        data: { pageId: Pages.BookCategory, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookCategoryRoutingModule { }
