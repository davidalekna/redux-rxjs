import React from 'react';
import { connect } from 'react-redux';
import { BeerList } from './BeerList';
import { search, cancel } from '../store/beers/actions';
import { setConfig } from '../store/config/actions';
import Spinner from '../components/spinner';

export function Beers({
  data,
  messages,
  status,
  search,
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
        <input
          type="text"
          placeholder="Search beers"
          onChange={evt => search(evt.target.value)}
        />
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
  { search, cancel, setConfig },
)(Beers);
