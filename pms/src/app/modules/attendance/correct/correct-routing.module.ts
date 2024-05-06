import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PageAccessTypes, Pages } from "@constants/Enums";
import { CorrectComponent } from "./components/correct/correct.component";

const routes: Routes = [
    {
        path: '',
        component: CorrectComponent,
        data: { pageId: Pages.AttendanceCorrect, permission: [PageAccessTypes.View] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CorrectRoutingModule { }
