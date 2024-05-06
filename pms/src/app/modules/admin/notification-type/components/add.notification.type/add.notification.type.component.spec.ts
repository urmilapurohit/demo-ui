import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotificationTypeComponent } from './add.notification.type.component';

describe('AddNotificationTypeComponent', () => {
  let component: AddNotificationTypeComponent;
  let fixture: ComponentFixture<AddNotificationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNotificationTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNotificationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
