import { TestBed } from '@angular/core/testing';
import { SelectedService } from './selected.service'; // Importación corregida

describe('SelectedService', () => { // Nombre del describe actualizado
  let service: SelectedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedService); // Inyección corregida
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});