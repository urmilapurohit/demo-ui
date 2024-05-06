import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkspaceLibraryModule } from 'workspace-library';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaterialModule } from './components/material/material.module';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { ChangePasswordModalComponent } from './components/modal/change-password-modal/change-password-modal.component';
import { EditTechnicalSkillsComponent } from './components/modal/edit-technical-skills/edit-technical-skills.component';
import { ShortNamePipe } from '../short-name.pipe';
import { PageHeaderComponent } from './components/page-header/page.header.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { CkEditorComponent } from './components/ck-editor/ck.editor.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { ExtractDayPipe } from './pipes/extractDate.pipe';
import { HierarchyComponent } from './components/hierarchy/hierarchy.component';
import { SaveCancelButtonComponent } from './components/save.cancel.button/save.cancel.button.component';

@NgModule({
    declarations: [
        HeaderComponent,
        LayoutComponent,
        FooterComponent,
        SidebarComponent,
        AppLoaderComponent,
        ChangePasswordModalComponent,
        EditTechnicalSkillsComponent,
        ShortNamePipe,
        PageHeaderComponent,
        UnauthorizedComponent,
        PagenotfoundComponent,
        CkEditorComponent,
        SafeHtmlPipe,
        PageLoaderComponent,
        ExtractDayPipe,
        HierarchyComponent,
        SaveCancelButtonComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        ReactiveFormsModule,
        WorkspaceLibraryModule,
        NgScrollbarModule,
        NgxSkeletonLoaderModule,
        CKEditorModule
    ],
    exports: [
        MaterialModule,
        LayoutComponent,
        AppLoaderComponent,
        ChangePasswordModalComponent,
        ShortNamePipe,
        NgxSkeletonLoaderModule,
        NgScrollbarModule,
        PageHeaderComponent,
        CkEditorComponent,
        SafeHtmlPipe,
        PageLoaderComponent,
        ExtractDayPipe,
        HierarchyComponent,
        SaveCancelButtonComponent
    ],
})
export class CoreModule { }
