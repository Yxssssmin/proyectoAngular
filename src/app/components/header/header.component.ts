import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FilterService } from '../../services/filter.service';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  nickname: string |null = null;

  constructor(
    private filterService: FilterService, 
    private usersService: UsersService, 
    private router: Router) {}
  
  ngOnInit(): void {
    this.usersService.userSubject.subscribe(user => this.user = user);
    this.usersService.isLogged();
    this.nickname = this.getLocalStorageNickname();
  }
  
  user: IUser | null = null;
  defaultImage: string = 'assets/image/logo.svg'

  filter: string = '';

  changeFilter($event: Event){
    $event.preventDefault();
    this.filterService.searchFilter.next(this.filter);
  }

  getLocalStorageNickname(){
    return localStorage.getItem('uid');
  }

  logout() {
    this.usersService.logout();
    localStorage.removeItem('uid');
    this.router.navigate(['register']);  // Redirigir al registro después de cerrar sesión
  }
  

}
