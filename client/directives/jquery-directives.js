// app.directive('sidlers', function () {
// 	return  {
//        restrict:"EA",
//        replace:true,
//        scope:{
//             images:"="
//        },
//        templateUrl:"slider.tpl.html",
//        link:function(scope,element,attrs){
//            scope.current = 0;
//            scope.totalNumber = scope.images.length;
//            scope.next = function(){
//                if(scope.current < scope.totalNumber - 1){
//                    scope.current = scope.current + 1;
//                }else{
//                    scope.current = 0;
//                }
//            };
//            scope.prev = function(){
//                if(scope.current > 0){
//                    scope.current = scope.current - 1;
//                }else{
//                    scope.current = scope.totalNumber - 1;
//                }
//            };
//             //
//            var timer = null;
//            var autoPlay = function(){
//                timer = $timeout(function(){
//                     scope.next();
//                    //
//                    timer = $timeout(autoPlay,1000 * 3);
//                },1000 * 3)
//            };
//            //autoPlay();
//            if(attrs.auto == "true"){
//                autoPlay();
//            };
//            //鼠标移上去停止播放
//            element.on("mouseover",function(){
//                $timeout.cancel(timer);
//            });
//            //鼠标移出继续播放
//            element.on("mouseout",function(){
//                autoPlay();
//            });
//            //
//            scope.$on('$destroy',function(){
//                $timeout.cancel(timer);
//            });
//        }
//    }
// })
// .directive('dropdownButton', function () {
// 	return {
// 		restrict: 'AE',
// 		link: function (scope, element, attrs) {
// 			element.dropdown();
// 		}
// 	}
// })
// .directive('collapsible', function () {
// 	return {
// 		restrict: 'AE',
// 		link: function (scope, element, attrs) {
// 			element.collapsible({
// 				//accordion : false
// 			});
// 		}
// 	}
// })
// .directive('select', function () {
// 	return {
// 		restrict: 'AE',
// 		link: function (scope, element, attrs) {
// 			$('select').material_select();
// 		}
// 	}
// })