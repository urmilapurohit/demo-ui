import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import CustomEditor from '../../../../custom_editor/build/ckeditor';
import { CkEditor } from '../../models/common.model';

@Component({
  selector: 'app-ck-editor',
  templateUrl: './ck.editor.component.html',
  styleUrl: './ck.editor.component.css'
})
export class CkEditorComponent implements OnInit {
  public editor: any = CustomEditor;
  form!: FormGroup;
  @Input() config!: CkEditor;
  @Input() isSubmitted: boolean = false;
  @Output() keyupEvent = new EventEmitter();

  constructor(
    private controlContainer: ControlContainer
  ) { }

  ngOnInit(): void {
    this.form = <FormGroup> this.controlContainer.control;
  }

  onKeyUp = (event: KeyboardEvent): void => {
    this.config.keyup && this.config.keyup(event);
  };

  get customClass(): string {
    return this.config?.customClass ? this.config?.customClass : '';
  }
}
