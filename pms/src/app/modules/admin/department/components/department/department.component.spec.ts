// import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { HttpClientModule } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserModule } from '@angular/platform-browser';
// import { of, throwError } from 'rxjs';
// import { MatDialog } from '@angular/material/dialog';
// import { DepartmentComponent } from './department.component';
// import { CoreModule } from '../../../../../common/common.module';
// import { AppRoutingModule } from '../../../../../app-routing.module';
// import { DepartmentService } from '../../services/department.service';
// import { testResponce, testRowData, testSearchParam, testSortParam } from '../../data/testdata';
// import { GLOBAL_CONSTANTS } from '../../../../../common/constants/constant';
// import { PermissionService } from '../../../../../common/services/permission.service';
// import { PageAccessTypes, Pages } from '../../../../../common/constants/Enums';

// describe('DepartmentComponent', () => {
//   let component: DepartmentComponent;
//   let service: DepartmentService;
//   let fixture: ComponentFixture<DepartmentComponent>;
//   let router: Router;
//   let globalService: jasmine.SpyObj<GlobalService>;
//   let permissionService: jasmine.SpyObj<PermissionService>;

//   beforeEach(async () => {
//     const permissionServiceSpy = jasmine.createSpyObj('PermissionService', ['checkAccessPermission']);
//     permissionServiceSpy.checkAccessPermission.and.returnValue(true);
//     await TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//         WorkspaceLibraryModule,
//         CoreModule,
//         BrowserModule,
//         AppRoutingModule,
//         BrowserAnimationsModule,
//         HttpClientModule,
//       ],
//       declarations: [DepartmentComponent],
//       providers: [
//         {
//           provide: MatDialog,
//           useValue: {
//             open: () => ({ afterClosed: () => of({ data: 'yes' }) }),
//           },
//         },
//         { provide: PermissionService, useValue: permissionServiceSpy }
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(DepartmentComponent);
//     globalService = TestBed.inject(
//       GlobalService
//     ) as jasmine.SpyObj<GlobalService>;
//     service = TestBed.inject(DepartmentService);
//     permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
//     router = TestBed.get(Router);
//     component = fixture.componentInstance;
//     component.isAddPermission = permissionService.checkAccessPermission(Pages.Department, PageAccessTypes.Add);
//     component.isEditPermission = permissionService.checkAccessPermission(Pages.Department, PageAccessTypes.Edit);
//     component.isDeletePermission = permissionService.checkAccessPermission(Pages.Department, PageAccessTypes.Delete);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     component.ngOnInit();
//     expect(component).toBeTruthy();
//   });

//   it('should call onEnterPress in search name enter', () => {
//     const consoleSpy = spyOn(component, 'getDepartmentList');
//     if (component.searchName.onEnterPress) {
//       component.searchName.onEnterPress();
//     }
//     expect(consoleSpy).toHaveBeenCalled();
//   });

//   it('should call onEnterPress in status enter', () => {
//     const consoleSpy = spyOn(component, 'getDepartmentList');
//     if (component.status.onEnterPress) {
//       component.status.onEnterPress();
//     }
//     expect(consoleSpy).toHaveBeenCalled();
//   });

//   it('should call search method on click search button', () => {
//     const consoleSpy = spyOn(component, 'getDepartmentList');
//     component.searchBtnConfig.callback();
//     expect(consoleSpy).toHaveBeenCalled();
//   });

//   it('should call resetFilter method on click Reset Button', () => {
//     const consoleSpy = spyOn(component, 'getDepartmentList');
//     component.resetBtnConfig.callback();
//     expect(consoleSpy).toHaveBeenCalled();
//   });

//   it('should call updateStatusConfirmation on click on action button click', () => {
//     const consoleSpy = spyOn<any>(component, 'updateStatusConfirmation');
//     if (
//       component.departmentGridConfig.actionButtons
//       && component.departmentGridConfig.actionButtons[1].callback
//     ) {
//       component.departmentGridConfig.actionButtons[1].callback(testRowData);
//     }
//     expect(consoleSpy).toHaveBeenCalled();
//   });

//   it('should navigate to edit department page on click on edit button click', () => {
//     const navigateSpy = spyOn(router, 'navigate');
//     if (
//       component.departmentGridConfig.actionButtons
//       && component.departmentGridConfig.actionButtons[0].callback
//     ) {
//       component.departmentGridConfig.actionButtons[0].callback(testRowData);
//     }
//     expect(navigateSpy).toHaveBeenCalledWith(['/admin/department/edit', 14]);
//   });

//   it('should navigate to add department page onn click on add button click', () => {
//     const navigateSpy = spyOn(router, 'navigate');
//     component.addDepartment();
//     expect(navigateSpy).toHaveBeenCalledWith(['/admin/department/add']);
//   });

//   it('should call pagination method on call back', () => {
//     const spy = spyOn(component, 'getDepartmentList');
//     if (component.departmentGridConfig.paginationCallBack) {
//       component.departmentGridConfig.paginationCallBack(testSearchParam);
//     }
//     expect(spy).toHaveBeenCalled();
//   });

//   it('should call getSortOrderColumn method on call back', () => {
//     const spy = spyOn(component, 'getDepartmentList');
//     if (component.departmentGridConfig.getSortOrderAndColumn) {
//       component.departmentGridConfig.getSortOrderAndColumn(testSortParam);
//     }
//     expect(spy).toHaveBeenCalled();
//   });

//   it('should set departmentList and call setTableConfig on successful API response', () => {
//     const mockResponse = { isSuccess: true, data: testResponce };
//     spyOn(service, 'getDepartments').and.returnValue(of(mockResponse));
//     component.getDepartmentList();
//     expect(component.isGridLoading).toBe(true);
//     fixture.detectChanges();
//     expect(component.isGridLoading).toBe(true);
//     expect(component.departmentList).toEqual(testResponce);
//   });

//   it('should set isGridLoading to false on API error', () => {
//     spyOn(service, 'getDepartments').and.returnValue(throwError('Some error'));
//     component.getDepartmentList();
//     expect(component.isGridLoading).toBe(false);
//     fixture.detectChanges();
//     expect(component.isGridLoading).toBe(false);
//   });

//   it('should update status when confirmation is "yes"', () => {
//     // Act
//     spyOn(globalService, 'getConfirmDialog').and.returnValue({
//       afterClosed: () => of({ data: 'yes' }),
//     } as any);

//     spyOn(service, 'updateStatus').and.returnValue(of({ isSuccess: true }));

//     spyOn(globalService, 'openSnackBar');

//     spyOn(component, 'getDepartmentList');
//     if (
//       component.departmentGridConfig.actionButtons
//       && component.departmentGridConfig.actionButtons[1].callback
//     ) {
//       component.departmentGridConfig.actionButtons[1].callback(testRowData);
//     }
//     expect(globalService.getConfirmDialog).toHaveBeenCalled();
//     expect(service.updateStatus).toHaveBeenCalledWith(14, false);
//     expect(globalService.openSnackBar).toHaveBeenCalled();
//     expect(component.getDepartmentList).toHaveBeenCalled();
//   });

//   it('should handle error during update', () => {
//     // Act
//     spyOn(globalService, 'getConfirmDialog').and.returnValue({
//       afterClosed: () => of({ data: 'yes' }),
//     } as any);

//     spyOn(service, 'updateStatus').and.returnValue(
//       throwError('Some error occurred.')
//     );

//     spyOn(globalService, 'openSnackBar');

//     spyOn(component, 'getDepartmentList');

//     if (
//       component.departmentGridConfig.actionButtons
//       && component.departmentGridConfig.actionButtons[1].callback
//     ) {
//       component.departmentGridConfig.actionButtons[1].callback(testRowData);
//     }
//     // Assert
//     expect(globalService.getConfirmDialog).toHaveBeenCalled();
//     expect(service.updateStatus).toHaveBeenCalledWith(14, false);
//     expect(globalService.openSnackBar).toHaveBeenCalledWith(
//       GLOBAL_CONSTANTS.COMMON_API_ERROR_MESSAGE,
//       'error-message'
//     );
//     expect(component.getDepartmentList).not.toHaveBeenCalled();
//   });
// });
