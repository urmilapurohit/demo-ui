import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAttendanceComponent } from './team.attendance.component';

describe('TeamAttandanceComponent', () => {
  let component: TeamAttendanceComponent;
  let fixture: ComponentFixture<TeamAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamAttendanceComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TeamAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
