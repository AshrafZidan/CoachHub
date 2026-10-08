import { CommonModule } from "@angular/common";

import { Component, inject } from "@angular/core";

import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import {
  CreateTaskTemplateRequest,
  TaskFormOption,
  TaskFormQuestion,
  TaskFormValue,
  TaskTemplateOption,
  TaskTemplateQuestion,
  TaskTemplateService,
} from "../services/task-template.service";

import { ToastService } from "../../../core/services/toast.service";

@Component({
  selector: "app-add-task",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./add-task.component.html",
  styleUrl: "./add-task.component.scss",
})
export class AddTaskComponent {
  private readonly fb = inject(FormBuilder);

  private readonly ser = inject(TaskTemplateService);

  private readonly toastService = inject(ToastService);

  isSubmitting = false;

  taskForm = this.fb.group({
    title: ["", Validators.required],

    description: ["", Validators.required],

    questions: this.fb.array<FormGroup>([]),
  });

  ngOnInit(): void {
    this.addQuestion();
  }

  get questions(): FormArray<FormGroup> {
    return this.taskForm.get("questions") as FormArray<FormGroup>;
  }

  private createQuestion(): FormGroup {
    return this.fb.group({
      questionText: ["", Validators.required],

      type: ["TEXT", Validators.required],

      required: [true],

      orderIndex: [this.questions.length + 1],

      options: this.fb.array<FormGroup>([]),
    });
  }

  addQuestion(): void {
    const question = this.createQuestion();

    this.questions.push(question);

    this.updateQuestionOrder();
  }

  removeQuestion(index: number): void {
    if (this.questions.length === 1) {
      return;
    }

    this.questions.removeAt(index);

    this.updateQuestionOrder();
  }

  getOptions(question: FormGroup): FormArray<FormGroup> {
    return question.get("options") as FormArray<FormGroup>;
  }

  addOption(question: FormGroup): void {
    const options = this.getOptions(question);

    options.push(
      this.fb.group({
        optionText: ["", Validators.required],
      }),
    );
  }

  removeOption(question: FormGroup, optionIndex: number): void {
    const options = this.getOptions(question);

    /*
     * Keep at least two options
     * for selection questions.
     */
    if (options.length <= 2) {
      return;
    }

    options.removeAt(optionIndex);
  }

  onQuestionTypeChange(question: FormGroup): void {
    const type = question.get("type")?.value;

    const options = this.getOptions(question);

    /*
     * Free Text
     * does not need answer options.
     */
    if (type === "TEXT") {
      options.clear();

      return;
    }

    /*
     * Both Single Selection and
     * Multiple Selection require
     * at least two options.
     */
    if (
      (type === "SINGLE_CHOICE" || type === "MULTIPLE_CHOICE") &&
      options.length === 0
    ) {
      this.addOption(question);
      this.addOption(question);
    }
  }

  private updateQuestionOrder(): void {
    this.questions.controls.forEach((question, index) => {
      question.patchValue(
        {
          orderIndex: index + 1,
        },
        {
          emitEvent: false,
        },
      );
    });
  }

  submit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    /*
     * Validate selection questions.
     */
    for (const question of this.questions.controls) {
      const type = question.get("type")?.value;

      if (
        (type === "SINGLE_CHOICE" || type === "MULTIPLE_CHOICE") &&
        this.getOptions(question).length < 2
      ) {
        this.toastService.error(
          "Selection questions must have at least two answer options.",
        );

        return;
      }
    }

    const formValue = this.taskForm.getRawValue();

    const payload: CreateTaskTemplateRequest = {
      title: formValue.title?.trim() ?? "",

      description: formValue.description?.trim() ?? "",

      questions: formValue.questions.map(
        (question, index): TaskTemplateQuestion => ({
          questionText: question["questionText"]?.trim() ?? "",

          type: question["type"],

          required: question["required"] ?? true,

          orderIndex: index + 1,

          options:
            question["type"] === "SINGLE_CHOICE" ||
            question["type"] === "MULTIPLE_CHOICE"
              ? (question["options"] ?? []).map((option: any) => ({
                  optionText: option["optionText"]?.trim() ?? "",
                }))
              : [],
        }),
      ),
    };

    console.log("[AddTask] Payload:", payload);

    this.isSubmitting = true;

    this.ser.createTaskTemplate(payload).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.toastService.success("Task created successfully.");

        this.taskForm.reset();

        this.questions.clear();

        this.addQuestion();
      },

      error: (error) => {
        console.error("[AddTask] Failed to create task", error);

        this.isSubmitting = false;
      },
    });
  }
}
