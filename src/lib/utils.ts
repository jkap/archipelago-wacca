import { z } from 'zod';
import { readable } from 'svelte/store';

export const isoDatetimeToDate = z.codec(z.iso.datetime({ offset: true }), z.date(), {
	decode: (isoString) => new Date(isoString),
	encode: (date) => date.toISOString()
});
