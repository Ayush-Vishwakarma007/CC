import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyItemsGuestLoginComponent } from './buy-items-guest-login.component';

describe('BuyItemsGuestLoginComponent', () => {
  let component: BuyItemsGuestLoginComponent;
  let fixture: ComponentFixture<BuyItemsGuestLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyItemsGuestLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyItemsGuestLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
