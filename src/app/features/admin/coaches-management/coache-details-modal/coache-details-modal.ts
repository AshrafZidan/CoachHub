import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  signal,
  inject
} from '@angular/core';
import { CoachDetail } from '../Coaches.model';
import { CoachesService } from '../services/Coaches.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-coache-details-dialog',
  templateUrl: './coache-details-modal.html',
  styleUrls: ['./coache-details-modal.scss'],
  imports: [CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    DividerModule
  ]
})
export class CoachDetailsDialogComponent implements OnChanges {
  private coachesService = inject(CoachesService);
  readonly baseUrl = environment.apiUrl;

  // =========================
  // INPUTS
  // =========================
  @Input() coachId!: number | null;
  @Input() visible = false;

  // =========================
  // OUTPUTS
  // =========================
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() approve = new EventEmitter<CoachDetail>();
  @Output() reject = new EventEmitter<CoachDetail>();

  // =========================
  // STATE
  // =========================
  coach = signal<CoachDetail | null>(null);
  isLoading = signal(false);

  constructor() { }

  // =========================
  // LOAD WHEN ID CHANGES
  // =========================
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coachId'] && this.coachId) {
      this.loadCoach(this.coachId);
    }
  }

  // =========================
  // API CALL
  // =========================
  private loadCoach(id: number) {
    this.isLoading.set(true);

    this.coachesService.getCoachDetails(id).subscribe({
      next: (data) => {
        this.coach.set(data.data || null);
        this.isLoading.set(false);
        console.log(this.coach());
        
      },
      error: (err) => {
        console.error('Failed to load coach details', err);
        this.isLoading.set(false);
      }
    });
  }

  // =========================
  // CLOSE MODAL
  // =========================
  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  // =========================
  // ACTIONS
  // =========================


  onApprove(c: CoachDetail) {
    this.approve.emit(c);
  }

  onReject(c: CoachDetail) {
    this.reject.emit(c);
  }

  getImageUrl(path: string | null): string {
    if (!path) return 'assets/default-avatar.png';

    return path.startsWith('http') || path.startsWith('data:')
      ? path
      : `${this.baseUrl}${path}`;

  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default-avatar.png';
  }
  // ─── Status Mapping ─────────────────────
  getCoachStatusClass(status: string): string {
    switch (status) {
      case 'PENDING_APPROVAL': return 'pending';
      case 'APPROVED': return 'completed';
      case 'REJECTED': return 'failed';
      case 'DEACTIVATED': return 'past';
      default: return 'pending';
    }
  }

  getCoachStatusLabel(status: string): string {
    const map: any = {
      PENDING_APPROVAL: 'Pending',
      APPROVED: 'Approved',
      REJECTED: 'Rejected',
      DEACTIVATED: 'Deactivated'
    };
    return map[status] || status;
  }
}