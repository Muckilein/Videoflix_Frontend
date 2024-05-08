import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayFilmComponent } from './play-film.component';

describe('PlayFilmComponent', () => {
  let component: PlayFilmComponent;
  let fixture: ComponentFixture<PlayFilmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayFilmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
