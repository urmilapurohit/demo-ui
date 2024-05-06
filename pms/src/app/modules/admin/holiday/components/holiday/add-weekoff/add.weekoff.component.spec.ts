import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Router } from '@angular/router';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { HolidayService } from '../../../services/holiday.service';
import { AddWeekoffComponent } from './add.weekoff.component';
import { AppRoutingModule } from '../../../../../../app-routing.module';
import { CoreModule } from '../../../../../../common/common.module';
import { ROUTES } from '../../../../../../common/constants/routes';
import { weekOffData } from '../../../data/testData';

describe('AddWeekoffComponent', () => {
  let component: AddWeekoffComponent;
  let fixture: ComponentFixture<AddWeekoffComponent>;
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
      declarations: [AddWeekoffComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddWeekoffComponent);
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(HolidayService);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
  });

  it('should call onSave Method on Save Button Click', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    component.saveButtonConfig.callback();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call onSave Method on Enter press name field', () => {
    const saveSpy = spyOn<any>(component, 'OnSave');
    if (component.date.onEnterPress) {
      component.date.onEnterPress('OnSave');
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should navigate to holiday page on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.HOLIDAY.HOLIDAY_ABSOLUTE]);
  });

  it('should add weekoff on valid form submission ', fakeAsync(() => {
    component.addWeekoffForm = new FormGroup({
      date: new FormControl(weekOffData.year)
    });

    component.submitted = true;

    spyOn(service, 'addWeekOff').and.returnValue(of({
      isSuccess: true,
      message: 'Week-off add successfully',
      data: weekOffData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.HOLIDAY.HOLIDAY_ABSOLUTE]);
  }));

  it('should handle error on weekoff add', fakeAsync(() => {
    component.addWeekoffForm = new FormGroup({
      date: new FormControl(weekOffData.year)
    });

    component.submitted = true;

    spyOn(service, 'addWeekOff').and.returnValue(throwError('add failed'));

    component.saveButtonConfig.callback();

    tick();

    expect(component.loading).toBeFalse();
  }));

  it('should add weekoff on valid form submission and navigate to the holiday route', fakeAsync(() => {
    component.addWeekoffForm = new FormGroup({
      date: new FormControl(weekOffData.year)
    });

    component.submitted = true;

    spyOn(service, 'addWeekOff').and.returnValue(of({
      isSuccess: true,
      message: 'Week-off add successfully',
      data: weekOffData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();

    tick();

    // Expectations
    expect(component.loading).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.HOLIDAY.HOLIDAY_ABSOLUTE]);
  }));
});
