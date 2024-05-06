import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ROUTES } from "@constants/routes";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { AddTechnicalSkillComponent } from "./components/add-technical-skill/add.technical.skill.component";
import { TechnicalSkillComponent } from "./components/technical-skill/technical.skill.component";

const routes: Routes = [
    {
        path: '',
        component: TechnicalSkillComponent,
        data: { pageId: Pages.TechnicalSkill, permission: [PageAccessTypes.View] },
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddTechnicalSkillComponent,
        data: { pageId: Pages.TechnicalSkill, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddTechnicalSkillComponent,
        data: { pageId: Pages.TechnicalSkill, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TechnicalSkillRoutingModule { }
