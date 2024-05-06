import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { GroupService } from '../../services/group.service';
import { GroupComponent } from './group.component';
import { testResponse, testRowData, testSearchParam, testSortParam } from '../../constant/testdata';
import { CoreModule } from '../../../../../../common/common.module';

describe('GroupComponent', () => {
  let component: GroupComponent;
  let service: GroupService;
  let fixture: ComponentFixture<GroupComponent>;
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
      declarations: [GroupComponent],
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

    fixture = TestBed.createComponent(GroupComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(GroupService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;

    // Initialize permissions
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getProjectGroupList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call onEnterPress in status enter', () => {
    const consoleSpy = spyOn(component, 'getProjectGroupList');
    if (component.status.onEnterPress) {
      component.status.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getProjectGroupList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getProjectGroupList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call updateStatusConfirmation on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'updateStatusConfirmation');
    if (
      component.projectGroupGridConfig.actionButtons
      && component.projectGroupGridConfig.actionButtons[1].callback
    ) {
      component.projectGroupGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should navigate to edit project group page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.projectGroupGridConfig.actionButtons
      && component.projectGroupGridConfig.actionButtons[0].callback
    ) {
      component.projectGroupGridConfig.actionButtons[0].callback(testRowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.EDIT_GROUP_ABSOLUTE, 14]);
  });
  it('should navigate to add group project page on click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addProjectGroup();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.ADD_GROUP_ABSOLUTE]);
  });
  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getProjectGroupList');
    if (component.projectGroupGridConfig.paginationCallBack) {
      component.projectGroupGridConfig.paginationCallBack(testSearchParam);
    }
    expect(spy).toHaveBeenCalled();
  });
  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getProjectGroupList');
    if (component.projectGroupGridConfig.getSortOrderAndColumn) {
      component.projectGroupGridConfig.getSortOrderAndColumn(testSortParam);
    }
    expect(spy).toHaveBeenCalled();
  });
  it('should set project group list and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: testResponse };
    spyOn(service, 'getProjectGroups').and.returnValue(of(mockResponse));
    component.getProjectGroupList();
    expect(component.isGridLoading).toBe(true);
    fixture.detectChanges();
    expect(component.projectGroupList).toEqual(testResponse);
  });
  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getProjectGroups').and.returnValue(throwError('Some error'));
    component.getProjectGroupList();
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

    spyOn(component, 'getProjectGroupList');
    if (
      component.projectGroupGridConfig.actionButtons
      && component.projectGroupGridConfig.actionButtons[1].callback
    ) {
      component.projectGroupGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(14, false);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getProjectGroupList).toHaveBeenCalled();
  });
});
