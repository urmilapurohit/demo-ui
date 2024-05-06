import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmediateSeniorHistoryComponent } from './immediate.senior.history.component';

describe('ImmediateSeniorHistoryComponent', () => {
  let component: ImmediateSeniorHistoryComponent;
  let fixture: ComponentFixture<ImmediateSeniorHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImmediateSeniorHistoryComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ImmediateSeniorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
