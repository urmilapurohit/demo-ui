import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdlcEditComponent } from './sdlc.edit.component';

describe('SdlcEditComponent', () => {
  let component: SdlcEditComponent;
  let fixture: ComponentFixture<SdlcEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SdlcEditComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SdlcEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
