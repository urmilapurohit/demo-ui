import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';

const routes: Routes = [
  {
    path: ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL,
    loadChildren: () => import('./configure/item-model/item-model.module').then((m) => m.ItemModelModule),
    data: { pageId: Pages.NetworkItemModel, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ITEM_TYPE,
    loadChildren: () => import('./configure/item-type/item-type.module').then((m) => m.ItemTypeModule),
    data: { pageId: Pages.NetworkItemType, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.NETWORK.CONFIGURATION.VENDOR.VENDOR,
    loadChildren: () => import('./configure/vendor/vendor.module').then((m) => m.VendorModule),
    data: { pageId: Pages.Vendor, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.NETWORK.CONFIGURATION.SYSTEM_STATUS.SYSTEM_STATUS,
    loadChildren: () => import('./configure/system-status/system-status.module').then((m) => m.SystemStatusModule),
    data: { pageId: Pages.SystemStatus, permission: [PageAccessTypes.View] },
  },
  { path: '', redirectTo: ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL, pathMatch: 'full' },
  {
    path: ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.SYSTEM_TYPE,
    loadChildren: () => import('./configure/system-type/system-type.module').then((m) => m.SystemTypeModule),
    data: { pageId: Pages.NetworkSystemType, permission: [PageAccessTypes.View] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkRoutingModule { }
