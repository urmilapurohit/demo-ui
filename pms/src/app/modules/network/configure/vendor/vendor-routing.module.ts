import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ROUTES } from "@constants/routes";
import { Pages, PageAccessTypes } from "@constants/Enums";
import { VendorComponent } from "./components/vendor/vendor.component";
import { AddVendorComponent } from "./components/add-vendor/add.vendor.component";

const routes: Routes = [
    {
        path: '',
        component: VendorComponent,
        data: { pageId: Pages.Vendor, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddVendorComponent,
        data: { pageId: Pages.Vendor, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddVendorComponent,
        data: { pageId: Pages.Vendor, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VendorRoutingModule { }
