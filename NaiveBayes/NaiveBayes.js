
function createNewNaiveBayesClassifier(fnIsStopWord)
{
	var oStrings = {};
	var oWords = {};

	function addWord(sWord)
	{
		if (!fnIsStopWord(sWord))
		{
			if (typeof(oWords[sWord]) === 'undefined')
			{
				oWords[sWord] =
				{
					word: sWord,
					count: 1
				};
			}
			else
			{
				++oWords[sWord].count;
			}
		}
	}

	return {

		addStrings: function(arr, bClassification)
		{
			for (var n = 0; n < arr.length; ++n)
			{
				this.addString(arr[n], bClassification);
			}
		},

		addString: function(s, bClassification)
		{
			if (typeof(s) !== 'string')
			{
				throw 'addString: Bad first parameter';
			}

			if (bClassification !== null && bClassification !== true && bClassification !== false)
			{
				throw 'addString: Bad second parameter';
			}

			s = s.toLowerCase();

			if (typeof(oStrings[s]) === 'undefined')
			{
				oStrings[s] = {};

				var nWordStart = 0;

				for (var n = 0; n < s.length; ++n)
				{
					var nChar = s.charAt(n);

					if (!( (nChar >= 'a' && nChar <= 'z') || (nChar >= '0' && nChar <= '9') ))
					{
						if (nWordStart !== n)
						{
							addWord(s.substr(nWordStart, n-nWordStart));
						}
						nWordStart = n + 1;
					}
				}

				if (nWordStart !== n - 1)
				{
					addWord(s.substr(nWordStart));
				}
			}
		},

		eachWord: function(compare, callback)
		{
			var arr = [];
			
			for (var sWord in oWords)
			{
				arr.push(oWords[sWord]);
			}

			arr.sort(compare);

			for (var n = 0; n < arr.length; ++n)
			{
				var oWord = arr[n];
				var bRetVal = callback(oWord.word, oWord.count);

				if (bRetVal === false)
				{
					break;
				}
			}
		},

		compareCount: function(a, b)
		{
			return b.count - a.count;
		}
	};
}

//
// loadStrings
//

var fs = require('fs');

function loadStrings(sFilename)
{
	var sText = fs.readFileSync( sFilename, {encoding: 'utf8'} );
	var arrRaw = sText.split('\n');
	var arrRet = [];

	for (var n = 0; n < arrRaw.length; ++n)
	{
		var s = arrRaw[n].trim();
		if (s.length)
		{
			arrRet.push(s);
		}
	}

	console.log('Loaded ' + arrRet.length + ' items from ' + sFilename);

	return arrRet;
}

//
// Test code
//

function isStopWord(s)
{
	return (s.length <= 3);
}

var arrTrue = loadStrings('true.txt');
var arrFalse = loadStrings('false.txt');
var arrUnclassified = loadStrings('unclassified.txt');

var classifier = createNewNaiveBayesClassifier(isStopWord);

classifier.addStrings(arrTrue, true);
classifier.addStrings(arrFalse, false);
classifier.addStrings(arrUnclassified, null);

var nWordCount = 0;

classifier.eachWord(classifier.compareCount, function(sWord, nCount)
{
	console.log(sWord + ': ' + nCount);
	++nWordCount;
	return nWordCount < 5;
});

