import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeMemberWithoutStepComponent } from './become-member-without-step.component';

describe('BecomeMemberWithoutStepComponent', () => {
  let component: BecomeMemberWithoutStepComponent;
  let fixture: ComponentFixture<BecomeMemberWithoutStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeMemberWithoutStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeMemberWithoutStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
