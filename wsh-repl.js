var REPL = {
    version: "0.3",
	executing: true,
	prompt: "WSH > ",
    multiLine: false,
	maximumInspectionDepth: 100,
    changeLog: {
		"0.3":["added help message"],
		"0.2":["Wrapped REPL inside of a try/catch block.",
			   "Added multi-line mode.",
			   "Added Object Inspector",
			   "Added Include File Mechanism"],
		"0.1":["Initial Release"]
	},

	start: function() {
		REPL.showMOTD();
		REPL.executing = true;
		REPL.exec();
	},

	showMOTD: function() {
		WScript.StdOut.WriteLine ("Welcome to the WSH REPL V "+REPL.version);
		WScript.StdOut.WriteLine ("Granting Wishes!");
		WScript.StdOut.WriteLine ("use REPL.inspect(REPL) for help.");
	},

	getPrompt: function () {
		return REPL.prompt;
	},

	useMultiLineMode: function() {
		REPL.multiLine = "undefined;"; // should return empty, and also set it to false.
	},

	include: function(jsFile) {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var f = fso.OpenTextFile(jsFile);
		var s = f.ReadAll();
		f.Close();
		return (eval(s));
	},


	exec: function() {
		while(REPL.executing) {
			WScript.StdOut.Write(REPL.getPrompt());

			var cmd = WScript.StdIn.ReadLine();

			if (REPL.multiLine)
			{
				if (cmd == "!GO") {
					cmd = REPL.multiLine;
					REPL.multiLine = false;
				} else {
					REPL.multiLine = REPL.multiLine + cmd;
				}
			}

			/* k, this is a bit of a cheep hack, but if the last
			 * entered command in multi-line mode is \GO
			 * then it will switch off multi-line mode and
			 * store the result in command.
			 */

			if (!REPL.multiLine) {
				try {
					WScript.StdOut.WriteLine(eval(cmd));
				} catch(e) {
					REPL.displayError(e);
				}
			}
		}
	},

	inspectionDepth: 0,
	inspect: function(obj) {
		if (REPL.inspectionDepth > REPL.maximumInspectionDepth) {
			WScript.StdOut.WriteLine ("Maximum Inspection Depth Achived.  Good job!");
			return;
		}

		var depthStr = "";
		for (var i = 1; i <= REPL.inspectionDepth; i++) {
			depthStr = depthStr + "  ";
		}

		REPL.inspectionDepth = REPL.inspectionDepth + 1;
		if ((typeof obj) == "object") {
			WScript.StdOut.WriteLine("Object");
			for (var prop in obj) {
				WScript.StdOut.Write(depthStr + prop +" : ");
				REPL.inspect(obj[prop]);
			}
		} else {
			WScript.StdOut.Write("("+(typeof obj)+ ") "+obj);
		}
		WScript.StdOut.WriteLine("");
		REPL.inspectionDepth = REPL.inspectionDepth - 1;
	},

	displayError: function(e) {
		WScript.StdOut.WriteLine("[Genie Error] Cannot grant wish! ");
		WScript.StdOut.WriteLine(e + " " + e.number);
		WScript.StdOut.WriteLine(e.name);
		WScript.StdOut.WriteLine(e.description);
	},

	info: function() {
		WScript.StdOut.WriteLine("WSH REPL Version "+REPL.version);
		WScript.StdOut.WriteLine("With Super Genie Powers!");
		WScript.StdOut.WriteLine("");
		WScript.StdOut.WriteLine("Change Log");
		WScript.StdOut.WriteLine("----------");
		REPL.inspect(REPL.changeLog);
	},

	stop: function() {
		REPL.executing = false;
	},

	quit: function() { REPL.stop(); },
	exit: function() { REPL.stop(); }
}


REPL.start();