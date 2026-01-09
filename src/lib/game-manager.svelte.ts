import { Item } from 'archipelago.js';
import { derived, get } from 'svelte/store';
import { checkedLocations, client, items } from './archipelago';
import { PROGRESSION_ID } from './consts';
import { songsByEffectiveName, songsById, type waccaSongs } from './data/waccaSongs';
import GameState from './game-state.svelte';
import { fetchUserResult, getMostRecentSong, WaccaGrade } from './mithical';
import { isDefined, isoDatetimeToDate } from './utils';

type WaccaSlotData = {
	victoryLocation: string;
	deathLink: boolean;
	progressionWinCount: number;
	gradeNeeded: WaccaGrade;
};

export const getClientStatus = () => ({
	authenticated: client.authenticated
});

type RichItem = {
	baseItem: Pick<Item, 'id' | 'name'>;
	songData: (typeof waccaSongs)[0] | null;
	checked: boolean;
	goal: boolean;
};

export const numGoalItems = derived(
	items,
	($items) => $items.filter((item) => item.id === PROGRESSION_ID).length
);

export const shouldUnlockGoal = derived(
	[numGoalItems],
	([$numGoalItems]) =>
		GameState.requiredGoalItems != null && $numGoalItems >= GameState.requiredGoalItems
);
export const richItems = derived([items, checkedLocations], ([$items, $checkedLocations]) => {
	const locationTable = client.package.findPackage('WACCA')?.locationTable ?? {};

	return $items.map<RichItem>((item) => {
		if (item.id === PROGRESSION_ID) {
			return {
				baseItem: item,
				songData: null,
				checked: false,
				goal: false
			};
		}

		const songData = songsById[item.id];
		if (!songData) throw `Couldn't find song data for ID ${item.id}`;

		const effectiveTitle = songData.titleEnglish ?? songData.title;
		const firstLocationName = `${effectiveTitle}-0`;
		const firstLocationId = locationTable[firstLocationName];
		const checked = firstLocationId != null && $checkedLocations.includes(firstLocationId);

		return {
			baseItem: item,
			checked,
			songData,
			goal: false
		};
	});
});

export function setup(_requiredGoalItems: number, _goalSong: string, _minimumGrade: WaccaGrade) {
	GameState.requiredGoalItems = _requiredGoalItems;
	GameState.goalSong = _goalSong;
	GameState.minimumGrade = _minimumGrade;
	GameState.isSetup = true;
}

export async function connect(connectionUrl: string, slot: string) {
	const { progressionWinCount, deathLink, gradeNeeded, victoryLocation } =
		await client.login<WaccaSlotData>(connectionUrl, slot, 'WACCA', {
			tags: ['NoText']
		});
	console.log(progressionWinCount, deathLink, gradeNeeded, victoryLocation);
	setup(progressionWinCount, victoryLocation, gradeNeeded);
}

export async function clearCheck(cardNumber?: string) {
	if (!client.authenticated || !GameState.isSetup) return;

	if (cardNumber) {
		await fetchUserResult(cardNumber);
	}

	const { result, song } = getMostRecentSong();

	// make sure the time is valid
	const playDate = isoDatetimeToDate.decode(result.info.user_play_date);

	if (playDate < GameState.lastChecked) return;
	GameState.lastChecked.setTime(playDate.getTime());

	const effectiveTitle = song.titleEnglish ?? song.title;
	const minimumGrade = GameState.minimumGrade;

	// check if it's the goal song AND that the goal is unlocked
	if (shouldUnlockGoal && effectiveTitle === GameState.goalSong) {
		// ok it's goal time babey
		if (result.info.grade < minimumGrade || !result.info.clear_status.is_clear) return;

		client.goal();
	}

	// make sure the player has actually unlocked this one
	const songUnlocked = get(items).some((item) => item.id === song.id);
	if (!songUnlocked) return;

	// check if they hit the clear condition
	if (result.info.grade < minimumGrade || !result.info.clear_status.is_clear) return;

	// we're good, let archipelago know
	const locationNames = [`${effectiveTitle}-0`, `${effectiveTitle}-1`];
	const locationTable = client.package.findPackage('WACCA')?.locationTable;
	if (!locationTable) throw "Couldn't find location table for WACCA";

	const locationIds = locationNames.map((name) => locationTable[name]).filter(isDefined);
	client.check(...locationIds);
}

export function findGoal(): RichItem | null {
	const goalName = GameState.goalSong;
	const song = songsByEffectiveName[goalName];
	if (song == null) return null;

	return {
		baseItem: {
			id: song.id,
			name: goalName
		},
		songData: song,
		checked: false,
		goal: true
	};
}
