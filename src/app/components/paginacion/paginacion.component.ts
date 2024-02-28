import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IArtwork } from '../../interfaces/i-artwork';
import { Pagination } from '../../interfaces/pagination';
import { PaginationService } from '../../services/pagination.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paginacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paginacion.component.html',
  styleUrl: './paginacion.component.css'
})
export class PaginacionComponent {


  @Input() pages!: Pagination;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

  pageSize: number = 1;

  constructor(private paginationService: PaginationService) {
    this.pages = this.paginationService.obtainPages();
  }

  // Método que va a la última página
  lastPage(): void {
    this.goSearchPage(this.pages.totalPages);
  }

  // Método que va a la siguiente página
  gotonextPage(): void {
    const nextPage = this.pages.actualPage + 1;
    // Verifica que la siguiente página esté dentro del rango
    if(nextPage <= this.pages.totalPages) {
      this.goSearchPage(nextPage);
    }
  }
  
  // Método que va a la página anterior
  gotopreviousPage(): void {
    const previouspage = this.pages.actualPage - 1;
    // Verifica que la página anterior esté dentro del rango
    if(previouspage >= 1) {
      this.goSearchPage(previouspage);
    }
  }

  // Método que va a una página específica
  goSearchPage(page: number): void {
    this.pageChanged.emit(page);
    // Actualiza el número de página actual en el servicio de paginación
    this.paginationService.updateCurrentPageNumber(page);
  }

  // Método que muestra la página ingresada por número
  showPageByNumberEntered(): boolean {
    // Obtiene el número de la página ingresada
    const newPageSelected = this.pageSize;

    // Verifica si el número ingresado es un número entero
    if(!Number.isInteger(newPageSelected)) {
      console.error('Invalid number');
      return false;
    }

    // Verifica si el número ingresado está dentro del rango de páginas totales
    if(newPageSelected >= 1 && newPageSelected <= this.pages.totalPages) {
      // Va a la página especificada
      this.goSearchPage(newPageSelected);
      return true;
    }

    return false;
  }

}
