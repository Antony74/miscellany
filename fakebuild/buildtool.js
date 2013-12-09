
var nMaxParallel = 4;
var nActiveBuilds = 0;

var buildProjects = {};
var buildQueue = [];

function createStatusObject()
{
    var NOTBUILDING = 0;
    var QUEUED = 1;
    var BUILDING = 2;
    var BUILT = 3;

    var status =
    {
        value: NOTBUILDING,
        isNotBuilding: function() {return this.value == NOTBUILDING;},
        isQueued:      function() {return this.value == QUEUED;},
        isBuilding:    function() {return this.value == BUILDING;},
        isBuilt:       function() {return this.value == BUILT;},
        setQueued:     function() {this.value = QUEUED;},
        setBuilding:   function() {this.value = BUILDING;},
        setBuilt:      function() {this.value = BUILT;},
    }

    return status;
}

function queueProject(proj)
{
    if (proj.status.isNotBuilding() && proj.depends.length == 0)
    {
        buildQueue.push(proj);
        proj.status.setQueued();
//        console.log(proj.name + " queued");
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

//        console.log("Attempting to queue " + dependantProj.name);
        queueProject(dependantProj);
    }
}

function buildProject(proj)
{
    ++nActiveBuilds;
    console.log("building " + proj.name);
    proj.status.setBuilding();

    proj.build(function()
    {
        --nActiveBuilds;
        console.log("done building " + proj.name);
        proj.status.setBuilt();

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
        proj.status = createStatusObject();
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

exports.build = build;
exports.getMaxParallel = function() {return nMaxParallel;};
exports.setMaxParallel = function(newMax) {nMaxParallel = newMax;};

