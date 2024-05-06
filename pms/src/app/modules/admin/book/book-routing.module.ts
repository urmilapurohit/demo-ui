import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ROUTES } from "@constants/routes";
import { BookComponent } from "./components/book/book.component";
import { AddBookComponent } from "./components/add-book/add.book.component";

const routes: Routes = [
    {
        path: '',
        component: BookComponent,
        data: { pageId: Pages.Book, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddBookComponent,
        data: { pageId: Pages.Book, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddBookComponent,
        data: { pageId: Pages.Book, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookRoutingModule { }
