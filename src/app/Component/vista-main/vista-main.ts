import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pokemon } from '../../Interface/pokemon';

@Component({
  selector: 'app-vista-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vista-main.html',
  styleUrl: './vista-main.css',
})
export class VistaMain {
  
  
  
  // Datos de ejemplo 
  pokemons: Pokemon[] = [
    {
      id: 1,
      nombre: 'bulbasaur',
      tipo: 'planta,veneno',
      imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
    },
    {
      id: 4,
      nombre: 'charmander',
      tipo: 'fuego',
      imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
    },
    {
      id: 7,
      nombre: 'squirtle',
      tipo: 'agua',
      imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png'
    },
    {
      id: 25,
      nombre: 'pikachu',
      tipo: 'electrico',
      imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
    },
    {
      id: 39,
      nombre: 'jigglypuff',
      tipo: 'normal,hada',
      imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png'
    }
  ];

  // Mapeo de colores por tipo de Pokémon
  private typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fuego: '#F08030',
    agua: '#6890F0',
    electrico: '#F8D030',
    planta: '#78C850',
    veneno: '#A040A0',
    psiquico: '#F85888',
    roca: '#B8A038',
    tierra: '#E0C068',
    hielo: '#98D8D8',
    bicho: '#A8B820',
    dragon: '#7038F8',
    fantasma: '#705898',
    siniestro: '#705848',
    acero: '#B8B8D0',
    hada: '#EE99AC',
    lucha: '#C03028',
    volador: '#A890F0'
  };
  // Constructor
  constructor() {
    
  }

  // Obtener los colores según los tipos del Pokémon
  getCardStyle(pokemon: Pokemon): any {
    const tipos = this.obtenerTipos(pokemon.tipo);
    
    if (tipos.length === 1) {
      // Un solo tipo - color sólido
      return {
        background: this.getTypeColor(tipos[0]),
        transition: 'all 0.3s ease'
      };
    } else if (tipos.length >= 2) {
      // Dos tipos - degradado
      const color1 = this.getTypeColor(tipos[0]);
      const color2 = this.getTypeColor(tipos[1]);
      return {
        background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
        transition: 'all 0.3s ease'
      };
    }
    
    return { background: '#A8A878' }; 
  }

  // Obtener color de un tipo específico
  getTypeColor(tipo: string): string {
    return this.typeColors[tipo.toLowerCase()] || '#A8A878';
  }

  // Separar los tipos (pueden venir como "tipo1,tipo2")
  obtenerTipos(tipoString: string): string[] {
    return tipoString.split(',').map(t => t.trim());
  }

  
}

