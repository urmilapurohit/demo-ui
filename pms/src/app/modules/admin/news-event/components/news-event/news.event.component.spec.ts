import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalService, WorkspaceLibraryModule } from 'workspace-library';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '../../../../../common/common.module';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { NewsEventComponent } from './news.event.component';
import { NewsEventService } from '../../services/news.event.service';
import { testResponse, testRowData, testSearchParam, testSortParam } from '../../data/testData';
import { ROUTES } from '../../../../../common/constants/routes';

describe('NewsEventComponent', () => {
  let component: NewsEventComponent;
  let fixture: ComponentFixture<NewsEventComponent>;
  let service: NewsEventService;
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
      declarations: [NewsEventComponent],
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

    fixture = TestBed.createComponent(NewsEventComponent);
    component = fixture.componentInstance;
    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    service = TestBed.inject(NewsEventService);
    router = TestBed.get(Router);
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
    const consoleSpy = spyOn(component, 'getNewsEventList');
    if (component.searchName.onEnterPress) {
      component.searchName.onEnterPress();
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call search method on click search button', () => {
    const consoleSpy = spyOn(component, 'getNewsEventList');
    component.searchBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call resetFilter method on click reset button', () => {
    const consoleSpy = spyOn(component, 'getNewsEventList');
    component.resetBtnConfig.callback();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call updateStatusConfirmation on click on action button', () => {
    const consoleSpy = spyOn<any>(component, 'updateStatusConfirmation');
    if (
      component.newsEventGridConfig.actionButtons
      && component.newsEventGridConfig.actionButtons[1].callback
    ) {
      component.newsEventGridConfig.actionButtons[1].callback(testRowData);
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should navigate to edit news and event page on click on action button', () => {
    const navigateSpy = spyOn(router, 'navigate');
    if (
      component.newsEventGridConfig.actionButtons
      && component.newsEventGridConfig.actionButtons[0].callback
    ) {
      component.newsEventGridConfig.actionButtons[0].callback(testRowData);
    }
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.NEWS_EVENT.EDIT_NEWS_EVENT_ABSOLUTE, 13]);
  });

  it('should navigate to add news and event page on click on add button', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addNewsEvent();
    expect(navigateSpy).toHaveBeenCalledWith([ROUTES.ADMIN.NEWS_EVENT.ADD_NEWS_EVENT_ABSOLUTE]);
  });

  it('should call pagination method on call back', () => {
    const spy = spyOn(component, 'getNewsEventList');
    if (component.newsEventGridConfig.paginationCallBack) {
      component.newsEventGridConfig.paginationCallBack(testSearchParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSortOrderColumn method on call back', () => {
    const spy = spyOn(component, 'getNewsEventList');
    if (component.newsEventGridConfig.getSortOrderAndColumn) {
      component.newsEventGridConfig.getSortOrderAndColumn(testSortParam);
    }
    expect(spy).toHaveBeenCalled();
  });

  it('should set newsEventList and call setTableConfig on successful api response', () => {
    const mockResponse = {
      isSuccess: true,
      data: testResponse
    };

    jasmine.clock().install();
    spyOn(service, 'getNewsEvent').and.returnValue(of(mockResponse));
    component.getNewsEventList();

    expect(component.isGridLoading).toBe(true);
    fixture.detectChanges();

    jasmine.clock().tick(300);
    expect(component.isGridLoading).toBe(false);
    expect(component.newsEventList).toEqual(testResponse);
    jasmine.clock().uninstall();
  });

  it('should set isGridLoading to false on API error', () => {
    spyOn(service, 'getNewsEvent').and.returnValue(throwError('Some error'));
    component.getNewsEventList();
    fixture.detectChanges();
    expect(component.isGridLoading).toBe(false);
  });

  it('should update status of news event when confirmation is "yes"', () => {
    spyOn(globalService, 'getConfirmDialog').and.returnValue({
      afterClosed: () => of({ data: 'yes' }),
    } as any);

    spyOn(service, 'updateStatus').and.returnValue(of({ isSuccess: true }));
    spyOn(globalService, 'openSnackBar');
    spyOn(component, 'getNewsEventList');

    if (
      component.newsEventGridConfig.actionButtons
      && component.newsEventGridConfig.actionButtons[1].callback
    ) {
      component.newsEventGridConfig.actionButtons[1].callback(testRowData);
    }

    expect(globalService.getConfirmDialog).toHaveBeenCalled();
    expect(service.updateStatus).toHaveBeenCalledWith(13, false);
    expect(globalService.openSnackBar).toHaveBeenCalled();
    expect(component.getNewsEventList).toHaveBeenCalled();
  });
});
