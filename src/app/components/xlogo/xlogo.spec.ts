import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xlogo } from './xlogo';

describe('Xlogo', () => {
  let component: Xlogo;
  let fixture: ComponentFixture<Xlogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Xlogo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Xlogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
