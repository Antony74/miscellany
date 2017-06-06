
// Unless it already exists, create an example text database

var fso = WScript.CreateObject("Scripting.FileSystemObject");

if (!fso.FolderExists('txtFilesFolder')) {
    fso.CreateFolder('txtFilesFolder');
}

if (!fso.FileExists('txtFilesFolder/myTable.txt')) {
    var file = fso.CreateTextFile('txtFilesFolder/myTable.txt');
    file.WriteLine('Name,Apples,Oranges');
    file.WriteLine('Alice,4,1');
    file.WriteLine('Bob,2,3');
    file.Close();
}

// Query the myTable table using ADO

var connectionString = 'Provider=Microsoft.ACE.OLEDB.12.0;Data Source="' + fso.GetAbsolutePathName('txtFilesFolder') + '";';
connectionString    += 'Extended Properties="text;HDR=Yes;FMT=Delimited";'

var conn = new ActiveXObject('ADODB.Connection');
var rs = new ActiveXObject('ADODB.Recordset');

conn.Open(connectionString);
rs.Open("SELECT * FROM myTable.txt", conn, 0, 1);

// Prove the query has worked
rs.MoveFirst();
WScript.Echo(rs.Fields.Item('Name').Value + ' has ' + rs.Fields('Apples') + ' apples');

var props = rs.Fields.Item('Name').Properties;
WScript.Echo('This information has come from the "' + props.Item('BASETABLENAME') + '" table');

rs.Close();
conn.Close();

