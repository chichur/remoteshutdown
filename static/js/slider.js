const url = 'ws://' + window.origin.split(':').slice(1,2).join(':') + ':1337'
let socket = new WebSocket(url);

(function () {
    const VIEWBOX = [500, 500];
    const NS = 'http://www.w3.org/2000/svg';
    const ACCELERATE = 0.06;

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    svg.setAttribute('viewBox', `0 0 ${VIEWBOX.join(' ')}`);
    let point = svg.createSVGPoint();

    const lcircle = document.createElementNS(NS, 'circle');
    lcircle.setAttribute('stroke', null);
    lcircle.setAttribute('fill', '#e6e6e6');
    lcircle.setAttribute('cx',"100");
    lcircle.setAttribute('cy',"500");
    lcircle.setAttribute('r', '70');
    svg.appendChild(lcircle);

    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('stroke', null);
    rect.setAttribute('fill', '#e6e6e6');
    rect.setAttribute('x',"100");
    rect.setAttribute('y',"430");
    rect.setAttribute('width', '300');
    rect.setAttribute('height', '140');
    svg.appendChild(rect);

    const rcircle = document.createElementNS(NS, 'circle');
    rcircle.setAttribute('stroke', null);
    rcircle.setAttribute('fill', '#e6e6e6');
    rcircle.setAttribute('cx',"400");
    rcircle.setAttribute('cy',"500");
    rcircle.setAttribute('r', '70');
    svg.appendChild(rcircle);

    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('stroke', null);
    circle.setAttribute('fill', '#b1f574');
    circle.setAttribute('cx',"100");
    circle.setAttribute('cy',"500");
    circle.setAttribute('r', '60');
    svg.appendChild(circle)

    const trect = document.createElementNS(NS, 'rect');
    trect.setAttribute('stroke', null);
    trect.setAttribute('fill', '#e6e6e6');
    trect.setAttribute('x',"100");
    trect.setAttribute('y',"250");
    trect.setAttribute('width', '300');
    trect.setAttribute('height', '140');
    svg.appendChild(trect);

    const lbtn = document.createElementNS(NS, 'rect');
    lbtn.setAttribute('stroke', null);
    lbtn.setAttribute('fill', '#b1f574');
    lbtn.setAttribute('x',"110");
    lbtn.setAttribute('y',"260");
    lbtn.setAttribute('width', '135');
    lbtn.setAttribute('height', '120');
    svg.appendChild(lbtn);

    const rbtn = document.createElementNS(NS, 'rect');
    rbtn.setAttribute('stroke', null);
    rbtn.setAttribute('fill', '#b1f574');
    rbtn.setAttribute('x',"255");
    rbtn.setAttribute('y',"260");
    rbtn.setAttribute('width', '135');
    rbtn.setAttribute('height', '120');
    svg.appendChild(rbtn);

    const tcircle = document.createElementNS(NS, 'circle');
    tcircle.setAttribute('stroke', null);
    tcircle.setAttribute('fill', '#e6e6e6');
    tcircle.setAttribute('cx',"250");
    tcircle.setAttribute('cy',"100");
    tcircle.setAttribute('r', '110');
    svg.appendChild(tcircle)

    const joystick = document.createElementNS(NS, 'circle');
    joystick.setAttribute('stroke', null);
    joystick.setAttribute('fill', '#b1f574');
    joystick.setAttribute('cx',"250");
    joystick.setAttribute('cy',"100");
    joystick.setAttribute('r', '60');
    svg.appendChild(joystick)

    const dragAndDrop = (startEvent) => {
        startEvent.preventDefault();
        let lastPoint = null;

        const drag = (event) => {
            event.preventDefault();
            point.x = event.touches[0].clientX;
	        point.y = event.touches[0].clientY;
            point = point.matrixTransform(svg.getScreenCTM().inverse());
            lastPoint = point;
            if (point.x <= 100)
                circle.setAttribute('cx', 100);
            else if (point.x >= 400) {
                circle.setAttribute('cx', 400);
                circle.setAttribute('fill', '#ff2400');
                svg.removeEventListener("touchmove", drag);
                svg.removeEventListener("touchend", drop);
                circle.removeEventListener("touchstart", dragAndDrop);
                fetch('/shutdown');
            }
            else
                circle.setAttribute('cx', point.x);
        };

        const dropBack = (startX) => {
            let start = null;
            let x = startX;

            function animate(timestamp) {
                if (!start) start = timestamp;
                let time = (timestamp - start) / 1000;
                x -= (startX * 2 * Math.pow(time, 2)) / 2;
                circle.setAttribute('cx', x);
                if (x >= 100)
                    window.requestAnimationFrame(animate)
                else
                    circle.setAttribute('cx', 100);
            }

            window.requestAnimationFrame(animate);
        }

        const drop = (event) => {
            event.preventDefault();
            dropBack(lastPoint.x)
            svg.removeEventListener("touchmove", drag);
            svg.removeEventListener("touchend", drop);
        };

        svg.addEventListener("touchmove", drag);
        svg.addEventListener("touchend", drop);
    }
    
    const dragAndDropJoyStick = (startEvent) => {
        startEvent.preventDefault();
        let lastPoint = null;

        let intervalId = setInterval(() => {
            if (lastPoint !== null) {
                const dx = Math.floor(Math.exp(Math.abs(lastPoint.x * ACCELERATE)) - 1) * Math.sign(lastPoint.x),
                      dy = Math.floor(Math.exp(Math.abs(lastPoint.y * ACCELERATE)) - 1) * Math.sign(lastPoint.y);
                socket.send(dx + " " + dy);
            }   
        }, 10);

        const drag = (event) => {
            event.preventDefault();
            point.x = event.touches[0].clientX;
	        point.y = event.touches[0].clientY;
            point = point.matrixTransform(svg.getScreenCTM().inverse());
            lastPoint = point;
            
            if (Math.sqrt(Math.pow(point.x - 250, 2) + Math.pow(point.y - 100, 2)) >= 50){
                if (Math.abs(point.x - 250) > Math.abs(point.y - 100)){
                    relation = Math.atan(Math.abs(point.y - 100) / Math.abs(point.x - 250))
                    const x = 50 * Math.cos(relation) * Math.sign(point.x - 250);
                    const y = 50 * Math.sin(relation) * Math.sign(point.y - 100);
                    joystick.setAttribute('cx', 250 + x);
                    joystick.setAttribute('cy', 100 + y);
                    lastPoint.x = x;
                    lastPoint.y = y;
                } else {
                    relation = Math.atan(Math.abs(point.x - 250) / Math.abs(point.y - 100))
                    const x = 50 * Math.sin(relation) * Math.sign(point.x - 250);
                    const y = 50 * Math.cos(relation) * Math.sign(point.y - 100);
                    joystick.setAttribute('cx', 250 + x);
                    joystick.setAttribute('cy', 100 + y);
                    lastPoint.x = x;
                    lastPoint.y = y;
                }
            } else {
                joystick.setAttribute('cx', point.x);
                joystick.setAttribute('cy', point.y);
                lastPoint.x = point.x - 250;
                lastPoint.y = point.y - 100;
            }

            
        };

        const drop = (event) => {
            event.preventDefault();
            clearInterval(intervalId)
            joystick.setAttribute('cx',"250");
            joystick.setAttribute('cy',"100");
            svg.removeEventListener("touchmove", drag);
            svg.removeEventListener("touchend", drop);
        };

        svg.addEventListener("touchmove", drag);
        svg.addEventListener("touchend", drop);
    }

    const leftButtonClick = (event) => {
        event.preventDefault();
        socket.send('l')
        lbtn.addEventListener("click", )
    }

    lbtn.addEventListener("click", (event) => socket.send('l'));
    rbtn.addEventListener("click", (event) => socket.send('r'));
    circle.addEventListener("touchstart", dragAndDrop);
    joystick.addEventListener("touchstart", dragAndDropJoyStick);
    document.body.appendChild(svg);
})();