import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ROUTES } from "@constants/routes";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { ApplicationConfigurationComponent } from "./components/application-configuration/application.configuration.component";
import { AddApplicationConfigurationComponent } from "./components/add.application.configuration/add.application.configuration.component";

const routes: Routes = [
    {
        path: '',
        component: ApplicationConfigurationComponent,
        data: { pageId: Pages.ApplicationConfiguration, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddApplicationConfigurationComponent,
        data: { pageId: Pages.ApplicationConfiguration, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApplicationConfigurationRoutingModule { }
