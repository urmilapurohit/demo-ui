import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ROUTES } from "@constants/routes";
import { AddCategoryComponent } from "./components/add-category/add.category.component";
import { AddSubCategoryComponent } from "./components/add-sub-category/add.sub.category.component";
import { CategoryDetailComponent } from "./components/category-detail/category.detail.component";
import { CategoryComponent } from "./components/category/category.component";

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    data: { pageId: Pages.HelpDeskCategory, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.COMMON.ADD,
    component: AddCategoryComponent,
    data: { pageId: Pages.HelpDeskCategory, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
  },
  {
    path: ROUTES.COMMON.EDIT,
    component: CategoryDetailComponent,
    data: { pageId: Pages.HelpDeskCategory, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  },
  {
    path: ROUTES.HELP_DESK.CONFIGURE.CATEGORY.ADD_SUB_CATEGORY,
    component: AddSubCategoryComponent,
    data: { pageId: Pages.HelpDeskCategory, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
  },
  {
    path: ROUTES.HELP_DESK.CONFIGURE.CATEGORY.EDIT_SUB_CATEGORY,
    component: AddSubCategoryComponent,
    data: { pageId: Pages.HelpDeskCategory, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
