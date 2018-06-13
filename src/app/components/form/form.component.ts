import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  moduleId: module.id,
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {

  private inProgress = false;
  public formGroup: FormGroup;
  private next = false;
  private submitted = false;
  public updating = false;
  private serverErrors: any = null;
  private data: any = {};
  private defaultValues: any = {};
  public requiredFn = Validators.required;
  @Input() formData: any;
  @ViewChild('autofocusField') autofocusField: ElementRef;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Build and create FormGroup
    const formGroup = {};
    for (const field of this.formData.fields) {
      formGroup[field.id] = new FormControl(null, field.validators ? field.validators.concat(this.remoteErrorsValidator(field.id)) : this.remoteErrorsValidator(field.id));
    }
    this.formGroup = new FormGroup(formGroup);

    // Pass form to callback if defined
    this.formData.formCallback && this.formData.formCallback(this.formGroup);

    // Subscribe to default data
    for (const field of this.formData.fields) {
      if (field.defaultValue) {
        field.defaultValue.subscribe(value => {
          if (!this.formGroup.controls[field.id].dirty || this.formGroup.controls[field.id].value) {
            this.formGroup.controls[field.id].patchValue(field.value ? field.value(value) : value);
          }
        });
      }
    }

    // Subscribe to load data
    this.formData.data.subscribe(
      data => {
        this.data = data;
        this.formGroup.patchValue(data);
      },
    );

    // Check if we update or create
    this.route.params.subscribe(
      params => {
        if ('id' in params) {
          this.updating = true;
        }
      }
    );
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
}
