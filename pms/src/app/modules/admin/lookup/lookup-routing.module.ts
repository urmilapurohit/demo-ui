import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { LookupCategoryComponent } from './lookup-category/components/lookup-category/lookup.category.component';
import { LookupCategoryDetailComponent } from './lookup-category-detail/components/lookup-category-detail/lookup.category.detail.component';
import { AddLookupCategoryDetailComponent } from './lookup-category-detail/components/lookup-category-detail/add-lookup-category.detail/add.lookup.category.detail.component';

const routes: Routes = [
    {
        path: ROUTES.ADMIN.LOOKUP_CATEGORY.LOOKUP_CATEGORY,
        component: LookupCategoryComponent,
        data: { pageId: Pages.Category, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.LOOKUP_CATEGORY_DETAIL,
        component: LookupCategoryDetailComponent,
        data: { pageId: Pages.CategoryDetail, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.ADD_LOOKUP_CATEGORY_DETAIL,
        component: AddLookupCategoryDetailComponent,
        data: { pageId: Pages.CategoryDetail, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.EDIT_LOOKUP_CATEGORY_DETAIL,
        component: AddLookupCategoryDetailComponent,
        data: { pageId: Pages.CategoryDetail, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
    { path: '', redirectTo: ROUTES.ADMIN.LOOKUP_CATEGORY.LOOKUP_CATEGORY, pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LookupRoutingModule { }
