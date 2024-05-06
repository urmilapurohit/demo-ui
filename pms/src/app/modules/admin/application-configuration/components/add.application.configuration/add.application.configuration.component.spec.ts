import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicationConfigurationComponent } from './add.application.configuration.component';

describe('AddApplicationConfigurationComponent', () => {
  let component: AddApplicationConfigurationComponent;
  let fixture: ComponentFixture<AddApplicationConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddApplicationConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApplicationConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
