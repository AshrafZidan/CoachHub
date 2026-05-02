import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
  OnDestroy,
  DestroyRef,
  ViewEncapsulation
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
  FormGroup
} from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SearchService } from '../../services/global-table-search.service';
import { CoachesService } from '../services/Coaches.service';
import { CoachDetail } from '../Coaches.model';

import { CoachBasicForm } from './steps/coach-basic-form/coach-basic-form';
import { CoachProfessionalForm } from './steps/coach-professional-form/coach-professional-form';
import { ToastService } from '../../../../core/services/toast.service';
import { CoachMediaForm } from './steps/coach-media-form/coach-media-form';
import { LookupsService } from '../../services/lookups.service';
@Component({
  selector: 'app-edit-coach',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ProgressSpinnerModule,
    CoachBasicForm,
    CoachProfessionalForm,
    CoachMediaForm
  ],
  templateUrl: './edit-coach.html',
  styleUrls: ['./edit-coach.scss'],
  encapsulation:ViewEncapsulation.None
})
export class EditCoachComponent implements OnInit, OnDestroy {
  countriesArray: any = [];
  // =========================
  // INJECTIONS
  // =========================
  private searchService = inject(SearchService);
  private coachesService = inject(CoachesService);
  private lookupService = inject(LookupsService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private toast = inject(ToastService);


  // =========================
  // STATE
  // =========================
  step = signal(1);
  coach = signal<CoachDetail | null>(null);
  isLoading = signal(false);

  // =========================
  // COMPUTED
  // =========================
  isStep1 = computed(() => this.step() === 1);
  isStep2 = computed(() => this.step() === 2);
  isStep3 = computed(() => this.step() === 3);
  isLastStep = computed(() => this.step() === 3);
  showBackButton = computed(() => this.step() > 1);

  // =========================
  // STEP 1 FORM
  // =========================
  basicForm = this.fb.group({
    fullNameEn: ['', Validators.required],
    fullNameAr: ['', Validators.required],
    gender: ['', Validators.required],
    birthDate: [null as Date | null, Validators.required],
    countryId: ['', Validators.required],
    nationalityId:['',Validators.required],
    email: ['', [Validators.required, Validators.email]],
    halfHourPrice:[0,],
    hourlyPrice:[0],
    twoHoursPrice:[0],
    whatsAppNumber: ['', [Validators.required, Validators.pattern(/^\+?\d+$/) ]],
    oneAndHalfHourPrice:[0],
  });

  // =========================
  // STEP 2 FORM
  // =========================
  professionalForm = this.fb.group({
    yearsOfExperience: [null as number | null, [Validators.required, Validators.min(0)]],
    coachingIndustriesIds: [[] as string[], Validators.required],
    languageIds: [[] as string[], Validators.required],
    availableEveryWeek: [false as boolean, Validators.required],
    jobTitle: ['', Validators.required],
  });

  // =========================
  // STEP 3 FORM (MEDIA)
  // =========================
  mediaForm = this.fb.group({
    username: ['', Validators.required],
    profileImageUrl: [''],
    profileImageId: [''],
  certificates: this.fb.array([])
  });

  // =========================
  // GET CERTIFICATES ARRAY
  // =========================
  get certificates(): FormArray {
    return this.mediaForm.get('certificates') as FormArray;
  }

  createCertificate(cert?: any): FormGroup {
  return this.fb.group({
    id: [cert?.id || null],
    name: [cert?.name || ''],
    fileUrl: [cert?.fileUrl || ''],
    file: [null],
    contentType: [cert?.contentType || 'image/jpeg']
  });
}

  addCertificate() {
    this.certificates.push(this.createCertificate());
  }

  removeCertificate(index: number) {
    this.certificates.removeAt(index);
  }

  // =========================
  // CURRENT FORM
  // =========================
  currentForm = computed(() => {
    switch (this.step()) {
      case 1: return this.basicForm;
      case 2: return this.professionalForm;
      case 3: return this.mediaForm;
      default: return this.basicForm;
    }
  });

  isNextDisabled = computed(() => this.currentForm().invalid);

  // =========================
  // INIT
  // =========================
  constructor() {
    this.searchService.hide();
  }

ngOnInit() {
  this.loadCountriesfromBcApi();
  this.route.paramMap.pipe(
    map(params => params.get('id')),
    filter((id): id is string => !!id),
    map(id => Number(id)),
    filter(id => !isNaN(id) && id > 0),

    switchMap(id => {
      this.isLoading.set(true);

      return this.coachesService.getCoachDetails(id);
    }),

    takeUntilDestroyed(this.destroyRef)
  ).subscribe({
    next: (res) => {
      const data = res?.data;

      // 🚨 SAFE CHECK (IMPORTANT FIX)
      if (!data) {
        this.isLoading.set(false);
        this.router.navigate(['/admin/coaches']);
        return;
      }

      this.coach.set(data);

      // =========================
      // STEP 1
      // =========================
      this.basicForm.patchValue({
        fullNameEn: data.fullNameEn,
        fullNameAr: data.fullNameAr,
        gender: data.gender,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        countryId: data.country?.code ?? null,
        nationalityId:data.nationality.code??null,
        email: data.email,
        halfHourPrice:data.halfHourPrice??0,
        hourlyPrice:data.hourlyPrice??0,
        twoHoursPrice:data.twoHoursPrice??0,
        oneAndHalfHourPrice: data.oneAndHalfHourPrice ?? 0,
        whatsAppNumber: data.whatsAppNumber,
      });

      // =========================
      // STEP 2
      // =========================
      this.professionalForm.patchValue({
        yearsOfExperience: data.yearsOfExperience ?? null,
        jobTitle: data.jobTitle,
        availableEveryWeek: data.availableEveryWeek,
        coachingIndustriesIds: data.coachingIndustries?.map((i: any) => i.id) || [],
        languageIds: data.languages?.map((l: any) => l.id) || []
      });

      // =========================
      // STEP 3
      // =========================
      this.mediaForm.patchValue({
        username: data.username || '',
        profileImageUrl: data.profileImageUrl || '',
        profileImageId: data.profileImageId || ''  
      });

      // =========================
      // CERTIFICATES
      // =========================
      this.certificates.clear();

      data.certificates?.forEach((cert: any) => {
        this.certificates.push(this.createCertificate(cert));
      });

      this.isLoading.set(false);
    },

    error: (err) => {
      console.error(err);
      this.isLoading.set(false);

      // 🚨 IMPORTANT: prevent stuck page
      this.router.navigate(['/admin/coaches']);
    }
  });
}

  ngOnDestroy() {
    this.searchService.show();
  }

  // =========================
  // HELPERS
  // =========================
  parseWhatsapp(phone: string | null) {
    if (!phone) return { code: '', number: '' };

    const match = phone.match(/^(\+\d{1,4})(\d+)$/);

    return {
      code: match?.[1] || '',
      number: match?.[2] || ''
    };
  }

 

  // =========================
  // NAVIGATION
  // =========================
  next() {
    const form = this.currentForm();

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    if (this.isLastStep()) {
      this.submit();
    } else {
      this.step.update(s => s + 1);
    }
  }

  back() {
    this.step.update(s => s - 1);
  }

  // =========================
  // SUBMIT
  // =========================
async submit() {
  if (this.isLoading()) return;
  this.isLoading.set(true);

  const media = this.mediaForm.value;

  // =========================
  // PROFILE IMAGE (ONLY ID OR BASE64)
  // =========================
  let profileImage = null;

  if (media.profileImageUrl && media.profileImageUrl.startsWith('data:')) {
    profileImage = {
      contentType: 'image/jpeg',
      content: this.extractBase64(media.profileImageUrl),
      attachmentName: 'profile.jpg'
    };
  } else if (media.profileImageId) {
    profileImage = {
      id: media.profileImageId
    };
  }

  // =========================
  // CERTIFICATES (FULL OBJECT)
  // =========================
 const certificates = await Promise.all(
  this.certificates.controls.map(async (c: any) => {
    const v = c.value;

    // ✅ NEW FILE (File object)
    if (v.file instanceof File) {
      const base64 = await this.fileToBase64(v.file);

      return {
        contentType: v.contentType || 'image/jpeg',
        content: this.extractBase64(base64),
        attachmentName: v.name
      };
    }

    // ✅ ALREADY BASE64 STRING (rare case)
    if (typeof v.file === 'string' && v.file.startsWith('data:')) {
      return {
        contentType: v.contentType || 'image/jpeg',
        content: this.extractBase64(v.file),
        attachmentName: v.name
      };
    }

    // ✅ KEEP FULL OBJECT
    return {
      id: v.id,
      contentType: v.contentType,
      attachmentName: v.name,
      fileUrl: v.fileUrl
    };
  })
);
  // =========================
  // DATE
  // =========================
  const birthDateValue = this.basicForm.value.birthDate;

  // =========================
  // PAYLOAD
  // =========================
  const payload = {
    fullNameEn: this.basicForm.value.fullNameEn,
    fullNameAr: this.basicForm.value.fullNameAr,
    gender: this.basicForm.value.gender,

    birthDate: birthDateValue
      ? this.formatDate(new Date(birthDateValue))
      : null,

    countryId: this.basicForm.value.countryId
      ? this.getCountryIdByCode(this.basicForm.value.countryId)
      : null,

    nationalityId: this.basicForm.value.nationalityId
      ? this.getCountryIdByCode(this.basicForm.value.nationalityId)
      : null,

    email: this.basicForm.value.email,
    whatsAppNumber: this.basicForm.value.whatsAppNumber,

    halfHourPrice: this.basicForm.value.halfHourPrice,
    oneAndHalfHourPrice: this.basicForm.value.oneAndHalfHourPrice,
    hourlyPrice: this.basicForm.value.hourlyPrice,
    twoHoursPrice: this.basicForm.value.twoHoursPrice,

    yearsOfExperience: this.professionalForm.value.yearsOfExperience,
    coachingIndustriesIds: this.professionalForm.value.coachingIndustriesIds,
    languageIds: this.professionalForm.value.languageIds,
    availableEveryWeek: this.professionalForm.value.availableEveryWeek,
    jobTitle: this.professionalForm.value.jobTitle,

    username: media.username,

    profileImage,
    certificates
  };

  // =========================
  // API CALL
  // =========================
  const coachId = this.coach()?.id;

  if (!coachId) {
    this.isLoading.set(false);
    return;
  }

  this.coachesService.updateCoach(coachId, payload)
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: () => {
        this.toast.show('success', 'Coach updated successfully', '');
        this.router.navigate(['/admin/coaches']);
      },
      error: (err) => {
        console.error(err);
        this.toast.show('error', 'Failed to update coach', '');
      }
    });
}

formatDate(date: Date): string {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

private getCountryIdByCode(code: string): number | null {
  const country = this.countriesArray?.data?.find((c:any ) => c.code === code);
  return country ? country.id : null;
}
loadCountriesfromBcApi() {
  this.lookupService.getCountriesfrombackend().subscribe({
    next: (res) => {
      this.countriesArray = res;
    },
    error: (err) => console.error(err)
  });
}
fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
 extractBase64(dataUrl: any): string {
  if (!dataUrl || typeof dataUrl !== 'string') return '';

  if (!dataUrl.includes(',')) return dataUrl;

  return dataUrl.split(',')[1];
}
}