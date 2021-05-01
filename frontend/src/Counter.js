import React, { useReducer, useEffect } from 'react';
import './styles.scss';
import _ from 'lodash';

const initialState = {count: 0};

function reducer(state, action) {
	switch(action.type) {
		case 'increment':
			return {count: state.count + 1};
		case 'decrement':
			return {count: state.count - 1};
		case 'reset':
			return {count: 0};
		default:
			throw new Error();
	}
};

function Counter() {
	const [state, dispatch] = useReducer(reducer, initialState);
	
	useEffect(() => {
		if(state.count == 0) {
			alert('Count is 0');
		}
	});
	let ctr = _(state.count).times(idx => <i class="fas fa-apple-alt"></i>);
	
	return (
		<div class="counter-container">
			<p>
				{ctr}&nbsp;
			</p>
			<button onClick={() => dispatch({type: 'increment'})}>
				Increment
			</button>
			<button onClick={() => dispatch({type: 'decrement'})}>
				Decrement
			</button>
			<button onClick={() => dispatch({type: 'reset'})}>
				Reset
			</button>
		</div>
	);
}

export default Counter;