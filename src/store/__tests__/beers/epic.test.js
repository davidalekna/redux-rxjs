import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { initialState } from '../../config/reducer';
import { fetchFulfilled, search, setStatus } from '../../beers/actions';
import fetchBeersEpic from '../../beers/epic';

it('produces correct actions', function() {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  testScheduler.run(({ hot, cold, expectObservable }) => {
    const action$ = hot('a', {
      a: search('ship'),
    });
    const state$ = of({
      config: initialState,
    });
    const dependencies = {
      getJSON: url => {
        return cold('-a', {
          a: [{ name: 'Beer 1' }],
        });
      },
    };
    const output$ = fetchBeersEpic(action$, state$, dependencies);
    expectObservable(output$).toBe('500ms ab', {
      a: setStatus('pending'),
      b: fetchFulfilled([{ name: 'Beer 1' }]),
    });
  });
});
