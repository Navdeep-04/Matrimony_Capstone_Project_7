import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationDetails } from './donation-details';

describe('DonationDetails', () => {
  let component: DonationDetails;
  let fixture: ComponentFixture<DonationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
