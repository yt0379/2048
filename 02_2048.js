//��ά���飺��װ���и����е���ֵ
var cells = [[2, 0, 0, 0],
    				[0, 32, 0, 0],
    				[0, 4, 0, 0],
    				[0, 0, 2048, 0]];
//��Ϸ������
var PLAYING = 0;
//��Ϸ�����ˣ������˾Ͳ�����Ӧ�����¼���
var GAME_OVER = 2;
//����
var score = 0;

//��ǰ��Ϸ״̬
var state = PLAYING;

//Ԫ�ز�ѯ����
function $(id) {
    return document.getElementById(id);
}

//��ʼ��
window.onload = function () {
    $("newGame").onclick = startAction;
    startAction();
};

//��Ϸ��ʼ
function startAction() {
    $("gameOver").style.display = "none";
    //��ʼ������
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            cells[row][col] = 0;
        }
    }
    score = 0;
    //�����������������д�� cells ����
    randomNumber();
    randomNumber();
    //�����������ҳ����ʾ
    updateView();
    state = PLAYING;
}

//�����������һ������
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

//��鵱ǰ�ı�������о������֣��޿հ׸񣩣�������˷���true�����򷵻�false
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

//������ʾ��������е����ݣ����µ�������ʾ
function updateView() {
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            var n = cells[row][col];
            var cell = $("cell" + row + col);
            //�����ʾ�����ݺ���ʾ��ʽ
            cell.className = "cell";
            cell.innerHTML = "";
            if (n > 0) {
                //������ʾ��ʽ
                cell.className = "cell num" + n;
                //������ʾ������
                cell.innerHTML = n;
            }
        }
    }

    $("score").innerHTML = score;
    $("finalScore").innerHTML = score;
}

/*****�����ƶ�����ÿһ����ÿ�����������ƶ����ϲ�*******/

/* ���ϵĶ��� */
function upAction() {
    if (gameOver())
        return;
    if (!canMoveUp()) {
        return;
    }
    //ÿ�δ���һ����
    for (var col = 0; col < 4; col++) {
        //ÿһ������ �ӷŷ����ж��Ƿ���Ҫ�ƶ�����
        upCol(col);
    }
    randomNumber();
    updateView();
}

//�ж��Ƿ���������ƶ�
function canMoveUp() {
    for (var col = 0; col < 4; col++) {
        for (var row = 1; row < 4; row++) {
            //�����Ϸ��ǿ�λ��, �����ƶ�
            if (cells[row][col] != 0 && cells[row - 1][col] == 0) {
                return true;
            }
            //�����Ϸ����ڵ���ȣ������ƶ�
            if (cells[row][col] != 0 && (cells[row][col] == cells[row - 1][col])) {
                return true;
            }
        }
    }
    return false;
}

// ����һ���е��ƶ� 
function upCol(col) {
    //һ�����У����շ��������Ƿ���Ҫ�ϲ�����
    for (var row = 0; row < 4; ) {
        var current = cells[row][col];
        //���ң��������²�����һ������λ��
        var nextRow = getNextInCol(col, row + 1, 1);
        //һ�����꣬û����һ������ֱ�ӽ�����
        if (nextRow == -1) {
            return;
        }
        //����λ���ҵ���һ����
        var next = cells[nextRow][col];

        //��ǰ�ǿո���һ�����ƶ�����ǰλ��
        if (current == 0) {
            //��һ�������ƶ�����ǰλ�á�
            cells[row][col] = next;
            cells[nextRow][col] = 0;
        } else if (current == next) {
            //��������һ�����ͺϲ�����
            cells[row][col] = next + current;
            cells[nextRow][col] = 0;
            score += cells[row][col];
            row++;
        } else {
            //�¸���һ�����ͺ���֮
            row++;
        }
    }
}
//�õ�ĳ������ͬ���ϵ���һ���ǿո��λ�ã�stepΪ1����ʾ�������򣨴������£����ң�Ϊ��1����ʾ�򷴷��򣨴������ϣ�����
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


/***********�����ƶ�********************/
function downAction() {
    if (gameOver())
        return;

    if (!canMoveDown()) {
        return;
    }
    //ÿ�δ���һ����
    for (var col = 0; col < 4; col++) {
        //ÿһ������ �ӷŷ����ж��Ƿ���Ҫ�ƶ�����
        downCol(col);
    }
    randomNumber();
    updateView();
}

//�Ƿ���������ƶ�
function canMoveDown() {
    for (var col = 0; col < 4; col++) {
        for (var row = 0; row < 3; row++) {
            //�����·��ǿ�λ��, �����ƶ�
            if (cells[row][col] != 0 && cells[row + 1][col] == 0) {
                return true;
            }
            //�����·����ڵ���ȣ������ƶ�
            if (cells[row][col] != 0 && (cells[row][col] == cells[row + 1][col])) {
                return true;
            }
        }
    }
    return false;
}

// ����һ���е������ƶ�
function downCol(col) {
    //һ�����У����շ��������Ƿ���Ҫ�ϲ�����
    for (var row = 3; row >= 0; ) {
        var current = cells[row][col];
        var nextRow = getNextInCol(col, row - 1, -1);
        //û����һ������ֱ�ӽ�����
        if (nextRow == -1) {
            return;
        }
        var next = cells[nextRow][col];

        if (current == 0) {
            //��һ�������ƶ�����ǰλ�á�
            cells[row][col] = next;
            cells[nextRow][col] = 0;
        } else if (current == next) {
            //��������һ�����ͺϲ�����
            cells[row][col] = next + current;
            cells[nextRow][col] = 0;
            score += cells[row][col];
            row--;
        } else {
            //�¸���һ�����ͺ���֮
            row--;
        }
    }
}

/************�����ƶ�*******************/
function leftAction() {
    if (gameOver())
        return;

    if (!canMoveLeft()) {
        return;
    }
    //ÿ�δ���һ����
    for (var row = 0; row < 4; row++) {
        //ÿһ������ �ӷŷ����ж��Ƿ���Ҫ�ƶ�����
        moveLeft(row);
    }
    randomNumber();
    updateView();
}

//�Ƿ���������ƶ�
function canMoveLeft() {
    for (var col = 1; col < 4; col++) {
        for (var row = 0; row < 4; row++) {
            //��������ǿ�λ��, �����ƶ�
            console.log(cells[row][col] + "," + cells[row][col-1]);
            if (cells[row][col] != 0 && cells[row][col - 1] == 0) {
                return true;
            }
            //����������ڵ���ȣ������ƶ�
            if (cells[row][col] != 0 && (cells[row][col] == cells[row][col - 1])) {
                return true;
            }
        }
    }
    return false;
}

// ����һ���е������ƶ�
function moveLeft(row) {
    //һ�����У����շ��������Ƿ���Ҫ�ϲ�����
    for (var col = 0; col < 4; ) {
        var current = cells[row][col];
        var nextCol = getNextInRow(row, col + 1, 1);
        //û����һ������ֱ�ӽ�����
        if (nextCol == -1) {
            return;
        }
        var next = cells[row][nextCol];

        if (current == 0) {
            //��һ�������ƶ�����ǰλ�á�
            cells[row][col] = next;
            cells[row][nextCol] = 0;
        } else if (current == next) {
            //��������һ�����ͺϲ�����
            cells[row][col] = next + current;
            cells[row][nextCol] = 0;
            score += cells[row][col];
            col++;
        } else {
            //�¸���һ�����ͺ���֮
            col++;
        }
    }
}

//�õ�ĳ������ͬ���ϵ���һ���ǿո��λ�ã�stepΪ1����ʾ�������򣨴������ң����ң�Ϊ��1����ʾ�򷴷��򣨴������󣩲���
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

/***********�����ƶ�********************/
function rightAction() {
    if (gameOver())
        return;
    if (!canMoveRight()) {
        return;
    }
    //ÿ�δ���һ����
    for (var row = 0; row < 4; row++) {
        //ÿһ�������ж��Ƿ���Ҫ�ƶ�����
        moveRight(row);
    }
    randomNumber();
    updateView();
}

//�Ƿ���������ƶ�
function canMoveRight() {
    for (var col = 0; col < 3; col++) {
        for (var row = 0; row < 4; row++) {
            //�����ҷ��ǿ�λ��, �����ƶ�
            if (cells[row][col] != 0 && cells[row][col + 1] == 0) {
                return true;
            }
            //�����ҷ����ڵ���ȣ������ƶ�
            if (cells[row][col] != 0 && (cells[row][col] == cells[row][col + 1])) {
                return true;
            }
        }
    }
    return false;
}

// ����һ���е��ƶ�
function moveRight(row) {
    //һ�����У�����Ƿ���Ҫ�ϲ�����
    for (var col = 3; col >= 0; ) {
        var current = cells[row][col];
        var nextCol = getNextInRow(row, col - 1, -1);
        //û����һ������ֱ�ӽ�����
        if (nextCol == -1) {
            return;
        }
        var next = cells[row][nextCol];

        if (current == 0) {
            //��һ�������ƶ�����ǰλ�á�
            cells[row][col] = next;
            cells[row][nextCol] = 0;
        } else if (current == next) {
            //��������һ�����ͺϲ�����
            cells[row][col] = next + current;
            cells[row][nextCol] = 0;
            score += cells[row][col];
            col--;
        } else {
            //�¸���һ�����ͺ���֮
            col--;
        }
    }
}


/* ��ʾ��Ϸ�������� */
function gameOver() {
    //���ֿ�λ�ã���Ϸ������    	
    if (!full()) {
        return false;
    }

    //�ܹ��ƶ���Ϸ������
    if (canMoveUp() || canMoveDown() || canMoveLeft() || canMoveRight()) {
        return false;
    }
    state = GAME_OVER;
    $("gameOver").style.display = "block";
    return true;
}