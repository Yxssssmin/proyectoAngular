import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IArtwork } from '../../interfaces/i-artwork';

@Component({
  selector: 'app-paginacion',
  standalone: true,
  imports: [],
  templateUrl: './paginacion.component.html',
  styleUrl: './paginacion.component.css'
})
export class PaginacionComponent {

  @Input() artworks!: IArtwork[];
  @Input() currentPage!: number;
  @Output() pageChanged = new EventEmitter<number>();

  pageSize = 10;

  get totalPages(): number {
    return Math.ceil(this.artworks.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages },  (_, i) => i + 1);
  }

  previousPage() {
    if(this.currentPage > 1) {
      this.pageChanged.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if(this.currentPage < this.totalPages) {
      this.pageChanged.emit(this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    if(page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChanged.emit(page);
    }
  }
}
