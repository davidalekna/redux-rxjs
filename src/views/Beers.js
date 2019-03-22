import React from 'react';
import { connect } from 'react-redux';
import { BeerList } from './BeerList';
import { random, cancel } from '../store/beers/actions';
import { setConfig } from '../store/config/actions';
import Spinner from '../components/spinner';

export function Beers({
  data,
  messages,
  status,
  random,
  cancel,
  config,
  setConfig,
}) {
  return (
    <>
      <div className="App-inputs">
        <select
          name="per-page"
          defaultValue={config.perPage}
          onChange={e => setConfig({ perPage: Number(e.target.value) })}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => {
            return (
              <option key={value} value={value}>
                {value} results
              </option>
            );
          })}
        </select>
        <button type="button" onClick={random}>
          random
        </button>
        {status === 'pending' && (
          <>
            <button type="button" onClick={cancel}>
              cancel
            </button>
            <span className="App-spinner">
              <Spinner />
            </span>
          </>
        )}
      </div>
      {status === 'success' && (
        <div className="App-content">
          <BeerList beers={data} />
        </div>
      )}
      {status === 'failure' && (
        <div className="App-messages">
          <p>Oops! {messages[0].text}</p>
        </div>
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    ...state.beers,
    config: state.config,
  };
}

export default connect(
  mapStateToProps,
  { random, cancel, setConfig },
)(Beers);
