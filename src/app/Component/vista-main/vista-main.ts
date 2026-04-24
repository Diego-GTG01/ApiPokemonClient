import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';
import { Pokemon } from '../../Interface/pokemon';

Chart.register(...registerables);

@Component({
  selector: 'app-vista-main',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './vista-main.html',
  styleUrl: './vista-main.css',
})
export class VistaMain {
  baseRuta: string = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
  baseSoundUrl: string = 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/';

  pokemons: Pokemon[] = [
    {
      id: 1,
      nombre: 'bulbasaur',
      tipo: 'planta,veneno',
      imagen: '',
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
      isFlipped: false,
      selectedTab: 0,
      soundUrl: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/1.ogg',
      moves: ['Tackle', 'Growl', 'Leech Seed', 'Vine Whip'],
      abilities: ['Overgrow', 'Chlorophyll'],
      description: 'Una semilla rara fue plantada en su espalda al nacer. La planta florece y crece con el Pokémon.'
    },
    {
      id: 4,
      nombre: 'charmander',
      tipo: 'fuego',
      imagen: '',
      hp: 39,
      attack: 52,
      defense: 43,
      specialAttack: 60,
      specialDefense: 50,
      speed: 65,
      isFlipped: false,
      selectedTab: 0,
      soundUrl: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/4.ogg',
      moves: ['Scratch', 'Growl', 'Ember', 'Smokescreen'],
      abilities: ['Blaze', 'Solar Power'],
      description: 'La llama de su cola indica su estado de ánimo. Si está feliz, la llama arde más intensamente.'
    },
    {
      id: 7,
      nombre: 'squirtle',
      tipo: 'agua',
      imagen: '',
      hp: 44,
      attack: 48,
      defense: 65,
      specialAttack: 50,
      specialDefense: 64,
      speed: 43,
      isFlipped: false,
      selectedTab: 0,
      soundUrl: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/7.ogg',
      moves: ['Tackle', 'Tail Whip', 'Water Gun', 'Withdraw'],
      abilities: ['Torrent', 'Rain Dish'],
      description: 'Cuando se siente amenazado, se retrae a su caparazón. Rocía agua desde su boca con gran precisión.'
    },
    {
      id: 25,
      nombre: 'pikachu',
      tipo: 'electrico',
      imagen: '',
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90,
      isFlipped: false,
      selectedTab: 0,
      soundUrl: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/25.ogg',
      moves: ['Thunder Shock', 'Growl', 'Tail Whip', 'Quick Attack'],
      abilities: ['Static', 'Lightning Rod'],
      description: 'Tiene pequeñas bolsas en sus mejillas donde almacena electricidad. Cuando se enfada, descarga energía.'
    },
    {
      id: 94,
      nombre: 'gengar',
      tipo: 'fantasma,veneno',
      imagen: '',
      hp: 60,
      attack: 65,
      defense: 60,
      specialAttack: 130,
      specialDefense: 75,
      speed: 110,
      isFlipped: false,
      selectedTab: 0,
      soundUrl: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/94.ogg',
      moves: ['Shadow Ball', 'Hypnosis', 'Dream Eater', 'Dark Pulse'],
      abilities: ['Cursed Body'],
      description: 'Oculta en las sombras, acecha a su presa. Si sientes un escalofrío repentino, puede que Gengar esté cerca.'
    },
  ];

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
    volador: '#A890F0',
  };

  private audio: HTMLAudioElement | null = null;

  constructor() {
    this.pokemons = this.pokemons.map((p) => ({
      ...p,
      imagen: `${this.baseRuta}${p.id}.png`,
      isFlipped: false,
    }));
  }

  playSound(pokemon: Pokemon, event: Event): void {
    event.stopPropagation(); // Evita que el clic del botón voltee la carta

    if (pokemon.soundUrl) {
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }

      this.audio = new Audio(pokemon.soundUrl);
      this.audio.play().catch(error => {
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

  flipPokemon(selectedPokemon: Pokemon): void {
    this.pokemons.forEach(pokemon => {
      if (pokemon === selectedPokemon) {
        pokemon.isFlipped = !pokemon.isFlipped;
      } else {
        pokemon.isFlipped = false;
      }
    });
  }

  setSelectedTab(pokemon: Pokemon, tabIndex: number, event: Event): void {
    event.stopPropagation(); // Evita que voltee la carta
    pokemon.selectedTab = tabIndex;
  }

  getTypeColor(tipo: string): string {
    return this.typeColors[tipo.toLowerCase()] || '#A8A878';
  }

  obtenerTipos(tipoString: string): string[] {
    return tipoString.split(',').map((t) => t.trim());
  }
}