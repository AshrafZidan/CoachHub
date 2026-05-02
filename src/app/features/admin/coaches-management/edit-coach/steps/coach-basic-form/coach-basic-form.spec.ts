import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachBasicForm } from './coach-basic-form';

describe('CoachBasicForm', () => {
  let component: CoachBasicForm;
  let fixture: ComponentFixture<CoachBasicForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachBasicForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CoachBasicForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
