
function createNewNaiveBayesClassifier(fnIsStopWord)
{
	var oStrings = {};
	var wordsTrue = createNewWordCollection();
	var wordsFalse = createNewWordCollection();

	function createNewWordCollection()
	{
		var oWords = {};
		var nCount = 0;

		return {
			addWord: function(sWord)
			{
				if (!fnIsStopWord(sWord))
				{
					++nCount;

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
			},

			asArray: function()
			{
				var arr = [];

				for (var sWord in oWords)
				{
					arr.push(oWords[sWord]);
				}

				return arr;
			},

			logOfProbabilityOfWord: function(sWord)
			{
				var p;

				if (typeof(oWords[sWord]) === 'undefined')
				{
					p = 1 / nCount;
				}
				else
				{
					p = (1 + oWords[sWord].count) / nCount;
				}

				return Math.log(p);
			}
		};
	}

	function getWordsFromString(s, addWord)
	{
		var nWordStart = 0;
		var arrWords = [];

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

		return arrWords;
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
				if (bClassification === true)
				{
					getWordsFromString(s, wordsTrue.addWord);
				}
				else if (bClassification === false)
				{
					getWordsFromString(s, wordsFalse.addWord);
				}
				else
				{
					// Hack - this line should be one level up, but there's some dodgy repeatition of strings
					// going on in the example data
					oStrings[s] = {classification: bClassification};
				}
			}
		},

		classify: function()
		{
			var arr = [];

			function addWord(sWord)
			{
				arr.push(sWord);
			}

			for (var sString in oStrings)
			{
				if (oStrings[sString].classification === null)
				{
					arr = [];

					getWordsFromString(sString, addWord);

					var dLogPtrue = 0.0;
					var dLogPfalse = 0.0;

					for (var nWord = 0; nWord < arr.length; ++nWord)
					{
						var sWord = arr[nWord];
						dLogPtrue  += wordsTrue.logOfProbabilityOfWord(sWord);
						dLogPfalse += wordsFalse.logOfProbabilityOfWord(sWord);
					}

					console.log (sString.slice(0,20) + ' ' + dLogPtrue + ' vs ' + dLogPfalse + ' classified ' + (dLogPtrue > dLogPfalse));
				}
			}

			return arr;
		},

		eachWord: function(bClassification, compare, callback)
		{
			var oWords = {};

			if (bClassification === true)
			{
				oWords = wordsTrue;
			}
			else if (bClassification === false)
			{
				oWords = wordsFalse;
			}
			else
			{
				throw 'eachWord(): first parameter is invalid';
			}

			var arr = oWords.asArray();
			
			arr.sort(compare);

			for (var n = 0; n < arr.length; ++n)
			{
				var oWord = arr[n];
				var sWord = oWord.word;
				var bRetVal = callback(sWord, oWords.logOfProbabilityOfWord(sWord));

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

classifier.classify();

/*
var nWordCount = 0;
console.log('');

classifier.eachWord(true, classifier.compareCount, function(sWord, nCount)
{
	console.log(sWord + ': ' + nCount);
	++nWordCount;
	return nWordCount < 5;
});

nWordCount = 0;
console.log('');

classifier.eachWord(false, classifier.compareCount, function(sWord, nCount)
{
	console.log(sWord + ': ' + nCount);
	++nWordCount;
	return nWordCount < 5;
});
*/

