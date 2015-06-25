SELECT * FROM OPENROWSET( 
                'Microsoft.ACE.OLEDB.12.0',
                 'Excel 12.0; HDR=YES; IMEX=1; Database=d:\ExcelTest\test1.xlsx',
                 'SELECT * FROM [Sheet1$]');
