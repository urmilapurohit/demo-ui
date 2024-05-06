import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageComponent } from './manage.component';

describe('SelfComponent', () => {
  let component: ManageComponent;
  let fixture: ComponentFixture<ManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
