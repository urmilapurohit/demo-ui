import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddNewsEventComponent } from './add.news.event.component';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { CoreModule } from '../../../../../common/common.module';
import { NewsEventService } from '../../services/news.event.service';
import { ROUTES } from '../../../../../common/constants/routes';
import { testNewsEventData } from '../../data/testData';

describe('AddNewsEventComponent', () => {
  let component: AddNewsEventComponent;
  let fixture: ComponentFixture<AddNewsEventComponent>;
  let router: Router;
  let service: NewsEventService;
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
      declarations: [AddNewsEventComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddNewsEventComponent);
    component = fixture.componentInstance;
    component.newsEventId = '13';
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(NewsEventService);
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

  it('should navigate to news event page  on cancel Button Click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.cancelButtonConfig.callback();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.NEWS_EVENT.NEWS_EVENT_ABSOLUTE]);
  });

  it('should call getNewsEventById ', () => {
    const consoleSpy = spyOn(component, 'getNewsEventById');
    component.getNewsEventById(13);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should set form group values on successful response with truthy data', () => {
    const id = 4;
    const mockNewsEventData = {
      isSuccess: true,
      data: testNewsEventData
    };
    spyOn(service, 'getNewsEventById').and.returnValue(of(mockNewsEventData));
    component.getNewsEventById(id);
    expect(service.getNewsEventById).toHaveBeenCalledWith(id);

    expect(component.addNewsEventForm.value.title).toEqual(testNewsEventData.title);
    expect(component.addNewsEventForm.value.startDate).toEqual(testNewsEventData.startDate);
    expect(component.addNewsEventForm.value.endDate).toEqual(testNewsEventData.endDate);
  });

  it('should set form group values on successful response with falsy data', () => {
    const mockNewsEventData = {
      isSuccess: true,
      data: null
    };
    spyOn(service, 'getNewsEventById').and.returnValue(of(mockNewsEventData));

    expect(component.addNewsEventForm.value.title).toEqual('');
    expect(component.addNewsEventForm.value.startDate).toEqual('');
    expect(component.addNewsEventForm.value.endDate).toEqual('');
  });

  it('should handle error when fetching news event by id', () => {
    spyOn(service, 'getNewsEventById').and.returnValue(throwError('Error on fetching news event'));
    component.getNewsEventById(4);

    expect(service.getNewsEventById).toHaveBeenCalledWith(4);
    expect(component.addNewsEventForm.value).toEqual({
      title: "",
      startDate: "",
      endDate: ""
    });
  });

  it('should update news event on valid form submission and navigate to the news event route', fakeAsync(() => {
    component.addNewsEventForm = new FormGroup({
      title: new FormControl(testNewsEventData.title),
      startDate: new FormControl(testNewsEventData.startDate),
      endDate: new FormControl(testNewsEventData.endDate),
      status: new FormControl(testNewsEventData.isActive),
    });

    component.isEdit = true;
    component.newsEventId = '1';

    spyOn(service, 'updateNewsEvent').and.returnValue(of({
      isSuccess: true,
      message: 'news event updated successfully',
      data: testNewsEventData
    }));

    spyOn(globalService, 'openSnackBar');

    const navigateSpy = spyOn(router, 'navigate');

    component.saveButtonConfig.callback();
    tick();
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('news event updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.NEWS_EVENT.NEWS_EVENT_ABSOLUTE]);
  }));

  it('should add news event on valid form submission and navigate to the news event route', fakeAsync(() => {
    component.addNewsEventForm = new FormGroup({
      title: new FormControl(testNewsEventData.title),
      startDate: new FormControl(testNewsEventData.startDate),
      endDate: new FormControl(testNewsEventData.endDate),
      status: new FormControl(testNewsEventData.isActive),
    });

    component.isEdit = false;
    component.newsEventId = '1';

    spyOn(service, 'addNewsEvent').and.returnValue(of({
      isSuccess: true,
      message: 'news event added successfully',
      data: testNewsEventData
    }));

    spyOn(globalService, 'openSnackBar');
    const navigateSpy = spyOn(router, 'navigate');
    component.saveButtonConfig.callback();

    tick();
    expect(component.loading).toBeFalse();
    expect(globalService.openSnackBar).toHaveBeenCalledWith('news event added successfully');
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.NEWS_EVENT.NEWS_EVENT_ABSOLUTE]);
  }));

  it('should handle error on news event update', fakeAsync(() => {
    component.addNewsEventForm = new FormGroup({
      title: new FormControl(testNewsEventData.title),
      startDate: new FormControl(testNewsEventData.startDate),
      endDate: new FormControl(testNewsEventData.endDate),
      status: new FormControl(testNewsEventData.isActive),
    });

    component.isEdit = true;
    component.newsEventId = '2';

    spyOn(service, 'updateNewsEvent').and.returnValue(throwError('Update failed'));
    component.saveButtonConfig.callback();
    tick();
    expect(component.loading).toBeFalse();
  }));

  it('should handle error on news event add', fakeAsync(() => {
    component.addNewsEventForm = new FormGroup({
      title: new FormControl(testNewsEventData.title),
      startDate: new FormControl(testNewsEventData.startDate),
      endDate: new FormControl(testNewsEventData.endDate),
      status: new FormControl(testNewsEventData.isActive),
    });

    component.isEdit = false;
    component.newsEventId = '2';

    spyOn(service, 'addNewsEvent').and.returnValue(throwError('Add failed'));
    component.saveButtonConfig.callback();
    tick();
    expect(component.loading).toBeFalse();
  }));
});
