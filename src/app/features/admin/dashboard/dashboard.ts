import { Component } from '@angular/core';
import {AdminLayout} from './../layout/admin-layout/admin-layout';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [AdminLayout,RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {

  constructor(){
  }
}
