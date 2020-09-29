document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const boxes = document.querySelectorAll('.grid div');
    const scoreBoard = document.querySelector('#score-board');
    const message = document.querySelector('#message-board');

    var shooterPosition = [240, 221, 241, 242];
    for (let i = 0; i < 4; i++) {
        boxes[shooterPosition[i]].classList.add('shooter');
    }

    const alienInvaders = [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23, 24, 25, 26, 27, 40, 41, 42, 43, 44, 45, 46, 47];
    for (let i = 0; i < alienInvaders.length; i++) {
        boxes[alienInvaders[i]].classList.add('invader');
    }

    const downInvaders = [];

    const width = 20;
    var score = 0;
    var direction = 1;
    var fireId;

    var firePosition = shooterPosition[1] - width;

    //This controls the Movement of the Shooter Horizontally

    function moveShooter(event) {
        switch (event.keyCode) {
            case 39: //Right Arrow Key
                for (let i = 3; i >= 0; i--) {
                    if ((shooterPosition[i] % width) === (width - 1)) break;
                    boxes[shooterPosition[i]].classList.remove('shooter')
                    shooterPosition[i] += 1;
                    boxes[shooterPosition[i]].classList.add('shooter');
                }
                break;

            case 37: //Left Arrow Key
                for (let i = 0; i < 4; i++) {
                    if ((shooterPosition[i] % width) === 0) break;
                    boxes[shooterPosition[i]].classList.remove('shooter')
                    shooterPosition[i] -= 1;
                    boxes[shooterPosition[i]].classList.add('shooter');
                }
                break;
        }
    }
    document.addEventListener('keyup', moveShooter);


    //This controls the movement of the invaders

    function moveInvaders() {
        let lastRight, lastLeft;

        lastLeft = ((alienInvaders[0] % width) === 0);
        lastRight = ((alienInvaders[alienInvaders.length - 1] % width) === (width - 1));

        if ((lastLeft && direction === -1) || (lastRight && direction === 1)) {
            direction = width;
        } else if (direction === width) {
            if (lastLeft) direction = 1;
            else if (lastRight) direction = -1;
        }

        for (let i = 0; i < alienInvaders.length; i++)
            boxes[alienInvaders[i]].classList.remove('invader');
        for (let i = 0; i < alienInvaders.length; i++)
            alienInvaders[i] += direction;
        for (let i = 0; i < alienInvaders.length; i++) {
            if (!downInvaders.includes(i))
                boxes[alienInvaders[i]].classList.add('invader');
        }

        if (boxes[shooterPosition[1]].classList.contains('invader', 'shooter')) {
            message.textContent = `GAME OVER !`;
            boxes[shooterPosition[1]].classList.add('shot');
            gameOver();
        }
        if (alienInvaders.length === downInvaders.length) {
            message.textContent = `YOU WIN !!`;
            gameOver();
        }
    }

    let invadersId = setInterval(moveInvaders, 100);


    function gameOver() {
        clearInterval(invadersId);
        document.removeEventListener('keydown', fireShooter);
        document.removeEventListener('keyup', moveShooter);
        setInterval(alienInvaders.forEach(alien => boxes[alien].classList.add('invader-fade')),500);
    }

    //This controls the firing of the shooter  

    function moveFire() {

        if (boxes[firePosition].classList.contains('fire'))
            boxes[firePosition].classList.remove('fire');
        if (boxes[firePosition].classList.contains('shot'))
            boxes[firePosition].classList.remove('shot');
        firePosition -= width;
        boxes[firePosition].classList.add('fire');

        if (boxes[firePosition].classList.contains('invader')) {
            boxes[firePosition].classList.remove('fire');
            boxes[firePosition].classList.remove('invader');
            boxes[firePosition].classList.add('shot');
            setTimeout(() => boxes[firePosition].classList.remove('shot'), 200)
            clearInterval(fireId);

            downInvaders.push(alienInvaders.indexOf(firePosition))
            score++;
            scoreBoard.textContent = score;
        }
        if (firePosition < width) {
            clearInterval(fireId)
            setTimeout(() => boxes[firePosition].classList.remove('fire'), 100)
        }
    }


    function fireShooter() {
        firePosition = shooterPosition[1] - width;
        if (event.keyCode === 32)
            fireId = setInterval(moveFire, 100);
    }

    document.addEventListener('keydown', fireShooter);


   // boxes.forEach(box => box.classList.add('grid-cells'))
});