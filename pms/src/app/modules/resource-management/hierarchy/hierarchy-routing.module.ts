import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceHierarchyComponent } from './components/resource-hierarchy/resource.hierarchy.component';

const routes: Routes = [
  {
    path: '',
    component: ResourceHierarchyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HierarchyRoutingModule { }
