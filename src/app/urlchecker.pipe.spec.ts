import { UrlcheckerPipe } from './urlchecker.pipe';
import {BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

describe('UrlcheckerPipe', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
  });
  it('create an instance', () => {
    let domSanitizer = TestBed.inject(DomSanitizer);
    const pipe = new UrlcheckerPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  });
});


