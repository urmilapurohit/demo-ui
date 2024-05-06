import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../common/common.module';
import { testStatusData } from '../../data/testdata';
import { StatusService } from '../../services/status.service';
import { AddStatusComponent } from './add.status.component';
import { ROUTES } from '../../../../../../common/constants/routes';

describe('AddStatusComponent', () => {
  let component: AddStatusComponent;
  let fixture: ComponentFixture<AddStatusComponent>;
  let router: Router;
  let service: StatusService;
  let globalService: jasmine.SpyObj<GlobalService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddStatusComponent],
      imports: [
        HttpClientTestingModule,
        WorkspaceLibraryModule,
        CoreModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule
      ],
      providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddStatusComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(StatusService);
    component = fixture.componentInstance;
    component.statusId = '14';
    component = fixture.componentInstance;
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

  it('should navigate to status page  on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.STATUS.STATUS_ABSOLUTE]);
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
    if (component.displayOrder.onEnterPress) {
      component.displayOrder.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSave Method on Enter press sen mail to others field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.sendStatusChangeMailToOtherMemberIds.onEnterPress) {
      component.sendStatusChangeMailToOtherMemberIds.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call getStatusById ', () => {
    const consoleSpy = spyOn(component, 'getStatusById');
    component.getStatusById(14);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should set form group values on successful response', () => {
    const id = 18;
    const mockStatusData = {
      isSuccess: true,
      data: testStatusData
    };
    spyOn(service, 'getStatusById').and.returnValue(of(mockStatusData));
    component.getStatusById(id);
    expect(service.getStatusById).toHaveBeenCalledWith(id);
  });

  it('should update pre-sales status on valid form submission and navigate to the status route', fakeAsync(() => {
    component.addStatusFormGroup = new FormGroup({
      name: new FormControl(testStatusData.name),
      displayOrder: new FormControl(testStatusData.displayOrder),
      isVisibleInBde: new FormControl(testStatusData.isVisibleInBde),
      isVisibleInBa: new FormControl(testStatusData.isVisibleInBa),
      isOpenInquiry: new FormControl(testStatusData.isOpenInquiry),
      isEstimationDateRequired: new FormControl(testStatusData.isEstimationDateRequired),
      isSendStatusChangeMail: new FormControl(testStatusData.isSendStatusChangeMail),
      isSendStatusChangeMailToBde: new FormControl(testStatusData.isSendStatusChangeMailToBde),
      isSendStatusChangeMailToBa: new FormControl(testStatusData.isSendStatusChangeMailToBa),
      isSendStatusChangeMailToPreSalesAdmin: new FormControl(testStatusData.isSendStatusChangeMailToPreSalesAdmin),
      sendStatusChangeMailToOtherMemberIds: new FormControl(testStatusData.sendStatusChangeMailToOtherMemberIds)
    });

    component.isEdit = true;
    component.statusId = '1';

    spyOn(service, 'updateStatus').and.returnValue(of({
      isSuccess: true,
      message: 'Status updated successfully',
      data: testStatusData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Status updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.STATUS.STATUS_ABSOLUTE]);
  }));

  it('should add status on valid form submission ', fakeAsync(() => {
    component.addStatusFormGroup = new FormGroup({
      name: new FormControl(testStatusData.name),
      displayOrder: new FormControl(testStatusData.displayOrder),
      isVisibleInBde: new FormControl(testStatusData.isVisibleInBde),
      isVisibleInBa: new FormControl(testStatusData.isVisibleInBa),
      isOpenInquiry: new FormControl(testStatusData.isOpenInquiry),
      isEstimationDateRequired: new FormControl(testStatusData.isEstimationDateRequired),
      isSendStatusChangeMail: new FormControl(testStatusData.isSendStatusChangeMail),
      isSendStatusChangeMailToBde: new FormControl(testStatusData.isSendStatusChangeMailToBde),
      isSendStatusChangeMailToBa: new FormControl(testStatusData.isSendStatusChangeMailToBa),
      isSendStatusChangeMailToPreSalesAdmin: new FormControl(testStatusData.isSendStatusChangeMailToPreSalesAdmin),
      sendStatusChangeMailToOtherMemberIds: new FormControl(testStatusData.sendStatusChangeMailToOtherMemberIds)
    });

    component.isEdit = false;
    component.statusId = '1';

    spyOn(service, 'addStatus').and.returnValue(of({
      isSuccess: true,
      message: 'Presales status add successfully',
      data: testStatusData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Presales status add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.STATUS.STATUS_ABSOLUTE]);
  }));

  it('should handle error on status add', fakeAsync(() => {
    component.addStatusFormGroup = new FormGroup({
      name: new FormControl(testStatusData.name),
      displayOrder: new FormControl(testStatusData.displayOrder),
      isVisibleInBde: new FormControl(testStatusData.isVisibleInBde),
      isVisibleInBa: new FormControl(testStatusData.isVisibleInBa),
      isOpenInquiry: new FormControl(testStatusData.isOpenInquiry),
      isEstimationDateRequired: new FormControl(testStatusData.isEstimationDateRequired),
      isSendStatusChangeMail: new FormControl(testStatusData.isSendStatusChangeMail),
      isSendStatusChangeMailToBde: new FormControl(testStatusData.isSendStatusChangeMailToBde),
      isSendStatusChangeMailToBa: new FormControl(testStatusData.isSendStatusChangeMailToBa),
      isSendStatusChangeMailToPreSalesAdmin: new FormControl(testStatusData.isSendStatusChangeMailToPreSalesAdmin),
      sendStatusChangeMailToOtherMemberIds: new FormControl(testStatusData.sendStatusChangeMailToOtherMemberIds)
    });

    component.isEdit = false;
    component.statusId = '1';

    spyOn(service, 'addStatus').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should handle error on status update', fakeAsync(() => {
    component.addStatusFormGroup = new FormGroup({
      name: new FormControl(testStatusData.name),
      displayOrder: new FormControl(testStatusData.displayOrder),
      isVisibleInBde: new FormControl(testStatusData.isVisibleInBde),
      isVisibleInBa: new FormControl(testStatusData.isVisibleInBa),
      isOpenInquiry: new FormControl(testStatusData.isOpenInquiry),
      isEstimationDateRequired: new FormControl(testStatusData.isEstimationDateRequired),
      isSendStatusChangeMail: new FormControl(testStatusData.isSendStatusChangeMail),
      isSendStatusChangeMailToBde: new FormControl(testStatusData.isSendStatusChangeMailToBde),
      isSendStatusChangeMailToBa: new FormControl(testStatusData.isSendStatusChangeMailToBa),
      isSendStatusChangeMailToPreSalesAdmin: new FormControl(testStatusData.isSendStatusChangeMailToPreSalesAdmin),
      sendStatusChangeMailToOtherMemberIds: new FormControl(testStatusData.sendStatusChangeMailToOtherMemberIds)
    });

    component.isEdit = true;
    component.statusId = '1';

    spyOn(service, 'updateStatus').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should add status on valid form submission and navigate to the status route', fakeAsync(() => {
    component.addStatusFormGroup = new FormGroup({
      name: new FormControl(testStatusData.name),
      displayOrder: new FormControl(testStatusData.displayOrder),
      isVisibleInBde: new FormControl(testStatusData.isVisibleInBde),
      isVisibleInBa: new FormControl(testStatusData.isVisibleInBa),
      isOpenInquiry: new FormControl(testStatusData.isOpenInquiry),
      isEstimationDateRequired: new FormControl(testStatusData.isEstimationDateRequired),
      isSendStatusChangeMail: new FormControl(testStatusData.isSendStatusChangeMail),
      isSendStatusChangeMailToBde: new FormControl(testStatusData.isSendStatusChangeMailToBde),
      isSendStatusChangeMailToBa: new FormControl(testStatusData.isSendStatusChangeMailToBa),
      isSendStatusChangeMailToPreSalesAdmin: new FormControl(testStatusData.isSendStatusChangeMailToPreSalesAdmin),
      sendStatusChangeMailToOtherMemberIds: new FormControl(testStatusData.sendStatusChangeMailToOtherMemberIds)
    });

    component.isEdit = false;
    component.statusId = '1';

    spyOn(service, 'addStatus').and.returnValue(of({
      isSuccess: true,
      message: 'Pre-sales status added successfully',
      data: testStatusData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Pre-sales status added successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.PRE_SALES.CONFIGURATION.STATUS.STATUS_ABSOLUTE]);
  }));

  it('should set form group values on successful response with truthy data', () => {
    const id = 14;
    const mockStatusData = {
      isSuccess: true,
      data: testStatusData
    };
    spyOn(service, 'getStatusById').and.returnValue(of(mockStatusData));
    component.getStatusById(id);
    expect(service.getStatusById).toHaveBeenCalledWith(id);
    expect(component.addStatusFormGroup.value).toEqual({
      name: testStatusData.name,
      displayOrder: testStatusData.displayOrder,
      isVisibleInBde: testStatusData.isVisibleInBde,
      isVisibleInBa: testStatusData.isVisibleInBa,
      isOpenInquiry: testStatusData.isOpenInquiry,
      isEstimationDateRequired: testStatusData.isEstimationDateRequired,
      isSendStatusChangeMail: testStatusData.isSendStatusChangeMail,
      isSendStatusChangeMailToBde: testStatusData.isSendStatusChangeMailToBde,
      isSendStatusChangeMailToBa: testStatusData.isSendStatusChangeMailToBa,
      isSendStatusChangeMailToPreSalesAdmin: testStatusData.isSendStatusChangeMailToPreSalesAdmin,
      sendStatusChangeMailToOtherMemberIds: testStatusData.sendStatusChangeMailToOtherMemberIds
    });
  });

  it('should set form group values on successful response with falsy data', () => {
    const id = 1;
    const mockStatusData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getStatusById').and.returnValue(of(mockStatusData));
    component.getStatusById(id);
    expect(service.getStatusById).toHaveBeenCalledWith(id);
    expect(component.addStatusFormGroup.value).toEqual({
      name: "",
      displayOrder: null,
      isVisibleInBde: false,
      isVisibleInBa: false,
      isOpenInquiry: false,
      isEstimationDateRequired: false,
      isSendStatusChangeMail: false,
      isSendStatusChangeMailToBde: false,
      isSendStatusChangeMailToBa: false,
      isSendStatusChangeMailToPreSalesAdmin: false,
      sendStatusChangeMailToOtherMemberIds: ""
    });
  });
});
