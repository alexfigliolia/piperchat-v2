import React from 'react';
import You from './You';
import Me from './Me';
import ConnectionError from './ConnectionError';

const Dashboard = (props) => {
	return (
		<section className="dashboard">
			<div>
				{
					props.loggedIn &&
					<You
						height={props.height}
						width={props.width}
						setCallingScreen={props.setCallingScreen} />
				}
				{
					props.loggedIn &&
					<Me 
						initPeer={props.initPeer}
						getLocalStream={props.getLocalStream}
						localStream={props.stream} />
				}
			</div>
			{
				props.loggedIn &&
				<div className={props.classes} id="csc">
					<div className="loader-pic">
						<img 
							src={props.incomingUser === null ? 'userpl.svg' : props.incomingUser}
							alt='Who you are chatting with' />
					</div>
					<div className="answer-deny">
						<button
							onClick={props.endCall}
							className="end-call"></button>
						<button
							onClick={props.acceptCall}
							className="answer-call"></button>
					</div>
				</div>
			}
			{
				props.loggedIn &&
				<ConnectionError 
					classes={props.connectionErrorClasses}
					errorMessage={props.connectionError}
					dismissError={props.dismissError} />
			}
		</section>
	);
}

export default Dashboard;