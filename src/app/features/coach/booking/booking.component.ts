import { Component, signal, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';
import { CoachBookingsService, MobileBooking } from '../services/coach-bookings.service';

interface ViewBooking {
	id: number;
	name: string;
	title?: string;
	price?: number;
	discount?: number | null;
	finalPrice?: number;
	date: string; // formatted string
	status: 'upcoming' | 'past' | 'completed' | string;
	avatar?: string;
	raw?: MobileBooking;
}

@Component({
	selector: 'app-coach-booking',
	standalone: true,
	imports: [CommonModule, ConfirmDialogModule],
	providers: [ConfirmationService],
	templateUrl: './booking.component.html',
	styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, OnDestroy {
	private service = inject(CoachBookingsService);
	private auth = inject(AuthService);
	private toastService = inject(ToastService);
	private confirmationService = inject(ConfirmationService);
	private cdr = inject(ChangeDetectorRef);
	private ngZone = inject(NgZone);
	private subs: Subscription[] = [];

	tabs = ['Upcoming', 'History'];
	activeTab = signal<string>('Upcoming');

	// pagination
	pageIndex = 0;
	pageSize = 10;
	hasMore = true;
	loading = false;

	bookings: ViewBooking[] = [];

	ngOnInit(): void {
		window.addEventListener('scroll', this.onWindowScroll, { passive: true });
		this.resetAndLoad();
	}

	ngOnDestroy(): void {
		window.removeEventListener('scroll', this.onWindowScroll as any);
		this.subs.forEach(s => s.unsubscribe());
	}

	setTab(tab: string) {
		if (this.activeTab() === tab) return;
		this.activeTab.set(tab);
		this.resetAndLoad();
	}

	private resetAndLoad() {
		this.pageIndex = 0;
		this.bookings = [];
		this.hasMore = true;
		this.loadPage();
	}

	private onWindowScroll = (): void => {
		if (this.loading || !this.hasMore) return;
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const viewport = window.innerHeight || document.documentElement.clientHeight;
		const fullHeight = document.documentElement.scrollHeight;
		// when scrolled within 300px from bottom, load next
		if (scrollTop + viewport >= fullHeight - 300) {
			this.loadPage();
		}
	};

	private loadPage() {
		this.loading = true;
		const tab = this.activeTab();

		const svcCall = tab === 'Upcoming'
			? this.service.upcomingBookings(this.pageIndex, this.pageSize)
			: this.service.pastBookings(this.pageIndex, this.pageSize);

		const s = svcCall.subscribe({
			next: (res) => {
				const items = (res.data || []) as MobileBooking[];
				const mapped = items.map(m => this.mapToView(m));
				this.bookings = [...this.bookings, ...mapped];
				const totalPages = res.pageCount ?? Math.ceil((res.count ?? 0) / (res.pageSize ?? this.pageSize));
				this.hasMore = (this.pageIndex < (res.pageCount || totalPages));
				this.pageIndex += 1;
				this.loading = false;
				this.cdr.markForCheck();
			},
			error: () => {
				this.loading = false;
				this.hasMore = false;
				this.cdr.markForCheck();
			}
		});

		this.subs.push(s);
	}

	private mapToView(m: MobileBooking): ViewBooking {
		const start = new Date(m.startTime);
		const end = new Date(m.endTime);
		const dateStr = `${start.toLocaleDateString()} ${start.toLocaleTimeString()} to ${end.toLocaleTimeString()}`;
		return {
			id: m.id,
			name: m.coacheeFullName || 'Unknown',
			title: '',
			price: m.price,
			discount: m.discount,
			finalPrice: m.finalPrice,
			date: dateStr,
			status: (m.status || '').toLowerCase(),
			avatar: m.coacheeProfileImageUrl || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23ccc%22%3E%3Cpath d=%22M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z%22/%3E%3C/svg%3E',
			raw: m
		};
	}

	get filteredBookings() {
		const t = this.activeTab();
		if (t === 'Upcoming') return this.bookings.filter(b => b.status === 'upcoming');
		if (t === 'Past') return this.bookings.filter(b => b.status === 'past' || b.status === 'completed' || b.status === 'canceled');
		return this.bookings;
	}

	cancel(b: ViewBooking) {
		if (!b) return;

		this.confirmationService.confirm({
			message: `Are you sure you want to cancel the session for <strong>${b.name}</strong>?`,
			header: 'Confirm Cancel',
			acceptLabel: 'Cancel',
			rejectLabel: 'Close',
			acceptButtonStyleClass: 'no-radius p-button-danger p-button-sm',
			rejectButtonStyleClass: 'no-radius p-button-secondary p-button-sm',
			accept: () => {
				const sub = this.service.cancelBooking(b.id).subscribe({
					next: () => {
						this.toastService.success('The booking has been canceled successfully', 'Canceled Successfully');
						this.resetAndLoad();
					},
					error: () => {
						this.toastService.error('Failed to cancel the booking. Please try again.');
					}
				});
				this.subs.push(sub);
			}
		});
	}

	hasCancelAction(b: ViewBooking): boolean {
		return !!b.raw?.actions?.some(action => action.value === 'CANCEL');
	}

	hasStartAction(b: ViewBooking): boolean {
		return !!b.raw?.actions?.some(action => action.value === 'START' || action.value === 'JOIN');
	}

	startNow(b: ViewBooking) {
		console.log('start', b.id);
	}
}