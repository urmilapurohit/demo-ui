import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPendingAttendanceComponent } from './team.pending.attendance.component';

describe('TeamPendingAttendanceComponent', () => {
  let component: TeamPendingAttendanceComponent;
  let fixture: ComponentFixture<TeamPendingAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamPendingAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamPendingAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
