import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Card } from './card';
import { stubBrowserApis } from '../../../../testing/browser-stubs';


describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card]
    })
    .compileComponents();

    stubBrowserApis();
    fixture = TestBed.createComponent(Card);
    fixture.componentRef.setInput('project', { image: '/x.png', title: 'Test', description: 'Desc', badges: ['Angular'], variant: 'featured' });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
