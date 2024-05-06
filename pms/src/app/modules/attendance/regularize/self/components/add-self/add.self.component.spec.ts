import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSelfComponent } from './add.self.component';

describe('AddSelfComponent', () => {
  let component: AddSelfComponent;
  let fixture: ComponentFixture<AddSelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSelfComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(AddSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
