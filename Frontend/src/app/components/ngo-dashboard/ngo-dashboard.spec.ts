import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgoDashboard } from './ngo-dashboard';

describe('NgoDashboard', () => {
  let component: NgoDashboard;
  let fixture: ComponentFixture<NgoDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgoDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgoDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
