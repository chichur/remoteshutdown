(function () {
    const VIEWBOX = [500, 500];
    const NS = 'http://www.w3.org/2000/svg';

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

    circle.addEventListener("touchstart", dragAndDrop);
    document.body.appendChild(svg);
})();