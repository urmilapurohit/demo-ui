import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEfficiencyReportComponent } from './team.efficiency.report.component';

describe('TeamEfficiencyReportComponent', () => {
  let component: TeamEfficiencyReportComponent;
  let fixture: ComponentFixture<TeamEfficiencyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamEfficiencyReportComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TeamEfficiencyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
