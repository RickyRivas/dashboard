export const LIBRARIES = {
    jquery: {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
        integrity: 'sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==',
    },
    gsap: {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        integrity: 'sha512-7eHRwcbYkK4d9g/6tD/mhkf++eoTHwpNM9woBxtPUBWm67zeAfFC+HrdoE2GanKeocly/VxeLvIqwvCdk7qScg==',
    },
    'gsap-scrolltrigger': {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
        integrity: 'sha512-onMTRKJBKz8M1TnqqDuGBlowlH0ohFzMXYRNebz+yOcc5TQr/zAKsthzhuv0hiyUKEiQEQXEynnXCvNTOk50dg==',
        requires: ['gsap'], // Load GSAP first
    },
    'font-awesome': {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
        integrity: 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==',
        type: 'css',
    },
    anime: {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js',
        integrity: 'sha512-aNMyYYxdIxIaot0Y1/PLuEu3eipGCmsEUBrUq+7aVyPGMFH8z0eTP0tkqAvv34fzN6z+201d3T8HPb1svWSKHQ==',
    },
    three: {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
        integrity: 'sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==',
    },
    'd3': {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js',
        integrity: 'sha512-M7nHCiNUOwFt6Us3r8alutZLm9qMt4s9951uo8jqO4UwJ1hziseL6O3ndFyigx6+LREfZqnhHxYjKRJ8ZQ69DQ==',
    },
};

export function generateLibraryTags(libraries = []) {
    if (!libraries || libraries.length === 0) return '';

    const tags = [];
    const loaded = new Set();

    function addLibrary(libName) {
        if (loaded.has(libName)) return;

        const lib = LIBRARIES[libName];
        if (!lib) {
            console.warn(`Library "${libName}" not found in registry`);
            return;
        }

        // Load dependencies first
        if (lib.requires) {
            lib.requires.forEach(dep => addLibrary(dep));
        }

        if (lib.type === 'css') {
            tags.push(`<link rel="stylesheet" href="${lib.url}" integrity="${lib.integrity}" crossorigin="anonymous">`);
        } else {
            tags.push(`<script src="${lib.url}" integrity="${lib.integrity}" crossorigin="anonymous"><\/script>`);
        }

        loaded.add(libName);
    }

    libraries.forEach(lib => addLibrary(lib));

    return tags.join('\n    ');
}