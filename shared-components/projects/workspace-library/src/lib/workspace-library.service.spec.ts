import { TestBed } from '@angular/core/testing';

import { WorkspaceLibraryService } from './workspace-library.service';

describe('WorkspaceLibraryService', () => {
  let service: WorkspaceLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkspaceLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
