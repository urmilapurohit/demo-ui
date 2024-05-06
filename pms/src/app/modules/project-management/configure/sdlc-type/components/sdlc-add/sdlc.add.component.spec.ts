import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdlcAddComponent } from './sdlc.add.component';

describe('SdlcAddComponent', () => {
  let component: SdlcAddComponent;
  let fixture: ComponentFixture<SdlcAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SdlcAddComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SdlcAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
