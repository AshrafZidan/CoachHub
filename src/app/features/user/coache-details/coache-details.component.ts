import { ChangeDetectorRef, Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Coach, CoachDetail } from '../../admin/coaches-management/Coaches.model';
import { environment } from '../../../../environments/environment.development';
import {  CoachSearchCriteria, FindCoachService } from '../services/find-coache.service';
import { SkeletonModule } from 'primeng/skeleton';
import { CoachAddAppointmentComponent } from '../../coach/booking/coach-add-appointment.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coache-details',
  standalone: true,
  imports: [CommonModule, TranslateModule,SkeletonModule,CoachAddAppointmentComponent],
  templateUrl: './coache-details.component.html',
  styleUrls: ['./coache-details.component.scss']
})
export class CoacheDetailsComponent {
      coach: CoachDetail | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.coach = history.state?.coach ?? null;

  }

}