import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';
import { Pokemon } from '../../Interface/pokemonDTO';
import { PokemonService } from '../../Service/pokemon-service';
import { Subscription } from 'rxjs';
import { PokemonFavoritoService } from '../../Service/pokemon-favorito-service';
import { Usuario } from '../../Interface/Usuario';
import { AuthService } from '../../Service/auth-service';
import Swal from 'sweetalert2';

Chart.register(...registerables);

export interface Generation {
  label: string;
  name: string;
  start: number;
  end: number;
  region: string;
  color: string;
}

@Component({
  selector: 'app-vista-main',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './vista-main.html',
  styleUrl: './vista-main.css',
})
export class VistaMain implements OnInit, OnDestroy {
  allPokemons: Pokemon[] = [];
  Pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  isLoading = false;
  loadingProgress = 0;
  searchQuery = '';
  viewFavoritesOnly = false;
  pokemonOriginales: Map<number, Pokemon> = new Map();

  searchMode: 'name' | 'id' | 'type' = 'name';
  selectedAbility: any = null;

  readonly allTypes: string[] = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'poison',
    'psychic',
    'rock',
    'ground',
    'ice',
    'bug',
    'dragon',
    'ghost',
    'dark',
    'steel',
    'fairy',
    'fighting',
    'flying',
  ];
  selectedTypes: string[] = [];

  readonly generations: Generation[] = [
    { label: 'I', name: 'Gen I', start: 1, end: 151, region: 'Kanto', color: '#dc0a2d' },
    { label: 'II', name: 'Gen II', start: 152, end: 251, region: 'Johto', color: '#3b82f6' },
    { label: 'III', name: 'Gen III', start: 252, end: 386, region: 'Hoenn', color: '#16a34a' },
    { label: 'IV', name: 'Gen IV', start: 387, end: 493, region: 'Sinnoh', color: '#7c3aed' },
    { label: 'V', name: 'Gen V', start: 494, end: 649, region: 'Unova', color: '#d97706' },
    { label: 'VI', name: 'Gen VI', start: 650, end: 721, region: 'Kalos', color: '#0891b2' },
    { label: 'VII', name: 'Gen VII', start: 722, end: 809, region: 'Alola', color: '#e11d48' },
    { label: 'VIII', name: 'Gen VIII', start: 810, end: 905, region: 'Galar', color: '#059669' },
    { label: 'IX', name: 'Gen IX', start: 906, end: 1025, region: 'Paldea', color: '#dc2626' },
    { label: 'ALL', name: 'Todos', start: 1, end: 1025, region: 'Nacional', color: '#ffd700' },
  ];
  selectedGenIndex = 0;

  usuario: Usuario | null = null;

  isMaestro(): boolean {
    return this.usuario?.rol.nombre === 'Maestro';
  }

  get currentGen(): Generation {
    return this.generations[this.selectedGenIndex];
  }

  private audio: HTMLAudioElement | null = null;
  private subscriptions: Subscription[] = [];

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
  constructor(
    private router: Router,
    private pokemonService: PokemonService,
    private pokemonFavoritoService: PokemonFavoritoService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.checkAuth().subscribe({
        next: (response: any) => {
          this.usuario = response;
          if (this.usuario) {
            this.pokemonService.setId(this.usuario.idUsuario);
          }
        },
      }),
    );
    this.subscriptions.push(this.pokemonService.loading$.subscribe((v) => (this.isLoading = v)));
    this.subscriptions.push(
      this.pokemonService.progress$.subscribe((v) => (this.loadingProgress = v)),
    );
    this.subscriptions.push(
      this.pokemonService.getAllPokemons().subscribe({
        next: (pokemons) => {
          this.allPokemons = pokemons;
          this.Pokemons = pokemons;
          this.applyFilter();
        },
        error: (err) => {
          console.error('Error cargando pokémons:', err);
          this.isLoading = false;
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  selectGeneration(index: number): void {
    this.selectedGenIndex = index;
    this.searchQuery = '';
    this.allPokemons.forEach((p) => {
      p.isFlipped = false;
      p.selectedTab = 0;
      p.selectedVariety = p.id;
    });
    this.applyFilter();
  }

  onSearch(): void {
    this.applyFilter();
  }

  setSearchMode(mode: 'name' | 'id' | 'type'): void {
    this.searchMode = mode;
    this.searchQuery = '';
    this.selectedTypes = [];
    this.applyFilter();
  }

  onlyFavs(): void {
    this.viewFavoritesOnly = !this.viewFavoritesOnly;
    if (this.viewFavoritesOnly) {
      this.filteredPokemons = this.filteredPokemons.filter((p) => p.isFavorite);
    } else {
      this.applyFilter();
    }
  }

  toggleType(tipo: string): void {
    const idx = this.selectedTypes.indexOf(tipo);
    if (idx !== -1) {
      this.selectedTypes.splice(idx, 1);
    } else {
      if (this.selectedTypes.length < 2) {
        this.selectedTypes.push(tipo);
      }
    }
    this.applyFilter();
  }

  isTypeSelected(tipo: string): boolean {
    return this.selectedTypes.includes(tipo);
  }

  isTypeDisabled(tipo: string): boolean {
    return this.selectedTypes.length === 2 && !this.selectedTypes.includes(tipo);
  }

  getTypeOrder(tipo: string): number {
    const idx = this.selectedTypes.indexOf(tipo);
    return idx === -1 ? -1 : idx + 1;
  }

  isGlobalSearch: boolean = false;

  applyFilter(): void {
    const gen = this.generations[this.selectedGenIndex];
    const searchText = this.searchQuery.trim().toLowerCase();

    let list = [...this.allPokemons.filter((p) => p.id < 1026)];

    const hasSearchText = searchText !== '';
    const hasTypeFilter = this.selectedTypes.length > 0;

    const isAllGen = gen.label === 'ALL';

    if (!isAllGen) {
      list = list.filter((p) => p.id >= gen.start && p.id <= gen.end);
    }

    if (this.viewFavoritesOnly) {
      list = list.filter((p) => p.isFavorite);
    }

    if (this.searchMode === 'name' && hasSearchText) {
      list = list.filter((p) => p.nombre.toLowerCase().includes(searchText));
    } else if (this.searchMode === 'id' && hasSearchText) {
      list = list.filter((p) => String(p.id).includes(searchText));
    } else if (this.searchMode === 'type' && hasTypeFilter) {
      list = list.filter((p) => {
        const tipos = this.obtenerTipos(p.tipo);

        if (this.selectedTypes.length === 1) {
          return tipos.some((t) => t.toLowerCase() === this.selectedTypes[0].toLowerCase());
        } else {
          return (
            (tipos[0]?.toLowerCase() === this.selectedTypes[0].toLowerCase() &&
              tipos[1]?.toLowerCase() === this.selectedTypes[1].toLowerCase()) ||
            (tipos[1]?.toLowerCase() === this.selectedTypes[0].toLowerCase() &&
              tipos[0]?.toLowerCase() === this.selectedTypes[1].toLowerCase())
          );
        }
      });
    }

    this.filteredPokemons = list;
  }

  triggerGlobalSearch(): void {
    this.selectedGenIndex = 9;
    this.applyFilter();
  }

  get generationLoadedCount(): number {
    const gen = this.currentGen;
    return this.allPokemons.filter((p) => p.id >= gen.start && p.id <= gen.end).length;
  }

  get generationTotal(): number {
    const gen = this.currentGen;
    return gen.end - gen.start + 1;
  }

  favorite(pokemon: Pokemon, event: Event): void {
    event.stopPropagation();
    if (this.usuario) {
      this.pokemonService.toggleFavorite(pokemon, this.usuario.idUsuario);
    }
  }

  flipPokemon(selectedPokemon: Pokemon): void {
    selectedPokemon.spriteSelected = selectedPokemon.imagen;
    this.selectedAbility = null;
    console.log(selectedPokemon);

    this.filteredPokemons.forEach((p) => {
      p.isFlipped = p === selectedPokemon ? !p.isFlipped : false;
    });
    this.pokemonService.getEvolutionIds(selectedPokemon.chainEvolution.url, selectedPokemon);
  }

  setSelectedTab(pokemon: Pokemon, tabIndex: number, event: Event): void {
    event.stopPropagation();
    pokemon.selectedTab = tabIndex;
  }

  playSound(pokemon: Pokemon, event: Event): void {
    event.stopPropagation();
    if (pokemon.soundUrl) {
      this.audio?.pause();
      this.audio = new Audio(pokemon.soundUrl);
      this.audio.play().catch((e) => console.error('Error reproduciendo sonido:', e));
    }
  }

  changeImagen(pokemon: Pokemon, event: Event): void {
    event.stopPropagation();
    if (pokemon.imagenShiny) {
      const temp = pokemon.imagen;
      pokemon.imagen = pokemon.imagenShiny;
      pokemon.imagenShiny = temp;
    }
  }

  selectAbility(ability: any, event: Event) {
    event.stopPropagation();
    if (this.selectedAbility?.name === ability.name) {
      this.selectedAbility = null;
    } else {
      this.selectedAbility = ability;
    }
  }

  getTotalStats(p: Pokemon): number {
    return p.hp + p.attack + p.defense + p.specialAttack + p.specialDefense + p.speed;
  }

  getBestStat(pokemon: Pokemon): string {
    const stats = [
      { nombre: 'HP', valor: pokemon.hp },
      { nombre: 'Ataque', valor: pokemon.attack },
      { nombre: 'Defensa', valor: pokemon.defense },
      { nombre: 'At. Especial', valor: pokemon.specialAttack },
      { nombre: 'Def. Especial', valor: pokemon.specialDefense },
      { nombre: 'Velocidad', valor: pokemon.speed },
    ];
    return stats.reduce((prev, cur) => (prev.valor > cur.valor ? prev : cur)).nombre;
  }

  getCardStyle(pokemon: Pokemon): any {
    const tipos = this.obtenerTipos(pokemon.tipo);
    if (tipos.length === 1) {
      return { background: this.getTypeColor(tipos[0]), transition: 'all 0.3s ease' };
    } else if (tipos.length >= 2) {
      return {
        background: `linear-gradient(135deg, ${this.getTypeColor(tipos[0])} 0%, ${this.getTypeColor(tipos[1])} 100%)`,
        transition: 'all 0.3s ease',
      };
    }
    return { background: '#A8A878' };
  }

  getTypeColor(tipo: string): string {
    return this.typeColors[tipo.toLowerCase()] || '#A8A878';
  }

  obtenerTipos(tipoString: string): string[] {
    return tipoString.split(',').map((t) => t.trim());
  }

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 120,
        ticks: { display: false, stepSize: 50 },
        grid: {
          color: 'rgba(0,0,0,0.5)', // Líneas circulares muy tenues
        },
        angleLines: { color: 'rgba(0,0,0,0.1)' }, // Líneas que salen del centro
        pointLabels: {
          color: '#475569',
          font: {
            size: 12,
            family: "'Courier New', monospace",
            weight: 'bold',
          },
          padding: 10,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 24 },
        bodyFont: { size: 16 },
        displayColors: false,
      },
    },
  };
  public radarChartType: ChartType = 'radar';

  getRadarData(pokemon: Pokemon): ChartData<'radar'> {
    return {
      labels: [
        'HP:' + pokemon.hp,
        'ATK:' + pokemon.attack,
        'DEF:' + pokemon.defense,
        'S.ATK:' + pokemon.specialAttack,
        'S.DEF:' + pokemon.specialDefense,
        'SPD:' + pokemon.speed,
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
          borderColor: '#3b4cca',
          backgroundColor: 'rgba(59, 76, 202, 0.2)',
          fill: true,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#3b4cca',
          pointHoverBackgroundColor: '#3b4cca',
          pointHoverBorderColor: '#fff',
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    };
  }

  cambiarVariedad(idPokemon: number, pokemon: Pokemon, event: Event): void {
    event.stopPropagation();

    if (!this.pokemonOriginales.has(pokemon.id)) {
      this.pokemonOriginales.set(pokemon.id, { ...pokemon });
    }

    if (idPokemon === pokemon.id) {
      const original = this.pokemonOriginales.get(pokemon.id);
      if (original) {
        Object.assign(pokemon, original);
      }
    } else {
      const nuevaVariedad = this.allPokemons.find((p) => p.id === idPokemon);
      if (nuevaVariedad) {
        Object.assign(pokemon, {
          nombre: nuevaVariedad.nombre,
          tipo: nuevaVariedad.tipo,
          imagen: nuevaVariedad.imagen,
          imagenShiny: nuevaVariedad.imagenShiny,
          hp: nuevaVariedad.hp,
          attack: nuevaVariedad.attack,
          defense: nuevaVariedad.defense,
          specialAttack: nuevaVariedad.specialAttack,
          specialDefense: nuevaVariedad.specialDefense,
          speed: nuevaVariedad.speed,
          height: nuevaVariedad.height,
          weight: nuevaVariedad.weight,
          abilities: nuevaVariedad.abilities,
          sprites: nuevaVariedad.sprites,
        });
      }
    }

    pokemon.selectedVariety = idPokemon;
  }

  selectMove(event: Event, move: any){
    event.stopPropagation();
    
  }

  getPokemonById(id: number) {
    if (this.pokemonOriginales.has(id)) {
      return this.pokemonOriginales.get(id);
    }
    return this.Pokemons.find((p: any) => p.id === id);
  }

  getAvailableSprites(pokemon: Pokemon) {
    if (!pokemon.sprites) return [];

    return Object.entries(pokemon.sprites)

      .filter(([key, value]) => value !== '')
      .map(([key, value]) => ({ key, url: value.replace('_', ' ') }));
  }

  setSprite(pokemon: any, url: string, event: Event) {
    event.stopPropagation();
    pokemon.spriteSelected = url;
  }

  irFichaEntrenador(idUsuario: number | undefined) {
    if (!idUsuario) {
      return;
    }

    this.router.navigate(['/PokeUsers', idUsuario]);
  }

  irGestionUsuarios() {
    this.router.navigate(['/PokeUsers']);
  }

  irEstadisticas() {
    this.router.navigate(['/PokeStats']);
  }

  idGestionPeticiones(){
    this.router.navigate(['/Peticiones'])
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tu aventura Pokémon será pausada',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#2a75bb',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Sesión cerrada',
              text: 'Hasta pronto entrenador',

              confirmButtonColor: '#2a75bb',

              timer: 2000,
              showConfirmButton: false,
            });

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },

          error: () => {
            this.router.navigate(['/login']);
          },
        });
      }
    });
  }
}
