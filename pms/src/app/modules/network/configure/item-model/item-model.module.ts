import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { CoreModule } from "../../../../common/common.module";
import { AddItemModelComponent } from "./components/add-item-model/add.item.model.component";
import { ItemModelRoutingModule } from "./item-model-routing.module";
import { ItemModelComponent } from "./components/item-model/item.model.component";

@NgModule({
    declarations: [
        AddItemModelComponent,
        ItemModelComponent
    ],
    imports: [
        CommonModule,
        ItemModelRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class ItemModelModule { }
