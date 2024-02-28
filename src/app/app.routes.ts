import { Routes } from '@angular/router';
import { ArtworkListComponent } from './components/artwork-list/artwork-list.component';
import { ArtworkComponent } from './components/artwork/artwork.component';
import { ProfileComponent } from './components/authentication/profile/profile.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { FavoritesComponent } from './components/favorites/favorites.component';


export const routes: Routes = [
  { path: 'artworks', component: ArtworkListComponent },
  { path: 'artwork/:id', component: ArtworkComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'userManagement/login', component: LoginComponent },
  { path: 'userManagement/register', component: RegisterComponent },
  { path: 'userManagement/logout', component: LoginComponent },
  { path: '**', component: ArtworkListComponent }
];

