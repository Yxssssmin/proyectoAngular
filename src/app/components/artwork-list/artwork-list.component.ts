import { Component, Input, OnInit } from '@angular/core';
import { ArtworkComponent } from '../artwork/artwork.component';
import { IArtwork } from '../../interfaces/i-artwork';
import { ArtworkRowComponent } from '../artwork-row/artwork-row.component';
import { ApiServiceService } from '../../services/api-service.service';
import { ArtworkFilterPipe } from '../../pipes/artwork-filter.pipe';
import { debounceTime, filter } from 'rxjs';
import { FilterService } from '../../services/filter.service';
import { UsersService } from '../../services/users.service';
import { PaginacionComponent } from '../paginacion/paginacion.component';
import { Pagination } from '../../interfaces/pagination';
import { Router } from '@angular/router';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-artwork-list',
  standalone: true,
  imports: [ArtworkComponent, ArtworkRowComponent, ArtworkFilterPipe, PaginacionComponent],
  templateUrl: './artwork-list.component.html',
  styleUrl: './artwork-list.component.css'
})
export class ArtworkListComponent implements OnInit {
  pages!: Pagination;

  constructor(private artService: ApiServiceService, 
    private filterService: FilterService,
    private usersService: UsersService,
    private router: Router,
    private paginationService: PaginationService
  ) {
    this.pages = paginationService.obtainPages();
  }


  async ngOnInit(): Promise<void> {
    console.log(this.onlyFavorites);

    if(this.onlyFavorites === 'favorites') {
      this.artService.getArtworksFromIDs(['3752', '11294', '6010'])
        .subscribe((artworkList: IArtwork[]) => this.quadres = artworkList);
    } else {
      this.loadArtworks(
        this.paginationService.obtainPages().actualPage,
        this.paginationService.obtainPages().limit
      );
        this.filterService.searchFilter
        .pipe(
          //filter(f=> f.length> 4 || f.length ===0),
          debounceTime(500))
          .subscribe((filter) => {
            this.filter = filter;
            this.artService.filterArtWorks(filter);
        });
    } 
  }

  loadArtworks(page: number, limit: number): void {
    this.artService
      .getArtWorks(page, limit)
      .subscribe((artworkList: IArtwork[]) => {
        const usersService = new UsersService();
        artworkList.map(async (quadre: any) => {
          const isFav = await usersService
            .getFavorites(quadre.id)
            .then((result) => result.length > 0);

          quadre.like = isFav;
        });

        this.quadres = artworkList;
        console.log(artworkList);
        this.paginationService.updateCurrentPageNumber(page);
        // Actualizar la URL con los parámetros de consulta
        this.router.navigate([], {
          queryParams: { page, limit },
        });
      });
  }
  
  toggleLike($event: boolean, artwork: IArtwork) {
    console.log($event, artwork);
    artwork.like = !artwork.like;
    if(artwork.like) {
      this.usersService.setFavorite(artwork.id + "")
    } else {
      this.usersService.removeFavorite(artwork.id + "")
    }
  }


  quadres: IArtwork[] = [];
  filter: string = '';
  @Input() onlyFavorites: string = '';
  
}
