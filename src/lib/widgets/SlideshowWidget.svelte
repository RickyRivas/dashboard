<script lang="ts">
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { CldImage, configureCloudinary } from 'svelte-cloudinary';
	import { Navigation, Pagination, Autoplay, Manipulation } from 'swiper/modules';
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_PRESET } from '$env/static/public';

	let swiper;
	let slideshowSwiperEl: HTMLDivElement;
	let slideshowPrevBtn: HTMLButtonElement;
	let slideshowNextBtn: HTMLButtonElement;

	let slideshowResources = [];

	// cloudinary
	let uploadWidget;
	const folder = 'dashboard-slideshow-widget';

	function onUpload(error, result, widget) {
		if (!error && result) {
			swiper.autoplay.stop();

			// Get the public ID of the uploaded file
			const publicId = result.info.public_id;

			// Create the transformed URL for 450x450 crop
			const transformedUrl = `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_450,h_450/${publicId}`;

			// create new slide, its children, attach event listeners and append to slideshow
			const newSwiperSlide = document.createElement('div') as HTMLDivElement;
			newSwiperSlide.className = 'swiper-slide';
			newSwiperSlide.dataset.publicId = publicId;

			const newSwiperSlideControls = document.createElement('div') as HTMLDivElement;
			newSwiperSlideControls.className = 'swiper-slide__controls';

			const newSwiperSlideControlsDeleteBtn = document.createElement('button') as HTMLButtonElement;
			newSwiperSlideControlsDeleteBtn.className = 'btn';
			newSwiperSlideControlsDeleteBtn.textContent = 'Delete';
			newSwiperSlideControlsDeleteBtn.addEventListener('click', deleteResource);

			const newSwiperSlideImg = document.createElement('img') as HTMLImageElement;
			newSwiperSlideImg.width = 450;
			newSwiperSlideImg.height = 450;
			newSwiperSlideImg.decoding = 'async';
			newSwiperSlideImg.src = transformedUrl;

			newSwiperSlideControls.appendChild(newSwiperSlideControlsDeleteBtn);

			newSwiperSlide.appendChild(newSwiperSlideImg);
			newSwiperSlide.appendChild(newSwiperSlideControls);

			swiper.appendSlide(newSwiperSlide);

			swiper.autoplay.start();
		}
	}

	function cldCallback(error, result) {
		if (error || result.event === 'success') onUpload && onUpload(error, result, uploadWidget);
	}

	async function deleteResource(e: Event) {
		swiper.autoplay.stop();

		// use public id to delete resource via endpoint
		const publicId = e.target.parentElement.parentElement.dataset.publicId;

		const response = await fetch('/api/cloudinary-delete', {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ publicId })
		});

		const data = await response.json();

		// remove slide using current slide and restart slideshow
		if (data.success) {
			swiper.removeSlide(swiper.activeIndex);
			swiper.autoplay.start();
		}
	}

	onMount(async () => {
		// grab cloudinary resources
		const response = await fetch('/api/cloudinary-fetch', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ folder })
		});

		const data = await response.json();
		if (data) {
			slideshowResources = data;

			// INITIATE SWIPER
			swiper = new Swiper(slideshowSwiperEl, {
				modules: [Navigation, Pagination, Autoplay, Manipulation],
				hashNavigation: true,
				navigation: {
					prevEl: slideshowPrevBtn,
					nextEl: slideshowNextBtn
				},
				// loop: true,
				speed: 1000,
				autoplay: {
					delay: 5000
				}
			});
		}

		// init cloudinary upload widget
		function onIdle() {
			if (!uploadWidget) {
				uploadWidget = window.cloudinary.createUploadWidget(
					{
						cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
						uploadPreset: 'dashboard-ss',
						multiple: true,
						asset_folder: folder
					},
					cldCallback
				);
			}
		}

		'requestIdleCallback' in window ? requestIdleCallback(onIdle) : setTimeout(onIdle, 1);
	});
</script>

<div id="slideshow-widget">
	<div class="swiper swiper-container" bind:this={slideshowSwiperEl}>
		<div class="swiper-wrapper">
			{#each slideshowResources as resource}
				<div class="swiper-slide" data-public-id={resource.public_id}>
					<!-- controls for individual slide -->
					<div class="swiper-slide__controls">
						<button class="btn" onclick={deleteResource}>X</button>
					</div>
					<img
						class=""
						src={resource.cropped_url}
						alt=""
						width="450"
						height="450"
						decoding="async"
						fetchpriority="low"
					/>
				</div>
			{/each}
		</div>
	</div>

	<!-- slideshow controls -->
	<div class="slideshow-widget__controls">
		<button class="btn" bind:this={slideshowPrevBtn}>prev</button>
		<button class="btn" onclick={() => uploadWidget.open()}>+</button>
		<button class="btn" bind:this={slideshowNextBtn}>next</button>
	</div>
</div>
