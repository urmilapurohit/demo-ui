import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../common/common.module';
import { ItemModelService } from '../../services/item.model.service';
import { ItemModelComponent } from './item.model.component';
import { testResponse, testRowData, testSearchParam, testSortParam } from '../../constants/testData';
import { ROUTES } from '../../../../../../common/constants/routes';

describe('ItemModelComponent', () => {
  let component: ItemModelComponent;
  let fixture: ComponentFixture<ItemModelComponent>;
  let service: ItemModelService;
  let router: Router;
  let globalService: jasmine.SpyObj<GlobalService>;

  beforeEach(async () => {
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
      declarations: [ItemModelComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ afterClosed: () => of({ data: 'yes' }) }),
          },
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ItemModelComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(ItemModelService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.isAddPermission = true;
    component.isDeletePermission = true;
    component.isEditPermission = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call getItemTypeList', () => {
    const consoleSpy = spyOn(component, 'getItemTypeList');
    component.getItemTypeList();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getItemModelList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getItemModelList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call updateStatusConfirmation on click on action button', () => {
    const consoleSpy = spyOn<any>(component, 'updateStatusConfirmation');
    if (
      component.itemModelGridConfig.actionButtons
      && component.itemModelGridConfig.actionButtons[1].callback
    ) {
      component.itemModelGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit item model page on click on action button', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.itemModelGridConfig.actionButtons
      && component.itemModelGridConfig.actionButtons[0].callback
    ) {
      component.itemModelGridConfig.actionButtons[0].callback(testRowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.EDIT_ITEM_MODEL_ABSOLUTE, 8]);
  });

  it('should navigate to add item model page on click on add button', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addItemModel();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ADD_ITEM_MODEL_ABSOLUTE]);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getItemModelList');
    if (component.itemModelGridConfig.paginationCallBack) {
      component.itemModelGridConfig.paginationCallBack(testSearchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getItemModelList');
    if (component.itemModelGridConfig.getSortOrderAndColumn) {
      component.itemModelGridConfig.getSortOrderAndColumn(testSortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set itemModelList and call setTableConfig on successful api response', () => {
    const mockResponse = {
      isSuccess: true,
      data: testResponse
    };

    jasmine.clock().install();
    spyOn(service, 'getItemModel').and.returnValue(of(mockResponse));
    component.getItemModelList();

    expect(component.isGridLoading).toBe(true);
    fixture.detectChanges();

    jasmine.clock().tick(300);
    expect(component.isGridLoading).toBe(false);
    expect(component.itemModelList).toEqual(testResponse);
    jasmine.clock().uninstall();
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getItemModel').and.returnValue(throwError('Some error'));
    component.getItemModelList();
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should update status of item model when confirmation is "yes"', () => {
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'updateStatus').and.returnValue(of({ isSuccess: true }));
    spyOn(globalService, 'openSnackBar');
    spyOn(component, 'getItemModelList');

    if (
      component.itemModelGridConfig.actionButtons
      && component.itemModelGridConfig.actionButtons[1].callback
    ) {
      component.itemModelGridConfig.actionButtons[1].callback(testRowData);
    }

    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(8, false);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getItemModelList).toHaveBeenCalled();
  });
});
