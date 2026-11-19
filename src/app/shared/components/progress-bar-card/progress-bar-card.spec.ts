import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarCard } from './progress-bar-card';
import { stubBrowserApis } from '../../../../testing/browser-stubs';


describe('ProgressBarCard', () => {
  let component: ProgressBarCard;
  let fixture: ComponentFixture<ProgressBarCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarCard]
    })
    .compileComponents();

    stubBrowserApis();
    fixture = TestBed.createComponent(ProgressBarCard);
    fixture.componentRef.setInput('skill', { name: 'Angular', icon: '/x.svg', level: 50, category: 'Frontend' });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
