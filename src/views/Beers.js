import React from 'react';
import { connect } from 'react-redux';
import { BeerList } from './BeerList';
import { search, cancel } from '../store/beers/actions';
import Spinner from '../components/spinner';

export function Beers({ data, messages, status, search, cancel }) {
  return (
    <>
      <div className="App-inputs">
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

export default connect(
  state => state.beers,
  { search, cancel },
)(Beers);
