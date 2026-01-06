import { WaccaGrade } from './mithical';
import { SvelteDate } from 'svelte/reactivity';

// this is in a separate module from `game-manager` so that hot reload on
// game-manager doesn't break shit

type GameStateData = {
	goalSong: string;
	requiredGoalItems: number;
	minimumGrade: WaccaGrade;
	isSetup: boolean;
	lastChecked: SvelteDate;
	goalInserted: boolean;
	mythosCode: string;
};

const GameState = $state<GameStateData>({
	goalSong: '',
	requiredGoalItems: 99999,
	minimumGrade: 0,
	isSetup: false,
	lastChecked: new SvelteDate(0),
	goalInserted: false,
	mythosCode: ''
});

export default GameState;
