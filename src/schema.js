const slide = {
    duration: 700,
    autoPass: true,
    content: [
        {
            type: "text",
            cls: "sumeo",
            css: ".sumeo.pre { transform-origin: bottom }",
            text: "hi elomalo",
            states: [{ 
                x: 45,
                y: 20,
                scale: 0,
                color: "#eeeeee",
                transitions: {
                    scale: [ 120, 0, 0, 1, 1 ],
                    x: [ 200, 0.2, 0.3, 0.8, 1.2 ],
                },
            }, {
                scale: 1,
            }, {
                x: 60,
                opacity: 0,
                transitions: {
                    scale: [ 200, 0, 0, 1, 1 ],
                    x: [ 300, 0.2, 0.3, 0.8, 1.2 ],
                },
            }]

        },
        {
            type: "img",
            cls: "car",
            src: "IMG_2407142239.jpg",
            css: "car.post { filter: blur(3px) }",
            states: [{
                scale: 0,
            }, {
                scale: 1,
            }, { 
                scale: 0,
            }]
        }

    ]
}

const data = {
    version: "1.0.0",
    slides: [ slide, slide, slide, ]
}
