import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  CreateTaskTemplateRequest,
  TaskFormOption,
  TaskFormQuestion,
  TaskFormValue,
  TaskTemplateOption,
  TaskTemplateQuestion,
  TaskTemplateService
} from '../services/task-template.service';

import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {

  private readonly fb = inject(FormBuilder);
  private readonly ser = inject(TaskTemplateService);
  private readonly toastService = inject(ToastService);

  isSubmitting = false;

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    questions: this.fb.array<FormGroup>([])
  });

  ngOnInit(): void {
    this.addQuestion();
  }

  get questions(): FormArray<FormGroup> {
    return this.taskForm.get(
      'questions'
    ) as FormArray<FormGroup>;
  }

  private createQuestion(): FormGroup {
    return this.fb.group({
      questionText: ['', Validators.required],
      type: ['TEXT', Validators.required],
      required: [true],
      orderIndex: [this.questions.length + 1],
      options: this.fb.array<FormGroup>([])
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

  getOptions(
    question: FormGroup
  ): FormArray<FormGroup> {
    return question.get(
      'options'
    ) as FormArray<FormGroup>;
  }

  addOption(question: FormGroup): void {
    const options = this.getOptions(question);

    options.push(
      this.fb.group({
        optionText: ['', Validators.required]
      })
    );
  }

  removeOption(
    question: FormGroup,
    optionIndex: number
  ): void {

    const options = this.getOptions(question);

    options.removeAt(optionIndex);
  }

  onQuestionTypeChange(
    question: FormGroup
  ): void {

    const type = question.get('type')?.value;

    const options = this.getOptions(question);

    if (type === 'TEXT') {
      options.clear();
      return;
    }

    // Multiple choice should have at least two options
    if (
      type === 'MULTIPLE_CHOICE' &&
      options.length === 0
    ) {
      this.addOption(question);
      this.addOption(question);
    }
  }

  private updateQuestionOrder(): void {

    this.questions.controls.forEach(
      (question, index) => {

        question.patchValue(
          {
            orderIndex: index + 1
          },
          {
            emitEvent: false
          }
        );

      }
    );
  }

  submit(): void {

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.taskForm.getRawValue() as TaskFormValue;

    const payload: CreateTaskTemplateRequest = {

      title:
        formValue.title?.trim() ?? '',

      description:
        formValue.description?.trim() ?? '',

      questions:
        formValue.questions.map(
          (
            question: TaskFormQuestion,
            index: number
          ): TaskTemplateQuestion => ({

            questionText:
              question.questionText?.trim() ?? '',

            type:
              question.type,

            required:
              question.required ?? true,

            orderIndex:
              index + 1,

            options:
              question.type === 'MULTIPLE_CHOICE'
                ? question.options.map(
                    (
                      option: TaskFormOption
                    ): TaskTemplateOption => ({

                      optionText:
                        option.optionText?.trim() ?? ''

                    })
                  )
                : []

          })
        )
    };

    this.isSubmitting = true;

    this.ser
      .createTaskTemplate(payload)
      .subscribe({

        next: response => {


          this.isSubmitting = false;

          this.toastService.success(
            'Task created successfully.'
          );
          this.taskForm.reset();
        },

        error: error => {

          console.error(
            '[AddTask] Failed to create task',
            error
          );

          this.isSubmitting = false;

          this.toastService.error(
            'Failed to create task. Please try again later.'
          );
        }

      });
  }
}