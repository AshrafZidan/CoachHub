import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachesManagement } from './coaches-management';

describe('CoachesManagement', () => {
  let component: CoachesManagement;
  let fixture: ComponentFixture<CoachesManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachesManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(CoachesManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
