import {
  Component,
  Input,
  inject,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  FormGroup,
  ReactiveFormsModule,
  FormArray,
  FormBuilder
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-coach-media-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './coach-media-form.html',
  styleUrls: ['./coach-media-form.scss']
})
export class CoachMediaForm implements OnInit, OnDestroy {

  @Input() form!: FormGroup;

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  readonly baseUrl = environment.apiUrl;

  // =========================
  // STATE
  // =========================

  profileImageLoading = signal(false);

  certLoadingMap = signal<Record<number, boolean>>({});

  certErrorMap = signal<Record<number, boolean>>({});

  imageError = signal(false);

  imageValidationError = signal('');

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    if (this.certificates.length === 0) {
      this.addCertificate();
    }
  }

  // =========================
  // PROFILE IMAGE
  // =========================

  get profileImageUrl(): string | null {
    const url = this.form?.get('profileImageUrl')?.value;

    if (!url) {
      return null;
    }

    return url.startsWith('http') || url.startsWith('data:')
      ? url
      : `${this.baseUrl}${url}`;
  }

  onImageSelect(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  this.imageValidationError.set('');
  this.imageError.set(false);

  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    this.imageValidationError.set(
      'Please upload a valid image.'
    );

    input.value = '';

    this.form.get('profileImageUrl')?.markAsTouched();

    this.cdr.markForCheck();
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    this.imageValidationError.set(
      'Image size must not exceed 5 MB.'
    );

    input.value = '';

    this.form.get('profileImageUrl')?.markAsTouched();

    this.cdr.markForCheck();
    return;
  }

  this.profileImageLoading.set(true);

  const reader = new FileReader();

  reader.onload = () => {
  const control = this.form.get('profileImageUrl');

  control?.setValue(reader.result as string);
  control?.markAsTouched();
  control?.updateValueAndValidity();

  this.imageValidationError.set('');
  this.profileImageLoading.set(false);

  this.cdr.markForCheck();
};

  reader.onerror = () => {
    this.profileImageLoading.set(false);

    this.imageValidationError.set(
      'Unable to read the selected image.'
    );

    this.form.get('profileImageUrl')?.markAsTouched();
    input.value = '';

    this.cdr.markForCheck();
  };

  reader.readAsDataURL(file);
}

  onImageError(): void {

    this.imageError.set(true);

    this.form.patchValue({
      profileImageUrl: ''
    });

    this.cdr.markForCheck();
  }

  removeProfileImage(): void {
  const control = this.form.get('profileImageUrl');

  control?.setValue('');
  control?.markAsTouched();

  this.imageError.set(false);
  this.imageValidationError.set('');

  this.cdr.markForCheck();
}
 
getProfileImageError(): string {
  if (this.imageValidationError()) {
    return this.imageValidationError();
  }

  const control = this.form?.get('profileImageUrl');

  if (!control) {
    return '';
  }

  if (!control.touched && !control.dirty) {
    return '';
  }

  if (control.hasError('required')) {
    return 'Please upload a profile image.';
  }

  return '';
}
  // =========================
  // CERTIFICATES
  // =========================

  get certificates(): FormArray {
    return this.form.get('certificates') as FormArray;
  }

  createCertificate(cert?: any): FormGroup {
    return this.fb.group({
      id: [cert?.id ?? null],
      name: [cert?.name ?? ''],
      fileUrl: [cert?.fileUrl ?? ''],
      contentType: [cert?.contentType ?? ''],
      file: [null]
    });
  }

  addCertificate(): void {
    this.certificates.push(
      this.createCertificate()
    );
  }

  removeCertificate(index: number): void {

    const control = this.certificates.at(index);

    const fileUrl = control?.value?.fileUrl;

    if (fileUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(fileUrl);
    }

    this.certificates.removeAt(index);

    this.certLoadingMap.update(map => {
      const updated = { ...map };
      delete updated[index];
      return updated;
    });

    this.certErrorMap.update(map => {
      const updated = { ...map };
      delete updated[index];
      return updated;
    });

    this.cdr.markForCheck();
  }

  onCertSelect(
    event: Event,
    index: number
  ): void {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const control = this.certificates.at(index);

    if (!control) {
      return;
    }

    this.certErrorMap.update(map => ({
      ...map,
      [index]: false
    }));

    this.certLoadingMap.update(map => ({
      ...map,
      [index]: true
    }));

    // Revoke previous blob URL
    const previousUrl = control.value?.fileUrl;

    if (previousUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previousUrl);
    }

    // Fast local preview
    const previewUrl = URL.createObjectURL(file);

    control.patchValue({
      file,
      name: file.name,
      contentType: file.type,
      fileUrl: previewUrl
    });

    this.certLoadingMap.update(map => ({
      ...map,
      [index]: false
    }));

    this.cdr.markForCheck();
  }

  onCertImageError(index: number): void {

    this.certErrorMap.update(map => ({
      ...map,
      [index]: true
    }));

    this.cdr.markForCheck();
  }

  // =========================
  // HELPERS
  // =========================

  isCertLoading(index: number): boolean {
    return this.certLoadingMap()[index] === true;
  }

  isInvalid(controlName: string): boolean {

    const control = this.form.get(controlName);

    return !!control &&
      control.invalid &&
      (control.touched || control.dirty);
  }

  getError(controlName: string): string {

    const control = this.form.get(controlName);

    if (
      !control ||
      !(control.touched || control.dirty)
    ) {
      return '';
    }

    if (control.hasError('required')) {
      return 'This field is required';
    }

    return '';
  }

  getCertPreview(
    index: number,
    cert: any
  ): string {

    // Image failed
    if (this.certErrorMap()[index]) {
      return '';
    }

    if (!cert?.fileUrl) {
      return '';
    }

    // Local blob/data preview
    if (
      cert.fileUrl.startsWith('blob:') ||
      cert.fileUrl.startsWith('data:')
    ) {
      return cert.fileUrl;
    }

    return cert.fileUrl.startsWith('http')
      ? cert.fileUrl
      : `${this.baseUrl}${cert.fileUrl}`;
  }

  // =========================
  // DESTROY
  // =========================

  ngOnDestroy(): void {

    this.certificates.controls.forEach(control => {

      const fileUrl = control.value?.fileUrl;

      if (fileUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(fileUrl);
      }

    });
  }
}
