import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdlcTypeComponent } from './sdlc.type.component';

describe('SdlcTypeComponent', () => {
  let component: SdlcTypeComponent;
  let fixture: ComponentFixture<SdlcTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SdlcTypeComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SdlcTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
