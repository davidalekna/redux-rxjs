import { ofType } from 'redux-observable';
import { SET_CONFIG, setConfig } from './actions';
import { withLatestFrom, pluck, tap, ignoreElements } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';

const CACHE_KEY = 'ro-config';

export function persistEpic(action$, state$) {
  return action$.pipe(
    ofType(SET_CONFIG),
    withLatestFrom(state$.pipe(pluck('config'))),
    tap(([action, config]) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(config));
    }),
    ignoreElements(),
  );
}

export function hydrateEpic() {
  const maybeConfig = localStorage.getItem(CACHE_KEY);
  if (typeof maybeConfig === 'string') {
    try {
      const parsed = JSON.parse(maybeConfig);
      return of(setConfig(parsed));
    } catch (err) {
      return EMPTY;
    }
  }
  return EMPTY;
}
