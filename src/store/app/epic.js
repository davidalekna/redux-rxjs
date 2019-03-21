import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const epic1 = () =>
  of({ type: 'SET_NAME', payload: 'Sally' }).pipe(delay(2000));
