let heightPercent = window.innerHeight / 100;
let widthPercent = window.innerWidth / 100;

const reloadFunction = (e) => location.reload();

let isResized = false;
/* MOBILE SUPPORT — ADDED */
let lastResizeWidth = window.innerWidth;
window.addEventListener('resize', function (event) {
	if (window.innerWidth === lastResizeWidth) return;
	lastResizeWidth = window.innerWidth;
	if (window.HXRebuild && window.HXRebuild.enabled) return;

	if (!isResized) {
		resizeDialog = document.querySelector('.resize-dialog');
		resizeDialog.style.display = 'flex';
		isResized = true;
		reloadButton = document.getElementById('reload-button');
		reloadButton.addEventListener('click', reloadFunction);
	}
});
