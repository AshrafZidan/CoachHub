import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappInput } from './whatsapp-input';

describe('WhatsappInput', () => {
  let component: WhatsappInput;
  let fixture: ComponentFixture<WhatsappInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappInput],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsappInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
