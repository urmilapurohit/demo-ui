import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdlcStepEditComponent } from './sdlc.step.edit.component';

describe('SdlcStepEditComponent', () => {
  let component: SdlcStepEditComponent;
  let fixture: ComponentFixture<SdlcStepEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SdlcStepEditComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SdlcStepEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
