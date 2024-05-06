import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { CoreModule } from "../../../../common/common.module";
import { TypeComponent } from "./components/type/type.component";
import { AddTypeComponent } from "./components/add-type/add.type.component";
import { TypeRoutingModule } from "./type-routing.module";

@NgModule({
    declarations: [
        TypeComponent,
        AddTypeComponent
    ],
    imports: [
        CommonModule,
        TypeRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})
export class TypeModule { }
