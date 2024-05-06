import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ROUTES } from "@constants/routes";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ErrorLogComponent } from "./components/error-log/error.log.component";
import { ErrorLogDetailsComponent } from "./components/error-log-details/error.log.details.component";

const routes: Routes = [
    {
        path: '',
        component: ErrorLogComponent,
        data: { pageId: Pages.ErrorLog, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.PREVIEW,
        component: ErrorLogDetailsComponent,
        data: { pageId: Pages.ErrorLog, permission: [PageAccessTypes.View] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ErrorLogRoutingModule { }
