import * as z from 'zod';
import { songsById } from './data/waccaSongs';
import { derived, get, writable } from 'svelte/store';

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
	G: 1,
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

	const resp = await fetch(url).then((resp) => resp.json());
	const parsedResponse = WaccaUserResponse.parse(resp);

	CACHE.set(parsedResponse);

	return parsedResponse;
}

export function getMostRecentSong() {
	return get(collectedPlaylog)[0];
}

export const collectedPlaylog = derived(CACHE, (cache) => {
	if (!cache) return [];

	const results = cache.playlog.slice(0, 10);
	const collected = results.map((result) => ({
		result,
		song: songsById[result.info.music_id]
	}));

	return collected;
});
