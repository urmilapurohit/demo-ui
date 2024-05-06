import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { TeamEfficiencyReportComponent } from "./components/team-efficiency-report/team.efficiency.report.component";

const routes: Routes = [
    {
        path: '',
        component: TeamEfficiencyReportComponent,
        data: { pageId: Pages.TeamEfficiencyReport, permission: [PageAccessTypes.View] },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeamEfficiencyReportRoutingModule { }
