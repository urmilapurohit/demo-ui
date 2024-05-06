import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { CoreModule } from "../../../../common/common.module";
import { TeamEfficiencyReportComponent } from "./components/team-efficiency-report/team.efficiency.report.component";
import { TeamEfficiencyReportRoutingModule } from "./team-efficiency-report-routing.module";

@NgModule({
    declarations: [
        TeamEfficiencyReportComponent
    ],
    imports: [
        CommonModule,
        TeamEfficiencyReportRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class TeamEfficiencyReportModule { }
