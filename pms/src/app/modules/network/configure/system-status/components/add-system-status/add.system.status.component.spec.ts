import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSystemStatusComponent } from './add.system.status.component';

describe('AddSystemStatusComponent', () => {
  let component: AddSystemStatusComponent;
  let fixture: ComponentFixture<AddSystemStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSystemStatusComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddSystemStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
