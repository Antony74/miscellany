
var fs = require('fs');
var child_process = require('child_process');
var readline = require('readline');

var nMaxParallel = 4;
var nActiveBuilds = 0;

var buildProjects = {};
var buildQueue = [];

function queueProject(proj)
{
    if (proj.isQueued == false && proj.depends.length == 0)
    {
        buildQueue.push(proj);
        proj.isQueued = true;
    }
}

function queueDependants(proj)
{
    for (var n = 0; n < proj.usedBy.length; ++n)
    {
        var dependName = proj.usedBy[n];
        var dependantProj = buildProjects[dependName];

        for (var m = 0; m < dependantProj.depends.length; ++m)
        {
            if (dependantProj.depends[m] == proj.name)
            {
                dependantProj.depends.splice(m, 1);
                break;
            }
        }

        queueProject(dependantProj);
    }
}

function buildProject(proj)
{
    ++nActiveBuilds;

    proj.build(function()
    {
        --nActiveBuilds;

        queueDependants(proj);
        serviceBuildQueue();
    });
}

function serviceBuildQueue()
{
    for(;;)
    {
        if (buildQueue.length == 0) break;
        if (nActiveBuilds >= nMaxParallel) return;

        var removed = buildQueue.splice(0, 1);
        buildProject(removed[0]);
    }
}

function build(_buildProjects)
{
    buildProjects = _buildProjects;

    for (var projName in buildProjects)
    {
        proj = buildProjects[projName];
        proj.name = projName;
        proj.isQueued = false;
        proj.usedBy = [];
    }

    for (var projName in buildProjects)
    {
        proj = buildProjects[projName];

        queueProject(proj);

        for (var n = 0; n < proj.depends.length; ++n)
        {
            var dependName = proj.depends[n];
            buildProjects[dependName].usedBy.push(projName);
        }
    }

    serviceBuildQueue();
};

function createCleanFunction(sPath)
{
    function clean(doneCleaning)
    {
        function deleteRecursive(sPath)
        {
            var files = fs.readdirSync(sPath)

            files.forEach(function(file, index)
            {
                var sNewPath = sPath + "/" + file;

                if (fs.statSync(sNewPath).isDirectory())
                {
                    deleteRecursive(sNewPath);
                }
                else
                {
                    fs.unlinkSync(sNewPath);
                }
            });

            fs.rmdirSync(sPath);

        }

        if (fs.existsSync(sPath))
        {
            console.log("Cleaning " + sPath);
            deleteRecursive(sPath);
        }

        doneCleaning();
    };
    
    return clean;
}

function createExecFunction(sPrefix, sCmd, options)
{
    var doExec = function(doneRunning)
    {
        var childProcess = child_process.exec(sCmd, options, function(err)
        {
            rlOut.close();
            rlErr.close();

            if (!err)
            {
                doneRunning();
            }
        });

        var rlOut = readline.createInterface({input: childProcess.stdout, output: process.stdout, terminal: false});
        var rlErr = readline.createInterface({input: childProcess.stderr, output: process.stderr, terminal: false});

        rlOut.on('line', function(sLine)
        {
            console.log(sPrefix + sLine);
        });

        rlErr.on('line', function(sLine)
        {
            console.log(sPrefix + sLine);
        });
    }

    return doExec;
}

exports.build = build;
exports.getMaxParallel = function() {return nMaxParallel;};
exports.setMaxParallel = function(newMax) {nMaxParallel = newMax;};
exports.createCleanFunction = createCleanFunction;
exports.createExecFunction = createExecFunction;
