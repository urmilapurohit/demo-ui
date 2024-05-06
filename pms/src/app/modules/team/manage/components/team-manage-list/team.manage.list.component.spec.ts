import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamManageListComponent } from './team.manage.list.component';

describe('TeamManageListComponent', () => {
  let component: TeamManageListComponent;
  let fixture: ComponentFixture<TeamManageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamManageListComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(TeamManageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
