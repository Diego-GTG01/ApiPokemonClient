import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyPendingComponent } from './verify-pending';

describe('VerifyPending', () => {
  let component: VerifyPendingComponent;
  let fixture: ComponentFixture<VerifyPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
