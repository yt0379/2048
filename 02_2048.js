//二维数组：封装所有格子中的数值
var cells = [[2, 0, 0, 0],
    				[0, 32, 0, 0],
    				[0, 4, 0, 0],
    				[0, 0, 2048, 0]];
//游戏进行中
var PLAYING = 0;
//游戏结束了，结束了就不能响应键盘事件了
var GAME_OVER = 2;
//分数
var score = 0;

//当前游戏状态
var state = PLAYING;

//元素查询方法
function $(id) {
    return document.getElementById(id);
}

//初始化
window.onload = function () {
    $("newGame").onclick = startAction;
    startAction();
};

//游戏开始
function startAction() {
    $("gameOver").style.display = "none";
    //初始化格子
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            cells[row][col] = 0;
        }
    }
    score = 0;
    //产生两个随机数，并写入 cells 数组
    randomNumber();
    randomNumber();
    //根据数组更新页面显示
    updateView();
    state = PLAYING;
}

//向表格随机插入一个数字
function randomNumber() {
    if (full()) {
        return;
    }
    while (true) {
        var col = parseInt(Math.random() * 4);
        var row = parseInt(Math.random() * 4);
        if (cells[row][col] == 0) {
            var n = Math.random() < 0.5 ? 2 : 4;
            cells[row][col] = n;
            break;
        }
    }
}

//检查当前的表格中是有均有数字（无空白格），如果满了返回true，否则返回false
function full() {
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            if (cells[row][col] == 0) {
                return false;
            }
        }
    }
    return true;
}

//更新显示，将表格中的数据，更新到界面显示
function updateView() {
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            var n = cells[row][col];
            var cell = $("cell" + row + col);
            //清除显示的数据和显示样式
            cell.className = "cell";
            cell.innerHTML = "";
            if (n > 0) {
                //更新显示样式
                cell.className = "cell num" + n;
                //更新显示的数字
                cell.innerHTML = n;
            }
        }
    }

    $("score").innerHTML = score;
    $("finalScore").innerHTML = score;
}

/*****向上移动：将每一列中每个格子向上移动，合并*******/

/* 向上的动作 */
function upAction() {
    if (gameOver())
        return;
    if (!canMoveUp()) {
        return;
    }
    //每次处理一个列
    for (var col = 0; col < 4; col++) {
        //每一个列中 从放方向判断是否需要移动处理
        upCol(col);
    }
    randomNumber();
    updateView();
}

//判断是否可以向上移动
function canMoveUp() {
    for (var col = 0; col < 4; col++) {
        for (var row = 1; row < 4; row++) {
            //格子上方是空位置, 可以移动
            if (cells[row][col] != 0 && cells[row - 1][col] == 0) {
                return true;
            }
            //格子上方相邻的相等，可以移动
            if (cells[row][col] != 0 && (cells[row][col] == cells[row - 1][col])) {
                return true;
            }
        }
    }
    return false;
}

// 处理一个列的移动 
function upCol(col) {
    //一个列中，按照方方向检查是否需要合并处理。
    for (var row = 0; row < 4; ) {
        var current = cells[row][col];
        //查找：从上往下查找下一个数的位置
        var nextRow = getNextInCol(col, row + 1, 1);
        //一列找完，没有下一个，就直接结束了
        if (nextRow == -1) {
            return;
        }
        //根据位置找到下一个数
        var next = cells[nextRow][col];

        //当前是空格：下一个数移动到当前位置
        if (current == 0) {
            //下一个格子移动到当前位置。
            cells[row][col] = next;
            cells[nextRow][col] = 0;
        } else if (current == next) {
            //两个格子一样，就合并格子
            cells[row][col] = next + current;
            cells[nextRow][col] = 0;
            score += cells[row][col];
            row++;
        } else {
            //下个不一样，就忽略之
            row++;
        }
    }
}
//得到某个格子同列上的下一个非空格的位置：step为1，表示向正方向（从上向下）查找；为－1，表示向反方向（从下向上）查找
function getNextInCol(col, startRow, step) {
    var row = startRow;
    while (true) {
        if (row < 0 || row >= 4) {
            return -1;
        }
        if (cells[row][col] != 0) {
            return row;
        }
        row += step;
    }
}


/***********向下移动********************/
function downAction() {
    if (gameOver())
        return;

    if (!canMoveDown()) {
        return;
    }
    //每次处理一个列
    for (var col = 0; col < 4; col++) {
        //每一个列中 从放方向判断是否需要移动处理
        downCol(col);
    }
    randomNumber();
    updateView();
}

//是否可以向下移动
function canMoveDown() {
    for (var col = 0; col < 4; col++) {
        for (var row = 0; row < 3; row++) {
            //格子下方是空位置, 可以移动
            if (cells[row][col] != 0 && cells[row + 1][col] == 0) {
                return true;
            }
            //格子下方相邻的相等，可以移动
            if (cells[row][col] != 0 && (cells[row][col] == cells[row + 1][col])) {
                return true;
            }
        }
    }
    return false;
}

// 处理一个列的向下移动
function downCol(col) {
    //一个列中，按照方方向检查是否需要合并处理。
    for (var row = 3; row >= 0; ) {
        var current = cells[row][col];
        var nextRow = getNextInCol(col, row - 1, -1);
        //没有下一个，就直接结束了
        if (nextRow == -1) {
            return;
        }
        var next = cells[nextRow][col];

        if (current == 0) {
            //下一个格子移动到当前位置。
            cells[row][col] = next;
            cells[nextRow][col] = 0;
        } else if (current == next) {
            //两个格子一样，就合并格子
            cells[row][col] = next + current;
            cells[nextRow][col] = 0;
            score += cells[row][col];
            row--;
        } else {
            //下个不一样，就忽略之
            row--;
        }
    }
}

/************向左移动*******************/
function leftAction() {
    if (gameOver())
        return;

    if (!canMoveLeft()) {
        return;
    }
    //每次处理一个行
    for (var row = 0; row < 4; row++) {
        //每一个行中 从放方向判断是否需要移动处理
        moveLeft(row);
    }
    randomNumber();
    updateView();
}

//是否可以向左移动
function canMoveLeft() {
    for (var col = 1; col < 4; col++) {
        for (var row = 0; row < 4; row++) {
            //格子左侧是空位置, 可以移动
            console.log(cells[row][col] + "," + cells[row][col-1]);
            if (cells[row][col] != 0 && cells[row][col - 1] == 0) {
                return true;
            }
            //格子左侧相邻的相等，可以移动
            if (cells[row][col] != 0 && (cells[row][col] == cells[row][col - 1])) {
                return true;
            }
        }
    }
    return false;
}

// 处理一个行的向左移动
function moveLeft(row) {
    //一个列中，按照方方向检查是否需要合并处理。
    for (var col = 0; col < 4; ) {
        var current = cells[row][col];
        var nextCol = getNextInRow(row, col + 1, 1);
        //没有下一个，就直接结束了
        if (nextCol == -1) {
            return;
        }
        var next = cells[row][nextCol];

        if (current == 0) {
            //下一个格子移动到当前位置。
            cells[row][col] = next;
            cells[row][nextCol] = 0;
        } else if (current == next) {
            //两个格子一样，就合并格子
            cells[row][col] = next + current;
            cells[row][nextCol] = 0;
            score += cells[row][col];
            col++;
        } else {
            //下个不一样，就忽略之
            col++;
        }
    }
}

//得到某个格子同行上的下一个非空格的位置：step为1，表示向正方向（从左向右）查找；为－1，表示向反方向（从右向左）查找
function getNextInRow(row, startCol, step) {
    var col = startCol;
    while (true) {
        if (col < 0 || col >= 4) {
            return -1;
        }
        if (cells[row][col] != 0) {
            return col;
        }
        col += step;
    }
}

/***********向右移动********************/
function rightAction() {
    if (gameOver())
        return;
    if (!canMoveRight()) {
        return;
    }
    //每次处理一个行
    for (var row = 0; row < 4; row++) {
        //每一个行中判断是否需要移动处理
        moveRight(row);
    }
    randomNumber();
    updateView();
}

//是否可以向右移动
function canMoveRight() {
    for (var col = 0; col < 3; col++) {
        for (var row = 0; row < 4; row++) {
            //格子右方是空位置, 可以移动
            if (cells[row][col] != 0 && cells[row][col + 1] == 0) {
                return true;
            }
            //格子右方相邻的相等，可以移动
            if (cells[row][col] != 0 && (cells[row][col] == cells[row][col + 1])) {
                return true;
            }
        }
    }
    return false;
}

// 处理一个行的移动
function moveRight(row) {
    //一个列中，检查是否需要合并处理。
    for (var col = 3; col >= 0; ) {
        var current = cells[row][col];
        var nextCol = getNextInRow(row, col - 1, -1);
        //没有下一个，就直接结束了
        if (nextCol == -1) {
            return;
        }
        var next = cells[row][nextCol];

        if (current == 0) {
            //下一个格子移动到当前位置。
            cells[row][col] = next;
            cells[row][nextCol] = 0;
        } else if (current == next) {
            //两个格子一样，就合并格子
            cells[row][col] = next + current;
            cells[row][nextCol] = 0;
            score += cells[row][col];
            col--;
        } else {
            //下个不一样，就忽略之
            col--;
        }
    }
}


/* 显示游戏结束界面 */
function gameOver() {
    //发现空位置，游戏不结束    	
    if (!full()) {
        return false;
    }

    //能够移动游戏不结束
    if (canMoveUp() || canMoveDown() || canMoveLeft() || canMoveRight()) {
        return false;
    }
    state = GAME_OVER;
    $("gameOver").style.display = "block";
    return true;
}