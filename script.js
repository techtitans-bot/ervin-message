
const COLORS = ['#87CEEB', '#4FC3F7', '#2196F3', '#1565C0', '#0D47A1'];

const MESSAGE = `Hi Bess/Vin,
One word to say: "SALAMAT" for some moments na mga pag-uroropod ta. You don't know how happy I am na nakaka-upod ko ikaw sa circle. You know that I'm very happy and thankful during those moments. Aram ko man na nafe-feel mo ako, I mean na may something saakon pag-abot saimo kay minsan di maiwasan magboka an mga EA haha.
Oo may mga times na naga-wait ako san chance hehe. Aram ina ninda Lou, even though na may jowa ka, and damo man ga-chat kag naga-try makipag-communicate with me, but I still choose the things that I have, like my circle of friends, kay they really make me happy naman. I don't know, pero I feel a much deeper affection for you, kay daw palapit na palapit kita sa kada usad, nakaka-bardagulan na. Na dati iwas na iwas ako kay naunahan san kaaluhan. But for now, siguro malinaw na saakon na hanggang friends nalang kag irinom HAHAHAHA.
And one thing, sorry to say, na ako an nag-kiss saimo sidto na gina para pirit ko ikaw magbalik sa inuman. As far as I know, mata ka pa sadto huhu kay gin-holding hands ko pa ikaw 😭. Aram man idtu ninda Lou, Ian, Zyra, kag Candy. Sa tuod lang, naloka ako san chats mo sa GC kay naga-hula ka pa kung sino an nag-kiss HAHAHA.
Sorry talaga, Vin. Gusto ko lang mag-sorry kay basi naka-feel ka san discomfort o kabastosan dahil sadto. Pero gusto ko lang ipaabot na wara gaud ako san iba na intensyon. Genuine man adto kag wara halo na malisya. Siguro naging way ko lang adto san pag-appreciate kag pagpasalamat sa tawo na naging importante man saakon. Pero bisan nano paman, sorry gihapon kay dapat mas naging careful ako. Sana wara ka lang nag isip san ano man na bad feeling dahil sadto. 🫶😣
Wara, amo lang. Insabi ko lang ini kay basi magsabog ako kakaisip kag kaka-overthink san kung ano-ano. Basta, salamat gaud sa tanan na moments, bardagulan, kag pag-upod. Dako man an naging impact mo saakon bisan siguro di mo aram.
SALAMAT SAN DAMO DAMO, VIN. 🫶🩵`;

const introScreen = document.getElementById('introScreen');
const openBtn = document.getElementById('openBtn');
const cardScreen = document.getElementById('cardScreen');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cursorTrail = document.getElementById('cursorTrail');
const audio = document.getElementById('bgMusic');
const typeText = document.getElementById('typewriterText');
const musicToggle = document.getElementById('musicToggle');

let isPlaying = false;
let hearts = [];
let bgHearts = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Heart {
    constructor(x, y, isExplosion = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || canvas.height + 10;
        this.size = Math.random() * 15 + 5;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.opacity = 1;
        this.isExplosion = isExplosion;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.isExplosion) {
            this.speedY += 0.02;
            this.opacity -= 0.01;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, this.size / 2);
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size * 1.5, this.size / 4, 0, this.size);
        ctx.bezierCurveTo(this.size * 1.5, this.size / 4, this.size / 2, -this.size / 2, 0, this.size / 2);
        ctx.fill();
        ctx.restore();
    }
}

function createExplosion() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 150; i++) {
        const angle = (Math.PI * 2 / 150) * i;
        const velocity = Math.random() * 5 + 2;
        const x = centerX + Math.cos(angle) * velocity * 10;
        const y = centerY + Math.sin(angle) * velocity * 10;
        hearts.push(new Heart(x, y, true));
    }

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            hearts.push(new Heart(null, canvas.height - 50, false));
        }, i * 30);
    }
}

function spawnBgHeart() {
    if (bgHearts.length < 15) {
        bgHearts.push(new Heart(null, canvas.height + 10, false));
    }
}

setInterval(spawnBgHeart, 2000);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bgHearts = bgHearts.filter(h => h.y > -50);
    bgHearts.forEach(h => {
        h.update();
        h.draw();
    });

    hearts = hearts.filter(h => h.opacity > 0);
    hearts.forEach(h => {
        h.update();
        h.draw();
    });

    requestAnimationFrame(animate);
}
animate();

document.addEventListener('mousemove', (e) => {
    cursorTrail.style.left = e.clientX + 'px';
    cursorTrail.style.top = e.clientY + 'px';
});

let charIndex = 0;
let lines = MESSAGE.split('\n');

function typeWriter() {
    if (charIndex < lines.length) {
        let currentLine = lines[charIndex];
        
        if (charIndex > 0) {
            typeText.innerHTML += '<br><br>';
        }
        
        let lineCharIndex = 0;
        
        function typeLine() {
            if (lineCharIndex < currentLine.length) {
                typeText.innerHTML += currentLine.charAt(lineCharIndex);
                lineCharIndex++;
                setTimeout(typeLine, 40);
            } else {
                charIndex++;
                setTimeout(typeWriter, 500);
            }
        }
        
        typeLine();
    }
}

openBtn.addEventListener('click', () => {
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.style.display = 'none';
    }, 1000);

    createExplosion();

    setTimeout(() => {
        cardScreen.classList.add('visible');
        typeWriter();
    }, 3000);

    audio.play().then(() => {
        isPlaying = true;
        musicToggle.textContent = '⏸';
    }).catch(err => {
        console.log('Music play failed. Check your audio file.');
    });
});

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        musicToggle.textContent = '🎵';
        isPlaying = false;
    } else {
        audio.play();
        musicToggle.textContent = '⏸';
        isPlaying = true;
    }
});