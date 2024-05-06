import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkspaceLibraryModule } from 'workspace-library';
import { NewsEventRoutingModule } from './news-event-routing.module';
import { NewsEventComponent } from './components/news-event/news.event.component';
import { AddNewsEventComponent } from './components/add-news-event/add.news.event.component';
import { CoreModule } from '../../../common/common.module';

@NgModule({
  declarations: [
    NewsEventComponent,
    AddNewsEventComponent
  ],
  imports: [
    CommonModule,
    NewsEventRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})
export class NewsEventModule { }
