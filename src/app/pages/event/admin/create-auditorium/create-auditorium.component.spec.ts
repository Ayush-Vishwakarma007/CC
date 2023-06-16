import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAuditoriumComponent } from './create-auditorium.component';

describe('CreateAuditoriumComponent', () => {
  let component: CreateAuditoriumComponent;
  let fixture: ComponentFixture<CreateAuditoriumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAuditoriumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAuditoriumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
