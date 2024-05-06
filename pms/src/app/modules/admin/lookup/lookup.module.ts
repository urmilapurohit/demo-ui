import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ReactiveFormsModule } from '@angular/forms';
import { LookupRoutingModule } from './lookup-routing.module';
import { CoreModule } from '../../../common/common.module';
import { LookupCategoryComponent } from './lookup-category/components/lookup-category/lookup.category.component';
import { LookupCategoryDetailComponent } from './lookup-category-detail/components/lookup-category-detail/lookup.category.detail.component';
import { AddLookupCategoryDetailComponent } from './lookup-category-detail/components/lookup-category-detail/add-lookup-category.detail/add.lookup.category.detail.component';

@NgModule({
  declarations: [
    LookupCategoryComponent,
    LookupCategoryDetailComponent,
    AddLookupCategoryDetailComponent
  ],
  imports: [
    CommonModule,
    LookupRoutingModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule,
    CoreModule
  ]
})
export class LookupModule { }
