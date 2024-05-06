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
import { ItemTypeService } from '../../services/item.type.service';
import { ItemTypeComponent } from './item.type.component';
import { testResponse, testRowData, testSearchParam, testSortParam } from '../../constants/testData';
import { ROUTES } from '../../../../../../common/constants/routes';

describe('ItemTypeComponent', () => {
  let component: ItemTypeComponent;
  let service: ItemTypeService;
  let fixture: ComponentFixture<ItemTypeComponent>;
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
      declarations: [ItemTypeComponent],
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

    fixture = TestBed.createComponent(ItemTypeComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(ItemTypeService);
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

  it('should call onEnterPress in search name enter', () => {
    const consoleSpy = spyOn(component, 'getItemTypeList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getItemTypeList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click reset button', () => {
    const consoleSpy = spyOn(component, 'getItemTypeList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call updateStatusConfirmation on click on action button', () => {
    const consoleSpy = spyOn<any>(component, 'updateStatusConfirmation');
    if (
      component.itemTypeGridConfig.actionButtons
      && component.itemTypeGridConfig.actionButtons[1].callback
    ) {
      component.itemTypeGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit item type page on click on action button', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.itemTypeGridConfig.actionButtons
      && component.itemTypeGridConfig.actionButtons[0].callback
    ) {
      component.itemTypeGridConfig.actionButtons[0].callback(testRowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.EDIT_ITEM_TYPE_ABSOLUTE, 13]);
  });

  it('should navigate to add item type page on click on add button', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addItemType();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ADD_ITEM_TYPE_ABSOLUTE]);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getItemTypeList');
    if (component.itemTypeGridConfig.paginationCallBack) {
      component.itemTypeGridConfig.paginationCallBack(testSearchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getItemTypeList');
    if (component.itemTypeGridConfig.getSortOrderAndColumn) {
      component.itemTypeGridConfig.getSortOrderAndColumn(testSortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set itemTypeList and call setTableConfig on successful api response', () => {
    const mockResponse = {
      isSuccess: true,
      data: testResponse
    };

    jasmine.clock().install();
    spyOn(service, 'getItemType').and.returnValue(of(mockResponse));
    component.getItemTypeList();

    expect(component.isGridLoading).toBe(true);
    fixture.detectChanges();

    jasmine.clock().tick(300);
    expect(component.isGridLoading).toBe(false);
    expect(component.itemTypeList).toEqual(testResponse);
    jasmine.clock().uninstall();
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getItemType').and.returnValue(throwError('Some error'));
    component.getItemTypeList();
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should update status of item type when confirmation is "yes"', () => {
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'updateStatus').and.returnValue(of({ isSuccess: true }));
    spyOn(globalService, 'openSnackBar');
    spyOn(component, 'getItemTypeList');

    if (
      component.itemTypeGridConfig.actionButtons
      && component.itemTypeGridConfig.actionButtons[1].callback
    ) {
      component.itemTypeGridConfig.actionButtons[1].callback(testRowData);
    }

    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(13, false);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getItemTypeList).toHaveBeenCalled();
  });
});
