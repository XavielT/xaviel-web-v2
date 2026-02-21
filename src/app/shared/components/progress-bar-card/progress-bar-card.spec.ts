import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarCard } from './progress-bar-card';

describe('ProgressBarCard', () => {
  let component: ProgressBarCard;
  let fixture: ComponentFixture<ProgressBarCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressBarCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
