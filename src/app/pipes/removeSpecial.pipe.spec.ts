import {RemoveSpecialPipe } from './removeSpecial.pipe';
import { TestBed, async } from '@angular/core/testing';
describe('RemoveSpecialPipe', () => {
  it('Remove Special', () => {
    const pipe = new RemoveSpecialPipe();
    expect(pipe.transform('#aaaa')).toBeTruthy();
  });
});
