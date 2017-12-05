import React from 'react';

const ConnectionError = (props) => {
	return (
  	<div className={props.classes}>
  		<div>
  			<h3>We are very sorry</h3>
  			<p>{props.errorMessage}</p>
  			<button onClick={props.dismissError}>Dismiss</button>
  		</div>
  	</div>
  );
}

export default ConnectionError;
