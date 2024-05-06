import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppDataGridEditElementComponent } from './app-data-grid-edit-element.component';
import { DataGridColumn, DataGridFieldDataType } from '../../../models/data-grid-models/data-grid-column.config';

describe('AppDataGridEditElementComponent', () => {
  let component: AppDataGridEditElementComponent<any>;
  let fixture: ComponentFixture<AppDataGridEditElementComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppDataGridEditElementComponent],
      imports: [FormsModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(AppDataGridEditElementComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit enterClickEvent on calling onEnterClick()', () => {
    spyOn(component.enterClickEvent, 'emit');
    component.onEnterClick();
    expect(component.enterClickEvent.emit).toHaveBeenCalled();
  });

  it('should call textBoxValueChange on calling onInputValueChange()', () => {
    const mockColumn: DataGridColumn<any> = {
      field: 'testField',
      editConfig: {
        isEditable: true,
        controlType: 'text',
        textBoxValueChange: jasmine.createSpy('textBoxValueChangeSpy'),
      },
    };
    component.index = 1;
    component.onInputValueChange(mockColumn);
    expect(mockColumn.editConfig?.textBoxValueChange).toHaveBeenCalledWith('testField_1');
  });
  it('should set controlType correctly for different input types', () => {
    component.column = {
      fieldDataType: DataGridFieldDataType.string,
      editConfig: { isEditable: true, controlType: 'text' },
      field: 'emailField',
    };
    expect(component.controlType).toBe('text');
  });
});
