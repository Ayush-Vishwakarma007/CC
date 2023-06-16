import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicAuditoriumDetailComponent } from './basic-auditorium-detail.component';

describe('BasicAuditoriumDetailComponent', () => {
  let component: BasicAuditoriumDetailComponent;
  let fixture: ComponentFixture<BasicAuditoriumDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicAuditoriumDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicAuditoriumDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
