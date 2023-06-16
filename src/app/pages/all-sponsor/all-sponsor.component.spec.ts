import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSponsorComponent } from './all-sponsor.component';

describe('AllSponsorComponent', () => {
  let component: AllSponsorComponent;
  let fixture: ComponentFixture<AllSponsorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSponsorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSponsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
