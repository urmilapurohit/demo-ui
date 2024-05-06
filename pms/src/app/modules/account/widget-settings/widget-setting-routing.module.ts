import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WidgetSettingsComponent } from './components/widget-settings/widget.settings.component';

const routes: Routes = [
  {
    path: '',
    component: WidgetSettingsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetSettingsModuleRoutingModule { }
