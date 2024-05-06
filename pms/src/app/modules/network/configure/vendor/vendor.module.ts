import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { CoreModule } from "../../../../common/common.module";
import { AddVendorComponent } from "./components/add-vendor/add.vendor.component";
import { VendorComponent } from "./components/vendor/vendor.component";
import { VendorRoutingModule } from "./vendor-routing.module";

@NgModule({
    declarations: [
        AddVendorComponent,
        VendorComponent
    ],
    imports: [
        CommonModule,
        VendorRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class VendorModule { }
