import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '../../common/constants/routes';
import { PageAccessTypes, Pages } from '../../common/constants/Enums';

const routes: Routes = [
  {
    path: ROUTES.ADMIN.AUTHORIZE.AUTHORIZE,
    loadChildren: () => import('./authorization/authorization.module').then((m) => m.AuthorizationModule),
  },
  {
    path: ROUTES.ADMIN.HOLIDAY.HOLIDAY,
    loadChildren: () => import('./holiday/holiday.module').then((m) => m.HolidayModule),
    data: { pageId: Pages.Holiday, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.LOOKUP_CATEGORY.LOOKUP,
    loadChildren: () => import('./lookup/lookup.module').then((m) => m.LookupModule),
  },
  {
    path: ROUTES.ADMIN.DESIGNATION.DESIGNATION,
    loadChildren: () => import('./designation/designation.module').then((m) => m.DesignationModule),
    data: { pageId: Pages.Designation, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.DEPARTMENT.DEPARTMENT,
    loadChildren: () => import('./department/department.module').then((m) => m.DepartmentModule),
    data: { pageId: Pages.Department, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.BOOK.BOOK,
    loadChildren: () => import('./book/book.module').then((m) => m.BookModule),
    data: { pageId: Pages.Book, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.BOOK_CATEGORY.BOOK_CATEGORY,
    loadChildren: () => import('./book-category/book-category.module').then((m) => m.BookCategoryModule),
    data: { pageId: Pages.BookCategory, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.DOCUMENT_CATEGORY.DOCUMENT_CATEGORY,
    loadChildren: () => import('./document-category/document-category.module').then((m) => m.DocumentCategoryModule),
    data: { pageId: Pages.DocumentCategory, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.TECHNICAL_SKILL.TECHNICAL_SKILL,
    loadChildren: () => import('./technical-skill/technical-skill.module').then((m) => m.TechnicalSkillModule),
    data: { pageId: Pages.TechnicalSkill, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE,
    loadChildren: () => import('./email-template/email-template.module').then((m) => m.EmailTemplateModule),
    data: { pageId: Pages.EmailTemplate, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.ERROR_LOG.ERROR_LOG,
    loadChildren: () => import('./error-log/error-log.module').then((m) => m.ErrorLogModule),
    data: { pageId: Pages.ErrorLog, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.APPLICATION_CONFIGURATION.APPLICATION_CONFIGURATION,
    loadChildren: () => import('./application-configuration/application-configuration.module').then((m) => m.ApplicationConfigurationModule),
    data: { pageId: Pages.ApplicationConfiguration, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.DOCUMENT.DOCUMENT,
    loadChildren: () => import('./document/document.module').then((m) => m.DocumentModule),
    data: { pageId: Pages.Document, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.NEWS_EVENT.NEWS_EVENT,
    loadChildren: () => import('./news-event/news-event.module').then((m) => m.NewsEventModule),
    data: { pageId: Pages.NewsEvents, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.NOTIFICATION_TYPE.NOTIFICATION_TYPE,
    loadChildren: () => import('./notification-type/notification-type.module').then((m) => m.NotificationTypeModule),
    data: { pageId: Pages.NotificationType, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.NOTIFICATION.NOTIFICATION,
    loadChildren: () => import('./notification/notification.module').then((m) => m.NotificationModule),
    data: { pageId: Pages.NotificationType, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ADMIN.AUDIT_LOG.AUDIT_LOG,
    loadChildren: () => import('./audit-log/audit.log.module').then((m) => m.AuditLogModule),
    data: { pageId: Pages.Admin, permission: [PageAccessTypes.View] },
  },
  { path: '', redirectTo: ROUTES.ADMIN.DEPARTMENT.DEPARTMENT, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
