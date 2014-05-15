
var sGitBin = "C:/Program Files/Git/bin/git.exe";
var sWorkingDir = "C:/Users/akb/desktop/example/shared";

if (typeof process == 'undefined' || process.versions == 'undefined' || process.versions.node == 'undefined')
{
    var usage = 'Usage: node TimeSpent.js\r\n';
    usage +=    'Are you trying to use a different JavaScript engine?';

    if      (typeof console != 'undefined') (function(){console.log(usage); })();
    else if (typeof alert   != 'undefined') (function(){alert(usage);       })();
    else if (typeof WScript != 'undefined') (function(){WScript.echo(usage);})();
}
else (function()
{
    var oSummary =
    {
        "Lexer": [],
        "Parser": [],
        "Semant": [],
//        "Generator": [],
    };

    var sLog = "";

    var oChild = require('child_process').spawn(sGitBin, ['log', '--pretty=format:%ci'], {'cwd': sWorkingDir});

    oChild.stderr.on('data', function(data)
    {
        console.log(data);
    });

    oChild.stdout.on('data', function(data)
    {
        sLog += data;
    });

    oChild.on('close', function(code)
    {
        if (code !== 0)
        {
            console.log('process exited with code ' + code);
        }
        else
        {
            var arr = sLog.split("\n");
    
            for (var n = 0; n < arr.length; ++n)
            {
                arr[n] = {"project": "", "date": new Date(arr[n])};

                if (arr[n].date < new Date("2014-04-11"))
                {
                    arr[n].project = "Lexer";
                }
                else if (arr[n].date < new Date("2014-04-25"))
                {
                    arr[n].project = "Parser";
                }
                else if (arr[n].date < new Date("2014-05-15"))
                {
                    arr[n].project = "Semant";
                }
                else
                {
                    arr[n].project = "Generator";
                }
            }

            arr.reverse();
            arr.push({"project":"Semant", "date": new Date("2020-01-01")}); // Simulate a commit in the far future to ensure the last block get processed

            var currentBlock = {commits:0, timeSpent:0.0};

            for (var n = 1; n < arr.length; ++n)
            {
                var nHours = toHours(arr[n-1].date, arr[n].date);

                if (nHours > 4) 
                {
                    // This length of time without a commit implies I didn't spend it coding
                    oSummary[arr[n-1].project].push(currentBlock);
                    currentBlock = {commits:0, timeSpent:0.0};
                }
                else
                {
                    ++currentBlock.commits;
                    currentBlock.timeSpent += arr[n].date - arr[n-1].date;
                }

//                console.log(arr[n-1].project + ": " + nHours);
            }

            // Sum blocks for each project
            for(sProject in oSummary)
            {
                var arr = oSummary[sProject];

                var commits = 0;
                var timeSpent = 0.0;

                arr.forEach(function(block)
                {
                    commits += block.commits;
                    timeSpent += block.timeSpent;
                });

                // The time spent working on the first commit in each block isn't recorded
                // so estimate it as the average time spent on the other commits
                timeSpent += (timeSpent / commits) * arr.length;

                // Convert milliseconds to hours
                timeSpent /= 1000 * 60 * 60;
                timeSpent = Math.round(timeSpent);

                console.log(sProject + " " + timeSpent + " hours");
            }

       }
    });

    function toHours(sStart, sEnd)
    {
        return Math.floor((sEnd - sStart) / (1000.0 * 60.0 * 60.0));
    }

})();

