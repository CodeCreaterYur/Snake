document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scale = 20;
    const rows = canvas.height / scale;
    const columns = canvas.width / scale;
    let score = 0;
    let paused = false;
    let gameInterval;

    const fruitImage = new Image();
    fruitImage.src = 'xnd.png';

    const eatingSound = new Audio('zv.mp3');

    class Snake {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.xSpeed = scale * 1;
            this.ySpeed = 0;
            this.total = 0;
            this.tail = [];
            this.eating = false;
        }

        draw() {
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x + scale, this.y + scale);
            gradient.addColorStop(0, "#32CD32");
            gradient.addColorStop(1, "#006400");

            for (let i = 0; i < this.tail.length; i++) {
                ctx.fillStyle = gradient;
                ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
            }

            ctx.save();
            ctx.translate(this.x + scale / 2, this.y + scale / 2);
            ctx.scale(1.2, 1.2);

            const fruitNearby = (Math.abs(this.x - fruit.x) < scale && Math.abs(this.y - fruit.y) < scale);

            if (fruitNearby && !this.eating) {
                ctx.fillStyle = gradient;
                ctx.fillRect(-scale / 2, -scale / 2, scale, scale);

                ctx.fillStyle = "#FF0000";
                ctx.fillRect(-scale / 4, scale / 8, scale / 2, scale / 2); 
            } else {
                ctx.fillStyle = gradient;
                ctx.fillRect(-scale / 2, -scale / 2, scale, scale);

                ctx.fillStyle = "#FFFFFF"; 
                ctx.fillRect(-scale / 4, -scale / 4, scale / 6, scale / 6);
                ctx.fillRect(scale / 6, -scale / 4, scale / 6, scale / 6); 
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(-scale / 8, scale / 8, scale / 4, scale / 8);
            }

            ctx.restore();
        }

        update() {
            for (let i = 0; i < this.tail.length - 1; i++) {
                this.tail[i] = this.tail[i + 1];
            }
            this.tail[this.total - 1] = { x: this.x, y: this.y };
            this.x += this.xSpeed;
            this.y += this.ySpeed;

            if (this.x >= canvas.width) {
                this.x = 0;
            }
            if (this.y >= canvas.height) {
                this.y = 0;
            }
            if (this.x < 0) {
                this.x = canvas.width - scale;
            }
            if (this.y < 0) {
                this.y = canvas.height - scale;
            }

            this.checkCollision();
        }

        changeDirection(direction) {
            switch (direction) {
                case 'Up':
                    if (this.ySpeed !== scale * 1) {
                        this.xSpeed = 0;
                        this.ySpeed = -scale * 1;
                    }
                    break;
                case 'Down':
                    if (this.ySpeed !== -scale * 1) {
                        this.xSpeed = 0;
                        this.ySpeed = scale * 1;
                    }
                    break;
                case 'Left':
                    if (this.xSpeed !== scale * 1) {
                        this.xSpeed = -scale * 1;
                        this.ySpeed = 0;
                    }
                    break;
                case 'Right':
                    if (this.xSpeed !== -scale * 1) {
                        this.xSpeed = scale * 1;
                        this.ySpeed = 0;
                    }
                    break;
            }
        }

        eat(fruit) {
            if (this.x === fruit.x && this.y === fruit.y) {
                this.total++;
                score++;
                eatingSound.play();
                return true;
            }
            return false;
        }

        checkCollision() {
            for (let i = 0; i < this.tail.length; i++) {
                if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                    this.total = 0;
                    this.tail = [];
                    score = 0;
                    return;
                }
            }

            if (this.x >= canvas.width || this.y >= canvas.height || this.x < 0 || this.y < 0) {
                this.total = 0;
                this.tail = [];
                score = 0;
            }
        }
    }

    class Fruit {
        constructor() {
            this.x = 0;
            this.y = 0;
        }

        pickLocation() {
            this.x = (Math.floor(Math.random() * rows)) * scale;
            this.y = (Math.floor(Math.random() * columns)) * scale;
        }

        draw() {
            ctx.drawImage(fruitImage, this.x, this.y, scale * 1.5, scale * 1.5);
        }
    }

    let snake = new Snake();
    let fruit = new Fruit();
    fruit.pickLocation();

    function updateGame() {
        if (!paused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            fruit.draw();
            snake.update();
            snake.draw();

            if (snake.eat(fruit)) {
                fruit.pickLocation();
                snake.eating = true; 
                setTimeout(() => { 
                    snake.eating = false;
                }, 200);
            }

            document.querySelector('.score').innerText = snake.total;

            const bestScore = localStorage.getItem('bestScore') || 0;
            if (snake.total > bestScore) {
                localStorage.setItem('bestScore', snake.total);
            }
            document.querySelector('.best-score').innerText = localStorage.getItem('bestScore');
        }
    }

    gameInterval = setInterval(updateGame, 100);

    window.addEventListener('keydown', evt => {
        const direction = evt.key.replace('Arrow', '');
        snake.changeDirection(direction);
    });

    window.addEventListener('beforeunload', () => {
        clearInterval(gameInterval);
    });

window.addEventListener('keydown', evt => {
    if (evt.key === ' ' || evt.key === 'Spacebar') {
        paused = !paused; 
        if (paused) {
            clearInterval(gameInterval);
        } else {
            gameInterval = setInterval(updateGame, 100);
        }
    }
});


    document.getElementById('up').addEventListener('click', function() {
        snake.changeDirection('Up');
    });

    document.getElementById('down').addEventListener('click', function() {
        snake.changeDirection('Down');
    });

    document.getElementById('left').addEventListener('click', function() {
        snake.changeDirection('Left');
    });

    document.getElementById('right').addEventListener('click', function() {
        snake.changeDirection('Right');
    });

    document.querySelector('.menu button').addEventListener('click', () => {
        paused = !paused; 
        if (paused) {
            clearInterval(gameInterval);
        } else {
            gameInterval = setInterval(updateGame, 100);
        }
    });
});
