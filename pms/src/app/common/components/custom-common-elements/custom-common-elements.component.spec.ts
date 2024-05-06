import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCommonElementsComponent } from './custom-common-elements.component';

describe('CustomCommonElementsComponent', () => {
  let component: CustomCommonElementsComponent;
  let fixture: ComponentFixture<CustomCommonElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomCommonElementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomCommonElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
