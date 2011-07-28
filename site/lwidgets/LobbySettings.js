///////////////////////////////////

// JS Spring Lobby Interface

// By CarRepairer

///////////////////////////////////

dojo.provide("lwidgets.LobbySettings");
dojo.declare("lwidgets.LobbySettings", [  dijit._Widget ], {
	'settings':null,
	'settingsControls':null,
	'fadedColor':'',
	'settingsInput':null,
	
	
	'buildRendering':function()
	{
		var setting, saveButton, settingsJson;
		
		this.settings = {};
		this.settingsControls = {};
		
		
		/*
		 string makes an input
		 boolean makes a checkbox
		 
		 Special words:
		 
		 "Color" makes a color picker
		 "List" makes a text area
		 "Password" makes a password field
		*/
		this.settings = {
			
			'name':'',
			'password':'',
			
			'showJoinsAndLeaves':true,
			
			//Midknight's
			'chatTextColor':'#f2f2f2',
			'chatActionColor':'#F92672',
			'chatJoinColor':'#a6e22e',
			'chatLeaveColor':'#66d9ef',
			'chatBackColor':'#272822',
			'topicBackColor':'#4c4b3d',
			'topicTextColor':'#e6db74',
			
			
			'chatBorderColor':'',
			'chatBorderColor2':'',
			
			
			'autoJoinChannelsList':''
			
		};
		
		this.domNode = dojo.create('div', {} );
		
		for( settingKey in this.settings )
		{
			setting = this.settings[settingKey];
			this.addSettingControl(settingKey, setting);
		}
		dojo.create('br', {}, this.domNode );
		
		dojo.create('span', {'innerHTML':'Save Settings (copy text and save it) '}, this.domNode );
		this.settingsInput = dojo.create('input', {}, this.domNode )
		dojo.connect( this.settingsInput, 'onchange', dojo.hitch(this,'pullSettings'));
		dojo.connect( this.settingsInput, 'onmouseup', dojo.hitch(this,function(e){
			e.currentTarget.selectionStart = 0;
			e.currentTarget.selectionEnd = 9999;
		}));
		
		dojo.subscribe('SetColors', this, 'setColors');
		
		
		settingsJson = getCookie("settings");
		if(settingsJson)
		{
			dojo.attr( this.settingsInput, 'value', settingsJson);
			this.pullSettings();
			dojo.attr( this.settingsInput, 'value', settingsJson); //this.pullsettings messed up the input so do it a second time
			setCookie("settings", settingsJson, 20);
		}
		
	},
	
	
	'pullSettings':function()
	{
		var settingsStr, settings, key, value;
		
		settings = eval( '(' + dojo.attr(this.settingsInput, 'value') + ')' );
		
		for( key in settings )
		{
			if( this.settings.hasOwnProperty(key) )
			{
				value = settings[key];
				this.setSetting(key, value);
			}
		}
		dojo.publish('SetColors');
		
	},
	
	'blendColors':function(col1, col2)
	{
		var r1, g1, b1,
			r2, g2, b2,
			r3, g3, b3
			; 
		r1 = '0x' + col1.slice(1,3);
		g1 = '0x' + col1.slice(3,5);
		b1 = '0x' + col1.slice(5,7);
		
		r2 = '0x' + col2.slice(1,3);
		g2 = '0x' + col2.slice(3,5);
		b2 = '0x' + col2.slice(5,7);
		
		r1 = parseInt(r1, 16);
		g1 = parseInt(g1, 16);
		b1 = parseInt(b1, 16);
		
		r2 = parseInt(r2, 16);
		g2 = parseInt(g2, 16);
		b2 = parseInt(b2, 16);
		
		r3 = new Number( Math.round((r1 + r2) / 2 ));
		g3 = new Number( Math.round((g1 + g2) / 2 ));
		b3 = new Number( Math.round((b1 + b2) / 2 ));
		
		r3 = r3.toString(16);
		g3 = g3.toString(16);
		b3 = b3.toString(16);
		
		return '#' + r3 + g3 + b3;
		
	},
	
	'setColors':function()
	{
		this.fadedColor = this.blendColors(this.settings.chatBackColor, this.settings.chatTextColor);
		
		dojo.query('.topicDiv').style('color', this.settings.topicTextColor);
		dojo.query('.topicDiv').style('background', this.settings.topicBackColor);
		
		dojo.query('.messageDiv').style('color', this.settings.chatTextColor);
		dojo.query('.messageDiv').style('background', this.settings.chatBackColor);
		
		dojo.query('.textInput').style('color', this.settings.chatTextColor);
		dojo.query('.textInput').style('background', this.settings.chatBackColor);
		
		dojo.query('.playerListSelect').style('color', this.settings.chatTextColor);
		dojo.query('.playerListSelect').style('background', this.settings.chatBackColor);
		
		dojo.query('.playerlistDiv').style('color', this.settings.chatBorderColor);
		dojo.query('.playerlistDiv').style('background', this.settings.chatBorderColor);
		dojo.query('.inputDiv').style('background', this.settings.chatBorderColor);
		dojo.query('.chatAction').style('color', this.settings.chatActionColor);
		dojo.query('.mainContainer').style('background', this.settings.chatBorderColor2);
		
		dojo.query('.chatJoin').style('color', this.settings.chatJoinColor);
		dojo.query('.chatLeave').style('color', this.settings.chatLeaveColor);
		
		dojo.query('.chatMine').style('color', this.fadedColor);
		
		dojo.query('.chatJoin').style('display', this.settings.showJoinsAndLeaves ? 'block' : 'none' );
		dojo.query('.chatLeave').style('display', this.settings.showJoinsAndLeaves ? 'block' : 'none'  );
		
	},
	
	'cleanupName':function(name)
	{
		var newName
		newName = name;
		newName = newName.replace(/([A-Z])/g, ' $1' )
		newName = newName[0].toUpperCase() + newName.slice(1) + ' ';
		return newName;
	},
	
	'saveSettingString':function()
	{
		var settingsJson;
		settingsJson = JSON.stringify(this.settings);
		dojo.attr( this.settingsInput, 'value', settingsJson);
		setCookie("settings", settingsJson, 20);
	},
	
	'addSettingControl':function(name, val)
	{
		var control, type, cleanName, controlDiv, nameDiv, rowDiv, colorDiv, ddButton;
		
		cleanName = this.cleanupName(name);
		rowDiv = dojo.create('div', {'style':{'height':'40px' /*, 'position':'absolute' */} }, this.domNode );
		nameDiv = dojo.create('div', {'innerHTML': cleanName, 'style':{'position':'absolute' } }, rowDiv );
		controlDiv = dojo.create('div', {'style':{'position':'absolute', 'left':'200px', /*'height':'100%', */'width':'200px'} }, rowDiv );
		var onChangeFunc = dojo.hitch( this, function(e){
			var val, controlType;
			controlType = e.target.type;
			val = e.target.value;
			console.log(e)
			if( controlType === 'text' || controlType === 'password' || controlType === 'textarea' )
			{
				val = e.target.value;
			}
			else //( controlType === 'checkbox' )
			{
				val = e.target.checked;
			}
			this.settings[name] = val;
			dojo.publish('Settingchange');
			this.saveSettingString();
		});
		
		var onChangeFuncColor = dojo.hitch( this, function(val){
			this.settings[name] = val;
			dojo.publish('Settingchange');
			dojo.publish('SetColors');
			this.saveSettingString();
		});
		
		if( typeof(val) === 'object' )
		{
			/*
			control = new dijit.form.Select({
				'label':'something',
				'options':val
			}).placeAt( controlDiv );
			dojo.connect(control, 'onChange', dojo.hitch( this, onChangeFunc ));
			*/
		}
		else if( typeof(val) === 'string' )
		{
			if( name.search('List') !== -1 )
			{
				control = dojo.create('textarea', {'innerHTML':val}, controlDiv)
				dojo.connect(control, 'onchange', onChangeFunc );
			}
			else if( name.search('Color') !== -1 )
			{
				control = new dijit.ColorPalette( {} )
				ddButton = new dijit.form.DropDownButton({
					'label':'Choose Color...',
					'dropDown':control
				}).placeAt( controlDiv );
				dojo.connect(control, 'onChange', onChangeFuncColor );
				
				colorDiv = dojo.create('div', {'innerHTML':'&nbsp;&nbsp;&nbsp;', 'style':{'position':'absolute', 'width':'20px','right':'2px', 'top':'2px', 'outline':'solid black 1px' } }, controlDiv);
				
				dojo.subscribe('SetColors', this, function(){ dojo.style(colorDiv, 'background', this.settings[name] ); } );
			}
			else
			{
				type = 'text';
				if( name.search('password') !== -1 )
				{
					type = 'password';
				}
				control = dojo.create('input', {'type':type, 'value':val}, controlDiv );
				dojo.connect(control, 'onchange', onChangeFunc );
			}
		}
		else if( typeof(val) === 'boolean' )
		{
			control = dojo.create('input', {'type':'checkbox', 'checked':val}, controlDiv );
			dojo.connect(control, 'onchange', onChangeFunc );
		}
		this.settingsControls[name] = control;
		
	},
	'setSetting':function(name, val)
	{
		var control;
		
		control = this.settingsControls[name]
		if( typeof(val) === 'object' )
		{
			
		}
		else if( typeof(val) === 'string' )
		{
			if( name.search('List') !== -1 )
			{
				dojo.attr(control, 'value', val);
			}
			else if( name.search('Color') !== -1 )
			{
				control.attr('value', val);
			}
			else
			{
				dojo.attr(control, 'value', val);
			}
		}
		else if( typeof(val) === 'boolean' )
		{
			dojo.attr(control, 'checked', val);
		}
		this.settings[name] = val;
	},
	
	'blank':''
});
