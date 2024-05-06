import { ComponentFixture, TestBed} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CoreModule } from '../../../../../common/common.module';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { ErrorLogDetailsComponent } from './error.log.details.component';
import { ErrorLogService } from '../../services/error.log.service';
import { errorlogdetails } from '../../constant/testdata';

describe('ErrorLogDetails', () => {
  let component: ErrorLogDetailsComponent;
  let fixture: ComponentFixture<ErrorLogDetailsComponent>;
  let service: ErrorLogService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule],
      declarations: [ErrorLogDetailsComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ErrorLogDetailsComponent);
    service = TestBed.inject(ErrorLogService);
    component = fixture.componentInstance;
    component.errorLogId = '1';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
  it('should call getErrorLogById ', () => {
    const consoleSpy = spyOn(component, 'getErrorLogById');
      component.getErrorLogById(1);
      expect(consoleSpy).toHaveBeenCalled();
  });
  it('should set form group values on successful response', () => {
    const id = 1;
    const mockDesignationData = {
      isSuccess: true,
      data: errorlogdetails
    };
    spyOn(service, 'getErrorLogById').and.returnValue(of(mockDesignationData));
    component.getErrorLogById(id);
    expect(service.getErrorLogById).toHaveBeenCalledWith(id);
    expect(component.errorLogDetails).toEqual(errorlogdetails);
});
});
