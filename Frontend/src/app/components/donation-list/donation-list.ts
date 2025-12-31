import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.spec';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donation-list',
  standalone: true,
  templateUrl: './donation-list.html',
  styleUrls: ['./donation-list.scss']
})
export class DonationListComponent implements OnInit {

  donations: any[] = [];
  loading = true;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.api.getDonations().subscribe({
      next: res => {
        this.donations = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to load donations');
      }
    });
  }

  openDetails(id: number) {
    this.router.navigate(['/donations', id]);
  }
}
