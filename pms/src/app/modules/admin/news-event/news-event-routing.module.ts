import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { NewsEventComponent } from './components/news-event/news.event.component';
import { AddNewsEventComponent } from './components/add-news-event/add.news.event.component';

const routes: Routes = [
  {
      path: '',
      component: NewsEventComponent,
      data: { pageId: Pages.NewsEvents, permission: [PageAccessTypes.View] },
  },
  {
      path: ROUTES.COMMON.ADD,
      component: AddNewsEventComponent,
      data: { pageId: Pages.NewsEvents, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
  },
  {
      path: ROUTES.COMMON.EDIT,
      component: AddNewsEventComponent,
      data: { pageId: Pages.NewsEvents, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsEventRoutingModule { }
