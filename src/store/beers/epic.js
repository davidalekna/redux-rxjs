import { ofType } from 'redux-observable';
import { concat, fromEvent, of, merge, race, forkJoin } from 'rxjs';
import {
  catchError,
  debounceTime,
  delay,
  filter,
  map,
  mapTo,
  switchMap,
  withLatestFrom,
  pluck,
} from 'rxjs/operators';
import { CANCEL, RANDOM } from './actions';
import { fetchFulfilled, setStatus, fetchFailed, reset } from './actions';

// const search = (apiBase, perPage, term) =>
//   `${apiBase}?beer_name=${encodeURIComponent(term)}&per_page=${perPage}`;

const random = apiBase => `${apiBase}/random`;

export default function fetchBeersEpic(action$, state$, { getJSON, document }) {
  return action$.pipe(
    ofType(RANDOM),
    debounceTime(500),
    withLatestFrom(state$.pipe(pluck('config'))), // groups value into array with current value
    switchMap(([{ payload }, config]) => {
      const reqs = [...Array(config.perPage)].map(() => {
        return getJSON(random(config.apiBase)).pipe(pluck(0));
      });

      const ajax$ = forkJoin(reqs).pipe(
        delay(5000),
        map(resp => fetchFulfilled(resp)),
        catchError(err => {
          return of(fetchFailed(err.response.message));
        }),
      );

      const blocker$ = merge(
        action$.pipe(ofType(CANCEL)),
        fromEvent(document, 'keyup').pipe(
          filter(evt => evt.key === 'Escape' || evt.key === 'Esc'),
        ),
      ).pipe(mapTo(reset()));

      return concat(of(setStatus('pending')), race(ajax$, blocker$));
    }),
  );
}

// export function fetchBeersEpic(action$) {
//   return action$.pipe(
//     ofType(FETCH_DATA),
//     switchMap(() => {
//       return concat(
//         of(setStatus('pending')),
//         ajax.getJSON(API).pipe(map(resp => fetchFulfilled(resp))),
//       );
//     }),
//   );
// }
