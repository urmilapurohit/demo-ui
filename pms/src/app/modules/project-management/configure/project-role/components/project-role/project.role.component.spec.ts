import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { GLOBAL_CONSTANTS} from '@constants/constant';
import { CoreModule } from '../../../../../../common/common.module';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { ProjectRoleComponent } from './project.role.component';
import { ProjectRoleService } from '../../services/project.role.service';
import { testResponse, testRowData, testSearchParam, testSortParam } from '../../constant/testdata';

describe('RoleComponent', () => {
  let component: ProjectRoleComponent;
  let service: ProjectRoleService;
  let fixture: ComponentFixture<ProjectRoleComponent>;
  let router: Router;
  let globalService: jasmine.SpyObj<GlobalService>;

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
      declarations: [ProjectRoleComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ afterClosed: () => of({ data: 'yes' }) }),
          },
        },
        {
          provide: PermissionService,
          useValue: permissionServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectRoleComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(ProjectRoleService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getProjectRoleList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call onEnterPress in status enter', () => {
    const consoleSpy = spyOn(component, 'getProjectRoleList');
    if (component.status.onEnterPress) {
      component.status.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getProjectRoleList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getProjectRoleList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call updateProjectRoleConfirmation on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'updateStatusConfirmation');
    if (
      component.projectRoleGridConfig.actionButtons
      && component.projectRoleGridConfig.actionButtons[1].callback
    ) {
      component.projectRoleGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should navigate to edit project role page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.projectRoleGridConfig.actionButtons
      && component.projectRoleGridConfig.actionButtons[0].callback
    ) {
      component.projectRoleGridConfig.actionButtons[0].callback(testRowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.EDIT_PROJECT_ROLE_ABSOLUTE, 3]);
  });
  it('should navigate to add project role page on click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addProjectRole();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.ADD_PROJECT_ROLE_ABSOLUTE]);
  });
  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getProjectRoleList');
    if (component.projectRoleGridConfig.paginationCallBack) {
      component.projectRoleGridConfig.paginationCallBack(testSearchParam);
    }
    expect(spy).toHaveBeenCalled();
  });
  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getProjectRoleList');
    if (component.projectRoleGridConfig.getSortOrderAndColumn) {
      component.projectRoleGridConfig.getSortOrderAndColumn(testSortParam);
    }
    expect(spy).toHaveBeenCalled();
  });
  it('should set project role list and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: testResponse };
    spyOn(service, 'getProjectRoles').and.returnValue(of(mockResponse));
    component.getProjectRoleList();
    expect(component.isGridLoading).toBe(true);
    fixture.detectChanges();
    expect(component.projectRoleList).toEqual(testResponse);
  });
  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getProjectRoles').and.returnValue(throwError('Some error'));
    component.getProjectRoleList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
  });
  it('should update status when confirmation is "yes"', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'updateStatus').and.returnValue(of({ isSuccess: true }));

    spyOn(globalService, 'openSnackBar');

    spyOn(component, 'getProjectRoleList');
    if (
      component.projectRoleGridConfig.actionButtons
      && component.projectRoleGridConfig.actionButtons[1].callback
    ) {
      component.projectRoleGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(3, false);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getProjectRoleList).toHaveBeenCalled();
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

    spyOn(component, 'getProjectRoleList');

    if (
      component.projectRoleGridConfig.actionButtons
      && component.projectRoleGridConfig.actionButtons[1].callback
    ) {
      component.projectRoleGridConfig.actionButtons[1].callback(testRowData);
    }
    // Assert
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(3, false);
    expect(globalService.openSnackBar).toHaveBeenCalledWith(
      GLOBAL_CONSTANTS.COMMON_API_ERROR_MESSAGE,
      'error-message'
    );
    expect(component.getProjectRoleList).not.toHaveBeenCalled();
  });
});
