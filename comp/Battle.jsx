/** @jsx React.DOM
 *
 * The UI represeting a battle room. Ideally this component should be able
 * to render singleplayer, multiplayer and hosted rooms with the differences
 * being abstracted away in the store.
 */

'use strict'

var Reflux = require('reflux');
var BattleUserList = require('./BattleUserList.jsx');
var BattleMap = require('./BattleMap.jsx');

module.exports = React.createClass({
	mixins: [Reflux.ListenerMixin],
	// We need custom initialization because the store is passed in a prop.
	componentDidMount: function(){
		this.subscription = this.listenTo(this.props.battle, this.updateBattle, this.updateBattle);
	},
	componentWillReceiveProps: function(props){
		if (props.battle !== this.props.battle){
			this.subscription();
			this.subscription = this.listenTo(this.props.battle, this.updateBattle, this.updateBattle);
		}
	},
	componentWillUnmount: function(){
		this.subscription.stop();;
	},
	getInitialState: function(){
		return {
			teams: {},
			map: '',
			game: '',
			boxes: {},
		};
	},
	updateBattle: function(data){
		this.setState(data);
	},
	handleChangeTeam: function(n){
		this.props.battle.setOwnTeam(n);
	},
	render: function(){
		return (<div className="battleRoom">
			<div className="leftSide">
				<div className="mapTitle">
					<h1>{this.state.map === '' ? '[no map selected]' : this.state.map}</h1>
					<button>Select</button>
				</div>
				<BattleMap map="Titan-v2" />
			</div>
			<div className="rightSide">
				<BattleUserList teams={this.state.teams} onChangeTeam={this.handleChangeTeam} />
			</div>
		</div>);
	}
});