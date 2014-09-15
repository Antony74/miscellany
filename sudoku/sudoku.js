
var puzzle = [
    [0,0,0, 0,0,0, 5,9,0],
    [0,0,4, 3,0,0, 0,2,6],
    [0,2,1, 0,4,0, 0,0,7],

    [0,7,0, 6,9,0, 0,0,0],
    [0,0,3, 5,0,7, 6,0,0],
    [0,0,0, 0,8,1, 0,5,0],

    [6,0,0, 0,1,0, 3,8,0],
    [9,3,0, 0,0,5, 4,0,0],
    [0,5,8, 0,0,0, 0,0,0],
];

var createNewCell = function(_value)
{
    function Cell()
    {
        this.value = _value;
        this.possible = _value ? [_value] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    return new Cell;
}

$(document).ready(function()
{
    for (var y = 1; y <= 9; ++y)
    {
        for (var x = 1; x <= 9; ++x)
        {
            var cellValue = puzzle[y - 1][x - 1];

            if (cellValue == 0)
            {
                cellValue = "";
            }

            $("#sudoku tr:nth-child(" + y + ") td:nth-child(" + x + ")").append(cellValue);
        }
    }
});

