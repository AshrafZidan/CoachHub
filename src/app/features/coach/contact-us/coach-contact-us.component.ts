import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coach-contact-us',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-panel">
      <h1>Contact Us</h1>
      <p>Get in touch with support and coaching operations here.</p>
    </section>
  `,
  styles: [
    `
      .page-panel {
        padding: 24px;
        background: #ffffff;
        border-radius: 18px;
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
      }
      h1 {
        margin: 0 0 12px;
        font-size: 1.6rem;
        color: rgba(15, 23, 42, 0.95);
      }
      p {
        margin: 0;
        color: rgba(15, 23, 42, 0.72);
      }
    `,
  ],
})
export class CoachContactUsComponent {}
