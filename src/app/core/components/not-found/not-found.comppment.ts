import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * NotFound Component (404)
 * Displays when user navigates to a non-existent route
 * Features:
 * - Animated 404 display
 * - Helpful error message
 * - Navigation options to return to app
 * - Responsive design
 */
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  /**
   * Attempted URL that resulted in 404
   */
  attemptedUrl: string = '';

  /**
   * Current year for copyright
   */
  currentYear: number = new Date().getFullYear();

  /**
   * Animation trigger
   */
  isLoaded: boolean = false;

  /**
   * Constructor
   */
  constructor(private router: Router) {}

  /**
   * Component initialization
   */
  ngOnInit(): void {
    // Get the attempted URL from the router
    this.attemptedUrl = this.router.url;

    // Trigger animation on load
    setTimeout(() => {
      this.isLoaded = true;
    }, 100);
  }

  /**
   * Navigate back to home page
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navigate back to previous page
   */
  goBack(): void {
    window.history.back();
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  /**
   * Navigate to help/support page
   */
  goToHelp(): void {
    this.router.navigate(['/help']);
  }
}