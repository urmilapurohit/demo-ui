import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../common/common.module';
import { PermissionService } from '../../../../../../common/services/permission.service';
import { StatusService } from '../../services/status.service';
import { StatusComponent } from './status.component';
import { ROUTES } from '../../../../../../common/constants/routes';
import { testResponse, testRowData, testSearchParam, testSortParam } from '../../data/testdata';
import { PageAccessTypes, Pages } from '../../../../../../common/constants/Enums';

describe('StatusComponent', () => {
    let component: StatusComponent;
    let fixture: ComponentFixture<StatusComponent>;
    let service: StatusService;
    let router: Router;
    let globalService: jasmine.SpyObj<GlobalService>;
    let permissionService: jasmine.SpyObj<PermissionService>;

    beforeEach(async () => {
        const permissionServiceSpy = jasmine.createSpyObj('PermissionService', ['checkAccessPermission']);
        permissionServiceSpy.checkAccessPermission.and.returnValue(true);

        await TestBed.configureTestingModule({
            declarations: [StatusComponent],
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

        fixture = TestBed.createComponent(StatusComponent);
        component = fixture.componentInstance;
        globalService = TestBed.inject(
            GlobalService
        ) as jasmine.SpyObj<GlobalService>;
        service = TestBed.inject(StatusService);
        permissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
        router = TestBed.get(Router);

        component.isAddPermission = permissionService.checkAccessPermission(Pages.PreSalesStatus, PageAccessTypes.Add);
        component.isEditPermission = permissionService.checkAccessPermission(Pages.PreSalesStatus, PageAccessTypes.Edit);
        component.isDeletePermission = permissionService.checkAccessPermission(Pages.PreSalesStatus, PageAccessTypes.Delete);
        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should call onEnterPress in search name enter', () => {
        const consoleSpy = spyOn(component, 'getStatusList');
        if (component.searchName.onEnterPress) {
            component.searchName.onEnterPress();
        }
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should call search method on click search button', () => {
        const consoleSpy = spyOn(component, 'getStatusList');
        component.searchBtnConfig.callback();
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should call resetFilter method on click Reset Button', () => {
        const consoleSpy = spyOn(component, 'getStatusList');
        component.resetBtnConfig.callback();
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should call delete Button confirmation on click on action button click', () => {
        const consoleSpy = spyOn<any>(component, 'deleteStatusRequest');
        if (
            component.statusGridConfig.actionButtons
            && component.statusGridConfig.actionButtons[1].callback
        ) {
            component.statusGridConfig.actionButtons[1].callback(testRowData);
        }
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should navigate to edit status page on click on edit button click', () => {
        const navigateSpy = spyOn(router, 'navigate');
        if (
            component.statusGridConfig.actionButtons
            && component.statusGridConfig.actionButtons[0].callback
        ) {
            component.statusGridConfig.actionButtons[0].callback(testRowData);
        }
        expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.STATUS.EDIT_STATUS_ABSOLUTE, 14]);
    });

    it('should navigate to add status page onn click on add button click', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.addStatus();
        expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.STATUS.ADD_STATUS_ABSOLUTE]);
    });

    it('should call pagination method on call back', () => {
        const spy = spyOn(component, 'getStatusList');
        if (component.statusGridConfig.paginationCallBack) {
            component.statusGridConfig.paginationCallBack(testSearchParam);
        }
        expect(spy).toHaveBeenCalled();
    });

    it('should call getSortOrderColumn method on call back', () => {
        const spy = spyOn(component, 'getStatusList');
        if (component.statusGridConfig.getSortOrderAndColumn) {
            component.statusGridConfig.getSortOrderAndColumn(testSortParam);
        }
        expect(spy).toHaveBeenCalled();
    });

    it('should set statusList and call setTableConfig on successful API response', () => {
        const mockResponse = { isSuccess: true, data: testResponse };
        spyOn(service, 'getStatuses').and.returnValue(of(mockResponse));
        component.getStatusList();
        expect(component.isGridLoading).toBe(true);
        fixture.detectChanges();
        expect(component.isGridLoading).toBe(true);
        expect(component.statusList).toEqual(testResponse);
    });

    it('should set isGridLoading to false on API error', () => {
        spyOn(service, 'getStatuses').and.returnValue(throwError('Some error'));
        component.getStatusList();
        expect(component.isGridLoading).toBe(false);
        fixture.detectChanges();
        expect(component.isGridLoading).toBe(false);
    });

    it('should delete status when confirmation is "yes"', () => {
        spyOn(globalService, 'getConfirmDialog').and.returnValue({
            afterClosed: () => of({ data: 'yes' }),
        } as any);

        spyOn(service, 'deleteStatus').and.returnValue(of({ isSuccess: true }));

        spyOn(globalService, 'openSnackBar');

        spyOn(component, 'getStatusList');

        if (
            component.statusGridConfig.actionButtons
            && component.statusGridConfig.actionButtons[1].callback
        ) {
            component.statusGridConfig.actionButtons[1].callback(testRowData);
        }
        expect(globalService.getConfirmDialog).toHaveBeenCalled();
        expect(service.deleteStatus).toHaveBeenCalledWith(14);
        expect(globalService.openSnackBar).toHaveBeenCalled();
        expect(component.getStatusList).toHaveBeenCalled();
    });

    it('should handle error during delete', () => {
        spyOn(globalService, 'getConfirmDialog').and.returnValue({
            afterClosed: () => of({ data: 'yes' }),
        } as any);

        spyOn(service, 'deleteStatus').and.returnValue(
            throwError('Some error occurred.')
        );

        spyOn(component, 'getStatusList');

        if (
            component.statusGridConfig.actionButtons
            && component.statusGridConfig.actionButtons[1].callback
        ) {
            component.statusGridConfig.actionButtons[1].callback(testRowData);
        }
        expect(globalService.getConfirmDialog).toHaveBeenCalled();
        expect(service.deleteStatus).toHaveBeenCalledWith(14);
        expect(component.getStatusList).not.toHaveBeenCalled();
    });
});
