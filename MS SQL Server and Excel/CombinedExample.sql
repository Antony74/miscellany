DECLARE @directory as varchar(260);
SET @directory = 'd:\ExcelTest\'

IF OBJECT_ID('tempdb..#DirectoryTree') IS NOT NULL
      DROP TABLE #DirectoryTree;

CREATE TABLE #DirectoryTree (
       id int IDENTITY(1,1)
      ,subdirectory nvarchar(512)
      ,depth int
      ,isfile bit);

INSERT #DirectoryTree (subdirectory,depth,isfile) EXEC xp_dirtree 'd:\ExcelTest', 1, 1;

IF OBJECT_ID('SheetInfo') IS NOT NULL
	DROP TABLE SheetInfo;

CREATE TABLE SheetInfo(
	[Filename] varchar(260) PRIMARY KEY NOT NULL,
	FirstCell varchar(255));

DECLARE @cursor as CURSOR;
DECLARE @Filename as varchar(260);
DECLARE @query as varchar(260);

SET @cursor = CURSOR FOR (SELECT subdirectory FROM #DirectoryTree WHERE isfile=1);
OPEN @cursor;

FETCH NEXT FROM @cursor INTO @Filename;

WHILE @@FETCH_STATUS = 0
BEGIN
	SET @query = 'INSERT INTO SheetInfo([Filename], FirstCell) SELECT TOP(1) ''' + @Filename + ''' AS [Filename], F1 AS FirstCell FROM OPENROWSET( '
	+            '	''Microsoft.ACE.OLEDB.12.0'',   '
	+	         '  ''Excel 12.0; HDR=NO; IMEX=1; Database=' + @directory + @Filename + ''','
	+ 	         '  ''SELECT * FROM [Sheet1$]'');';

	EXEC(@query);

    FETCH NEXT FROM @cursor INTO @Filename;
END

CLOSE @cursor;
DEALLOCATE @cursor;

select * from SheetInfo;
