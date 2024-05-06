import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { AddPublicHolidayComponent } from './components/holiday/add-public-holiday/add.public.holiday.component';
import { AddWeekoffComponent } from './components/holiday/add-weekoff/add.weekoff.component';
import { HolidayComponent } from './components/holiday/holiday.component';

const routes: Routes = [
    {
        path: '',
        component: HolidayComponent,
    },
    {
        path: ROUTES.COMMON.ADD,
        component: AddPublicHolidayComponent,
        data: { pageId: Pages.Holiday, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
    {
        path: ROUTES.COMMON.EDIT,
        component: AddPublicHolidayComponent,
        data: { pageId: Pages.Holiday, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
    },
    {
        path: ROUTES.ADMIN.HOLIDAY.ADD_WEEKOFF,
        component: AddWeekoffComponent,
        data: { pageId: Pages.Holiday, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HolidayRoutingModule { }
