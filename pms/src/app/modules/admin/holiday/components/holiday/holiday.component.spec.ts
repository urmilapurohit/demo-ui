import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { HolidayComponent } from './holiday.component';
import { HolidayService } from '../../services/holiday.service';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { CoreModule } from '../../../../../common/common.module';
import { responseData, rowData, searchParam, sortParam } from '../../data/testData';
import { PageAccessTypes, Pages } from '../../../../../common/constants/Enums';
import { PermissionService } from '../../../../../common/services/permission.service';

describe('HolidayComponent', () => {
  let component: HolidayComponent;
  let service: HolidayService;
  let fixture: ComponentFixture<HolidayComponent>;
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
      declarations: [HolidayComponent],
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

    fixture = TestBed.createComponent(HolidayComponent);
    globalService = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    service = TestBed.inject(HolidayService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.isAddPermission = permissionService.checkAccessPermission(Pages.Holiday, PageAccessTypes.Add);
    component.isEditPermission = permissionService.checkAccessPermission(Pages.Holiday, PageAccessTypes.Edit);
    component.isDeletePermission = permissionService.checkAccessPermission(Pages.Holiday, PageAccessTypes.Delete);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getHolidayList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onEnterPress in holiday type enter', () => {
    const consoleSpy = spyOn(component, 'getHolidayList');
    if (component.isPublicHoliday.onEnterPress) {
      component.isPublicHoliday.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getHolidayList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click Reset Button', () => {
    const consoleSpy = spyOn(component, 'getHolidayList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call deleteHolidayRequest on click on action button click', () => {
    const consoleSpy = spyOn<any>(component, 'deleteHolidayRequest');
    if (
      component.holidayGridConfig.actionButtons
      && component.holidayGridConfig.actionButtons[1].callback
    ) {
      component.holidayGridConfig.actionButtons[1].callback(rowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit public holiday page on click on edit button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.holidayGridConfig.actionButtons
      && component.holidayGridConfig.actionButtons[0].callback
    ) {
      component.holidayGridConfig.actionButtons[0].callback(rowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/holiday/edit', 15]);
  });

  it('should navigate to add public holiday page onn click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addPublicHoliday();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/holiday/add']);
  });

  it('should navigate to add weekoff page onn click on add button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addWeekoff();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/holiday/weekoff/add']);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getHolidayList');
    if (component.holidayGridConfig.paginationCallBack) {
      component.holidayGridConfig.paginationCallBack(searchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getHolidayList');
    if (component.holidayGridConfig.getSortOrderAndColumn) {
      component.holidayGridConfig.getSortOrderAndColumn(sortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set holidayList and call setTableConfig on successful API response', () => {
    const mockResponse = { isSuccess: true, data: responseData };
    spyOn(service, 'getHoliday').and.returnValue(of(mockResponse));
    component.getHolidayList();
    expect(component.isGridLoading).toBe(true);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(true);
    expect(component.holidayList).toEqual(responseData);
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getHoliday').and.returnValue(throwError('Some error'));
    component.getHolidayList();
    expect(component.isGridLoading).toBe(false);
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should delete holiday when confirmation is "yes"', () => {
    // Act
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'deleteHoliday').and.returnValue(of({ isSuccess: true }));

    spyOn(globalService, 'openSnackBar');

    spyOn(component, 'getHolidayList');
    if (
      component.holidayGridConfig.actionButtons
      && component.holidayGridConfig.actionButtons[1].callback
    ) {
      component.holidayGridConfig.actionButtons[1].callback(rowData);
    }
    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.deleteHoliday).toHaveBeenCalledWith(15);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getHolidayList).toHaveBeenCalled();
  });
});
