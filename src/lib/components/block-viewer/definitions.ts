export const lessMixins = `// Font weight and style
.font-weight(@weight) { font-weight: @weight; }
.th()        { .font-weight(100); }
.xlt()       { .font-weight(200); }
.lt()        { .font-weight(300); }
.roman()     { .font-weight(400); }
.mbold()     { .font-weight(500); }
.sbold()     { .font-weight(600); }
.bold()      { .font-weight(700); }
.xbold()     { .font-weight(800); }
.ubold()     { .font-weight(900); }
.black()     { .ubold(); }

.font-style(@style) { font-style: @style; }
.italic()    { .font-style(italic); }
.normal()    { .font-style(normal); }

.text-transform(@transform) { text-transform: @transform; }
.upp()       { .text-transform(uppercase); }
.loww()      { .text-transform(lowercase); }
.noo()       { .text-transform(none); }

// Word and paragraph styles
.ls(@spacing) { letter-spacing: @spacing; }
.lh(@val)     { line-height: @val; }
.fs(@val)     { font-size: @val; }

.text-align(@align) { text-align: @align; }
.aligncenter() { .text-align(center); }
.alignright()  { .text-align(right); }
.alignleft()   { .text-align(left); }
.justify()     { .text-align(justify); }

// Display utilities
.display(@type) { display: @type; }
.show()         { .display(block); }
.hide()         { .display(none); }
.inline()       { .display(inline); }
.ib()           { .display(inline-block); }
.inline-block() { .ib(); }
.flex()         { .display(flex); }
.if()           { .display(inline-flex); }
.inline-flex()  { .if(); }

.va(@args){ vertical-align:@args; }

.clear(@direction: both) { clear: @direction; }
.clearleft()    { .clear(left); }
.clearright()   { .clear(right); }

.left(){ float:left; }
.right(){ float:right; }

// Flex utilities
.flex-prop(@property, @value) { @{property}: @value; }
.fdir(@direction) { .flex-prop(flex-direction, @direction); }
.jc(@value)      { .flex-prop(justify-content, @value); }
.ai(@value)      { .flex-prop(align-items, @value); }

// Size utilities
.wall()        { width: 100%; }
.hall()        { height: 100%; }
.auto()        { width: auto; }
.autoy()       { height: auto; }

.size(@width, @height) { width: @width;height: @height; }
.autox()       { .size(auto, auto); }
.zerox()       { .size(0, 0); }
.line()        { .size(100%, 1px); }

.center()     { margin-right:auto;margin-left:auto; }

// Position utilities
.vertical-align() { position: absolute;top: 50%;transform: translate3d(0, -50%, 0); }
.overlay() { .size(100%, 100%);position: absolute;top: 0;left: 0; }
.inlay() { .size(auto, auto);position: absolute; }
.trbl(@value) { top: @value;right: @value;bottom: @value;left: @value; }

// Borders
.rounded(@radius) { border-radius: @radius; }
.round()          { .rounded(50%); }

// Background
.bc(@color) { background-color: @color; }

// Filters
.gray() { -webkit-filter: grayscale(100%);filter: grayscale(100%); }
.grey() { .gray(); }

//==================
//functional mixins
//==================

//centered flyouts 
.droplocation(@dropdowncentered) when (@dropdowncentered = true) {
  left:50%;
  transform:translate(-50%,0);
}
.droplocation(@dropdowncentered) when (@dropdowncentered = false) {
  left:@dropdownoffset / -20em;
}

//text-align for centered flyouts
.droptextalign(@dropdowncentered) when (@dropdowncentered = true) {
  text-align:center;
} 
.droptextalign(@dropdowncentered) when (@dropdowncentered = false) {
  text-align:left;
}

//centered flyout for last flyout
.droplocationlast(@dropdowncentered) when (@dropdowncentered = false){
  left:auto;
  right:@dropdownoffset / -20em;
}

//text-align for centered  last flyout
.droptextalignlast(@dropdowncentered) when (@dropdowncentered = true) {
  text-align:center;
} 
.droptextalignlast(@dropdowncentered) when (@dropdowncentered = false) {
  text-align:right;
} 


//tertiary-nav side orientation
.tertside(@tertside) when (@tertside = right) {
  left: 100%;
}

.tertside(@tertside) when (@tertside = left) {
  left: auto;
  right: 100%;
}

//ul width conditional mixin
.ulcond(left) { width:auto; }
.ulcond(right) { width:auto; }
.ulcond(none) { width:100%; }

//ul ul li a padding conditional mixin
.ululliacond(@a) when (@a = 0){
  padding:0 ((@dropdownlinkheight/@secondary)*1em);
}
.ululliacond(@a) when (@a > 0){
  padding:0 ((@dropdownoffset/@secondary)*1em);
}`


export const lessBase = `
html body {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    min-width: 180px;
    max-width: 100%;
    padding: 0;
    margin: 0
}
    
html {
    font-size: 100%;
    cursor: default;
    overflow-y: scroll;
    -webkit-tap-highlight-color: transparent;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%
}

body {
    font-size: 100%;
    margin: 0
}

.centered-container {
display: flex;
justify-content: center;
align-items: center;
width: 100%;
}

/* ===============================================
                    colors
 =============================================== */
@color0: #4c816f;
@color1: #598dad;

/* ===============================================
					fonts
=============================================== */
.fontH() {
    font-family: "Inter", sans-serif;
}

// ===============================================
//	main content-text font sizes
//===============================================
@contentlh: 32; //line-height from main content area on psd proof
@contentfs: 19; //font size from main content area on psd proof (will affect .content-area only)

//search '<< customHP' for signposts
@hpcontentlh: 29;
@hpcontentfs: 19;

html {
    scroll-behavior: smooth;
}

/* ===============================================
	body
=============================================== */
body,
input,
select,
textarea {
    .fontH;
}

//for font declaration that will affect most site elements
form button,
button {
    .fontH;
}

//for font declaration that will affect button elements only
svg {
    display: inline-block;
}

body {
    color: #000;
    position: relative;
    overflow: hidden;
    background-color: #fff;

    @media only screen and (min-width: 1300px) {
        font-size: 20px; //do not change - this informs factor for em units on desktop layouts || is not content font-size ||
    }
}

/* ===============================================
	h family || hfam
=============================================== */
@h2fs: 25;
@h3fs: 23;
@h4fs: 21;
@h5fs: 20;
@h6fs: 19;

h1,
h2:not(.topic),
h3:not(.topic),
h4,
h5,
h6 {
    line-height: 1;
    text-align: left;
    color: #000;
    text-rendering: auto;
    margin: 0 0 36em/@h2fs;
}

/* ===============================================
	links
=============================================== */

a {
    text-decoration: none;
}

#content a {
    color: @color1;
    text-decoration: underline;
    transition: color 0.33s ease-in-out;

    &:focus,
    &:hover {
        color: @color0;
    }
}

/* ==================================================================
	masthead
=================================================================== */
@mastheightmob: 52; // measured from mob proof
@mastheightdesk: 145; // measured from desk proof


// ==================================================================
//	#main-nav | config VARS
// ==================================================================
//mob vars
@primary: 15; // main nav item font size from psd proof
@secondary: 15; // drop menu item font size from psd proof
@trigger: 44px; // height and width and lineHeight of .trigger

@mainmax: 320px; // maxwidth for mob menu (and contained elements)

//navicon vars
@naviconwidth: 36px; // width of navicon
@naviconheight: 24px; // height of navicon
@naviconchildheight: 4px; // height of 'hamburger buns' (navicon children)

//navicon centering
@vafactor: ((9+@naviconchildheight) - @naviconheight)*0.5; //navicon centered always - do not edit do not delete

//desk vars
//top level variables
@mainnavfloat: right; // float of main nav - left, right, or none (to center it)
@mainnavmargintop: 0; //space above top level (a[id]) main-nav links required to position it properly
@mainnavheight: 94; // height of main nav from proof  - from top of a[id] to top of drop down
@mainnavitemmargin: 20.8; // distance between top level (a[id]) main-nav links

//flyout variables
@dropdownlinkheight: 35; // height of links in dropdown nav
@dropdownoffset: 22; // offset horizontal distance of drop menu from left side of main-nav item on psd
@dropdowncentered: true; //OR TRUE - if drop menu is centered below a[id];

//tertiary variables
@tertside: right; //which side of main fly out is tertiary nav on? - left (default) or right

`