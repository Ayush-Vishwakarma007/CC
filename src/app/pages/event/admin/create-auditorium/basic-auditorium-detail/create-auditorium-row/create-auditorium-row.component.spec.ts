import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAuditoriumRowComponent } from './create-auditorium-row.component';

describe('CreateAuditoriumRowComponent', () => {
  let component: CreateAuditoriumRowComponent;
  let fixture: ComponentFixture<CreateAuditoriumRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAuditoriumRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAuditoriumRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
