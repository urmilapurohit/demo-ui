import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ROUTES } from "@constants/routes";
import { AddDocumentComponent } from "./components/add-document/add.document.component";
import { DocumentComponent } from "./components/document/document.component";

const routes: Routes = [
    {
        path: '',
        component: DocumentComponent,
        data: { pageId: Pages.Document, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddDocumentComponent,
        data: { pageId: Pages.Document, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddDocumentComponent,
        data: { pageId: Pages.Document, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DocumentRoutingModule { }
