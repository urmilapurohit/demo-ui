import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemModelService } from '../../services/item.model.service';
import { ROUTES } from '../../../../../../common/constants/routes';
import { testItemModelData } from '../../constants/testData';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../common/common.module';
import { AddItemModelComponent } from './add.item.model.component';

describe('AddItemModelComponent', () => {
  let component: AddItemModelComponent;
  let fixture: ComponentFixture<AddItemModelComponent>;
  let router: Router;
  let service: ItemModelService;
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
      declarations: [AddItemModelComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddItemModelComponent);
    component = fixture.componentInstance;
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(ItemModelService);
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

  it('should be navigate to item model page on cancel button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL_ABSOLUTE]);
  });

  it('should call getModelTypeById', () => {
    const consoleSpy = spyOn(component, 'getItemModelById');
    component.getItemModelById(2);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call getItemTypeList', () => {
    const consoleSpy = spyOn(component, 'getItemTypeList');
    component.getItemTypeList();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should set form group values on successful response with truly data', () => {
    const id = 3;
    const mockItemModelData = {
      isSuccess: true,
      data: testItemModelData
    };
    spyOn(service, 'getItemModelById').and.returnValue(of(mockItemModelData));
    component.getItemModelById(id);
    expect(service.getItemModelById).toHaveBeenCalledWith(id);

    expect(component.addItemModelForm.value.networkItemType).toEqual(testItemModelData.networkItemTypeId);
    expect(component.addItemModelForm.value.name).toEqual(testItemModelData.name);
    expect(component.addItemModelForm.value.description).toEqual(testItemModelData.description);
  });

  it('should set form group values on successful response with false data', () => {
    const mockItemModelData = {
      isSuccess: true,
      data: null
    };

    spyOn(service, 'getItemModelById').and.returnValue(of(mockItemModelData));
    expect(component.addItemModelForm.value.networkItemType).toEqual("");
    expect(component.addItemModelForm.value.name).toEqual('');
    expect(component.addItemModelForm.value.description).toEqual('');
  });

  it('should handle error when fetching item model by id', () => {
    spyOn(service, 'getItemModelById').and.returnValue(throwError('Error on fetching item model'));
    component.getItemModelById(4);

    expect(service.getItemModelById).toHaveBeenCalledWith(4);
    expect(component.addItemModelForm.value).toEqual({
      networkItemType: "",
      name: "",
      description: "",
    });
  });

  it('should update item model on valid form submission and navigate to item model route', fakeAsync(() => {
    component.addItemModelForm = new FormGroup({
      networkItemType: new FormControl(testItemModelData.networkItemTypeId),
      name: new FormControl(testItemModelData.name),
      description: new FormControl(testItemModelData.description),
      status: new FormControl(testItemModelData.isActive),
    });

    component.isEdit = true;
    component.itemModelId = '1';

    spyOn(service, 'updateItemModel').and.returnValue(of({
      isSuccess: true,
      message: 'item model updated successfully',
      data: testItemModelData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('item model updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL_ABSOLUTE]);
  }));

  it('should add item model on valid form submission and navigate to item model route', fakeAsync(() => {
    component.addItemModelForm = new FormGroup({
      networkItemType: new FormControl(testItemModelData.networkItemTypeId),
      name: new FormControl(testItemModelData.name),
      description: new FormControl(testItemModelData.description),
      status: new FormControl(testItemModelData.isActive),
    });

    component.isEdit = false;
    component.itemModelId = '1';

    spyOn(service, 'addItemModel').and.returnValue(of({
      isSuccess: true,
      message: 'item model added successfully',
      data: testItemModelData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('item model added successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL_ABSOLUTE]);
  }));

  it('should handle error on item type update', fakeAsync(() => {
    component.addItemModelForm = new FormGroup({
      networkItemType: new FormControl(testItemModelData.networkItemTypeId),
      name: new FormControl(testItemModelData.name),
      description: new FormControl(testItemModelData.description),
      status: new FormControl(testItemModelData.isActive),
    });

    component.isEdit = true;
    component.itemModelId = '2';

    spyOn(service, 'updateItemModel').and.returnValue(throwError('Update Failed'));
    component.saveButtonConfig.callback();
    tick();
    expect(component.loading).toBeFalse();
  }));

  it('should handle error on item type add', fakeAsync(() => {
    component.addItemModelForm = new FormGroup({
      networkItemType: new FormControl(testItemModelData.networkItemTypeId),
      name: new FormControl(testItemModelData.name),
      description: new FormControl(testItemModelData.description),
      status: new FormControl(testItemModelData.isActive),
    });

    component.isEdit = false;
    component.itemModelId = '2';

    spyOn(service, 'addItemModel').and.returnValue(throwError('Add Failed'));
    component.saveButtonConfig.callback();
    tick();
    expect(component.loading).toBeFalse();
  }));
});
