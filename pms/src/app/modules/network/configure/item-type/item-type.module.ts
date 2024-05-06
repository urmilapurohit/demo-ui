import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { CoreModule } from "../../../../common/common.module";
import { ItemTypeComponent } from "./components/item-type/item.type.component";
import { AddItemTypeComponent } from "./components/add-item-type/add.item.type.component";
import { ItemTypeRoutingModule } from "./item-type-routing.module";

@NgModule({
    declarations: [
        AddItemTypeComponent,
        ItemTypeComponent
    ],
    imports: [
        CommonModule,
        ItemTypeRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class ItemTypeModule { }
