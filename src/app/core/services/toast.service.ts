import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export type ToastSeverity = 'success' | 'error' | 'warn' | 'info';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messageService = inject(MessageService);

  // ─── Core method ──────────────────────────────────────
  show(
    severity: ToastSeverity,
    summary: string,
    detail: string,
    life = 4000
  ): void {
    this.messageService.add({ severity, summary, detail, life });
  }

  // ─── Shorthand helpers ────────────────────────────────
  success(detail: string, summary = 'Success', life = 4000): void {
    this.show('success', summary, detail, life);
  }

  error(detail: string, summary = 'Error', life = 5000): void {
    this.show('error', summary, detail, life);
  }

  warn(detail: string, summary = 'Warning', life = 4000): void {
    this.show('warn', summary, detail, life);
  }

  info(detail: string, summary = 'Info', life = 4000): void {
    this.show('info', summary, detail, life);
  }

  // ─── Clear all toasts ─────────────────────────────────
  clear(): void {
    this.messageService.clear();
  }
}