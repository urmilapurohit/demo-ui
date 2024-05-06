import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ROUTES } from "@constants/routes";
import { DocumentCategoryComponent } from "./components/document-category/document.category.component";
import { AddDocumentCategoryComponent } from "./components/add-document-category/add.document.category.component";

const routes: Routes = [
    {
        path: '',
        component: DocumentCategoryComponent,
        data: { pageId: Pages.DocumentCategory, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddDocumentCategoryComponent,
        data: { pageId: Pages.DocumentCategory, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddDocumentCategoryComponent,
        data: { pageId: Pages.DocumentCategory, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentCategoryRoutingModule { }
