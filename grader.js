#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var rest = require('restler');

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1);
    }
    return instr;
};


var cheerioHtmlFile = function(htmlfile) {
    console.log("cheerioHtmlFile");  // edited
    return cheerio.load(fs.readFileSync(htmlfile));
};


var loadChecks = function(checksfile) {
    console.log("loadChecks");  // edited
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    console.log("checkHtmlFile");
    console.log(htmlfile, checksfile);  // edited
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-f, --file [html_file]', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url [url]', 'Path to URL')  
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .parse(process.argv);
    console.log("Argv: ", process.argv);  // edited 


    if (program.url) {

	console.log("URL is ", program.url); 
	console.log(program.url);
	$ = cheerio.load(rest.get(program.url).on('complete', function() {

	    console.log("rest.get Completed");
	    // var checkJson = checkHtmlFile(urlContents, program.checks);
	    // $ = cheerioHtmlFile(htmlfile);
	    var checks = loadChecks(program.checks).sort();

	    var out = {};
	    for(var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	    }
	    var checkJson = out;
	    var outJson = JSON.stringify(checkJson, null, 4);
	    console.log(outJson);
        }));
    }


    else {
	console.log("No URL"); 
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    }
} 

else {
    exports.checkHtmlFile = checkHtmlFile;
}
