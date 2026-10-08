import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  NgZone,
  OnInit,
  afterNextRender,
  inject,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { RadioButtonModule } from "primeng/radiobutton";
import { TextareaModule } from "primeng/textarea";

import { AuthService } from "../../../core/services/auth.service";

import {
  TaskAssignmentQuestion,
  TaskDetails,
  TaskQuestion,
  ToDoService,
} from "../../../features/coach/services/todo-bookings.service";

interface TaskAnswer {
  questionId: number;
  answerText?: string;
  selectedOptionId?: number;
}

@Component({
  selector: "app-task-details",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RadioButtonModule,
    TextareaModule,
    InputTextModule,
  ],
  templateUrl: "./task-details.component.html",
  styleUrl: "./task-details.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly todoService = inject(ToDoService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);
  private readonly injector = inject(Injector);

  readonly authService = inject(AuthService);

  task: TaskDetails | null = null;

  isLoading = true;
  hasError = false;
  submitting = false;

  private answersMap = new Map<number, TaskAnswer>();

  // =========================================================
  // Lifecycle
  // =========================================================

  ngOnInit(): void {
    afterNextRender(
      () => {
        if (this.isCoach()) {
          this.loadCoachTask();
        } else {
          this.loadCoacheeTask();
        }
      },
      { injector: this.injector },
    );
  }

  // =========================================================
  // Coach
  // =========================================================

  private loadCoachTask(): void {
    this.isLoading = true;
    this.hasError = false;
    this.task = null;

    const navigation = this.router.getCurrentNavigation();

    const taskFromNavigation = navigation?.extras?.state?.["task"] as
      | TaskDetails
      | undefined;

    const taskFromHistory = history.state?.task as TaskDetails | undefined;

    const sourceTask = taskFromNavigation ?? taskFromHistory ?? null;

    if (!sourceTask) {
      this.isLoading = false;
      this.hasError = true;

      this.cdr.markForCheck();

      return;
    }

    const normalizedTask: TaskDetails = {
      ...sourceTask,
      questions: sourceTask.questions ?? [],
    };

    this.initializeAnswers(
      normalizedTask.questions as TaskAssignmentQuestion[],
    );

    this.task = normalizedTask;
    this.isLoading = false;
    this.hasError = false;

    this.cdr.markForCheck();
  }

  // =========================================================
  // Coachee
  // =========================================================

  private loadCoacheeTask(): void {
    this.isLoading = true;
    this.hasError = false;
    this.task = null;

    const assignmentIdParam =
      this.route.snapshot.paramMap.get("assignmentId") ??
      this.route.snapshot.paramMap.get("id");

    const assignmentId = Number(assignmentIdParam);

    if (
      !assignmentIdParam ||
      !Number.isInteger(assignmentId) ||
      assignmentId <= 0
    ) {
      this.isLoading = false;
      this.hasError = true;

      this.cdr.markForCheck();

      return;
    }

    this.todoService.getTaskAssignmentDetails(assignmentId).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          const details = response?.data;

          if (!details) {
            this.task = null;
            this.hasError = true;
            this.isLoading = false;

            this.cdr.markForCheck();

            return;
          }

          const questions = details.questions ?? [];

          const loadedTask: TaskDetails = {
            id: details.assignmentId,
            assignmentId: details.assignmentId,
            templateId: details.templateId,
            title: details.title,
            description: details.description,
            status: details.status,
            dueDate: details.dueDate,
            questions,
          };

          this.initializeAnswers(questions);

          this.task = loadedTask;
          this.hasError = false;
          this.isLoading = false;

          this.cdr.markForCheck();
        });
      },

      error: (error: unknown) => {
        this.ngZone.run(() => {
          console.error("[TaskDetails] Load error:", error);

          this.task = null;
          this.hasError = true;
          this.isLoading = false;

          this.cdr.markForCheck();
        });
      },
    });
  }

  // =========================================================
  // Role
  // =========================================================

  isCoach(): boolean {
    return this.authService.isCoach();
  }

  isCoachee(): boolean {
    return !this.authService.isCoach();
  }

  // =========================================================
  // Questions
  // =========================================================

  get questions(): TaskQuestion[] {
    return this.task?.questions ?? [];
  }

  isTextQuestion(type: string | null | undefined): boolean {
    return type === "TEXT";
  }

  isSingleChoice(type: string | null | undefined): boolean {
    return type === "SINGLE_CHOICE";
  }

  isMultipleChoice(type: string | null | undefined): boolean {
    return type === "MULTIPLE_CHOICE";
  }

  isChoiceQuestion(type: string | null | undefined): boolean {
    return this.isSingleChoice(type) || this.isMultipleChoice(type);
  }

  getQuestionTypeLabel(type: string | null | undefined): string {
    switch (type) {
      case "SINGLE_CHOICE":
        return "Single Choice";

      case "MULTIPLE_CHOICE":
        return "Multiple Choice";

      case "TEXT":
        return "Free Text";

      default:
        return "Question";
    }
  }

  // =========================================================
  // Answers
  // =========================================================

  private initializeAnswers(questions: TaskAssignmentQuestion[]): void {
    const newAnswers = new Map<number, TaskAnswer>();

    for (const question of questions) {
      const answer: TaskAnswer = {
        questionId: question.id,
      };

      if (question.answerText !== undefined && question.answerText !== null) {
        answer.answerText = question.answerText;
      }

      /**
       * Both SINGLE_CHOICE and MULTIPLE_CHOICE now use
       * selectedOptionId.
       */
      if (
        question.selectedOptionId !== undefined &&
        question.selectedOptionId !== null
      ) {
        answer.selectedOptionId = Number(question.selectedOptionId);
      }

      newAnswers.set(question.id, answer);
    }

    this.answersMap = newAnswers;
  }

  private getAnswer(questionId: number): TaskAnswer {
    return (
      this.answersMap.get(questionId) ?? {
        questionId,
      }
    );
  }

  // =========================================================
  // Text Answer
  // =========================================================

  getTextAnswer(questionId: number): string {
    return this.answersMap.get(questionId)?.answerText ?? "";
  }

  setTextAnswer(questionId: number, value: string): void {
    const current = this.getAnswer(questionId);

    const updated: TaskAnswer = {
      ...current,
      questionId,
      answerText: value,
    };

    const newAnswers = new Map(this.answersMap);
    newAnswers.set(questionId, updated);

    this.answersMap = newAnswers;

    this.cdr.markForCheck();
  }

  // =========================================================
  // CHOICE ANSWER
  // SINGLE_CHOICE + MULTIPLE_CHOICE
  // =========================================================

  getSelectedOption(questionId: number): number | null {
    return this.answersMap.get(questionId)?.selectedOptionId ?? null;
  }

  setSelectedOption(questionId: number, optionId: number): void {
    const current = this.getAnswer(questionId);

    const updated: TaskAnswer = {
      ...current,
      questionId,
      selectedOptionId: Number(optionId),
    };

    const newAnswers = new Map(this.answersMap);
    newAnswers.set(questionId, updated);

    this.answersMap = newAnswers;

    this.cdr.markForCheck();
  }

  // =========================================================
  // Task State
  // =========================================================

  get canAnswer(): boolean {
    return this.isCoachee() && this.task?.status === "ASSIGNED";
  }

  get isCompleted(): boolean {
    return this.task?.status === "COMPLETED";
  }

  // =========================================================
  // Validation
  // =========================================================

  isAnswerInvalid(question: TaskQuestion): boolean {
    if (!question.required) {
      return false;
    }

    const answer = this.answersMap.get(question.id);

    if (this.isChoiceQuestion(question.type)) {
      return answer?.selectedOptionId === undefined;
    }

    return !answer?.answerText?.trim();
  }

  isFormValid(): boolean {
    const task = this.task;

    if (!task || task.questions.length === 0) {
      return false;
    }

    return task.questions.every(
      (question) => !question.required || !this.isAnswerInvalid(question),
    );
  }

  // =========================================================
  // Submit
  // =========================================================

  submitTask(): void {
    if (this.submitting) {
      return;
    }

    if (!this.task || !this.canAnswer) {
      return;
    }

    if (!this.isFormValid()) {
      return;
    }

    const assignmentId = this.task.assignmentId;

    if (!assignmentId) {
      console.error("[TaskDetails] Missing assignment ID");
      return;
    }

    this.submitting = true;

    this.cdr.markForCheck();

    const answers = Array.from(this.answersMap.values()).map(
      (
        answer,
      ): {
        questionId: number;
        answerText?: string;
        selectedOptionId?: number;
      } => {
        const payload: {
          questionId: number;
          answerText?: string;
          selectedOptionId?: number;
        } = {
          questionId: answer.questionId,
        };

        if (
          answer.answerText !== undefined &&
          answer.answerText.trim().length > 0
        ) {
          payload.answerText = answer.answerText.trim();
        }

        if (answer.selectedOptionId !== undefined) {
          payload.selectedOptionId = Number(answer.selectedOptionId);
        }

        return payload;
      },
    );

    this.todoService
      .submitTaskAnswers({
        assignmentId,
        answers,
      })
      .subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.submitting = false;

            this.cdr.markForCheck();

            this.router.navigate(["/coachee/todo"]);
          });
        },

        error: (error: unknown) => {
          this.ngZone.run(() => {
            console.error("[TaskDetails] Submit error:", error);

            this.submitting = false;

            this.cdr.markForCheck();
          });
        },
      });
  }

  // =========================================================
  // Navigation
  // =========================================================

  goBack(): void {
    this.router.navigate([this.isCoach() ? "/coach/todo" : "/coachee/todo"]);
  }
}
