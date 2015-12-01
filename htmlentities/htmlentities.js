
// There's a PHP function called htmlentities.  I want this functionality in node.js

console.log(htmlentities('<hello><world>'));
console.log(htmlentities('<anyone><home>'));

function htmlentities(text)
{
	var document = require('jsdom').jsdom();

	htmlentities = function(text)
	{
		document.body.textContent = text;
		return document.body.innerHTML;
	}

	return htmlentities(text);
}

