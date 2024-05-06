import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectSearchDropdownComponent } from './multiselect-search-dropdown.component';

describe('MultiselectSearchDropdownComponent', () => {
  let component: MultiselectSearchDropdownComponent;
  let fixture: ComponentFixture<MultiselectSearchDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiselectSearchDropdownComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(MultiselectSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
