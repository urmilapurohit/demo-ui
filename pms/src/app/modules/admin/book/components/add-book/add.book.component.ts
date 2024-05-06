import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseResponseModel, Button, ButtonType, DropDown, DropdownValue, GlobalService, InputType, TextArea, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTIVE_INACTIVE_STATUS_LABEL, ACTIVE_INACTIVE_STATUS_OPTIONS, GLOBAL_CONSTANTS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { IBook, IBookObject } from '../../models/book.model';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-add.book',
  templateUrl: './add.book.component.html',
  styleUrl: './add.book.component.css'
})
export class AddBookComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addBookFormGroup!: FormGroup;
  name!: TextField;
  status!: DropDown;
  bookCategory!: DropDown;
  author!: TextField;
  description!: TextArea;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  bookId: string = '';
  bookCategoryList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: BookService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.bookId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.bookId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addBookFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getBookById(Number(this.bookId));
    }
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.getBookCategoryList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Book' : 'Add Book';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Book', link: ROUTES.ADMIN.BOOK.BOOK_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private getBookCategoryList() {
    this.uiService.getDropdownOptions(this.service.getBookCategories(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.bookCategoryList = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.addBookFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(250)]],
      bookCategory: ["", [Validators.required]],
      author: ["", [Validators.required, Validators.maxLength(250)]],
      description: ["", [Validators.maxLength(500)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }, [Validators.required]]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = {
      id: 'applyButton',
      buttonText: GLOBAL_CONSTANTS.SAVE,
      buttonType: ButtonType.default,
      className: 'primary-btn',
      callback: () => { this.OnSave(); }
    };
    this.cancelButtonConfig = {
      id: 'cancelButton',
      buttonText: GLOBAL_CONSTANTS.CANCEL,
      buttonType: ButtonType.default,
      className: 'primary-border-btn',
      callback: () => { this.router.navigate([ROUTES.ADMIN.BOOK.BOOK_ABSOLUTE]); }
    };
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Book Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.bookCategory = {
      data: {
        data: this.bookCategoryList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'bookCategory',
      formControlName: 'bookCategory',
      label: 'Book Category',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.author = {
      label: 'Author',
      formControlName: 'author',
      type: InputType.text,
      customClass: 'custom-form-control',
      isRequired: true,
      onEnterPress: () => { this.OnSave(); }
    };

    this.status = {
      data: {
        data: ACTIVE_INACTIVE_STATUS_OPTIONS,
      },
      feature: {
        allowMultiple: false
      },
      id: 'status',
      formControlName: 'status',
      label: 'Status',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.description = {
      label: 'Description',
      formControlName: 'description',
      rows: 15,
      placeholder: '',
      customClass: 'custom-form-control'
    };
  };

  private getBookById(id: number) {
    this.service.getBookById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IBookObject>) => {
        if (res.isSuccess && res.data) {
          this.addBookFormGroup.setValue({
            name: res.data?.name || "",
            bookCategory: res.data?.bookCategoryId || "",
            author: res.data?.author || "",
            description: res.data?.description,
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addBookFormGroup.valid) {
      const data: IBook = {
        name: this.f?.['name']?.value,
        bookCategoryId: this.f?.['bookCategory']?.value,
        author: this.f?.['author']?.value,
        isActive: this.f?.['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
        description: this.f?.['description']?.value
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateBook(Number(this.bookId), data) : this.service.addBook(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IBookObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ADMIN.BOOK.BOOK_ABSOLUTE]);
          }
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
  // #endregion
}
