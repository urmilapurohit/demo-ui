import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { VendorService } from '../../services/vendor.service';
import { AddVendorComponent } from './add.vendor.component';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../common/common.module';
import { UIService } from '../../../../../../common/services/ui.service';
import { ROUTES } from '../../../../../../common/constants/routes';
import { addVendorData, vendorData } from '../../data/testData';

describe('AddVendorComponent', () => {
  let component: AddVendorComponent;
  let fixture: ComponentFixture<AddVendorComponent>;
  let router: Router;
  let service: VendorService;
  let uiService: jasmine.SpyObj<UIService>;
  let globalService: jasmine.SpyObj<GlobalService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule],
      providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
      declarations: [AddVendorComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddVendorComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    uiService = TestBed.inject(UIService) as jasmine.SpyObj<UIService>;
    service = TestBed.inject(VendorService);
    component = fixture.componentInstance;
    component.vendorId = '14';
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.isEdit = true;
    component.ngOnInit();
  });

  it('should call onSave Method on Save Button Click', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    component.saveButtonConfig.callback();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should navigate to vendor page  on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith(['/network/configure/vendor']);
  });

  it('should call onSave Method on Enter press name field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.name.onEnterPress) {
      component.name.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSave Method on Enter press status field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.status.onEnterPress) {
      component.status.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSave Method on Enter press phone number field', () => {
    component.ngOnInit();
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.phoneNumber.onEnterPress) {
      component.phoneNumber.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call getVendorById ', () => {
    const consoleSpy = spyOn(component, 'getVendorById');
    component.getVendorById(14);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should set form group values on successful response', () => {
    const id = 1;
    const mockVendorData = {
      isSuccess: true,
      data: addVendorData
    };
    spyOn(service, 'getVendorById').and.returnValue(of(mockVendorData));
    component.getVendorById(id);
    expect(service.getVendorById).toHaveBeenCalledWith(id);
    expect(component.addVendorFormGroup.value).toEqual(addVendorData);
  });

  it('should update vendor on valid form submission and navigate to the vendor route', fakeAsync(() => {
    component.addVendorFormGroup = new FormGroup({
      name: new FormControl(vendorData.name),
      address: new FormControl(vendorData.address),
      phoneNumber: new FormControl(vendorData.phoneNumber),
      status: new FormControl(vendorData.status),
    });

    component.isEdit = true;
    component.vendorId = '1';

    spyOn(service, 'updateVendor').and.returnValue(of({
      isSuccess: true,
      message: 'Vendor updated successfully',
      data: vendorData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Vendor updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.VENDOR.VENDOR_ABSOLUTE]);
  }));

  it('should add vendor on valid form submission ', fakeAsync(() => {
    component.addVendorFormGroup = new FormGroup({
      name: new FormControl(vendorData.name),
      address: new FormControl(vendorData.address),
      phoneNumber: new FormControl(vendorData.phoneNumber),
      status: new FormControl(vendorData.status),
    });

    component.isEdit = false;
    component.vendorId = '1';

    spyOn(service, 'addVendor').and.returnValue(of({
      isSuccess: true,
      message: 'Vendor add successfully',
      data: vendorData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Vendor add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.VENDOR.VENDOR_ABSOLUTE]);
  }));

  it('should handle error on vendor update', fakeAsync(() => {
    component.addVendorFormGroup = new FormGroup({
      name: new FormControl(vendorData.name),
      address: new FormControl(vendorData.address),
      phoneNumber: new FormControl(vendorData.phoneNumber),
      status: new FormControl(vendorData.status),
    });

    component.isEdit = true;
    component.vendorId = '14';

    spyOn(service, 'updateVendor').and.returnValue(throwError('Update failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should handle error on vendor add', fakeAsync(() => {
    component.addVendorFormGroup = new FormGroup({
      name: new FormControl(vendorData.name),
      address: new FormControl(vendorData.address),
      phoneNumber: new FormControl(vendorData.phoneNumber),
      status: new FormControl(vendorData.status),
    });

    component.isEdit = false;
    component.vendorId = '14';

    spyOn(service, 'addVendor').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should add vendor on valid form submission and navigate to the vendor route', fakeAsync(() => {
    component.addVendorFormGroup = new FormGroup({
      name: new FormControl(vendorData.name),
      address: new FormControl(vendorData.address),
      phoneNumber: new FormControl(vendorData.phoneNumber),
      status: new FormControl(vendorData.status),
    });

    component.isEdit = false;
    component.vendorId = '1';

    spyOn(service, 'addVendor').and.returnValue(of({
      isSuccess: true,
      message: 'Vendor add successfully',
      data: vendorData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    // Expectations
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Vendor add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.NETWORK.CONFIGURATION.VENDOR.VENDOR_ABSOLUTE]);
  }));

  it('should handle error when fetching vendor by ID', () => {
    spyOn(service, 'getVendorById').and.returnValue(throwError('Error fetching vendor'));
    component.getVendorById(14);
    expect(service.getVendorById).toHaveBeenCalledWith(14);
    expect(component.addVendorFormGroup.value).toEqual({
      name: '',
      address: '',
      phoneNumber: '',
      comments: ''
    });
  });

  it('should set form group values on successful response with truthy data', () => {
    const id = 10;
    const mockVendorData = {
      isSuccess: true,
      data: addVendorData
    };
    spyOn(service, 'getVendorById').and.returnValue(of(mockVendorData));
    component.getVendorById(id);
    expect(service.getVendorById).toHaveBeenCalledWith(id);
    expect(component.addVendorFormGroup.value).toEqual(addVendorData);
  });

  it('should set form group values on successful response with falsy data', () => {
    const id = 1;
    const mockVendorData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getVendorById').and.returnValue(of(mockVendorData));
    component.getVendorById(id);
    expect(service.getVendorById).toHaveBeenCalledWith(id);
    expect(component.addVendorFormGroup.value).toEqual({
      name: '',
      address: '',
      phoneNumber: '',
      comments: ''
    });
  });
});
