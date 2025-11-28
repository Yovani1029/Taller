import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false
})
export class FormComponent {

  @Input() mode: 'register' | 'login' | 'update' = 'login';
  @Input() initialData: any = null;
  @Output() formSubmit = new EventEmitter<any>();

  form!: FormGroup;
  phoneError: boolean = false;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      name: [
        this.initialData?.name || '',
        this.mode !== 'login' ? Validators.required : []
      ],
      lastname: [
        this.initialData?.lastname || '',
        this.mode !== 'login' ? Validators.required : []
      ],
      phone: [
        this.initialData?.phone || '',
        this.mode !== 'login'
          ? [
              Validators.required,
              Validators.minLength(10),
              Validators.maxLength(10)
            ]
          : []
      ],
      email: [
        this.initialData?.email || '',
        [Validators.required, Validators.email]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  validatePhone(event: any) {
    const value: string = event.target.value;

    if (!/^[0-9]*$/.test(value)) {
      this.phoneError = true;
      this.form.get('phone')?.setValue(value.replace(/\D/g, ''));
    } else {
      this.phoneError = false;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.form.valid) this.formSubmit.emit(this.form.value);
    else this.form.markAllAsTouched();
  }
}
