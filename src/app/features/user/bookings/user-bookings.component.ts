import {
	Component,
	signal,
	OnInit,
	OnDestroy,
	ChangeDetectorRef,
	inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastService } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';
import { MobileBooking, UserBookingsService } from '../services/user-bookings.service';

interface ViewBooking {
	id: number;
	name: string;
	title?: string;
	price?: number;
	discount?: number | null;
	finalPrice?: number;
	date: string;
	status: 'running'|'upcoming' | 'past' | 'completed' | string;
	avatar?: string;
	raw?: MobileBooking;
}

@Component({
	selector: 'app-coachee-booking',
	standalone: true,
	imports: [
		CommonModule,
		ConfirmDialogModule,
		SkeletonModule
	],
	providers: [ConfirmationService],
	templateUrl: './user-bookings.component.html',
	styleUrls: ['./user-bookings.component.scss']
})
export class UserBookingsComponent implements OnInit, OnDestroy {
	private service = inject(UserBookingsService);
	private toastService = inject(ToastService);
	private confirmationService = inject(ConfirmationService);
	private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);
	private subs: Subscription[] = [];

	tabs = ['Upcoming', 'History'];
	activeTab = signal<string>('Upcoming');

	// Pagination
	pageIndex = 0;
	pageSize = 50;
	hasMore = true;
	loading = false;

	// Booking currently starting
	startingBookingId: number | null = null;

	bookings: ViewBooking[] = [];

	ngOnInit(): void {
		window.addEventListener(
			'scroll',
			this.onWindowScroll,
			{ passive: true }
		);

		this.resetAndLoad();
	}

	ngOnDestroy(): void {
		window.removeEventListener(
			'scroll',
			this.onWindowScroll as any
		);

		this.subs.forEach(sub => sub.unsubscribe());
	}

	setTab(tab: string): void {
		if (this.activeTab() === tab) {
			return;
		}

		this.activeTab.set(tab);
		this.resetAndLoad();
	}

	private resetAndLoad(): void {
		this.pageIndex = 0;
		this.bookings = [];
		this.hasMore = true;

		this.loadPage();
	}

	private onWindowScroll = (): void => {
		if (this.loading || !this.hasMore) {
			return;
		}

		const scrollTop =
			window.scrollY ||
			document.documentElement.scrollTop;

		const viewport =
			window.innerHeight ||
			document.documentElement.clientHeight;

		const fullHeight =
			document.documentElement.scrollHeight;

		if (scrollTop + viewport >= fullHeight - 300) {
			this.loadPage();
		}
	};

	private loadPage(): void {
		this.loading = true;

		const tab = this.activeTab();

		const request$ =
			tab === 'Upcoming'
				? this.service.upcomingBookings(
						this.pageIndex,
						this.pageSize
				  )
				: this.service.pastBookings(
						this.pageIndex,
						this.pageSize
				  );

		const sub = request$.subscribe({
			next: res => {
				const items =
					(res.data || []) as MobileBooking[];

				const mapped =
					items.map(item =>
						this.mapToView(item)
					);

				this.bookings = [
					...this.bookings,
					...mapped
				];

				const totalPages =
					res.pageCount ??
					Math.ceil(
						(res.count ?? 0) /
							(res.pageSize ?? this.pageSize)
					);

				this.hasMore =
					this.pageIndex <
					(res.pageCount || totalPages);

				this.pageIndex++;
				this.loading = false;

				this.cdr.markForCheck();
			},

			error: () => {
				this.loading = false;
				this.hasMore = false;

				this.cdr.markForCheck();
			}
		});

		this.subs.push(sub);
	}

	private mapToView(
		m: MobileBooking
	): ViewBooking {
		const start = new Date(m.startTime);
		const end = new Date(m.endTime);

		const dateStr =
			`${start.toLocaleDateString()} ` +
			`${start.toLocaleTimeString()} to ` +
			`${end.toLocaleTimeString()}`;

		return {
			id: m.id,

			name:
				m.coacheeFullName ||
				'Unknown',

			title: '',

			price: m.price,

			discount: m.discount,

			finalPrice: m.finalPrice,

			date: dateStr,

			status:
				(m.status || '').toLowerCase(),
			avatar: m.coacheeProfileImageUrl,
			raw: m
		};
	}

	get filteredBookings(): ViewBooking[] {
		const tab = this.activeTab();
		return this.bookings;
		if (tab === 'Upcoming') {
			return this.bookings;
		}

		if (tab === 'History') {
			return this.bookings.filter(
				b =>
					b.status === 'past' ||
					b.status === 'completed' ||
					b.status === 'canceled'
			);
		}

		return this.bookings;
	}

	// =========================================================
	// CANCEL
	// =========================================================

	cancel(b: ViewBooking): void {
		if (!b) {
			return;
		}

		this.confirmationService.confirm({
			message:
				`Are you sure you want to cancel the session for ` +
				`<strong>${b.name}</strong>?`,

			header: 'Confirm Cancel',

			acceptLabel: 'Cancel',

			rejectLabel: 'Close',

			acceptButtonStyleClass:
				'no-radius p-button-danger p-button-sm',

			rejectButtonStyleClass:
				'no-radius p-button-secondary p-button-sm',

			accept: () => {
				const sub =
					this.service
						.cancelBooking(b.id)
						.subscribe({
							next: () => {
								this.toastService.success(
									'The booking has been canceled successfully',
									'Canceled Successfully'
								);

								this.resetAndLoad();
							},

							error: () => {
								this.toastService.error(
									'Failed to cancel the booking. Please try again.'
								);
							}
						});

				this.subs.push(sub);
			}
		});
	}



	// =========================================================
	// START SESSION
	// =========================================================

	/**
	 * The backend sends actions for every booking.
	 *
	 * Only an upcoming booking that contains
	 * START can show the Start Now button.
	 */
	hasStartAction(b: ViewBooking): boolean {
		if (b.status !== 'upcoming') {
			return false;
		}

		return !!b.raw?.actions?.some(
			action => action.value === 'START'
		);
	}
	hasJoinAction(b: ViewBooking): boolean {
	return b.status === 'running' &&
		!!b.raw?.actions?.some(action => action.value === 'START');
}
	hasCancelAction(b: ViewBooking): boolean {
	return !!b.raw?.actions?.some(
		action => action.value === 'CANCEL'
	);
}
	/**
	 * Used to show loading only on the
	 * booking being started.
	 */
	isStarting(b: ViewBooking): boolean {
		return this.startingBookingId === b.id;
	}

	/**
	 * Start the session and open the returned
	 * third-party meeting URL.
	 */
startNow(b: ViewBooking): void {
	if (!b) {
		return;
	}

	if (
		b.status !== 'upcoming' &&
		b.status !== 'running'
	) {
		return;
	}

	// Upcoming → START
	// Running → JOIN
	if (
		b.status === 'upcoming' &&
		!this.hasStartAction(b)
	) {
		return;
	}

	if (
		b.status === 'running' &&
		!this.hasJoinAction(b)
	) {
		return;
	}

	if (this.startingBookingId !== null) {
		return;
	}

	this.startingBookingId = b.id;

	this.cdr.markForCheck();

	const sub = this.service
		.startSession(b.id)
		.subscribe({
			next: res => {
				this.startingBookingId = null;

				const sessionUrl =
					res?.data?.sessionUrl;

				if (!sessionUrl) {
					this.toastService.error(
						'Unable to start the session. No meeting URL was returned.'
					);

					this.cdr.markForCheck();
					return;
				}

				this.router.navigate(
					['/coach/session', b.id],
					{
						state: {
							sessionUrl
						}
					}
				);
			},

			error: err => {
				this.startingBookingId = null;

				const message =
					err?.error?.messageEn ||
					'Failed to start the session. Please try again.';

				this.toastService.error(message);

				this.cdr.markForCheck();
			}
		});

	this.subs.push(sub);
}
}