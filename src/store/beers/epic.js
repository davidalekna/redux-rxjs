import { ajax } from 'rxjs/ajax';
import { ofType } from 'redux-observable';
import { concat, fromEvent, of, merge, race } from 'rxjs';
import {
  catchError,
  debounceTime,
  delay,
  filter,
  map,
  mapTo,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { SEARCH, CANCEL } from './actions';
import { fetchFulfilled, setStatus, fetchFailed, reset } from './actions';

const search = (apiBase, term) =>
  `${apiBase}?beer_name=${encodeURIComponent(term)}`;

export function fetchBeersEpic(action$, state$) {
  return action$.pipe(
    ofType(SEARCH),
    debounceTime(500),
    filter(({ payload }) => payload.trim() !== ''),
    withLatestFrom(state$), // groups value into array with additional value
    switchMap(([{ payload }, state]) => {
      const ajax$ = ajax.getJSON(search(state.config.apiBase, payload)).pipe(
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
