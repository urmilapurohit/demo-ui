import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ROUTES } from "@constants/routes";
import { Pages, PageAccessTypes } from "@constants/Enums";
import { ItemModelComponent } from "./components/item-model/item.model.component";
import { AddItemModelComponent } from "./components/add-item-model/add.item.model.component";

const routes: Routes = [
    {
        path: '',
        component: ItemModelComponent,
        data: { pageId: Pages.NetworkItemModel, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddItemModelComponent,
        data: { pageId: Pages.NetworkItemModel, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddItemModelComponent,
        data: { pageId: Pages.NetworkItemModel, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemModelRoutingModule { }
