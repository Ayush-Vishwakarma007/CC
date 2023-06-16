import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyItemsPaymentComponent } from './buy-items-payment.component';

describe('BuyItemsPaymentComponent', () => {
  let component: BuyItemsPaymentComponent;
  let fixture: ComponentFixture<BuyItemsPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyItemsPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyItemsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
