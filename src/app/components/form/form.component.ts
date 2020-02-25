import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {

  private inProgress = false;
  public formGroup: FormGroup;
  private next = false;
  private submitted = false;
  public updating = false;
  private serverErrors: any = null;
  private data: any = {};
  private defaultValues: any = {};
  public requiredFn = Validators.required;
  public subscriptions: Array<any> = [];
  @Input() formData: any;
  @ViewChild('autofocusField') autofocusField: ElementRef;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach((elem) => { elem.unsubscribe(); });
  }

  ngOnInit() {
    // Build and create FormGroup
    const formGroup = {};
    for (const field of this.formData.fields) {
      formGroup[field.id] = new FormControl(null, field.validators ? field.validators.concat(this.remoteErrorsValidator(field.id)) : this.remoteErrorsValidator(field.id));
    }
    this.formGroup = new FormGroup(formGroup);

    // Pass form to callback if defined
    this.formData.formCallback && this.formData.formCallback(this.formGroup);

    // Subscribe to load data
    this.subscriptions.push(this.formData.data.subscribe(
      data => {
        this.data = data;
        this.formGroup.patchValue(data);
      },
    ));

    // FIXME: workaround for checkboxes type, where you can't pass custom variable
    // Iterate over all fields, find ones with 'multiselect' type and append field reference to all options
    for (const field of this.formData.fields) {
      if (field.type == 'multiselect' || field.type == 'select') {
        this.subscriptions.push(field.options.subscribe(options => {
          for (let option of options) {
            option.field = field;
          }
        }));
      }
    }

    // Check if we update or create
    this.subscriptions.push(this.route.params.subscribe(
      params => {
        if ('id' in params) {
          this.updating = true;
        } else {
          // Subscribe to default data
          for (const field of this.formData.fields) {
            if (field.defaultValue) {
              this.subscriptions.push(field.defaultValue.subscribe(value => {
                let _value = field.value ? field.value(value) : value;
                if (!this.formGroup.controls[field.id].dirty || this.formGroup.controls[field.id].value) {
                  this.formGroup.controls[field.id].patchValue(_value);
                }
                this.defaultValues[field.id] = _value;
              }));
            }
          }
        }
      }
    ));
  }

  isInvalid(id) {
    return this.formGroup.controls[id].invalid && (this.formGroup.controls[id].touched || this.submitted || this.serverErrors);
  }

  isValid(id) {
    return this.formGroup.controls[id].valid && (this.formGroup.controls[id].touched || this.submitted || this.serverErrors);
  }

  submit() {
    // This will mark all fiels are validated
    this.submitted = true;
    // If form is valid, start server-side processing
    if (this.formGroup.valid) {
      this.inProgress = true;
      if (this.updating) {
        this.formData.update(this.formGroup).pipe(
          finalize(() => this.reset()))
          .subscribe(
            null,
            error => {
              this.parseRemoteErrors(error);
            },
        );
      } else {
        this.formData.create(this.formGroup, this.next).pipe(
          finalize(() => this.reset()))
          .subscribe(
            data => {
              // Passing default values should be done automatically somehow?
              const values = this.formGroup.value;
              this.formGroup.reset(this.defaultValues),
              this.formData.loadDefaults && this.formData.loadDefaults(values);
              this.serverErrors = null;
              this.autofocusField && this.autofocusField.nativeElement.focus();
            },
            error => {
              this.parseRemoteErrors(error);
            },
        );
      }
    }
  }

  reset() {
    this.next = false;
    this.inProgress = false;
    this.submitted = false;
  }

  parseRemoteErrors(error) {
    // Proceed only if we receive valid HTTP response.
    // Status 0 would be for example, when preflight requests for API fails.
    if (error.status !== 0) {
      this.serverErrors = error.error;
    }
    Object.keys(this.formGroup.controls).forEach(field => {
      const control = this.formGroup.get(field);
      control.updateValueAndValidity();
    });
  }

  remoteErrorsValidator(id: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      let response = null;
      if (this.serverErrors && this.serverErrors[id]) {
        response = { other: this.serverErrors[id] };
        delete this.serverErrors[id];
      }
      return response;
    }
  }

  ngAfterViewInit() {}

  rightButtonText() {
    const progressText = this.updating ? (this.formData.updateProgressText || 'Updating...') : (this.formData.createProgressText || 'Creating...');
    const staticText = this.updating ? (this.formData.updateStaticText || 'Update') : (this.formData.createStaticText || 'Create');
    return (this.inProgress && !this.next) ? progressText : staticText;
  }

  unselect(item) {
    let values = (this.formGroup.controls[item.field.id].value || []);
    let value = item.field.value ? item.field.value(item) : item;
    var index = values.indexOf(value, 0);
    if (index > -1) {
      values.splice(index, 1);
    }
    this.formGroup.controls[item.field.id].patchValue(values);
  }

  searchByDescription(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.field.description(item).toLocaleLowerCase().indexOf(term) > -1;
  }
}
