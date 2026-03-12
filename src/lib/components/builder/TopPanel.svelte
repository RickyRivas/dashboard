<script>
	import DesktopView from '../icons/DesktopView.svelte';
	import DownloadIcon from '../icons/DownloadIcon.svelte';
	import ExpandIcon from '../icons/ExpandIcon.svelte';
	import ExternalLink from '../icons/ExternalLink.svelte';
	import EyeOutlineIcon from '../icons/EyeOutlineIcon.svelte';
	import FileManagerIcon from '../icons/FileManagerIcon.svelte';
	import HandRockIcon from '../icons/HandRockIcon.svelte';
	import LayersIcon from '../icons/LayersIcon.svelte';
	import LeftColLayoutIcon from '../icons/LeftColLayoutIcon.svelte';
	import MobileViewIcon from '../icons/MobileViewIcon.svelte';
	import RedoIcon from '../icons/RedoIcon.svelte';
	import RightColumnLayout from '../icons/RightColumnLayout.svelte';
	import TabletViewIcon from '../icons/TabletViewIcon.svelte';
	import UndoIcon from '../icons/UndoIcon.svelte';

	let showResponsiveDropdown = $state(false);
</script>

<div id="top-panel">
	<!-- <img src="img/logo.png" alt="Vvveb" class="float-start" id="logo" /> -->

	<div class="mod">
		<button
			class="btn icon-btn"
			title="Toggle file manager"
			id="toggle-file-manager-btn"
			data-vvveb-action="toggleFileManager"
			data-bs-toggle="button"
			aria-pressed="false"
		>
			<FileManagerIcon />
		</button>

		<button
			class="btn icon-btn"
			title="Toggle left column"
			id="toggle-left-column-btn"
			data-vvveb-action="toggleLeftColumn"
			data-bs-toggle="button"
			aria-pressed="false"
		>
			<LeftColLayoutIcon />
		</button>

		<button
			class="btn icon-btn"
			title="Toggle right column"
			id="toggle-right-column-btn"
			data-vvveb-action="toggleRightColumn"
			data-bs-toggle="button"
			aria-pressed="false"
		>
			<RightColumnLayout />
		</button>
	</div>

	<div class="mod">
		<button
			class="btn icon-btn"
			title="Undo (Ctrl/Cmd + Z)"
			id="undo-btn"
			data-vvveb-action="undo"
			data-vvveb-shortcut="ctrl+z"
		>
			<UndoIcon />
		</button>

		<button
			class="btn icon-btn"
			title="Redo (Ctrl/Cmd + Shift + Y)"
			id="redo-btn"
			data-vvveb-action="redo"
			data-vvveb-shortcut="ctrl+shift+z"
		>
			<RedoIcon />
		</button>
		<button
			class="btn icon-btn"
			title="Designer Mode (Free dragging)"
			id="designer-mode-btn"
			data-bs-toggle="button"
			aria-pressed="false"
			data-vvveb-action="setDesignerMode"
		>
			<HandRockIcon />
		</button>

		<button
			class="btn icon-btn"
			title="Preview"
			id="preview-btn"
			type="button"
			data-bs-toggle="button"
			aria-pressed="false"
			data-vvveb-action="preview"
		>
			<EyeOutlineIcon />
		</button>

		<button
			class="btn icon-btn"
			title="Fullscreen (F11)"
			id="fullscreen-btn"
			data-bs-toggle="button"
			aria-pressed="false"
			data-vvveb-action="fullscreen"
		>
			<ExpandIcon />
		</button>

		<button
			class="btn icon-btn active"
			title="Toggle navigator (Ctrl + Shift + N)"
			id="toggle-tree-list"
			data-bs-toggle="button"
			data-vvveb-action="toggleTreeList"
			aria-pressed="true"
		>
			<LayersIcon />
		</button>

		<button
			class="btn icon-btn"
			title="Download"
			id="download-btn"
			data-vvveb-action="download"
			data-v-download="index.html"
		>
			<DownloadIcon />
		</button>
	</div>

	<div class="mod">
		<a href="#" class="btn icon-btn btn-sm btn-preview-url" target="blank" title="View page">
			<ExternalLink />
		</a>

		<div class="dropdown">
			<button
				class="btn icon-btn"
				aria-expanded={showResponsiveDropdown}
				class:active={showResponsiveDropdown}
				onclick={() => (showResponsiveDropdown = !showResponsiveDropdown)}
				aria-label="click to view responsive options"
			>
				<DesktopView />
			</button>
			<ul class="dropdown-list" class:active={showResponsiveDropdown}>
				<li>
					<button
						id="mobile-view"
						data-view="mobile"
						class="btn icon-btn"
						title="Mobile view"
						data-vvveb-action="viewport"
					>
						<MobileViewIcon />
					</button>
				</li>
				<li>
					<button
						id="tablet-view"
						data-view="tablet"
						class="btn icon-btn"
						title="Tablet view"
						data-vvveb-action="viewport"
					>
						<TabletViewIcon />
					</button>
				</li>

				<li>
					<button
						id="desktop-view"
						data-view=""
						class="btn icon-btn"
						title="Desktop view"
						data-vvveb-action="viewport"
					>
						<DesktopView />
					</button>
				</li>
			</ul>
		</div>

		<div class="form-control">
			<input
				type="number"
				id="zoom"
				value="100"
				step="10"
				min="10"
				max="100"
				class="form-control"
				data-vvveb-action="zoomChange"
				data-vvveb-on="change"
			/>
		</div>

		<button
			class="btn btn-primary btn-sm btn-icon save-btn"
			title="Save (Ctrl + S)"
			id="save-btn"
			data-vvveb-action="saveAjax"
			data-vvveb-url="save.php"
			data-v-vvveb-shortcut="ctrl+e"
		>
			<!-- <span class="loading d-none">
					<i class="icon-save-outline"></i>
					<span
						class="spinner-border spinner-border-sm align-middle"
						role="status"
						aria-hidden="true"
					>
					</span>
					<span>Saving </span> ...
				</span> -->

			<span class="button-text">
				<i class="icon-save-outline"></i> <span>Save page</span>
			</span>
		</button>
	</div>
</div>
