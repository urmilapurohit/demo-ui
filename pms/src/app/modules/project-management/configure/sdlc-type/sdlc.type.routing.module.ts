import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ROUTES } from "@constants/routes";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { SdlcTypeComponent } from "./components/sdlc-type/sdlc.type.component";
import { SdlcAddComponent } from "./components/sdlc-add/sdlc.add.component";
import { SdlcEditComponent } from "./components/sdlc-edit/sdlc.edit.component";
import { SdlcStepEditComponent } from "./components/sdlc-step-edit/sdlc.step.edit.component";
import { SdlcTypeEditComponent } from "./components/sdlc-type-edit/sdlc.type.edit.component";

const routes: Routes = [
    {
        path: '',
        component: SdlcTypeComponent,
        data: { pageId: Pages.ProjectSDLCType, permission: [PageAccessTypes.View] },
      },
      {
        path: ROUTES.COMMON.ADD,
        component: SdlcAddComponent,
        data: { pageId: Pages.ProjectSDLCType, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
      },
      {
        path: ROUTES.COMMON.EDIT,
        component: SdlcEditComponent,
        data: { pageId: Pages.ProjectSDLCType, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
      },
      {
        path: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.ADD_SDLC_WORK_FLOW_STEP,
        component: SdlcStepEditComponent,
        data: { pageId: Pages.ProjectWorkFlowStep, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
      },
      {
        path: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.ADD_SDLC_WORK_FLOW_TYPE,
        component: SdlcTypeEditComponent,
        data: { pageId: Pages.ProjectWorkFlowType, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
      },
      {
        path: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_WORK_FLOW_STEP,
        component: SdlcStepEditComponent,
        data: { pageId: Pages.ProjectWorkFlowStep, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
      },
      {
        path: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_WORK_FLOW_TYPE,
        component: SdlcTypeEditComponent,
        data: { pageId: Pages.ProjectWorkFlowType, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SDLCTypeRoutingModule { }
