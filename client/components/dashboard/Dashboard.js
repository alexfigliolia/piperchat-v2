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
				{
					props.loggedIn &&
					<ConnectionError 
						classes={props.connectionErrorClasses}
						errorMessage={props.connectionError}
						dismissError={props.dismissError} />
				}
			</div>
			{
				props.loggedIn &&
				<div className={props.classes} id="csc">
					<div className="loader-pic"></div>
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
		</section>
	);
}

export default Dashboard;