import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceLibraryComponent } from './workspace-library.component';

describe('WorkspaceLibraryComponent', () => {
  let component: WorkspaceLibraryComponent;
  let fixture: ComponentFixture<WorkspaceLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceLibraryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WorkspaceLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
