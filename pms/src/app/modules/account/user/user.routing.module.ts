import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SystemConfigurationComponent } from "./components/system-configuration/system.configuration.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ROUTES } from "../../../common/constants/routes";

const routes: Routes = [
    {
        path: ROUTES.ACCOUNT.USER.PROFILE,
        component: ProfileComponent
    },
    {
        path: ROUTES.ACCOUNT.USER.SYSTEM_CONFIGURATION,
        component: SystemConfigurationComponent
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
