import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { ROUTES } from '../../../../../../common/constants/routes';
import { addPublicHolidayData, holidayData } from '../../../data/testData';
import { HolidayService } from '../../../services/holiday.service';
import { AddPublicHolidayComponent } from './add.public.holiday.component';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../common/common.module';

describe('AddPublicHolidayComponent', () => {
  let component: AddPublicHolidayComponent;
  let fixture: ComponentFixture<AddPublicHolidayComponent>;
  let router: Router;
  let service: HolidayService;
  let globalService: jasmine.SpyObj<GlobalService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WorkspaceLibraryModule, CoreModule, BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule],
      providers: [{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },],
      declarations: [AddPublicHolidayComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddPublicHolidayComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(HolidayService);
    component = fixture.componentInstance;
    component.holidayId = '15';
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

  it('should navigate to holiday page on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.HOLIDAY.HOLIDAY_ABSOLUTE]);
  });

  it('should call onSave Method on Enter press name field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.name.onEnterPress) {
      component.name.onEnterPress();
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSave Method on Enter press date field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.date.onEnterPress) {
      component.date.onEnterPress('OnSave');
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call getPublicHolidayById ', () => {
    const consoleSpy = spyOn(component, 'getPublicHolidayById');
    component.getPublicHolidayById(15);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should set form group values on successful response', () => {
    const id = 1;
    const mockPublicHolidayData = {
      isSuccess: true,
      data: addPublicHolidayData
    };
    spyOn(service, 'getPublicHolidayById').and.returnValue(of(mockPublicHolidayData));
    component.getPublicHolidayById(id);
    expect(service.getPublicHolidayById).toHaveBeenCalledWith(id);
    expect(component.addPublicHolidayForm.value).toEqual(holidayData);
  });

  it('should update public holiday on valid form submission and navigate to the holiday route', fakeAsync(() => {
    component.addPublicHolidayForm = new FormGroup({
      name: new FormControl(holidayData.name),
      date: new FormControl(holidayData.date)
    });

    component.isEdit = true;
    component.holidayId = '15';

    spyOn(service, 'updatePublicHoliday').and.returnValue(of({
      isSuccess: true,
      message: 'Public Holiday updated successfully',
      data: holidayData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Public Holiday updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.HOLIDAY.HOLIDAY_ABSOLUTE]);
  }));

  it('should add public holiday on valid form submission ', fakeAsync(() => {
    component.addPublicHolidayForm = new FormGroup({
      name: new FormControl(holidayData.name),
      date: new FormControl(holidayData.date)
    });

    component.isEdit = false;
    component.holidayId = '15';

    spyOn(service, 'addPublicHoliday').and.returnValue(of({
      isSuccess: true,
      message: 'Public Holiday add successfully',
      data: holidayData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Public Holiday add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.HOLIDAY.HOLIDAY_ABSOLUTE]);
  }));

  it('should handle error on public holiday update', fakeAsync(() => {
    component.addPublicHolidayForm = new FormGroup({
      name: new FormControl(holidayData.name),
      date: new FormControl(holidayData.date)
    });

    component.isEdit = true;
    component.holidayId = '15';

    spyOn(service, 'updatePublicHoliday').and.returnValue(throwError('Update failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should handle error on public holiday add', fakeAsync(() => {
    component.addPublicHolidayForm = new FormGroup({
      name: new FormControl(holidayData.name),
      date: new FormControl(holidayData.date)
    });

    component.isEdit = false;
    component.holidayId = '15';

    spyOn(service, 'addPublicHoliday').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should add public holiday on valid form submission and navigate to the holiday route', fakeAsync(() => {
    component.addPublicHolidayForm = new FormGroup({
      name: new FormControl(holidayData.name),
      date: new FormControl(holidayData.date)
    });

    component.isEdit = false;
    component.holidayId = '15';

    spyOn(service, 'addPublicHoliday').and.returnValue(of({
      isSuccess: true,
      message: 'Public Holiday add successfully',
      data: holidayData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    // Expectations
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('Public Holiday add successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.HOLIDAY.HOLIDAY_ABSOLUTE]);
  }));

  it('should handle error when fetching public holiday by ID', () => {
    spyOn(service, 'getPublicHolidayById').and.returnValue(throwError('Error fetching public holiday'));
    component.getPublicHolidayById(15);
    expect(service.getPublicHolidayById).toHaveBeenCalledWith(15);
    expect(component.addPublicHolidayForm.value).toEqual({
      name: '',
      date: ''
    });
  });

  it('should set form group values on successful response with truthy data', () => {
    const id = 12;
    const mockPublicHolidayData = {
      isSuccess: true,
      data: addPublicHolidayData
    };
    spyOn(service, 'getPublicHolidayById').and.returnValue(of(mockPublicHolidayData));
    component.getPublicHolidayById(id);
    expect(service.getPublicHolidayById).toHaveBeenCalledWith(id);
    expect(component.addPublicHolidayForm.value).toEqual(holidayData);
  });

  it('should set form group values on successful response with falsy data', () => {
    const id = 1;
    const mockPublicHolidayData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getPublicHolidayById').and.returnValue(of(mockPublicHolidayData));
    component.getPublicHolidayById(id);
    expect(service.getPublicHolidayById).toHaveBeenCalledWith(id);
    expect(component.addPublicHolidayForm.value).toEqual({
      name: '',
      date: ''
    });
  });
});
