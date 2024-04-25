import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerienComponent } from './serien.component';

describe('SerienComponent', () => {
  let component: SerienComponent;
  let fixture: ComponentFixture<SerienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SerienComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SerienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
