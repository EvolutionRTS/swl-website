/*
 * Main menu.
 */

'use strict'

require('style/Home.scss');
var _ = require('lodash');
var React = require('react');
var SPM = require('comp/StorePropMixins.js');
var ModalWindow = require('comp/ModalWindow.jsx');
var Battle = require('act/Battle.js');
var Settings = require('store/Settings.js');
var Applet = require('store/Applet.js');
var Log = require('act/Log.js');
var Process = require('act/Process.js');

var Server = require('act/LobbyServer.js');
var ConState = require('store/LobbyServerCommon.js').ConnectionState;

module.exports = React.createClass({
	displayName: 'Home',
	mixins: [SPM.connect('gameInfoStore', 'gameInfo')],
	getInitialState: function(){
		return {
			choosingDifficulty: null,
		};
	},
	handleMultiplayer: function(){
		if (this.props.serverStore.getInitialState().connection !== ConState.CONNECTED)
			Server.connect();
		this.props.onSelect('battlelist');
	},
	handleOpenUrl: function(url){
		var link = document.createElement('a');
		link.href = url;
		link.click();
	},
	handleSandbox: function(){
		// TODO
		/*var latestEvo = ...;
		Process.launchSpringScript({
			isHost: 1,
			hostIp: '127.0.0.1',
			myPlayerName: Settings.name || 'Player',
			gameType: latestEvo,
			mapName: ...,
			startPosType: ...,
			allyTeam0: {},
			team0: {
				allyTeam: 0,
				side: ...,
				rgbcolor: ...
			}
		});*/
	},
	render: function(){
		return <div className="container">
			<div className="homeScreen">
				<img className="aligncenter displayblock logoimage" src={require('img/evologo.png')} width="1040px" />
				<div className="section group">
					<div className="col span_1_of_2">
						<div className="entry">
							<h1 onClick={this.handleMultiplayer} className="menubutton aligncentertext">Multiplayer</h1>
							<h1 className="menubutton aligncentertext"><a href="https://github.com/EvolutionRTS/Evolution-RTS/wiki" title="How to play" target="_blank"> How to play</a></h1>
							<h1 onClick={_.partial(this.props.onSelect, 'settings')} className="menubutton aligncentertext">Settings</h1>
							<h1 className="menubutton aligncentertext"><a href="https://discord.gg/WUbAs2f" title="Help" target="_blank">Help</a></h1>
							<h1 className="menubutton aligncentertext"><a href="https://discord.gg/WUbAs2f" title="Community Discord Server" target="_blank">Community Discord Server</a></h1>
							<h1 className="menubutton aligncentertext"><a href="http://www.forums.evolutionrts.info" title="Community Forums" target="_blank">Community Forums</a></h1>
							<h1 className="menubutton aligncentertext"><a href="https://www.evolutionrts.info" title="Evolution RTS Website" target="_blank">Evolution RTS Website</a></h1>
						</div>
					</div>
					<div className="col span_1_of_2">
						<div className="entry entry-background">
							{/* There will be a loop here pulling in rss so the next bit is just for examples */}
							<div class='embed-container'><iframe src='https://www.evolutionrts.info/iframenews/' name='EvoNews' scrolling='yes' frameborder='0' marginheight='0px' marginwidth='0px' height='500px' width='550px'></iframe></div>
							
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
});
