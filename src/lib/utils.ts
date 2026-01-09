import { z } from 'zod';

export const isoDatetimeToDate = z.codec(z.iso.datetime({ offset: true }), z.date(), {
	decode: (isoString) => new Date(isoString),
	encode: (date) => date.toISOString()
});

export function isDefined<T>(argument: T | undefined): argument is T {
	return argument !== undefined;
}
