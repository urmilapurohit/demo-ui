import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Router } from '@angular/router';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreModule } from '../../../../../../common/common.module';
import { testItemTypeData } from '../../constants/testData';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { ItemTypeService } from '../../services/item.type.service';
import { AddItemTypeComponent } from './add.item.type.component';
import { ROUTES } from '../../../../../../common/constants/routes';

describe('AddItemTypeComponent', () => {
  let component: AddItemTypeComponent;
  let fixture: ComponentFixture<AddItemTypeComponent>;
  let router: Router;
  let service: ItemTypeService;
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
        HttpClientModule],
      providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
      declarations: [AddItemTypeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddItemTypeComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(ItemTypeService);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.isEdit = true;
    component.ngOnInit();
  });

  it('should call onSave method on save button click', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    component.saveButtonConfig.callback();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should be navigate to item type page on cancel button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ITEM_TYPE_ABSOLUTE]);
  });

  it('should call getItemTypeById', () => {
    const consoleSpy = spyOn(component, 'getItemTypeById');
    component.getItemTypeById(2);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should set form group values on successful response with truthy data', () => {
    const id = 4;
    const mockItemTypeData = {
      isSuccess: true,
      data: testItemTypeData
    };
    spyOn(service, 'getItemTypeById').and.returnValue(of(mockItemTypeData));
    component.getItemTypeById(id);
    expect(service.getItemTypeById).toHaveBeenCalledWith(id);

    expect(component.addItemTypeForm.value.name).toEqual(testItemTypeData.name);
    expect(component.addItemTypeForm.value.description).toEqual(testItemTypeData.description);
    expect(component.addItemTypeForm.value.isSerial).toEqual(true);
  });

  it('should set form group values on successful response with falsy data', () => {
    const mockItemTypeData = {
      isSuccess: true,
      data: null
    };

    spyOn(service, 'getItemTypeById').and.returnValue(of(mockItemTypeData));
    expect(component.addItemTypeForm.value.name).toEqual('');
    expect(component.addItemTypeForm.value.description).toEqual('');
    expect(component.addItemTypeForm.value.isSerial).toEqual(true);
  });

  it('should handle error when fetching item type by id', () => {
    spyOn(service, 'getItemTypeById').and.returnValue(throwError('Error on fetching item type'));
    component.getItemTypeById(4);

    expect(service.getItemTypeById).toHaveBeenCalledWith(4);
    expect(component.addItemTypeForm.value).toEqual({
      name: "",
      description: "",
      isSerial: true
    });
  });

  it('should update item type on valid form submission and navigate to the item type route', fakeAsync(() => {
    component.addItemTypeForm = new FormGroup({
      name: new FormControl(testItemTypeData.name),
      description: new FormControl(testItemTypeData.description),
      status: new FormControl(testItemTypeData.isActive),
      isSerial: new FormControl(testItemTypeData.isSerialRequired)
    });

    component.isEdit = true;
    component.itemTypeId = '1';

    spyOn(service, 'updateItemType').and.returnValue(of({
      isSuccess: true,
      message: 'item type updated successfully',
      data: testItemTypeData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();
    tick();
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('item type updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ITEM_TYPE_ABSOLUTE]);
  }));

  it('should add item type on valid form submission and navigate to the item type route', fakeAsync(() => {
    component.addItemTypeForm = new FormGroup({
      name: new FormControl(testItemTypeData.name),
      description: new FormControl(testItemTypeData.description),
      status: new FormControl(testItemTypeData.isActive),
      isSerial: new FormControl(testItemTypeData.isSerialRequired)
    });

    component.isEdit = false;
    component.itemTypeId = '1';

    spyOn(service, 'addItemType').and.returnValue(of({
      isSuccess: true,
      message: 'item type added successfully',
      data: testItemTypeData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('item type added successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ITEM_TYPE_ABSOLUTE]);
  }));

  it('should handle error on item type update', fakeAsync(() => {
    component.addItemTypeForm = new FormGroup({
      name: new FormControl(testItemTypeData.name),
      description: new FormControl(testItemTypeData.description),
      status: new FormControl(testItemTypeData.isActive),
      isSerial: new FormControl(testItemTypeData.isSerialRequired)
    });

    component.isEdit = true;
    component.itemTypeId = '2';

    spyOn(service, 'updateItemType').and.returnValue(throwError('Update failed'));
    component.saveButtonConfig.callback();
    tick();
    expect(component.loading).toBeFalse();
  }));

  it('should handle error on item type add', fakeAsync(() => {
    component.addItemTypeForm = new FormGroup({
      name: new FormControl(testItemTypeData.name),
      description: new FormControl(testItemTypeData.description),
      status: new FormControl(testItemTypeData.isActive),
      isSerial: new FormControl(testItemTypeData.isSerialRequired)
    });

    component.isEdit = false;
    component.itemTypeId = '2';

    spyOn(service, 'addItemType').and.returnValue(throwError('Add failed'));
    component.saveButtonConfig.callback();
    tick();
    expect(component.loading).toBeFalse();
  }));
});
