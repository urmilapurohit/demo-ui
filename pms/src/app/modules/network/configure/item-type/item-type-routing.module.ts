import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ROUTES } from "@constants/routes";
import { Pages, PageAccessTypes } from "@constants/Enums";
import { ItemTypeComponent } from "./components/item-type/item.type.component";
import { AddItemTypeComponent } from "./components/add-item-type/add.item.type.component";

const routes: Routes = [
    {
        path: '',
        component: ItemTypeComponent,
        data: { pageId: Pages.NetworkItemType, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddItemTypeComponent,
        data: { pageId: Pages.NetworkItemType, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddItemTypeComponent,
        data: { pageId: Pages.NetworkItemType, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemTypeRoutingModule { }
