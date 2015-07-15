///<reference path='../interface/node.d.ts' />

var Parser = require('jison').Parser;
var fs = require('fs');

var sGrammar = fs.readFileSync('SelectStatementParser.jison', {encoding:'utf8'});

var parser = new Parser(sGrammar);
parser.lexer.options.backtrack_lexer = false;
parser.lexer.options.flex = true;
var generatedParser = parser.generate();

fs.writeFileSync('./SelectStatementParser.js', generatedParser);

// Do a quick sanity check on the parser we have just generated
parser.parse("select * from clients");
