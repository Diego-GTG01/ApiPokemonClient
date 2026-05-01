import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPending } from './verify-pending';

describe('VerifyPending', () => {
  let component: VerifyPending;
  let fixture: ComponentFixture<VerifyPending>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyPending]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyPending);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
