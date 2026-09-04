import {
    ChangeDetectorRef,
	Component,
	OnInit,
	inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CoacheeService, TaskAssignment } from '../../features/coach/coachees/coach-coachees.service';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { CoachToDoService, TaskTemplate, TaskTemplateResponse } from '../../features/coach/services/todo-bookings.service';
import { SelectModule } from 'primeng/select';
import { CoachBookingsService } from '../../features/coach/services/coach-bookings.service';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-session',
	standalone: true,
	imports: [
		CommonModule,
        DialogModule,
	    SelectModule,
	    DatePickerModule,
        ButtonModule,
        FormsModule

	],
	templateUrl: './session.component.html',
	styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

	private route = inject(ActivatedRoute);
	private router = inject(Router);
    private coacheeService = inject(CoacheeService);
    private coachToDoService = inject(CoachToDoService);
    private cdr = inject(ChangeDetectorRef);
	bookingId!: number;
	sessionUrl = '';
    loadingTasks:boolean = false;
    loadingTaskTemplates:boolean = false;
     	assigningTask = false;

	showAssignTaskDialog = false;

    assignedTasks:TaskAssignment[] = [];
    taskTemplates: TaskTemplate[] = [];
    selectedTask: TaskTemplate | null = null;
    	dueDate: Date | null = null;
today = new Date();

	private sanitizer = inject(DomSanitizer);

	safeSessionUrl!: SafeResourceUrl;


	ngOnInit(): void {
	this.bookingId = Number(
		this.route.snapshot.paramMap.get('bookingId')
	);

	const navigation =
		this.router.getCurrentNavigation();

	this.sessionUrl =
		navigation?.extras?.state?.['sessionUrl'] ||
		history.state?.sessionUrl ||
		'';

	if (!this.sessionUrl) {
		this.router.navigate([
			'/coach/bookings'
		]);

		return;
	}

	this.safeSessionUrl =
		this.sanitizer
			.bypassSecurityTrustResourceUrl(
				this.sessionUrl
			);

    this.loadAssignedTasks();
}



private loadAssignedTasks(): void {
	this.loadingTasks = true;

	this.cdr.markForCheck();

	this.coacheeService
		.getBookingDetail(this.bookingId)
		.subscribe({
			next: res => {
				this.assignedTasks =
					res?.data || [];

				this.loadingTasks = false;

				this.cdr.markForCheck();
			},

			error: () => {
				this.assignedTasks = [];
				this.loadingTasks = false;

				this.cdr.markForCheck();
			}
		});
}

	assignTask(): void {
	this.selectedTask = null;
	this.dueDate = null;

	this.showAssignTaskDialog = true;

	if (!this.taskTemplates.length) {
		this.loadTaskTemplates();
	}
}

	endSession(): void {
		// call your end-session API
	}

	backToBookings(): void {
		this.router.navigate([
			'/coach/bookings'
		]);
	}

    private loadTaskTemplates(): void {

	this.loadingTaskTemplates = true;

	this.coachToDoService
		.getTaskTemplatesForCoach(null,null)
		.subscribe({
			next: res => {
	            this.taskTemplates =
					res.data || [];

				this.loadingTaskTemplates = false;
			},

			error: () => {

				this.taskTemplates = [];

				this.loadingTaskTemplates = false;
			}
		});
}

assignSelectedTask(): void {

	if (!this.selectedTask) {
		return;
	}

	if (!this.dueDate) {
		return;
	}

	this.assigningTask = true;

	const request = {
		taskTemplateId:
			this.selectedTask.id,

		bookingId:
			this.bookingId,

		dueDate:
			this.formatDate(this.dueDate)
	};

	this.coacheeService.assignTaskToBooking(request)
		.subscribe({
			next: () => {

				this.assigningTask = false;

				this.showAssignTaskDialog = false;

				this.selectedTask = null;
				this.dueDate = null;

				// Refresh assigned tasks
				this.loadAssignedTasks();
			},

			error: () => {

				this.assigningTask = false;
			}
		});
}

private formatDate(date: Date): string {

	const year =
		date.getFullYear();

	const month =
		String(
			date.getMonth() + 1
		).padStart(2, '0');

	const day =
		String(
			date.getDate()
		).padStart(2, '0');

	return `${year}-${month}-${day}`;
}
}