import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateCard } from './certificate-card';

describe('CertificateCard', () => {
  let component: CertificateCard;
  let fixture: ComponentFixture<CertificateCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
