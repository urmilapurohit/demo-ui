import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { GLOBAL_CONSTANTS } from '../../../../../common/constants/constant';
import { TechnicalSkillService } from '../../services/technical.skill.service';
import { TechnicalSkillComponent } from './technical.skill.component';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { CoreModule } from '../../../../../common/common.module';
import { PermissionService } from '../../../../../common/services/permission.service';
import { responseData, rowData, searchParam, sortParam } from '../../data/testData';
import { PageAccessTypes, Pages } from '../../../../../common/constants/Enums';

describe('TechnicalSkillComponent', () => {
  let component: TechnicalSkillComponent;
  let service: TechnicalSkillService;
  let fixture: ComponentFixture<TechnicalSkillComponent>;
  let router: Router;
  let globalService: jasmine.SpyObj<GlobalService>;
  let permissionService: jasmine.SpyObj<PermissionService>;
  beforeEach(async () => {
    const permissionServiceSpy = jasmine.createSpyObj('PermissionService', ['checkAccessPermission']);
    permissionServiceSpy.checkAccessPermission.and.returnValue(true);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        WorkspaceLibraryModule,
        CoreModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
      ],
      declarations: [TechnicalSkillComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ afterClosed: () => of({ data: 'yes' }) }),
          },
        },
        { provide: PermissionService, useValue: permissionServiceSpy }
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TechnicalSkillComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(TechnicalSkillService);
    permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.isAddPermission = permissionService.checkAccessPermission(Pages.TechnicalSkill, PageAccessTypes.Add);
    component.isEditPermission = permissionService.checkAccessPermission(Pages.TechnicalSkill, PageAccessTypes.Edit);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getTechnicalSkillList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onEnterPress in status enter', () => {
    const consoleSpy = spyOn(component, 'getTechnicalSkillList');
    if (component.status.onEnterPress) {
      component.status.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getTechnicalSkillList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getTechnicalSkillList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call updateStatusConfirmation on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'updateStatusConfirmation');
    if (
      component.technicalSkillGridConfig.actionButtons
      && component.technicalSkillGridConfig.actionButtons[1].callback
    ) {
      component.technicalSkillGridConfig.actionButtons[1].callback(rowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit technical skill page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.technicalSkillGridConfig.actionButtons
      && component.technicalSkillGridConfig.actionButtons[0].callback
    ) {
      component.technicalSkillGridConfig.actionButtons[0].callback(rowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/technical-skills/edit', 2]);
  });

  it('should navigate to add technical skill page on click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addTechnicalSkill();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/technical-skills/add']);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getTechnicalSkillList');
    if (component.technicalSkillGridConfig.paginationCallBack) {
      component.technicalSkillGridConfig.paginationCallBack(searchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getTechnicalSkillList');
    if (component.technicalSkillGridConfig.getSortOrderAndColumn) {
      component.technicalSkillGridConfig.getSortOrderAndColumn(sortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set technicalSkillList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: responseData };
    spyOn(service, 'getTechnicalSkills').and.returnValue(of(mockResponse));
    component.getTechnicalSkillList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getTechnicalSkills').and.returnValue(throwError('Some error'));
    component.getTechnicalSkillList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should update status when confirmation is "yes"', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);
    spyOn(service, 'updateStatus').and.returnValue(of({ isSuccess: true }));
    spyOn(globalService, 'openSnackBar');
    spyOn(component, 'getTechnicalSkillList');
    if (
      component.technicalSkillGridConfig.actionButtons
      && component.technicalSkillGridConfig.actionButtons[1].callback
    ) {
      component.technicalSkillGridConfig.actionButtons[1].callback(rowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(2, false);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getTechnicalSkillList).toHaveBeenCalled();
  });

  it('should handle error during update', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);
    spyOn(service, 'updateStatus').and.returnValue(
      throwError('Some error occurred.')
    );
    spyOn(globalService, 'openSnackBar');
    spyOn(component, 'getTechnicalSkillList');
    if (
      component.technicalSkillGridConfig.actionButtons
      && component.technicalSkillGridConfig.actionButtons[1].callback
    ) {
      component.technicalSkillGridConfig.actionButtons[1].callback(rowData);
    }
    // Assert
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(2, false);
    expect(globalService.openSnackBar).toHaveBeenCalledWith(
      GLOBAL_CONSTANTS.COMMON_API_ERROR_MESSAGE,
      'error-message'
    );
    expect(component.getTechnicalSkillList).not.toHaveBeenCalled();
  });
});
