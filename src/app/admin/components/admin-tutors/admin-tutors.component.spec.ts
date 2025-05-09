import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTutorsComponent } from './admin-tutors.component';

describe('AdminTutorsComponent', () => {
  let component: AdminTutorsComponent;
  let fixture: ComponentFixture<AdminTutorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTutorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTutorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
