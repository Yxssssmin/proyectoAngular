import { Component, Input } from '@angular/core';
import { IArtwork } from '../../interfaces/i-artwork';
import { ArtworkComponent } from '../artwork/artwork.component';

@Component({
  selector: '[app-artwork-row]',
  standalone: true,
  imports: [ArtworkComponent],
  templateUrl: './artwork-row.component.html',
  styleUrl: './artwork-row.component.css'
})
export class ArtworkRowComponent {
  @Input() artwork!: IArtwork;
}
