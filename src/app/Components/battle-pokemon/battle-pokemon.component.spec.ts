import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlePokemonComponent } from './battle-pokemon.component';

describe('BattlePokemonComponent', () => {
  let component: BattlePokemonComponent;
  let fixture: ComponentFixture<BattlePokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattlePokemonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattlePokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
