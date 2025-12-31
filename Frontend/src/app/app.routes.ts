import { Routes } from '@angular/router';
import { DonationListComponent } from './components/donation-list/donation-list';
import { DonationDetailsComponent } from './components/donation-details/donation-details';
import { ContributionComponent } from './components/contribution/contribution';
import { NgodashboardComponent } from './components/ngo-dashboard/ngo-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'donations', pathMatch: 'full' },
  { path: 'donations', component: DonationListComponent },
  { path: 'donations/:id', component: DonationDetailsComponent },
  { path: 'donations/:id/contribute', component: ContributionComponent },
  { path: 'ngo/dashboard', component: NgodashboardComponent }
];
