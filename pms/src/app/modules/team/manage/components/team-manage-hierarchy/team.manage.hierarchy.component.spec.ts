import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamManageHierarchyComponent } from './team.manage.hierarchy.component';

describe('TeamManageHierarchyComponent', () => {
  let component: TeamManageHierarchyComponent;
  let fixture: ComponentFixture<TeamManageHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamManageHierarchyComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(TeamManageHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
