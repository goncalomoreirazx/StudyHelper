import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorTableComponent } from './tutor-table.component';

describe('TutorTableComponent', () => {
  let component: TutorTableComponent;
  let fixture: ComponentFixture<TutorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
