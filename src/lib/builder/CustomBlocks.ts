// in order for styles to be added to iframe doc, the markup needs to be wrapped by a div

const customBlocks = [
    {
        group: 'Sesame',
        type: 'sesame/slideshow',
        name: 'Common Cycle2 Slideshow',
        image: '',
        html: `<div class="cycle-slideshow"></div>`
    },
    {
        group: 'Sesame',
        type: 'sesame/slideshow-pager',
        name: 'Cycle2 Slideshow with pager',
        image: '',
        html: `<div class="cycle-slideshow"></div><div class="pager"></div>`
    },
    {
        group: 'Sesame',
        type: 'sesame/subnav',
        name: 'Top Subnav',
        image: '',
        html: `<div id="subnav"><ul><li>list item</li></ul></div>`
    },
    {
        group: 'Sesame',
        type: 'sesame/subnav',
        name: 'Common Anchor Design',
        image: '',
        html: `
<div>


  <a class="anchor-style-1" href="/office-visits">
            <div class="decoration">
                <img src="https://www.rivaswebdesigns.com/webdesign1.webp" alt="" width="370" height="370"
                    fetchpriority="high" decoding="async">
            </div>
            <h3 class="topic">Your first visit</h3>
        </a>

       <style>
       .anchor-style-1 {
    width: 90%;
    max-width: 20em;
    display: block;
    color: #fff;
    position: relative;
}

@media only screen and (min-width: 1024px) {
    .anchor-style-1 {
        font-size: inherit;
    }
}

.anchor-style-1:nth-child(1) {
    order: -1;
}

.anchor-style-1 .decoration {
    width: 100%;
    position: relative;
    z-index: 1;
    overflow: hidden;
    transition: box-shadow 0.33s ease-in-out;
}

.anchor-style-1 .decoration::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    transition: clip-path 0.5s cubic-bezier(0.9, 0, 0.2, 1);
    background-color: rgba(66, 108, 200, 0.8);
    clip-path: polygon(0% 0%, 0% 100%, 0 100%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%, 100% 100%, 100% 0%);
}

.anchor-style-1 .decoration img {
    width: 100%;
    transition: filter 0.33s ease-in-out, -webkit-filter 0.33s ease-in-out;
}

.anchor-style-1 h3.topic {
    line-height: 2.72;
    font-size: clamp(12px, 1.25em, 25px);
    background-color: rgba(66, 108, 200, 0.9);
    color: currentColor;
    width: calc(100% - 1.6em);
    font-weight: 700;
    margin: 0;
    z-index: 1;
    position: absolute;
    bottom: 50%;
    left: 0.8em;
    transform: translate(0, calc(50% + 6.8em));
    transition: transform 0.33s ease-in-out, background-color 0.33s ease-in-out;
}

.anchor-style-1 h3.topic span {
    vertical-align: top;
}

.anchor-style-1 h3.topic .char {
    overflow: hidden;
    color: transparent;
}

.anchor-style-1 h3.topic .char:before,
.anchor-style-1 h3.topic .char:after {
    visibility: visible;
    color: #fff;
    transition: transform 0.5s cubic-bezier(0.9, 0, 0.2, 1);
    transition-delay: calc(0.2s + (0.02s * (var(--char-index))));
}

.anchor-style-1 h3.topic .char:before {
    color: #fff;
    transition-delay: calc(0.02s * (var(--char-index)));
}

.anchor-style-1 h3.topic .char:before {
    transform: translateX(110%);
}

.anchor-style-1:hover .decoration,
.anchor-style-1:focus .decoration {
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.2);
}

.anchor-style-1:hover .decoration::before,
.anchor-style-1:focus .decoration::before {
    clip-path: polygon(0% 0%, 0% 100%, 50% 100%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 100%, 100% 100%, 100% 0%);
}

.anchor-style-1:hover .decoration img,
.anchor-style-1:focus .decoration img {
    filter: grayscale(1);
    -webkit-filter: grayscale(1);
}

.anchor-style-1:hover h3.topic,
.anchor-style-1:focus h3.topic {
    transform: translate(0, 50%);
    background-color: rgba(0, 0, 0, 0);
}

.anchor-style-1:hover h3.topic .char:before,
.anchor-style-1:focus h3.topic .char:before {
    transform: translateX(0%);
    transition-delay: calc(0.2s + (0.02s * (var(--char-index))));
}

.anchor-style-1:hover h3.topic .char:after,
.anchor-style-1:focus h3.topic .char:after {
    transform: translateX(-110%);
    transition-delay: calc(0.02s * (var(--char-index)));
}
       </style>
       </div>
        `
    },

];

export function addCustomBlocks(singleton) {
    // Vvveb.BlocksGroup['name'] = ['type'];

    // Vvveb.Blocks.add('type', {
    // 	name: ' ',
    // 	image: '',
    // 	html: ``
    // });

    for (const block of customBlocks) {
        singleton.BlocksGroup[block.group] ??= []

        if (!singleton.BlocksGroup[block.group].includes(block.type)) {
            singleton.BlocksGroup[block.group].push(block.type)
        }

        singleton.Blocks.add(block.type, {
            name: block.name, image: block.image, html: block.html
        })
    }
}