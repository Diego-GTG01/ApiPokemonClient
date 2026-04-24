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
  // 3. Asegúrate de que BaseChartDirective esté aquí
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './vista-main.html',
  styleUrl: './vista-main.css',
})
export class VistaMain {
  // Datos de ejemplo

  baseRuta: string =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

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
      isFlipped: false
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
      isFlipped: false
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
      isFlipped: false
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
      isFlipped: false
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
      isFlipped: false
    },
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
    volador: '#A890F0',
  };
  constructor() {
    this.pokemons = this.pokemons.map((p) => ({
      ...p,
      imagen: `${this.baseRuta}${p.id}.png`,
      isFlipped: false,
    }));
  }

  getTotalStats(p: Pokemon): number {
    return +p.hp + +p.attack + +p.defense + +p.specialAttack + +p.specialDefense + +p.speed;
  }
  getBestStat(pokemon: Pokemon): any {
    const stats = [
      { nombre: 'HP', valor: +pokemon.hp },
      { nombre: 'Ataque', valor: +pokemon.attack },
      { nombre: 'Defensa', valor: +pokemon.defense },
      { nombre: 'At. Especial', valor: +pokemon.specialAttack },
      { nombre: 'Def. Especial', valor: +pokemon.specialDefense },
      { nombre: 'Velocidad', valor: +pokemon.speed },
    ];

    return stats.reduce((prev, current) => (prev.valor > current.valor ? prev : current)).nombre;
  }

  // Obtener los colores según los tipos del Pokémon
  getCardStyle(pokemon: Pokemon): any {
    const tipos = this.obtenerTipos(pokemon.tipo);

    if (tipos.length === 1) {
      // Un solo tipo - color sólido
      return {
        background: this.getTypeColor(tipos[0]),
        transition: 'all 0.3s ease',
      };
    } else if (tipos.length >= 2) {
      // Dos tipos - degradado
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
        'SP. ATK : ' + pokemon.specialAttack,
        'SP. DEF: ' + pokemon.specialDefense,
        'SPD : ' + pokemon.speed,
      ],
      datasets: [
        {
          data: [
            Number(pokemon.hp),
            Number(pokemon.attack),
            Number(pokemon.defense),
            Number(pokemon.specialAttack),
            Number(pokemon.specialDefense),
            Number(pokemon.speed),
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

  // Obtener color de un tipo específico
  getTypeColor(tipo: string): string {
    return this.typeColors[tipo.toLowerCase()] || '#A8A878';
  }

  // Separar los tipos (pueden venir como "tipo1,tipo2")
  obtenerTipos(tipoString: string): string[] {
    return tipoString.split(',').map((t) => t.trim());
  }
}
