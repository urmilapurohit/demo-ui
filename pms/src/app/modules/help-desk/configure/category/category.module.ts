import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { AddCategoryComponent } from "./components/add-category/add.category.component";
import { AddSubCategoryComponent } from "./components/add-sub-category/add.sub.category.component";
import { CategoryDetailComponent } from "./components/category-detail/category.detail.component";
import { CategoryComponent } from "./components/category/category.component";
import { CoreModule } from "../../../../common/common.module";
import { CategoryRoutingModule } from "./category.routing.module";

@NgModule({
    declarations: [
        CategoryComponent,
        AddCategoryComponent,
        AddSubCategoryComponent,
        CategoryDetailComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        CategoryRoutingModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})
export class CategoryModule { }
