import { Injectable } from '@angular/core';
import { Pagination } from '../interfaces/pagination';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

   // Instancia de la interfaz Paginacion
   private pages: Pagination = {
    total: 124258,
    limit: 15,
    firstPage: 1,
    actualPage: 1,
    totalPages: 20710,
  };

  obtainPages(): Pagination {
    return this.pages;
  }

  updateCurrentPageNumber(numberPage: number): void {
    this.pages.actualPage = numberPage;
  }
}
