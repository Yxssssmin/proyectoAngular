import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { ApiServiceService } from '../../services/api-service.service';
import { IArtwork } from '../../interfaces/i-artwork';
import { ArtworkRowComponent } from '../artwork-row/artwork-row.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ArtworkRowComponent, CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {

  constructor(
    private router: Router,
    private usersService: UsersService,
    private apiService: ApiServiceService
  ) {}

  ngOnInit(): void {
    //Comprobar que este logueado para mostrar la vista
    this.usersService.isLogged().then((logged) => {
      if (!logged) {
        alert('logueate');
      } else {
        this.loadFavorites();
      }
    });
  }

  loadFavorites(): void {
    this.usersService.isLogged().then((logged) => {
      if (!logged) 
        alert('LOGUEATE!!!')
      else {
        this.usersService.favoritesSubject.subscribe((data) => {
          //Convertir el resultado de la promesa en un array para iterar
          if (data.length === 0)
            this.noHayLikes = this.quadresFav.every((quadre) => !quadre.like); //Comprobar si existen los datos

          let artworksIds = data.map((item) => item.artwork_id);

          this.apiService //Convertirlo a la lista de strings artorks ids devueltos
            .getArtworksFromIDs(artworksIds)
            .subscribe((artworkList: IArtwork[]) => {
              this.quadresFav = artworkList;
            });
        });
      }
     // Obtener el uid del usuario si está disponible
     this.usersService.isLogged().then((data: any) => {
      if (data && data.session && data.session.user && data.session.user.id) {
        const uid = data.session.user.id;
        this.usersService.getFavorites(uid);
      }
    });
  
    });
  }

  quadresFav: IArtwork[] = [];
  noHayLikes: boolean = false;
}
