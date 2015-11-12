app.directive('sider', function () {
	return {
		restrict: 'AE',
		link: function (scope, element, attrs) {
			element.slider({full_width: true});
		}
	}
})
.directive('dropdownButton', function () {
	return {
		restrict: 'AE',
		link: function (scope, element, attrs) {
			element.dropdown();
		}
	}
})