import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaMain } from './vista-main';

describe('VistaMain', () => {
  let component: VistaMain;
  let fixture: ComponentFixture<VistaMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
