import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSystemTypeComponent } from './add.system.type.component';

describe('AddSystemTypeComponent', () => {
  let component: AddSystemTypeComponent;
  let fixture: ComponentFixture<AddSystemTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSystemTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSystemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
