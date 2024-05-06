import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ROUTES } from "@constants/routes";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ManageComponent } from "./components/manage/manage.component";
import { ImmediateSeniorHistoryComponent } from "./components/immediate-senior-history/immediate.senior.history.component";

const routes: Routes = [
    {
        path: '',
        component: ManageComponent,
        data: { pageId: Pages.ResourceManagementManage, permission: [PageAccessTypes.View] },
      },
      {
        path: ROUTES.RESOURCE_MANAGEMENT.MANAGE.IMMEDIATE_SENIOR_HISTORY,
        component: ImmediateSeniorHistoryComponent,
        data: { pageId: Pages.ResourceManagementManage, permission: [PageAccessTypes.View] },
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageRoutingModule { }
