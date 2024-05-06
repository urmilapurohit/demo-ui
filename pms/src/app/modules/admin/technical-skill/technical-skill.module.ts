import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { CoreModule } from "../../../common/common.module";
import { AddTechnicalSkillComponent } from "./components/add-technical-skill/add.technical.skill.component";
import { TechnicalSkillComponent } from "./components/technical-skill/technical.skill.component";
import { TechnicalSkillRoutingModule } from "./technical-skill-routing.module";

@NgModule({
    declarations: [
        TechnicalSkillComponent,
        AddTechnicalSkillComponent
    ],
    imports: [
        CommonModule,
        TechnicalSkillRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class TechnicalSkillModule { }
