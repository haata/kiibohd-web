// - Kiibohds Mk2 termlib specialization Code -
// - Modified from mass:werk, N.Landsteiner 2010 by Jacob Alexander 2011

var ANSI_CSI=String.fromCharCode(0x1b)+'[';

function ansiExpression(p) {
	return ANSI_CSI+String(p)+'m';
}

var term;

var motdIntro = [
// ASCII Art Logo (Use regex's for changing colour tags...)
'%+u__%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u________%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u_________________%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u_________________________%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__________________%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u________________%-u        ',
' %+u_%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u_____%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%c(d)%+b//%-b%c(0)%+u_________________%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u________________________%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u_________________%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u________________%-u       ',
'  %+u_%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%c(d)%+b//%-b%c(0)%+u_______%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u___%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u________________________%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u_________________%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u________________%-u      ',
'   %+u_%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\\\\\\\%-b%c(0)%c(d)%+b//%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u______%-u%c(7)%+b\\%-b%c(0)%c(d)%+b///%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b///%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u_____________%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\\\\\%-b%c(0)%+u_____%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u_________________%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u____%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\\\\\\\\\\\\\\\%-b%c(0)%+u_%-u     ',
'    %+u_%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%c(d)%+b//%-b%c(0)%+u_%-u%c(7)%+b\\%-b%c(0)%c(d)%+b//%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u______%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u___%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\\\\\\\\\\\\\%-b%c(0)%+u_____%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%c(d)%+b///%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\\\\\\\\\\\\\\\%-b%c(0)%+u_____%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\\\\\\\\\\\\\%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%c(d)%+b//////%-b%c(0)%+u__%-u    ',
'     %+u_%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u____%-u%c(7)%+b\\%-b%c(0)%c(d)%+b//%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u____%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%c(d)%+b////%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u___%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b//%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%c(d)%+b/////%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u___%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%c(d)%+b////%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\\\\\\\\\\\\\\\%-b%c(0)%+u_%-u   ',
'      %+u_%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u_____%-u%c(7)%+b\\%-b%c(0)%c(d)%+b//%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b//%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b////////%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u_%-u  ',
'       %+u_%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u______%-u%c(7)%+b\\%-b%c(0)%c(d)%+b//%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\\\\\\\\\\\\\%-b%c(0)%+u____%-u%c(7)%+b\\%-b%c(0)%c(d)%+b///%-b%c(0)%c(7)%+b\\\\\\\\\\%-b%c(0)%c(d)%+b/%-b%c(0)%+u____%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\%-b%c(0)%+u__%-u%c(7)%+b\\%-b%c(0)%c(d)%+b//%-b%c(0)%c(7)%+b\\\\\\\\\\\\\\%-b%c(0)%c(d)%+b/%-b%c(0)%c(7)%+b\\\\%-b%c(0)%+u___%-u%c(d)%+b/%-b%c(0)%c(7)%+b\\\\\\\\\\\\\\\\\\\\%-b%c(0)%+u_%-u ',
'        %+u_%-u%c(7)%+b\\%-b%c(0)%c(d)%+b///%-b%c(0)%+u________%-u%c(7)%+b\\%-b%c(0)%c(d)%+b///%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b///%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b///%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/////////%-b%c(0)%+u_______%-u%c(7)%+b\\%-b%c(0)%c(d)%+b/////%-b%c(0)%+u______%-u%c(7)%+b\\%-b%c(0)%c(d)%+b///%-b%c(0)%+u____%-u%c(7)%+b\\%-b%c(0)%c(d)%+b///%-b%c(0)%+u____%-u%c(7)%+b\\%-b%c(0)%c(d)%+b///////%-b%c(0)%c(7)%+b\\%-b%c(0)%c(d)%+b//%-b%c(0)%+u___%-u%c(7)%+b\\%-b%c(0)%c(d)%+b//////////%-b%c(0)%+u__%-u',

'',
];

var introHelp = [
	'',
	' %c(2)Confounded%c(0) on what to do? Or just %+blazy%-b? Click %c(0)%+mjavascript:cmdLink(\'help\')%-m%+nHERE%-n!',
	'',
	'',
];

var helpInfoList = [
	'',
	'%c(e)General Information%c(0):',
	' %c(4)*%c(0) All commands have -h/--help arguments to help with usage details.',
	' %c(4)*%c(0) The crawler query dumps EVERYTHING on this site, excuse the load times...',
	' %c(4)*%c(0) For web crawlers there is a second php crawler query at the bottom of the page.',
	' %c(4)*%c(0) Tab complete!',
	'',
	'%c(e)TODO List%c(0):',
	' %c(4)*%c(0) Terminal Scrolling bug fixes',
	' %c(4)*%c(0) Pop-up image viewer.',
	' %c(4)*%c(0) Font size changer.',
	' %c(4)*%c(0) Crawler Query.',
	' %c(4)*%c(0) General Queries.',
	' %c(4)*%c(0) Error emailer (local database and remote database errors).',
	' %c(4)*%c(0) Query output templates.',
	' %c(4)*%c(0) URL Queries.',
	' '
];


var colorTable = [
	ansiExpression(7)+' termlib ANSI-mapping sample: '+ansiExpression(0),
	' ',
	ansiExpression(3)+ansiExpression(4)+' color name      code       sample       comment'+ansiExpression(23)+'                               '+ansiExpression(0),
	' black           30m    '+ansiExpression(30)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0)+'   "black" is displayed as config color',
	' red             31m    '+ansiExpression(31)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0)+'    unless option ANSItrueBlack is true',
	' green           32m    '+ansiExpression(32)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' yellow          33m    '+ansiExpression(33)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' blue            34m    '+ansiExpression(34)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' magenta         35m    '+ansiExpression(35)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' cyan            36m    '+ansiExpression(36)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' white           37m    '+ansiExpression(37)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' bright black    90m    '+ansiExpression(90)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' bright red      91m    '+ansiExpression(91)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' bright green    92m    '+ansiExpression(92)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' bright yellow   93m    '+ansiExpression(93)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' bright blue     94m    '+ansiExpression(94)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' bright magenta  95m    '+ansiExpression(95)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' bright cyan     96m    '+ansiExpression(96)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' bright white    97m    '+ansiExpression(97)+'normal '+ansiExpression(7)+'reverse'+ansiExpression(0),
	' ',
	'other supported ANSI SGR sequences:',
	' 1m '+ansiExpression(1)+'bold'+ansiExpression(22)+', 3m '+ansiExpression(3)+'italics'+ansiExpression(23)+', 4m '+ansiExpression(4)+'underline'+ansiExpression(24)+', 7m '+ansiExpression(7)+'negative image'+ansiExpression(27)+', 9m '+ansiExpression(9)+'crossed out'+ansiExpression(29)+',%n 21m '+ansiExpression(21)+'underline double'+ansiExpression(24)
];

// Variable for storing the URI history
var historyURI = [];

// Resize Terminal on Browser resize
window.onresize = function() {
	// XXX This functionally breaks the scroll buffer currently, really needs a rework...
	//term.redimension();
	// Refreshing will do a proper resize, but is sort've lazy...
	//window.location.reload()
}

// Send a external function request to the server
function externalFunctionsRequest()
{
	var externalScript = document.location.protocol + "//" + document.location.host + "/scripts/externalFunctions.cgi";
	term.send(
		{
			url: externalScript,
			callback: externalFunctionsRx
		}
	);
}

// Callback on AJAX call for externally referenced functions
var externalFunctionsReady = false;
var startupCommands = "";
function externalFunctionsRx()
{
	if (this.socket.success)
	{
		// JSON.parse isn't guarranteed in all browsers... (at least pre-2009)
		var extFuncData = JSON.parse( this.socket.responseText );
		for ( c = 0; c < extFuncData.id.length; c++ )
		{
			// Build new function descriptor for each of the new external functions
			addCmd( extFuncData.id[c].name, new function()
			{
				this.help = extFuncData.id[c].help;
				this.regex = new RegExp( extFuncData.id[c].regex.replace( /\\\\/ig, "\\" ), "i" );
				this.type = extFuncData.id[c].type;
				this.helpInfo = extFuncData.id[c].helpinfo;
				this.name = extFuncData.id[c].name;
				var formatter = extFuncData.id[c].formatter;
				this.queries = [];

				// Send information to cgi script, and wait for query
				this.main = function(args)
				{
					var externalScript = document.location.protocol + "//" + document.location.host + "/scripts/" + extFuncData.id[c].script;
					term.send(
						{
							url: externalScript,
							data: {
								query: args,
								table: this.name
							},
							callback: this.callback
						}
					);
				}

				// Callback for external function cgi script
				this.callback = function()
				{
					// Check for recieve success
					if (this.socket.success)
					{
						//var funcFormatter = formatter;
						var funcFormatter = window[ formatter ];
						
						// Make sure the formatter function actually exists
						if ( typeof funcFormatter == 'function' )
						{
							//this.write( this.socket.responseText ); // Debug

							// JSON.parse isn't guarranteed in all browsers... (at least pre-2009)
							var requestedData = JSON.parse( this.socket.responseText );

							// Display title, only if there are items
							if ( requestedData.element.length > 0 )
							{
								term.write( '%n' );
							}
							for ( c = 0; c < requestedData.element.length; c++ )
							{
								// Pass JSON element to formatter
								funcFormatter( requestedData.element[c] );
							}
						}
					}

					// Bad AJAX return
					else
					{
						this.write('OOPS: ' + this.socket.status + ' ' + this.socket.statusText);
						if (this.socket.errno)
						{
							this.newLine();
							this.write('Error: ' + this.socket.errstring);
						}
					}
				}
			} );
		}

		// External functions ready, start terminal
		term.open();
		// dimm UI text
		var mainPane = (document.getElementById)?
			document.getElementById('mainPane') : document.all.mainPane;
		if (mainPane) mainPane.className = 'lh15 dimmed';

		// Update the tab complete reference
		term.tabCompletesUpdate(cmdList);

		// The terminal is ready, now send the passed input parameters
		var cmdArray = startupCommands.split("++");
		for ( c = 0; c < cmdArray.length; c++ )
		{
			cmdLink( cmdArray[c] );
		}
	}

	// Bad AJAX return
	else
	{
		this.write('OOPS: ' + this.socket.status + ' ' + this.socket.statusText);
		if (this.socket.errno)
		{
			this.newLine();
			this.write('Error: ' + this.socket.errstring);
		}
	}
}

function termOpen(commands) {
	TermGlobals.assignStyle( 16, 'b', '<b>', '</b>' ); // Bold enable

	// So I don't have to modify a lot, you can use these two tags in conjunction for any arbitrary URL + text pattern
	//  e.g. %+mhttp://geekhack.org%-m%+nGeekHack%-n
	// Note: Make sure text is in mode %c(0) when using there tags (image included)
	TermGlobals.assignStyle( 32, 'm', '<a href="', '">' ); // URL link Start/End
	TermGlobals.assignStyle( 64, 'n', '', '<\/a>' ); // URL Text End

	// Image Tag - Use in combination with the URL tags for image links
	//  e.g. %+e<link to picture>%-e
	TermGlobals.assignStyle( 128, 'e', '<img src="', '"\/>' ); // URL Text End

	// Add the various commands used with Kiibohds (place in alphabetical order)
	addCmd("about",     new aboutInfo   ());
	addCmd("color",     new colorInfo   ());
	addCmd("help",      new mainHelp    ());
	addCmd("queryhelp", new queryHelp   ());
	addCmd("reload",    new mainReload  ());
	addCmd("reset",     new mainReset   ());
	addCmd("restart",   new mainRestart ());
	addCmd("termsize",  new termSizeInfo());

	if ((!term) || (term.closed)) {
		term = new Terminal(
			{
				x: 0,
				y: 0,
				termDiv: 'termDiv',
				bgColor: '#000000',
				ps: '%c5:%c0',
				frameWidth: 0,
				mapANSI: true,
				ANSItrueBlack: false,
				printTab: false,
				historyUnique: true,
				crsrBlinkMode: false,
				//crsrBlinkMode: true, // Blinking cursor causes artifacts...probably could be fixed
				closeOnESC: false,
				initHandler: termInitHandler,
				handler: termHandler,
				ctrlHandler: controlHandler,
				exitHandler: termExitHandler
			}
		);

		// Prepare the input command list to be sent to the terminal screen once it has loaded
		startupCommands = commands;

		// This requests callback, which then loads the terminal
		externalFunctionsRequest();
	}
}

function termExitHandler() {
	// reset the UI
	var mainPane = (document.getElementById)?
		document.getElementById('mainPane') : document.all.mainPane;
	if (mainPane) mainPane.className = 'lh15';
}

function termInitHandler() {
	// Resize the terminal initially
	this.redimension();
	// output a start up screen
	this.write(motdIntro);

	// TODO do an AJAX request on basic queries
	//var quote = new item(); // TODO retrieve quote

	// Display random quote
	//randomQuoteDisplay( quote ); TODO Get quote

	// Display basic help
	this.write(introHelp);

	// and leave with prompt
	this.prompt();
}

function termHandler() {
	// default handler
	this.newLine();

	// Read over current list of available commands
	var c;
	for (c=0; c < cmdList.length; c++) {
		if (this.lineBuffer.search(cmdList[c].func.regex) == 0) {
			// Check for -h/--help
			if (this.lineBuffer.search(/.*\s(-h|--help)(\s.*|$)/i) == 0)
				this.write(cmdList[c].func.help);
			// Otherwise, run command, sending the arguments to be processed, if needed
			else	cmdList[c].func.main( this.lineBuffer );
			break;
		}
	}

	// Not a blank newline
	if (this.lineBuffer != '' )
	{
		// Command Not Found
		if ( c == cmdList.length)
		{
			this.write('%c(5)kiibohds%c(0): command not found: ' + this.lineBuffer);
			this.newLine();
		}
		// Command Found - Add to URI history
		else
		{
			// Add to history
			historyURI.push( this.lineBuffer );

			var newTitle = "Kiibohds - " + this.lineBuffer;
			var newURI = historyURI[0];

			for ( c = 1; c < historyURI.length; c++ )
			{
				newURI = newURI + "++" + historyURI[c];
			}

			// Replace the URL, if HTML 5 is supported (otherwise nothing happens)
			window.history.replaceState( null, newTitle, newURI );
		}
	}

	this.prompt();
}

// Struct Factory
function makeStruct(names) {
	var names = names.split(' ');
	var count = names.length;
	function constructor() {
		for (var i = 0; i < count; i++) {
			this[names[i]] = arguments[i];
		}
	}
	return constructor;
}

// Struct for commands
var cmdItem = makeStruct("name func");
var cmdList = [];
var nameLength = 0;

function addCmd(name,func) {
	// Make sure that the '-'s are aligned
	if ( name.length > nameLength )
		nameLength = name.length;

	cmdList.push( new cmdItem(name, func) );
}

function controlHandler() {
	// Detect Tabs for tab completion
	if ( this.inputChar == 9 ) {
		this.tabCompletion();
	}
}

// Allows for clickable links, that produce terminal commands
function cmdLink(text) {
	var output = text + '\n\r';
	if (text) TermGlobals.insertText(output);
}

// Terminal Commands
function mainHelp() {
	this.help = "Seriously, %c(2)help%c(0)...on help?";
	this.regex = /^\s*help\s?.*/i;
	this.type = "General Functions";
	this.helpInfo = "%+uThis%-u dialog, it uses AJAX queries for some of the command listings.";
	this.queries = [];

	// Output variable
	var outputText = [];

	this.main = function(args) {
		// Title
		outputText.push('%n %+b-%-b %c(5)%+bKiibohds Command Help%-b%c(0) %+b-%-b %n');

		// Main print section
		var currentTitle = "";
		var done = 0;
		var lastIncomplete = 0;
		var titlesUsed = [];
		for (var c=0; c < cmdList.length; c++) {
			// Section Title, places items in order, FCFS per section
			if ( currentTitle != cmdList[c].func.type ) {
				// Setup this section
				if ( lastIncomplete == c ) {
					currentTitle = cmdList[c].func.type;
					titlesUsed.push( currentTitle );
					outputText.push('%n%c(e)' + currentTitle + '%c(0):%n');
					lastIncomplete = -1;
				}
				else {
					if ( lastIncomplete == -1 ) {
						// Skip over a title if it's already used
						var i;
						for ( i = 0; i < titlesUsed.length; i++ ) {
							if ( titlesUsed[i] == cmdList[c].func.type )
								break;
						}
						if ( i != titlesUsed.length )
							continue;

						// Save this title for later
						lastIncomplete = c;
					}

					// Just in case this is the last item
					if ( c == cmdList.length - 1 )
						c = lastIncomplete - 1;

					continue;
				}
			}

			// Add spacing for '-' alignment
			var cmdSpace = "";
			for (var i = cmdList[c].name.length; i < nameLength; i++)
				cmdSpace = cmdSpace + ' ';

			// Item
			outputText.push(' %c(4)* %c(0)%+mjavascript:cmdLink(\'' + cmdList[c].name + '\')%-m%+n' + cmdList[c].name + '%-n' + cmdSpace + ' %c(0)- ' + cmdList[c].func.helpInfo);
			done++;

			// Loop Back to lastIncomplete
			if ( c == cmdList.length - 1 && done < c )
				c = lastIncomplete - 1;
		}

		// To Do List
		for ( var c = 0; c < helpInfoList.length; c++ )
			outputText.push( helpInfoList[c] );

		// Output the text to the screen in more mode (TODO proper scrolling)
		term.write( outputText ); // ,true );
	}
}

function mainReset() {
	this.help = "Well, type reset, it does stuff...erm erases.";
	this.regex = /^\s*reset\s?.*/i;
	this.type = "Terminal Functions";
	this.helpInfo = "Clears the screen.";
	this.queries = [];

	this.main = function(args) {
		term.clear();
	}
}

function colorInfo() {
	this.help = "Ooo! *looks at the pretty colours*";
	this.regex = /^\s*colou?rs?\s?.*/i;
	this.type = "Terminal Functions";
	this.helpInfo = "General color information (colour).";
	this.queries = [];

	this.main = function(args) {
		term.write(colorTable);
	}
}

function mainRestart() {
	this.help = "Well, type restart, it does stuff...erm erases, then reprints the intro :D.";
	this.regex = /^\s*restart\s?.*/i;
	this.type = "Terminal Functions";
	this.helpInfo = "Restarts the terminal, displaying the opening information.";
	this.queries = [];

	// In truth, this is just a refresh :P
	this.main = function(args) {
		// XXX There are better ways to do this, oh well :P
		//window.history.replaceState( null, "Kiibohds", "" );
		//window.location.reload()
		window.location = "http://kiibohd.com"; // XXX Should be less static...
	}
}

function mainReload() {
	this.help = "Well, type reload, does the same thing as refreshing the page...";
	this.regex = /^\s*reload\s?.*/i;
	this.type = "Terminal Functions";
	this.helpInfo = "Reloads the page, re-entering your entire working history until this point.";
	this.queries = [];

	// In truth, this is just a refresh :P
	this.main = function(args) {
		window.location.reload()
	}
}

function termSizeInfo() {
	this.help = "No options, but it tells you cool stuffss.";
	this.regex = /^\s*termsize\s?.*/i;
	this.type = "Terminal Functions";
	this.helpInfo = "Displays various statistics about the terminal size.";
	this.queries = [];

	this.main = function(args) {
		term.redimension('1');
	}
}

function aboutInfo() {
	this.help = "The wonderful, mystical, world of...of keyboards :P.";
	this.regex = /^\s*about\s?.*/i;
	this.type = "General Functions";
	this.helpInfo = "General information about this website and the tech that makes it tick.";
	this.queries = [];

	this.aboutDisplay = [
	'%n %+b-%-b %c(5)%+bAbout Kiibohds%-b%c(0) %+b-%-b %n',
	'This is the second incarnation of %c(5)%+bKiibohds%-b%c(0), a humble site dedicated to detailing computer keyboards and my various projects relating to them.',
	'In addition, a \"dictionary\" of key switches that I located and/or in the process of trying to acquire.',
	'',
	'I am always interested in \'interesting\' mechanical keyboards, especially those with switches not found within my collection.',
	'',
	'The previous site caused me a great number of headaches as the %+m#%-m%+nGoogle Docs API%-n kept changing, forcing me to keep updating the regex\'s and authentication manually.',
	'Yet, even when the site was working, it was painfully slow...',
	'So, in addition to providing a set of querying tools, in the form of a terminal interface, I have also pre-cached the Google Docs information on a separate database.',
	'',
	'Images are still hosted via %+m#%-m%+nPicasa%-n, but they have always been fast, so this shouldn\'t pose a problem.',
	'',
	'For those without a keyboard *gasp*, or unable to comprehend terminal commands, the green text is generally clickable.',
	'And will work just as if you had typed the command in question. (e.g. %+mjavascript:cmdLink(\'about\')%-m%+nabout%-n)',
	'',
	'%c(5)%+bKiibohds%-b%c(0) is built upon the %+m#%-m%+nGoogle Docs Spreadsheet API%-n, %+m#%-m%+nPHP%-n, %+m#%-m%+nMySQL%-n, %+m#%-m%+nJavaScript%-n, %+m#%-m%+nAJAX%-n, %+m#%-m%+ntermlib%-n, some %+m#%-m%+ntermlib enhancements%-n, and the %+m#%-m%+nPicasa Web API%-n.',
	'Not to mention, a lot of glue code by me, as well as lots of new code as well for things like proper scrolling, links, and images.',
	'',
	'The previous site, was built using a heavily modified indexhibit that interfaced directly with the Google Docs Spreadsheet API which provided the information needed to query the Picasa Web API.',
	'I have not provided a link to the old site, as it is currently broken, and is unmaintainable (with Google constantly changing things) from my perspective.',
	'And since web crawlers will have a slight difficulty with a JavaScript query site such as this, a php query page, containing a full query of information on this site, has also been provided.',
	'',
	'Any bugs? Please report them to me (%c(4)HaaTa%c(0)) on %+mirc://#geekhack@irc.freenode.net%-m%+n#geekhack%-n, I\'m usually around.',
	'Or PM me on %+mhttp://geekhack.org%-m%+nGeekHack%-n or %+mhttp://deskthority.org%-m%+nDeskthority%-n.',

	];

	this.main = function(args) {
		term.write( this.aboutDisplay );
	}
}

function queryHelp() {
	this.help = "Oi! No 'elp on 'elp.";
	this.regex = /^\s*queryhelp\s?.*/i;
	this.type = "General Functions";
	this.helpInfo = "Information on general query syntax.";
	this.queries = [];

	this.queryHelpDisply = [
	'%n %+b-%-b %c(5)%+bGeneral Query Help and Information%-b%c(0) %+b-%-b %n',
	];

	this.main = function(args) {
		term.write( this.queryHelpDisply );
	}
}


// - Formatter Functions -

// Device Formatter
function deviceFormat(element)
{
	// Title
	term.write( element.brand + ' ' + element.modelno + ' ' + element.type + '%n' );

	// Manufacturer (use link if available)
	if ( element.website.length > 0 )
	{
		term.write( '%+bManufactured by%-b: %+m' + element.website + '%-m%+n' + element.manufacturer + '%-n' );
	}
	else
	{
		term.write( '%+bManufactured by%-b: ' + element.manufacturer + '' );
	}
	term.write( ' in ' + element.placeofmanufacture + '  -  ' + element.dateofmanufacture + '%n' );

	// General Info
	term.write( '%+bSwitch%-b: ' + element.switch + '   %+bKeycaps%-b: ' + element.keycaps + '   %+bConnector%-b: ' + element.connector + '%n' );

	// Numbers
	term.write( '%+bSerial No.%-b: ' + element.serialno + '   %+bFCC ID No.%-b: ' + element.fccidno + '%n' );

	// Other
	term.write( '%+uNotes%-u ' + element.notes + '%n' );

	// Pictures
	//term.write( '%+ehttps://lh4.googleusercontent.com/-p8Z3gGHWPiI/Tr4Xq6LW6dI/AAAAAAAABzQ/OyRfB8fqEgk/s144/2011-11-11%252022.50.44.jpg%-e' + ' %+ehttps://lh3.googleusercontent.com/-I4MERFfszjM/TtUkB_XGFYI/AAAAAAAACjU/ErhYLVS1dto/s144/2011-11-28%252012.46.36.jpg %-e' + '%n' );

	// Final newline
	term.write( '%n' );
}

function switchFormat(element)
{
}

function newsFormat(element)
{
	term.write('%+u<' + item.date + '> - %c(13)%+b' + item.title + '%-b%c(0) - [' + item.author + ']%-u%n%n' + item.post + '%n%n');
}

function linkFormat(element)
{
	term.write( '%+m' + element.link + '%-m%+n' + element.name + '%-n%n  [%c(13)%+b' + element.type + '%-b%c(0)] ' );

	// Pad spaces for alignment (9 is arbitrary, as we aren't given enough context to decide here)
	for ( var c=element.type.length; c < 9; c++ ) {
		term.write( ' ' );
	}

	// Only display if there is data
	if ( element.description.length > 0 )
		term.write( ': ' + element.description + '%n' );
	else
		term.write( '%n' );
}

function crawlerFormat(element)
{
}

function articleFormat(element)
{
	term.write('%+u<' + element.date + '> - %c(13)%+b' + element.title + '%-b%c(0) - [' + element.author + ']%-u%n%n' + item.content + '%n%n');
}


// TODO Defined by PHP
function randomQuoteDisplay(item) {
	// Quote
	// (Context)
	// Individual
	term.write( "%n" + item.Quote + "%n  (%c(6)" + item.Context + "%c(0)) -%+b" + item.Individual + "%-b%n" );
}

// Browser Paste Handler unctions
function handlepaste (elem, e) {
	var savedcontent = elem.innerHTML;

	// Webkit - get data from clipboard, put into editdiv, cleanup, then cancel event
	if (e && e.clipboardData && e.clipboardData.getData) {
		if (/text\/html/.test(e.clipboardData.types)) {
			elem.innerHTML = e.clipboardData.getData('text/html');
		}
		else if (/text\/plain/.test(e.clipboardData.types)) {
			elem.innerHTML = e.clipboardData.getData('text/plain');
		}
		else {
			elem.innerHTML = "";
		}
		waitforpastedata(elem, savedcontent);
		if (e.preventDefault) {
			e.stopPropagation();
			e.preventDefault();
		}
		return false;
	}
	// Everything else - empty editdiv and allow browser to paste content into it, then cleanup
	else {
		elem.innerHTML = "";
		waitforpastedata(elem, savedcontent);
		return true;
	}
}

function waitforpastedata (elem, savedcontent) {
	if (elem.childNodes && elem.childNodes.length > 0) {
		processpaste(elem, savedcontent);
	}
	else {
		that = {
			e: elem,
			s: savedcontent
			}
		that.callself = function () {
			waitforpastedata(that.e, that.s)
		}
		setTimeout(that.callself,20);
	}
}

function processpaste (elem, savedcontent) {
	pasteddata = elem.innerHTML;
	//^^Alternatively loop through dom (elem.childNodes or elem.getElementsByTagName) here

	elem.innerHTML = savedcontent;

	// Do whatever with gathered data;
	term.write( pasteddata );
}

// AJAX Queries
function ajaxTest() {
	var xmlhttp;

	// code for IE7+, Firefox, Chrome, Opera, Safari
	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest();
	}
	// code for IE6, IE5
	else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			term.write( xmlhttp.responseText );
			//term.write("EEE");
			//document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
		}
		//term.write("AAA");
	}
	xmlhttp.open("GET","mk2/query.cgi",true);
	xmlhttp.send();
}

