import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedPokemonComponent } from './selected-pokemon.component';

describe('SelectedPokemonComponent', () => {
  let component: SelectedPokemonComponent;
  let fixture: ComponentFixture<SelectedPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedPokemonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
