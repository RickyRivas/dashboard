<script lang="ts">
	import { addCustomBlocks } from '$lib/builder/CustomBlocks';
	import { addCustomSections } from '$lib/builder/CustomSections';
	import TopPanel from '$lib/components/builder/TopPanel.svelte';
	import DesktopView from '$lib/components/icons/DesktopView.svelte';
	import DownloadIcon from '$lib/components/icons/DownloadIcon.svelte';
	import ExpandIcon from '$lib/components/icons/ExpandIcon.svelte';
	import ExternalLink from '$lib/components/icons/ExternalLink.svelte';
	import EyeOutlineIcon from '$lib/components/icons/EyeOutlineIcon.svelte';
	import FileManagerIcon from '$lib/components/icons/FileManagerIcon.svelte';
	import HandRockIcon from '$lib/components/icons/HandRockIcon.svelte';
	import LayersIcon from '$lib/components/icons/LayersIcon.svelte';
	import LeftColLayoutIcon from '$lib/components/icons/LeftColLayoutIcon.svelte';
	import MobileViewIcon from '$lib/components/icons/MobileViewIcon.svelte';
	import RedoIcon from '$lib/components/icons/RedoIcon.svelte';
	import RightColumnLayout from '$lib/components/icons/RightColumnLayout.svelte';
	import TabletViewIcon from '$lib/components/icons/TabletViewIcon.svelte';
	import UndoIcon from '$lib/components/icons/UndoIcon.svelte';
	import { onMount } from 'svelte';

	// tabs
	const elementsNavTabs = $state([
		{
			id: 0,
			title: 'sections',
			iconPath: '',
			activeSubTabsIndex: 0,
			subTabs: [
				{
					id: 0,
					title: 'sections'
				},
				{
					id: 1,
					title: 'page sections'
				}
			]
		},
		{
			id: 1,
			title: 'components',
			activeSubTabsIndex: 0,
			subTabs: [
				{
					id: 0,
					title: 'components'
				},
				{
					id: 1,
					title: 'blocks'
				}
			]
		},
		{
			id: 2,
			title: 'properties',
			activeSubTabsIndex: 0,
			subTabs: [
				{
					id: 0,
					title: 'content'
				},
				{
					id: 1,
					title: 'style'
				},
				{
					id: 2,
					title: 'advanced'
				}
			]
		},
		{
			id: 3,
			title: 'configuration',
			activeSubTabsIndex: 0,
			subTabs: [
				{
					id: 0,
					title: 'variables'
				},
				{
					id: 1,
					title: 'css'
				}
			]
		}
	]);

	let activeElementsNavTabIndex = $state(0);

	// client code
	onMount(() => {
		function buildParams(prefix, obj, add) {
			let rbracket = /\[\]$/;

			if (Array.isArray(obj)) {
				// Serialize array item.
				for (const key in obj) {
					let v = obj[key];
					if (rbracket.test(prefix)) {
						// Treat each array item as a scalar.
						add(prefix, v);
					} else {
						// Item is non-scalar (array or object), encode its numeric index.
						buildParams(
							prefix + '[' + (typeof v === 'object' && v != null ? key : '') + ']',
							v,
							add
						);
					}
				}
			} else if (typeof obj === 'object') {
				// Serialize object item.
				for (const name in obj) {
					buildParams(prefix + '[' + name + ']', obj[name], add);
				}
			} else {
				// Serialize scalar item.
				add(prefix, obj);
			}
		}

		// Serialize an array of form elements or a set of
		// key/values into a query string
		function nestedFormData(a) {
			let prefix,
				s = [],
				add = function (key, valueOrFunction) {
					// If value is a function, invoke it and use its return value
					let value = typeof valueOrFunction === 'function' ? valueOrFunction() : valueOrFunction;

					s[s.length] =
						encodeURIComponent(key) + '=' + encodeURIComponent(value == null ? '' : value);
				};

			if (a == null) {
				return '';
			}

			// If an array was passed in, assume that it is an array of form elements.
			if (Array.isArray(a) || Object.is(a)) {
				// Serialize the form elements
				for (const key in object) {
					let v = object[key];
					//jQuery.each( a, function() {
					add(key, v);
				}
			} else {
				// If traditional, encode the "old" way (the way 1.3.2 or older
				// did it), otherwise encode params recursively.
				for (const prefix in a) {
					buildParams(prefix, a[prefix], add);
				}
			}

			// Return the resulting serialization
			return s.join('&');
		}

		let delay = (function () {
			let timer = 0;
			return function (callback, ms) {
				clearTimeout(timer);
				timer = setTimeout(callback, ms);
			};
		})();

		function isElement(obj) {
			return (
				typeof obj === 'object' &&
				obj.nodeType === 1 &&
				typeof obj.style === 'object' &&
				typeof obj.ownerDocument === 'object' /* && obj.tagName != "BODY"*/
			);
		}

		function generateElements(html) {
			const template = document.createElement('template');
			template.innerHTML = html.trim();
			return template.content.children;
		}

		function offset(el) {
			// box = el.getBoundingClientRect();
			let box = el.getBoundingClientRect();
			// docElem = document.documentElement;
			let docElem = document.documentElement;
			return {
				top: box.top + window.pageYOffset - docElem.clientTop,
				left: box.left + window.pageXOffset - docElem.clientLeft
			};
		}

		var Vvveb = {};

		// $inspect(Vvveb);

		let defaultPages = {
			index: {
				name: 'index',
				filename: 'index.html',
				file: '/builder-landing.html',
				url: '/builder-landing.html',
				title: 'Home page',
				folder: null,
				description: 'Website homepage'
			},
			interior: {
				name: 'interior',
				filename: 'interior.html',
				file: '/builder-interior.html',
				url: '/builder-interior.html',
				title: 'Interior Page',
				folder: null,
				description: 'Interior Page'
			}
		};

		let pages = defaultPages;

		let firstPage = Object.keys(pages)[0];

		// inputs

		let Input = {
			init: function (name) {},

			onChange: function (event, node, input) {
				if (event && event.target) {
					const e = new CustomEvent('propertyChange', {
						detail: { value: input.value ?? this.value, input: this, origEvent: event }
					});
					event.currentTarget.dispatchEvent(e);
				}
			},

			renderTemplate: function (name, data) {
				// console.log('renderTemplate', 'vvveb-input-' + name, data);
				return tmpl('vvveb-input-' + name, data);
			},

			setValue: function (value) {
				if (this.element[0] && value) {
					let input = this.element[0].querySelector('input');

					if (input) {
						input.value = value;
					}
				}
			},

			render: function (name, data) {
				let html = this.renderTemplate(name, data);
				this.element = generateElements(html);

				//bind events
				if (this.events)
					for (let i in this.events) {
						let ev = this.events[i][0];
						let fun = this[this.events[i][1]];
						let el = this.events[i][2];

						this.element[0].addEventListener(
							ev,
							function (ev, el, fun, target, event) {
								if (event.target.closest(el)) {
									//target, event, element, input
									return fun.call(event.target, event, target, this);
								}
							}.bind(this, ev, el, fun, this.element[0])
						);
					}

				return this.element[0];
			}
		};

		let TextInput = {
			...Input,
			...{
				events: [
					//event, listener, child element
					['focusout', 'onChange', 'input']
				],

				init: function (data) {
					return this.render('textinput', data);
				}
			}
		};

		let TextareaInput = {
			...Input,
			...{
				events: [['keyup', 'onChange', 'textarea']],

				setValue: function (value) {
					if (this.element[0] && value) {
						let input = this.element[0].querySelector('textarea');

						if (input) {
							input.value = value;
						}
					}
				},

				init: function (data) {
					return this.render('textareainput', data);
				}
			}
		};

		let CheckboxInput = {
			...Input,
			...{
				events: [['change', 'onCheck', 'input']],

				onCheck: function (event, node, input) {
					input.value = this.checked;
					return input.onChange.call(this, event, node, input);
				},

				setValue: function (value) {
					if (this.element[0]) {
						let input = this.element[0].querySelector('input');

						if (input) {
							if (value) {
								input.checked = true;
							} else {
								input.checked = false;
							}
						}
					}
				},

				init: function (data) {
					return this.render('checkboxinput', data);
				}
			}
		};

		let SelectInput = {
			...Input,
			...{
				events: [['change', 'onChange', 'select']],

				setValue: function (value) {
					if (this.element[0] && value) {
						let input = this.element[0].querySelector('select');

						if (input) {
							input.value = value;
						}
					}
				},

				init: function (data) {
					return this.render('select', data);
				}
			}
		};

		let IconSelectInput = {
			...Input,
			...{
				events: [['change', 'onChange', 'select']],

				setValue: function (value) {
					if (this.element[0] && value) {
						let input = this.element[0].querySelector('select');

						if (input) {
							input.value = value;
						}
					}
				},

				init: function (data) {
					return this.render('icon-select', data);
				}
			}
		};

		let HtmlListSelectInput = {
			...Input,
			...{
				data: {},
				cache: {},

				events: [
					//["click", "onChange", "li"],
					['change', 'onListChange', 'select'],
					['keyup', 'searchElement', 'input.search'],
					['click', 'clearSearch', 'button.clear-backspace']
				],

				clearSearch: function (event, element, input) {
					let search = element.querySelector('input.search');
					if (search) {
						search.value = '';
						input.searchElement(event, element, input);
					}

					search.dispatchEvent(
						new KeyboardEvent('keyup', {
							bubbles: true,
							cancelable: true
						})
					);
				},

				searchElement: function (event, element, input) {
					searchText = this.value;

					delay(() => {
						element.querySelectorAll('li').forEach((el, i) => {
							if (!searchText || el.title.indexOf(searchText) > -1) {
								el.style.display = '';
							} else {
								el.style.display = 'none';
							}
						});
					}, 500);
				},

				onElementClick: function (event, element, input) {
					let data = input.data;
					let svg = this.closest(data.insertElement);
					let value = svg.outerHTML ?? '<svg></svg>';
					input.value = value;
					let ret = input.onChange.call(this, event, element, input);

					return element;
				},

				onListChange: function (event, element, input) {
					let url = input.data.url.replace('{value}', this.value);
					let elements = element.querySelector('.elements');

					elements.innerHTML = `<div class="p-4"><div class="spinner-border spinner-border-sm" role="status">
		  <span class="visually-hidden">Loading...</span>
		</div> Loading...</div>`;

					//cache ajax requests
					if (input.cache[url] != undefined) {
						elements.innerHTML = input.cache[url];
					} else {
						fetch(url)
							.then((response) => {
								if (!response.ok) {
									throw new Error(response);
								}
								return response.text();
							})
							.then((text) => {
								input.cache[url] = text;
								elements.innerHTML = text;
							})
							.catch((error) => {
								console.log(error.statusText);
								displayToast('bg-danger', 'Error', 'Error loading list');
							});
					}
				},

				setValue: function (value) {
					let select = this.element[0].querySelector('select');
					if (value && select) {
						select.value = value;
					}
				},

				init: function (data) {
					this.data = data;
					this.events.push(['click', 'onElementClick', data.clickElement]);
					let template = this.render('html-list-select', data);
					let select = template.querySelector('select');
					this.onListChange.call(select, new Event('change'), template, this);
					return template;
				}
			}
		};

		let LinkInput = {
			...TextInput,
			...{
				events: [['change', 'onChange', 'input']],
				/*
	setValue: function(value) {
		//value = value.replace(/(?<!\/)www\./, 'https://www.');
		this.element.querySelector('input').value = value;
	},
	*/
				init: function (data) {
					return this.render('textinput', data);
				}
			}
		};

		let DateInput = {
			...TextInput,
			...{
				events: [['change', 'onChange', 'input']],

				init: function (data) {
					return this.render('dateinput', data);
				}
			}
		};

		let RangeInput = {
			...Input,
			...{
				events: [['change', 'onRangeChange', 'input']],

				onRangeChange: function (event, node, input) {
					this.parentNode.querySelector('input[type=number]').value = this.value;
					this.parentNode.querySelector('input[type=range]').value = this.value;
					return input.onChange.call(this, event, node, input);
				},

				setValue: function (value) {
					this.element[0].querySelector('input[type=number]').value = value;
					this.element[0].querySelector('input[type=range]').value = value;
				},

				init: function (data) {
					return this.render('rangeinput', data);
				}
			}
		};

		let NumberInput = {
			...Input,
			...{
				events: [['change', 'onChange', 'input']],

				init: function (data) {
					return this.render('numberinput', data);
				}
			}
		};

		let CssUnitInput = {
			...Input,
			...{
				number: 0,
				unit: 'px',

				events: [
					['change', 'onInputChange', 'select'],
					['change', 'onInputChange', 'input'],
					['keyup', 'onInputChange', 'input']
				],

				onInputChange: function (event, node, input) {
					if (node) {
						let number = node.querySelector('input').value;
						let unit = node.querySelector('select').value;

						if (this.value != '') input[this.name] = this.value; // this.name = unit or number
						if (unit == '') unit = 'px'; //if unit is not set use default px

						let value = '';
						if (unit == 'auto') {
							node.classList.add('auto');
							value = unit;
						} else {
							node.classList.remove('auto');
							value = number + (unit ? unit : '');
						}

						input.value = value;

						return input.onChange.call(this, event, node, input);
					}
				},

				setValue: function (value) {
					if (value && this.element) {
						let element = this.element[0];
						this.number = parseFloat(value);
						this.unit = value.replace(this.number, '').trim();

						if (this.unit == 'auto') element.classList.add('auto');

						element.querySelector('input[type=number]').value = this.number;
						element.querySelector('select').value = this.unit;
					}
				},

				init: function (data) {
					return this.render('cssunitinput', data);
				}
			}
		};

		let ColorInput = {
			...Input,
			...{
				//html5 color input only supports setting values as hex colors even if the picker returns only rgb
				rgb2hex: function (value) {
					if (value) {
						value = value.trim();
						let rgb;

						if (
							(rgb = value.match(
								/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
							))
						) {
							return rgb && rgb.length === 4
								? '#' +
										('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
										('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
										('0' + parseInt(rgb[3], 10).toString(16)).slice(-2)
								: rgb;
						}
					}

					return value;
				},

				events: [['change', 'onChange', 'input']],

				setValue: function (value) {
					if (this.element[0] && value) {
						let input = this.element[0].querySelector('input');

						if (input) {
							input.value = this.rgb2hex(value);
						}
					}
				},

				init: function (data) {
					//if no palette provided use default
					if (!data.palette) {
						data.palette = Vvveb.ColorPalette.getAll();
					}

					return this.render('colorinput', data);
				}
			}
		};

		let ImageInput = {
			...Input,
			...{
				events: [
					['focusout', 'onChange', 'input[type=text]'],
					['change', 'onUpload', 'input[type=file]']
				],

				setValue: function (el, value) {
					//don't set blob value to avoid slowing down the page
					if (value.indexOf('data:image') == -1) {
						// el.querySelector('input[type="text"]').value = value;
					}
				},

				onUpload: function (event, node) {
					if (this.files && this.files[0]) {
						let reader = new FileReader();
						reader.onload = imageIsLoaded;
						reader.readAsDataURL(this.files[0]);
						//reader.readAsBinaryString(this.files[0]);
						file = this.files[0];
					}

					function imageIsLoaded(e) {
						image = e.target.result;

						event.data.element.trigger('propertyChange', [image, this]);

						//return;//remove this line to enable php upload

						let formData = new FormData();
						formData.append('file', file);

						// upload to folder
						// $.ajax({
						// 	type: "POST",
						// 	url: 'upload.php',//set your server side upload script url
						// 	data: formData,
						// 	processData: false,
						// 	contentType: false,
						// 	success: function (data) {
						// 		console.log("File uploaded at: ", data);

						// 		//if image is succesfully uploaded set image url
						// 		event.data.element.trigger('propertyChange', [data, this]);

						// 		//update src input
						// 		event.data.element.querySelector('input[type="text"]').value = data;
						// 	},
						// 	error: function (data) {
						// 		alert(data.responseText);
						// 	}
						// });
					}
				}
			}
		};

		ImageInput = {
			...ImageInput,
			...{
				tag: 'img',

				events: [
					['change', 'onImageChange', 'input[type=text]'],
					['click', 'onClick', 'button'],
					['click', 'onClick', 'img']
				],

				setValue: function (value) {
					if (value && value.indexOf('data:image') == -1 && value != 'none') {
						this.element[0].querySelector('input[type="text"]').value = value;
						//$('input[type="text"]', this.element).val(value);
						let src =
							(value.indexOf('//') > -1 ||
							value.indexOf('media/') > -1 ||
							value.indexOf('image-cache/') > -1
								? ''
								: Vvveb.themeBaseUrl) + value;
						this.element[0].querySelector(this.tag).src = src;
						//$(this.tag, this.element).attr("src", src);
					} else {
						this.element[0].querySelector(this.tag).src = Vvveb.baseUrl + 'icons/image.svg';
						///$(this.tag, this.element).attr("src", Vvveb.baseUrl + 'icons/image.svg');
					}
				},

				onImageChange: function (event, node, input) {
					//set initial relative path
					let self = this;
					let src = self.value;
					let tag = input.tag;

					let img = node.querySelector(tag);
					if (img.src) {
						src = img.getAttribute('src');
					}

					if (src) {
						input.value = src;
						input.onChange.call(self, event, node, input);
						//e.data.element.trigger('propertyChange', [src, this]);
					}

					//reselect image after loading to adjust highlight box size
					let onLoad = function () {
						if (Vvveb.Builder.selectedEl) {
							Vvveb.Builder.selectedEl.click();
						}
					};

					Vvveb.Builder.selectedEl.addEventListener('load', onLoad);
				},

				onClick: function (e, element) {
					if (!Vvveb.MediaModal) {
						Vvveb.MediaModal = new MediaModal(true);
						Vvveb.MediaModal.mediaPath = window.mediaPath;
					}

					Vvveb.MediaModal.open(this.closest('[data-target-input]'));
				},

				init: function (data) {
					return this.render('imageinput-gallery', data);
				}
			}
		};

		let FileUploadInput = {
			...TextInput,
			...{
				events: [['focusout', 'onChange', 'input']],

				init: function (data) {
					return this.render('textinput', data);
				}
			}
		};

		let RadioInput = {
			...Input,
			...{
				events: [['change', 'onChange', 'input']],

				setValue: function (value) {
					if (this.element[0] && value) {
						let input = this.element[0].querySelector('input');

						if (input) {
							if (value == input.value) {
								input.setAttribute('checked', 'true');
								input.checked = true;
							} else {
								input.checked = false;
								input.removeAttribute('checked');
							}
						}
					}
				},

				init: function (data) {
					return this.render('radioinput', data);
				}
			}
		};

		let RadioButtonInput = {
			...RadioInput,
			...{
				setValue: function (value) {
					// if (this.element[0] && value) {
					// 	let inputs = this.element[0].querySelectorAll('input');
					// 	inputs.forEach((el, i) => {
					// 		if (value == el.value) {
					// 			selected = el;
					// 		} else {
					// 			el.checked = false;
					// 			el.removeAttribute('checked');
					// 		}
					// 	});
					// 	selected.checked = true;
					// 	selected.setAttribute('checked', 'checked');
					// }
				},

				init: function (data) {
					return this.render('radiobuttoninput', data);
				}
			}
		};

		let ToggleInput = {
			...Input,
			...{
				events: [['change', 'onToggleChange', 'input']],

				onToggleChange: function (event, node, input) {
					input.value = this.checked
						? this.getAttribute('data-value-on')
						: this.getAttribute('data-value-off');
					return input.onChange.call(this, event, node, input);
				},

				setValue: function (value) {
					if (this.element[0]) {
						let input = this.element[0].querySelector('input');

						if (input) {
							if (value == input.getAttribute('data-value-on')) {
								input.checked = true;
								input.setAttribute('checked', true);
							} else {
								input.checked = false;
								input.removeAttribute('checked');
							}
						}
					}
				},

				init: function (data) {
					return this.render('toggle', data);
				}
			}
		};

		let ValueTextInput = {
			...TextInput,
			...{
				events: [['focusout', 'onChange', 'input']],

				init: function (data) {
					return this.render('textinput', data);
				}
			}
		};

		let GridLayoutInput = {
			...TextInput,
			...{
				events: [['focusout', 'onChange', 'input']],

				init: function (data) {
					return this.render('textinput', data);
				}
			}
		};

		let ProductsInput = {
			...TextInput,
			...{
				events: [['focusout', 'onChange', 'input']],

				init: function (data) {
					return this.render('textinput', data);
				}
			}
		};

		let GridInput = {
			...Input,
			...{
				events: [
					['change', 'onChange', 'select' /*'select'*/],
					['click', 'onChange', 'button' /*'select'*/]
				],

				setValue: function (value) {
					if (this.element[0] && value) {
						let input = this.element[0].querySelector('select');

						if (input) {
							input.value = value;
							input.querySelector('option[selected]').selected = true;
						}
					}
				},

				init: function (data) {
					return this.render('grid', data);
				}
			}
		};

		let TextValueInput = {
			...Input,
			...{
				events: [
					['focusout', 'onChange', 'input'],
					['click', 'onChange', 'button' /*'select'*/]
				],

				setValue: function (value) {
					return false;
				},

				init: function (data) {
					return this.render('textvalue', data);
				}
			}
		};

		let ButtonInput = {
			...Input,
			...{
				events: [['click', 'onChange', 'button' /*'select'*/]],

				setValue: function (value) {
					if (this.element[0] && value) {
						let input = this.element[0].querySelector('button');

						if (input) {
							input.value = value;
						}
					}
				},

				init: function (data) {
					return this.render('button', data);
				}
			}
		};

		let SectionInput = {
			...Input,
			...{
				events: [
					//["click", "onChange", "button" /*'select'*/],
				],

				setValue: function (value) {
					return false;
				},

				init: function (data) {
					return this.render('sectioninput', data);
				}
			}
		};

		let ListInput = {
			...Input,
			...{
				events: [
					['change', 'onChange', 'select'],
					['click', 'remove', '.delete-btn'],
					['click', 'add', '.btn-new'],
					['click', 'select', '.section-item']
				],

				remove: function (event, node, input) {
					let sectionItem = this.closest('.section-item');
					let index = [...sectionItem.parentNode.children].indexOf(sectionItem); //sectionItem.index();
					let data = input.data;

					if (data.removeElement) {
						let container = input.node;
						if (data.container) {
							container.querySelector(data.container);
						}
						container.querySelector(data.selector + ':nth-child(' + (index + 1) + ')').remove();
					}
					sectionItem.remove();

					event.action = 'remove';
					event.index = index;
					input.onChange(event, node, input, this);
					event.preventDefault();
					return false;
				},

				add: function (event, node, input) {
					let newElement = input.data.newElement ?? false;
					if (newElement) {
						let container = input.node;
						if (data.container) {
							container.querySelector(data.container);
						}
						container.append(generateElements(newElement)[0]);
					}

					event.action = 'add';
					input.onChange(event, node, input, this);
					return false;
				},

				select: function (event, node, input) {
					let sectionItem = this.closest('.section-item');
					if (sectionItem.parentNode) {
						let index = [...sectionItem.parentNode.children].indexOf(sectionItem); //sectionItem.index();

						event.action = 'select';
						event.index = index;
						input.onChange(event, node, input, this);
					}
					return false;
				},

				setValue: function (value) {},

				init: function (data, node) {
					this.component = data.component;
					this.selector = data.selector;
					this.node = node;

					let elements = this.node.querySelectorAll(data.container + ' ' + this.selector);
					let options = [];

					elements.forEach(function (e, i) {
						let element = e;
						if (data.nameElement) {
							element = element.querySelector(data.nameElement);
						}
						let name = (data.name = 'text' ? element.textContent.substr(0, 15) : element.id);
						options.push({
							name: name,
							type: (data.prefix ?? '') + (i + 1) + (data.suffix ?? '')
						});
					});

					data.options = options;
					data.elements = elements;
					this.data = data;

					return this.render('listinput', data);
				}
			}
		};

		let AutocompleteInput = {
			...Input,
			...{
				events: [['autocomplete.change', 'onAutocompleteChange', 'input']],

				onAutocompleteChange: function (event, value, text) {
					input.value = value;
					return this.onChange(event, node);
				},

				init: function (data) {
					this.element = this.render('textinput', data);

					let autocomplete = new Autocomplete({
						input: this.element.querySelector('input'),
						url: data.url
					});

					return this.element;
				}
			}
		};

		let AutocompleteList = {
			...Input,
			...{
				events: [['autocompletelist.change', 'onAutocompleteChange', 'input']],

				onAutocompleteChange: function (event, node, input) {
					input.value = event.detail;
					return input.onChange.call(this, event, node, input);
				},

				setValue: function (value) {
					if (this.element[0] && value) {
						let input = this.element[0].querySelector('input');

						if (input) {
							input.dataset.autocompleteList.setValue(value);
						}
					}
				},

				init: function (data) {
					this.element = this.render('textinput', data);

					let autocomplete = new Autocomplete({
						input: this.element.querySelector('input'),
						url: data.url
					});
					// $('input', this.element).autocompleteList(data); //using default parameters

					return this.element;
				}
			}
		};

		let TagsInput = {
			...Input,
			...{
				events: [['tagsinput.change', 'onTagsInputChange', 'input']],

				onTagsInputChange: function (event, value, text) {
					input.value = value;
					return this.onChange(event, node);
				},

				setValue: function (value) {
					if (this.element[0] && value) {
						let input = this.element[0].querySelector('select');

						if (input) {
							input.dataset.tagsInput.setValue(value);
						}
					}
				},

				init: function (data) {
					this.element = this.render('tagsinput', data);

					// $('input', this.element).tagsInput(data); //using default parameters

					return this.element;
				}
			}
		};

		let NoticeInput = {
			...Input,
			...{
				events: [],

				init: function (data) {
					return this.render('noticeinput', data);
				}
			}
		};

		let VideoInput = {
			...ImageInput,
			...{
				tag: 'video',

				events: [
					['change', 'onChange', 'input[type=text]'],
					['click', 'onClick', 'button'],
					['click', 'onClick', 'video']
				],

				init: function (data) {
					return this.render('videoinput-gallery', data);
				}
			}
		};

		// Simple JavaScript Templating and buildParams
		// John Resig - https://johnresig.com/ - MIT Licensed
		let cache = {};
		let startTag = '{%';
		let endTag = '%}';
		let re1 = new RegExp(`((^|${endTag})[^\t]*)'`, 'g');
		let re2 = new RegExp(`\t=(.*?)${endTag}`, 'g');

		function tmpl(str, data) {
			// Figure out if we're getting a template, or if we need to
			// load the template - and be sure to cache the result.
			let fn = /^[-a-zA-Z0-9]+$/.test(str)
				? (cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML))
				: // Generate a reusable function that will serve as a template
					// generator (and which will be cached).
					new Function(
						'obj',
						'let p=[],print=function(){p.push.apply(p,arguments);};' +
							// Introduce the data as local variables using with(){}
							"with(obj){p.push('" +
							// Convert the template into pure JavaScript
							str
								.replace(/[\r\t\n]/g, ' ')
								.split(startTag)
								.join('\t')
								.replace(re1, '$1\r')
								.replace(re2, "',$1,'")
								.split('\t')
								.join("');")
								.split(endTag)
								.join("p.push('")
								.split('\r')
								.join("\\'") +
							"');}return p.join('');"
					);
			// Provide some basic currying to the user
			return data ? fn(data) : fn;
		}

		Vvveb.defaultComponent = '_base';
		Vvveb.preservePropertySections = true;
		//icon = use component icon when dragging | html = use component html to create draggable element
		Vvveb.dragIcon = 'icon';
		//if empty the html of the component is used to view dropping in real time but for large elements it can jump around for this you can set a html placeholder with this option
		Vvveb.dragElementStyle =
			'background:limegreen;width:100%;height:3px;border:1px solid limegreen;box-shadow:0px 0px 2px 1px rgba(0,0,0,0.14);overflow:hidden;';
		Vvveb.dragHtml = '<div style="' + Vvveb.dragElementStyle + '"></div>';

		// Vvveb.baseUrl = document.currentScript
		// 	? document.currentScript.src.replace(/[^\/]*?\.js$/, '')
		// 	: '';
		Vvveb.baseUrl = '';

		Vvveb.imgBaseUrl = Vvveb.baseUrl;

		Vvveb.ComponentsGroup = {};
		Vvveb.SectionsGroup = {};
		Vvveb.BlocksGroup = {};

		Vvveb.Components = {
			_components: {},

			_nodesLookup: {},

			_attributesLookup: {},

			_classesLookup: {},

			_classesRegexLookup: {},

			componentPropertiesElement: '#left-panel #properties .component-properties',

			componentPropertiesDefaultSection: 'content',

			get: function (type) {
				return this._components[type];
			},

			updateProperty: function (type, key, value) {
				let properties = this._components[type]['properties'];
				for (property in properties) {
					if (key == properties[property]['key']) {
						return (this._components[type]['properties'][property] = Object.assign(
							properties[property],
							value
						));
					}
				}
			},

			getProperty: function (type, key) {
				let properties = this._components[type] ? this._components[type]['properties'] : [];
				for (property in properties) {
					if (key == properties[property]['key']) {
						return properties[property];
					}
				}
			},

			add: function (type, data) {
				data.type = type;

				this._components[type] = data;

				if (data.nodes) {
					for (let i in data.nodes) {
						this._nodesLookup[data.nodes[i]] = data;
					}
				}

				if (data.attributes) {
					if (data.attributes.constructor === Array) {
						for (let i in data.attributes) {
							this._attributesLookup[data.attributes[i]] = data;
						}
					} else {
						for (let i in data.attributes) {
							if (typeof this._attributesLookup[i] === 'undefined') {
								this._attributesLookup[i] = {};
							}

							if (typeof this._attributesLookup[i][data.attributes[i]] === 'undefined') {
								this._attributesLookup[i][data.attributes[i]] = {};
							}

							this._attributesLookup[i][data.attributes[i]] = data;
						}
					}
				}

				if (data.classes) {
					for (let i in data.classes) {
						this._classesLookup[data.classes[i]] = data;
					}
				}

				if (data.classesRegex) {
					for (let i in data.classesRegex) {
						this._classesRegexLookup[data.classesRegex[i]] = data;
					}
				}
			},

			extend: function (inheritType, type, data) {
				let newData = data;

				let inheritData;

				if ((inheritData = this._components[inheritType])) {
					newData = { ...inheritData, ...data };
					newData.properties = (data.properties ? data.properties : []).concat(
						inheritData.properties ? inheritData.properties : []
					);
				}

				//sort by order
				newData.properties.sort(function (a, b) {
					if (typeof a.sort === 'undefined') a.sort = 0;
					if (typeof b.sort === 'undefined') b.sort = 0;

					if (a.sort < b.sort) return -1;
					if (a.sort > b.sort) return 1;
					return 0;
				});

				this.add(type, newData);
			},

			matchNode: function (node) {
				let component = {};

				if (!node || !node.tagName) return false;

				if (node.attributes && node.attributes.length) {
					//search for attributes
					for (let i in node.attributes) {
						if (node.attributes[i]) {
							// attr = node.attributes[i].name;
							// value = node.attributes[i].value;
							let attr = node.attributes[i].name;
							let value = node.attributes[i].value;

							if (attr in this._attributesLookup) {
								// component = this._attributesLookup[attr];
								let component = this._attributesLookup[attr];

								//currently we check that is not a component by looking at name attribute
								//if we have a collection of objects it means that attribute value must be checked
								if (typeof component['name'] === 'undefined') {
									if (value in component) {
										return component[value];
									}
								} else {
									return component;
								}
							}
						}
					}

					for (let i in node.attributes) {
						// attr = node.attributes[i].name;
						// value = node.attributes[i].value;
						let attr = node.attributes[i].name;
						let value = node.attributes[i].value;

						//check for node classes
						if (attr == 'class') {
							// classes = value.split(' ');
							let classes = value.split(' ');

							for (let j in classes) {
								if (classes[j] in this._classesLookup) return this._classesLookup[classes[j]];
							}

							for (regex in this._classesRegexLookup) {
								regexObj = new RegExp(regex);
								if (regexObj.exec(value)) {
									return this._classesRegexLookup[regex];
								}
							}
						}
					}
				}

				let tagName = node.tagName.toLowerCase();
				if (tagName in this._nodesLookup) return this._nodesLookup[tagName];

				return false;
				//return false;
			},

			render: function (type, panel = false) {
				let component = this._components[type];
				if (!component) return;

				if (!panel) {
					//panel = document.querySelector(this.componentPropertiesElement);
					panel = this.componentPropertiesElement;
				}

				let defaultSection = this.componentPropertiesDefaultSection;
				let componentsPanelSections = {};

				document.querySelectorAll(panel + ' .tab-pane').forEach((el, i) => {
					let sectionName = el.dataset.section;
					componentsPanelSections[sectionName] = el;

					for (const item of el.querySelectorAll(
						'label:not([data-header="default"]) + input,' +
							'label:not([data-header="default"]),' +
							'.section:not([data-section="default"])'
					)) {
						item.remove();
					}
				});

				let section = componentsPanelSections[defaultSection].querySelector(
					'.section[data-section="default"]'
				);

				if (!(Vvveb.preservePropertySections && section)) {
					let template = tmpl('vvveb-input-sectioninput', {
						key: 'default',
						header: component.name
					});

					componentsPanelSections[defaultSection].replaceChildren();
					componentsPanelSections[defaultSection].append(generateElements(template)[0]);

					section = componentsPanelSections[defaultSection].querySelector('.section');
				}

				componentsPanelSections[defaultSection].querySelector(
					'[data-header="default"] span'
				).innerHTML = component.name;
				section.replaceChildren();

				if (component.beforeInit) component.beforeInit(Vvveb.Builder.selectedEl);

				let element;

				let fn = function (component, property) {
					if (property.input) {
						property.input.addEventListener('propertyChange', (event) => {
							// element = selectedElement = Vvveb.Builder.selectedEl;
							element = Vvveb.Builder.selectedEl;
							let value = event.detail.value,
								input = event.detail.input,
								origEvent = event.detail.origEvent;

							if (property.child) element = element.querySelector(property.child);
							if (property.parent) element = element.parent(property.parent);

							if (property.onChange) {
								let ret = property.onChange(element, value, input, component, origEvent);
								//if on change returns an object then is returning the dom node otherwise is returning the new value
								if (typeof ret == 'object') {
									element = ret;
								} else {
									value = ret;
								}
							} /* else */

							let oldStyle;

							if (property.htmlAttr) {
								let oldValue = element.getAttribute(property.htmlAttr);

								if (property.htmlAttr == 'class' && property.validValues) {
									if (property.validValues) {
										element.classList.remove(...property.validValues.filter((v) => v));
									}
									if (value) {
										element.classList.add(...value.split(' '));
									}
								} else if (property.htmlAttr == 'style') {
									//keep old style for undo
									oldStyle = window.FrameDocument.getElementById('vvvebjs-styles').textContent;
									element = Vvveb.StyleManager.setStyle(element, property.key, value);
								} else if (property.htmlAttr == 'innerHTML') {
									element = Vvveb.ContentManager.setHtml(element, value);
								} else if (property.htmlAttr == 'innerText') {
									element = Vvveb.ContentManager.setText(element, value);
								} else {
									//if value is empty then remove attribute useful for attributes without values like disabled
									if (value) {
										element.setAttribute(property.htmlAttr, value);
									} else {
										element.removeAttribute(property.htmlAttr);
									}
								}

								if (property.htmlAttr == 'style') {
									let mutation = {
										type: 'style',
										target: element,
										attributeName: property.htmlAttr,
										oldValue: oldStyle,
										newValue: window.FrameDocument.getElementById('vvvebjs-styles').textContent
									};

									Vvveb.Undo.addMutation(mutation);
								} else {
									Vvveb.Undo.addMutation({
										type: 'attributes',
										target: element,
										attributeName: property.htmlAttr,
										oldValue: oldValue,
										newValue: element.getAttribute(property.htmlAttr)
									});
								}
							}

							if (component.onChange) {
								element = component.onChange(element, property, value, input);
							}

							if (property.child || property.parent) {
								Vvveb.Builder.selectNode(selectedElement);
							} else {
								Vvveb.Builder.selectNode(element);
							}

							return element;
						});
					}

					return property.input;
				};

				let nodeElement = Vvveb.Builder.selectedEl;

				for (let i in component.properties) {
					let property = component.properties[i];
					let element = nodeElement;

					if (property.beforeInit) property.beforeInit(element);

					if (property.child) element = element.querySelector(property.child) ?? element;
					if (property.parent) element = element.closest(property.parent) ?? element;

					if (property.data) {
						property.data['key'] = property.key;
					} else {
						property.data = { key: property.key };
					}

					if (typeof property.group === 'undefined') property.group = null;

					property.input = property.inputtype.init(property.data, element);

					let value;
					if (property.init) {
						property.inputtype.setValue(property.init(element));
					} else if (property.htmlAttr) {
						if (property.htmlAttr == 'style') {
							//value = element.css(property.key);//jquery css returns computed style
							value = Vvveb.StyleManager.getStyle(element, property.key); //getStyle returns declared style
						} else if (property.htmlAttr == 'innerHTML') {
							value = Vvveb.ContentManager.getHtml(element);
						} else if (property.htmlAttr == 'innerText') {
							value = Vvveb.ContentManager.getText(element);
						} else {
							value = element.getAttribute(property.htmlAttr);
						}

						//if attribute is class check if one of valid values is included as class to set the select
						if (value && property.htmlAttr == 'class' && property.validValues) {
							let valid = value.split(' ').filter(function (el) {
								return property.validValues.indexOf(el) != -1;
							});

							if (valid && valid.length) {
								value = valid[0];
							} else {
								value = '';
							}
						}

						if (!value && property.defaultValue) {
							value = property.defaultValue;
						}

						property.inputtype.setValue(value);
					} else {
						if (!value && property.defaultValue) {
							value = property.defaultValue;
						}

						property.inputtype.setValue(value);
					}

					fn(component, property);

					let propertySection = defaultSection;
					if (property.section) {
						propertySection = property.section;
					}

					if (property.inputtype == SectionInput) {
						section = componentsPanelSections[propertySection].querySelector(
							'.section[data-section="' + property.key + '"]'
						);

						if (Vvveb.preservePropertySections && section) {
							section.replaceChildren();
						} else {
							componentsPanelSections[propertySection].append(property.input);
							section = componentsPanelSections[propertySection].querySelector(
								'.section[data-section="' + property.key + '"]'
							);
						}
					} else {
						let row = generateElements(tmpl('vvveb-property', property))[0];
						row.querySelector('.input').append(property.input);
						section.append(row);
					}

					if (property.inputtype.afterInit) {
						property.inputtype.afterInit(property.input);
					}

					if (property.afterInit) {
						property.afterInit(element, property.input);
					}
				}

				if (component.init) component.init(nodeElement);
			}
		};

		Vvveb.Blocks = {
			_blocks: {},

			get: function (type) {
				return this._blocks[type];
			},

			add: function (type, data) {
				data.type = type;
				this._blocks[type] = data;
			}
		};

		Vvveb.Sections = {
			_sections: {},

			get: function (type) {
				return this._sections[type];
			},

			add: function (type, data) {
				data.type = type;
				this._sections[type] = data;
			}
		};

		Vvveb.WysiwygEditor = {
			isActive: false,
			oldValue: '',
			doc: false,

			editorSetStyle: function (tag, style = {}, toggle = false) {
				let iframeWindow = Vvveb.Builder.iframe.contentWindow;
				let selection = iframeWindow.getSelection();
				let element = this.element;
				let range;

				if (!tag) {
					tag = 'span';
				}

				if (selection.rangeCount > 0) {
					//check if the whole text is inside an existing node to use the node directly
					if (
						(selection.baseNode &&
							selection.baseNode.nextSibling == null &&
							selection.baseNode.previousSibling == null &&
							selection.anchorOffset == 0 &&
							selection.focusOffset == selection.baseNode.length) ||
						selection.anchorOffset == selection.focusOffset
					) {
						element = selection.baseNode.parentNode;
					} else {
						element = document.createElement(tag);
						range = selection.getRangeAt(0);

						try {
							range.surroundContents(element);
							range.selectNodeContents(element.childNodes[0], 0);
						} catch (e) {
							let content = range.extractContents();

							element.appendChild(content);
							range.insertNode(element);

							range.selectNodeContents(element);
						}
					}
				}

				if (element && style) {
					for (name in style) {
						if (!style[name] || (toggle && element.style.getPropertyValue(name))) {
							element.style.removeProperty(name);
						} else {
							element.style.setProperty(name, style[name]);
						}
					}
				}

				//if edited text is an empty span remove the span
				if (
					element.tagName == 'SPAN' &&
					element.style.length == 0 &&
					element.attributes.length <= 1
				) {
					let textNode = iframeWindow.document.createTextNode(element.innerText);
					element.replaceWith(textNode);
					element = textNode;

					range = iframeWindow.document.createRange();
					range.selectNodeContents(element);
					selection.removeAllRanges();
					selection.addRange(range);
				}

				//select link element to edit link etc
				if (tag == 'a') {
					Vvveb.Builder.selectNode(element);
					Vvveb.Builder.loadNodeComponent(element);
				}
				return element;
			},

			init: function (doc) {
				this.doc = doc;
				let self = this;

				document.getElementById('bold-btn').addEventListener('click', function (e) {
					//doc.execCommand('bold',false,null);
					//self.editorSetStyle("b", {"font-weight" : "bold"}, true);
					self.editorSetStyle(false, { 'font-weight': 'bold' }, true);
					e.preventDefault();
					return false;
				});

				document.getElementById('italic-btn').addEventListener('click', function (e) {
					//doc.execCommand('italic',false,null);
					//self.editorSetStyle("i", {"font-style" : "italic"}, true);
					self.editorSetStyle(false, { 'font-style': 'italic' }, true);
					e.preventDefault();
					return false;
				});

				document.getElementById('underline-btn').addEventListener('click', function (e) {
					//doc.execCommand('underline',false,null);
					//self.editorSetStyle("u", {"text-decoration" : "underline"}, true);
					self.editorSetStyle(false, { 'text-decoration': 'underline' }, true);
					e.preventDefault();
					return false;
				});

				document.getElementById('strike-btn').addEventListener('click', function (e) {
					//doc.execCommand('strikeThrough',false,null);
					//self.editorSetStyle("strike",  {"text-decoration" : "line-through"}, true);
					self.editorSetStyle(false, { 'text-decoration': 'line-through' }, true);
					e.preventDefault();
					return false;
				});

				document.getElementById('link-btn').addEventListener('click', function (e) {
					//doc.execCommand('createLink',false,"#");
					self.editorSetStyle('a');
					e.preventDefault();
					return false;
				});

				document.getElementById('fore-color').addEventListener('change', function (e) {
					//doc.execCommand('foreColor',false,this.value);
					self.editorSetStyle(false, { color: this.value });
					e.preventDefault();
					return false;
				});

				document.getElementById('back-color').addEventListener('change', function (e) {
					//doc.execCommand('hiliteColor',false,this.value);
					self.editorSetStyle(false, { 'background-color': this.value });
					e.preventDefault();
					return false;
				});

				document.getElementById('font-size').addEventListener('change', function (e) {
					//doc.execCommand('fontSize',false,this.value);
					self.editorSetStyle(false, { 'font-size': this.value });
					e.preventDefault();
					return false;
				});

				let sizes = "<option value=''> - Font size - </option>";
				for (let i = 1; i <= 128; i++) {
					sizes += "<option value='" + i + "px'>" + i + '</option>';
				}
				document.getElementById('font-size').innerHTML = sizes;

				document.getElementById('font-family').addEventListener('change', function (e) {
					let option = this.options[this.selectedIndex];
					let element = self.editorSetStyle(false, { 'font-family': this.value });
					Vvveb.FontsManager.addFont(option.dataset.provider, this.value, element);
					//doc.execCommand('fontName',false,this.value);
					e.preventDefault();
					return false;
				});

				document.getElementById('justify-btn').addEventListener('click', function (e) {
					//let command = "justify" + this.dataset.value;
					//doc.execCommand(command,false,"#");

					self.editorSetStyle(false, { 'text-align': e.srcElement.dataset.value });
					e.preventDefault();
					return false;
				});

				doc.addEventListener('keydown', (event) => {
					if (event.key === 'Enter') {
						let target = event.target.closest('[contenteditable]');
						if (target) {
							doc.execCommand('insertLineBreak');
							event.preventDefault();
						}
					}
				});
			},

			undo: function (element) {
				this.doc.execCommand('undo', false, null);
			},

			redo: function (element) {
				this.doc.execCommand('redo', false, null);
			},

			edit: function (element) {
				element.setAttribute('contenteditable', true);
				element.setAttribute('spellcheckker', false);
				document.getElementById('wysiwyg-editor').style.display = 'block';

				this.element = element;
				this.isActive = true;
				this.oldValue = element.innerHTML;

				document.getElementById('font-family').value = Vvveb.StyleManager.getStyle(
					element,
					'font-family'
				);
				document.getElementById('fore-color').value = Vvveb.StyleManager.getStyle(element, 'color');
				document.getElementById('back-color').value = Vvveb.StyleManager.getStyle(
					element,
					'background-color'
				);
				element.focus();
			},

			destroy: function (element) {
				element.removeAttribute('contenteditable');
				element.removeAttribute('spellcheckker');

				document.getElementById('wysiwyg-editor').style.display = 'none';
				this.isActive = false;

				let node = this.element;
				Vvveb.Undo.addMutation({
					type: 'characterData',
					target: node,
					oldValue: this.oldValue,
					newValue: node.innerHTML
				});
			}
		};

		Vvveb.Builder = {
			component: {},
			dragMoveMutation: false,
			isPreview: false,
			runJsOnSetHtml: false,
			designerMode: false,
			highlightEnabled: false,
			selectPadding: 0,
			leftPanelWidth: 275,
			ignoreClasses: ['clearfix', 'masonry', 'has-shadow'],

			// Vvveb.Builder.init()
			init: function (url, callback) {
				let self = this;

				self.loadControlGroups();
				self.loadBlockGroups();
				self.loadSectionGroups();

				self.selectedEl = null;
				self.highlightEl = null;
				self.initCallback = callback;

				self.documentFrame = document.querySelector('#iframe-wrapper > iframe');
				self.canvas = document.getElementById('canvas');

				// self._loadIframe(url + (url.indexOf('?') > -1 ? '&r=' : '?r=') + Math.random());
				self._loadIframe(url);

				self._initDragdrop();

				self._initBox();

				self.dragElement = null;

				self.highlightEnabled = true;

				self.leftPanelWidth = document.getElementById('left-panel').clientWidth;
			},
			/* controls */
			loadControlGroups: function () {
				// Base & Embeds
				let componentsList = document.querySelectorAll('.components-list');

				let item = {};
				let component = {};
				let count = 0;

				componentsList.forEach(function (list, i) {
					let type: 'leftpanel' | 'addbox' = list.dataset.type;

					list.replaceChildren();

					count++;

					// load each group and their components
					for (let group in Vvveb.ComponentsGroup) {
						list.append(
							generateElements(
								`<li class="header" data-section="${group}"  data-search="">
					<label class="header" for="${type}_comphead_${group}${count}">
						${group}<div class="header-arrow"></div>
					</label>
					<input class="header_check" type="checkbox" checked="true" id="${type}_comphead_${group}${count}">
					<ol></ol>
				</li>`
							)[0]
						);

						//list.append('<li class="header clearfix" data-section="' + group + '"  data-search=""><label class="header" for="' + type + '_comphead_' + group + count + '">' + group + '  <div class="header-arrow"></div>\
						//				   </label><input class="header_check" type="checkbox" checked="true" id="' + type + '_comphead_' + group + count + '">  <ol></ol></li>');

						let componentsSubList = list.querySelector('li[data-section="' + group + '"]  ol');

						let components = Vvveb.ComponentsGroup[group];

						for (let i in components) {
							const componentType = components[i];
							component = Vvveb.Components.get(componentType);

							if (component) {
								// generate dnd button
								item =
									generateElements(`<li data-section="${group}" data-drag-type="component" data-type="${componentType}" data-search="${component.name.toLowerCase()}">
							<span>${component.name}</span>
						</li>`)[0];

								// add special icons for each icon

								// if (component.image) {
								// 	item.style.backgroundImage = 'url(' + Vvveb.imgBaseUrl + component.image + ')';
								// 	item.style.backgroundRepeat = 'no-repeat';
								// }

								componentsSubList.append(item);
							} else {
								console.error(`Component: ${componentType} not defined.`);
							}
						}
					}
				});
			},

			loadSectionGroups: function () {
				let sectionsList = document.querySelectorAll('.sections-list');
				let item = {};

				sectionsList.forEach(function (list, i) {
					let type = list.dataset.type;
					list.replaceChildren();

					for (let group in Vvveb.SectionsGroup) {
						list.append(
							generateElements(
								`<li class="header" data-section="${group}"  data-search="">
					<label class="header" for="${type}_sectionhead_${group}">
						${group}<div class="header-arrow"></div>
					</label>
					<input class="header_check" type="checkbox" checked="true" id="${type}_sectionhead_${group}">
					<ol></ol>
				</li>`
							)[0]
						);

						let sectionsSubList = list.querySelector('li[data-section="' + group + '"]  ol');
						let sections = Vvveb.SectionsGroup[group];

						for (let i in sections) {
							const sectionType = sections[i];
							const section = Vvveb.Sections.get(sectionType);

							if (section) {
								let item =
									generateElements(`<li data-section="${group}" data-drag-type="section" data-type="${sectionType}" data-search="${section.name.toLowerCase()}">
									<span class="name">${section.name}</span>
									<div class="add-section-btn" title="Add section"><i class="la la-plus"></i></div>
									<img class="preview" src="" loading="lazy">
								</li>`)[0];

								if (section.image) {
									let image =
										(section.image.indexOf('/') == -1 ? Vvveb.imgBaseUrl : '') + section.image;

									/*
                            Object.assign(item.style,{
                                //backgroundImage: "url(" + image + ")",
                                //backgroundRepeat: "no-repeat"
                            });*/

									item.querySelector('img').setAttribute('src', image);
								}

								sectionsSubList.append(item);
							}
						}
					}
				});
			},

			loadBlockGroups: function () {
				let blocksList = document.querySelectorAll('.blocks-list');
				let item = {};

				blocksList.forEach(function (list, i) {
					let type = list.dataset.type;
					list.replaceChildren();

					for (let group in Vvveb.BlocksGroup) {
						list.append(
							generateElements(
								`<li class="header" data-section="${group}"  data-search="">
					<label class="header" for="${type}_blockhead_${group}">
						${group}<div class="header-arrow"></div>
					</label>
					<input class="header_check" type="checkbox" checked="true" id="${type}_blockhead_${group}">
					<ol></ol>
				</li>`
							)[0]
						);

						let blocksSubList = list.querySelector('li[data-section="' + group + '"]  ol');
						let blocks = Vvveb.BlocksGroup[group];

						for (let i in blocks) {
							const blockType = blocks[i];
							const block = Vvveb.Blocks.get(blockType);

							if (block) {
								item =
									generateElements(`<li data-section="${group}" data-drag-type="block" data-type="${blockType}" data-search="${block.name.toLowerCase()}">
									<span class="name">${block.name}</span>
									<img class="preview" src="" loading="lazy">
								</li>`)[0];

								if (block.image) {
									let image =
										(block.image.indexOf('/') == -1 ? Vvveb.imgBaseUrl : '') + block.image;
									/*
                            Object.assign(item.style,{
                                //backgroundImage: "url(" + image + ")",
                                //backgroundRepeat: "no-repeat"
                            });*/

									item.querySelector('img').setAttribute('src', image);
								}

								blocksSubList.append(item);
							}
						}
					}
				});
			},

			loadUrl: function (url, callback) {
				let self = this;
				document.getElementById('select-box').style.display = 'none';

				self.initCallback = callback;
				if (Vvveb.Builder.iframe.src != url) Vvveb.Builder.iframe.src = url;
			},

			/* iframe */
			_loadIframe: function (url) {
				let self = this;
				self.iframe = this.documentFrame;
				self.iframe.src = url;

				return this.documentFrame.addEventListener('load', function () {
					window.FrameWindow = self.iframe.contentWindow;
					window.FrameDocument = self.iframe.contentWindow.document;
					let addSectionBox = document.getElementById('add-section-box');
					let highlightBox = document.getElementById('highlight-box');
					let SelectBox = document.getElementById('select-box');

					highlightBox.style.display = 'none';

					window.FrameWindow.addEventListener('beforeunload', function (event) {
						if (Vvveb.Undo.undoIndex >= 0) {
							let dialogText = 'You have unsaved changes';
							event.returnValue = dialogText;
							return dialogText;
						}
					});

					window.FrameWindow.addEventListener('unload', function (event) {
						document.querySelector('.loading-message').classList.add('active');
						Vvveb.Undo.reset();
					});

					//prevent accidental clicks on links when editing text
					window.FrameDocument.addEventListener('click', function (event) {
						if (Vvveb.WysiwygEditor.isActive && event.target.closest('a')) {
							event.preventDefault();
							return false;
						}
					});

					let selectBoxPosition = function (event) {
						let pos;
						let target = self.selectedEl; // ?? self.highlightEl;

						highlightBox.style.display = 'none';

						if (target) {
							pos = offset(target);

							SelectBox.style.top =
								pos.top - (self.frameDoc.scrollTop ?? 0) - self.selectPadding + 'px';
							SelectBox.style.left =
								pos.left - (self.frameDoc.scrollLeft ?? 0) - self.selectPadding + 'px';

							SelectBox.style.width =
								(target.offsetWidth ?? target.clientWidth) + self.selectPadding * 2 + 'px';
							SelectBox.style.height =
								(target.offsetHeight ?? target.clientHeight) + self.selectPadding * 2 + 'px';
						}
					};

					window.FrameWindow.addEventListener('scroll', selectBoxPosition);
					window.FrameWindow.addEventListener('resize', selectBoxPosition);

					Vvveb.WysiwygEditor.init(window.FrameDocument);
					Vvveb.StyleManager.init(window.FrameDocument);
					Vvveb.ColorPaletteManager.init(window.FrameDocument);

					if (self.initCallback) self.initCallback();

					return self._frameLoaded();
				});
			},

			_frameLoaded: function () {
				let self = Vvveb.Builder;

				self.frameDoc = window.FrameDocument;
				self.frameHtml = window.FrameDocument.querySelector('html');
				self.frameBody = window.FrameDocument.querySelector('body');
				self.frameHead = window.FrameDocument.querySelector('head');

				//insert editor helpers like non editable areas
				// self.frameHead.append(
				// 	generateElements(
				// 		'<link data-vvveb-helpers href="' +
				// 			Vvveb.baseUrl +
				// 			'../../css/vvvebjs-editor-helpers.css" rel="stylesheet">'
				// 	)[0]
				// );

				// 2
				self._initHighlight();

				window.dispatchEvent(new CustomEvent('vvveb.iframe.loaded', { detail: self.frameDoc }));

				document.querySelector('.loading-message').classList.remove('active');

				//enable save button only if changes are made
				let setSaveButtonState = function (e) {
					if (Vvveb.Undo.hasChanges()) {
						document
							.querySelectorAll('#top-panel .save-btn')
							.forEach((e) => e.removeAttribute('disabled'));
					} else {
						document
							.querySelectorAll('#top-panel .save-btn')
							.forEach((e) => e.setAttribute('disabled', 'true'));
					}
				};

				Vvveb.Builder.frameBody.addEventListener('vvveb.undo.add', setSaveButtonState);
				Vvveb.Builder.frameBody.addEventListener('vvveb.undo.restore', setSaveButtonState);
			},

			_getElementType: function (el) {
				//search for component attribute
				let componentName = '';
				let componentAttribute = '';

				if (el.attributes) {
					for (let j = 0; j < el.attributes.length; j++) {
						let nodeName = el.attributes[j].nodeName;

						if (nodeName.indexOf('data-component') > -1) {
							componentName = nodeName.replace('data-component-', '');
							return [componentName, 'component'];
						}

						if (nodeName.indexOf('data-v-component-') > -1) {
							componentName = nodeName.replace('data-v-component-', '');
							return [componentName, 'component'];
						}

						if (nodeName.indexOf('data-v-') > -1) {
							componentAttribute =
								(componentAttribute ? componentAttribute + ' - ' : '') +
								nodeName.replace('data-v-', '') +
								' ';
						}
					}
				}

				if (componentAttribute != '') return [componentAttribute, 'attribute'];

				if (el.id) {
					componentName = '#' + el.id;
				} else {
					componentName =
						el.className && typeof el.className == 'string' ? '.' + el.className.split(' ')[0] : '';
				}

				return [componentName, el.tagName];
			},

			loadNodeComponent: function (node) {
				// console.log('loadNodeComponent', node);
				const data = Vvveb.Components.matchNode(node);
				let component;

				if (data) component = data.type;
				else component = Vvveb.defaultComponent;

				Vvveb.component = Vvveb.Components.get(component);
				Vvveb.Components.render(component);
				this.selectedComponent = component;
			},

			reloadComponent: function () {
				Vvveb.Components.render(this.selectedComponent);
			},

			moveNodeUp: function (node) {
				if (!node) {
					node = Vvveb.Builder.selectedEl;
				}

				const oldParent = node.parentNode;
				const oldNextSibling = node.nextSibling;
				const next = node.previousElementSibling;

				if (next) {
					next.before(node);
				} else {
					node.parentNode.before(node);
				}

				Vvveb.Builder.selectNode(node);

				const newParent = node.parentNode;
				const newNextSibling = node.nextSibling;

				Vvveb.Undo.addMutation({
					type: 'move',
					target: node,
					oldParent: oldParent,
					newParent: newParent,
					oldNextSibling: oldNextSibling,
					newNextSibling: newNextSibling
				});
			},

			moveNodeDown: function (node) {
				if (!node) {
					node = Vvveb.Builder.selectedEl;
				}

				const oldParent = node.parentNode;
				const oldNextSibling = node.nextSibling;
				const next = node.nextElementSibling;

				if (next) {
					next.after(node);
				} else {
					node.parentNode.after(node);
				}

				Vvveb.Builder.selectNode(node);

				const newParent = node.parentNode;
				const newNextSibling = node.nextSibling;

				Vvveb.Undo.addMutation({
					type: 'move',
					target: node,
					oldParent: oldParent,
					newParent: newParent,
					oldNextSibling: oldNextSibling,
					newNextSibling: newNextSibling
				});
			},

			cloneNode: function (node) {
				if (!node) {
					node = Vvveb.Builder.selectedEl;
				}

				const clone = node.cloneNode(true);
				node.after(clone);
				node.click();

				Vvveb.Undo.addMutation({
					type: 'childList',
					target: node.parentNode,
					addedNodes: [clone],
					nextSibling: node.nextSibling
				});
			},

			selectNode: function (node) {
				// console.log('selecting node:', node);
				let SelectBox = document.getElementById('select-box');

				if (!node) {
					SelectBox.style.display = 'none';
					return;
				}

				let self = this;
				let SelectActions = document.getElementById('select-actions');
				let AddSectionBtn = document.getElementById('add-section-btn');
				let elementType = this._getElementType(node);

				if (self.texteditEl && self.selectedEl != node) {
					Vvveb.WysiwygEditor.destroy(self.texteditEl);
					self.selectPadding = 0;
					SelectBox.classList.remove('text-edit');
					SelectActions.style.display = '';
					self.texteditEl = null;
				}

				if (elementType[1] == 'BODY') {
					SelectActions.style.display = 'none';
					AddSectionBtn.style.display = 'none';
				} else {
					SelectActions.style.display = '';
					AddSectionBtn.style.display = '';
				}

				let target = node;
				self.selectedEl = target;

				try {
					let pos = offset(target);
					let top = pos.top - (self.frameDoc.scrollTop ?? 0) - self.selectPadding;

					SelectBox.style.top = top + 'px';
					SelectBox.style.left =
						pos.left - (self.frameDoc.scrollLeft ?? 0) - self.selectPadding + 'px';
					SelectBox.style.width =
						(target.offsetWidth ?? target.clientWidth) + self.selectPadding * 2 + 'px';
					SelectBox.style.height =
						(target.offsetHeight ?? target.clientHeight) + self.selectPadding * 2 + 'px';
					SelectBox.style.display = 'block';

					//move actions toolbar to bottom if there is no space on top
					if (top < 30) {
						SelectActions.style.top = 'unset';
						SelectActions.style.bottom = '-25px';
					} else {
						SelectActions.style.top = '';
						SelectActions.style.bottom = '';
					}

					Vvveb.Breadcrumb.loadBreadcrumb(target);
				} catch (err) {
					console.log(err);
					return false;
				}

				document.querySelector('#highlight-name .type').innerHTML = elementType[0];
				document.querySelector('#highlight-name .name').innerHTML = elementType[1];
			},

			/* iframe highlight */
			_initHighlight: function () {
				let self = Vvveb.Builder;

				let highlightMove = function (event: MouseEvent) {
					if (self.highlightEnabled == true && event.target && isElement(event.target)) {
						// self.highlightEl = target = event.target;
						self.highlightEl = event.target;
						let target = event.target;
						let pos = offset(target);
						let height = target.offsetHeight;
						let halfHeight = Math.max(height / 2, 5);
						let width = target.offsetWidth;
						let halfWidth = Math.max(width / 2, 5);
						let prepend = true;

						let x = event.x;
						let y = event.y;

						if (self.isResize) {
							if (!self.initialPosition) {
								self.initialPosition = { x, y };
							}

							let deltaX = x - self.initialPosition.x;
							let deltaY = y - self.initialPosition.y;

							pos = offset(self.selectedEl);

							width = self.initialSize.width;
							height = self.initialSize.height;

							switch (self.resizeHandler) {
								// top
								case 'top-left':
									height -= deltaY;
									width -= deltaX;
									break;

								case 'top-center':
									height -= deltaY;
									break;

								case 'top-right':
									height -= deltaY;
									width += deltaX;
									break;

								// center
								case 'center-left':
									width -= deltaX;
									break;

								case 'center-right':
									width += deltaX;
									break;

								// bottom
								case 'bottom-left':
									width -= deltaX;
									height += deltaY;
									break;

								case 'bottom-center':
									height += deltaY;
									break;

								case 'bottom-right':
									width += deltaX;
									height += deltaY;
									break;
							}

							if (self.resizeMode == 'css') {
								self.selectedEl.style.width = width + 'px';
								self.selectedEl.style.height = height + 'px';
							} else {
								self.selectedEl.setAttribute('width', width);
								self.selectedEl.setAttribute('height', height);
							}

							let SelectBox = document.getElementById('select-box');
							SelectBox.style.top = pos.top - (self.frameDoc.scrollTop ?? 0) + 'px';
							SelectBox.style.left = pos.left - (self.frameDoc.scrollLeft ?? 0) + 'px';
							SelectBox.style.width = width + 'px';
							SelectBox.style.height = self.selectedEl.offsetHeight + 'px';
							SelectBox.style.display = 'block';
						} else if (self.isDragging) {
							let noChildren = {
								input: true,
								textarea: true,
								img: true,
								svg: true,
								iframe: true,
								embed: true,
								col: true,
								area: true,
								hr: true,
								br: true,
								wbr: true
							};

							let parent = self.highlightEl;

							if (self.dragType == 'section') {
								let closest = parent.closest('section, header, footer, body');
								if (closest) {
									parent = closest;
								}
								noChildren.section = true;
							}

							let parentTagName = parent.tagName.toLowerCase();
							let isVattribute = false;
							//check if node is a data-v-attribute dynamic node that will override the content if added inside
							if (parent.childElementCount == 0) {
								for (let attr of parent.attributes) {
									if (
										attr.name.startsWith('data-v-') &&
										!attr.name.startsWith('data-v-component-')
									) {
										isVattribute = true;
										break;
									}
								}
							}

							try {
								if (pos.top < y - halfHeight || pos.left < x - halfWidth) {
									if (noChildren[parentTagName] || isVattribute) {
										parent.after(self.dragElement);
									} else {
										if (parent == self.dragElement.parenNode) {
											parent.appendChild(self.dragElement);
										} else {
											parent.append(self.dragElement);
										}
									}

									prepend = true;
								} else {
									if (noChildren[parentTagName] || isVattribute) {
										parent.parentNode.insertBefore(self.dragElement, parent);
									} else {
										parent.prepend(self.dragElement);
									}

									prepend = false;
								}

								if (self.designerMode) {
									let parentOffset = offset(self.dragElement.offsetParent);
									self.dragElement.style.position = 'absolute';
									self.dragElement.style.x = x - (parentOffset.left - self.frameDoc.scrollLeft);
									self.dragElement.style.y = y - (parentOffset.top - self.frameDoc.scrollTop);
								}
							} catch (err) {
								console.log(err);
								return false;
							}

							if (!self.designerMode && self.iconDrag) {
								self.iconDrag.style.top = y + 60 + 'px';
								self.iconDrag.style.left = x + self.leftPanelWidth + 10 + 'px';
							}
						} // else //uncomment else to disable parent highlighting when dragging
						{
							//if text editor is open check if the highlighted element is not inside the editor
							if (Vvveb.WysiwygEditor.isActive) {
								if (self.texteditEl.contains(event.target)) {
									return true;
								}
							}

							document.getElementById('highlight-box').setAttribute(
								'style',
								`top:${pos.top - (self.frameDoc.scrollTop ?? 0)}px; 
						 left:${pos.left - (self.frameDoc.scrollLeft ?? 0)}px;
						 width:${width}px; 
						 height:${height}px;
						 display:${event.target.hasAttribute('contenteditable') ? 'none' : 'block'};
						 border:${self.isDragging ? '1px dashed #0d6efd' : ''};
					`
							);

							if (height < 50) {
								document.getElementById('section-actions').classList.add('outside');
							} else {
								document.getElementById('section-actions').classList.remove('outside');
							}

							let elementType = self._getElementType(event.target);
							document.querySelector('#highlight-name .type').innerHTML = elementType[0];
							document.querySelector('#highlight-name .name').innerHTML = elementType[1];
						}
					}
				};

				self.frameBody.addEventListener('mousemove', highlightMove);

				let highlightUp = function (event) {
					self.isResize = false;
					document
						.querySelectorAll('#section-actions, #highlight-name')
						.forEach((el) => (el.style.display = ''));
					if (self.isDragging) {
						self.isDragging = false;
						Vvveb.Builder.highlightEnabled = true;
						if (self.iconDrag) self.iconDrag.remove();
						document.getElementById('component-clone')?.remove();

						if (self.dragMoveMutation === false) {
							if (self.component.dragHtml || Vvveb.dragHtml) {
								//if dragHtml is set for dragging then set real component html
								if (self.component) {
									let newElement = generateElements(self.component.html)[0];
									self.dragElement.replaceWith(newElement);
									self.dragElement = newElement;
								}
							}

							if (self.component.afterDrop)
								self.dragElement = self.component.afterDrop(self.dragElement);
						} else {
							self.selectedEl.classList.remove('is-dragged');
							self.dragElement.replaceWith(self.selectedEl);
							self.dragElement = self.selectedEl;
						}

						const node = self.dragElement;
						self.selectNode(node);
						Vvveb.TreeList.loadComponents();
						Vvveb.TreeList.selectComponent(node);
						self.loadNodeComponent(node);

						//if component properties is loaded in left panel tab instead of right panel show tab
						let propertiesTab = document.querySelector('.component-properties-tab a');

						if (propertiesTab && propertiesTab.offsetParent) {
							//if properites tab is enabled/visible
							propertiesTab.style.display = '';
							console.log('show properites tab');
							// const bsTab = bootstrap.Tab.getOrCreateInstance(propertiesTab);
							// bsTab.show();
						}

						if (self.dragType == 'section') {
							node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
						}

						if (self.dragMoveMutation === false) {
							Vvveb.Undo.addMutation({
								type: 'childList',
								target: node.parentNode,
								addedNodes: [node],
								nextSibling: node.nextSibling
							});
						} else {
							self.dragMoveMutation.newParent = node.parentNode;
							self.dragMoveMutation.newNextSibling = node.nextSibling;

							Vvveb.Undo.addMutation(self.dragMoveMutation);
							self.dragMoveMutation = false;
						}
					}
				};

				self.frameBody.addEventListener('mouseup', highlightUp);

				let highlightDbClick = function (event) {
					if (Vvveb.Builder.isPreview == false) {
						if (!Vvveb.WysiwygEditor.isActive) {
							self.selectPadding = 10;
							// self.texteditEl = target = event.target;
							self.texteditEl = event.target;

							Vvveb.WysiwygEditor.edit(self.texteditEl);

							let _updateSelectBox = function (event) {
								if (!self.texteditEl) return;
								let pos = offset(self.selectedEl);

								let SelectBox = document.getElementById('select-box');

								SelectBox.style.top =
									pos.top - (self.frameDoc.scrollTop ?? 0) - self.selectPadding + 'px';
								SelectBox.style.left =
									pos.left - (self.frameDoc.scrollLeft ?? 0) - self.selectPadding + 'px';
								SelectBox.style.width = self.texteditEl.offsetWidth + self.selectPadding * 2 + 'px';
								SelectBox.style.height =
									self.texteditEl.offsetHeight + self.selectPadding * 2 + 'px';
								SelectBox.style.display = 'block';
							};

							//update select box when the text size is changed
							self.texteditEl.addEventListener('blur', _updateSelectBox);
							self.texteditEl.addEventListener('keyup', _updateSelectBox);
							self.texteditEl.addEventListener('paste', _updateSelectBox);
							self.texteditEl.addEventListener('input', _updateSelectBox);
							_updateSelectBox();

							document.getElementById('select-box').classList.add('text-edit');
							document.getElementById('select-actions').style.display = 'none';
							document.getElementById('highlight-box').style.display = 'none';
						}
					}
				};

				self.frameBody.addEventListener('dblclick', highlightDbClick);

				let highlightClick = function (event) {
					// console.log('highlightClick');
					if (Vvveb.Builder.isPreview == false) {
						if (event.target) {
							if (Vvveb.WysiwygEditor.isActive) {
								if (self.texteditEl.contains(event.target)) {
									return true;
								}
							}

							//if component properties is loaded in left panel tab instead of right panel show tab
							// let componentTab = document.querySelector('.component-properties-tab a');
							let componentTab = document.querySelector('#properties-tab');

							// show properties tab
							if (componentTab.offsetParent) {
								//if properites tab is enabled/visible
								componentTab.style.display = '';

								// 1. show properties tab
								activeElementsNavTabIndex = 2;

								// 2. show properties tab content
								// elementsNavTabs[activeElementsNavTabIndex].activeSubTabsIndex = 0;

								// const bsTab = bootstrap.Tab.getOrCreateInstance(componentTab);
								// bsTab.show();
							}

							self.selectNode(event.target);
							Vvveb.TreeList.selectComponent(event.target);
							self.loadNodeComponent(event.target);

							if (Vvveb.component && Vvveb.component.resizable) {
								document.getElementById('select-box').classList.add('resizable');
								self.resizeMode = Vvveb.component.resizeMode;
							} else {
								document.getElementById('select-box').classList.remove('resizable');
							}

							document.getElementById('add-section-box').style.display = 'none';
							event.preventDefault();
							return false;
						}
					}
				};

				self.frameBody.addEventListener('click', highlightClick);
			},

			_initBox: function () {
				let self = this;

				document.getElementById('drag-btn').addEventListener('mousedown', function (event) {
					//self.dragElement = self.selectedEl.setAttribute("style",Vvveb.dragElementStyle);
					if (event.which == 1) {
						//left click
						self.isDragging = true;
						document
							.querySelectorAll('#section-actions, #highlight-name, #select-box')
							.forEach((el) => (el.style.display = ''));

						if (self.designerMode) {
							self.dragElement = self.selectedEl;
						} else {
							self.selectedEl.style.position = '';
							self.selectedEl.style.top = '';
							self.selectedEl.style.left = '';

							self.selectedEl.classList.add('is-dragged');
							self.dragElement = generateElements(Vvveb.dragHtml)[0];
						}

						const node = self.selectedEl;

						self.dragMoveMutation = {
							type: 'move',
							target: node,
							oldParent: node.parentNode,
							oldNextSibling: node.nextSibling
						};

						//self.selectNode(false);
						event.preventDefault();
						return false;
					}
				});

				let resizeDown = function (event) {
					if (event.which == 1) {
						//left click
						document.querySelector(
							'#section-actions, #highlight-name, #highlight-box'
						).style.display = 'none';

						self.isResize = true;
						self.initialSize = {
							width: self.selectedEl.offsetWidth,
							height: self.selectedEl.offsetHeight
						};
						self.initialPosition = false;
						self.resizeHandler = this.className;

						event.preventDefault();
						return false;
					}
				};

				document
					.querySelectorAll('.resize > div')
					.forEach((e) => e.addEventListener('mousedown', resizeDown));

				document.getElementById('down-btn').addEventListener('click', function (event) {
					document.getElementById('select-box').style.display = 'none';

					Vvveb.Builder.moveNodeDown();

					event.preventDefault();
					return false;
				});

				document.getElementById('up-btn').addEventListener('click', function (event) {
					document.getElementById('select-box').style.display = 'none';

					Vvveb.Builder.moveNodeUp();

					event.preventDefault();
					return false;
				});

				document.getElementById('clone-btn').addEventListener('click', function (event) {
					Vvveb.Builder.cloneNode();

					event.preventDefault();
					return false;
				});

				document.getElementById('parent-btn').addEventListener('click', function (event) {
					const node = self.selectedEl.parentNode;

					self.selectNode(node);
					self.loadNodeComponent(node);
					Vvveb.TreeList.selectComponent(node);

					event.preventDefault();
					return false;
				});

				document.getElementById('save-reusable-btn').addEventListener('click', function (event) {
					const node = self.selectedEl;

					let type = 'block';
					if (node.tagName.toLowerCase() == 'section') {
						type = 'section';
					}

					const name = prompt('Enter name for new reusable ' + type, '');
					if (name) {
						Vvveb.Builder.saveElement(node, type, name);
					}

					event.preventDefault();
					return false;
				});

				let codeEditorOldValue;
				document.getElementById('edit-code-btn').addEventListener('click', function (event) {
					let value = Vvveb.Builder.selectedEl.innerHTML;

					Vvveb.ModalCodeEditor.show();
					Vvveb.ModalCodeEditor.setValue(value);

					codeEditorOldValue = value;

					event.preventDefault();
					return false;
				});

				let onSave = function (event) {
					Vvveb.Builder.selectedEl.innerHTML = event.detail;

					const node = Vvveb.Builder.selectedEl;
					Vvveb.Undo.addMutation({
						type: 'characterData',
						target: node,
						oldValue: codeEditorOldValue,
						newValue: node.innerHTML
					});

					Vvveb.Builder.selectNode(node);
				};

				window.addEventListener('vvveb.ModalCodeEditor.save', onSave);

				document.getElementById('translate-code-btn')?.addEventListener('click', function (event) {
					let selectedEl = Vvveb.Builder.selectedEl;
					let value = selectedEl.innerHTML.trim();
					// uncomment to use outerHTML, not recommended
					//let value = selectedEl.outerHTML;
					Vvveb.ModalCodeEditor.show();
					Vvveb.ModalCodeEditor.setValue(value);

					let onSave = function (event) {
						selectedEl.innerHTML = event.detail;
						//selectedEl.outerHTML = value;
					};

					window.removeEventListener('vvveb.ModalCodeEditor.save', onSave);
					window.addEventListener('vvveb.ModalCodeEditor.save', onSave);

					event.preventDefault();
					return false;
				});

				document.getElementById('delete-btn').addEventListener('click', function (event) {
					document.getElementById('select-box').style.display = 'none';

					const node = self.selectedEl;

					Vvveb.Undo.addMutation({
						type: 'childList',
						target: node.parentNode,
						removedNodes: [node],
						nextSibling: node.nextSibling
					});

					self.selectedEl.remove();
					Vvveb.TreeList.loadComponents();
					Vvveb.SectionList.loadSections();

					event.preventDefault();
					return false;
				});

				let addSectionBox = document.getElementById('add-section-box');
				let addSectionElement = {};

				document.getElementById('add-section-btn').addEventListener('click', function (event) {
					addSectionElement = self.highlightEl;
					addSectionBox.style.display = 'block';

					let pos = offset(addSectionElement);
					let top =
						pos.top +
						window.FrameWindow.pageYOffset +
						addSectionElement.clientTop -
						self.frameHtml.scrollTop +
						addSectionElement.offsetHeight;
					let left =
						pos.left +
						window.FrameWindow.pageXOffset +
						addSectionElement.clientLeft -
						self.frameHtml.scrollLeft +
						addSectionElement.offsetWidth / 2 -
						addSectionBox.offsetWidth / 2;
					let outerHeight = window.FrameWindow.innerHeight + self.frameHtml.scrollTop;

					//check if box is out of viewport and move inside
					if (left < 0) left = 0;
					if (top < 0) top = 0;
					if (left + addSectionBox.offsetWidth > self.frameHtml.offsetWidth)
						left = self.frameHtml.offsetWidth - addSectionBox.offsetWidth;
					if (top + addSectionBox.offsetHeight + self.frameHtml.scrollTop > outerHeight)
						top = top - addSectionBox.offsetHeight;

					addSectionBox.style.top = top + 'px';
					addSectionBox.style.left = left + 'px';

					event.preventDefault();
					return false;
				});

				document.getElementById('close-section-btn').addEventListener('click', function (event) {
					addSectionBox.style.display = 'none';
				});

				function addSectionComponent(component, after = true) {
					let node = generateElements(component.html)[0];

					if (after) {
						addSectionElement.after(node);
					} else {
						addSectionElement.append(node);
					}

					if (component.afterDrop) {
						node = component.afterDrop(node);
					}

					self.selectNode(node);
					self.loadNodeComponent(node);
					Vvveb.TreeList.loadComponents();
					Vvveb.TreeList.selectComponent(node);

					Vvveb.Undo.addMutation({
						type: 'childList',
						target: node.parentNode,
						addedNodes: [node],
						nextSibling: node.nextSibling
					});
				}

				addSectionBox.addEventListener('click', function (event) {
					let element = event.target.closest('.components-list li ol li');
					if (element) {
						let html = Vvveb.Components.get(element.dataset.type);

						addSectionComponent(
							html,
							document.querySelector("[name='add-section-insert-mode']:checked").value == 'after'
						);

						addSectionBox.style.display = 'none';
					}
				});

				addSectionBox.addEventListener('click', function (event) {
					let element = event.target.closest('.blocks-list li ol li');
					if (element) {
						let html = Vvveb.Blocks.get(element.dataset.type);

						addSectionComponent(
							html,
							document.querySelector("[name='add-section-insert-mode']:checked").value == 'after'
						);

						addSectionBox.style.display = 'none';
					}
				});

				addSectionBox.addEventListener('click', function (event) {
					let element = event.target.closest('.sections-list li ol li');
					if (element) {
						let html = Vvveb.Sections.get(element.dataset.type);

						addSectionComponent(
							html,
							document.querySelector("[name='add-section-insert-mode']:checked").value == 'after'
						);

						addSectionBox.style.display = 'none';
					}
				});
			},
			/* drag and drop */
			_initDragdrop: function () {
				let self = this;
				self.isDragging = false;

				document.addEventListener('mousedown', function (event) {
					let element = event.target.closest(
						'.drag-elements-sidepane ul > li > ol > li[data-drag-type]'
					);
					let html;

					if (element && event.which == 1) {
						//left click
						document.getElementById('component-clone')?.remove();
						document
							.querySelectorAll('#section-actions, #highlight-name, #select-box')
							.forEach((e) => (e.style.display = 'none'));

						self.dragType = element.dataset.dragType;

						if (self.dragType == 'component') {
							self.component = Vvveb.Components.get(element.dataset.type);
						} else if (self.dragType == 'section') {
							self.component = Vvveb.Sections.get(element.dataset.type);
						} else if (self.dragType == 'block') {
							self.component = Vvveb.Blocks.get(element.dataset.type);
						}

						if (self.component.dragHtml) {
							html = self.component.dragHtml;
						} else if (Vvveb.dragHtml) {
							html = Vvveb.dragHtml;
						} else {
							html = self.component.html;
						}

						self.dragElement = generateElements(html)[0];

						if (self.component.dragStart)
							self.dragElement = self.component.dragStart(self.dragElement);

						self.isDragging = true;
						if (Vvveb.dragIcon == 'html') {
							self.iconDrag = generateElements(html)[0];
							self.iconDrag.setAttribute('id', 'dragElement-clone');
							self.iconDrag.style.position = 'absolute';
						} else if (self.designerMode == false) {
							self.iconDrag = document.createElement('img');
							self.iconDrag.setAttribute('id', 'dragElement-clone');
							self.iconDrag.setAttribute(
								'src',
								element.style.backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1')
							);

							self.iconDrag.style.zIndex = '100';
							self.iconDrag.style.position = 'absolute';
							self.iconDrag.style.width = '64px';
							self.iconDrag.style.height = '64px';
							self.iconDrag.style.top = event.y + 'px';
							self.iconDrag.style.left = event.x + 'px';
						}

						document.body.append(self.iconDrag);

						event.preventDefault();
						return false;
					}
				});

				document.addEventListener('mouseup', function (event) {
					if (self.iconDrag && self.isDragging == true) {
						self.isDragging = false;
						document.getElementById('component-clone')?.remove();
						document
							.querySelectorAll('#section-actions, #highlight-name, #select-box')
							.forEach((el) => (el.style.display = ''));
						self.iconDrag.remove();
						if (self.dragElement) {
							self.dragElement.remove();
						}
					}
				});

				document.addEventListener('mousemove', function (event) {
					if (self.iconDrag && self.isDragging == true) {
						let x = event.clientX || event.clientX;
						let y = event.clientY || event.clientY;

						self.iconDrag.style.left = x - 60 + 'px';
						self.iconDrag.style.top = y - 30 + 'px';

						const elementMouseIsOver = document.elementFromPoint(x - 60, y - 40);

						//if drag elements hovers over iframe switch to iframe mouseover handler
						return;
						if (elementMouseIsOver && elementMouseIsOver.tagName == 'IFRAME') {
							self.frameBody.dispatchEvent(
								new MouseEvent('mousemove', {
									bubbles: true,
									cancelable: true
								})
							);

							event.stopPropagation();
							self.selectNode(false);
						}
					}
				});

				document.addEventListener('mouseup', function (event) {
					let element = event.target.closest('.drag-elements-sidepane ul > ol > li > li');
					if (element) {
						self.isDragging = false;
						document.getElementById('component-clone')?.remove();
						document
							.querySelectorAll('#section-actions, #highlight-name, #select-box')
							.forEach((el) => (el.style.display = ''));
					}
				});
			},

			removeHelpers: function (html, keepHelperAttributes = false) {
				//tags like stylesheets or scripts
				html = html.replace(/<[^>]+?data-vvveb-helpers.+?>/gi, '');
				//attributes
				if (!keepHelperAttributes) {
					html = html.replace(/\s*data-vvveb-\w+(=["'].*?["'])?\s*/gi, '');
				}

				html = html.replaceAll('vvveb-hidden', '');
				return html;
			},

			getHtml: function (keepHelperAttributes = true) {
				let doc = window.FrameDocument;
				let hasDoctpe = doc.doctype !== null;
				let html = '';

				doc
					.querySelectorAll('[contenteditable]')
					.forEach((e) => e.removeAttribute('contenteditable'));
				doc.querySelectorAll('[spellcheckker]').forEach((e) => e.removeAttribute('spellcheckker'));
				doc.querySelectorAll('script[src^="chrome-extension://"]').forEach((e) => e.remove());
				doc.querySelectorAll('script[src^="moz-extension://"]').forEach((e) => e.remove());

				// scroll page to top to avoid saving the page in a different state
				// like saving with sticky classes set for navbar etc
				// this.iframe.contentWindow.scrollTo(0,0);

				window.dispatchEvent(new CustomEvent('vvveb.getHtml.before', { detail: doc }));

				if (hasDoctpe)
					html =
						'<!DOCTYPE ' +
						doc.doctype.name +
						(doc.doctype.publicId ? ' PUBLIC "' + doc.doctype.publicId + '"' : '') +
						(!doc.doctype.publicId && doc.doctype.systemId ? ' SYSTEM' : '') +
						(doc.doctype.systemId ? ' "' + doc.doctype.systemId + '"' : '') +
						'>\n';

				Vvveb.FontsManager.cleanUnusedFonts();

				html += doc.documentElement.outerHTML;
				html = this.removeHelpers(html, keepHelperAttributes);

				window.dispatchEvent(new CustomEvent('vvveb.getHtml.after', { detail: doc }));
				window.dispatchEvent(new CustomEvent('vvveb.getHtml.filter', { detail: html }));

				return html;
			},

			setHtml: function (html) {
				//documentElement.innerHTML resets <head> each time and the page flickers
				//return window.FrameDocument.documentElement.innerHTML = html;

				function getTag(html, tag, outerHtml = false) {
					const start = html.indexOf('<' + tag);
					const end = html.indexOf('</' + tag);

					if (start >= 0 && end >= 0) {
						if (outerHtml) return html.slice(start, end + 3 + tag.length);
						else return html.slice(html.indexOf('>', start) + 1, end);
					} else {
						return html;
					}
				}

				if (this.runJsOnSetHtml) {
					this.frameBody.innerHTML = getTag(html, 'body');
				} else {
					window.FrameDocument.body.innerHTML = getTag(html, 'body');
				}

				//use outerHTML if you want to set body tag attributes
				//window.FrameDocument.body.outerHTML = getTag(html, "body", true);

				//set head html only if changed to avoid page flicker
				let headHtml = getTag(html, 'head');
				if (window.FrameDocument.head.innerHTML != headHtml) {
					window.FrameDocument.head.innerHTML = headHtml;
				}
			},

			saveElement: function (element, type, name, callback) {
				if (type == 'section') {
					Vvveb.Sections.add('reusable/' + name, {
						name,
						image: '/logo.svg',
						html: element.outerHTML
					});

					if (Vvveb.SectionsGroup['Reusable'] === undefined) {
						Vvveb.SectionsGroup['Reusable'] = [];
					}

					Vvveb.SectionsGroup['Reusable'].push('reusable/' + name);
					Vvveb.Builder.loadSectionGroups();
				} else {
					Vvveb.Blocks.add('reusable/' + name, {
						name,
						image: '/logo.svg',
						html: element.outerHTML
					});

					if (Vvveb.BlocksGroup['Reusable'] === undefined) {
						Vvveb.BlocksGroup['Reusable'] = [];
					}

					Vvveb.BlocksGroup['Reusable'].push('reusable/' + name);
					Vvveb.Builder.loadBlockGroups();
				}

				let data = { type, name, html: element.outerHTML };

				// TODO: Save reusable to DB
				// fetch(saveReusableUrl, { method: 'POST', body: new URLSearchParams(data) })
				// 	.then((response) => {
				// 		if (!response.ok) {
				// 			throw new Error(response);
				// 		}
				// 		return response.text();
				// 	})
				// 	.then((data) => {
				// 		if (callback) callback(data);
				// 		let bg = 'bg-success';
				// 		if (true || data.success || text == 'success') {
				// 		} else {
				// 			bg = 'bg-danger';
				// 		}

				// 		displayToast(bg, 'Save', data.message ?? data);
				// 	})
				// 	.catch((error) => {
				// 		console.log(error.statusText);
				// 		displayToast('bg-danger', 'Error', 'Error saving!');
				// 	});
			},

			saveAjax: function (data, saveUrl, callback, error) {
				//
				if (!data['file']) {
					data['file'] = Vvveb.FileManager.getCurrentFileName();
				}

				if (!data['startTemplateUrl']) {
					data['html'] = this.getHtml();
				}

				//data['elements'] = new URLSearchParams(data['elements']);

				return fetch(saveUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
					body: nestedFormData(data)
				})
					.then((response) => {
						if (!response.ok) {
							return Promise.reject(response);
						}
						return response.text();
					})
					.then((data) => {
						if (callback) callback(data);
						Vvveb.Undo.reset();
						document
							.querySelectorAll('#top-panel .save-btn')
							.forEach((e) => e.setAttribute('disabled', 'true'));
					})
					.catch((err) => {
						if (error) error(err);
						let message = error?.statusText ?? 'Error saving!';
						displayToast('bg-danger', 'Error', message);

						if (err.hasOwnProperty('text'))
							err.text().then((errorMessage) => {
								let message = errorMessage.substr(0, 200);
								displayToast('bg-danger', 'Error', message);
							});
					});
			},

			setDesignerMode: function (designerMode = false) {
				this.designerMode = designerMode;
			}
		};

		Vvveb.ModalCodeEditor = {
			modal: false,
			editor: false,

			init: function (modal = false, editor = false) {
				if (modal) {
					this.modal = modal;
				} else {
					this.modal = document.getElementById('codeEditorModal');
				}
				if (editor) {
					this.editor = editor;
				} else {
					this.editor = this.modal.querySelector('textarea');
				}

				let self = this;

				this.modal.querySelector('.save-btn').addEventListener('click', function (event) {
					window.dispatchEvent(
						new CustomEvent('vvveb.ModalCodeEditor.save', { detail: self.getValue() })
					);
					self.hide();
					return false;
				});
			},

			show: function (value) {
				if (!this.modal) {
					this.init();
				}

				const bsModal = bootstrap.Modal.getOrCreateInstance(this.modal);
				return bsModal.show();
			},

			hide: function (value) {
				const bsModal = bootstrap.Modal.getOrCreateInstance(this.modal);
				return bsModal.hide();
			},

			getValue: function () {
				return this.editor.value;
			},

			setValue: function (value) {
				if (!this.modal) {
					this.init();
				}
				//enable save button
				document
					.querySelectorAll('#top-panel .save-btn')
					.forEach((e) => e.removeAttribute('disabled'));
				this.editor.value = value;
			}
		};

		Vvveb.CodeEditor = {
			isActive: false,
			oldValue: '',
			doc: false,
			textarea: false,

			init: function (doc) {
				this.textarea = document.querySelector('#vvveb-code-editor textarea');
				this.textarea.value = Vvveb.Builder.getHtml();

				this.textarea.addEventListener('keyup', (e) => {
					delay(() => Vvveb.Builder.setHtml(this.value), 1000);
				});

				//load code on document changes
				Vvveb.Builder.frameBody.addEventListener('vvveb.undo.add', () =>
					Vvveb.CodeEditor.setValue()
				);
				Vvveb.Builder.frameBody.addEventListener('vvveb.undo.restore', () =>
					Vvveb.CodeEditor.setValue()
				);

				//load code when a new url is loaded
				Vvveb.Builder.documentFrame.addEventListener('load', () => Vvveb.CodeEditor.setValue());

				this.isActive = true;
			},

			setValue: function (value) {
				if (this.isActive) {
					this.textarea.value = Vvveb.Builder.getHtml();
				}
			},

			destroy: function (element) {
				//this.isActive = false;
			},

			toggle: function () {
				if (this.isActive != true) {
					this.isActive = true;
					return this.init();
				}
				this.isActive = false;
				this.destroy();
			}
		};

		Vvveb.CssEditor = {
			isActive: false,
			oldValue: '',
			doc: false,
			textarea: false,

			init: function (doc) {
				this.textarea = document.getElementById('css-editor');
				this.textarea.value = Vvveb.StyleManager.getCss();
				let self = this;

				document.querySelectorAll('[href="#css-tab"],[href="#configuration"]').forEach((t) =>
					t.addEventListener('click', (e) => {
						self.textarea.value = Vvveb.StyleManager.getCss();
					})
				);

				this.textarea.addEventListener('keyup', (e) => {
					delay(() => Vvveb.StyleManager.setCss(self.textarea.value), 1000);
				});
			},

			getValue: function () {
				return this.textarea.value;
			},

			setValue: function (value) {
				this.textarea.value = value;
				Vvveb.StyleManager.setCss(value);
			},

			destroy: function () {}
		};

		function displayToast(bg, title, message, id = 'top-toast') {
			document.querySelector('#' + id + ' .toast-body .message').innerHTML = message.replace(
				/(?:\r\n|\r|\n)/g,
				'<br>'
			);
			let header = document.querySelector('#' + id + ' .toast-header');
			header.classList.remove('bg-danger', 'bg-success');
			header.classList.add(bg);
			header.querySelector('strong').innerHTML = title;
			document.querySelector('#' + id + ' .toast').classList.add('show');
			delay(() => document.querySelector('#' + id + ' .toast').classList.remove('show'), 5000);
		}

		Vvveb.Gui = {
			init: function () {
				document.querySelectorAll('[data-vvveb-action]').forEach(function (el, i) {
					const on = el.dataset.vvvebOn ?? 'click';
					el.addEventListener(on, Vvveb.Gui[el.dataset.vvvebAction]);
				});

				this.shortcuts();
			},

			shortcuts: function () {
				let self = this;

				let handleShortcuts = function (e) {
					if (e.ctrlKey) {
						switch (e.key) {
							case 's':
								e.preventDefault();
								let btn = document.querySelector('.save-btn');
								let url = btn.dataset.vvvebUrl;
								self.saveAjax(null, url, document.querySelector('.save-btn'));
								return;
							case 'z':
								e.preventDefault();
								self.undo();
								return;
							case 'Z':
							case 'y':
								e.preventDefault();
								self.redo();
								return;
							case 'L':
								e.preventDefault();
								self.toggleTreeList();
								return;
							case 'e':
								e.preventDefault();
								self.toggleEditor();
								return;
							case 'P':
								e.preventDefault();
								self.newPage();
								return;
						}
					}
				};

				//handle shortcuts from main window and iframe also
				document.addEventListener('keydown', handleShortcuts);
				window.addEventListener('vvveb.iframe.loaded', () => {
					Vvveb.Builder.frameBody.addEventListener('keydown', handleShortcuts);
				});
			},

			undo: function () {
				if (Vvveb.WysiwygEditor.isActive) {
					Vvveb.WysiwygEditor.undo();
				} else {
					Vvveb.Undo.undo();
				}
				Vvveb.Builder.selectNode();
			},

			redo: function () {
				if (Vvveb.WysiwygEditor.isActive) {
					Vvveb.WysiwygEditor.redo();
				} else {
					Vvveb.Undo.redo();
				}
				Vvveb.Builder.selectNode();
			},

			//show modal with html content
			save: function () {
				document.getElementById('textarea-modal textarea').value = Vvveb.Builder.getHtml();
				document.getElementById('textarea-modal').modal();
			},

			//post html content through ajax to save to filesystem/db
			saveAjax: function (event, saveUrl = null, saveBtn = null) {
				let btn = saveBtn ?? this;
				saveUrl = saveUrl ?? this.dataset.vvvebUrl;
				let file = Vvveb.FileManager.getPageData('file');
				//if offcanvas check if user provided new template name
				if (btn.classList.contains('save-offcanvas')) {
					if (document.querySelector('#save-offcanvas [name=template]:checked').value == 'new') {
						file =
							document.querySelector('#save-offcanvas [name=folder]').value +
							'/' +
							document.querySelector('#save-offcanvas [name=file]').value;
					}
				}

				btn.querySelector('.loading').classList.remove('d-none');
				btn.querySelector('.button-text').classList.add('d-none');

				return Vvveb.Builder.saveAjax(
					{ file },
					saveUrl,
					(data) => {
						//use toast to show save status

						let bg = 'bg-success';
						if (true || data.success || data == 'success') {
							document
								.querySelectorAll('#top-panel .save-btn')
								.forEach((e) => e.setAttribute('disabled', 'true'));
						} else {
							bg = 'bg-danger';
						}

						displayToast(bg, 'Save', data.message ?? data);

						const offcanvas = document.getElementById('save-offcanvas');
						if (offcanvas) {
							let instance = bootstrap.Offcanvas.getInstance(offcanvas);
							if (instance) instance.hide();
						}

						btn.querySelector('.loading').classList.add('d-none');
						btn.querySelector('.button-text').classList.remove('d-none');
					},
					(error) => {
						btn.querySelector('.loading').classList.add('d-none');
						btn.querySelector('.button-text').classList.remove('d-none');
						let message = error?.statusText ?? 'Error saving!';
						displayToast('bg-danger', 'Error', message);
					}
				);
			},

			download: function () {
				const filename = /[^\/]+$/.exec(Vvveb.Builder.iframe.src)[0];
				const uriContent =
					'data:application/octet-stream,' + encodeURIComponent(Vvveb.Builder.getHtml());

				let link = document.createElement('a');
				if ('download' in link) {
					link.dataset.download = filename;
					link.href = uriContent;
					link.target = '_blank';

					document.body.appendChild(link);
					const result = link.click();
					document.body.removeChild(link);
					link.remove();
				} else {
					location.href = uriContent;
				}
			},

			viewport: function () {
				document.getElementById('canvas').setAttribute('class', this.dataset.view);
				document.getElementById('iframe1').removeAttribute('style');
				document
					.querySelectorAll('.responsive-btns .active')
					.forEach((e) => e.classList.remove('active'));
				if (this.dataset.view) this.classList.add('active');
			},

			toggleEditor: function () {
				document.getElementById('vvveb-builder').classList.toggle('bottom-panel-expand');
				document.getElementById('toggleEditorJsExecute').classList.toggle('d-none');
				//hide breadcrumb when showing the editor
				document.querySelector('.breadcrumb-navigator .breadcrumb').classList.toggle('d-none');
				Vvveb.CodeEditor.toggle();
			},

			toggleEditorJsExecute: function () {
				Vvveb.Builder.runJsOnSetHtml = this.checked;
			},

			preview: function () {
				Vvveb.Builder.isPreview == true
					? (Vvveb.Builder.isPreview = false)
					: (Vvveb.Builder.isPreview = true);
				document.getElementById('iframe-layer').classList.toggle('d-none');
				document.getElementById('vvveb-builder').classList.toggle('preview');
			},

			fullscreen: function () {
				launchFullScreen(document); // the whole page
			},

			search: function () {
				let searchText = this.value;
				let panel = this.parentNode.parentNode.querySelector('div > ul');
				panel.querySelectorAll('li ol li').forEach(function (el, i) {
					el.style.display = 'none';
					if (el.dataset.search.indexOf(searchText) > -1) el.style.display = '';
				});
			},

			clearSearch: function (e) {
				let input = this.parentNode.querySelector('input');
				input.value = '';
				input.dispatchEvent(
					new KeyboardEvent('keyup', {
						bubbles: true,
						cancelable: true
					})
				);
			},

			expand: function (e) {
				this.parentNode.parentNode.parentNode
					.querySelectorAll('input.header_check[type="checkbox"]')
					.forEach((e) => (e.checked = true));
			},

			collapse: function (e) {
				this.parentNode.parentNode.parentNode
					.querySelectorAll('input.header_check[type="checkbox"]')
					.forEach((e) => (e.checked = false));
			},

			//Pages, file/components tree
			newPage: function () {
				let newPageModal = document.getElementById('new-page-modal');
				let form = newPageModal.querySelector('form');

				const bsModal = bootstrap.Modal.getOrCreateInstance(newPageModal);
				bsModal.show();

				let submitForm = function (e) {
					let data = {};
					this.querySelectorAll(
						'input[type=text],input[type=checkbox]:checked,input[type=radio]:checked,input[name=image], select:not(:disabled)'
					).forEach((el, i) => {
						if (el.offsetParent || el.name == 'image') data[el.name] = el.value;
					});

					if (data['file']) {
						data['title'] = data['file'].replace('/', '').replace('.html', '');
						//let name = data['name'] = data['folder'].replace('/', '_') + "-" + data['title'];
						if (!data['name']) {
							data['name'] = data['title'];
						}
						data['url'] = data['file'] = data['folder'] + '/' + data['file'];
						//data['url']  = Vvveb.themeBaseUrl + data['url'];
					}

					e.preventDefault();

					return Vvveb.Builder.saveAjax(data, this.action, function (savedData) {
						data.title = data.name;

						if (typeof savedData === 'object' && savedData !== null) {
							data.name = savedData.name ?? data.name;
							data.url = savedData.url ?? data.url;
							data.file = savedData.file ?? data.file;
							data.title = savedData.title ?? data.title;
						}

						let page = Vvveb.FileManager.addPage(data.name, data);
						Vvveb.FileManager.loadPage(data.name);
						Vvveb.FileManager.scrollToPage(page);
						bsModal.hide();
					});
				};

				if (!form.dataset.init) {
					form.addEventListener('submit', submitForm);
					form.dataset.init = true;
				}
			},

			setDesignerMode: function () {
				//aria-pressed attribute is updated after action is called and we check for false instead of true
				let designerMode = this.attributes['aria-pressed'].value == 'true';
				Vvveb.Builder.setDesignerMode(designerMode);
			},

			//layout
			togglePanel: function (panel, cssVar) {
				panel = document.querySelector(panel);
				let body = document.querySelector('body');
				let prevValue = getComputedStyle(body).getPropertyValue(cssVar);
				let visible = false;

				if (prevValue !== '0px') {
					panel.dataset.layoutToggle = prevValue;
					body.style.setProperty(cssVar, '0px');
					panel.style.display = 'none';
					visible = false;
				} else {
					prevValue = panel.dataset.layoutToggle;
					body.style.setProperty(cssVar, '');
					panel.style.display = '';
					visible = true;
				}

				return visible;
			},

			toggleFileManager: function () {
				Vvveb.Gui.togglePanel('#filemanager', '--builder-filemanager-height');
			},

			toggleLeftColumn: function () {
				Vvveb.Gui.togglePanel('#left-panel', '--builder-left-panel-width');
			},

			toggleRightColumn: function (rightColumnEnabled = null) {
				rightColumnEnabled = Vvveb.Gui.togglePanel('#right-panel', '--builder-right-panel-width');

				document.getElementById('vvveb-builder').classList.toggle('no-right-panel');
				document.querySelector('.component-properties-tab').classList.toggle('d-none');

				Vvveb.Components.componentPropertiesElement =
					(rightColumnEnabled ? '#right-panel' : '#left-panel #properties') +
					' .component-properties';
				let componentTab = document.querySelector('#components-tab');

				if (document.getElementById('properties').offsetParent) {
					const bsTab = bootstrap.Tab.getOrCreateInstance(componentTab);
					componentTab.style.display = '';
					bsTab.show();
				}
			},

			toggleTreeList: function () {
				let treeList = document.getElementById('tree-list');
				treeList.classList.toggle('d-none');
				if (!treeList.offsetParent) {
					document.getElementById('toggle-tree-list').classList.remove('active');
				}
			},

			zoomChange: function () {
				let wrapper = document.getElementById('iframe-wrapper');
				let scale = '';
				let height = '';
				if (this.value != '100') {
					scale = 'scale(' + this.value + '%)';
					height = (100 / this.value) * 100 + '%';
				}
				wrapper.style.transform = scale;
				wrapper.style.height = height;
			},

			setState: function () {
				Vvveb.StyleManager.setState(this.value);
				Vvveb.Builder.reloadComponent();
			}
		};

		Vvveb.StyleManager = {
			styles: {},
			cssContainer: false,
			mobileWidth: '320px',
			tabletWidth: '768px',
			doc: false,
			inlineCSS: false,
			currentElement: null,
			currentSelector: null,
			state: '', //hover, active etc

			init: function (doc) {
				if (doc) {
					this.doc = doc;

					let style = false;
					let _style = false;

					//check if editor style is present
					for (let i = 0; i < doc.styleSheets.length; i++) {
						_style = doc.styleSheets[i];
						if (_style.ownerNode.id && _style.ownerNode.id == 'vvvebjs-styles') {
							style = _style.ownerNode;
							break;
						}
					}

					//if style element does not exist create it
					if (!style) {
						style = generateElements('<style id="vvvebjs-styles"></style>')[0];
						doc.head.append(style);
						return (this.cssContainer = style);
					}

					//if it exists
					this.cssContainer = style;
					this.loadCss();

					return this.cssContainer;
				}
			},

			loadCss: function () {
				let style = this.cssContainer.sheet;
				//if style exist then load all css styles for editor
				for (let j = 0; j < style.cssRules.length; j++) {
					const media =
						typeof style.cssRules[j].media === 'undefined'
							? 'desktop'
							: style.cssRules[j].media[0] === 'screen and (max-width: 1220px)'
								? 'tablet'
								: style.cssRules[j].media[0] === 'screen and (max-width: 320px)'
									? 'mobile'
									: 'desktop';

					const selector =
						media === 'desktop'
							? style.cssRules[j].selectorText
							: style.cssRules[j].cssRules[0].selectorText;
					const styles =
						media === 'desktop' ? style.cssRules[j].style : style.cssRules[j].cssRules[0].style;

					if (media) {
						this.styles[media] = this.styles[media] ?? {};
						if (selector) {
							this.styles[media][selector] = {};

							for (let k = 0; k < styles.length; k++) {
								const property = styles[k];
								const value = styles[property];

								this.styles[media][selector][property] = value;
							}
						}
					}
				}
			},

			getSelectorForElement: function (element) {
				if (!element) return '';

				let currentElement = element;
				let selector = [];

				while (currentElement.parentElement) {
					let elementSelector = '';
					let classSelector = Array.from(currentElement.classList)
						.map(function (className) {
							if (Vvveb.Builder.ignoreClasses.indexOf(className) == -1) {
								return '.' + className;
							}
						})
						.join('');

					//element (tag) selector
					let tag = currentElement.tagName.toLowerCase();
					//exclude top most element body unless the parent element is body
					if (tag == 'body' && selector.length > 1) {
						break;
					}

					//stop at a unique element (with id)
					if (currentElement.id) {
						elementSelector = '#' + currentElement.id;
						selector.push(elementSelector);
						break;
					} else if (classSelector) {
						//class selector
						elementSelector = classSelector;
					} else {
						//element selector
						elementSelector = tag;
					}

					if (elementSelector) {
						selector.push(elementSelector);
					}

					currentElement = currentElement.parentElement;
				}

				return selector.reverse().join(' > ');
			},

			setState: function (state) {
				this.state = state;
			},

			addSelectorState: function (selector) {
				return selector + (this.state ? ':' + this.state : '');
			},

			setStyle: function (element, styleProp, value) {
				let selector;

				if (typeof element == 'string') {
					selector = element;
				} else {
					let node = element;

					//if propert is set with inline style attribute then override it and don't save to css
					//inline text editor sets properties like font-size inline that can't be later overriten from css
					if (node.style && node.style[styleProp]) {
						node.style[styleProp] = value;
						return element;
					}

					selector = this.getSelectorForElement(node);
				}

				if (this.inlineCSS) {
					element.style[styleProp] = value;
					return element;
				}

				selector = this.addSelectorState(selector);

				const media = document.getElementById('canvas').classList.contains('tablet')
					? 'tablet'
					: document.getElementById('canvas').classList.contains('mobile')
						? 'mobile'
						: 'desktop';

				//styles[media][selector][styleProp] = value
				if (!this.styles[media]) {
					this.styles[media] = {};
				}
				if (!this.styles[media][selector]) {
					this.styles[media][selector] = {};
				}
				if (!this.styles[media][selector][styleProp]) {
					this.styles[media][selector][styleProp] = {};
				}
				this.styles[media][selector][styleProp] = value;

				this.generateCss(media);

				return element;
				//uncomment bellow code to set css in element's style attribute
				//return element.css(styleProp, value);
			},

			setCss: function (css) {
				this.cssContainer.innerHTML = css;
				this.loadCss();
			},

			getCss: function (css) {
				return this.cssContainer.innerHTML;
			},

			generateCss: function (media) {
				//let css = "";
				//for (selector in this.styles[media]) {

				//	css += `${selector} {`;
				//	for (property in this.styles[media][selector]) {
				//		value = this.styles[media][selector][property];
				//		css += `${property}: ${value};`;
				//	}
				//	css += '}';
				//}

				//this.cssContainer.innerHTML = css;

				//return element;
				//refresh container element to avoid issues with changes from code editor
				this.cssContainer = this.doc.getElementById('vvvebjs-styles');

				let css = '';
				for (media in this.styles) {
					if (media === 'tablet' || media === 'mobile') {
						css += `@media screen and (max-width: ${media === 'tablet' ? this.tabletWidth : this.mobileWidth}){\n\n`;
					}
					for (let selector in this.styles[media]) {
						css += `${selector} {\n`;
						for (let property in this.styles[media][selector]) {
							const value = this.styles[media][selector][property];
							css += `\t${property}: ${value};\n`;
						}
						css += '}\n\n';
					}
					if (media === 'tablet' || media === 'mobile') {
						css += `}\n\n`;
					}
				}

				return (this.cssContainer.innerHTML = css);
			},

			_getCssStyle: function (element, styleProp) {
				let value = '',
					el,
					selector,
					media;

				el = element;
				if (el != this.currentElement) {
					selector = this.getSelectorForElement(el);
					this.currentElement = el;
					this.currentSelector = selector;
				} else {
					selector = this.currentSelector;
				}

				selector = this.addSelectorState(selector);
				media = document.getElementById('canvas').classList.contains('tablet')
					? 'tablet'
					: document.getElementById('canvas').classList.contains('mobile')
						? 'mobile'
						: 'desktop';

				if (el.style && el.style.length > 0 && el.style[styleProp]) {
					//check inline
					value = el.style[styleProp];
				} else if (
					this.styles[media] !== undefined &&
					this.styles[media][selector] !== undefined &&
					this.styles[media][selector][styleProp] !== undefined
				) {
					//check defined css
					value = this.styles[media][selector][styleProp];

					if (styleProp == 'font-family') {
					}
				} else if (window.getComputedStyle) {
					value = document.defaultView.getDefaultComputedStyle
						? document.defaultView.getDefaultComputedStyle(el, null).getPropertyValue(styleProp)
						: window.getComputedStyle(el, null).getPropertyValue(styleProp);
				}

				return value;
			},

			getStyle: function (element, styleProp) {
				return this._getCssStyle(element, styleProp);
			}
		};

		Vvveb.ContentManager = {
			getAttr: function (element, attrName) {
				return element.getAttribute(attrName);
			},

			setAttr: function (element, attrName, value) {
				return element.setAttribute(attrName, value);
			},

			setHtml: function (element, html) {
				return (element.innerHTML = html);
			},

			getHtml: function (element) {
				return element.innerHTML;
			},

			setText: function (element, text) {
				return (element.textContent = text);
			},

			getText: function (element) {
				return element.textContent;
			}
		};

		function getNodeTree(node, parent, allowedComponents, idToNode = {}) {
			function getNodeTreeTraverse(node, parent, id = '') {
				if (node.hasChildNodes()) {
					for (let j = 0; j < node.childNodes.length; j++) {
						const child = node.childNodes[j];

						//skip text and comments nodes
						if (child.nodeType == 3 || child.nodeType == 8) {
							continue;
						}

						let element;
						let matchChild;
						if (
							child &&
							child['attributes'] != undefined &&
							(matchChild = Vvveb.Components.matchNode(child))
						) {
							if (
								Array.isArray(allowedComponents) &&
								allowedComponents.indexOf(matchChild.type) == -1
							) {
								element = getNodeTreeTraverse(child, parent);
								continue;
							}

							element = {
								name: matchChild.name,
								image: matchChild.image,
								type: matchChild.type,
								node: child,
								id: id + '-' + j,
								children: []
							};

							element.children = [];
							parent.push(element);
							idToNode[id + '-' + j] = child;

							element = getNodeTreeTraverse(child, element.children, id + '-' + j);
						} else {
							element = getNodeTreeTraverse(child, parent, id + '-' + j);
						}
					}
				}

				return false;
			}

			getNodeTreeTraverse(node, parent, '1');
		}

		function drawComponentsTree(tree) {
			let j = 1;
			let prefix = Math.floor(Math.random() * 100);

			function drawComponentsTreeTraverse(tree) {
				let list = document.createElement('ol');
				j++;

				for (let i in tree) {
					let node = tree[i];
					let id = node.id;
					let li;

					if (!id) {
						id = prefix + '-' + j + '-' + i;
					}

					if (tree[i].children.length > 0) {
						li = generateElements(
							'<li data-component="' +
								node.name +
								'">\
								<label for="id' +
								id +
								'" style="background-image:url(' +
								Vvveb.imgBaseUrl +
								node.image +
								')"><span>' +
								node.name +
								'</span></label>\
								<input type="checkbox" id="id' +
								id +
								'">\
							</li>'
						)[0];
						li.append(drawComponentsTreeTraverse(node.children));
					} else {
						li = generateElements(
							'<li data-component="' +
								node.name +
								'" class="file">\
							<label for="id' +
								id +
								'" style="background-image:url(' +
								Vvveb.imgBaseUrl +
								node.image +
								')"><span>' +
								node.name +
								'</span></label>\
							<input type="checkbox" id="id' +
								id +
								'">\
							</li>'
						)[0];
					}

					li._treeNode = node.node;
					list.append(li);
				}

				return list;
			}

			return drawComponentsTreeTraverse(tree);
		}

		let selected = null;
		let dragover = null;

		Vvveb.SectionList = {
			selector: '.sections-container',
			allowedComponents: {},

			init: function (allowedComponents = {}) {
				this.allowedComponents = allowedComponents;

				document.querySelector(this.selector).addEventListener('click', function (e) {
					let element = e.target.closest(':scope > div .controls');
					if (element) {
						let node = element.parentNode._node;
						if (node) {
							node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
							//node.click();
							Vvveb.Builder.selectNode(node);
							Vvveb.Builder.loadNodeComponent(node);
						}
					}
				});

				document.querySelector(this.selector).addEventListener('dblclick', function (e) {
					let element = e.target.closest(':scope > div');
					if (element) {
						const node = element._node;
						node.click();
					}
				});

				document.querySelector(this.selector).addEventListener('click', function (e) {
					let element = e.target.closest('li[data-component] label');
					if (element) {
						let node = element.parentNode._node;
						if (node) {
							node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
							node.click();
						}
					}
				});

				document.querySelector(this.selector).addEventListener('mouseenter', function (e) {
					let element = e.target.closest('li[data-component] label');
					if (element) {
						const node = document.querySelector(element.parentNode._node);
						node.css('outline', '1px dashed blue');
					}
				});

				document.querySelector(this.selector).addEventListener('mouseleave', function (e) {
					let element = e.target.closest('li[data-component] label');
					if (element) {
						const node = document.querySelector(element.parentNode._node);
						node.css('outline', '');
						if (node.getAttribute('style') == '') node.removeAttribute('style');
					}
				});

				document.querySelector(this.selector).addEventListener('dragstart', this.dragStart);
				document.querySelector(this.selector).addEventListener('dragover', this.dragOver);
				document.querySelector(this.selector).addEventListener('dragend', this.dragEnd);

				document.querySelector(this.selector).addEventListener('click', function (e) {
					let element = e.target.closest('.delete-btn');
					if (element) {
						let section = element.closest('.section-item');
						let node = section._node;
						node.remove();
						section.remove();
						Vvveb.TreeList.loadComponents();

						e.stopPropagation();
						e.preventDefault();
					}
				});

				let sectionIn;
				let img = document.querySelector('.block-preview img');
				document.querySelector('.sections-list').addEventListener('mouseover', function (e) {
					let element = e.target.closest('li[data-type]');
					if (element) {
						if (sectionIn != element) {
							let src = element.querySelector('img').getAttribute('src');
							sectionIn = element;
							img.setAttribute('src', src);
							img.style.display = '';
						}
					} else {
						sectionIn = element;
						img.setAttribute('src', '');
						img.style.display = 'none';
					}
				});

				let self = this;
				document.querySelector('.sections-list').addEventListener('click', function (e) {
					let element = e.target.closest('.add-section-btn');
					if (element) {
						let item = element.closest('li');
						let section = Vvveb.Sections.get(item.dataset.type);
						let node = generateElements(section.html)[0];
						let sectionType = node.tagName.toLowerCase();
						let afterSection = Vvveb.Builder.frameBody.querySelector(
							':scope > ' + sectionType + ':last-of-type'
						);

						if (afterSection) {
							afterSection.after(node);
						} else {
							if (sectionType == 'nav') {
								afterSection = Vvveb.Builder.frameBody.querySelector(
									':scope > nav:first,> header:last-of-type'
								);

								if (afterSection) {
									afterSection.before(node);
								} else {
									Vvveb.Builder.frameBody.append(node);
								}
							} else if (sectionType != 'footer') {
								afterSection = Vvveb.Builder.frameBody.querySelector('body > footer:last-of-type');

								if (afterSection) {
									afterSection.before(node);
								} else {
									Vvveb.Builder.frameBody.append(node);
								}
							} else {
								Vvveb.Builder.frameBody.append(node);
							}
						}

						node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
						//node.click();
						Vvveb.Builder.selectNode(node);
						Vvveb.Builder.loadNodeComponent(node);
						/*
                Vvveb.Builder.frameHtml.animate({
                    scrollTop: node.offset().top
                }, 1000);
            	
                delay(() => node.click(), 1000);
                */

						Vvveb.Undo.addMutation({
							type: 'childList',
							target: node.parentNode,
							addedNodes: [node],
							nextSibling: node.nextSibling
						});

						self.loadSections();
						Vvveb.TreeList.loadComponents();
						Vvveb.TreeList.selectComponent(node);

						e.preventDefault();
					}
				});

				document.querySelector(this.selector).addEventListener('click', function (e) {
					let element = e.target.closest('.properties-btn');
					if (element) {
						let section = element.closest('.section-item');
						let node = section._node;
						node.click();

						e.preventDefault();
					}
				});
			},

			getSections: function () {
				let sections = [];
				let sectionList = window.FrameDocument.body.querySelectorAll(
					':scope > section, :scope > header, :scope > footer, :scope > main, :scope > nav'
				);

				sectionList.forEach(function (node, i) {
					let id = node.id ? node.id : node.title ? node.title : (node.ariaLabel ?? node.className);
					if (!id) {
						id = 'section-' + Math.floor(Math.random() * 10000);
					}
					let section = {
						name: id.replace(/[^\w+]+/g, ' '),
						id: node.id,
						type: node.tagName.toLowerCase(),
						node: node
					};
					sections.push(section);
				});

				return sections;
			},

			loadComponents: function (sectionListItem, section, allowedComponents = {}) {
				let tree = [];
				getNodeTree(section, tree, allowedComponents);

				let html = drawComponentsTree(tree);
				document.querySelector('ol', sectionListItem).replaceWith(html);
			},

			addSection: function (data) {
				let section = generateElements(tmpl('vvveb-section', data))[0];
				section._node = data.node;
				document.querySelector(this.selector).append(section);

				//this.loadComponents(section, data.node, this.allowedComponents);
			},

			loadSections: function () {
				let sections = this.getSections();
				let container = document.querySelector(this.selector);

				container.replaceChildren();
				for (let i in sections) {
					this.addSection(sections[i]);
				}
			},

			//drag and drop
			dragOver: function (e) {
				let element = e.target.closest('div');
				if (element) {
					if (e.target != dragover && e.target.className == 'section-item') {
						if (dragover) {
							dragover.classList.remove('drag-over');
						}

						dragover = e.target;
						dragover.classList.add('drag-over');
					}
				}
			},

			dragEnd: function (e) {
				let element = e.target.closest('div');
				if (element) {
					if (dragover) {
						let parent = selected.parentNode;
						let selectedNode = selected._node;
						let replaceNode = dragover._node;

						if (dragover.offsetTop > selected.offsetTop) {
							//replace section item list
							parent.insertBefore(selected, dragover.nextElementSibling);
							//replace section
							replaceNode.parentNode.insertBefore(selectedNode, replaceNode.nextElementSibling);
						} else {
							//replace section item list
							parent.insertBefore(selected, dragover);
							//replace section
							replaceNode.parentNode.insertBefore(selectedNode, replaceNode);
						}

						dragover.classList.remove('drag-over');

						let node = selectedNode;

						Vvveb.Undo.addMutation({
							type: 'move',
							target: node,
							oldParent: node.parentNode,
							oldNextSibling: node.nextSibling
						});
					}

					selected = null;
					dragover = null;
				}
			},

			dragStart: function (e) {
				let element = e.target.closest('div');
				if (element) {
					selected = e.target;
				}
			}
		};

		Vvveb.TreeList = {
			selector: '#tree-list',

			container: null,

			tree: [],

			idToNode: {},

			init: function () {
				// header move
				this.container = document.querySelector(this.selector);
				let header = this.container.querySelector('.header');
				let isDown = false;
				let offset = [0, 0];
				let self = this;

				header.addEventListener(
					'mousedown',
					function (e) {
						if (e.which == 1) {
							//left click
							isDown = true;
							offset = [
								self.container.offsetLeft - e.clientX,
								self.container.offsetTop - e.clientY
							];
						}
					},
					true
				);

				document.addEventListener(
					'mouseup',
					function () {
						isDown = false;
					},
					true
				);

				document.addEventListener('mousemove', function (event) {
					if (isDown) {
						event.preventDefault();
						let left = Math.max(event.clientX + offset[0], 0);
						let top = Math.max(event.clientY + offset[1], 0);

						if (left >= 0 && left < window.innerWidth - self.container.clientWidth)
							self.container.style.left = left + 'px';
						if (top >= 0 && top < window.innerHeight - self.container.clientHeight)
							self.container.style.top = top + 'px';
					}
				});

				document.querySelector(this.selector).addEventListener('click', function (e) {
					let element = e.target.closest('li[data-component]');
					if (element) {
						const node = element._treeNode;
						node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
						//node.click();
						Vvveb.Builder.selectNode(node);
						Vvveb.Builder.loadNodeComponent(node);

						document.querySelector(self.selector + ' .active')?.classList.remove('active');
						element.querySelector('label').classList.add('active');
					}
				});

				document.querySelector(this.selector).addEventListener('mousemove', function (e) {
					let element = e.target.closest('li[data-component]');
					if (element) {
						const node = element._treeNode;

						node.dispatchEvent(
							new MouseEvent('mousemove', {
								bubbles: true,
								cancelable: true
							})
						);
					}
				});
			},

			selectComponent: function (node) {
				let id;
				for (const i in this.idToNode) {
					if (node == this.idToNode[i]) {
						id = i;
						break;
					}
				}

				if (id) {
					let element = document.getElementById('id' + id);

					this.container.querySelector('.active')?.classList.remove('active');
					//collapse all
					let checkboxes = this.container.querySelectorAll('input[type=checkbox]:checked');
					for (let i = 0, len = checkboxes.length; i < len; i++) {
						checkboxes[i].checked = false;
						let label = checkboxes[i].labels[0];
						if (label) {
							label.classList.remove('active');
						}
					}

					//expand parents
					if (element) {
						let parent = element;
						let current = element;
						while ((parent = current.closest('li'))) {
							current = parent.parentNode;
							let input = parent.querySelector('input');
							if (input && input.hasAttribute('type') && input.type == 'checkbox') {
								input.checked = true;
							}
						}

						element.checked = true;
						element.labels[0].classList.add('active');
						element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
					}
				}

				return false;
			},

			loadComponents: function () {
				let list = this.container.querySelector('.tree > ol');
				//if navigator not visible don't load
				if (list.offsetParent === null) return;

				this.tree = [];
				this.idToNode = {};
				getNodeTree(window.FrameDocument.body, this.tree, {}, this.idToNode);

				let ol = drawComponentsTree(this.tree);
				list.replaceWith(ol);
				//list.replaceWith(html);
			}
		};

		Vvveb.FileManager = {
			tree: false,
			pages: {},
			currentPage: false,
			allowedComponents: {},

			init: function (allowedComponents = {}) {
				this.allowedComponents = allowedComponents;
				this.tree = document.querySelector('#filemanager .tree > ol');
				this.tree.replaceChildren();

				this.tree.addEventListener('click', function (e) {
					let element = event.target.closest('a');
					if (element) {
						e.stopImmediatePropagation();
						if (element.classList.contains('view')) return;
						e.preventDefault();
						return false;
					}
				});

				this.tree.addEventListener('click', function (e) {
					let element = event.target.closest('.delete');
					if (element) {
						Vvveb.FileManager.deletePage(element.closest('li'), e);
						e.stopImmediatePropagation();
						e.preventDefault();
						return false;
					}
				});

				this.tree.addEventListener('click', function (e) {
					let element = event.target.closest('.rename');
					if (element) {
						Vvveb.FileManager.renamePage(element.closest('li'), e, false);
						e.stopImmediatePropagation();
						e.preventDefault();
						return false;
					}
				});

				this.tree.addEventListener('click', function (e) {
					let element = event.target.closest('.duplicate');
					if (element) {
						Vvveb.FileManager.renamePage(element.closest('li'), e, true);
						e.stopImmediatePropagation();
						e.preventDefault();
						return false;
					}
				});

				this.tree.addEventListener('click', function (e) {
					let element = event.target.closest('li[data-page] label');
					if (element) {
						let page = element.parentNode.dataset.page;
						if (page) Vvveb.FileManager.loadPage(page, allowedComponents);
						e.preventDefault();
						return false;
					}
				});

				this.tree.addEventListener('click', function (e) {
					let element = event.target.closest('li[data-component] label');
					if (element) {
						const node = e.currentTarget.parentNode._node;
						node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
						node.click();
					}
				});

				this.tree.addEventListener('mouseenter', function (e) {
					let element = event.target.closest('li[data-component] label');
					if (element) {
						const node = e.currentTarget.parentNode._node;
						node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

						node.dispatchEvent(
							new MouseEvent('mousemove', {
								bubbles: true,
								cancelable: true
							})
						);
						//node.trigger("mousemove");
					}
				});
			},

			clear: function () {
				this.pages = {};
				this.currentPage = false;
				this.tree.replaceChildren();
			},

			deletePage: function (element, e) {
				let page = element.dataset;
				if (confirm(`Are you sure you want to delete "${page.file}"template?`)) {
					let detail = { page, element };
					//allow event to change page or cancel by setting page to false
					window.dispatchEvent(
						new CustomEvent('vvveb.FileManager.deletePage', {
							detail
						})
					);

					if (detail.page) {
						fetch(deleteUrl, { method: 'POST', body: new URLSearchParams({ file: page.file }) })
							.then((response) => {
								if (!response.ok) {
									return Promise.reject(response);
								}
								return response.text();
							})
							.then((data) => {
								let bg = 'bg-success';
								if (data.success) {
									document
										.querySelectorAll('#top-panel .save-btn')
										.forEach((e) => e.setAttribute('disabled', 'true'));
								} else {
									bg = 'bg-danger';
								}

								displayToast(bg, 'Delete', data.message ?? data);
							})
							.catch((error) => {
								console.log(error);
								let message = error.statusText ?? 'Error deleting page!';
								displayToast('bg-danger', 'Error', message);

								err.text().then((errorMessage) => {
									let message = errorMessage.substr(0, 200);
									displayToast('bg-danger', 'Error', message);
								});
							});

						element.remove();
					}
				}
			},

			renamePage: function (element, e, duplicate = false) {
				let page = element.dataset;
				let newfile = prompt(`Enter new file name for "${page.file}"`, page.file);
				let _self = this;
				if (newfile) {
					let detail = { page, newfile, element };
					//allow event to change page or newfile or cancel by setting page to false
					window.dispatchEvent(
						new CustomEvent('vvveb.FileManager.renamePage', {
							detail
						})
					);

					if (detail.page) {
						fetch(renameUrl, {
							method: 'POST',
							body: new URLSearchParams({ file: page.file, newfile: newfile, duplicate })
						})
							.then((response) => {
								if (!response.ok) {
									return Promise.reject(response);
								}
								return response.text();
							})
							.then((data) => {
								let bg = 'bg-success';
								if (data.success) {
									document
										.querySelectorAll('#top-panel .save-btn')
										.forEach((e) => e.setAttribute('disabled', 'true'));
								} else {
									bg = 'bg-danger';
								}

								newfile = data.newfile ?? newfile;
								displayToast(bg, 'Rename', data.message ?? data);
								let baseName = newfile.replace('.html', '');
								let newName = friendlyName(newfile.replace(/.*[\/\\]+/, '')).replace('.html', '');

								if (duplicate) {
									let data = _self.pages[page.page];
									data['file'] = newfile;
									data['title'] = newName;
									Vvveb.FileManager.addPage(baseName, data);
								} else {
									_self.pages[page.page]['file'] = newfile;
									_self.pages[page.page]['title'] = newName;
									page.url = data.url ?? page.url.replace(page.file, newfile);
									page.file = newfile;
									element.querySelector(':scope > label span').innerHTML = newName;
									element.querySelector(':scope > label a.view').setAttribute('href', page.url);
									_self.pages[page.page]['url'] = page.url;
									_self.pages[page.page]['file'] = page.file;
								}
							})
							.catch((error) => {
								console.log(error);
								let message = error.statusText ?? 'Error renaming page!';
								displayToast('bg-danger', 'Error', message);

								error.text().then((errorMessage) => {
									let message = errorMessage.substr(0, 200);
									displayToast('bg-danger', 'Error', message);
								});
							});
					}
				}
			},

			addPage: function (name, data, afterPage = false) {
				//allow event to change name or cancel by setting name to false
				window.dispatchEvent(
					new CustomEvent('vvveb.FileManager.addPage', {
						detail: [name, data]
					})
				);

				if (!name) {
					return false;
				}

				this.pages[name] = data;
				data['name'] = name;

				let folder = this.tree;
				if (data.folder) {
					if (
						data.folder &&
						data.folder != '/' &&
						!(folder = folder.querySelector('li[data-folder="' + data.folder + '"]'))
					) {
						data.folderTitle = friendlyName(data.folder); //data.folder[0].toUpperCase() + data.folder.slice(1);
						folder = generateElements(tmpl('vvveb-filemanager-folder', data))[0];
						this.tree.append(folder);
					}

					folder = folder.querySelector('ol');
				}

				let page = generateElements(tmpl('vvveb-filemanager-page', data))[0];
				if (afterPage && (afterPage = folder.querySelector('[data-page="' + afterPage + '"]'))) {
					afterPage.after(page);
				} else {
					folder.append(page);
				}

				return page;
			},

			addPages: function (pages) {
				for (let page in pages) {
					this.addPage(pages[page]['name'], pages[page]);
				}
			},

			addComponent: function (name, url, title, page) {
				document
					.querySelector("[data-page='" + page + "'] > ol", this.tree)
					.append(tmpl('vvveb-filemanager-component', { name: name, url: url, title: title }));
			},

			loadComponents: function (allowedComponents = {}) {
				let tree = [];
				getNodeTree(window.FrameDocument.body, tree, allowedComponents);

				let html = drawComponentsTree(tree);
				document
					.querySelector("[data-page='" + this.currentPage + "'] > ol", this.tree)
					.replaceWith(html);
			},

			getCurrentUrl: function () {
				if (this.currentPage) {
					return this.pages[this.currentPage]['url'];
				}
			},

			getCurrentPage: function () {
				return this.currentPage;
			},

			getPageData: function (key) {
				if (this.currentPage) {
					return this.pages[this.currentPage][key];
				}
			},

			getCurrentFileName: function () {
				if (this.currentPage) {
					let folder = this.pages[this.currentPage]['folder'];
					folder = folder ? folder + '/' : '';
					return folder + this.pages[this.currentPage]['file'];
				}
			},

			reloadCurrentPage: function () {
				if (this.currentPage) return this.loadPage(this.currentPage);
			},

			loadPage: function (
				name,
				allowedComponents = false,
				disableCache = true,
				loadComponents = false
			) {
				let url = this.pages[name]['url'] ?? '';

				if (!url) {
					return;
				}

				let page = this.tree.querySelector("[data-page='" + name + "']");
				//remove active from current active page
				this.tree.querySelector('[data-page].active')?.classList.remove('active');
				//set loaded page as active
				page.classList.add('active');
				//open parent folder if closed
				page
					.closest('[data-folder]')
					?.querySelector('input[type=checkbox]')
					.setAttribute('checked', true);

				this.currentPage = name;
				document.querySelector('.btn-preview-url').setAttribute('href', url);

				//allow event to change page or url or cancel by setting url to false
				let self = this;

				window.dispatchEvent(
					new CustomEvent('vvveb.FileManager.loadPage', {
						detail: self.pages[name]
					})
				);

				if (url) {
					Vvveb.Builder.loadUrl(
						url + (disableCache ? (url.indexOf('?') > -1 ? '&r=' : '?r=') + Math.random() : ''),
						function () {
							if (loadComponents) {
								Vvveb.FileManager.loadComponents(allowedComponents);
							}
							Vvveb.SectionList.loadSections(allowedComponents);
							Vvveb.TreeList.loadComponents();
							Vvveb.StyleManager.init();
						}
					);
				}
			},

			scrollToPage: function (page) {
				page.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
			}
		};

		Vvveb.Breadcrumb = {
			tree: false,

			init: function () {
				this.tree = document.querySelector('.breadcrumb-navigator > .breadcrumb');
				this.tree.replaceChildren();

				this.tree.addEventListener('click', function (e) {
					let element = event.target.closest('.breadcrumb-item');
					if (element) {
						let node = element._node;
						if (node) {
							//node.click();
							Vvveb.Builder.selectNode(node);
							Vvveb.Builder.loadNodeComponent(node);
							node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
						}

						e.preventDefault();
					}
				});

				let currentHoverNode;
				this.tree.addEventListener('mousemove', function (e) {
					if (event.target == currentHoverNode) return;
					currentHoverNode = event.target;

					let element = event.target.closest('.breadcrumb-item');
					if (element) {
						let node = element._node;

						node.dispatchEvent(
							new MouseEvent('mousemove', {
								bubbles: true,
								cancelable: true
							})
						);
					}
				});
			},

			addElement: function (data, element) {
				let li = generateElements(tmpl('vvveb-breadcrumb-navigaton-item', data))[0];
				li._node = element;
				this.tree.prepend(li);
			},

			loadBreadcrumb: function (element) {
				this.tree.replaceChildren();
				let currentElement = element;

				while (currentElement.parentElement) {
					let elementType = Vvveb.Builder._getElementType(currentElement);
					let el = elementType[1].toLowerCase();

					this.addElement(
						{
							name: el + ' ' + elementType[0],
							className: 'el-' + el
						},
						currentElement
					);

					currentElement = currentElement.parentElement;
				}
			}
		};

		Vvveb.FontsManager = {
			activeFonts: [],
			providers: {}, //{"google":GoogleFontsManager};

			addFontList: function (provider, groupName, fontList) {
				let fonts = {};
				let fontNames = [];

				let fontSelect = generateElements("<optgroup label='" + groupName + "'></optgroup>")[0];
				for (const font in fontList) {
					fontNames.push({ text: font, value: font, 'data-provider': provider });
					let option = new Option(font, font);
					option.dataset.provider = provider;
					//option.style.setProperty("font-family", font);//font preview if the fonts are loaded in editor
					fontSelect.append(option);
				}
				document.getElementById('font-family').append(fontSelect);

				let list = Vvveb.Components.getProperty('_base', 'font-family');
				if (list) {
					list.onChange = function (node, value, input, component) {
						let option = input.options[input.selectedIndex];
						Vvveb.FontsManager.addFont(option.dataset.provider, value, node);
						return node;
					};

					list.data.options.push({ optgroup: groupName });
					list.data.options = list.data.options.concat(fontNames);

					Vvveb.Components.updateProperty('_base', 'font-family', { data: list.data });

					//update default font list
					fontList = list.data.options;
				}
			},

			addProvider: function (provider, Obj) {
				this.providers[provider] = Obj;
			},

			//add also element so we can keep track of the used fonts to remove unused ones
			addFont: function (provider, fontFamily, element = false) {
				if (!provider) return;

				let providerObj = this.providers[provider];
				if (providerObj) {
					providerObj.addFont(fontFamily);
					this.activeFonts.push({ provider, fontFamily, element });
				}
			},

			removeFont: function (provider, fontFamily) {
				if (!provider) return;

				let providerObj = this.providers[provider];
				if (provider != 'default' && providerObj) {
					providerObj.removeFont(fontFamily);
				}
			},

			//check if the added fonts are still used for the elements they were set and remove unused ones
			cleanUnusedFonts: function () {
				for (i in this.activeFonts) {
					let elementFont = this.activeFonts[i];
					if (elementFont.element) {
						if (
							Vvveb.StyleManager.getStyle(elementFont.element, 'font-family').replaceAll('"', '') !=
							elementFont.fontFamily
						) {
							this.removeFont(elementFont.provider, elementFont.fontFamily);
						}
					}
				}
			}
		};

		Vvveb.ColorPalette = {
			colors: {},

			getAll: function () {
				return this.colors;
			},

			add: function (name, color) {
				this.colors[name] = color;
			},

			remove: function (color) {
				delete this.colors[name];
			}
		};

		function friendlyName(name) {
			name = name.replaceAll('--bs-', '').replace(/[-_]/g, ' ').trim();
			return (name = name[0].toUpperCase() + name.slice(1));
		}

		Vvveb.ColorPaletteManager = {
			cssVars: { font: {}, color: {}, dimensions: {} },

			getType: function (type) {
				return this.cssVars[type];
			},

			getAllCSSVariableNames: function (styleSheets = document.styleSheets, selector) {
				for (let i = 0; i < styleSheets.length; i++) {
					try {
						let cssRules = styleSheets[i].cssRules;
						for (let j = 0; j < cssRules.length; j++) {
							try {
								let style = cssRules[j].style;
								if (selector && cssRules[j].selectorText && cssRules[j].selectorText != selector)
									continue;
								for (let k = 0; k < style.length; k++) {
									let name = style[k];
									let value = style.getPropertyValue(name).trim();
									let type = '';

									if (name.startsWith('--')) {
										//ignore rgb variables
										if (name.endsWith('-rgb')) continue;
										//ignore variables depending on other variables
										if (value.startsWith('var(')) continue;

										let friendlyName = name.replace('--bs-', '').replaceAll('-', ' ');

										if (value.startsWith('#')) {
											type = 'color';
										} else if (value.indexOf('"') >= 0 || value.indexOf("'") >= 0) {
											type = 'font';
										} else if (value.endsWith('em') > 0 || value.endsWith('px') > 0) {
											type = 'dimensions';
										} else if (!isNaN(parseFloat(value))) {
											type = 'dimensions';
										}

										if (type) {
											if (!this.cssVars[type]) this.cssVars[type] = {};
											this.cssVars[type][name] = { value, type, friendlyName };
										}
									}
								}
							} catch (error) {}
						}
					} catch (error) {}
				}

				return this.cssVars;
			},

			getCssWithVars: function (styleSheets = document.styleSheets, vars) {
				let cssVars = {};
				let css = '';
				let cssStyles = '';
				for (let i = 0; i < styleSheets.length; i++) {
					try {
						let cssRules = styleSheets[i].cssRules;
						for (let j = 0; j < cssRules.length; j++) {
							try {
								let style = cssRules[j].style;
								//if (selector && cssRules[j].selectorText && cssRules[j].selectorText != selector) continue;
								cssStyles = '';
								for (let k = 0; k < style.length; k++) {
									let name = style[k];
									let value = style.getPropertyValue(name);
									if (name.startsWith('--bs-btn-')) {
										for (v in vars) {
											if (value == vars[v]) {
												cssVars[name] = v;
												cssStyles += name + ':var(' + v + ');\n';
											}
										}
									}
								}
								if (cssStyles) {
									css += cssRules[j].selectorText + '{\n';
									css += cssStyles;
									css += '}\n';
								}
							} catch (error) {}
						}
					} catch (error) {}
				}
				return cssVars;
			},

			init: function (document) {
				Vvveb.Components.render(
					'config/bootstrap',
					'#configuration #vars-tab .component-properties'
				);

				//apply current theme color palette
				// let colors = Vvveb.ColorPaletteManager.getType('color');
				let colors = this.cssVars.color;
				for (const name in colors) {
					let color = colors[name].value;

					if (color[0] == '#' && color.length == 7) {
						//add only valid hex color values 7 char long
						//add color as name to keep values unique
						Vvveb.ColorPalette.add(color, color);
					}
				}
			}
		};

		Vvveb.Config = {
			components: [],
			blocks: [],
			plugins: []

			// load: function (url = 'default.json') {
			// 	$.getJSON(url, function (data) {});
			// }
		};

		// Toggle fullscreen
		function launchFullScreen(document) {
			if (document.documentElement.requestFullScreen) {
				if (document.FullScreenElement) document.exitFullScreen();
				else document.documentElement.requestFullScreen();
				//mozilla
			} else if (document.documentElement.mozRequestFullScreen) {
				if (document.mozFullScreenElement) document.mozCancelFullScreen();
				else document.documentElement.mozRequestFullScreen();
				//webkit
			} else if (document.documentElement.webkitRequestFullScreen) {
				if (document.webkitFullscreenElement) document.webkitExitFullscreen();
				else document.documentElement.webkitRequestFullScreen();
				//ie
			} else if (document.documentElement.msRequestFullscreen) {
				if (document.msFullScreenElement) document.msExitFullscreen();
				else document.documentElement.msRequestFullscreen();
			}
		}

		let fontList = [
			{
				value: '',
				text: 'Default'
			},
			{
				value: 'Arial, Helvetica, sans-serif',
				text: 'Arial'
			},
			{
				value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
				text: 'Lucida Grande'
			},
			{
				value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
				text: 'Palatino Linotype'
			},
			{
				value: "'Times New Roman', Times, serif",
				text: 'Times New Roman'
			},
			{
				value: 'Georgia, serif',
				text: 'Georgia, serif'
			},
			{
				value: 'Tahoma, Geneva, sans-serif',
				text: 'Tahoma'
			},
			{
				value: "'Comic Sans MS', cursive, sans-serif",
				text: 'Comic Sans'
			},
			{
				value: 'Verdana, Geneva, sans-serif',
				text: 'Verdana'
			},
			{
				value: 'Impact, Charcoal, sans-serif',
				text: 'Impact'
			},
			{
				value: "'Arial Black', Gadget, sans-serif",
				text: 'Arial Black'
			},
			{
				value: "'Trebuchet MS', Helvetica, sans-serif",
				text: 'Trebuchet'
			},
			{
				value: "'Courier New', Courier, monospace",
				text: 'Courier New'
			},
			{
				value: "'Brush Script MT', sans-serif",
				text: 'Brush Script'
			}
		];

		Vvveb.Undo = {
			mutations: [],
			undoIndex: -1,
			enabled: true,
			/*		
	init: function() {
	},
	*/
			addMutation: function (mutation) {
				/*
			this.mutations.push(mutation);
			this.undoIndex++;
		*/
				this.mutations.splice(++this.undoIndex, this.mutations.length - this.undoIndex, mutation);
				const event = new CustomEvent('vvveb.undo.add', { detail: mutation });
				Vvveb.Builder.frameBody.dispatchEvent(event);
			},

			restore: function (mutation, undo) {
				let addedNodes, removedNodes;

				switch (mutation.type) {
					case 'childList':
						if (undo == true) {
							addedNodes = mutation.removedNodes;
							removedNodes = mutation.addedNodes;
						} else {
							//redo
							addedNodes = mutation.addedNodes;
							removedNodes = mutation.removedNodes;
						}

						if (addedNodes)
							for (i in addedNodes) {
								node = addedNodes[i];
								if (mutation.nextSibling) {
									mutation.nextSibling.parentNode.insertBefore(node, mutation.nextSibling);
								} else {
									mutation.target.append(node);
								}
							}

						if (removedNodes)
							for (i in removedNodes) {
								node = removedNodes[i];
								node.parentNode.removeChild(node);
							}
						break;
					case 'move':
						if (undo == true) {
							parent = mutation.oldParent;
							sibling = mutation.oldNextSibling;
						} else {
							//redo
							parent = mutation.newParent;
							sibling = mutation.newNextSibling;
						}

						if (sibling) {
							sibling.parentNode.insertBefore(mutation.target, sibling);
						} else {
							parent.append(node);
						}
						break;
					case 'characterData':
						mutation.target.innerHTML = undo ? mutation.oldValue : mutation.newValue;
						break;
					case 'style':
						window.FrameDocument.getElementById('vvvebjs-styles').textContent = undo
							? mutation.oldValue
							: mutation.newValue;
						break;
					case 'attributes':
						let value = undo ? mutation.oldValue : mutation.newValue;

						if (value || value === false || value === 0)
							mutation.target.setAttribute(mutation.attributeName, value);
						else mutation.target.removeAttribute(mutation.attributeName);

						break;
				}

				const event = new CustomEvent('vvveb.undo.restore', { detail: mutation });
				Vvveb.Builder.frameBody.dispatchEvent(event);
			},

			undo: function () {
				if (this.undoIndex >= 0) {
					this.restore(this.mutations[this.undoIndex--], true);
				}
			},

			redo: function () {
				if (this.undoIndex < this.mutations.length - 1) {
					this.restore(this.mutations[++this.undoIndex], false);
				}
			},

			hasChanges: function () {
				return this.mutations.length;
			},

			reset: function () {
				this.mutations = [];
				this.undoIndex = -1;
			}
		};

		let bgcolorClasses = [
			'bg-primary',
			'bg-secondary',
			'bg-success',
			'bg-danger',
			'bg-warning',
			'bg-info',
			'bg-body-secondary',
			'bg-dark',
			'bg-white'
		];

		let bgcolorSelectOptions = [
			{
				value: 'Default',
				text: ''
			},
			{
				value: 'bg-primary',
				text: 'Primary'
			},
			{
				value: 'bg-secondary',
				text: 'Secondary'
			},
			{
				value: 'bg-success',
				text: 'Success'
			},
			{
				value: 'bg-danger',
				text: 'Danger'
			},
			{
				value: 'bg-warning',
				text: 'Warning'
			},
			{
				value: 'bg-info',
				text: 'Info'
			},
			{
				value: 'bg-body-secondary',
				text: 'Light'
			},
			{
				value: 'bg-dark',
				text: 'Dark'
			},
			{
				value: 'bg-white',
				text: 'White'
			}
		];

		function changeNodeName(node, newNodeName) {
			let newNode;
			newNode = document.createElement(newNodeName);
			let attributes = node.attributes;

			for (let i = 0, len = attributes.length; i < len; i++) {
				newNode.setAttribute(attributes[i].nodeName, attributes[i].nodeValue);
			}

			while (node.hasChildNodes()) {
				newNode.appendChild(node.removeChild(node.firstChild));
			}

			node.replaceWith(newNode);

			return newNode;
		}

		let base_sort = 1000; //start sorting for base component from 100 to allow extended properties to be first
		let style_section = 'style';
		let advanced_section = 'advanced';

		Vvveb.Components.add('_base', {
			name: 'Element',
			properties: [
				{
					key: 'element_header',
					inputtype: SectionInput,
					name: false,
					sort: base_sort++,
					data: { header: 'General' }
				},
				{
					name: 'Id',
					key: 'id',
					htmlAttr: 'id',
					sort: base_sort++,
					inline: false,
					col: 6,
					inputtype: TextInput
				},
				{
					name: 'Class',
					key: 'class',
					htmlAttr: 'class',
					sort: base_sort++,
					inline: false,
					col: 6,
					inputtype: TextInput
				}
			]
		});

		//display
		Vvveb.Components.extend('_base', '_base', {
			properties: [
				{
					key: 'display_header',
					inputtype: SectionInput,
					name: false,
					sort: base_sort++,
					section: style_section,
					data: { header: 'Display' }
				},
				{
					//linked styles notice message
					name: '',
					key: 'linked_styles_check',
					sort: base_sort++,
					section: style_section,
					inline: false,
					col: 12,
					inputtype: NoticeInput,
					data: {
						type: 'warning',
						title: 'Linked styles',
						text: 'This element shares styles with other <a class="linked-elements-hover" href="javascript:void()"><b class="elements-count">4</b> elements</a>, to apply styles <b>only for this element</b> enter a <b>unique id</b> eg: <i>marketing-heading</i> in in <br/><a class="id-input" href="#content-tab" role="tab" aria-controls="components" aria-selected="false" href="#content-tab">Content > General > Id</a>.<br/><span class="text-muted small"></span>'
					},
					afterInit: function (node, inputElement) {
						let selector = Vvveb.StyleManager.getSelectorForElement(node);
						let elements = window.FrameDocument.querySelectorAll(selector);

						if (elements.length <= 1) {
							if (inputElement.style) {
								inputElement.style.display = 'none';
							}
						} else {
							inputElement.style.display = '';
							inputElement.querySelector('.elements-count').innerHTML = elements.length;
							inputElement.querySelector('.text-muted').innerHTML = selector;

							inputElement
								.querySelector('.id-input', inputElement)
								.addEventListener('click', (event) => {
									document.querySelectorAll('.content-tab a').forEach((e) => e.click());

									setTimeout(function () {
										let idInput = document.querySelectorAll('[name=id]');
										idInput.forEach((el) => {
											if (el.offsetParent) el.focus();
										}); /*
						idInput.forEach(el => el .dispatchEvent(new FocusEvent("focusin", {
							bubbles: true,
							cancelable: false
						})));*/
									}, 700);

									event.preventDefault();
									return false;
								});

							inputElement
								.querySelector('.linked-elements-hover')
								.addEventListener('mouseenter', function () {
									elements.forEach((e) => (e.style.outline = '2px dotted blue'));
								});

							inputElement
								.querySelector('.linked-elements-hover')
								.addEventListener('mouseleave', function () {
									elements.forEach((e) => (e.style.outline = ''));
								});
						}
					}
				},
				{
					name: 'Display',
					key: 'display',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: SelectInput,
					validValues: ['block', 'inline', 'inline-block', 'none'],
					data: {
						options: [
							{
								value: 'block',
								text: 'Block'
							},
							{
								value: 'inline',
								text: 'Inline'
							},
							{
								value: 'inline-block',
								text: 'Inline Block'
							},
							{
								value: 'inline-block',
								text: 'Inline Block'
							},
							{
								value: 'flex',
								text: 'Flex'
							},
							{
								value: 'inline-flex',
								text: 'Inline Flex'
							},
							{
								value: 'grid',
								text: 'Grid'
							},
							{
								value: 'inline-grid',
								text: 'Inline grid'
							},
							{
								value: 'table',
								text: 'Table'
							},
							{
								value: 'table-row',
								text: 'Table Row'
							},
							{
								value: 'list-item',
								text: 'List Item'
							},
							{
								value: 'inherit',
								text: 'Inherit'
							},
							{
								value: 'initial',
								text: 'Initial'
							},
							{
								value: 'none',
								text: 'none'
							}
						]
					}
				},
				{
					name: 'Position',
					key: 'position',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: SelectInput,
					validValues: ['static', 'fixed', 'relative', 'absolute'],
					data: {
						options: [
							{
								value: 'static',
								text: 'Static'
							},
							{
								value: 'fixed',
								text: 'Fixed'
							},
							{
								value: 'relative',
								text: 'Relative'
							},
							{
								value: 'absolute',
								text: 'Absolute'
							}
						]
					}
				},
				{
					name: 'Top',
					key: 'top',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					parent: '',
					inputtype: CssUnitInput
				},
				{
					name: 'Left',
					key: 'left',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					parent: '',
					inputtype: CssUnitInput
				},
				{
					name: 'Bottom',
					key: 'bottom',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					parent: '',
					inputtype: CssUnitInput
				},
				{
					name: 'Right',
					key: 'right',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					parent: '',
					inputtype: CssUnitInput
				},
				{
					name: 'Float',
					key: 'float',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 12,
					inline: false,
					inputtype: RadioButtonInput,
					data: {
						extraclass: 'btn-group-sm btn-group-fullwidth',
						options: [
							{
								value: 'none',
								icon: 'la la-times',
								//text: "None",
								title: 'None',
								checked: true
							},
							{
								value: 'left',
								//text: "Left",
								title: 'Left',
								icon: 'la la-align-left',
								checked: false
							},
							{
								value: 'right',
								//text: "Right",
								title: 'Right',
								icon: 'la la-align-right',
								checked: false
							}
						]
					}
				},
				{
					name: 'Opacity',
					key: 'opacity',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 12,
					inline: false,
					parent: '',
					inputtype: RangeInput,
					data: {
						max: 1, //max zoom level
						min: 0,
						step: 0.1
					}
				},
				{
					name: 'Background Color',
					key: 'background-color',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: true,
					htmlAttr: 'style',
					inputtype: ColorInput
				},
				{
					name: 'Text Color',
					key: 'color',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: true,
					htmlAttr: 'style',
					inputtype: ColorInput
				}
			]
		});

		//Typography
		let ComponentBaseTypography = {
			properties: [
				{
					key: 'typography_header',
					inputtype: SectionInput,
					name: false,
					sort: base_sort++,
					section: style_section,
					data: { header: 'Typography' }
				},
				{
					name: 'Font size',
					key: 'font-size',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Font weight',
					key: 'font-weight',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: '',
								text: 'Default'
							},
							{
								value: '100',
								text: 'Thin'
							},
							{
								value: '200',
								text: 'Extra-Light'
							},
							{
								value: '300',
								text: 'Light'
							},
							{
								value: '400',
								text: 'Normal'
							},
							{
								value: '500',
								text: 'Medium'
							},
							{
								value: '600',
								text: 'Semi-Bold'
							},
							{
								value: '700',
								text: 'Bold'
							},
							{
								value: '800',
								text: 'Extra-Bold'
							},
							{
								value: '900',
								text: 'Ultra-Bold'
							}
						]
					}
				},
				{
					name: 'Font family',
					key: 'font-family',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 12,
					inline: false,
					inputtype: SelectInput,
					data: {
						options: fontList
					}
				},
				{
					name: 'Text align',
					key: 'text-align',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 12,
					inline: false,
					inputtype: RadioButtonInput,
					data: {
						extraclass: 'btn-group-sm btn-group-fullwidth',
						options: [
							{
								value: '',
								icon: 'la la-times',
								//text: "None",
								title: 'None',
								checked: true
							},
							{
								value: 'left',
								//text: "Left",
								title: 'Left',
								icon: 'la la-align-left',
								checked: false
							},
							{
								value: 'center',
								//text: "Center",
								title: 'Center',
								icon: 'la la-align-center',
								checked: false
							},
							{
								value: 'right',
								//text: "Right",
								title: 'Right',
								icon: 'la la-align-right',
								checked: false
							},
							{
								value: 'justify',
								//text: "justify",
								title: 'Justify',
								icon: 'la la-align-justify',
								checked: false
							}
						]
					}
				},
				{
					name: 'Line height',
					key: 'line-height',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Letter spacing',
					key: 'letter-spacing',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Text decoration',
					key: 'text-decoration-line',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 12,
					inline: false,
					inputtype: RadioButtonInput,
					data: {
						extraclass: 'btn-group-sm btn-group-fullwidth',
						options: [
							{
								value: 'none',
								icon: 'la la-times',
								//text: "None",
								title: 'None',
								checked: true
							},
							{
								value: 'underline',
								//text: "Left",
								title: 'underline',
								icon: 'la la-long-arrow-alt-down',
								checked: false
							},
							{
								value: 'overline',
								//text: "Right",
								title: 'overline',
								icon: 'la la-long-arrow-alt-up',
								checked: false
							},
							{
								value: 'line-through',
								//text: "Right",
								title: 'Line Through',
								icon: 'la la-strikethrough',
								checked: false
							},
							{
								value: 'underline overline',
								//text: "justify",
								title: 'Underline Overline',
								icon: 'la la-arrows-alt-v',
								checked: false
							}
						]
					}
				},
				{
					name: 'Decoration Color',
					key: 'text-decoration-color',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: true,
					htmlAttr: 'style',
					inputtype: ColorInput
				},
				{
					name: 'Decoration style',
					key: 'text-decoration-style',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: true,
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: '',
								text: 'Default'
							},
							{
								value: 'solid',
								text: 'Solid'
							},
							{
								value: 'wavy',
								text: 'Wavy'
							},
							{
								value: 'dotted',
								text: 'Dotted'
							},
							{
								value: 'dashed',
								text: 'Dashed'
							},
							{
								value: 'double',
								text: 'Double'
							}
						]
					}
				}
			]
		};

		Vvveb.Components.extend('_base', '_base', ComponentBaseTypography);

		//Size
		let ComponentBaseSize = {
			properties: [
				{
					key: 'size_header',
					inputtype: SectionInput,
					name: false,
					sort: base_sort++,
					section: style_section,
					data: { header: 'Size', expanded: false }
				},
				{
					name: 'Width',
					key: 'width',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Height',
					key: 'height',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Min Width',
					key: 'min-width',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Min Height',
					key: 'min-height',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Max Width',
					key: 'max-width',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Max Height',
					key: 'max-height',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				}
			]
		};

		Vvveb.Components.extend('_base', '_base', ComponentBaseSize);

		//Margin
		let ComponentBaseMargin = {
			properties: [
				{
					key: 'margins_header',
					inputtype: SectionInput,
					name: false,
					sort: base_sort++,
					section: style_section,
					data: { header: 'Margin', expanded: false }
				},
				{
					name: 'Top',
					key: 'margin-top',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Right',
					key: 'margin-right',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Bottom',
					key: 'margin-bottom',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Left',
					key: 'margin-left',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				}
			]
		};

		Vvveb.Components.extend('_base', '_base', ComponentBaseMargin);

		//Padding
		let ComponentBasePadding = {
			properties: [
				{
					key: 'paddings_header',
					inputtype: SectionInput,
					name: false,
					sort: base_sort++,
					section: style_section,
					data: { header: 'Padding', expanded: false }
				},
				{
					name: 'Top',
					key: 'padding-top',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Right',
					key: 'padding-right',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Bottom',
					key: 'padding-bottom',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Left',
					key: 'padding-left',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				}
			]
		};

		Vvveb.Components.extend('_base', '_base', ComponentBasePadding);

		//Border
		Vvveb.Components.extend('_base', '_base', {
			properties: [
				{
					key: 'border_header',
					inputtype: SectionInput,
					name: false,
					sort: base_sort++,
					section: style_section,
					data: { header: 'Border', expanded: false }
				},
				{
					name: 'Style',
					key: 'border-style',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 12,
					inline: false,
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: '',
								text: 'Default'
							},
							{
								value: 'solid',
								text: 'Solid'
							},
							{
								value: 'dotted',
								text: 'Dotted'
							},
							{
								value: 'dashed',
								text: 'Dashed'
							}
						]
					}
				},
				{
					name: 'Width',
					key: 'border-width',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Color',
					key: 'border-color',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					htmlAttr: 'style',
					inputtype: ColorInput
				}
			]
		});

		//Border radius
		Vvveb.Components.extend('_base', '_base', {
			properties: [
				{
					key: 'border_radius_header',
					inputtype: SectionInput,
					name: false,
					sort: base_sort++,
					section: style_section,
					data: { header: 'Border radius', expanded: false }
				},
				{
					name: 'Top Left',
					key: 'border-top-left-radius',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Top Right',
					key: 'border-top-right-radius',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Bottom Left',
					key: 'border-bottom-left-radius',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				},
				{
					name: 'Bottom Right',
					key: 'border-bottom-right-radius',
					htmlAttr: 'style',
					sort: base_sort++,
					section: style_section,
					col: 6,
					inline: false,
					inputtype: CssUnitInput
				}
			]
		});

		//Background image
		Vvveb.Components.extend('_base', '_base', {
			properties: [
				{
					key: 'background_image_header',
					inputtype: SectionInput,
					name: false,
					sort: base_sort++,
					section: style_section,
					data: { header: 'Background Image', expanded: false }
				},
				{
					name: 'Image',
					key: 'Image',
					sort: base_sort++,
					section: style_section,
					//htmlAttr: "style",
					inputtype: ImageInput,

					init: function (node) {
						let image = node.style.backgroundImage.replace(/url\(['"]?([^"\)$]+?)['"]?\).*/, '$1');
						return image;
					},

					onChange: function (node, value) {
						Vvveb.StyleManager.setStyle(node, 'background-image', 'url(' + value + ')');

						return node;
					}
				},
				{
					name: 'Repeat',
					key: 'background-repeat',
					sort: base_sort++,
					section: style_section,
					htmlAttr: 'style',
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: '',
								text: 'Default'
							},
							{
								value: 'repeat-x',
								text: 'repeat-x'
							},
							{
								value: 'repeat-y',
								text: 'repeat-y'
							},
							{
								value: 'no-repeat',
								text: 'no-repeat'
							}
						]
					}
				},
				{
					name: 'Size',
					key: 'background-size',
					sort: base_sort++,
					section: style_section,
					htmlAttr: 'style',
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: '',
								text: 'Default'
							},
							{
								value: 'contain',
								text: 'contain'
							},
							{
								value: 'cover',
								text: 'cover'
							}
						]
					}
				},
				{
					name: 'Position x',
					key: 'background-position-x',
					sort: base_sort++,
					section: style_section,
					htmlAttr: 'style',
					col: 6,
					inline: true,
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: '',
								text: 'Default'
							},
							{
								value: 'center',
								text: 'center'
							},
							{
								value: 'right',
								text: 'right'
							},
							{
								value: 'left',
								text: 'left'
							}
						]
					}
				},
				{
					name: 'Position y',
					key: 'background-position-y',
					sort: base_sort++,
					section: style_section,
					htmlAttr: 'style',
					col: 6,
					inline: true,
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: '',
								text: 'Default'
							},
							{
								value: 'center',
								text: 'center'
							},
							{
								value: 'top',
								text: 'top'
							},
							{
								value: 'bottom',
								text: 'bottom'
							}
						]
					}
				}
			]
		});

		//Device visibility
		let ComponentDeviceVisibility = {
			properties: [
				{
					key: 'visibility_header',
					inputtype: SectionInput,
					name: false,
					sort: base_sort++,
					section: advanced_section,
					data: { header: 'Hide based on device screen width' }
				},
				{
					name: 'Extra small devices',
					key: 'hidexs',
					col: 6,
					inline: true,
					sort: base_sort++,
					section: advanced_section,
					htmlAttr: 'class',
					validValues: ['d-xs-none'],
					inputtype: ToggleInput,
					data: {
						on: 'd-xs-none',
						off: ''
					}
				},
				{
					name: 'Small devices',
					key: 'hidesm',
					col: 6,
					inline: true,
					sort: base_sort++,
					section: advanced_section,
					htmlAttr: 'class',
					validValues: ['d-sm-none'],
					inputtype: ToggleInput,
					data: {
						on: 'd-sm-none',
						off: ''
					}
				},
				{
					name: 'Medium devices',
					key: 'hidemd',
					col: 6,
					inline: true,
					sort: base_sort++,
					section: advanced_section,
					htmlAttr: 'class',
					validValues: ['d-md-none'],
					inputtype: ToggleInput,
					data: {
						on: 'd-md-none',
						off: ''
					}
				},
				{
					name: 'Large devices',
					key: 'hidelg',
					col: 6,
					inline: true,
					sort: base_sort++,
					section: advanced_section,
					htmlAttr: 'class',
					validValues: ['d-lg-none'],
					inputtype: ToggleInput,
					data: {
						on: 'd-lg-none',
						off: ''
					}
				},
				{
					name: 'Xl devices',
					key: 'hidexl',
					col: 6,
					inline: true,
					sort: base_sort++,
					section: advanced_section,
					htmlAttr: 'class',
					validValues: ['d-xl-none'],
					inputtype: ToggleInput,
					data: {
						on: 'd-xl-none',
						off: ''
					}
				},
				{
					name: 'Xxl devices',
					key: 'hidexxl',
					col: 6,
					inline: true,
					sort: base_sort++,
					section: advanced_section,
					htmlAttr: 'class',
					validValues: ['d-xxl-none'],
					inputtype: ToggleInput,
					data: {
						on: 'd-xxl-none',
						off: ''
					}
				}
			]
		};

		Vvveb.Components.extend('_base', '_base', ComponentDeviceVisibility);

		Vvveb.Components.add('config/bootstrap', {
			name: 'Bootstrap Variables',
			beforeInit: function (node) {
				let properties = [];
				let i = 0;
				let j = 0;

				let cssVars = Vvveb.ColorPaletteManager.getAllCSSVariableNames(
					window.FrameDocument.styleSheets /*, ":root"*/
				);

				for (let type in cssVars) {
					properties.push({
						key: 'cssVars' + type,
						inputtype: SectionInput,
						name: type,
						sort: base_sort++,
						data: { header: type[0].toUpperCase() + type.slice(1) }
					});

					for (let selector in cssVars[type]) {
						let friendlyName = selector.replaceAll(/--bs-/g, '').replaceAll('-', ' ').trim();
						friendlyName = friendlyName[0].toUpperCase() + friendlyName.slice(1);

						let value = cssVars[type][selector];
						let input;

						let data = { selector, type: value.type, step: 'any' };

						if (value.type == 'color') {
							input = ColorInput;
						} else if (value.type == 'font') {
							input = SelectInput;
							data.options = fontList;
						} else if (value.type == 'dimensions') {
							input = CssUnitInput;
						}

						i++;
						properties.push({
							name: friendlyName,
							key: 'cssvar' + i,
							defaultValue: value.value,
							//index: i - 1,
							columnNode: this,
							col: value.type == 'font' || value.type == 'dimensions' ? 12 : 6,
							inline: value.type == 'font' || value.type == 'dimensions' ? false : true,
							section: advanced_section,
							inputtype: input,
							data: data,
							onChange: function (node, value, input) {
								if (this.data.type == 'font') {
									let option = input.options[input.selectedIndex];
									Vvveb.FontsManager.addFont(option.dataset.provider, value, node[0]);
								}

								Vvveb.StyleManager.setStyle(':root', this.data.selector, value);

								return node;
							}
						});
					}
				}

				this.properties = properties;
				return node;
			},
			properties: []
		});

		// initialize

		Vvveb.ComponentsGroup['Base'] = [
			'html/heading',
			'html/image',
			'html/hr',
			'html/form',
			'html/textinput',
			'html/textareainput',
			'html/selectinput' /*, "html/fileinput"*/,
			'html/checkbox',
			'html/radiobutton',
			'html/link',
			'html/button',
			'html/paragraph',
			'html/blockquote',
			'html/list',
			'html/table',
			'html/preformatted',
			'html/audio',
			'html/video',
			'html/iframe'
		];

		Vvveb.Components.extend('_base', 'html/heading', {
			image: 'icons/heading.svg',
			name: 'Heading',
			nodes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
			html: '<h1>Heading</h1>',

			properties: [
				{
					name: 'Size',
					key: 'size',
					inputtype: SelectInput,

					onChange: function (node, value) {
						return changeNodeName(node, 'h' + value);
					},

					init: function (node) {
						let regex;
						regex = /H(\d)/.exec(node.nodeName);
						if (regex && regex[1]) {
							return regex[1];
						}
						return 1;
					},

					data: {
						options: [
							{
								value: '1',
								text: 'Heading 1'
							},
							{
								value: '2',
								text: 'Heading 2'
							},
							{
								value: '3',
								text: 'Heading 3'
							},
							{
								value: '4',
								text: 'Heading 4'
							},
							{
								value: '5',
								text: 'Heading 5'
							},
							{
								value: '6',
								text: 'Heading 6'
							}
						]
					}
				}
			]
		});

		let linkComponentProperties = [
			/*	{
		name: "Text",
		key: "text",
		sort:1,
		htmlAttr: "innerText",
		inputtype: TextInput
	},*/
			{
				name: 'Url',
				key: 'href',
				sort: 2,
				htmlAttr: 'href',
				inputtype: LinkInput
			},
			{
				name: 'Rel',
				key: 'rel',
				sort: 3,
				htmlAttr: 'rel',
				inputtype: LinkInput
			},
			{
				name: 'Target',
				key: 'target',
				sort: 4,
				htmlAttr: 'target',
				inputtype: SelectInput,
				data: {
					options: [
						{
							value: '',
							text: ''
						},
						{
							value: '_blank',
							text: 'Blank'
						},
						{
							value: '_parent',
							text: 'Parent'
						},
						{
							value: '_self',
							text: 'Self'
						},
						{
							value: '_top',
							text: 'Top'
						}
					]
				}
			},
			{
				name: 'Download',
				sort: 5,
				key: 'download',
				htmlAttr: 'download',
				inputtype: CheckboxInput
			}
		];

		Vvveb.Components.extend('_base', 'html/link', {
			nodes: ['a'],
			name: 'Link',
			html: '<a href="#" rel="noopener">Link Text</a>',
			image: 'icons/link.svg',
			properties: linkComponentProperties
		});

		Vvveb.Components.extend('_base', 'html/image', {
			nodes: ['img'],
			name: 'Image',
			html:
				'<img src="' +
				Vvveb.baseUrl +
				'icons/image.svg" width="200" height="200" class="img-fluid align-center">',
			image: 'icons/image.svg',
			resizable: true, //show select box resize handlers

			properties: [
				{
					name: 'Image',
					key: 'src',
					htmlAttr: 'src',
					inputtype: ImageInput
				},
				{
					name: 'Width',
					key: 'width',
					htmlAttr: 'width',
					inputtype: NumberInput
				},
				{
					name: 'Height',
					key: 'height',
					htmlAttr: 'height',
					inputtype: NumberInput
				},
				{
					name: 'Alt',
					key: 'alt',
					htmlAttr: 'alt',
					inputtype: TextInput
				},
				{
					name: 'Align',
					key: 'align',
					htmlAttr: 'class',
					inline: false,
					validValues: ['', 'align-left', 'align-center', 'align-right'],
					inputtype: RadioButtonInput,
					data: {
						extraclass: 'btn-group-sm btn-group-fullwidth',
						options: [
							{
								value: '',
								icon: 'la la-times',
								//text: "None",
								title: 'None',
								checked: true
							},
							{
								value: 'align-left',
								//text: "Left",
								title: 'text-start',
								icon: 'la la-align-left',
								checked: false
							},
							{
								value: 'align-center',
								//text: "Center",
								title: 'Center',
								icon: 'la la-align-center',
								checked: false
							},
							{
								value: 'align-right',
								//text: "Right",
								title: 'Right',
								icon: 'la la-align-right',
								checked: false
							}
						]
					}
				},
				{
					key: 'link_options',
					inputtype: SectionInput,
					//name:false,
					data: { header: 'Link' }
				},
				{
					name: 'Enable link',
					key: 'enable_link',
					inputtype: CheckboxInput,
					data: {
						className: 'form-switch'
					},
					setGroup: (value) => {
						let group = document.querySelectorAll('.mb-3[data-group="link"]');
						if (group.length) {
							group.forEach((el) => {
								if (value) {
									el.style.display = '';
								} else {
									el.style.display = 'none';
								}
							});
						}
					},
					onChange: function (node, value, input) {
						this.setGroup(value);
						if (value) {
							const wrappingElement = document.createElement('a');
							node.replaceWith(wrappingElement);
							wrappingElement.appendChild(node);
						} else {
							if (node.parentNode.tagName.toLowerCase() == 'a') {
								node.parentNode.replaceWith(node);
							}
						}
						return node;
					},
					init: function (node) {
						let value = node.parentNode.tagName.toLowerCase() == 'a';
						this.setGroup(value);
						return value;
					}
				}
			].concat(
				//add link properties after setting parent to <a> element
				linkComponentProperties.map((el) => {
					let a = Object.assign({}, el);
					a['parent'] = 'a';
					a['group'] = 'link';
					return a;
				})
			),

			init(node) {
				let group = document.querySelectorAll('.mb-3[data-group="link"]');
				if (group.length) {
					group.forEach((el) => {
						// if (value) {
						if (node) {
							el.style.display = '';
						} else {
							el.style.display = 'none';
						}
					});
				}

				return node;
			}
		});

		Vvveb.Components.extend('_base', 'html/hr', {
			image: 'icons/hr.svg',
			nodes: ['hr'],
			name: 'Horizontal Rule',
			html: '<hr class="border-primary border-4 opacity-25">',
			properties: [
				{
					name: 'Type',
					key: 'border-color',
					htmlAttr: 'class',
					validValues: [
						'border-primary',
						'border-secondary',
						'border-success',
						'border-danger',
						'border-warning',
						'border-info',
						'border-light',
						'border-dark',
						'border-white'
					],
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: 'Default',
								text: ''
							},
							{
								value: 'border-primary',
								text: 'Primary'
							},
							{
								value: 'border-secondary',
								text: 'Secondary'
							},
							{
								value: 'border-success',
								text: 'Success'
							},
							{
								value: 'border-danger',
								text: 'Danger'
							},
							{
								value: 'border-warning',
								text: 'Warning'
							},
							{
								value: 'border-info',
								text: 'Info'
							},
							{
								value: 'border-light',
								text: 'Light'
							},
							{
								value: 'border-dark',
								text: 'Dark'
							},
							{
								value: 'border-white',
								text: 'White'
							}
						]
					}
				},
				{
					name: 'Border',
					key: 'border-size',
					htmlAttr: 'class',
					validValues: ['border-1', 'border-2', 'border-3', 'border-4', 'border-5'],
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: 'Default',
								text: ''
							},
							{
								value: 'border-1',
								text: 'Size 1'
							},
							{
								value: 'border-2',
								text: 'Size 2'
							},
							{
								value: 'border-3',
								text: 'Size 3'
							},
							{
								value: 'border-4',
								text: 'Size 4'
							},
							{
								value: 'border-5',
								text: 'Size 5'
							}
						]
					}
				},
				{
					name: 'Opacity',
					key: 'opacity',
					htmlAttr: 'class',
					validValues: ['opacity-25', 'opacity-50', 'opacity-75', 'opacity-100'],
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: 'Default',
								text: ''
							},
							{
								value: 'opacity-25',
								text: 'Opacity 25%'
							},
							{
								value: 'opacity-50',
								text: 'Opacity 50%'
							},
							{
								value: 'opacity-75',
								text: 'Opacity 75%'
							},
							{
								value: 'opacity-100',
								text: 'Opacity 100%'
							}
						]
					}
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/label', {
			name: 'Label',
			nodes: ['label'],
			html: '<label for="">Label</label>',
			properties: [
				{
					name: 'For id',
					htmlAttr: 'for',
					key: 'for',
					inputtype: TextInput
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/textinput', {
			name: 'Input',
			nodes: ['input'],
			//attributes: {"type":"text"},
			image: 'icons/text_input.svg',
			html: '<input type="text" class="form-control">',
			properties: [
				{
					name: 'Name',
					key: 'name',
					htmlAttr: 'name',
					inputtype: TextInput
				},
				{
					name: 'Value',
					key: 'value',
					htmlAttr: 'value',
					inputtype: TextInput
				},
				{
					name: 'Type',
					key: 'type',
					htmlAttr: 'type',
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: 'text',
								text: 'text'
							},
							{
								value: 'button',
								text: 'button'
							},
							{
								value: 'checkbox',
								text: 'checkbox'
							},
							{
								value: 'color',
								text: 'color'
							},
							{
								value: 'date',
								text: 'date'
							},
							{
								value: 'datetime-local',
								text: 'datetime-local'
							},
							{
								value: 'email',
								text: 'email'
							},
							{
								value: 'file',
								text: 'file'
							},
							{
								value: 'hidden',
								text: 'hidden'
							},
							{
								value: 'image',
								text: 'image'
							},
							{
								value: 'month',
								text: 'month'
							},
							{
								value: 'number',
								text: 'number'
							},
							{
								value: 'password',
								text: 'password'
							},
							{
								value: 'radio',
								text: 'radio'
							},
							{
								value: 'range',
								text: 'range'
							},
							{
								value: 'reset',
								text: 'reset'
							},
							{
								value: 'search',
								text: 'search'
							},
							{
								value: 'submit',
								text: 'submit'
							},
							{
								value: 'tel',
								text: 'tel'
							},
							{
								value: 'text',
								text: 'text'
							},
							{
								value: 'time',
								text: 'time'
							},
							{
								value: 'url',
								text: 'url'
							},
							{
								value: 'week',
								text: 'week'
							}
						]
					}
				},
				{
					name: 'Placeholder',
					key: 'placeholder',
					htmlAttr: 'placeholder',
					inputtype: TextInput
				},
				{
					name: 'Disabled',
					key: 'disabled',
					htmlAttr: 'disabled',
					col: 6,
					inline: true,
					inputtype: CheckboxInput
				},
				{
					name: 'Required',
					key: 'required',
					htmlAttr: 'required',
					col: 6,
					inline: true,
					inputtype: CheckboxInput
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/selectinput', {
			nodes: ['select'],
			name: 'Select Input',
			image: 'icons/select_input.svg',
			html: '<select class="form-control"><option value="value1">Text 1</option><option value="value2">Text 2</option><option value="value3">Text 3</option></select>',

			beforeInit: function (node) {
				properties = [];
				let i = 0;

				node.querySelectorAll('option').forEach((el) => {
					data = { value: el.value, text: el.text };
					i++;
					properties.push({
						name: 'Option ' + i,
						key: 'option' + i,
						//index: i - 1,
						optionNode: el,
						inline: true,
						inputtype: TextValueInput,
						data: data,
						onChange: function (node, value, input) {
							option = this.optionNode;

							//if remove button is clicked remove option and render row properties
							if (input.nodeName == 'BUTTON') {
								option.remove();
								Vvveb.Components.render('html/selectinput');
								return node;
							}

							if (input.name == 'value') option.setAttribute('value', value);
							else if (input.name == 'text') option.textContent = value;
							return node;
						}
					});
				});

				//remove all option properties
				this.properties = this.properties.filter(function (item) {
					return item.key.indexOf('option') === -1;
				});

				//add remaining properties to generated column properties
				this.properties = properties.concat(this.properties);

				return node;
			},

			properties: [
				{
					name: 'Name',
					key: 'name',
					htmlAttr: 'name',
					inputtype: TextInput
				},
				{
					name: 'Disabled',
					key: 'disabled',
					htmlAttr: 'disabled',
					col: 6,
					inline: true,
					inputtype: CheckboxInput
				},
				{
					name: 'Required',
					key: 'required',
					htmlAttr: 'required',
					col: 6,
					inline: true,
					inputtype: CheckboxInput
				},
				{
					name: 'Option',
					key: 'option1',
					inputtype: TextValueInput
				},
				{
					name: 'Option',
					key: 'option2',
					inputtype: TextValueInput
				},
				{
					name: '',
					key: 'addChild',
					inputtype: ButtonInput,
					data: { text: 'Add option', icon: 'la-plus' },
					onChange: function (node) {
						node.append(generateElements('<option value="value">Text</option>')[0]);

						//render component properties again to include the new column inputs
						Vvveb.Components.render('html/selectinput');

						return node;
					}
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/textareainput', {
			nodes: ['textarea'],
			name: 'Text Area',
			image: 'icons/text_area.svg',
			html: '<textarea class="form-control"></textarea>',
			properties: [
				{
					name: 'Name',
					key: 'name',
					htmlAttr: 'name',
					inputtype: TextInput
				},
				{
					name: 'Value',
					key: 'value',
					htmlAttr: 'value',
					inputtype: TextInput
				},
				{
					name: 'Placeholder',
					key: 'placeholder',
					htmlAttr: 'placeholder',
					inputtype: TextInput
				},
				{
					name: 'Columns',
					key: 'cols',
					htmlAttr: 'cols',
					inputtype: NumberInput
				},
				{
					name: 'Rows',
					key: 'rows',
					htmlAttr: 'rows',
					inputtype: NumberInput
				},
				{
					name: 'Disabled',
					key: 'disabled',
					htmlAttr: 'disabled',
					col: 6,
					inline: true,
					inputtype: CheckboxInput
				},
				{
					name: 'Required',
					key: 'required',
					htmlAttr: 'required',
					col: 6,
					inline: true,
					inputtype: CheckboxInput
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/radiobutton', {
			name: 'Radio Button',
			attributes: { type: 'radio' },
			image: 'icons/radio.svg',
			html: `<div class="form-check">
			  <label class="form-check-label">
				<input class="form-check-input" type="radio" name="radiobutton"> Option 1
			  </label>
			</div>
			<div class="form-check">
			  <label class="form-check-label">
				<input class="form-check-input" type="radio" name="radiobutton" checked> Option 2
			  </label>
			</div>
			<div class="form-check">
			  <label class="form-check-label">
				<input class="form-check-input" type="radio" name="radiobutton"> Option 3
			  </label>
			</div>`,
			properties: [
				{
					name: 'Name',
					key: 'name',
					htmlAttr: 'name',
					inputtype: TextInput
					//inline:true,
					//col:6
				},
				{
					name: 'Value',
					key: 'value',
					htmlAttr: 'value',
					inputtype: TextInput
					//inline:true,
					//col:6
				},
				{
					name: 'Checked',
					key: 'checked',
					htmlAttr: 'Checked',
					inputtype: CheckboxInput
					//inline:true,
					//col:6
				},
				{
					name: 'Disabled',
					key: 'disabled',
					htmlAttr: 'disabled',
					col: 6,
					inline: true,
					inputtype: CheckboxInput
				},
				{
					name: 'Required',
					key: 'required',
					htmlAttr: 'required',
					col: 6,
					inline: true,
					inputtype: CheckboxInput
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/checkbox', {
			name: 'Checkbox',
			attributes: { type: 'checkbox' },
			image: 'icons/checkbox.svg',
			html: `<div class="form-check">
			  <label class="form-check-label">
				<input class="form-check-input" type="checkbox" value=""> Default checkbox
			  </label>
			</div>`,
			properties: [
				{
					name: 'Name',
					key: 'name',
					htmlAttr: 'name',
					inputtype: TextInput
					//inline:true,
					//col:6
				},
				{
					name: 'Value',
					key: 'value',
					htmlAttr: 'value',
					inputtype: TextInput
					//inline:true,
					//col:6
				},
				{
					name: 'Checked',
					key: 'checked',
					htmlAttr: 'Checked',
					inputtype: CheckboxInput
					//inline:true,
					//col:6
				},
				{
					name: 'Disabled',
					key: 'disabled',
					htmlAttr: 'disabled',
					col: 6,
					inline: true,
					inputtype: CheckboxInput
				},
				{
					name: 'Required',
					key: 'required',
					htmlAttr: 'required',
					col: 6,
					inline: true,
					inputtype: CheckboxInput
				}
			]
		});

		/*
Vvveb.Components.extend("_base", "html/fileinput", {
    name: "Input group",
	attributes: {"type":"file"},
    image: "icons/text_input.svg",
    html: '<input type="file" class="form-control">'
});
*/

		Vvveb.Components.extend('_base', 'html/video', {
			nodes: ['video'],
			name: 'Video',
			html: '<video width="320" height="240" playsinline loop autoplay muted src="../../media/demo/sample.webm" poster="../../media/sample.webp"><video>',
			dragHtml: '<img  width="320" height="240" src="' + Vvveb.baseUrl + 'icons/video.svg">',
			image: 'icons/video.svg',
			resizable: true, //show select box resize handlers
			properties: [
				{
					name: 'Video',
					//child: "source",
					key: 'src',
					htmlAttr: 'src',
					inputtype: VideoInput
				},
				{
					name: 'Poster',
					key: 'poster',
					htmlAttr: 'poster',
					inputtype: ImageInput
				},
				{
					name: 'Width',
					key: 'width',
					htmlAttr: 'width',
					inputtype: TextInput
				},
				{
					name: 'Height',
					key: 'height',
					htmlAttr: 'height',
					inputtype: TextInput
				},
				{
					name: 'Muted',
					key: 'muted',
					htmlAttr: 'muted',
					inputtype: CheckboxInput
				},
				{
					name: 'Loop',
					key: 'loop',
					htmlAttr: 'loop',
					inputtype: CheckboxInput
				},
				{
					name: 'Autoplay',
					key: 'autoplay',
					htmlAttr: 'autoplay',
					inputtype: CheckboxInput
				},
				{
					name: 'Plays inline',
					key: 'playsinline',
					htmlAttr: 'playsinline',
					inputtype: CheckboxInput
				},
				{
					name: 'Controls',
					key: 'controls',
					htmlAttr: 'controls',
					inputtype: CheckboxInput
				},
				{
					name: '',
					key: 'autoplay_warning',
					inline: false,
					col: 12,
					inputtype: NoticeInput,
					data: {
						type: 'warning',
						title: 'Autoplay',
						text: 'Most browsers allow auto play only if video is muted and plays inline'
					}
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/button', {
			nodes: ['button'],
			name: 'Html Button',
			image: 'icons/button.svg',
			html: '<button>Button</button>',
			properties: [
				{
					name: 'Text',
					key: 'text',
					htmlAttr: 'innerHTML',
					inputtype: TextInput
				},
				{
					name: 'Name',
					key: 'name',
					htmlAttr: 'name',
					inputtype: TextInput
				},
				{
					name: 'Type',
					key: 'type',
					htmlAttr: 'type',
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: 'button',
								text: 'button'
							},
							{
								value: 'reset',
								text: 'reset'
							},
							{
								value: 'submit',
								text: 'submit'
							}
						]
					}
				},
				{
					name: 'Autofocus',
					key: 'autofocus',
					htmlAttr: 'autofocus',
					inputtype: CheckboxInput,
					inline: true,
					col: 6
				},
				{
					name: 'Disabled',
					key: 'disabled',
					htmlAttr: 'disabled',
					inputtype: CheckboxInput,
					inline: true,
					col: 6
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/paragraph', {
			nodes: ['p'],
			name: 'Paragraph',
			image: 'icons/paragraph.svg',
			html: '<p>Lorem ipsum</p>',
			properties: [
				{
					name: 'Text align',
					key: 'p-text-align',
					htmlAttr: 'class',
					inline: false,
					validValues: ['', 'text-start', 'text-center', 'text-end'],
					inputtype: RadioButtonInput,
					data: {
						extraclass: 'btn-group-sm btn-group-fullwidth',
						options: [
							{
								value: '',
								icon: 'la la-times',
								//text: "None",
								title: 'None',
								checked: true
							},
							{
								value: 'text-start',
								//text: "Left",
								title: 'text-start',
								icon: 'la la-align-left',
								checked: false
							},
							{
								value: 'text-center',
								//text: "Center",
								title: 'Center',
								icon: 'la la-align-center',
								checked: false
							},
							{
								value: 'text-end',
								//text: "Right",
								title: 'Right',
								icon: 'la la-align-right',
								checked: false
							}
						]
					}
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/blockquote', {
			nodes: ['blockquote'],
			name: 'Blockquote',
			image: 'icons/blockquote.svg',
			html: `<blockquote cite="https://en.wikipedia.org/wiki/Marcus_Aurelius">
				<p>Today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness all of them due to the offenders' ignorance of what is good or evil.</p>
				<cite class="small">
					<a href="https://en.wikipedia.org/wiki/Marcus_Aurelius" class="text-decoration-none" target="blank">Marcus Aurelius</a>
				</cite>	
			</blockquote>`,
			properties: [
				{
					name: 'Cite',
					key: 'cite',
					inline: false,
					htmlAttr: 'cite',
					inputtype: TextInput
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/list', {
			nodes: ['ul', 'ol'],
			name: 'List',
			image: 'icons/list.svg',
			html: `<ul>
				<li>Begin with the possible; begin with one step.</li>
				<li>Never think of results, just do!</li>
				<li>Patience is the mother of will.</li>
				<li>Man must use what he has, not hope for what is not.</li>
				<li>Only super-efforts count.</li>
			</ul>`,
			properties: [
				{
					name: 'Type',
					key: 'type',
					inputtype: SelectInput,

					onChange: function (node, value) {
						return changeNodeName(node, value);
					},

					init: function (node) {
						return node.nodeName.toLowerCase();
					},

					data: {
						options: [
							{
								value: 'ul',
								text: 'Unordered'
							},
							{
								value: 'ol',
								text: 'Ordered'
							}
						]
					}
				},
				{
					name: 'Items',
					key: 'items',
					inputtype: ListInput,
					htmlAttr: 'data-slides-per-view',
					inline: true,
					data: {
						selector: 'li',
						container: '',
						prefix: 'Item ',
						removeElement: true,
						newElement: `<li>Do everything quickly and well.</li>`
					},
					onChange: function (node, value, input, component, event) {
						let element = node;

						if (event.action) {
							if (event.action == 'add') {
								//node.append(generateElements(`<li>List item</li>`)[0]);

								//temporary solution to better update list
								Vvveb.Components.render('html/list');
							}
							if (event.action == 'remove') {
							} else if (event.action == 'select') {
							}
						}

						return node;
					}
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/preformatted', {
			nodes: ['pre'],
			name: 'Preformatted',
			image: 'icons/paragraph.svg',
			html: `<pre>Today I shall be meeting with interference, 
ingratitude, insolence, disloyalty, ill-will, and
selfishness all of them due to the offenders'
ignorance of what is good or evil..</pre>`,
			properties: [
				{
					name: 'Text',
					key: 'text',
					inline: false,
					htmlAttr: 'innerHTML',
					inputtype: TextareaInput,
					data: {
						rows: 20
					}
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/form', {
			nodes: ['form'],
			image: 'icons/form.svg',
			name: 'Form',
			html: `<form action="" method="POST">
	  <div class="mb-3">
		<label for="exampleInputEmail1" class="form-label">Email address</label>
		<input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
		<div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
	  </div>
	  <div class="mb-3">
		<label for="exampleInputPassword1" class="form-label">Password</label>
		<input type="password" class="form-control" id="exampleInputPassword1">
	  </div>
	  <div class="mb-3 form-check">
		<input type="checkbox" class="form-check-input" id="exampleCheck1">
		<label class="form-check-label" for="exampleCheck1">Check me out</label>
	  </div>
	  <button type="submit" class="btn btn-primary">Submit</button>
	</form>`,
			properties: [
				/*{
        name: "Style",
        key: "style",
        htmlAttr: "class",
        validValues: ["", "form-search", "form-inline", "form-horizontal"],
        inputtype: SelectInput,
        data: {
            options: [{
                value: "",
                text: "Default"
            }, {
                value: "form-search",
                text: "Search"
            }, {
                value: "form-inline",
                text: "Inline"
            }, {
                value: "form-horizontal",
                text: "Horizontal"
            }]
        }
    }, */ {
					name: 'Action',
					key: 'action',
					htmlAttr: 'action',
					inputtype: TextInput
				},
				{
					name: 'Method',
					key: 'method',
					htmlAttr: 'method',
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: 'post',
								text: 'Post'
							},
							{
								value: 'get',
								text: 'Get'
							}
						]
					}
				},
				{
					name: 'Encoding type',
					key: 'enctype',
					htmlAttr: 'enctype',
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: '',
								text: ''
							},
							{
								value: 'application/x-www-form-urlencoded',
								text: 'Url encoded (default)'
							},
							{
								value: 'multipart/form-data',
								text: 'Multipart (for file upload)'
							},
							{
								value: 'text/plain',
								text: 'Text plain'
							}
						]
					}
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/tablerow', {
			nodes: ['tr'],
			image: 'icons/table.svg',
			name: 'Table Row',
			html: '<tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>',
			properties: [
				{
					name: 'Type',
					key: 'type',
					htmlAttr: 'class',
					inputtype: SelectInput,
					validValues: ['', 'success', 'danger', 'warning', 'active'],
					data: {
						options: [
							{
								value: '',
								text: 'Default'
							},
							{
								value: 'success',
								text: 'Success'
							},
							{
								value: 'error',
								text: 'Error'
							},
							{
								value: 'warning',
								text: 'Warning'
							},
							{
								value: 'active',
								text: 'Active'
							}
						]
					}
				}
			]
		});
		Vvveb.Components.extend('_base', 'html/tablecell', {
			nodes: ['td'],
			image: 'icons/table.svg',
			name: 'Table Cell',
			html: '<td>Cell</td>'
		});

		Vvveb.Components.extend('_base', 'html/tableheadercell', {
			nodes: ['th'],
			image: 'icons/table.svg',
			name: 'Table Header Cell',
			html: '<th>Head</th>'
		});

		Vvveb.Components.extend('_base', 'html/tablebody', {
			nodes: ['tbody'],
			image: 'icons/table.svg',
			name: 'Table Body',
			html: '<tbody>Table body</tbody>'
		});

		Vvveb.Components.extend('_base', 'html/tablefooter', {
			nodes: ['tfooter'],
			image: 'icons/table.svg',
			name: 'Table Footer',
			html: '<tfooter>Table footer</tfooter>'
		});

		Vvveb.Components.extend('_base', 'html/tablehead', {
			nodes: ['thead'],
			image: 'icons/table.svg',
			name: 'Table Head',
			html: '<thead><tr><th>Head 1</th><th>Head 2</th><th>Head 3</th></tr></thead>',
			properties: [
				{
					name: 'Type',
					key: 'type',
					htmlAttr: 'class',
					inputtype: SelectInput,
					validValues: ['', 'success', 'danger', 'warning', 'info'],
					data: {
						options: [
							{
								value: '',
								text: 'Default'
							},
							{
								value: 'success',
								text: 'Success'
							},
							{
								value: 'anger',
								text: 'Error'
							},
							{
								value: 'warning',
								text: 'Warning'
							},
							{
								value: 'info',
								text: 'Info'
							}
						]
					}
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/table', {
			nodes: ['table'],
			classes: ['table'],
			image: 'icons/table.svg',
			name: 'Table',
			html: `<table class="table table-striped table-hover">
			  <thead>
				<tr>
				  <th scope="col">#</th>
				  <th scope="col">First</th>
				  <th scope="col">Last</th>
				  <th scope="col">Handle</th>
				</tr>
			  </thead>
			  <tbody>
				<tr>
				  <th scope="row">1</th>
				  <td>Mark</td>
				  <td>Otto</td>
				  <td>@mdo</td>
				</tr>
				<tr>
				  <th scope="row">2</th>
				  <td>Jacob</td>
				  <td>Thornton</td>
				  <td>@fat</td>
				</tr>
				<tr>
				  <th scope="row">3</th>
				  <td colspan="2">Larry the Bird</td>
				  <td>@twitter</td>
				</tr>
			  </tbody>
			</table>`,
			properties: [
				{
					name: 'Type',
					key: 'type',
					htmlAttr: 'class',
					validValues: [
						'table-primary',
						'table-secondary',
						'table-success',
						'table-danger',
						'table-warning',
						'table-info',
						'table-light',
						'table-dark',
						'table-white'
					],
					inputtype: SelectInput,
					data: {
						options: [
							{
								value: 'Default',
								text: ''
							},
							{
								value: 'table-primary',
								text: 'Primary'
							},
							{
								value: 'table-secondary',
								text: 'Secondary'
							},
							{
								value: 'table-success',
								text: 'Success'
							},
							{
								value: 'table-danger',
								text: 'Danger'
							},
							{
								value: 'table-warning',
								text: 'Warning'
							},
							{
								value: 'table-info',
								text: 'Info'
							},
							{
								value: 'table-light',
								text: 'Light'
							},
							{
								value: 'table-dark',
								text: 'Dark'
							},
							{
								value: 'table-white',
								text: 'White'
							}
						]
					}
				},
				{
					name: 'Responsive',
					key: 'responsive',
					htmlAttr: 'class',
					validValues: ['table-responsive'],
					inputtype: ToggleInput,
					data: {
						on: 'table-responsive',
						off: ''
					}
				},
				{
					name: 'Small',
					key: 'small',
					htmlAttr: 'class',
					validValues: ['table-sm'],
					inputtype: ToggleInput,
					data: {
						on: 'table-sm',
						off: ''
					}
				},
				{
					name: 'Hover',
					key: 'hover',
					htmlAttr: 'class',
					validValues: ['table-hover'],
					inputtype: ToggleInput,
					data: {
						on: 'table-hover',
						off: ''
					}
				},
				{
					name: 'Bordered',
					key: 'bordered',
					htmlAttr: 'class',
					validValues: ['table-bordered'],
					inputtype: ToggleInput,
					data: {
						on: 'table-bordered',
						off: ''
					}
				},
				{
					name: 'Striped',
					key: 'striped',
					htmlAttr: 'class',
					validValues: ['table-striped'],
					inputtype: ToggleInput,
					data: {
						on: 'table-striped',
						off: ''
					}
				},
				{
					name: 'Inverse',
					key: 'inverse',
					htmlAttr: 'class',
					validValues: ['table-inverse'],
					inputtype: ToggleInput,
					data: {
						on: 'table-inverse',
						off: ''
					}
				},
				{
					name: 'Head options',
					key: 'head',
					htmlAttr: 'class',
					child: 'thead',
					inputtype: SelectInput,
					validValues: ['', 'thead-dark', 'thead-light'],
					data: {
						options: [
							{
								value: '',
								text: 'None'
							},
							{
								value: 'thead-default',
								text: 'Default'
							},
							{
								value: 'thead-inverse',
								text: 'Inverse'
							}
						]
					}
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/audio', {
			nodes: ['audio'],
			attributes: ['data-component-audio'],
			name: 'Audio',
			image: 'icons/audio.svg',
			html: `<figure data-component-audio><audio controls src="#"></audio></figure>`,
			properties: [
				{
					name: 'Src',
					key: 'src',
					child: 'audio',
					htmlAttr: 'src',
					inputtype: LinkInput
				},
				{
					key: 'audio_options',
					inputtype: SectionInput,
					name: false,
					data: { header: 'Options' }
				},
				{
					name: 'Autoplay',
					key: 'autoplay',
					htmlAttr: 'autoplay',
					child: 'audio',
					inputtype: CheckboxInput,
					inline: true,
					col: 4
					/*    }, {
        name: "Controls",
        key: "controls",
        htmlAttr: "controls",
        inputtype: CheckboxInput,
        child:"audio",
        inline:true,
        col:4,
*/
				},
				{
					name: 'Loop',
					key: 'loop',
					htmlAttr: 'loop',
					inputtype: CheckboxInput,
					child: 'audio',
					inline: true,
					col: 4
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/pdf', {
			attributes: ['data-component-pdf'],
			image: 'icons/pdf.svg',
			name: 'Pdf embed',
			html: `<object data="" type="application/pdf" data-component-pdf></object>`,
			properties: [
				{
					name: 'Data',
					key: 'data',
					htmlAttr: 'data',
					inputtype: TextInput
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/embed', {
			attributes: ['data-component-embed'],
			image: 'icons/embed.svg',
			name: 'Embed',
			html: `<object data="" type="application/pdf" data-component-pdf></object>`,
			properties: [
				{
					name: 'Data',
					key: 'data',
					htmlAttr: 'data',
					inputtype: TextInput
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/html', {
			nodes: ['html'],
			name: 'Html Page',
			image: 'icons/posts.svg',
			html: `<html><body></body></html>`,
			properties: [
				{
					name: 'Title',
					key: 'title',
					htmlAttr: 'innerHTML',
					inputtype: TextInput,
					child: 'title'
				},
				{
					name: 'Meta description',
					key: 'description',
					htmlAttr: 'content',
					inputtype: TextInput,
					child: 'meta[name=description]'
				},
				{
					name: 'Meta keywords',
					key: 'keywords',
					htmlAttr: 'content',
					inputtype: TextInput,
					child: 'meta[name=keywords]'
				}
			]
		});

		Vvveb.Components.extend('_base', 'html/iframe', {
			attributes: ['data-component-iframe'],
			name: 'Iframe',
			image: 'icons/file.svg',
			html: '<div data-component-iframe><iframe src="https://www.vvveb.com" width="320" height="240"></iframe></div>',
			properties: [
				{
					name: 'Src',
					key: 'src',
					htmlAttr: 'src',
					child: 'iframe',
					inputtype: TextInput
				},
				{
					name: 'Width',
					key: 'width',
					htmlAttr: 'width',
					child: 'iframe',
					inputtype: CssUnitInput
				},
				{
					name: 'Height',
					key: 'height',
					htmlAttr: 'height',
					child: 'iframe',
					inputtype: CssUnitInput
				}
			]
		});

		Vvveb.ComponentsGroup['Embeds'] = ['embeds/embed'];

		Vvveb.Components.extend('_base', 'embeds/embed', {
			name: 'Embed',
			attributes: ['data-component-oembed'],
			image: 'icons/code.svg',
			//dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/maps.png">',
			html: `<div data-component-oembed data-url="">
			<div class="alert alert-light  m-5" role="alert">
				<img width="64" src="${Vvveb.baseUrl}icons/code.svg">
				<h6>Enter url to embed</h6>
			</div></div>`,

			properties: [
				{
					name: 'Url',
					key: 'url',
					htmlAttr: 'data-url',
					inputtype: TextInput,
					onChange: function (node, value) {
						node.innerHTML = `<div class="alert alert-light d-flex justify-content-center">
				  <div class="spinner-border m-5" role="status">
					<span class="visually-hidden">Loading...</span>
				  </div>
				</div>`;

						getOembed(value)
							.then((response) => {
								node.innerHTML = response.html;
								let containerW = node.offsetWidth;
								let iframe = node.querySelector('iframe');
								if (iframe) {
									let ratio = containerW / iframe.offsetWidth;
									iframe.setAttribute('width', width * ratio);
									iframe.setAttribute('height', height * ratio);
								}

								let arr = node.querySelectorAll('script').forEach((script) => {
									let newScript = Vvveb.Builder.frameDoc.createElement('script');
									newScript.src = script.src;
									script.replaceWith(newScript);
								});
							})
							.catch((error) => console.log(error));

						return node;
					}
				},
				{
					name: 'Width',
					key: 'width',
					child: 'iframe',
					htmlAttr: 'width',
					inputtype: CssUnitInput
				},
				{
					name: 'Height',
					key: 'height',
					child: 'iframe',
					htmlAttr: 'height',
					inputtype: CssUnitInput
				}
			]
		});

		for (const provider of [
			'youtube',
			'vimeo',
			'dailymotion',
			'flickr',
			'smugmug',
			'scribd',
			'twitter',
			'soundcloud',
			'slideshare',
			'spotify',
			'imgur',
			'issuu',
			'mixcloud',
			'ted',
			'animoto',
			'tumblr',
			'kickstarter',
			'reverbnation',
			'reddit',
			'speakerdeck',
			'screencast',
			'amazon',
			'someecards',
			'tiktok',
			'pinterest',
			'wolfram',
			'anghami'
		]) {
			Vvveb.Components.add('embeds/' + provider, {
				name: provider,
				image: 'icons/code.svg',
				html: `<div data-component-oembed data-url="">
				<div class="alert alert-light  m-5" role="alert">
					<img width="64" src="${Vvveb.baseUrl}icons/code.svg">
					<h6>Enter ${provider} url to embed</h6>
				</div></div>`
			});
			Vvveb.ComponentsGroup['Embeds'].push('embeds/' + provider);
		}

		addCustomBlocks(Vvveb);
		addCustomSections(Vvveb);

		// step 1
		Vvveb.Builder.init(pages[firstPage]['url'], function () {
			//load code after page is loaded here
		});

		Vvveb.Gui.init();
		Vvveb.FileManager.init();
		Vvveb.SectionList.init();
		Vvveb.TreeList.init();
		Vvveb.Breadcrumb.init();
		Vvveb.CssEditor.init();
		Vvveb.FileManager.addPages(pages);
		Vvveb.FileManager.loadPage(pages[firstPage]['name']);
		// Vvveb.Gui.toggleRightColumn(false);
	});

	function updateNavTab(id: number) {
		// update
	}
</script>

<!-- Start -->
<div id="vvveb-builder">
	<TopPanel />

	<div id="left-panel">
		<div class="left-panel-container">
			<div id="filemanager">
				<div class="header">
					<span class="text-secondary"><i class="la la-file la-lg"></i> Pages</span>

					<div class="btn-group responsive-btns float-end" role="group">
						<button
							class="btn btn-outline-primary btn-sm btn-add"
							title="New page (Ctrl + Shift + P)"
							id="new-file-btn"
							data-vvveb-action="newPage"
							data-vvveb-shortcut=""
							disabled="true"
						>
							<span>Add new</span>
						</button>

						<!--  &ensp;
									  <button class="btn btn-link text-dark p-0"  title="Delete file" id="delete-file-btn" data-vvveb-action="deletePage" data-vvveb-shortcut="">
										  <i class="la la-trash"></i> <small>Delete</small>
									  </button> -->
					</div>
				</div>

				<div class="tree">
					<ol></ol>
				</div>
			</div>

			<div class="drag-elements">
				<div class="header">
					<ul class="nav nav-tabs nav-fill" id="elements-tabs" role="tablist">
						{#each elementsNavTabs as tab, i (tab.id)}
							<li class="nav-item {tab.title}-tab">
								<button
									id="{tab.title}-tab"
									data-bs-toggle="tab"
									role="tab"
									aria-controls={tab.title}
									aria-selected={tab.id === activeElementsNavTabIndex}
									class:active={activeElementsNavTabIndex === tab.id}
									onclick={() => {
										if (activeElementsNavTabIndex === tab.id) return;
										activeElementsNavTabIndex = tab.id;
										updateNavTab(tab.id);
									}}
								>
									<span class="cta">{tab.title}</span>
								</button>
							</li>
						{/each}
					</ul>

					<div class="tab-content">
						<!-- sections tab & content -->

						<div
							class="tab-pane sections"
							id="sections"
							role="tabpanel"
							aria-labelledby="sections-tab"
							class:show={activeElementsNavTabIndex === 0}
							class:active={activeElementsNavTabIndex === 0}
						>
							<ul
								class="nav nav-tabs nav-fill nav-underline sections-tabs"
								id="sections-tabs"
								role="tablist"
							>
								{#each elementsNavTabs[0].subTabs as tab, i (tab.id)}
									<li class="nav-item {tab.title}-tab">
										<button
											id="{tab.title}-tab"
											data-bs-toggle="tab"
											role="tab"
											aria-controls={tab.title}
											aria-selected={tab.id === elementsNavTabs[0].activeSubTabsIndex}
											class:active={elementsNavTabs[0].activeSubTabsIndex === tab.id}
											onclick={() => {
												if (elementsNavTabs[0].activeSubTabsIndex === tab.id) return;
												elementsNavTabs[0].activeSubTabsIndex = tab.id;
												updateNavTab(tab.id);
											}}
										>
											<span class="cta">{tab.title}</span>
										</button>
									</li>
								{/each}
							</ul>

							<div class="tab-content">
								<div
									class="tab-pane"
									id="sections-list"
									data-section="style"
									role="tabpanel"
									aria-labelledby="style-tab"
									class:show={elementsNavTabs[0].activeSubTabsIndex === 1}
									class:active={elementsNavTabs[0].activeSubTabsIndex === 1}
								>
									<div class="drag-elements-sidepane sidepane">
										<div>
											<div class="sections-container p-4">
												<div class="section-item" draggable="true">
													<div class="controls">
														<div class="handle"></div>
														<div class="info">
															<div class="name">
																&nbsp;
																<div class="type">&nbsp;</div>
															</div>
														</div>
													</div>
												</div>
												<div class="section-item" draggable="true">
													<div class="controls">
														<div class="handle"></div>
														<div class="info">
															<div class="name">
																&nbsp;
																<div class="type">&nbsp;</div>
															</div>
														</div>
													</div>
												</div>
												<div class="section-item" draggable="true">
													<div class="controls">
														<div class="handle"></div>
														<div class="info">
															<div class="name">
																&nbsp;
																<div class="type">&nbsp;</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div
									class="tab-pane"
									id="sections-new-tab"
									data-section="content"
									role="tabpanel"
									aria-labelledby="content-tab"
									class:show={elementsNavTabs[0].activeSubTabsIndex === 0}
									class:active={elementsNavTabs[0].activeSubTabsIndex === 0}
								>
									<div class="search form-control">
										<input
											class="form-control section-search"
											placeholder="Search sections"
											type="text"
											data-vvveb-action="search"
											data-vvveb-on="keyup"
										/>

										<div class="btn-group">
											<button
												class="clear-backspace"
												data-vvveb-action="clearSearch"
												title="Clear search"
											>
												x
											</button>
											<button class="text-sm" title="Expand All" data-vvveb-action="expand">
												+
											</button>
											<button title="Collapse all" data-vvveb-action="collapse"> - </button>
										</div>
									</div>

									<div class="drag-elements-sidepane sidepane">
										<div class="block-preview"><img src="" style="display:none" /></div>
										<div>
											<ul class="sections-list clearfix" data-type="leftpanel"></ul>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div
							class="tab-pane"
							id="components-tabs"
							role="tabpanel"
							aria-labelledby="components-tab"
							class:show={activeElementsNavTabIndex === 1}
							class:active={activeElementsNavTabIndex === 1}
						>
							<ul class="nav nav-tabs nav-fill nav-underline sections-tabs" role="tablist">
								{#each elementsNavTabs[1].subTabs as tab, i (tab.id)}
									<li class="nav-item {tab.title}-tab">
										<button
											id="{tab.title}-tab"
											data-bs-toggle="tab"
											role="tab"
											aria-controls={tab.title}
											aria-selected={tab.id === elementsNavTabs[1].activeSubTabsIndex}
											class:active={elementsNavTabs[1].activeSubTabsIndex === tab.id}
											onclick={() => {
												if (elementsNavTabs[1].activeSubTabsIndex === tab.id) return;
												elementsNavTabs[1].activeSubTabsIndex = tab.id;
												updateNavTab(tab.id);
											}}
										>
											<span class="cta">{tab.title}</span>
										</button>
									</li>
								{/each}
							</ul>

							<div class="tab-content">
								<div
									class="tab-pane components"
									id="components"
									data-section="components"
									role="tabpanel"
									aria-labelledby="components-tab"
									class:show={elementsNavTabs[1].activeSubTabsIndex === 0}
									class:active={elementsNavTabs[1].activeSubTabsIndex === 0}
								>
									<div class="search form-control">
										<input
											class="form-control component-search"
											placeholder="Search components"
											type="text"
											data-vvveb-action="search"
											data-vvveb-on="keyup"
										/>
										<div class="btn-group">
											<button
												class="clear-backspace"
												data-vvveb-action="clearSearch"
												title="Clear search"
											>
												x
											</button>
											<button class="text-sm" title="Expand All" data-vvveb-action="expand">
												+
											</button>
											<button title="Collapse all" data-vvveb-action="collapse"> - </button>
										</div>
									</div>

									<div class="drag-elements-sidepane sidepane">
										<div>
											<ul class="components-list clearfix" data-type="leftpanel"></ul>
										</div>
									</div>
								</div>

								<div
									class="tab-pane blocks"
									id="blocks"
									data-section="content"
									role="tabpanel"
									aria-labelledby="content-tab"
									class:show={elementsNavTabs[1].activeSubTabsIndex === 1}
									class:active={elementsNavTabs[1].activeSubTabsIndex === 1}
								>
									<div class="search form-control">
										<input
											class="form-control block-search"
											placeholder="Search blocks"
											type="text"
											data-vvveb-action="search"
											data-vvveb-on="keyup"
										/>

										<div class="btn-group">
											<button class="clear-backspace" data-vvveb-action="clearSearch"> x </button>
											<button class="text-sm" title="Expand All" data-vvveb-action="expand">
												+
											</button>
											<button title="Collapse all" data-vvveb-action="collapse"> - </button>
										</div>
									</div>

									<div class="drag-elements-sidepane sidepane">
										<div class="block-preview"><img src="" /></div>
										<div>
											<ul class="blocks-list clearfix" data-type="leftpanel"></ul>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div
							class="tab-pane"
							id="properties"
							role="tabpanel"
							aria-labelledby="properties-tab"
							class:show={activeElementsNavTabIndex === 2}
							class:active={activeElementsNavTabIndex === 2}
						>
							<div class="component-properties-sidepane">
								<div>
									<div class="component-properties">
										<ul
											class="nav nav-tabs nav-fill nav-underline"
											id="properties-tabs"
											role="tablist"
										>
											{#each elementsNavTabs[2].subTabs as tab, i (tab.id)}
												<li class="nav-item {tab.title}-tab">
													<button
														id="{tab.title}-tab"
														data-bs-toggle="tab"
														role="tab"
														aria-controls={tab.title}
														aria-selected={tab.id === elementsNavTabs[2].activeSubTabsIndex}
														class:active={elementsNavTabs[2].activeSubTabsIndex === tab.id}
														onclick={() => {
															if (elementsNavTabs[2].activeSubTabsIndex === tab.id) return;
															elementsNavTabs[2].activeSubTabsIndex = tab.id;
															updateNavTab(tab.id);
														}}
													>
														<span class="cta">{tab.title}</span>
													</button>
												</li>
											{/each}
										</ul>

										<div class="tab-content" data-offset="20">
											<div
												class="tab-pane"
												id="content-left-panel-tab"
												data-section="content"
												role="tabpanel"
												aria-labelledby="content-tab"
												class:show={elementsNavTabs[2].activeSubTabsIndex === 0}
												class:active={elementsNavTabs[2].activeSubTabsIndex === 0}
											>
												<div
													class="alert alert-dismissible fade show alert-light m-3"
													role="alert"
													style=""
												>
													<button
														type="button"
														class="btn-close"
														data-bs-dismiss="alert"
														aria-label="Close"
													></button>
													<strong>No selected element!</strong><br /> Click on an element to edit.
												</div>
											</div>

											<div
												class="tab-pane"
												id="style-left-panel-tab"
												data-section="style"
												role="tabpanel"
												aria-labelledby="style-tab"
												class:show={elementsNavTabs[2].activeSubTabsIndex === 1}
												class:active={elementsNavTabs[2].activeSubTabsIndex === 1}
											>
												<div class="panel-group">
													<input
														class="panel-group--checkbox"
														type="checkbox"
														checked="true"
														id="header_display_header-007"
													/>
													<label
														class="panel-group--header"
														data-header="display_header"
														for="header_display_header-007"
													>
														<span class="cta">Psuedo Classes</span>
														<svg
															class="icon"
															aria-hidden="true"
															role="img"
															xmlns="http://www.w3.org/2000/svg"
															width="44"
															height="44"
															fill="none"
															viewBox="0 0 44 44"
														>
															<path
																fill="currentColor"
																d="M19.781 33.65a3.147 3.147 0 0 0 4.448 0l18.85-18.851a3.147 3.147 0 0 0 0-4.448 3.147 3.147 0 0 0-4.447 0L22 26.983 5.368 10.361a3.147 3.147 0 0 0-4.448 0 3.147 3.147 0 0 0 0 4.448l18.851 18.85.01-.01Z"
															></path>
														</svg>
													</label>
													<div class="panel-group--content" style="display: block;">
														<div class="select-container">
															<select
																class="form-select"
																data-vvveb-action="setState"
																data-vvveb-on="change"
															>
																<option value=""> - Pseudo Class/State - </option>
																<option value="hover">hover</option>
																<option value="focus">focus</option>
																<option value="active">active</option>
																<option value="nth-of-type(2n)">nth-of-type(2n)</option>
															</select>
														</div>
													</div>
												</div>
											</div>

											<div
												class="tab-pane"
												id="advanced-left-panel-tab"
												data-section="advanced"
												role="tabpanel"
												aria-labelledby="advanced-tab"
												class:show={elementsNavTabs[2].activeSubTabsIndex === 2}
												class:active={elementsNavTabs[2].activeSubTabsIndex === 2}
											></div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div
							class="tab-pane"
							id="configuration"
							role="tabpanel"
							aria-labelledby="configuration-tab"
							class:show={activeElementsNavTabIndex === 3}
							class:active={activeElementsNavTabIndex === 3}
						>
							<ul
								class="nav nav-tabs nav-fill nav-underline sections-tabs"
								id="vars-tabs"
								role="tablist"
							>
								{#each elementsNavTabs[3].subTabs as tab, i (tab.id)}
									<li class="nav-item {tab.title}-tab">
										<button
											id="{tab.title}-tab"
											data-bs-toggle="tab"
											role="tab"
											aria-controls={tab.title}
											aria-selected={tab.id === elementsNavTabs[3].activeSubTabsIndex}
											class:active={elementsNavTabs[3].activeSubTabsIndex === tab.id}
											onclick={() => {
												if (elementsNavTabs[3].activeSubTabsIndex === tab.id) return;
												elementsNavTabs[3].activeSubTabsIndex = tab.id;
												updateNavTab(tab.id);
											}}
										>
											<span class="cta">{tab.title}</span>
										</button>
									</li>
								{/each}
							</ul>

							<div class="tab-content">
								<div
									class="tab-pane"
									id="vars-tab"
									data-section="vars"
									role="tabpanel"
									aria-labelledby="vars-tab"
									class:show={elementsNavTabs[3].activeSubTabsIndex === 0}
									class:active={elementsNavTabs[3].activeSubTabsIndex === 0}
								>
									<div class="drag-elements-sidepane sidepane">
										<div data-offset="80">
											<div class="component-properties">
												<input class="header_check" type="checkbox" checked id="header_pallette" />
												<div class="tab-pane section px-0" data-section="content"></div>
											</div>
										</div>
									</div>
								</div>

								<div
									class="tab-pane"
									id="css-tab"
									data-section="css"
									role="tabpanel"
									aria-labelledby="css-tab"
									class:show={elementsNavTabs[3].activeSubTabsIndex === 1}
									class:active={elementsNavTabs[3].activeSubTabsIndex === 1}
								>
									<div class="drag-elements-sidepane sidepane">
										<div data-offset="80">
											<textarea id="css-editor" class="form-control" rows="24"></textarea>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- end configuration tab -->
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="canvas">
		<div id="iframe-wrapper">
			<div id="iframe-layer">
				<div class="loading-message active">
					<div class="animation-container">
						<div class="dot dot-1"></div>
						<div class="dot dot-2"></div>
						<div class="dot dot-3"></div>
					</div>

					<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
						<defs>
							<filter id="goo">
								<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
								<feColorMatrix
									in="blur"
									mode="matrix"
									values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
								/>
							</filter>
						</defs>
					</svg>
					<!-- https://codepen.io/Izumenko/pen/MpWyXK -->
				</div>

				<div id="highlight-box">
					<div id="highlight-name">
						<span class="name"></span>
						<span class="type"></span>
					</div>

					<div id="section-actions">
						<a id="add-section-btn" href="" title="Add element"><i class="la la-plus"></i></a>
					</div>
				</div>

				<div id="select-box">
					<div id="wysiwyg-editor" class="default-editor">
						<!--
										<a id="bold-btn" href="" title="Bold">
											<svg height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
												<path clip-rule="evenodd" d="M56 40V216H148C176.719 216 200 192.719 200 164C200 147.849 192.637 133.418 181.084 123.88C187.926 115.076 192 104.014 192 92C192 63.2812 168.719 40 140 40H56ZM88 144V184H148C159.046 184 168 175.046 168 164C168 152.954 159.046 144 148 144H88ZM88 112V72H140C151.046 72 160 80.9543 160 92C160 103.046 151.046 112 140 112H88Z" fill="#252525" fill-rule="evenodd"/>
											</svg>	
										</a>
										<a id="italic-btn" href="" title="Italic">
											<svg height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
												<path d="M202 40H84V64H126.182L89.8182 192H54V216H172V192H129.818L166.182 64H202V40Z" fill="#252525"/>
											</svg>											
										</a>
										<a id="underline-btn" href="" title="Underline">
											<svg height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
												<path clip-rule="evenodd" d="M88 40H60V108.004C60 145.56 90.4446 176.004 128 176.004C165.555 176.004 196 145.56 196 108.004V40H168V108C168 130.091 150.091 148 128 148C105.909 148 88 130.091 88 108V40ZM204 216V192H52V216H204Z" fill="#252525" fill-rule="evenodd"/>
											</svg>
										</a>
										-->

						<a id="bold-btn" class="hint" href="" title="Bold" aria-label="Bold">
							<svg height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M6,4h8a4,4,0,0,1,4,4h0a4,4,0,0,1-4,4H6Z"
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="3"
								/>
								<path
									d="M6,12h9a4,4,0,0,1,4,4h0a4,4,0,0,1-4,4H6Z"
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="3"
								/>
							</svg>
						</a>
						<a id="italic-btn" class="hint" href="" title="Italic" aria-label="Italic">
							<svg height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
								<line
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									x1="19"
									x2="10"
									y1="4"
									y2="4"
								/>
								<line
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									x1="14"
									x2="5"
									y1="20"
									y2="20"
								/>
								<line
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									x1="15"
									x2="9"
									y1="4"
									y2="20"
								/>
							</svg>
						</a>
						<a id="underline-btn" class="hint" href="" title="Underline" aria-label="Underline">
							<svg height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M6,4v7a6,6,0,0,0,6,6h0a6,6,0,0,0,6-6V4"
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									y1="2"
									y2="2"
								/>
								<line
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									x1="4"
									x2="20"
									y1="22"
									y2="22"
								/>
							</svg>
						</a>

						<a id="strike-btn" class="hint" href="" title="Strikeout" aria-label="Strikeout">
							<del>S</del>
						</a>

						<div class="dropdown">
							<button
								class="btn btn-link dropdown-toggle"
								type="button"
								id="dropdownMenuButton"
								data-bs-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								<span class="hint" aria-label="Text align"><i class="la la-align-left"></i></span>
							</button>

							<div id="justify-btn" class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a class="dropdown-item" href="#" data-value="Left"
									><i class="la la-lg la-align-left"></i> Align Left</a
								>
								<a class="dropdown-item" href="#" data-value="Center"
									><i class="la la-lg la-align-center"></i> Align Center</a
								>
								<a class="dropdown-item" href="#" data-value="Right"
									><i class="la la-lg la-align-right"></i> Align Right</a
								>
								<a class="dropdown-item" href="#" data-value="Full"
									><i class="la la-lg la-align-justify"></i> Align Justify</a
								>
							</div>
						</div>

						<div class="separator"></div>

						<a id="link-btn" class="hint" href="" title="Create link" aria-label="Create link">
							<i class="la la-link"> </i></a
						>

						<div class="separator"></div>

						<input
							id="fore-color"
							name="color"
							type="color"
							aria-label="Text color"
							pattern="#[a-f0-9]{6}"
							class="form-control form-control-color hint"
						/>
						<input
							id="back-color"
							name="background-color"
							type="color"
							aria-label="Background color"
							pattern="#[a-f0-9]{6}"
							class="form-control form-control-color hint"
						/>

						<div class="separator"></div>

						<select id="font-size" class="form-select" aria-label="Font size">
							<option value="">- Font size -</option>
							<option value="8px">8 px</option>
							<option value="9px">9 px</option>
							<option value="10px">10 px</option>
							<option value="11px">11 px</option>
							<option value="12px">12 px</option>
							<option value="13px">13 px</option>
							<option value="14px">14 px</option>
							<option value="15px">15 px</option>
							<option value="16px">16 px</option>
							<option value="17px">17 px</option>
							<option value="18px">18 px</option>
							<option value="19px">19 px</option>
							<option value="20px">20 px</option>
							<option value="21px">21 px</option>
							<option value="22px">22 px</option>
							<option value="23px">23 px</option>
							<option value="24px">24 px</option>
							<option value="25px">25 px</option>
							<option value="26px">26 px</option>
							<option value="27px">27 px</option>
							<option value="28px">28 px</option>
						</select>

						<div class="separator"></div>

						<select id="font-family" class="form-select" title="Font family">
							<option value=""> - Font family - </option>
							<optgroup label="System default">
								<option value="Arial, Helvetica, sans-serif">Arial</option>
								<option value="'Lucida Sans Unicode', 'Lucida Grande', sans-serif"
									>Lucida Grande</option
								>
								<option value="'Palatino Linotype', 'Book Antiqua', Palatino, serif"
									>Palatino Linotype</option
								>
								<option value="'Times New Roman', Times, serif">Times New Roman</option>
								<option value="Georgia, serif">Georgia, serif</option>
								<option value="Tahoma, Geneva, sans-serif">Tahoma</option>
								<option value="'Comic Sans MS', cursive, sans-serif">Comic Sans</option>
								<option value="Verdana, Geneva, sans-serif">Verdana</option>
								<option value="Impact, Charcoal, sans-serif">Impact</option>
								<option value="'Arial Black', Gadget, sans-serif">Arial Black</option>
								<option value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet</option>
								<option value="'Courier New', Courier, monospace">Courier New</option>
								<option value="'Brush Script MT', sans-serif">Brush Script</option>
							</optgroup>
						</select>
					</div>

					<div id="select-actions">
						<a id="drag-btn" href="" title="Drag element">
							<svg
								aria-hidden="true"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								width="44"
								height="44"
								fill="none"
								viewBox="0 0 44 44"
							>
								<path
									fill="currentColor"
									d="M23.942.806a2.755 2.755 0 0 0-3.893 0l-5.5 5.5a2.754 2.754 0 0 0 0 3.894 2.754 2.754 0 0 0 3.893 0l.808-.808v9.858H9.392l.808-.808a2.754 2.754 0 0 0 0-3.893 2.754 2.754 0 0 0-3.894 0l-5.5 5.5a2.755 2.755 0 0 0 0 3.893l5.5 5.5a2.754 2.754 0 0 0 3.894 0 2.754 2.754 0 0 0 0-3.892l-.808-.808h9.858v9.866l-.808-.808a2.754 2.754 0 0 0-3.893 0 2.754 2.754 0 0 0 0 3.894l5.5 5.5a2.755 2.755 0 0 0 3.893 0l5.5-5.5a2.754 2.754 0 0 0 0-3.894 2.754 2.754 0 0 0-3.892 0l-.808.808V24.75h9.866l-.808.808a2.754 2.754 0 0 0 0 3.893 2.754 2.754 0 0 0 3.894 0l5.5-5.5a2.755 2.755 0 0 0 0-3.893l-5.5-5.5a2.754 2.754 0 0 0-3.894 0 2.754 2.754 0 0 0 0 3.892l.808.808H24.75V9.392l.808.808a2.754 2.754 0 0 0 3.893 0 2.754 2.754 0 0 0 0-3.894l-5.5-5.5h-.009Z"
								/>
							</svg>
						</a>

						<a id="parent-btn" href="" title="Select parent" class="la-rotate-180">
							<svg
								aria-hidden="true"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								width="44"
								height="45"
								fill="none"
								viewBox="0 0 44 45"
							>
								<path
									fill="currentColor"
									d="M22.884.806a2.755 2.755 0 0 1 3.893 0h.01l13.75 13.75a2.754 2.754 0 0 1 0 3.893 2.754 2.754 0 0 1-3.893 0l-9.059-9.057V41.25a2.747 2.747 0 0 1-2.75 2.75c-.138 0-.273-.014-.405-.033l-19.262.075a2.5 2.5 0 1 1-.02-5l16.937-.066V9.392l-9.059 9.057a2.754 2.754 0 0 1-3.893-3.893L22.884.807Z"
								/>
							</svg>
						</a>

						<a id="up-btn" href="" title="Move element up">
							<svg
								aria-hidden="true"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								width="44"
								height="44"
								fill="none"
								viewBox="0 0 44 44"
							>
								<path
									fill="currentColor"
									d="M23.942.806a2.754 2.754 0 0 0-3.893 0L6.3 14.556a2.754 2.754 0 0 0 0 3.894 2.754 2.754 0 0 0 3.893 0l9.057-9.06v31.86A2.747 2.747 0 0 0 22 44a2.747 2.747 0 0 0 2.75-2.75V9.39l9.058 9.059a2.754 2.754 0 0 0 3.894 0 2.754 2.754 0 0 0 0-3.894L23.95.806h-.009Z"
								/>
							</svg>
						</a>
						<a id="down-btn" href="" title="Move element down">
							<svg
								aria-hidden="true"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								width="44"
								height="44"
								fill="none"
								viewBox="0 0 44 44"
							>
								<path
									fill="currentColor"
									d="M20.058 43.194a2.754 2.754 0 0 0 3.893 0l13.75-13.75a2.754 2.754 0 0 0 0-3.893 2.754 2.754 0 0 0-3.893 0l-9.058 9.058V2.75A2.747 2.747 0 0 0 22 0a2.747 2.747 0 0 0-2.75 2.75v31.86l-9.058-9.059a2.754 2.754 0 0 0-3.894 0 2.754 2.754 0 0 0 0 3.894l13.751 13.75h.009Z"
								/>
							</svg>
						</a>

						<a id="edit-code-btn" href="" title="Edit html code">
							<svg
								aria-hidden="true"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								width="44"
								height="44"
								fill="none"
								viewBox="0 0 44 44"
							>
								<path
									fill="currentColor"
									d="M27.557 2.538a2.447 2.447 0 0 0-3.025 1.68l-9.777 34.22a2.447 2.447 0 0 0 4.705 1.344l9.777-34.22a2.447 2.447 0 0 0-1.68-3.024Zm4.934 10.396a2.448 2.448 0 0 0 0 3.46L38.098 22l-5.607 5.607a2.448 2.448 0 0 0 3.46 3.46l7.333-7.333a2.448 2.448 0 0 0 0-3.46l-7.333-7.333a2.448 2.448 0 0 0-3.46 0v-.007Zm-20.982 0a2.448 2.448 0 0 0-3.46 0L.716 20.267a2.448 2.448 0 0 0 0 3.46l7.333 7.332a2.448 2.448 0 0 0 3.46-3.46L5.902 22l5.6-5.606a2.448 2.448 0 0 0 0-3.46h.007Z"
								/>
							</svg>
						</a>

						<a id="save-reusable-btn" href="" title="Save as reusable" class="mx-2">
							<svg
								aria-hidden="true"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								width="44"
								height="44"
								fill="none"
								viewBox="0 0 44 44"
							>
								<path
									fill="currentColor"
									d="M11 6.6A4.404 4.404 0 0 0 6.6 11v22c0 2.426 1.973 4.4 4.4 4.4h22c2.427 0 4.4-1.974 4.4-4.4V16.314c0-1.169-.46-2.29-1.286-3.114L30.8 7.885A4.401 4.401 0 0 0 27.686 6.6H11Zm2.2 6.6c0-1.217.983-2.2 2.2-2.2h11c1.217 0 2.2.983 2.2 2.2v4.4c0 1.216-.983 2.2-2.2 2.2h-11c-1.217 0-2.2-.983-2.2-2.2v-4.4Zm8.8 11c2.427 0 4.4 1.973 4.4 4.4 0 2.426-1.973 4.4-4.4 4.4a4.404 4.404 0 0 1-4.4-4.4c0-2.427 1.973-4.4 4.4-4.4Z"
								/>
							</svg>
						</a>
						<a id="clone-btn" href="" title="Clone element">
							<svg
								aria-hidden="true"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								width="44"
								height="45"
								fill="none"
								viewBox="0 0 44 45"
							>
								<path
									fill="currentColor"
									d="M20.554.49c.638-.71 2.313-.634 3.009.137.306.34 1.647 3.589 2.979 7.219 1.332 3.63 2.557 6.736 2.722 6.903.168.168 3.334 1.446 7.037 2.84 3.704 1.397 6.951 2.733 7.218 2.972.654.587.637 2.32-.028 2.922-.282.254-3.467 1.571-7.08 2.928-3.614 1.357-6.737 2.562-6.944 2.68-.204.116-1.523 3.282-2.93 7.033-1.408 3.751-2.775 7.06-3.04 7.352-.636.702-2.344.715-2.972.022-.253-.281-1.57-3.467-2.927-7.081-1.357-3.613-2.562-6.736-2.68-6.943-.117-.205-3.282-1.524-7.033-2.931-3.751-1.407-7.06-2.775-7.352-3.04-.69-.624-.716-2.343-.045-2.95.268-.242 3.517-1.58 7.219-2.973 3.702-1.393 6.869-2.669 7.035-2.834.167-.168 1.445-3.334 2.841-7.038C18.979 4.004 20.315.756 20.553.49Zm14.1 31.301c.144-.162.526-.144.684.031.07.08.374.817.677 1.64.302.824.58 1.529.618 1.57.037.037.757.328 1.6.645.842.317 1.58.621 1.64.675.148.134.145.528-.006.665-.063.057-.788.356-1.61.665-.819.307-1.528.581-1.577.609-.047.027-.346.746-.666 1.599-.32.852-.632 1.604-.692 1.67-.145.16-.532.163-.675.005-.057-.063-.357-.787-.666-1.609a52.47 52.47 0 0 0-.608-1.578c-.026-.047-.746-.346-1.599-.666-.852-.32-1.603-.63-1.67-.69-.157-.142-.163-.533-.01-.671.062-.056.8-.36 1.64-.676.84-.317 1.56-.606 1.599-.644.038-.037.328-.757.645-1.6.317-.84.62-1.578.675-1.64ZM8.253 4.448c.145-.161.525-.144.684.031.07.078.374.816.677 1.641.302.824.58 1.529.618 1.568.038.038.758.329 1.6.646.842.317 1.58.622 1.64.676.149.133.145.527-.006.664-.065.058-.789.357-1.61.665-.821.308-1.531.583-1.578.61-.047.028-.346.747-.666 1.598-.32.852-.63 1.604-.69 1.67-.145.16-.532.163-.675.006-.057-.064-.357-.788-.666-1.61a51.156 51.156 0 0 0-.61-1.578c-.028-.047-.746-.347-1.597-.666-.852-.32-1.603-.63-1.67-.69-.158-.142-.164-.533-.012-.671.061-.055.8-.36 1.641-.676.841-.317 1.562-.606 1.6-.644.038-.037.328-.757.645-1.6.317-.84.62-1.578.675-1.64Z"
								/>
							</svg>
						</a>
						<a id="delete-btn" href="" title="Remove element">
							<svg
								aria-hidden="true"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								width="44"
								height="44"
								fill="none"
								viewBox="0 0 44 44"
							>
								<path
									fill="currentColor"
									d="M18.088 3.3h7.83c.95 0 1.788.605 2.09 1.505L28.6 6.6h6.6c1.217 0 2.2.983 2.2 2.2s-.983 2.2-2.2 2.2H8.8c-1.217 0-2.2-.983-2.2-2.2s.983-2.2 2.2-2.2h6.6l.598-1.795a2.203 2.203 0 0 1 2.09-1.505ZM8.8 14.3h26.4l-1.45 22.213a3.296 3.296 0 0 1-3.294 3.087H13.544a3.296 3.296 0 0 1-3.293-3.087L8.8 14.3Z"
								/>
							</svg>
						</a>
					</div>

					<div class="resize">
						<!-- top -->
						<div class="top-left"></div>
						<div class="top-center"></div>
						<div class="top-right"></div>
						<!-- center -->
						<div class="center-left"></div>
						<div class="center-right"></div>
						<!-- bottom -->
						<div class="bottom-left"></div>
						<div class="bottom-center"></div>
						<div class="bottom-right"></div>
					</div>
				</div>

				<!-- add section box -->
				<div id="add-section-box" class="drag-elements">
					<div class="header">
						<ul class="nav nav-tabs" id="box-elements-tabs" role="tablist">
							<li class="nav-item component-tab">
								<a
									class="nav-link px-3 active"
									id="box-components-tab"
									data-bs-toggle="tab"
									href="#box-components"
									role="tab"
									aria-controls="components"
									aria-selected="true"><i class="icon-cube-outline"></i><small>Components</small></a
								>
							</li>
							<li class="nav-item sections-tab">
								<a
									class="nav-link px-3"
									id="box-sections-tab"
									data-bs-toggle="tab"
									href="#box-blocks"
									role="tab"
									aria-controls="blocks"
									aria-selected="false"><i class="icon-copy-outline"></i><small>Blocks</small></a
								>
							</li>
							<!--
										  <li class="nav-item component-properties-tab" style="display:none">
											<a class="nav-link" id="box-properties-tab" data-bs-toggle="tab" href="#box-properties" role="tab" aria-controls="properties" aria-selected="false"><i class="la la-lg la-cog"></i> <div><small>Properties</small></div></a>
										  </li>
                          -->
						</ul>

						<div class="section-box-actions">
							<div
								id="close-section-btn"
								class="btn btn-outline-secondary btn-sm mt-1 border-0 float-end"
							>
								<i class="la la-times la-lg"></i>
							</div>

							<div class="me-4 small mt-2 float-end">
								<div class="form-check d-inline-block small me-1">
									<input
										type="radio"
										id="add-section-insert-mode-after"
										value="after"
										checked="checked"
										name="add-section-insert-mode"
										class="form-check-input"
									/>
									<label class="form-check-label" for="add-section-insert-mode-after">After</label>
								</div>

								<div class="form-check d-inline-block small">
									<input
										type="radio"
										id="add-section-insert-mode-inside"
										value="inside"
										name="add-section-insert-mode"
										class="form-check-input"
									/>
									<label class="form-check-label" for="add-section-insert-mode-inside">Inside</label
									>
								</div>
							</div>
						</div>

						<div class="tab-content">
							<div
								class="tab-pane show active"
								id="box-components"
								role="tabpanel"
								aria-labelledby="components-tab"
							>
								<div class="search">
									<div class="expand">
										<button class="text-sm" title="Expand All" data-vvveb-action="expand"
											><i class="la la-plus"></i></button
										>
										<button title="Collapse all" data-vvveb-action="collapse"
											><i class="la la-minus"></i></button
										>
									</div>

									<input
										class="form-control component-search"
										placeholder="Search components"
										type="text"
										data-vvveb-action="search"
										data-vvveb-on="keyup"
									/>
									<button class="clear-backspace" data-vvveb-action="clearSearch">
										<i class="la la-times"></i>
									</button>
								</div>

								<div class="overflow-y-auto mb-5">
									<div>
										<ul class="components-list clearfix" data-type="addbox"></ul>
									</div>
								</div>
							</div>
							<div class="tab-pane" id="box-blocks" role="tabpanel" aria-labelledby="blocks-tab">
								<div class="search">
									<div class="expand">
										<button class="text-sm" title="Expand All" data-vvveb-action="expand"
											><i class="la la-plus"></i></button
										>
										<button title="Collapse all" data-vvveb-action="collapse"
											><i class="la la-minus"></i></button
										>
									</div>

									<input
										class="form-control block-search"
										placeholder="Search blocks"
										type="text"
										data-vvveb-action="search"
										data-vvveb-on="keyup"
									/>
									<button class="clear-backspace" data-vvveb-action="clearSearch">
										<i class="la la-times"></i>
									</button>
								</div>

								<div class="overflow-y-auto mb-5">
									<div>
										<ul class="blocks-list clearfix" data-type="addbox"></ul>
									</div>
								</div>
							</div>

							<!-- div class="tab-pane" id="box-properties" role="tabpanel" aria-labelledby="blocks-tab">
												<div class="component-properties-sidepane">
													<div>
														<div class="component-properties">
															<div class="mt-4 text-center">Click on an element to edit.</div>
														</div>
													</div>
												</div>
											</div -->
						</div>
					</div>
				</div>
				<!-- //add section box -->

				<div id="drop-highlight-box"></div>
			</div>

			<iframe src="" id="iframe1"> </iframe>
		</div>
	</div>

	<div id="right-panel">
		<div class="component-properties">
			<ul class="nav nav-tabs nav-fill nav-underline" id="properties-tabs" role="tablist">
				<li class="nav-item content-tab">
					<a
						class="nav-link active"
						data-bs-toggle="tab"
						href="#content-tab"
						role="tab"
						aria-controls="components"
						aria-selected="true"
					>
						<i class="icon-albums-outline"></i> <span>Content</span></a
					>
				</li>
				<li class="nav-item style-tab">
					<a
						class="nav-link"
						data-bs-toggle="tab"
						href="#style-tab"
						role="tab"
						aria-controls="blocks"
						aria-selected="false"
					>
						<i class="icon-color-fill-outline"></i> <span>Style</span></a
					>
				</li>
				<li class="nav-item advanced-tab">
					<a
						class="nav-link"
						data-bs-toggle="tab"
						href="#advanced-tab"
						role="tab"
						aria-controls="blocks"
						aria-selected="false"
					>
						<i class="icon-settings-outline"></i> <span>Advanced</span></a
					>
				</li>
			</ul>

			<div class="tab-content">
				<div
					class="tab-pane show active"
					id="content-tab"
					data-section="content"
					role="tabpanel"
					aria-labelledby="content-tab"
				>
					<div class="alert alert-dismissible fade show alert-light m-3" role="alert">
						<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
						></button>
						<strong>No selected element!</strong><br /> Click on an element to edit.
					</div>
				</div>

				<div
					class="tab-pane show"
					id="style-tab"
					data-section="style"
					role="tabpanel"
					aria-labelledby="style-tab"
				>
					<div class="border-bottom pb-2 px-2">
						<div class="justify-content-end d-flex">
							<select class="form-select w-50" data-vvveb-action="setState" data-vvveb-on="change">
								<option value=""> - State - </option>
								<option value="hover">hover</option>
								<option value="active">active</option>
								<option value="nth-of-type(2n)">nth-of-type(2n)</option>
							</select>
						</div>
					</div>
				</div>

				<div
					class="tab-pane show"
					id="advanced-tab"
					data-section="advanced"
					role="tabpanel"
					aria-labelledby="advanced-tab"
				></div>
			</div>
		</div>
	</div>

	<div id="bottom-panel">
		<div>
			<div class="breadcrumb-navigator px-2" style="--bs-breadcrumb-divider: '>';">
				<ol class="breadcrumb">
					<li class="breadcrumb-item"><a href="#">body</a></li>
					<li class="breadcrumb-item"><a href="#">section</a></li>
					<li class="breadcrumb-item"><a href="#">img</a></li>
				</ol>
			</div>

			<div class="btn-group" role="group">
				<div id="toggleEditorJsExecute" class="form-check mt-1" style="display:none">
					<input
						type="checkbox"
						class="form-check-input"
						id="runjs"
						name="runjs"
						data-vvveb-action="toggleEditorJsExecute"
					/>
					<label class="form-check-label" for="runjs"
						><small>Run javascript code on edit</small></label
					>&ensp;
				</div>

				<button
					id="code-editor-btn"
					class="btn unstyled"
					title="Code editor"
					data-vvveb-action="toggleEditor"
				>
					<i class="la la-code"></i> Code editor
				</button>
			</div>
		</div>

		<div id="vvveb-code-editor">
			<textarea class="form-control"></textarea>
			<div></div>
		</div>
	</div>
</div>

<!--  -->
<div id="tree-list" class="d-none">
	<div class="header">
		<div>Navigator</div>
		<button class="btn btn-sm" data-vvveb-action="toggleTreeList" aria-pressed="true">
			<i class="icon-close"></i>
		</button>
	</div>
	<div class="tree">
		<ol>
			<!--
			<li data-component="Products" class="file">							
				<label for="idNaN" style="background-image:url(/js/vvvebjs/icons/products.svg)"><span>Products</span></label>							
				<input type="checkbox" id="idNaN">
			</li>
			<li data-component="Posts" class="file">							
				<label for="idNaN" style="background-image:url(/js/vvvebjs/icons/posts.svg)"><span>Posts</span></label>							
				<input type="checkbox" id="idNaN">
			</li>
			-->
		</ol>
	</div>
</div>
