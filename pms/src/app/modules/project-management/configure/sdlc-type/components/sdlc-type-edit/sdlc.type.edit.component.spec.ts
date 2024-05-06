import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdlcTypeEditComponent } from './sdlc.type.edit.component';

describe('SdlcTypeEditComponent', () => {
  let component: SdlcTypeEditComponent;
  let fixture: ComponentFixture<SdlcTypeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SdlcTypeEditComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SdlcTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
