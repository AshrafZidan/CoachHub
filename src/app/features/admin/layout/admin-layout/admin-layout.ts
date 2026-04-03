import { Topbar } from './../topbar/topbar';
import { Component } from '@angular/core';
import { Sidebar } from './../sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [Topbar,Sidebar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {}
