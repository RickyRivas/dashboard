export function attachContainerComponents(singleton) {
    if (!singleton) return

    // containers groups
    singleton.ComponentsGroup['Containers'] = [
        'html/div',
        'html/section',
        'html/article',
        'html/main',
        'html/header',
        'html/footer',
        'html/aside',
        'html/nav'
    ];

    singleton.Components.extend('_base', 'html/div', {
        nodes: ['div'],
        name: 'Div',
        image: 'icons/container.svg',
        html: '<div></div>'
    });

    singleton.Components.extend('_base', 'html/section', {
        nodes: ['section'],
        name: 'Section',
        image: 'icons/container.svg',
        html: '<section><h2>Section Title</h2><p>Section content goes here.</p></section>'
    });

    singleton.Components.extend('_base', 'html/article', {
        nodes: ['article'],
        name: 'Article',
        image: 'icons/container.svg',
        html: '<article><h2>Article Title</h2><p>Article content goes here.</p></article>'
    });

    singleton.Components.extend('_base', 'html/main', {
        nodes: ['main'],
        name: 'Main',
        image: 'icons/container.svg',
        html: '<main><p>Main content</p></main>'
    });

    singleton.Components.extend('_base', 'html/header', {
        nodes: ['header'],
        name: 'Header',
        image: 'icons/container.svg',
        html: '<header><h1>Header</h1></header>'
    });

    singleton.Components.extend('_base', 'html/footer', {
        nodes: ['footer'],
        name: 'Footer',
        image: 'icons/container.svg',
        html: '<footer><p>Footer content</p></footer>'
    });

    singleton.Components.extend('_base', 'html/aside', {
        nodes: ['aside'],
        name: 'Aside',
        image: 'icons/container.svg',
        html: '<aside><p>Sidebar content</p></aside>'
    });

    singleton.Components.extend('_base', 'html/nav', {
        nodes: ['nav'],
        name: 'Nav',
        image: 'icons/navbar.svg',
        html: '<nav><a href="#">Link 1</a> <a href="#">Link 2</a> <a href="#">Link 3</a></nav>'
    });

}