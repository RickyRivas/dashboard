const customSections = [
  {
    group: 'Rivas Web Designs',
    type: 'rwd/slideshow',
    name: 'Common Hero Swiper Slideshow',
    image: '',
    html: `<section class="hero"><div class='swiper slideshow-swiper'>
  <div class="swiper-wrapper">
    <div class="swiper-slide slide">
      <div class="decor">
        <img src="/assets/images/slideshow/slide1.png" alt="" width="920" height="635"
          decoding="async">
      </div>
      <div class="mod">
        <h2 class="topic"> affordable financing for braces & surgery </h2>
        <a class="spotbtn" href='/flexible-financing'>
          <span>Explore</span>
          <span class="screenreader">more about financing</span>
        </a>
      </div>
    </div>
    <div class="swiper-slide slide">
      <div class="decor">
        <img src="/assets/images/slideshow/slide2.png" alt="" width="920" height="635"
          decoding="async">
      </div>
      <div class="mod">
        <h2 class="topic"> over 26 years
          <br> of experience
        </h2>
        <a class="spotbtn" href='/what-sets-us-apart'>
          <span>Explore</span>
          <span class="screenreader">more about what sets us apart</span>
        </a>
      </div>
    </div>
    <div class="swiper-slide slide">
      <div class="decor">
        <img src="/assets/images/slideshow/slide3.png" alt="" width="920" height="635"
          decoding="async">
      </div>
      <div class="mod">
        <h2 class="topic"> comfortable
          <br> and convenient
        </h2>
        <a class="spotbtn" href='/about-orthodontics'>
          <span>Explore</span>
          <span class="screenreader">more about orthodontics</span>
        </a>
      </div>
    </div>
  </div>
</div>
<div class="controls">
  <button class="slideshowprev" aria-label="previous slide">
    <span class="icon fas fa-arrow-left" aria-hidden="true" role="img"></span>
  </button>
  <button class="slideshownext" aria-label="next slide">
    <span class="icon fas fa-arrow-right" aria-hidden="true" role="img"></span>
  </button>
</div><section>`
  }
];

export function addCustomSections(singleton) {
  for (const block of customSections) {
    singleton.SectionsGroup[block.group] ??= []

    if (!singleton.SectionsGroup[block.group].includes(block.type)) {
      singleton.SectionsGroup[block.group].push(block.type)
    }

    singleton.Sections.add(block.type, {
      name: block.name, image: block.image, html: block.html
    })
  }
}
