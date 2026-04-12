import {
  Component,
  Input,
  inject,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit
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
export class CoachMediaForm implements OnInit {

  @Input() form!: FormGroup;

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  readonly baseUrl = 'https://backend.coachinghub.ae';
  certErrorMap = signal<Record<number, boolean>>({});

  // =========================
  // STATE
  // =========================
  profileImageLoading = signal(false);
  certLoadingMap = signal<Record<number, boolean>>({});
  imageError = signal(false);

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

    if (!url) return null;

    return url.startsWith('http') || url.startsWith('data:')
      ? url
      : `${this.baseUrl}${url}`;
  }

  onImageSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.profileImageLoading.set(true);
    this.imageError.set(false);

    const reader = new FileReader();

    reader.onload = () => {
      this.form.patchValue({
        profileImageUrl: reader.result as string
      });

      this.profileImageLoading.set(false);
      this.cdr.markForCheck();
    };

    reader.onerror = () => {
      this.profileImageLoading.set(false);
      this.cdr.markForCheck();
    };

    reader.readAsDataURL(file);
  }

  onImageError(index?: number): void {
    this.imageError.set(true);
    this.form.patchValue({ profileImageUrl: '' });
    // / clear certificate image inside FormArray
  const certificates = this.certificates;
  if (index === undefined) return;
    if (certificates && certificates.at(index)) {
      certificates.at(index).patchValue({
        imageUrl: ''
      });
    }
  }

  removeProfileImage(): void {
    this.form.patchValue({ profileImageUrl: '' });
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
    this.certificates.push(this.createCertificate());
  }

  removeCertificate(index: number): void {
    this.certificates.removeAt(index);
  }

  onCertSelect(event: Event, index: number): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const control = this.certificates.at(index);
  if (!control) return;

  this.certLoadingMap.update(map => ({
    ...map,
    [index]: true
  }));

  // 🚀 FAST PREVIEW (no FileReader)
  const previewUrl = URL.createObjectURL(file);

  control.patchValue({
    file, // store REAL file
    name: file.name,
    contentType: file.type,
    fileUrl: previewUrl // temporary preview
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
}
  // =========================
  // HELPERS
  // =========================


  isCertLoading(index: number): boolean {
    return this.certLoadingMap()[index] === true;
  }

  isInvalid(controlName: string): boolean {
    const c = this.form.get(controlName);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  getError(controlName: string): string {
    const c = this.form.get(controlName);
    if (!c || !(c.touched || c.dirty)) return '';
    if (c.hasError('required')) return 'This field is required';
    return '';
  }
  getCertPreview(index: number, cert: any): string {
  // ❌ if image failed → force empty
  if (this.certErrorMap()[index]) return '';

  // 1. local blob preview
  if (cert?.fileUrl) {
    if (cert.fileUrl.startsWith('blob:') || cert.fileUrl.startsWith('data:')) {
      return cert.fileUrl;
    }

    return cert.fileUrl.startsWith('http')
      ? cert.fileUrl
      : `${this.baseUrl}${cert.fileUrl}`;
  }

  return '';
}
ngOnDestroy(): void {
  this.certificates.controls.forEach((_, i) => {
    const cert = this.certificates.at(i).value;
    if (cert?.fileUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(cert.fileUrl);
    }
  });
}

}