import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../../../../../common/common.module';
import { AppRoutingModule } from '../../../../../app-routing.module';
import { PreviewEmailTemplateComponent } from './preview.email.template.component';

describe('PreviewEmailTemplateComponent', () => {
  let component: PreviewEmailTemplateComponent;
  let fixture: ComponentFixture<PreviewEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
      ],
      declarations: [PreviewEmailTemplateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PreviewEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call getEmailTemplateById', () => {
    const consoleSpy = spyOn<any>(component, 'getEmailTemplateById');
    component.getEmailTemplateById(4);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
