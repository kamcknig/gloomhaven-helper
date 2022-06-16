import { InjectionToken } from '@angular/core';

/**
 * TODO: Probably doesn't need to be its own InjectionToken. This can be added to a game options that could be provided.
 */
export const MAX_LEVEL = new InjectionToken<number>('The max scenario level');
