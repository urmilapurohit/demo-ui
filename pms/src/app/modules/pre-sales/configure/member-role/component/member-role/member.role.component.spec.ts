import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRoleComponent } from './member.role.component';

describe('MemberRoleComponent', () => {
  let component: MemberRoleComponent;
  let fixture: ComponentFixture<MemberRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberRoleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MemberRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
