import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchyRoutingModule } from './hierarchy-routing.module';
import { CoreModule } from '../../../common/common.module';
import { ResourceHierarchyComponent } from './components/resource-hierarchy/resource.hierarchy.component';

@NgModule({
  declarations: [
    ResourceHierarchyComponent,
  ],
  imports: [
    CommonModule,
    HierarchyRoutingModule,
    CoreModule,
  ]
})
export class HierarchyModule { }
