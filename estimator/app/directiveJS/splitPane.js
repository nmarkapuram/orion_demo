angular.module('vmfSplitContainerMod', [])
	.directive('vmfSplitContainer', function() {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			controller: function ($scope) {
				$scope.splitContainerTitle = "Split Container";
				$scope.components = [];
				$scope.values = [];
				this.addComponent = function(attributes) {
					$scope.components.push(attributes);
				};
				this.addDivider = function(attributes) {
					$scope.divider = attributes;
				};
			},
			link: function($scope, element, attrs) {
				var $firstComponent = element.children('.split-pane-component:first'),
					$divider = element.children('.split-pane-divider'),
					$lastComponent = element.children('.split-pane-component:last');
					for(var i=0; i<$scope.components.length; i++) {				
						if ($scope.components[i].width && $scope.components[i].width.match(/%$/)) {
							element.addClass('vertical-percent');
							var rightPercent = (100 - parseFloat($scope.components[i].width.match(/(\d+)%$/)[1])) + "%" ;
							$firstComponent.css({ right: rightPercent, marginRight: $scope.divider.width });
							$divider.css({ right: rightPercent, width: $scope.divider.width });
							$lastComponent.css({ width: rightPercent });
						} else if ($scope.components[i].width) {
							element.addClass('fixed-left');
							$firstComponent.css({ width: $scope.components[i].width });
							$divider.css({ left: $scope.components[i].width, width: $scope.divider.width });
							$lastComponent.css({ left: $scope.components[i].width, marginLeft: $scope.divider.width });				
						} else if ($scope.components[i].height && $scope.components[i].height.match(/%$/)) {
							element.addClass('horizontal-percent');
							var bottomPercent = (100 - parseFloat($scope.components[i].height.match(/(\d+)%$/)[1])) + "%" ;
							$firstComponent.css({ bottom: bottomPercent, marginBottom: $scope.divider.height });
							$divider.css({ bottom: bottomPercent, height: $scope.divider.height });
							$lastComponent.css({ height: bottomPercent });
						} else if ($scope.components[i].height) {
							element.addClass('fixed-top');
							$firstComponent.css({ height: $scope.components[i].height });
							$divider.css({ top: $scope.components[i].height, height: $scope.divider.height });
							$lastComponent.css({ top: $scope.components[i].height, marginLeft: $scope.divider.height });
						}
					}
				element.splitPane();
			},
			template: '<div class="vmf-split-container" ng-transclude></div>'
		};
	})

	.directive('vmfSplitPaneComponent', function($compile) {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			require: '^vmfSplitContainer',
			scope: {
				panewidth: '@',
				paneheight: '@',
				maxwidth: '@',
				minwidth: '@'
			},
			link: function($scope, element, attrs, paneCtrl) {
				if($scope.panewidth) {
					paneCtrl.width = $scope.panewidth;
				}
				if($scope.paneheight) {
					paneCtrl.height = $scope.paneheight;
				}
				if($scope.maxwidth) {
					paneCtrl.maxwidth = $scope.maxwidth;
				}
				if($scope.minwidth) {
					paneCtrl.minwidth = $scope.minwidth;
				}
				paneCtrl.addComponent({ width: $scope.panewidth, height: $scope.paneheight });
			},
			template: '<div class="split-pane-component" ng-transclude></div>'
		};
	})

	.directive('vmfSplitPaneDivider', function() {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			require: '^vmfSplitContainer',
			scope: {
				panewidth: '@',
				paneheight: '@',
				clicks: '@',
				close: '@'
			},
			controller: function ($scope) {
				$scope.mousedownHandler = function (event, element, minwidth, maxwidth, panewidth, paneheight) {
					var isTouchEvent = event.type.match(/^touch/),
						moveEvent = isTouchEvent ? 'touchmove' : 'mousemove',
						endEvent = isTouchEvent? 'touchend' : 'mouseup',
						$divider = element,
						$splitPane = $divider.parent(),
						$resizeShim = $divider.siblings('.split-pane-resize-shim');
					if(navigator.appVersion.indexOf("MSIE 7.") !== -1 || navigator.appVersion.indexOf("MSIE 8.") !== -1) {
						setTimeout(function(){
							$resizeShim.show();
						}, 500);
					} else {
						$resizeShim.show();
					}
					$divider.addClass('dragged');
					if (isTouchEvent) {
						$divider.addClass('touch');
					}
					
					var $clone = $divider.clone();
					$divider.after($clone);
						
					$(document).on(moveEvent, $scope.createMousemove($splitPane, $scope.pageXof(event), $scope.pageYof(event), minwidth, maxwidth, panewidth, paneheight));
					
					$(document).one(endEvent, function(event) {
						$(document).unbind(moveEvent);
						$clone.remove();
						$divider.removeClass('dragged touch');
						if(navigator.appVersion.indexOf("MSIE 7.") !== -1 || navigator.appVersion.indexOf("MSIE 8.") !== -1) {
							setTimeout(function(){
								$resizeShim.hide();
							},0);
						} else {
							$resizeShim.hide();
						}
					});
				};
				$scope.createMousemove = function($splitPane, pageX, pageY, minwidth, maxwidth, panewidth, paneheight) {
					var splitPane = $splitPane[0],
						firstComponent = $splitPane.children('.split-pane-component:first')[0],
						divider = $splitPane.children('.split-pane-divider')[0],
						divider2 = $splitPane.children('.split-pane-divider')[1],
						lastComponent = $splitPane.children('.split-pane-component:last')[0],
						lastComponentMinHeight,
						maxLastComponentHeight,
						bottomOffset,
						lastComponentMinWidth,
						maxLastComponentWidth,
						rightOffset;
						$(divider2).remove();
					if ($splitPane.is('.fixed-top')) {
						var firstComponentMinHeight =  $scope.minHeight(firstComponent),
							maxFirstComponentHeight = splitPane.offsetHeight - $scope.minHeight(lastComponent) - divider.offsetHeight,
							topOffset = divider.offsetTop - pageY;
						return function(event) {
							event.preventDefault();
							var top = Math.min(Math.max(firstComponentMinHeight, topOffset + $scope.pageYof(event)), maxFirstComponentHeight);
							$scope.setTop(firstComponent, divider, lastComponent, top + 'px');
							$splitPane.resize();
						};
					} else if ($splitPane.is('.fixed-bottom')) {
						lastComponentMinHeight = $scope.minHeight(lastComponent),
						maxLastComponentHeight = splitPane.offsetHeight - $scope.minHeight(firstComponent) - divider.offsetHeight,
						bottomOffset = lastComponent.offsetHeight + pageY;
						return function(event) {
							event.preventDefault();
							var bottom = Math.min(Math.max(lastComponentMinHeight, bottomOffset - $scope.pageYof(event)), maxLastComponentHeight);
							$scope.setBottom(firstComponent, divider, lastComponent, bottom + 'px');
							$splitPane.resize();
						};
					} else if ($splitPane.is('.horizontal-percent')) {
						var splitPaneHeight;
						if(splitPane.offsetHeight === 0) {
							splitPaneHeight = $splitPane[0].scrollHeight;
						} else {
							splitPaneHeight = $splitPane[0].offsetHeight;
						}					
						lastComponentMinHeight = splitPaneHeight - (splitPaneHeight*(parseInt(maxwidth)/100));//$scope.minHeight(lastComponent),
						maxLastComponentHeight = splitPaneHeight - $scope.minHeight(firstComponent) - divider.offsetHeight;
						bottomOffset = lastComponent.offsetHeight + pageY;
						return function(event) {
							event.preventDefault();
							$(lastComponent).css('display', 'block');
							var bottom = Math.min(Math.max(lastComponentMinHeight, bottomOffset - $scope.pageYof(event)), maxLastComponentHeight);
							if((bottom / splitPaneHeight * 100) < (100-minwidth)) {
								$scope.setBottom(firstComponent, divider, lastComponent, (bottom / splitPaneHeight * 100) + '%');
								$(document).one('mouseup', function () {
									$scope.setHorizontalDivider(divider, (bottom / splitPaneHeight * 100) + '%');
									//$(divider2).remove();
								});		
								$splitPane.resize();
							}
						};
					} else if ($splitPane.is('.fixed-left')) {
						var firstComponentMinWidth = $scope.minWidth(firstComponent),
							maxFirstComponentWidth = splitPane.offsetWidth - $scope.minWidth(lastComponent) - divider.offsetWidth,
							leftOffset = divider.offsetLeft - pageX;
						return function(event) {
							event.preventDefault();
							var left = Math.min(Math.max(firstComponentMinWidth, leftOffset + $scope.pageXof(event)), maxFirstComponentWidth);
							$scope.setLeft(firstComponent, divider, lastComponent, left + 'px');
							$splitPane.resize();
						};
					} else if ($splitPane.is('.fixed-right')) {
						lastComponentMinWidth = $scope.minWidth(lastComponent);
						maxLastComponentWidth = splitPane.offsetWidth - $scope.minWidth(firstComponent) - divider.offsetWidth;
						rightOffset = lastComponent.offsetWidth + pageX;
						return function(event) {
							event.preventDefault();
							var right = Math.min(Math.max(lastComponentMinWidth, rightOffset - $scope.pageXof(event)), maxLastComponentWidth);
							$scope.setRight(firstComponent, divider, lastComponent, right + 'px');
							$splitPane.resize();
						};
					} else if ($splitPane.is('.vertical-percent')) {
						var splitPaneWidth;
						if(splitPane.offsetWidth === 0) {
							splitPaneWidth = $splitPane[0].scrollWidth;
						} else {
							splitPaneWidth = $splitPane[0].offsetWidth;
						}
						lastComponentMinWidth = splitPaneWidth - (splitPaneWidth*(parseInt(maxwidth)/100)); //$scope.minWidth(lastComponent),
						maxLastComponentWidth = splitPaneWidth - $scope.minWidth(firstComponent) - divider.offsetWidth;
						rightOffset = lastComponent.offsetWidth + pageX;
						var	leftContainerWidth = splitPane.offsetWidth*(panewidth/100),
							leftContainerWidthMin = leftContainerWidth*(30/100),
							minDraggableWidth = (leftContainerWidthMin + 10)/(splitPane.offsetWidth)*100; // 10 is the margin for the component
						return function(event) {
							event.preventDefault();
							var right = Math.min(Math.max(lastComponentMinWidth, rightOffset - $scope.pageXof(event)), maxLastComponentWidth);
							if((right / splitPaneWidth * 100) < (100-minDraggableWidth)){
								$scope.setRight(firstComponent, divider, lastComponent, (right / splitPaneWidth * 100) + '%');
								$(document).one('mouseup', function () {
									$scope.setVerticalDivider(divider, (right / splitPaneWidth * 100) + '%');
									//$(divider2).remove();
								});
								$splitPane.resize();
							}	
						};
					}
				};

				$scope.pageXof = function(event) {
					return event.pageX || event.originalEvent.pageX;
				};

				$scope.pageYof = function(event) {
					return event.pageY || event.originalEvent.pageY;
				};

				$scope.minHeight = function(element) {
					return parseInt($(element).css('min-height')) || 0;
				};

				$scope.minWidth = function(element) {
					return parseInt($(element).css('min-width')) || 0;
				};

				$scope.setTop = function(firstComponent, divider, lastComponent, top) {
					firstComponent.style.height = top;
					divider.style.top = top;
					lastComponent.style.top = top;
				};

				$scope.setBottom = function(firstComponent, divider, lastComponent, bottom) {
					firstComponent.style.bottom = bottom;
					divider.style.bottom = bottom;
					lastComponent.style.height = bottom;
				};

				$scope.setLeft = function(firstComponent, divider, lastComponent, left) {
					firstComponent.style.width = left;
					divider.style.left = left;
					lastComponent.style.left = left;
				};

				$scope.setRight = function(firstComponent, divider, lastComponent, right) {
					firstComponent.style.right = right;
					divider.style.right = right;
					lastComponent.style.width = right;
				};
				
				$scope.setVerticalDivider = function(divider, right) {
					divider.style.right = right;
				};
				
				
				$scope.setHorizontalDivider = function(divider, bottom) {
					divider.style.bottom = bottom;
				};
			
			},
			link: function($scope, element, attrs, paneCtrl) {
				var minwidth;
				paneCtrl.addDivider({ width: $scope.panewidth, height: $scope.paneheight });
				if(parseInt(paneCtrl.minwidth)) {
					minwidth = paneCtrl.minwidth;
				} else {
					minwidth = paneCtrl.width;
				}
				$scope.doubleClickResizePane = function(element) {
					var $firstComponent = element.parent().children('.split-pane-component:first'),
					    $divider = element,
					    $lastComponent = element.parent().children('.split-pane-component:last'),
					    $remWidth = (100 - parseInt(paneCtrl.width)),
					    $remHeight = (100 - parseInt(paneCtrl.height));
					    $remWidth = $remWidth +'%';
					    $remHeight = $remHeight + '%';

					    if($scope.close === 'right') {
					    	if($firstComponent.prop('style').right === '0%') {
							    $firstComponent.css('right', (100 - parseInt(paneCtrl.width)) + '%');
							    $divider.css('right', (100 - parseInt(paneCtrl.width)) + '%');
							    $lastComponent.css('width', (100 - parseInt(paneCtrl.width)) + '%');
						    }
						    else {
							    $firstComponent.css('right', 0 + '%');
							    $divider.css('right', 0 + '%');
							    $lastComponent.css('width', 0 + '%');
						    }
					    } else if($scope.close === 'left') {
					    	if($firstComponent.prop('style').right < '99%') {
							    $firstComponent.css('right', 99 + '%');
							    $divider.css('right', 99 + '%');
							    $lastComponent.css('width', 99 + '%');
						    }
						    else {
							    $firstComponent.css('right', (100 - parseInt(paneCtrl.width)) + '%');
							    $divider.css('right', (100 - parseInt(paneCtrl.width)) + '%');
							    $lastComponent.css('width', (100 - parseInt(paneCtrl.width)) + '%');
						    }
					    } else if($scope.close === 'bottom') {
					    	if($firstComponent.prop('style').bottom === '0%') {
					    		$firstComponent.css('bottom', (100 - parseInt(paneCtrl.height)) + '%');
					    		$divider.css('bottom', (100 - parseInt(paneCtrl.height)) + '%');
								$lastComponent.css('display', 'block');
					    		$lastComponent.css('height', (100 - parseInt(paneCtrl.height)) + '%');
					    	} else {
					    		$firstComponent.css('bottom', 0 + '%');
					    		$divider.css('bottom', 0 + '%');
								//$lastComponent.css('height', 0 + '%');
					    		$lastComponent.css('display', 'none');
					    	}
					    } else if($scope.close === 'top') {
					    	if($firstComponent.prop('style').bottom < '98%') {
					    		$firstComponent.css('bottom', 98 + '%');
							    $divider.css('bottom', 98 + '%');
							    $lastComponent.css('height', 98 + '%');
					    	} else {
					    		$firstComponent.css('bottom', (100 - parseInt(paneCtrl.height)) + '%');
							    $divider.css('bottom', (100 - parseInt(paneCtrl.height)) + '%');
							    $lastComponent.css('height', (100 - parseInt(paneCtrl.height)) + '%');
					    	}
					    }				
				}	
			if(navigator.appVersion.indexOf("MSIE 7.") !== -1 || navigator.appVersion.indexOf("MSIE 8.") !== -1) {
				element.on('mousedown', function (event) {
					var _self = element, e = event;
					$scope.mousedownHandler(e, _self, parseInt(minwidth), parseInt(paneCtrl.maxwidth), parseInt(paneCtrl.width), parseInt(paneCtrl.height));
				});
				element.on('dblclick', function (event) {
					$scope.doubleClickResizePane(element);
				});
			}
			else {
				element.on('mousedown', function (event){
					$scope.clicks++;
					var _self = element, e = event;
			      	if ($scope.clicks === 1) {
			      		event.preventDefault();
				        setTimeout(function(){
					          if($scope.clicks === 1) {
					          	$scope.mousedownHandler(e, _self, parseInt(minwidth), parseInt(paneCtrl.maxwidth), parseInt(paneCtrl.width), parseInt(paneCtrl.height));
					          } else {
					          	$scope.doubleClickResizePane(_self);				          	
					          }
					          $scope.clicks = 0;
				        },0);
				    }				
				});
			}
			},
			template: '<div class="split-pane-divider"><div class="threedots" ng-transclude></div></div>'
		};
	});
    