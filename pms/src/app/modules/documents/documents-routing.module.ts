import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { DocumentsComponent } from "./components/documents/documents.component";

const routes: Routes = [
    {
        path: '',
        component: DocumentsComponent,
        data: { pageId: Pages.Documents, permission: [PageAccessTypes.View] }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentsRoutingModule { }
