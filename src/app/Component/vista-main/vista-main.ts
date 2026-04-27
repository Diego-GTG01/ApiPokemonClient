import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';
import { Pokemon } from '../../Interface/pokemonDTO';
import { PokemonService } from '../../Service/pokemon-service';
import { PokemonApi } from '../../Interface/pokemonApi';

Chart.register(...registerables);

@Component({
  selector: 'app-vista-main',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './vista-main.html',
  styleUrl: './vista-main.css',
})
export class VistaMain {
  baseRuta: string =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
  baseSoundUrl: string =
    'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/';

  pokemons: Pokemon[] = [];

  private typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    poison: '#A040A0',
    psychic: '#F85888',
    rock: '#B8A038',
    ground: '#E0C068',
    ice: '#98D8D8',
    bug: '#A8B820',
    dragon: '#7038F8',
    ghost: '#705898',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    fighting: '#C03028',
    flying: '#A890F0',
  };

  private audio: HTMLAudioElement | null = null;
  private pokemon: any;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('pokemons');

    this.pokemons = [];
    if (stored) {
      this.pokemons = JSON.parse(stored);
      return;
    } else {
      this.cargarPokemons();
    }
  }

  playSound(pokemon: Pokemon, event: Event): void {
    event.stopPropagation();
    if (pokemon.soundUrl) {
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }
      this.audio = new Audio(pokemon.soundUrl);
      this.audio.play().catch((error) => {
        console.error('Error al reproducir el sonido:', error);
      });
    }
  }

  getTotalStats(p: Pokemon): number {
    return p.hp + p.attack + p.defense + p.specialAttack + p.specialDefense + p.speed;
  }

  getBestStat(pokemon: Pokemon): any {
    const stats = [
      { nombre: 'HP', valor: pokemon.hp },
      { nombre: 'Ataque', valor: pokemon.attack },
      { nombre: 'Defensa', valor: pokemon.defense },
      { nombre: 'At. Especial', valor: pokemon.specialAttack },
      { nombre: 'Def. Especial', valor: pokemon.specialDefense },
      { nombre: 'Velocidad', valor: pokemon.speed },
    ];

    return stats.reduce((prev, current) => (prev.valor > current.valor ? prev : current)).nombre;
  }

  getCardStyle(pokemon: Pokemon): any {
    const tipos = this.obtenerTipos(pokemon.tipo);

    if (tipos.length === 1) {
      return {
        background: this.getTypeColor(tipos[0]),
        transition: 'all 0.3s ease',
      };
    } else if (tipos.length >= 2) {
      const color1 = this.getTypeColor(tipos[0]);
      const color2 = this.getTypeColor(tipos[1]);
      return {
        background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
        transition: 'all 0.3s ease',
      };
    }

    return { background: '#A8A878' };
  }

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 120,
        ticks: { display: false },
        grid: { color: 'rgba(0, 0, 0, 0.2)' },
        angleLines: { color: 'rgba(0, 0, 0, 0.2)' },
        pointLabels: {
          color: '#000000',
          font: { size: 10 },
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  public radarChartType: ChartType = 'radar';

  getRadarData(pokemon: Pokemon): ChartData<'radar'> {
    return {
      labels: [
        'HP: ' + pokemon.hp,
        'ATK: ' + pokemon.attack,
        'DEF: ' + pokemon.defense,
        'SP. ATK: ' + pokemon.specialAttack,
        'SP. DEF: ' + pokemon.specialDefense,
        'SPD: ' + pokemon.speed,
      ],
      datasets: [
        {
          data: [
            pokemon.hp,
            pokemon.attack,
            pokemon.defense,
            pokemon.specialAttack,
            pokemon.specialDefense,
            pokemon.speed,
          ],
          label: pokemon.nombre,
          borderColor: '#2e2ca0',
          backgroundColor: 'rgba(27, 41, 124, 0.4)',
          fill: true,
          pointBackgroundColor: '#fff',
        },
      ],
    };
  }
  cargarPokemons(): void {
    this.pokemons = [];
    for (let index = 1; index <= 1025; index++) {
      this.pokemonService.getPokemon(index).subscribe({
        next: (data) => {
          this.pokemons.push(data);
          this.pokemons.sort((a, b) => a.id - b.id);
          localStorage.setItem('pokemons', JSON.stringify(this.pokemons));
        },
        error: (err) => console.error(err),
      });
      
    }
  }

  flipPokemon(selectedPokemon: Pokemon): void {
    this.pokemons.forEach((pokemon) => {
      if (pokemon === selectedPokemon) {
        pokemon.isFlipped = !pokemon.isFlipped;
      } else {
        pokemon.isFlipped = false;
      }
    });
  }

  setSelectedTab(pokemon: Pokemon, tabIndex: number, event: Event): void {
    event.stopPropagation();
    pokemon.selectedTab = tabIndex;
  }

  getTypeColor(tipo: string): string {
    return this.typeColors[tipo.toLowerCase()] || '#A8A878';
  }

  obtenerTipos(tipoString: string): string[] {
    return tipoString.split(',').map((t) => t.trim());
  }
}
