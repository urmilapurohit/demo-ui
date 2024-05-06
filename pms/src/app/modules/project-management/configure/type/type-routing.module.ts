import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ROUTES } from "@constants/routes";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { TypeComponent } from "./components/type/type.component";
import { AddTypeComponent } from "./components/add-type/add.type.component";

const routes: Routes = [
    {
        path: '',
        component: TypeComponent,
        data: { pageId: Pages.ProjectType, permission: [PageAccessTypes.View] },
      },
      {
        path: ROUTES.COMMON.ADD,
        component: AddTypeComponent,
        data: { pageId: Pages.ProjectType, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
      },
      {
        path: ROUTES.COMMON.EDIT,
        component: AddTypeComponent,
        data: { pageId: Pages.ProjectType, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TypeRoutingModule { }
