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

@Component({
  selector: 'app-artwork-list',
  standalone: true,
  imports: [ArtworkComponent, ArtworkRowComponent, ArtworkFilterPipe, PaginacionComponent],
  templateUrl: './artwork-list.component.html',
  styleUrl: './artwork-list.component.css'
})
export class ArtworkListComponent implements OnInit {

  constructor(private artService: ApiServiceService, 
    private filterService: FilterService,
    private usesService: UsersService
  ) {}


  ngOnInit(): void {
    console.log(this.onlyFavorites);

    if(this.onlyFavorites != 'favorites') {
      this.artService.getArtWorks().pipe(
        //demanar i marcar les favorites
      )
      .subscribe((artworkList: IArtwork[]) => this.quadres = artworkList);
    } else {
        // Demanar les favorites
        this.artService.getArtworksFromIDs(['3752', '11294', '6010'])
        .subscribe((artworkList: IArtwork[]) => this.quadres = artworkList);

    }

    this.filterService.searchFilter.pipe(
      //filter(f=> f.length> 4 || f.length ===0),
      debounceTime(500)
    ).subscribe(filter => this.artService.filterArtWorks(filter));

  }
  
  toggleLike($event: boolean, artwork: IArtwork) {
    console.log($event, artwork);
    artwork.like = !artwork.like;
    this.usesService.setFavorite(artwork.id + "")
  }
  
  currentPage = 1;
  artworksPerPage = 10;
  
  get currentArtworks(): IArtwork[] {
    const startIndex = (this.currentPage - 1) * this.artworksPerPage;
    const endIndex = startIndex + this.artworksPerPage;
    return this.quadres.slice(startIndex, endIndex);
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
  }


  quadres: IArtwork[] = [];
  filter: string = '';
  @Input() onlyFavorites: string = '';
  
}
