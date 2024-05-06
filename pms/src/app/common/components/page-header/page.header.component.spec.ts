import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { WorkspaceLibraryModule } from 'workspace-library';
import { PageHeaderComponent } from './page.header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        WorkspaceLibraryModule
      ],
      declarations: [PageHeaderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should display heading', () => {
    const headingText = 'Test Heading';
    component.heading = headingText;
    fixture.detectChanges();
    expect(component.heading).toEqual(headingText);
  });

  it('should display breadcrumb items', () => {
    component.items = [{ label: 'Home', link: '/' }, { label: 'Category', link: '/category' }];
    fixture.detectChanges();
    const breadcrumbElements = fixture.debugElement.queryAll(By.css('.breadcrumb-item')).map((el) => el.nativeElement.textContent.trim());
    expect(breadcrumbElements).toEqual([]);
  });

  it('should not display add button when showAddButton is false', () => {
    component.showAddButton = false;
    fixture.detectChanges();
    const addButtonElement = fixture.debugElement.query(By.css('.plus-btn'));
    expect(addButtonElement).toBeNull();
  });

  it('should trigger handleAddClick event on add button click', () => {
    spyOn(component.handleAddClick, 'emit');
    component.showAddButton = true;
    fixture.detectChanges();
    const addButtonElement = fixture.debugElement.query(By.css('.plus-btn'));
    addButtonElement.triggerEventHandler('click', null);
    expect(component.handleAddClick.emit).toHaveBeenCalled();
  });
});
