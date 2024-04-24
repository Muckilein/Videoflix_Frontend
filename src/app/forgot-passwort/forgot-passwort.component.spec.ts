import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswortComponent } from './forgot-passwort.component';

describe('ForgotPasswortComponent', () => {
  let component: ForgotPasswortComponent;
  let fixture: ComponentFixture<ForgotPasswortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswortComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForgotPasswortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
