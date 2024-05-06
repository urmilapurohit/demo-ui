import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TechnologyComponent } from './technology.component';
import { TechnologyService } from '../../services/technology.service';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../common/common.module';
import { testResponce, testRowData, testSearchParam, testSortParam } from '../../data/testdata';
import { ROUTES } from '../../../../../../common/constants/routes';
import { PermissionService } from '../../../../../../common/services/permission.service';
import { PageAccessTypes, Pages } from '../../../../../../common/constants/Enums';

describe('TechnologyComponent', () => {
  let component: TechnologyComponent;
  let fixture: ComponentFixture<TechnologyComponent>;
  let service: TechnologyService;
  let router: Router;
  let globalService: jasmine.SpyObj<GlobalService>;
  let permissionService: jasmine.SpyObj<PermissionService>;

  beforeEach(async () => {
    const permissionServiceSpy = jasmine.createSpyObj('PermissionService', ['checkAccessPermission']);
    permissionServiceSpy.checkAccessPermission.and.returnValue(true);

    await TestBed.configureTestingModule({
      declarations: [TechnologyComponent],
      imports: [
        HttpClientTestingModule,
        WorkspaceLibraryModule,
        CoreModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
      ],
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
        }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TechnologyComponent);
    component = fixture.componentInstance;
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(TechnologyService);
    permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    router = TestBed.get(Router);

    component.isAddPermission = permissionService.checkAccessPermission(Pages.PreSalesTechnology, PageAccessTypes.Add);
    component.isEditPermission = permissionService.checkAccessPermission(Pages.PreSalesTechnology, PageAccessTypes.Edit);
    component.isDeletePermission = permissionService.checkAccessPermission(Pages.PreSalesTechnology, PageAccessTypes.Delete);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getTechnologyList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getTechnologyList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getTechnologyList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call delete Button confirmation on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'deleteTechnologyRequest');
    if (
      component.technologyGridConfig.actionButtons
      && component.technologyGridConfig.actionButtons[1].callback
    ) {
      component.technologyGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit technology page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.technologyGridConfig.actionButtons
      && component.technologyGridConfig.actionButtons[0].callback
    ) {
      component.technologyGridConfig.actionButtons[0].callback(testRowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.EDIT_TECHNOLOGY_ABSOLUTE, 14]);
  });

  it('should navigate to add technology page onn click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addTechnology();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.ADD_TECHNOLOGY_ABSOLUTE]);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getTechnologyList');
    if (component.technologyGridConfig.paginationCallBack) {
      component.technologyGridConfig.paginationCallBack(testSearchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getTechnologyList');
    if (component.technologyGridConfig.getSortOrderAndColumn) {
      component.technologyGridConfig.getSortOrderAndColumn(testSortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set technologyList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: testResponce };
    spyOn(service, 'getTechnologies').and.returnValue(of(mockResponse));
    component.getTechnologyList();
    expect(component.isGridLoading).toBe(true);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(true);
    expect(component.technologyList).toEqual(testResponce);
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getTechnologies').and.returnValue(throwError('Some error'));
    component.getTechnologyList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should delete technology when confirmation is "yes"', () => {
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'deleteTechnology').and.returnValue(of({ isSuccess: true }));

    spyOn(globalService, 'openSnackBar');

    spyOn(component, 'getTechnologyList');

    if (
      component.technologyGridConfig.actionButtons
      && component.technologyGridConfig.actionButtons[1].callback
    ) {
      component.technologyGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.deleteTechnology).toHaveBeenCalledWith(14);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getTechnologyList).toHaveBeenCalled();
  });

  it('should handle error during delete', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'deleteTechnology').and.returnValue(
      throwError('Some error occurred.')
    );

    spyOn(component, 'getTechnologyList');

    if (
      component.technologyGridConfig.actionButtons
      && component.technologyGridConfig.actionButtons[1].callback
    ) {
      component.technologyGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.deleteTechnology).toHaveBeenCalledWith(14);
    expect(component.getTechnologyList).not.toHaveBeenCalled();
  });
});
