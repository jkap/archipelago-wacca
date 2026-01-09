import * as z from 'zod';
import { songsById } from './data/waccaSongs';
import { derived, get, writable } from 'svelte/store';
import { isDefined } from './utils';

export const WaccaGrade = z.enum({
	Master: 13,
	'SSS+': 12,
	SSS: 11,
	'SS+': 10,
	SS: 9,
	'S+': 8,
	S: 7,
	A: 6,
	B: 5,
	C: 4,
	D: 3,
	F: 2,
	G: 1, // not what it's actually called. i don't know what it's actually called.
	NO_PLAY: 0
});
export type WaccaGrade = z.infer<typeof WaccaGrade>;

export const WaccaDifficulty = z.enum({
	Normal: 1,
	Hard: 2,
	Expert: 3,
	Inferno: 4
});
export type WaccaDifficulty = z.infer<typeof WaccaDifficulty>;

const WaccaUserResponse = z.object({
	user_name: z.string(),
	playlog: z.array(
		z.object({
			playlog_api_id: z.uuid(),
			info: z.object({
				music_id: z.int(),
				music_difficulty: WaccaDifficulty,
				score: z.int(),
				grade: WaccaGrade,
				judge: z.object({
					marvelous: z.int(),
					great: z.int(),
					good: z.int(),
					miss: z.int()
				}),
				clear_status: z.object({
					is_clear: z.boolean(),
					is_missless: z.boolean(),
					is_full_combo: z.boolean(),
					is_all_marvelous: z.boolean(),
					is_give_up: z.boolean()
				}),
				is_new_record: z.boolean(),
				combo: z.int(),
				user_play_date: z.iso.datetime({ offset: true })
			})
		})
	)
});

const CACHE = writable<Awaited<ReturnType<typeof fetchUserResult>>>();

export async function fetchUserResult(cardNumber: string) {
	const url = `https://mithical-backend.guegan.de/wacca/user/${cardNumber}/400`;

	const resp = await fetch(url);
	if (!resp.ok) {
		throw new Error(`Failed to fetch from mithical: ${resp.status}`);
	}

	const parsedResponse = WaccaUserResponse.parse(await resp.json());

	CACHE.set(parsedResponse);

	return parsedResponse;
}

export function getMostRecentSong() {
	const mostRecent = get(collectedPlaylog)[0];
	if (!mostRecent) throw 'Run a fetch first';
	return mostRecent;
}

export const collectedPlaylog = derived(CACHE, (cache) => {
	if (!cache) return [];

	const results = cache.playlog.slice(0, 10);
	const collected = results
		.map((result) => {
			const song = songsById[result.info.music_id];
			if (!song) return;
			return {
				result,
				song
			};
		})
		.filter(isDefined);

	return collected;
});
