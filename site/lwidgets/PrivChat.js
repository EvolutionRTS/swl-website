///////////////////////////////////

// JS Spring Lobby Interface

// By CarRepairer

// License: GPL 2

///////////////////////////////////


define(
	'lwidgets/PrivChat',
	[
		"dojo/_base/declare",
		
		'dojo/topic',
		'dojo/_base/array',
		'dojo/_base/lang',
		
		'dojo/text!./templates/privchat.html?' + cacheString,
		
		'lwidgets/Chat',
		
		//extras
		
		
	],
	function(declare,
		topic, array, lang,
		template, Chat ){
	return declare( [ Chat ], {

	'templateString' : template,	

	'saystring':'SAYPRIVATE',
	'name' : "",
	
	'postCreate2':function()
	{
		var friendsList;
		
		this.addSubscription( this.subscribe('Lobby/chat/user/playermessage', 'playerMessage' ) );
		
		friendsList = this.settings.settings.friendsList.split('\n');
		this.friendToggleButton.setChecked( array.indexOf(friendsList, this.name)!== -1 )
	},
	
	
	//override
	'sendMessage':function(msg)
	{
		var smsg;
		
		if( this.users[this.name] )
		{
			this.inherited(arguments);
			return;
		}
		
		smsg = 'SAYPRIVATE Nightwatch !pm ' + this.name + ' ' + msg;
		topic.publish( 'Lobby/notidle', {} );
		topic.publish( 'Lobby/rawmsg', {'msg':smsg } );
		
		this.addLine( msg, 'chatMine', 'Offline', this.nick );
		
	},
	
	toggleFriend:function(val)
	{
		var friendsList;
		if(val)
		{
			this.settings.setSetting( 'friendsList', this.settings.settings.friendsList + ('\n' + this.name) );
		}
		else
		{
			friendsList = this.settings.settings.friendsList.split('\n');
			friendsList = array.filter( friendsList, lang.hitch(this, function(name){ return name !== this.name } ) )
			this.settings.setSetting( 'friendsList', friendsList.join('\n') );
		}
	},
	
}); }); //declare lwidgets.Privchat



