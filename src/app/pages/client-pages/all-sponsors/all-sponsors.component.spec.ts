import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSponsorsComponent } from './all-sponsors.component';

describe('AllSponsorsComponent', () => {
  let component: AllSponsorsComponent;
  let fixture: ComponentFixture<AllSponsorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSponsorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSponsorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
