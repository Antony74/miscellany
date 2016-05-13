
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

		eachWord: function(callback)
		{
			for (var sWord in oWords)
			{
				callback(sWord);
			}
		}
	};
}

//
// Test code
//

function isStopWord(s)
{
	return (s.length <= 3);
}

var classifier = createNewNaiveBayesClassifier(isStopWord);

classifier.addString('The quick brown fox jumps over the lazy dog', null);

classifier.eachWord(function(sWord)
{
	console.log(sWord);
});

