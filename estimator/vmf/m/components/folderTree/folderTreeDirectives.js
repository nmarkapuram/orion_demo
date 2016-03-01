/*jslint nomen: true, debug: true,
  evil: false, vars: true */
var folderTreeApp = angular.module('folderTreeApp', []);

folderTreeApp.directive('vmfFolderTree', ['$compile', '$timeout', '$http', 'ModalService', 'folderDataService', 'globalData' ,
    function($compile, $timeout, $http,  ModalService, folderDataService, globalData) {
        return {
            restrict: 'A',
            scope: { 
                tree: '=',
                multipleSelect: '@',
                rootName: '=',
                folderClickCallBack: '&',
                ajax: '='
            },
            link: function(scope, lElement, lAttrs) { 
 
                scope.treeChild = {};
                scope.getSearchData = {};
                scope.selectedFolderIdsArray = [];
                scope.searchedFolderData = [];
                scope.globalVars = globalVariables;

                scope.subscribe('folderTreeChange', function(getObj){
                    if(scope.rootName.instanceId === getObj.instanceId){
                        if(getObj.folderData !== null && getObj.folderData !== undefined)
                            scope.compiler(getObj.folderData);
                    }  
                });

                lElement.find(".folderTreeWrapper").attr("id", scope.rootName.text.split(" ").join(""));
                scope.thisTree = lElement.find("#" + scope.rootName.text.split(" ").join(""));

                scope.foldersArray = [];
                scope.completeFolderStack = [];

                var folderPadding = 28;
                var collapsePadding = 15;

                scope.calculatePadding = function(level) {

                    scope.folderPadding = (level * 28) + folderPadding;
                    scope.collapsePadding = (level * 28) + collapsePadding;
                };

                scope.lowestlevelGetter = function(tree) {
                    scope.levels = [];
                    tree.forEach(function(folder) {
                        scope.levels.push(folder.folderLevel);
                    });

                    return (scope.levels.sort()[0] - 1);
                };

                //console.log(scope.tree);
                scope.subFolderCreator = function(parentFolder) {

                    scope.folderObj = parentFolder;
                    scope.indexHolder = [];

                    if (scope.folderObj.hasSubFolders) {

                        scope.folderObj.subFolders = [];
                        scope.tree.forEach(function(folder, index) {
                            if (folder.parentFolderId === parentFolder.folderId) {

                                scope.folderCount++;
                                scope.folderObj.subFolders.push(folder);

                                scope.indexHolder.push(index);
                            }

                        });

                        scope.indexHolder.reverse().forEach(function(index) {
                            scope.tree.splice(index, 1);
                        });

                    } else {

                        scope.folderObj.subFolders = [];
                    }

                    return scope.folderObj;
                };

                scope.subFolderCreatorChild = function(parentFolder) {

                    scope.folderObj = parentFolder;
                    scope.indexHolder = [];

                    if (scope.folderObj.hasSubFolders) {

                        scope.folderObj.subFolders = [];
                        scope.treeChild.forEach(function(folder, index) {
                            if (folder.parentFolderId === parentFolder.folderId) {

                                scope.folderCount++;
                                scope.folderObj.subFolders.push(folder);

                                scope.indexHolder.push(index);
                            }

                        });

                        scope.indexHolder.reverse().forEach(function(index) {
                            scope.treeChild.splice(index, 1);
                        });

                    } else {

                        scope.folderObj.subFolders = [];
                    }

                    return scope.folderObj;
                };
                /*scope.$watch("tree", function(newVal, OldVal, scope) {

                    if (newVal !== OldVal && newVal.length > 1) {
                        scope.compiler(newVal);
                    }
                }, true);*/

                /* @responseFolders : Pass the entire tree structure as a variable , the html is then constructed by this function
                */

                scope.subscribe('ftLoading',function(data){
                    if(data.instanceId == scope.rootName.instanceId){
                        scope.thisTree.find('.folderTree .foldertreeUl').html('');
                    }
                });

                scope.compiler = function(responseFolders) {

                    folderDataService.allFolders = responseFolders || scope.tree;
                    scope.tree = JSON.parse(JSON.stringify(responseFolders));
                    angular.copy(scope.tree, scope.foldersArray);
                    angular.copy(scope.tree, scope.completeFolderStack);

                    scope.folderString = "<ul class='foldertreeUl'>";
                    scope.lowestlevel = scope.lowestlevelGetter(scope.tree) || 0;
                    scope.recursionCount = 0;
                    scope.folderHierarchyLevel = 1;

                    //Gets the number of recursions to be done.
                    for (var folderIndex in scope.tree) {
                        if (scope.tree[folderIndex].folderLevel > scope.lowestlevel) {
                            scope.recursionCount++;
                            scope.lowestlevel = scope.tree[folderIndex].folderLevel;
                        }

                    }

                    while (scope.recursionCount > scope.folderHierarchyLevel - 1) {
                        scope.lastIndex;
                        if (scope.folderHierarchyLevel === 1) {

                            folderArray = [];

                            scope.tree.forEach(function(folder, index) {
                                if (folder.folderType === "ROOT") {
                                    folderArray.push(folder);
                                }
                            });

                        }

                        scope.nextSet = [];
                        folderArray.forEach(function(folder, index) {

                            if (scope.folderHierarchyLevel === 1) {

                                folderArray[index] = scope.subFolderCreator(folder);
                                if (folderArray[index].subFolders.length) {
                                    /*ignore jslint start*/
                                    folderArray[index].subFolders.forEach(function(elem) {
                                        scope.nextSet.push(elem);
                                    });
                                    /*ignore jslint end*/
                                }

                            } else {

                                folder.subFolders = [];
                                folderArray[index] = scope.subFolderCreator(folder);

                                if (folderArray[index].subFolders.length) {
                                    /*ignore jslint start*/
                                    folderArray[index].subFolders.forEach(function(elem) {
                                        scope.nextSet.push(elem);
                                    });
                                    /*ignore jslint end*/
                                }

                            }

                            scope.lastIndex = index;
                        });

                        folderArray = scope.nextSet;
                        scope.folderHierarchyLevel++;
                    }

                    //console.log(scope.folderHierarchyLevel);
                    scope.firstIteration = true;
                    scope.totalIterations = 0;

                    while (scope.folderHierarchyLevel > 0) {

                        scope.calculatePadding(scope.totalIterations - 1);

                        if (scope.firstIteration) {

                            scope.folderString = scope.folderString + '<li ng-repeat="subfolder in tree" ng-class="{expandButton:subfolder.hasSubFolders, disabled:subfolder.folderAccess == \'NONE\', selected:selectedFolderIdsArray.indexOf(subfolder.folderId) !== -1}" id="{{subfolder.folderId}}" ftPath="{{subfolder.fullFolderPath}}" ftName="{{subfolder.folderName}}" ftLevel="{{subfolder.folderLevel}}" ftType="{{subfolder.folderType}}" ftAccess="{{subfolder.folderAccess}}">';
                            scope.firstIteration = false;
                        } else {

                            scope.folderString = scope.folderString + '<ul class="subfolder">' +
                                 '<li ng-repeat="subfolder in subfolder.subFolders" ng-class="{expandButton:subfolder.hasSubFolders,plus:subfolder.hasSubFolders, disabled:subfolder.folderAccess == \'NONE\', selected:selectedFolderIdsArray.indexOf(subfolder.folderId) !== -1}" id="{{subfolder.folderId}}" ftPath="{{subfolder.fullFolderPath}}" ftName="{{subfolder.folderName}}" ftLevel="{{subfolder.folderLevel}}" ftType="{{subfolder.folderType}}" ftAccess="{{subfolder.folderAccess}}">';
                        }

                        if(scope.rootName.showFolderOptions == true){

                        scope.folderString = scope.folderString + '<a href="javascript:void(0)" ng-class="{disabled:subfolder.folderAccess ==\'NONE\'}"  ng-click="toggleSelectFolder(subfolder.folderId,subfolder.fullFolderPath)"  style="padding-left: ' + scope.folderPadding + 'px" vmf-folder-options data-folder-options=subfolder.folderOptions data-this-tree = "thisTree"  ng-click="folderClickCallBack({$event:$event,this:this})" complete-folder-stack = "completeFolderStack" folder-data-ftype="subfolder.folderType">' +
                            '<span class="expandCollapseIcon" style="left: ' + scope.collapsePadding + 'px" ng-show="subfolder.hasSubFolders" ng-click="expander($event,subfolder.folderAccess); ajaxLoad($event,subfolder)">&nbsp;</span>';

                        } else {

                        scope.folderString = scope.folderString + '<a href="javascript:void(0)" ng-click="toggleSelectFolder(subfolder.folderId,subfolder.fullFolderPath)"  style="padding-left: ' + scope.folderPadding + 'px" data-this-tree = "thisTree"  ng-click="folderClickCallBack({$event:$event,this:this})" complete-folder-stack = "completeFolderStack" folder-data-ftype="subfolder.folderType">' +
                            '<span class="expandCollapseIcon" style="left: ' + scope.collapsePadding + 'px" ng-show="subfolder.hasSubFolders" ng-click="expander($event,subfolder.folderAccess); ajaxLoad($event,subfolder)">&nbsp;</span>';
                        
                        }

                        if (angular.lowercase(scope.multipleSelect) === "off" || angular.lowercase(scope.multipleSelect) === "false") {

                            scope.folderString = scope.folderString + '<div style="margin-left:10px;" class="custom-checkbox">'+
                            '<span class="folderIcon"></span>{{subfolder.folderName}} <span class="badge" ng-if="subfolder.folderType == \'ASP\' || subfolder.folderType == \'VCE\' || subfolder.folderType == \'CPL\'" badgeType="{{subfolder.folderType}}">{{subfolder.folderType}}</span></div>'; //disabledColor to be added.
                        } else {
                            scope.folderString = scope.folderString + '<div class="checkbox"><input id="{{subfolder.folderName}}" class="styled" ng-model="subfolder.checked" type="checkbox" ng-disabled="subfolder.folderAccess == \'NONE\'"><label for="{{subfolder.folderName}}">{{subfolder.folderName}}</label></div>';

                            //scope.folderString = scope.folderString + '<div vmf-checkbox-group class="vmf-checkbox-group" type="1" c-foldertype="subfolder.folderType" model="subfolder.checked" c-label="subfolder.folderName" c-disabled="subfolder.folderAccess == \'NONE\'"></div>';
                        }

                        scope.folderString = scope.folderString + '</a>';
                        scope.folderHierarchyLevel--;
                        scope.totalIterations++;
                    }

                    while (scope.totalIterations > 0) {

                        scope.folderString = scope.folderString + '</li></ul>';
                        scope.totalIterations--;
                    }

                    $timeout(function() {
                        scope.thisTree.find('.folderTree').find("ul").remove();
                        scope.thisTree.find('.folderTree').append($compile(scope.folderString)(scope));
                       
                    });

                    $timeout(function() {

                         $(scope.thisTree).find('.disabled > a')
                            .addClass('vmf-tooltip')
                            .attr('data-toggle','tooltip')
                            .attr('data-placement','bottom')
                            .attr('title',globalVariables.textDisabledFolders);

                        $(scope.thisTree).find('.badge').each(function(){
                            var getType = $(this).attr('badgeType');
                            $(this).attr('title',globalVariables['staticTextfor'+getType]);
                        });

                        scope.thisTree.find('.vmf-tooltip').tooltip();
                        scope.thisTree.find(".custom-checkbox").addClass("folderSelector");
                        scope.thisTree.find(".folderTree").find("input").removeAttr("ng-click");
                        scope.thisTree.find(".subfolder").has("li").parent("li").addClass("expandButton plus");
                        scope.thisTree.find(".subfolder:first").has("li").parent("li").removeClass("plus");
                        scope.thisTree.find(".expandCollapseIcon").eq(0).addClass("ng-hide");
                        if (angular.lowercase(scope.multipleSelect) === "off" || angular.lowercase(scope.multipleSelect) === "false") {
                            scope.thisTree.find(".folderTreeHeader a:first span").remove();
                            scope.thisTree.addClass("withoutCheckBox");
                        }
                    });

                    $timeout(function(){
                         $(".folderSelector").on("mouseover",function(e) {
                            var $this = $(this);
                            var max_width = $this.text().length * 10;
                            if (max_width > $this.innerWidth()) {
                            $this.attr("title", $this.text());
                            }else{
                            $this.removeAttr("title");
                            }
                         });
                    },100); 
                };

                // to remove the selectall checkbox - in the license folders heading above the folder tree
                if (angular.lowercase(scope.multipleSelect) === "off" || angular.lowercase(scope.multipleSelect) === "false") {
                    scope.thisTree.find(".folderTreeHeader a:first span").remove();
                }

                scope.compiler(scope.tree);

                scope.ajaxLoad = function(evt,object){

                    //console.log(evt,object);

                    scope.clickedParent = angular.element(evt.target);

                    //console.log(scope.clickedParent);

                    var isSubfoldersAvailable = $(evt.target).parent().siblings('.subfolder').children().length;

                    if(scope.ajax == true && isSubfoldersAvailable == 0){

                        scope.getTreeChild(evt, object, object['folderId']);

                        //scope.childCompilerArr(evt, object, scope.getChildData.folderContents);
                    }
                }   

                scope.getTreeChild = function(getEvt, getObject, parentFolderId){

                        //var getChildTreeUrlMod = globalVariables.getChildTreeUrl;

                        var getChildTreeUrlMod = globalVariables.getChildTreeUrl+"&iWantToSelection=viewLicense";

                         var postData =  { 
                            'navigatingFolderId' : parentFolderId
                        };

                         var postDataEncoded = $.param(postData);

                         var errorHtml = '<div  class="alert-box starlight-alert"><div class="alert alert-danger alert-dismissable">' 
                                            +'<a class="close icons-alert-close" data-dismiss="alert" type="button"></a>'
                                                +'<div class="row"> '
                                                    +'<span class="icons-alert-danger"></span>'
                                                    +'<div class="alert-text col-sm-10"> '
                                                        +'<span>'+globalVariables.txtFolderContentsNotAvailable+'</span>'
                                                    +'</div> '
                                                +'</div> '
                                           +' </div> '
                                        +'</div>';

                          var getDivHtml = $('#'+getObject.folderId+' a div');

                         if(getDivHtml.length == 0)
                            getDivHtml =  $('#'+getObject.folderId+' a label');

                          getDivHtml.append('<span class="ajaxLoader subFolderLoader"></span>');

                         $('#subfolderDataEmptyErr').html('').addClass('hide');

                        $http({
                            method: 'POST',
                            url: getChildTreeUrlMod,
                            data: postDataEncoded,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).
                        success(function(data, status, headers, config) {

                            if(data.error == true || data == null || data == undefined || data == ''){

                                $('#subfolderDataEmptyErr')
                                    .html(errorHtml)
                                    .removeClass('hide');

                            } else if(data.emptyTree == true || data.folderContents.length == 0){

                                 $('#subfolderDataEmptyErr')
                                    .html(errorHtml)
                                    .removeClass('hide');

                            } else {                            

                            scope.childCompilerArr(getEvt, getObject, data.folderContents); 

                            }  

                            getDivHtml.find('span.subFolderLoader').remove();                        

                        }).
                        error(function(data, status, headers, config) {

                            getDivHtml.find('span.subFolderLoader').remove(); 
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });

                }

                scope.moveSearchedFolders = function(){

                    scope.getParentId = scope.clickedParent.parent().parent().attr('id');

                    angular.forEach(scope.searchedFolderData, function(value, key) {
                         angular.forEach(value.folderIdList, function(valueId, keyId) {
                            if(valueId == scope.getParentId){
                                var nextKey = keyId - 1;
                                scope.moveChildAfterFind(value,scope.getParentId,nextKey);
                            }
                        });
                    });
                }

                scope.moveChildAfterFind = function(dataObj, currParentId, nextParentKey){

                    if(nextParentKey !== 0){ // Enter loop if the searched element is not available as part of ajax response on expanding parent .

                        var getPadding = angular.element('#'+dataObj.folderId +' a').css('padding-left').replace("px", "");
                        var newPadding = parseInt(getPadding) + 28;
                        var getChildDom = angular.element('#'+dataObj.folderId);
                        angular.element('#'+dataObj.folderId).remove();

                        angular.element('#'+dataObj.folderIdList[nextParentKey]).after($compile(getChildDom)(scope));

                        angular.element('#'+dataObj.folderId+' a').css('padding-left', newPadding +'px');
                        angular.element('#'+dataObj.folderId).attr('rel',dataObj.folderIdList[nextParentKey]);

                    } else {
                        angular.element('[rel="'+dataObj.folderIdList[1]+'"]').remove();

                    }

                }

                scope.subscribe('findFolderEvt',function(data){

                    var ftOptions = {mode : data.ftInstanceId};

                    if(scope.rootName.instanceId === data.ftInstanceId){
                        scope.addNodeToFolderTree(data.folderObj,ftOptions);
                    }
                });

                scope.addNodeToFolderTree = function(getData,getOptions){

                    // If element already present in the DOM, Select it and show parent li's

                    var getElemObj = angular.element('#'+getData.folderId);

                    if(getElemObj.length >= 1){

                        if(getElemObj.hasClass('selected') == false)
                            scope.toggleSelectFolder(getData.folderId);

                    } else {

                        if(getOptions.mode == 'filterPageFT'){
                            if(scope.searchedFolderData.length >= 1){  // This is only for find functionality
                                angular.element('#'+scope.searchedFolderData[0].folderId).remove();
                                scope.searchedFolderData = [];
                            }
                        }

                        scope.searchedFolderData.push(getData); // If search content already not present, add data

                        var parentFound = false; 

                        angular.forEach(getData.folderIdList, function(value, key) {
                            var getElem = angular.element('#'+value).get(0);                                                   

                            if(getElem !== undefined && parentFound == false){

                                parentFound = true;
                                var randNum = scope.getRandomInt(0,999999);

                                scope.getSearchData[randNum] = JSON.parse(JSON.stringify(getData));

                                //angular.copy(getData, scope.getSearchData[randNum]); // Copying getData to a persistant scope value so that folder selection can be tracked using selectedFolderIdsArray

                                var elemObj = angular.element('#'+value);
                                var elemAnchorPadding = angular.element('#'+value+' a').css('padding-left');

                                if (angular.lowercase(scope.multipleSelect) === "off" || angular.lowercase(scope.multipleSelect) === "false") {

                                var htmlSnipp = '<li class="expandButton plus" ng-class="{selected:selectedFolderIdsArray.indexOf(getSearchData.'+randNum+'.folderId) !== -1}"  ftpath="'+getData.fullFolderPath+'"  id="'+getData.folderId+'" rel="'+value+'"><a href="javascript:void(0)" style="padding-left: '+elemAnchorPadding+'" ng-click="toggleSelectFolder('+getData.folderId+')"><div style="margin-left:10px;" class="custom-checkbox folderSelector" >... '+getData.folderName+'</div></a></li>';

                                } else {

                                scope.getSearchData[randNum].checked = true;
                                var htmlSnipp = '<li class="expandButton plus" ng-class="{selected:selectedFolderIdsArray.indexOf(getSearchData.'+randNum+'.folderId) !== -1}"  ftpath="'+getData.fullFolderPath+'"  id="'+getData.folderId+'" rel="'+value+'"><a href="javascript:void(0)" class="folderFilterChkWrap" style="padding-left: '+elemAnchorPadding+'" ng-click="toggleSelectFolder('+getData.folderId+')"><span class="dotHolder">...</span><div vmf-checkbox-group class="vmf-checkbox-group" type="1" model="getSearchData.'+randNum+'.checked" c-label="subfolder.folderName" c-disabled="false"></div><div style="margin-left:10px;" class="custom-checkbox folderSelector" >'+getData.folderName+'</div></a></li>';

                                }

                                $('#'+value).after($compile(htmlSnipp)(scope));

                                $('#'+getData.folderId).on("mouseenter",  function(event) {                               
                                    $('#'+getData.folderId+' a').addClass("highlightActive highlight");
                                });

                                $('#'+getData.folderId).on("mouseleave", function(event) {                               
                                    $('#'+getData.folderId+' a').removeClass("highlightActive highlight");
                                });

                                scope.toggleSelectFolder(scope.getSearchData[randNum]['folderId']);

                                return false;
                            }

                        });

                    }

                    // Show all parents
                    angular.element('#'+getData.folderId).parents('li.plus').removeClass('plus').addClass('minus');

                    // Fine the top scroll position and scroll to selected node 
                    var topPos = angular.element('#'+getData.folderId).get(0).offsetTop;
                    angular.element('.foldertreeUl').get(0).scrollTop = topPos;

                }

                scope.setFolderPermissions = function(getId){

                    var getPermValFromDom = $('#'+getId).attr('ftPerm');

                    var getElemPath = $('#'+getId).attr('ftPath');

                    if(!getPermValFromDom){

                        var params = { 
                                            'selectedFolderId' : getId
                                     };

                        var paramsEncoded = $.param(params);
                
                        $http({
                            method: 'POST',
                            url: globalVariables.getFolderMinPermUrl,
                            data: paramsEncoded,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).
                        success(function(data, status, headers, config) { 

                                var  accessPerms = ''; 

                                 if (data.manage) {
                                    accessPerms = "MANAGE";
                                } else if (data.view) {
                                    accessPerms = "VIEW";
                                } else if (!(data.view)) {
                                    accessPerms = "NONE";
                                }

                                 $('#'+getId).attr('ftPerm',accessPerms); 

                                scope.publish('FolderPermissionsSet',data);
                                globalData.permissionObject[getElemPath] = data;

                        }).
                        error(function(data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });

                    }

                }

                
                function removeContextMenuBox(){
                  angular.element(".actionEachBox").removeAttr('style').addClass('hidden');
                  scope.thisTree.find(".actionEach").remove();
                  scope.thisTree.find("li.menuOpen").removeClass('menuOpen');
                }

                scope.toggleSelectFolder = function(id,fldrPath){

                    if(angular.element('#'+id).hasClass('disabled')){
                        return false;
                    }

                    if(scope.rootName.instanceId === 'filterPageFT'){

                        scope.selectedFolderIdsArray = [];

                        if(scope.selectedFolderIdsArray.indexOf(id) == -1){
                            scope.selectedFolderIdsArray.push(id.toString());
                        }else{
                          scope.selectedFolderIdsArray.splice(scope.selectedFolderIdsArray.indexOf(id), 1);
                        }
                        
                        scope.setFolderPermissions(id);
                        scope.publish('selectProductsByFolder', scope.selectedFolderIdsArray);

                        if(angular.element(".actionEachBox").is(":visible")){
                          removeContextMenuBox();
                        }

                    } else if (scope.rootName.instanceId === 'moveFolderFT'){

                        scope.selectedFolderIdsArray = [];
                        scope.selectedFolderIdsArray.push(id);

                        scope.publish('publishFolderSelected',{'folderId' : id , 'folderInstance': scope.rootName.instanceId , 'fPath' : fldrPath});

                     } else if(scope.rootName.instanceId === 'filterFolderFT'){

                       /* $('#'+id).find('input[type="checkbox"]').attr('checked',true);
                          $('#'+id).find('label.folderSelector').addClass('selected');
                        */
                    }                   

                }

                scope.getRandomInt = function(min, max) {
                    return Math.floor(Math.random() * (max - min)) + min;
                }

                scope.childCompilerArr = function(objEvent, parentObj, childObject){                    

                    scope.getChildFolders = childObject;
                    var getRandOmInt = scope.getRandomInt(1,99999999999);
                    scope.treeChild[getRandOmInt] = JSON.parse(JSON.stringify(childObject));

                    angular.forEach(childObject,function(val,key){
                        scope.completeFolderStack.push(val);
                    }); 

                    scope.getChildWrap = objEvent.target;

                    //console.log('here parentobj',parentObj);
                    //console.log(scope.getChildWrap);

                   // angular.copy(scope.treeChild, scope.foldersArray);     // Copy the complete stack here
                   // angular.copy(scope.treeChild, scope.completeFolderStack); // Copy the complete stack here

                    scope.folderString = "<ul class='subfolder'>";
                    scope.lowestlevel = scope.lowestlevelGetter(scope.treeChild[getRandOmInt]) || 0;
                    scope.recursionCount = 0;
                    scope.folderHierarchyLevel = 1;

                    //Gets the number of recursions to be done.
                    for (var folderIndex in scope.treeChild[getRandOmInt]) {
                        if (scope.treeChild[getRandOmInt][folderIndex].folderLevel > scope.lowestlevel) {
                            scope.recursionCount++;
                            scope.lowestlevel = scope.treeChild[getRandOmInt][folderIndex].folderLevel;
                        }
                    }

                    while (scope.recursionCount > scope.folderHierarchyLevel - 1) {
                        scope.lastIndex;
                        if (scope.folderHierarchyLevel === 1) {

                            folderArray = [];

                            scope.treeChild[getRandOmInt].forEach(function(folder, index) {
                                if (folder.folderType === "ROOT") {
                                    folderArray.push(folder);
                                }
                            });

                        }

                        scope.nextSet = [];
                        folderArray.forEach(function(folder, index) {

                            if (scope.folderHierarchyLevel === 1) {

                                folderArray[index] = scope.subFolderCreatorChild(folder);
                                if (folderArray[index].subFolders.length) {
                                    /*ignore jslint start*/
                                    folderArray[index].subFolders.forEach(function(elem) {
                                        scope.nextSet.push(elem);
                                    });
                                    /*ignore jslint end*/
                                }

                            } else {

                                folder.subFolders = [];
                                folderArray[index] = scope.subFolderCreatorChild(folder);

                                if (folderArray[index].subFolders.length) {
                                    /*ignore jslint start*/
                                    folderArray[index].subFolders.forEach(function(elem) {
                                        scope.nextSet.push(elem);
                                    });
                                    /*ignore jslint end*/
                                }

                            }

                            scope.lastIndex = index;
                        });

                        folderArray = scope.nextSet;
                        scope.folderHierarchyLevel++;
                    }

                    //console.log(scope.folderHierarchyLevel);
                    scope.firstIteration = true;
                    scope.totalIterations = 0;

                    //scope.tree[0]['subFolders'][0]['subFolders'] =  scope.treeChild;

                    //console.log(scope.treeChild[getRandOmInt]);
                    //console.log(scope.tree);

                    scope.totalIterations = parentObj.folderLevel;
                    scope.childCount = 0;

                     while (scope.folderHierarchyLevel > 0) {

                        scope.calculatePadding(scope.totalIterations - 1);

                        if (scope.firstIteration) {

                            scope.folderString = scope.folderString + '<li ng-repeat="subfolder in treeChild.'+getRandOmInt+'" ng-class="{expandButton:subfolder.hasSubFolders, disabled:subfolder.folderAccess == \'NONE\', plus:subfolder.hasSubFolders, selected:selectedFolderIdsArray.indexOf(subfolder.folderId) !== -1}" id="{{subfolder.folderId}}" ftPath="{{subfolder.fullFolderPath}}" ftName="{{subfolder.folderName}}" ftLevel="{{subfolder.folderLevel}}" ftType="{{subfolder.folderType}}" ftAccess="{{subfolder.folderAccess}}">';
                            scope.firstIteration = false;
                        } else {

                            scope.folderString = scope.folderString + '<ul class="subfolder">' +
                                '<li ng-repeat="subfolder in subfolder.subFolders"  ng-class="{expandButton:subfolder.hasSubFolders,plus:subfolder.hasSubFolders, disabled:subfolder.folderAccess == \'NONE\', selected:selectedFolderIdsArray.indexOf(subfolder.folderId) !== -1}">';
                        }

                         if(scope.rootName.showFolderOptions == true){

                        scope.folderString = scope.folderString + '<a href="javascript:void(0)" ng-class="{disabled:subfolder.folderAccess ==\'NONE\'}" ng-click="toggleSelectFolder(subfolder.folderId,subfolder.fullFolderPath)" style="padding-left: ' + scope.folderPadding + 'px" vmf-folder-options data-folder-options=subfolder.folderOptions data-this-tree = "thisTree"  ng-click="folderClickCallBack({$event:$event,this:this})" complete-folder-stack = "completeFolderStack" folder-data-ftype="subfolder.folderType">' +
                            '<span class="expandCollapseIcon" style="left: ' + scope.collapsePadding + 'px" ng-show="subfolder.hasSubFolders" ng-click="expander($event,subfolder.folderAccess); ajaxLoad($event,subfolder)">&nbsp;</span>';

                        } else {

                        scope.folderString = scope.folderString + '<a href="javascript:void(0)" ng-click="toggleSelectFolder(subfolder.folderId,subfolder.fullFolderPath)" style="padding-left: ' + scope.folderPadding + 'px"  ng-click="folderClickCallBack({$event:$event,this:this})" complete-folder-stack = "completeFolderStack" folder-data-ftype="subfolder.folderType">' +
                            '<span class="expandCollapseIcon" style="left: ' + scope.collapsePadding + 'px" ng-show="subfolder.hasSubFolders" ng-click="expander($event,subfolder.folderAccess); ajaxLoad($event,subfolder)">&nbsp;</span>';

                        }

                        if (angular.lowercase(scope.multipleSelect) === "off" || angular.lowercase(scope.multipleSelect) === "false") {

                            scope.folderString = scope.folderString + '<div style="margin-left:10px;" class="custom-checkbox">' + 
                            '<span class="folderIcon"></span>{{subfolder.folderName}} <span class="badge" ng-if="subfolder.folderType == \'ASP\' || subfolder.folderType == \'VCE\' || subfolder.folderType == \'CPL\'" badgeType="{{subfolder.folderType}}">{{subfolder.folderType}}</span></div>';
                        } else {
                            scope.folderString = scope.folderString + '<div class="checkbox"><input id="{{subfolder.folderName}}" class="styled" ng-model="subfolder.checked" type="checkbox" ng-disabled="subfolder.folderAccess == \'NONE\'"><label for="{{subfolder.folderName}}">{{subfolder.folderName}}</label></div>';

                            //scope.folderString = scope.folderString + '<div vmf-checkbox-group class="vmf-checkbox-group" type="1" c-foldertype="subfolder.folderType" model="subfolder.checked" c-label="subfolder.folderName" c-disabled="subfolder.folderAccess == \'NONE\'"></div>';
                        }

                        scope.folderString = scope.folderString + '</a>';
                        scope.folderHierarchyLevel--;
                        scope.totalIterations++;
                        scope.childCount++;
                    }

                    while (scope.childCount > 0) {

                        scope.folderString = scope.folderString + '</li></ul>';
                        scope.childCount--;
                    }

                    //var getParent = $(scope.getChildWrap).parents('.subfolder:first'); 
                    var getParent = $(scope.getChildWrap).parents('li:first'); 
                    var getParentId =   getParent.prop('id');

                    $timeout(function() {
                        getParent.append($compile(scope.folderString)(scope));
                    });

                    $timeout(function() {

                         getParent.find('.disabled > a')
                            .addClass('vmf-tooltip')
                            .attr('data-toggle','tooltip')
                            .attr('data-placement','bottom')
                            .attr('title',globalVariables.textDisabledFolders);

                        getParent.find('.badge').each(function(){
                            var getType = $(this).attr('badgeType');
                            $(this).attr('title',globalVariables['staticTextfor'+getType]);
                        });

                        getParent.find(".custom-checkbox").addClass("folderSelector");
                        getParent.find(".folderTree").find("input").removeAttr("ng-click");
                        getParent.find(".subfolder:first").has("li").parent("li").removeClass("plus");
                        if (angular.lowercase(scope.multipleSelect) === "off" || angular.lowercase(scope.multipleSelect) === "false") {
                            getParent.find(".folderTreeHeader a:first span").remove();
                            getParent.addClass("withoutCheckBox");
                        }
                        getParent.find('.vmf-tooltip').tooltip();
                        scope.moveSearchedFolders();

                        scope.publish('childFoldersRecieved',{'childObj':childObject, 'parentId':getParentId, 'instanceId':scope.rootName.instanceId});

                    });

                }   
                  

                lElement.find(".folderTreeHeader .customCheckBox").off("click").on("click", function(event) {

                    scope.thisTree.find(".actionEach").remove();
                    scope.thisTree.find(".actionEachBox").remove();
                    scope.availableFolders = scope.thisTree.find(".folderSelector").not(".disabledColor");

                    if (angular.element(this).attr("checked")) {

                        scope.availableFolders.removeClass("selected").find("input").attr("checked", false);
                        scope.availableFolders.parent().removeClass("highlight");
                        angular.element(this).attr("checked", false);
                        return false;
                    } else {

                        scope.availableFolders.addClass("selected").find("input").attr("checked", true);
                        scope.availableFolders.parent().addClass("highlight");
                        angular.element(this).parents("a").removeClass("highlight");
                        angular.element(this).attr("checked", true);
                        return false;
                    }

                    //console.log("select all " +angular.element(this).attr("checked"))
                });

                //Updates
                scope.uniqueIDGenerator = function(currentFolders) {
                    var id;
                    var hitCount;
                    var validID = true;

                    while (validID === true) {

                        id = Math.floor(Math.random() * 10000);
                        hitCount = 0;
                        /*ignore jslint start*/
                        scope.completeFolderStack.forEach(function(folder) {

                            if (folder.folderId === id) {
                                hitCount++;
                            }
                        });
                        /*ignore jslint end*/

                        if (hitCount === 0)
                            validID = false;
                    }

                    return id;
                };

                scope.creatingFolder = function(referenceObj, source) {

                    var respObj = {};
                    var option = [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "enabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": true
                    }, {
                        "text": "Delete Folder",
                        "disabled": true
                    }, {
                        "text": "Rename Folder",
                        "disabled": false
                    }, {
                        "text": "Move Folder",
                        "disabled": false
                    }, {
                        "text": "Request Permission",
                        "disabled": false
                    }, {
                        "text": "Export to csv",
                        "disabled": false
                    }];

                    respObj.status = "ACTIVE";
                    respObj.folderType = "ORDER";
                    respObj.fullFolderPath = source.folderPath + "\\" + source.folderName;
                    respObj.rootFolderId = 0;
                    respObj.folderId = scope.uniqueIDGenerator(scope.completeFolderStack);
                    respObj.folderName = source.folderName;
                    respObj.parentFolderId = referenceObj.folderId;
                    respObj.folderLevel = referenceObj.folderLevel + 1;
                    respObj.folderAccess = "NONE";
                    respObj.isLeaf = true;
                    respObj.hasSubFolders = false;
                    respObj.folderOptions = option;
                    //respObj.accessable = true;
                    respObj.checked = false;

                    return respObj;
                };

                scope.resetFolders = function(change, type) {

                    scope.modifiedFolders = [];
                    scope.type = type || "";
                    scope.parentFolder;
                    scope.searchResult = {};

                    //logic to be changed
                    if (type.search("Create") >= 0) {

                        scope.newFolder = {};
                        scope.referenceObj = {};

                        scope.allFolders.forEach(function(folder, folderIndex) {
                            if (folder.fullFolderPath === change.folderPath) {
                                scope.allFolders[folderIndex].hasSubFolders = true;
                                scope.referenceObj = folder;
                            }
                        });

                        scope.newFolder = scope.creatingFolder(scope.referenceObj, change);

                        scope.allFolders.push(scope.newFolder);
                        scope.modifiedFolders = scope.allFolders;
                        //console.log(currentFolders);
                    } else if (type.search("Delete") >= 0) {

                        scope.delReference = change.ref;
                        scope.deleteIndice = [];
                        scope.deletedFolders = [];
                        scope.completeFolderStack.forEach(function(folder, folderIndex) {
                            if (folder.fullFolderPath.split(delReference).length > 1) {
                                scope.deleteIndice.push(folderIndex);
                            }
                        });

                        scope.deleteIndice.reverse().forEach(function(delFodler, folderIndex) {

                            scope.tempCount = 0;
                            scope.tempParentId = scope.completeFolderStack[folderIndex].parentFolderId;
                            deletedFolders.push(scope.completeFolderStack[folderIndex]);
                            scope.completeFolderStack.splice(folderIndex, 1);

                            scope.completeFolderStack.forEach(function(folder, index) {
                                if (scope.tempParentId === folder.parentFolderId) {
                                    scope.tempCount++;
                                }

                            });
                            if (scope.tempCount === 0) {
                                scope.completeFolderStack.forEach(function(folder, index) {
                                    if (scope.tempParentId === folder.folderId) {
                                        folder.hasSubFolders = false;
                                        return false;
                                    }
                                });
                            }
                        });

                        //scope.folderTreeDataService.previouslyDeletedFolders.push(deletedFolders);
                        scope.modifiedFolders = scope.completeFolderStack;
                    } else if (type.search("Rename") >= 0) {

                        scope.mainPathArray = [];
                        scope.newFullPath = "";
                        scope.bits = [];

                        scope.initialPath = change.currentFolderPath.split("\\");
                        scope.initialPath.pop();


                        scope.completeFolderStack.forEach(function(folder, folderIndex) {

                            scope.mainPathArray = [];
                            scope.mainPathArray = folder.fullFolderPath.split(change.currentFolderPath);
                            if (scope.mainPathArray.length >= 1) {

                                if (scope.mainPathArray[0] === "") {

                                    scope.mainPathArray[0] = change.folderName;
                                    scope.newFullPath = scope.initialPath.join("\\") + "\\" + scope.mainPathArray.join("");
                                    scope.completeFolderStack[folderIndex].fullFolderPath = scope.newFullPath;
                                }
                                if (scope.completeFolderStack[folderIndex].folderName === change.currentFolderPath.split("\\").pop()) {

                                    scope.completeFolderStack[folderIndex].folderName = change.folderName;
                                }
                            }


                        });

                        scope.modifiedFolders = scope.completeFolderStack;
                    } else if (type.search("Move") >= 0) {
                        // console.log("In Move Folder")

                        var tobemoved = [];
                        scope.parentFolder = {};
                        var immediateChildren = {};
                        var childFolder = {};

                        var ref = change.currentFolderPath.split("\\").pop();

                        scope.completeFolderStack.forEach(function(folder, folderIndex) {
                            if (folder.fullFolderPath === change.folderPath) {
                                scope.parentFolder = {
                                    "folder": folder,
                                    index: folderIndex
                                };
                            }
                            if (folder.fullFolderPath.split(change.currentFolderPath).length > 1) {

                                if (folder.fullFolderPath.split(change.currentFolderPath)[folder.fullFolderPath.split(change.currentFolderPath).length - 1] === "") {
                                    immediateChild = {
                                        "folder": folder,
                                        index: folderIndex
                                    };
                                } else {
                                    tobemoved.push({
                                        "folder": folder,
                                        index: folderIndex
                                    });
                                }
                            }
                        });


                        var tempCount = 0;
                        var tempParentId = scope.completeFolderStack[immediateChild.index].parentFolderId;

                        scope.completeFolderStack.forEach(function(folder, index) {
                            if (tempParentId === folder.parentFolderId) {
                                tempCount++;
                            }

                        });
                        if (tempCount <= 1) {
                            scope.completeFolderStack.forEach(function(folder, index) {
                                if (tempParentId === folder.folderId) {
                                    folder.hasSubFolders = false;
                                    return false;
                                }
                            });
                        }

                        scope.completeFolderStack[immediateChild.index].parentFolderId = scope.completeFolderStack[scope.parentFolder.index].folderId;
                        scope.completeFolderStack[immediateChild.index].folderLevel = scope.completeFolderStack[scope.parentFolder.index].folderLevel + 1;
                        scope.completeFolderStack[immediateChild.index].isLeaf = true;
                        scope.completeFolderStack[scope.parentFolder.index].hasSubFolders = true;
                        scope.completeFolderStack[immediateChild.index].fullFolderPath = scope.completeFolderStack[scope.parentFolder.index].fullFolderPath + "\\" + scope.completeFolderStack[immediateChild.index].folderName;



                        var iterate = true;
                        var lowestLevel = 0;
                        var levels = [];
                        if (Object.keys(tobemoved).length > 0) {
                            tobemoved.forEach(function(folder, folderIndex) {
                                // levels.push(folder.folderLevel)
                                if (scope.completeFolderStack[immediateChild.index].folderId === folder.folder.parentFolderId) {
                                    scope.completeFolderStack[folder.index].folderLevel = scope.completeFolderStack[immediateChild.index].folderLevel + 1;
                                    scope.completeFolderStack[folder.index].isLeaf = true;
                                    scope.completeFolderStack[folder.index].fullFolderPath = scope.completeFolderStack[immediateChild.index].fullFolderPath + "\\" + folder.folder.folderName;
                                }
                            });

                            scope.completeFolderStack.forEach(function(folderName, index) {
                                if (folderName.hasSubFolders) {
                                    tobemoved.forEach(function(folder, folderIndex) {
                                        if (folder.folder.folderId === folderName.parentFolderId) {
                                            scope.completeFolderStack[index].folderLevel = scope.completeFolderStack[folder.index].folderLevel + 1;
                                            scope.completeFolderStack[index].fullFolderPath = scope.completeFolderStack[folder.index].fullFolderPath + "\\" + folderName.folderName;
                                            return false;
                                        }
                                    });
                                } else {
                                    tobemoved.forEach(function(folder, folderIndex) {
                                        if (folder.folder.parentFolderId === folderName.folderId) {
                                            scope.completeFolderStack[folder.index].folderLevel = scope.completeFolderStack[index].folderLevel + 1;
                                            scope.completeFolderStack[folder.index].fullFolderPath = scope.completeFolderStack[index].fullFolderPath + "\\" + folder.folder.folderName;
                                            return false;
                                        }
                                    });
                                }
                            });
                        }

                        scope.modifiedFolders = scope.completeFolderStack;
                    } else if (type.search("Find") >= 0) {

                        scope.completeFolderStack.forEach(function(folder) {
                            if (angular.lowercase(folder.folderName).split(angular.lowercase(change.folderName)).length > 1) {
                                scope.searchResult = folder;
                            }
                        });
                        scope.findFolder.folderName = "";
                        //console.log(searchResult);
                        //scope.searchResult = searchResult;
                    }

                    //scope.folderTreeDataService.allFolderPaths = scope.folderTreeDataService.getAllFolderPaths();

                    //console.log(scope.allFolders);
                    if (scope.type.split("Find").length === 1) {

                        scope.folderStackUpdated(scope.modifiedFolders);

                    } else {
                        scope.foundElement(scope.searchResult);
                    }

                    //return modifiedFolders;
                };

                scope.folderStackUpdated = function(update) {
                    scope.tree = update;
                    //console.log(update);
                };

                //Modal Overlay functions

                scope.getAllFolderPaths = function(foldersArray) {

                    scope.foldersArray = foldersArray;
                    scope.pathArray = [];
                    scope.pathPresent = false;

                    if (!angular.isUndefined(scope.foldersArray)) {

                        scope.foldersArray.forEach(function(folder) {

                            scope.pathPresent = false;
                            scope.pathArray.forEach(function(folderPath) {

                                if (folderPath === folder.fullFolderPath) {

                                    scope.pathPresent = true;
                                }
                            });

                            if (!scope.pathPresent) {

                                scope.pathArray.push(folder.fullFolderPath);
                            }
                        });
                    }


                    //console.log(pathArray);
                    return scope.pathArray;
                };

                scope.find = function(folder) {

                    scope.findResult = [];
                    if (folder.folderName === "") {
                        angular.element(".resultPane.notpborder").children().remove();
                    } else {

                        scope.allFolders.forEach(function(folderObj) {
                            if (angular.lowercase(folderObj.folderName).split(angular.lowercase(folder.folderName)).length > 1) {
                                scope.findResult.push(folderObj);
                            }
                        });

                        //console.log(scope.searchResult);
                        scope.createOptions(scope.findResult);
                        scope.optionsString = '<div vmf-radio-group type="1" rtitle="radioTitle" options="radioOptions" name="radioName" model="radioModel" custom-class="customclass" mandatory="true" class="radio-controls"></div>';

                        angular.element(".resultPane.notpborder").children().remove();
                        angular.element(".resultPane.notpborder").append($compile(scope.optionsString)(scope));
                    }
                };

                scope.createOptions = function(optionsCollection) {

                    scope.radioOptions = [];
                    scope.value = 0;
                    optionsCollection.forEach(function(options) {

                        if (options.accessable) {
                            scope.tempOption = {};

                            scope.tempOption.text = options.folderName;
                            scope.tempOption.disabled = false;
                            scope.tempOption.checked = false;
                            scope.tempOption.value = scope.value.toString();
                            scope.value++;

                            scope.radioOptions.push(scope.tempOption);
                        }
                    });
                };

               

            },
            templateUrl: "/vmf/m/components/folderTree/template/folderTreeTemplate.html",
            controller: function($scope, $element, $timeout, $document, ModalService, globalData) {
                _this = this;
                $scope.globalVars = globalVariables;

                this.publishGetFolderPath = function(){
                    $scope.publish('getFolderTreePaths');
                }

                this.publishGetFolderPathCreate = function(){
                    $scope.publish('getFolderTreePathsCreate');
                }

                this.getUsers = function(){
                    $scope.publish('getUserDetails');
                }

                this.publishEditFolderPermissions = function(){
                    $scope.publish('editFolderPermissions');
                }

                this.createModal = function(required, allFolders) {

                    $scope.modalData = required;
                    $scope.allFolders = allFolders;

                    $scope.publish('modalObject',$scope.modalData);                    

                    //console.log($scope.allFolderPaths);

                    $scope.deleteWarning = "When you confirm, the folder and all its subfolders will be deleted.Users who are associated only to the selected folders will no longer be able to access the account.";

                    $scope.newFolder = {};
                    $scope.renewFolder = {};
                    $scope.move = {};
                    $scope.newUser = {};
                    $scope.parentFolderName;

                    $scope.folderPath;
                    $scope.deleteFolderPath;
                    $scope.deleteWarningType = "warning";

                    $scope.htmlString = "";

                    console.log($scope.modalData);

                    $scope.allFolderPaths = $scope.getAllFolderPaths($scope.allFolders);

                    /*
                    if ($scope.modalData.operationScope.text === "Create Folder") {

                        if ($scope.modalData.folders.length > 0) {
                            $scope.parentFolderName = $scope.allFolderPaths.indexOf($scope.modalData.folders[0].fullFolderPath);
                        } else {
                            $scope.parentFolderName = "";
                        }

                        $scope.htmlString = '<p>Type the name of the folder.</p><div class="vmf-create-folder"><div vmf-select-list pre-select-ind="' + $scope.parentFolderName + '" dtitle="Parent Folder" validation=\'[{"name":"selectOne"},{"name":"required"}]\' model="newFolder.folderPath" list="allFolderPaths" mandatory="true" custom-class="customclass"></div>' +
                            '<div vmf-text-input type="normal" class="vmf-text-input clearfix" name="userForm" model="newFolder.folderName" title="Folder Name" validation=\'[{"name":"required"}]\' mandatory="true" custom-class="customclass"></div></div>';
                        $scope.footerBtn = '<input type="submit" class="vmf-btn vmf-primary vmfloginChange" href="javascript:void(0);" value="Save" ng-click="folderActions($event)" /><input type="submit" class="vmf-btn  vmfloginChange" href="javascript:void(0);" value="Cancel" data-dismiss="modal" ng-click="close(\'Cancel\');modalShown=false" />';
                    }

                    if ($scope.modalData.operationScope.text === "Delete Folder") {

                        $scope.deleteFolderPath = $scope.modalData.folders[0].fullFolderPath;

                        $scope.htmlString = '<div class="vmf-delete-folder" ng-if="deleteFolderErrorMsg.length == 0"><p>Confirm that you want to delete the selected folder and its subfolders.</p>' +
                            '<div class="vmf-highlight"><div class="col-md-3 formLabel"> Delete Folder </div> <div class="col-md-4">\\\\{{deleteFolderPath}}</div><div class="clearfix"></div></div>' +
                            '<div information-message info-message="{{deleteWarning}}" is-info-message="true" info-type="{{deleteWarningType}}"></div></div>';

                        $scope.htmlString += '<div ng-if="deleteFolderErrorMsg.length >= 1"></div>'

                        $scope.footerBtn = '<input type="submit" class="vmf-btn vmf-primary vmfloginChange" href="javascript:void(0);" value="Confirm" ng-click="folderActions($event)" /><input type="submit" class="vmf-btn  vmfloginChange" href="javascript:void(0);" value="Cancel" data-dismiss="modal" ng-click="close(\'Cancel\');modalShown=false" />';
                    }

                    if ($scope.modalData.operationScope.text === "Rename Folder") {

                        $scope.renewFolder.currentFolderPath = $scope.modalData.folders[0].fullFolderPath;
                        $scope.htmlString = '<div class="vmf-rename-folder"><p>To rename the folder, type the new folder name and click Confirm. The new folder name must be unique and not already in use for this account.</p>' +
                            '<div class="vmf-highlight"><div class="col-md-3 formLabel">Existing folder name   </div>  <div class="col-md-4">\\\\{{renewFolder.currentFolderPath}}</div>' +
                            '<div vmf-text-input type="normal" class="vmf-text-input clearfix" name="userForm" model="renewFolder.folderName" title="New Folder Name" mandatory="true" validation=\'[{"name":"required"}]\' custom-class="customclass"></div></div></div>';
                        $scope.footerBtn = '<input type="submit" class="vmf-btn vmf-primary vmfloginChange" href="javascript:void(0);" value="Save" ng-click="folderActions($event)" /><input type="submit" class="vmf-btn  vmfloginChange" href="javascript:void(0);" value="Cancel" data-dismiss="modal" ng-click="close(\'Cancel\');modalShown=false" />';
                    }

                    if ($scope.modalData.operationScope.text === "Move Folder") {

                        $scope.move.currentFolderPath = $scope.modalData.folders[0].fullFolderPath;
                        $scope.customFolderPaths = [];

                        // $scope.customFolderPaths.splice($scope.customFolderPaths.indexOf($scope.move.currentFolderPath),1);

                        $scope.allFolderPaths.forEach(function(path) {
                            if (path.split($scope.modalData.folders[0].fullFolderPath).length === 1) {

                                $scope.customFolderPaths.push(path);
                            }
                        });
                        //console.log($scope.customFolderPaths);
                        $scope.htmlString = '<div class="vmf-move-folder"><p>Select the target folder location.</p>' +
                            '<div class="vmf-highlight"><div class="col-md-3 formLabel">Move Folder    </div> <div class="col-md-4">\\\\{{move.currentFolderPath}}</div>' +
                            '<div class="clearfix" vmf-select-list dtitle="To" model="move.folderPath" validation=\'[{"name":"selectOne"},{"name":"required"}]\' list="customFolderPaths" mandatory="true" custom-class="customclass"></div></div></div>';
                        $scope.footerBtn = '<input type="submit" class="vmf-btn vmf-primary vmfloginChange" href="javascript:void(0);" value="Continue" ng-click="folderActions($event)" /><input type="submit" class="vmf-btn  vmfloginChange" href="javascript:void(0);" value="Cancel" data-dismiss="modal" ng-click="close(\'Cancel\');modalShown=false" />';
                    }

                    if ($scope.modalData.operationScope.text === "Find Folder") {

                        console.log('find fodler');

                        $scope.htmlString = '<p class="statictext_p">Find then select a folder.</p><div class="section-wrapper clearfix  bottomarea"><section class="column fiveFifty mtop11"><header><h1>License Key Folders </h1></header><div class="searchArea">' +
                            '<div vmf-text-input type="normal" class="vmf-text-input clearfix" name="userForm" model="findFolder.folderName" validation=\'[{"name":"required"}]\' custom-class="customclass"></div>' +
                            '<input type="submit" ng-click="find(findFolder)" value="Find" class="vmf-btn vmf-primary" /></div><div class="resultPane notpborder">' +
                            '</div></section></div>';

                        $scope.footerBtn = '<input type="submit" class="vmf-btn vmf-primary vmfloginChange" href="javascript:void(0);" value="Select" ng-click="folderActions($event)" /><input type="submit" class="vmf-btn  vmfloginChange" href="javascript:void(0);" value="Cancel" data-dismiss="modal" ng-click="close(\'Cancel\');modalShown=false" />';
                    }

                    if ($scope.modalData.operationScope.text === "Invite New User") {

                        $scope.InviteUserModal = "Invite_New_User";

                        $scope.htmlString = '<div  class="row inviteUser">' + ' <div>' + '  <div class="header-text"><span>Invite New Users</span></div>' + '  <div class="inviteUser-required"> Required*</div>' + '  <div class="left-align"><div>Email address*</div>' + '  <input type="text" id="" name="name" ng-model="newUser.emailAddress" placeholder="" class="ng-pristine ng-valid"></div>' + '  <div class="left-align"><div>First Name*</div>' + '   <input type="text" id="" name="name" ng-model="newUser.firstName" placeholder="" class="ng-pristine ng-valid"></div>' + '   <div class="left-align"><div> Last Name*</div>' + '   <input type="text" id="" name="name" ng-model="newUser.lastName" placeholder="" class="ng-pristine ng-valid"></div>' + '  <div class="left-align"><input type="submit" ng-click="find(findFolder)" value="Add >>" class="vmf-btn vmf-right-button"></div></div>' + ' </div>';
                        +'  <div style="border:1px solid #000000;height:350px;" class="col-md-7 noPadding">'
                        +'  <div class="header-text"><span>Selected Users(0)</span><input type="submit" ng-click="find(findFolder)" value="Add>>"                                  class="vmf-btn vmf-primary" style="float:right;"> </div>'
                        +'   <div class="section-text"><span style="width:170px;float:left;">Name</span><span>E-mail</span>'                                     +'   </div</div></div>';

                        $scope.footerBtn = '<input type="submit" class="vmf-btn vmfloginChange" href="javascript:void(0);" value="Continue" data-dismiss="modal" ng-click="folderActions($event)" /><input type="submit" class="vmf-btn  vmfloginChange vmf-primary" href="javascript:void(0);" data-dismiss="modal" value="Cancel" ng-click="folderActions($event)" />';
                    }

                    $scope.radioName = 'role';
                    $scope.radioModel = "";

                    $timeout(function() {
                        angular.element(".modal-body").append($compile($scope.htmlString)($scope));
                        angular.element(".modal-footer").append($compile($scope.footerBtn)($scope));
                    });*/
                }; 

                $scope.foundElement = function(searchResults) {
                    //console.log(searchResults);
                    $scope.requiredFolder = searchResults;
                    $scope.expanders = angular.element(".folderTree").find(".expandButton").find(".custom-checkbox");

                    $scope.expanders.removeClass("selected").parent().removeClass("highlight").parent().removeClass("minus").addClass("plus");
                    $scope.expanders.eq(0).parent().parent().removeClass("plus").addClass("minus");

                    $scope.folderRoots = $scope.requiredFolder.fullFolderPath.split("\\");
                    $scope.folderRoots.shift();
                    $scope.lastFName = $scope.folderRoots[$scope.folderRoots.length - 1];
                    $scope.lastElement;
                    $scope.expanderIndices = [];
                    $scope.folderRoots.forEach(function(root) {
                        for (var expanderIndex = 0; expanderIndex < $scope.expanders.length; expanderIndex++) {

                            if ($scope.expanders.eq(expanderIndex).text() === root && $scope.expanders.eq(expanderIndex).parent().parent().hasClass("plus")) {

                                $scope.expanders.eq(expanderIndex).parent().parent().removeClass("plus").addClass("minus");
                                if (root === $scope.lastFName) {
                                    $scope.expanderIndices.push(expanderIndex);
                                }
                                $scope.lastElement = $scope.expanders.eq(expanderIndex);

                            }

                        }
                    });

                    angular.element(".foldertreeUl>li").removeClass("plus");
                    $scope.expanderIndices.forEach(function(index) {
                        $scope.expanders.eq(index).addClass("selected").parent().addClass("highlight");
                    });

                    //$scope.lastElement.addClass("selected").parent().addClass("highlight");
                };

                $scope.expander = function(event, folderAccess) {

                    event.stopPropagation();
                    if ($scope.thisTree.find(event.currentTarget).parent().parent().hasClass("plus")) {
                        $scope.thisTree.find(event.currentTarget).parent().parent().removeClass("plus").addClass("minus");
                    } else if ($scope.thisTree.find(event.currentTarget).parent().parent().hasClass("minus")) {
                        $scope.thisTree.find(event.currentTarget).parent().parent().removeClass("minus").addClass("plus");
                    }
                    //$scope.mainOptions[0].disabled = false;
                };

                $scope.getPermissionFpList = []; 

                $scope.subscribe('setEnableMainOptions',function(data){
                    if(data == 'enabled')
                        $scope.mainOptionsEnable = true;
                    else
                        $scope.mainOptionsEnable = false; 
                });

               $scope.checkManagePerms = function(event){                    

                    var getSelectElemLength = $scope.thisTree.find('li.selected').length;

                    var getFtype = '';
                    var getFtAccess = '';

                    if(getSelectElemLength == 1){
                         getFtype = $scope.thisTree.find('li.selected').attr('ftType');
                         getFtAccess = $scope.thisTree.find('li.selected').attr('ftPerm');
                    }

                    var totLength =  $scope.thisTree.find('li').length;

                    $scope.setMainOptions(getSelectElemLength, $scope.mainOptionsEnable, getFtype, getFtAccess, totLength);                  


                }

                $scope.setMainOptions = function(elemLength , fpListAvailable, getFolderType, getFolderAccess, totFldrCount){
                     
                     $scope.mainOptions = [{
                            text: $scope.globalVars.folderOps.invite,
                            disabled: true,
                            id : "inviteNewUserMain"                         
                        }, {
                            text: $scope.globalVars.folderOps.share,
                            disabled: true,
                             id : "shareFolderMain"
                        }, {
                            text: $scope.globalVars.folderOps.create,
                            disabled: true,
                            id : "createFolderMain"
                        }, {
                            text: $scope.globalVars.folderOps.del,
                            id : "deleteFolderMain",
                            disabled: false
                        }, {
                            text: $scope.globalVars.folderOps.rename,
                            id : "renameFolderMain",
                            disabled: false
                        }, {
                            text: $scope.globalVars.folderOps.move,
                            id : "moveFolderMain",
                            disabled: false
                        }, {
                            text: $scope.globalVars.folderOps.find,
                            id : "findFolderMain",
                            disabled: false
                        }, {
                            text: $scope.globalVars.folderOps.exportCsv,
                            id : "exportToCsvMain",
                            disabled: false
                        }];

                        angular.forEach($scope.mainOptions,function(val, key){

                             if(fpListAvailable == true && elemLength == 0){

                                if(val.id == 'createFolderMain' || val.id == 'inviteNewUserMain' || val.id == 'shareFolderMain'){
                                                val.disabledClass = 'enabled';
                                } else {                                    
                                     val.disabledClass = 'disabled';
                                }
                                

                             } else if(elemLength == 1){ 

                                if(getFolderAccess == "MANAGE"){
                                    
                                    if(getFolderType == 'ROOT'){
                                
                                        val.disabledClass = 'disabled';
                                    
                                        if(globalData.tableType == "viewLicense"){
                                            if(val.id == 'createFolderMain' || val.id == 'exportToCsvMain'){
                                                val.disabledClass = 'enabled';
                                            } 
                                        }
                                    
                                    } else if (getFolderType == "ASP" || getFolderType == "CPL" || getFolderType == "VCE") {
                                    
                                            val.disabledClass = 'disabled';
                                        
                                            if(val.id == 'renameFolderMain' || val.id == 'inviteNewUserMain' || val.id == 'shareFolderMain'){
                                                val.disabledClass = 'enabled';
                                            }
                                            
                                            if(globalData.tableType == "viewLicense"){
                                                if(val.id == 'exportToCsvMain'){
                                                    val.disabledClass = 'enabled';
                                                }
                                            }
                                        
                                    } else {
                                    
                                        val.disabledClass = 'enabled';
                                        
                                        if(globalData.tableType == "viewLicense"){
                                                if(val.id == 'exportToCsvMain'){
                                                    val.disabledClass = 'enabled';
                                                }
                                            }
                                    }
                                
                                    if(val.id == 'inviteNewUserMain' || val.id == 'shareFolderMain'){
                                                val.disabledClass = 'enabled';
                                    }
                                } else {

                                    val.disabledClass = 'disabled';

                                }

                            } else if(fpListAvailable == false){
                                val.disabledClass = 'disabled';
                            }

                            if(totFldrCount >= 1 || fpListAvailable == true){
                                if(val.id == 'findFolderMain'){
                                    val.disabledClass = 'enabled';
                                }
                            }

                            if(globalData.tableType == "viewLicense"){
                                if(fpListAvailable === true && elemLength !== 0){
                                    if(val.id == 'exportToCsvMain'){
                                        val.disabledClass = 'enabled';
                                    }
                                }
                            }

                        });

                    // if ($scope.thisTree.find(".folderSelector.selected").length === 0) {
                    //     $scope.mainOptions[3].disabledClass = "disabled";
                    //     $scope.mainOptions[4].disabledClass = "disabled";
                    //     $scope.mainOptions[5].disabledClass = "disabled";
                    //     $scope.mainOptions[7].disabledClass = "disabled";
                    // }

                }

                $scope.openMainOptions = function(event) {
                    // while opening actions-dropdown, close all other dropdowns and close filters dropdown
                    $scope.publish('closeAllDropdowns', event);
                    $scope.publish('closeAllFilters');

                    event.preventDefault();

                    $scope.checkManagePerms(event);

                    if ($scope.thisTree.find(".actionAllBox").hasClass("optionsOpen")) {
                        if(event!=undefined) {
                            angular.element(event.target).parent().find(".ftAjaxLoader").addClass("hidden");
                        }
                        $scope.thisTree.find(".actionAllBox").removeClass("optionsOpen");
                        $scope.thisTree.find(".actionAllBox").find(".innerWrapper").children().remove();

                    } else {
                        // $scope.mainOptions = [{
                        //     text: "Invite New User",
                        //     disabled: true,
                        //     disabledClass : opt                          
                        // }, {
                        //     text: "Share Folder",
                        //     disabled: true,
                        //     disabledClass : opt 
                        // }, {
                        //     text: "Create Folder",
                        //     disabled: true,
                        //     disabledClass : opt 
                        // }, {
                        //     text: "Delete Folder",
                        //     disabled: false
                        // }, {
                        //     text: "Rename Folder",
                        //     disabled: false
                        // }, {
                        //     text: "Move Folder",
                        //     disabled: false
                        // }, {
                        //     text: "Find Folder",
                        //     disabled: false
                        // }, {
                        //     text: "Export to csv",
                        //     disabled: false
                        // }];

                        //console.log($scope.mainOptions);


                       /* if ($scope.thisTree.find(".folderSelector.selected").length === 0) {
                            $scope.mainOptions[3].disabledClass = "disabled";
                            $scope.mainOptions[4].disabledClass = "disabled";
                            $scope.mainOptions[5].disabledClass = "disabled";
                            $scope.mainOptions[7].disabledClass = "disabled";
                        } */

                        $scope.mainOptionsString = '<ul>' +
                            '<li ng-repeat="mainOption in mainOptions" ng-class="{first:$first,last:$last,mainLink:$last}">' +
                            '<a href="javascript:void(0)" class="{{mainOption.disabledClass}}" id="{{mainOption.id}}" ng-click="mainOptionsAction($event,this)">{{mainOption.text}}</a>' +
                            '</li></ul>';

                        $scope.thisTree.find(".actionAllBox").find(".innerWrapper").children().remove();

                        $timeout(function() {
                            $scope.thisTree.find(".actionAllBox").find(".innerWrapper").append($compile($scope.mainOptionsString)($scope));

                            // $timeout(function() {
                            //      var getSelectElemLength = $scope.thisTree.find('li.selected').length;

                            //     if(getSelectElemLength == 1){
                            //       $('#deleteFolderMain , #renameFolderMain,  #moveFolderMain').removeClass('disabled');
                            //     } else {
                            //       $('#deleteFolderMain , #renameFolderMain,  #moveFolderMain').addClass('disabled');
                            //     }

                            // });

                        });

                        $timeout(function() {
                            $scope.thisTree.find(".actionAllBox").addClass("optionsOpen");
                            $scope.thisTree.find(".actionEach").parent().removeClass("highlight");
                            angular.element(".actionEachBox").remove();
                            $scope.thisTree.find(".actionEach").remove();
                        });

                    }
                    event.stopPropagation();
                };

                $scope.mainOptionsAction = function(event, optionScope) {


                    if (optionScope.mainOption.id === "exportToCsvMain") {
                        $scope.publish('sendExportToCsvAPI', {
                            'selectedFolders': globalData.selectedFolder, 
                            'reportFor': 'licenseKeysFromContextMenu'
                        });

                        event.stopPropagation();
                    }else if (optionScope.mainOption.text === "Expand All Folders") {
                        $scope.thisTree.find(".expandButton").removeClass("plus").addClass("minus");
                    } else {
                        if (optionScope.mainOption.disabledClass !== "disabled") {

                            $scope.selectedFolders = $scope.thisTree.find(".selected");
                            $scope.selectedFolderNames = [];

                            $scope.required = {
                                operationScope: {},
                                folders: []
                            };

                            $scope.required.folders = [];                             

                            for (var selectedFolderIndex = 0; selectedFolderIndex < $scope.selectedFolders.length; selectedFolderIndex++) {

                                $scope.selectedFolderNames.push($scope.selectedFolders.eq(selectedFolderIndex).text());

                                var getFldr = $scope.selectedFolders.eq(selectedFolderIndex),

                                getId = getFldr.attr('id'),
                                fLevel = getFldr.attr('ftlevel'),
                                fPath = getFldr.attr('ftpath'),
                                fName = getFldr.attr('ftname'),

                                getFolderArr = {
                                    'folderId' :  getId,
                                    'folderName': fName,
                                    'fullFolderPath': fPath,
                                    'folderLevel': fLevel,
                                };

                                $scope.required.folders.push(getFolderArr);

                            }                         


                            // $scope.selectedFolderNames.forEach(function(name) {

                            //     $scope.foldersArray.forEach(function(folder) {

                            //         if (folder.folderName === name) {
                            //             $scope.required.folders.push(folder);
                            //         }
                            //     });
                            // });

                            $scope.required.operationScope = optionScope.mainOption;

                            if($scope.required.operationScope.id == 'findFolderMain'){
                                $scope.modalInstance = ModalService.showModal({
                                    templateUrl: '/vmf/m/components/folderTree/template/findFolder.tpl.html',
                                    controller: "folderTreeController"
                                }).then(function(modal) {
                                    modal.element.modal({backdrop: 'static'});
                                    _this.createModal($scope.required, $scope.completeFolderStack);                                    
                                });
                                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : find-folder");
                            }

                            if($scope.required.operationScope.id == 'shareFolderMain'){
                                $scope.modalInstance = ModalService.showModal({
                                    templateUrl: '/vmf/m/components/folderTree/template/shareFolder.tpl.html',
                                    controller: "folderTreeController"
                                }).then(function(modal) {
                                    modal.element.modal({backdrop: 'static'});
                                    _this.createModal($scope.required, $scope.completeFolderStack);  
                                    _this.getUsers();                             
                                });
                                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : share-folder");
                            }

                            if($scope.required.operationScope.id == 'inviteNewUserMain'){
                                $scope.modalInstance = ModalService.showModal({
                                    templateUrl: '/vmf/m/components/folderTree/template/inviteUser.tpl.html',
                                    controller: "folderTreeController"
                                }).then(function(modal) {
                                    modal.element.modal({backdrop: 'static'});
                                    _this.createModal($scope.required, $scope.completeFolderStack);                          
                                });
                                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : invite-new-user");
                            }

                             if($scope.required.operationScope.id == "createFolderMain"){
                                 
                                $scope.modalInst = ModalService.showModal({
                                    templateUrl: '/vmf/m/components/folderTree/template/createFolder.tpl.html',
                                    controller: "folderTreeController"
                                }).then(function(modal) {
                                    modal.element.modal({backdrop: 'static'});
                                     _this.createModal($scope.required, $scope.completeFolderStack);
                                     _this.publishGetFolderPathCreate();
                                }); 
                            }

                             if($scope.required.operationScope.id == "deleteFolderMain"){

                                 $scope.modalInst = ModalService.showModal({
                                                        templateUrl: '/vmf/m/components/folderTree/template/deleteFolder.tpl.html',
                                                        controller: "folderTreeController"
                                                    }).then(function(modal) {
                                                        modal.element.modal({backdrop: 'static'});
                                                         _this.createModal($scope.required, $scope.completeFolderStack);
                                                    });
                                                    
                                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : delete-folder");

                            }

                             if($scope.required.operationScope.id == "moveFolderMain"){
                                 
                                 $scope.modalInst = ModalService.showModal({
                                                        templateUrl: '/vmf/m/components/folderTree/template/moveFolder.tpl.html',
                                                        controller: "folderTreeController"
                                                    }).then(function(modal) {
                                                        modal.element.modal({backdrop: 'static'});
                                                         _this.createModal($scope.required, $scope.completeFolderStack);
                                                         _this.publishGetFolderPath();
                                                    }); 
                                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : move-folder");
                            }
                            
                            if($scope.required.operationScope.id == "renameFolderMain"){
                                 
                                 $scope.modalInst = ModalService.showModal({
                                                        templateUrl: '/vmf/m/components/folderTree/template/renameFolder.tpl.html',
                                                        controller: "folderTreeController"
                                                    }).then(function(modal) {
                                                        modal.element.modal({backdrop: 'static'});
                                                         _this.createModal($scope.required, $scope.completeFolderStack);
                                                    }); 
                                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : rename-folder");
                            }

                            /*$scope.modalInstance = ModalService.showModal({
                                templateUrl: '/app/components/FolderTree/template/folderActions.html',
                                controller: "folderTreeController"
                            }).then(function(modal) {
                                modal.element.modal();
                                _this.createModal($scope.required, $scope.completeFolderStack);
                            });*/

                        } else {
                            return false;
                        }
                    }

                    $scope.thisTree.find(".actionAllBox").removeClass("optionsOpen");
                };

                function removeContextMenuBox(){
                  angular.element(".actionEachBox").removeAttr('style').addClass('hidden');
                  $scope.thisTree.find(".actionEach").remove();
                  $scope.thisTree.find("li.menuOpen").removeClass('menuOpen');
                }

                $document.on('click.actionsDropdown', function($event) {
                    if ($($event.target).is("label"))
                        return false;
                    angular.forEach(angular.element(".folderSelector"), function(value, key) {
                        if (!angular.element(angular.element(".folderSelector")[key]).hasClass("selected")) {
                            angular.element(angular.element(".folderSelector")[key]).parent().removeClass("highlight");
                        }
                    });
                    //angular.element(".actionEachBox").prev().not(".selected").parent().removeClass("highlight");
                    if(!$($event.target).parents('.foldertreeUl').length){
                        removeContextMenuBox();
                    }
                    angular.element(".actionAllBox").removeClass("optionsOpen");
                });
            }
        };
    }
]);

folderTreeApp.service('folderDataService', [function() {
    this.allFolders = [];
}]);

folderTreeApp.controller("folderTreeController", ["$scope", "$sce", "$http", "$timeout", "$element", "close", "globalData", "$compile",  "$filter",
    function($scope, $sce, $http, $timeout, $element, close, globalData, $compile, $filter) {

            $scope.globalVars = globalVariables;
            $scope.txtFindFolderSearch = '';
            $scope.localObj = {};
            $scope.folderContent = [];
            $scope.currSelectedFolderInviteShare = {};
            $scope.globalVars.enterRequiredInfoDesc = angular.element('<div />').html($scope.globalVars.enterRequiredInfo).text();
            $scope.editAccessPermissionsMsg = angular.element('<div />').html($scope.globalVars.editAccessPermissions).text();
            $scope.to_trusted = function(html_code) {
                        return $sce.trustAsHtml(html_code);
            }
            $scope.subscribe('modalObject',function(data){
                $scope.modalData = data;

                if( $scope.modalData.operationScope.id == 'inviteNewUserInner' || 
                    $scope.modalData.operationScope.id == 'shareFolderInner' ||
                    $scope.modalData.operationScope.id == 'inviteNewUserMain' || 
                    $scope.modalData.operationScope.id == 'shareFolderMain'){
                    
                    
                   
                        $scope.inviteShareInit = true;
                        $scope.enteredStep2 = false;
                        $scope.currSelectedFolderInviteShare = $scope.modalData.folders[0];

                }

            });

            $scope.renderHTML = function(html_code){
                    var decoded = angular.element('<textarea />').html(html_code).text();
                    return $sce.trustAsHtml(decoded);
            };

            // Start Edit Folder Permissions

            $scope.subscribe('editFolderPermissions',function(){
                $scope.getPermissionsEdit();
            });

            $scope.resetEditPermissions = function(){
                $scope.editPermissionStep1 = false;
                $scope.editPermissionStep2 = false;
                $scope.selectPermWarningEdit = false;
            }

            $scope.goToEditPermStep2 = function(){
                $scope.resetEditPermissions();
                $scope.editPermissionStep2 = true;
                $scope.getPermUserList();                
            }

            $scope.getPermUserList = function(){

                $scope.getPermissionUserErrorMsg = '';
                $scope.ajaxLoader = true;
                $scope.getApprovalList = {};

                var foldersSelectedArray = [];
                var foldersUnselectedArray = [];

                angular.forEach($scope.getFolderPermissions.permissionPaneContents, function(val,key){
                    if(!val.isLoggedInUserCanEdit && !val.isSet){
                        if(val.checked == true){
                            foldersSelectedArray.push(val.permissionCode);
                        }
                    }
                });

                /*angular.forEach($scope.getFolderPermissions.permissionPaneContents, function(val,key){
                    if(!val.isLoggedInUserCanEdit && val.isSet){
                        if(val.checked == false){
                            foldersUnselectedArray.push(val.permissionCode);
                        }
                    }
                });*/

                if($scope.localObj.adminCheckPerm == true){
                    var adminChk = 'Y';
                } else{
                     var adminChk = 'N';
                }

                 var params = { 
                                        "slectedFolderReqIdHide":$scope.modalData.folders[0]['folderId'],
                                        "selectedReqPermissionIds":foldersSelectedArray.join(','),
                                        "unselectedReqPermissionIds": foldersUnselectedArray.join(','),
                                        "selectedReqCustomerId":globalData.loggedUserInfo.customerNumber,
                                        "adminReqRoleSelected": adminChk,
                                        "txtareaRequestNote":$scope.getPermissionNote
                              };

                var paramsEncoded = $.param(params);

                $http({
                    method: 'POST',
                    url: globalVariables.getPermUserListUrl,
                    data: paramsEncoded,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).
                success(function(data, status, headers, config) { 

                    if(data == null || data == undefined || data == ''){

                        $scope.getPermissionUserErrorMsg = globalVariables.emptyDataMessage;
                        
                    } else if(data.error == true){

                         $scope.getPermissionUserErrorMsg = data.message;

                    } else {

                        $scope.getApprovalList = data.approverList;

                    }

                    $scope.ajaxLoader = false;

                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.ajaxLoader = false;
                    $scope.getPermissionUserErrorMsg = globalVariables.emptyDataMessage;
                });

            }

            $scope.reqPermSubmit = function(){

                $scope.submitPermissionErrorMsg = '';
                $scope.ajaxLoader = true;


                var foldersSelectedArray = [];
                var foldersUnselectedArray = [];

                angular.forEach($scope.getFolderPermissions.permissionPaneContents, function(val,key){
                    if(!val.isLoggedInUserCanEdit && !val.isSet){
                        if(val.checked == true){
                            foldersSelectedArray.push(val.permissionCode);
                        }
                    }
                });

                /*angular.forEach($scope.getFolderPermissions.permissionPaneContents, function(val,key){
                    if(!val.isLoggedInUserCanEdit && val.isSet){
                        if(val.checked == false){
                            foldersUnselectedArray.push(val.permissionCode);
                        }
                    }
                });*/

                if($scope.localObj.adminCheckPerm == true){
                    var adminChk = 'Y';
                } else{
                     var adminChk = 'N';
                }

                var params = { 
                                "slectedFolderReqIdHide": $scope.modalData.folders[0]['folderId'],
                                "selectedReqPermissionIds": foldersSelectedArray.join(','),
                                "unselectedReqPermissionIds": foldersUnselectedArray.join(','),
                                "selectedReqCustomerId": globalData.loggedUserInfo.customerNumber,
                                "adminReqRoleSelected": adminChk,
                                "txtareaRequestNote": $scope.getPermissionNote
                             };

                var paramsEncoded = $.param(params);

                 $http({
                    method: 'POST',
                    url: globalVariables.requestedPermissionUrl,
                    data: paramsEncoded,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).
                success(function(data, status, headers, config) { 

                    if(data == null || data == undefined || data == ''){

                         $scope.closeModal();
                        //$scope.submitPermissionErrorMsg = globalVariables.emptyDataMessage;
                        
                    } else if(data.error == true){

                         $scope.submitPermissionErrorMsg = data.message;

                    } else {

                        $scope.closeModal();

                    }

                    $scope.ajaxLoader = false;

                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.ajaxLoader = false;
                    $scope.submitPermissionErrorMsg = globalVariables.emptyDataMessage;
                });

            }

            $scope.goToEditPermStep1 = function(){
                $scope.resetEditPermissions();
                $scope.editPermissionStep1 = true;                
            }

             $scope.getPermissionsEdit= function(){

                $scope.localObj.adminCheckPerm = false;

                $scope.resetEditPermissions();
                $scope.editPermissionStep1 = true;

                $scope.getPermissionErrorMsg = '';
                $scope.getPermissionNote = '';
                $scope.ajaxLoader = true;

                var params = { 
                    'selectedFolderId': $scope.modalData.folders[0]['folderId'],
                    'selectedCustomerNumber': globalData.loggedUserInfo.customerNumber
                };

                var paramsEncoded = $.param(params);

                $http({
                    method: 'POST',
                    url: globalVariables.getPermissionsEditUrl,
                    data: paramsEncoded,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).
                success(function(data, status, headers, config) { 

                    if(data == null || data == undefined || data == ''){

                        $scope.getPermissionErrorMsg = globalVariables.emptyDataMessage;

                    } else if(data.error == true){

                         $scope.getPermissionErrorMsg = data.message;

                    } else {
                            $scope.ajaxLoader = false;

                            $scope.getFolderPermissions = data;

                            // if permissionpanecontents length is 0, then add default values manually
                            if( data.permissionPaneContents.length === 0 ){
                                $scope.getFolderPermissions = {
                                    "managePermission": null,
                                    "folderAccess": null,
                                    "permissionPaneCacheTimestamp": null,
                                    "permissionPaneContents": [
                                        {
                                            "level": 0,
                                            "category": "GLOBAL",
                                            "permissionCode": "PERMISSION09",
                                            "sortOrder": 10,
                                            "permissionName": globalVariables.manageRolesLbl,
                                            "isSet": false,
                                            "isInherited": false,
                                            "isLoggedInUserCanEdit": false
                                        },
                                        {
                                            "level": 0,
                                            "category": "GLOBAL",
                                            "permissionCode": "PERMISSION08",
                                            "sortOrder": 20,
                                            "permissionName": globalVariables.viewSupportLbl,
                                            "isSet": false,
                                            "isInherited": false,
                                            "isLoggedInUserCanEdit": false
                                        },
                                        {
                                            "level": 0,
                                            "category": "GLOBAL",
                                            "permissionCode": "PERMISSION07",
                                            "sortOrder": 30,
                                            "permissionName": globalVariables.viewOrdersLbl,
                                            "isSet": false,
                                            "isInherited": false,
                                            "isLoggedInUserCanEdit": false
                                        },
                                        {
                                            "level": 0,
                                            "category": "FOLDER",
                                            "permissionCode": "PERMISSION01",
                                            "sortOrder": 40,
                                            "permissionName": globalVariables.viewLicenseLbl,
                                            "isSet": false,
                                            "isInherited": false,
                                            "isLoggedInUserCanEdit": false
                                        },
                                        {
                                            "level": 1,
                                            "category": "FOLDER",
                                            "permissionCode": "PERMISSION02",
                                            "sortOrder": 50,
                                            "permissionName": globalVariables.manageFoldersLbl,
                                            "isSet": false,
                                            "isInherited": false,
                                            "isLoggedInUserCanEdit": false
                                        },
                                        {
                                            "level": 1,
                                            "category": "FOLDER",
                                            "permissionCode": "PERMISSION03",
                                            "sortOrder": 60,
                                            "permissionName": globalVariables.devideCombineLbl,
                                            "isSet": false,
                                            "isInherited": false,
                                            "isLoggedInUserCanEdit": false
                                        },
                                        {
                                            "level": 1,
                                            "category": "FOLDER",
                                            "permissionCode": "PERMISSION04",
                                            "sortOrder": 70,
                                            "permissionName": globalVariables.upgradeDowngradeLbl,
                                            "isSet": false,
                                            "isInherited": false,
                                            "isLoggedInUserCanEdit": false
                                        },
                                        {
                                            "level": 0,
                                            "category": "FOLDER",
                                            "permissionCode": "PERMISSION05",
                                            "sortOrder": 80,
                                            "permissionName": globalVariables.fileTechnicalLbl,
                                            "isSet": false,
                                            "isInherited": false,
                                            "isLoggedInUserCanEdit": false
                                        },
                                        {
                                            "level": 0,
                                            "category": "FOLDER",
                                            "permissionCode": "PERMISSION06",
                                            "sortOrder": 90,
                                            "permissionName": globalVariables.downloadProductsLbl,
                                            "isSet": true,
                                            "isInherited": false,
                                            "isLoggedInUserCanEdit": false
                                        }
                                    ],
                                    "isFolderAdmin": false,
                                    "manageRolesPermission": false
                                }
                            };


                            $scope.editPermCopy = {};                    

                            angular.forEach($scope.getFolderPermissions.permissionPaneContents, function(val, key){
                                val.checked = false;
                                val.disabled = false;
                            });

                            angular.copy($scope.getFolderPermissions, $scope.editPermCopy);

                            $scope.addPermTooltips();                            
                            
                            $scope.hideAdmin = true;
                            for( var i=0; i<$scope.modalData.folders.length; i++ ){
                              if( $scope.modalData.folders[i]['folderLevel'] === 2 ){
                                $scope.hideAdmin = false;
                              }
                            }

                    }                   

                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.ajaxLoader = false;
                    $scope.getPermissionErrorMsg = globalVariables.emptyDataMessage;
                });
            }

            $scope.addPermTooltips = function(){
                $timeout(function(){
                      $element.find('.requestPermissionsWrap').find('span.icon_lock_grey')
                            .addClass('vmf-tooltip')
                            .attr('data-toggle','tooltip')
                            .tooltip({container:'body', placement:'right'});

                }, 500);
            }

            // Start - Share foler tree functionalities 

            $scope.popUpFolderRoot = {
                'value': '1',
                'text': 'License Folders',
                'showHeader' : false,
                'disabled': false,
                'showFolderOptions' : false,
                'instanceId' : 'shareFolderFT',
                'checked': true
            };

            $scope.getFolderTree = function(folderInst){

                $scope.ftAjaxLoader = true;
                $scope.ftErrorMsg = '';
                $scope.emptyTree = false;

                $scope.getFolderUrl = globalVariables.folderTreeGetUrl;

                //var params = { 'EA_NUMBER_SELECTED_BY_USER' : folderDetails.eaAccount};

                //var paramsEncoded = $.param(params);

                if(folderInst == 'shareFolderFT'){

                       var params = { 
                                        'selectedUserCustomerNumber':'order',
                                        'folderView':'addUserToFolder'
                                    };

                       var paramsEncoded = $.param(params);

                } else {

                        var paramsEncoded = '';
                }

                $http({
                    method: 'POST',
                    url: $scope.getFolderUrl,
                    data: paramsEncoded,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).
                success(function(data, status, headers, config) {        

                        if(data.error == true){
                            $scope.ftErrorMsg = data.message;
                        } else if(data == null || data == '' || data == undefined ){
                             $scope.ftErrorMsg = globalVariables.emptyDataMessage;
                        } else {

                            $scope.emptyTree = data.emptyTree;
                            $scope.folderContent = data.folderContents;
                            $scope.currEaAccount = data.eaNumber;

                        }  

                        $scope.ftAjaxLoader = false;            

                    //if(eaAccountChanged == true)
                        $scope.publish('folderTreeChange', {folderData : data.folderContents, instanceId : folderInst});
                }).
                error(function(data, status, headers, config) {
                    $scope.ftAjaxLoader = false;
                    $scope.ftErrorMsg = globalVariables.commonAjaxErrorMessage;
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }  

            //$scope.folderContent =             

            $scope.selectedUsersData = [];
            $scope.folderContent = [];
            $scope.getFolderPermissions = [];
            $scope.getSelectedFolders = [];

            $scope.subscribe('getUserDetails', function(){
                $scope.getUserDetails();
            });

            $scope.resetSteps = function(){
                $scope.shareFolderStepOne = false;
                $scope.shareFolderStepTwo = false;
                $scope.shareFolderStepThree = false;
                $scope.shareFolderStepFour = false;
                $scope.selectPermWarning = false;
            }

            $scope.resetSteps(); // Initialize Steps
            $scope.shareFolderStepOne = true;
            $scope.hideAdmin = true;

            $scope.shareFoldersStep1 = function(){
                $scope.resetSteps();
                $scope.shareFolderStepOne = true;
            }

            $scope.shareFoldersStep4 = function(page){

                $scope.resetSteps();
                $scope.shareFolderStepFour = true;
                $scope.userAddedData = {};


                $scope.ajaxLoader = true;
                $scope.shareFolderErrorMsg = '';

                // post parameters on production { EA_NUMBER_SELECTED_BY_USER : folderDetails.eaAccount}

                var emailList = [];
                var fNameList = [];
                var lNameList = [];
                var dataStoreForCompare = [];

                if(page == 'invite'){

                    // If invite Users                    

                    angular.copy($scope.inviteUserArr,dataStoreForCompare);

                    angular.forEach($scope.inviteUserArr, function(val, key){
                        emailList[key] = val.email;
                        fNameList[key] = val.fName;
                        lNameList[key] = val.lName;
                    });

                    var params = {
                        "emailList" : emailList.join(','),
                        "firstNameList" : fNameList.join(','),
                        "lastNameList" : lNameList.join(',')
                    }

                }

                // If Share Users

                if(page == 'share'){ 

                    angular.copy($scope.getUsersData,dataStoreForCompare);

                    angular.forEach($scope.getUsersData, function(val, key){
                        if(val.checked == true){
                            emailList[key] = val.email;
                            fNameList[key] = val.firstName;
                            lNameList[key] = val.lastName;
                        }
                    });

                    var params = {
                        "emailList" : emailList.join(','),
                        "firstNameList" : fNameList.join(','),
                        "lastNameList" : lNameList.join(',')
                    }

                }

                var postDataEncoded = $.param(params);

                $http({
                        method: 'POST',
                        url: globalVariables.processUserList,
                        data: postDataEncoded,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).
                success(function(data, status, headers, config) { 
                        
                    if(data.error == true){
                        $scope.shareFolderErrorMsg = data.message;
                    } else if(data == '' || data == null || data == undefined){
                        $scope.shareFolderErrorMsg = globalVariables.emptyDataMessage;
                    } else {
                        $scope.userAddedData = data;


                        angular.forEach($scope.userAddedData.invitedUserList, function(val,key){
                            angular.forEach(dataStoreForCompare, function(valUser,keyUser){
                                if(valUser.email == val.email){
                                    if(page == 'invite'){
                                        val.firstName = valUser.fName;
                                        val.lastName = valUser.lName;
                                    } else {
                                        val.firstName = valUser.firstName;
                                        val.lastName = valUser.lastName;
                                    }
                                }                                    
                            });
                        });

                    }

                    $scope.ajaxLoader = false;
                    if($scope.modalData.operationScope.id == 'shareFolderInner' || $scope.modalData.operationScope.id == 'shareFolderMain'){
                        if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : share-folder-confirmation");
                    } else {
                        if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : invite-user-confirmation");
                    }
                    
                }).
                error(function(data, status, headers, config) {
                    $scope.ajaxLoader = false;
                    $scope.shareFolderErrorMsg = globalVariables.commonAjaxErrorMessage;
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
                
                

            }

            $scope.isSelectedFldrChkd = function(){
                return $('.productsContainerBody .foldertreeUl input[type="checkbox"]:checked').length >= 1;
            }

            $scope.shareFoldersStep3 = function(fromStep2){

                if($scope.isSelectedFldrChkd() || $scope.inviteShareInit == true){

                    $element.find('.infoIcon').popover({ 
                      trigger: "manual", 
                      html: true,
                      animation:false,
                      content: function(){
                        $scope.admin_tooltipedited = $scope.globalVars.administratorRoleTooltip
                         $scope.admin_tooltipedited = $scope.admin_tooltipedited.replace("<a","<a href='http://kb.vmware.com/kb/2035526?plainview=true' target='_blank'");
                         return  $scope.admin_tooltipedited;
                      }
                    }).on("mouseenter", function () {
                            var _this = this;
                            $(this).popover("show");
                            $(".popover").on("mouseleave", function () {
                                $(_this).popover('hide');
                            });
                        }).on("mouseleave", function () {
                            var _this = this;
                            setTimeout(function () {
                                if (!$(".popover:hover").length) {
                                    $(_this).popover("hide");
                                }
                            }, 300);
                    });
                        
                    $scope.resetSteps();
                    $scope.shareFolderStepThree = true;
                    $scope.getSelectedFolderDetails();                

                    $scope.getPermissions();
                    if($scope.modalData.operationScope.id == 'shareFolderInner' || $scope.modalData.operationScope.id == 'shareFolderMain'){
                        if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : share-folder-select-permissions");
                    } else {
                        if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : invite-user-select-permissions");
                    }
                }
            }

            $scope.permissionChange = function(obj){

                $timeout(function(){
                    if(obj.permissionCode == 'PERMISSION07' && obj.checked == true){
                        $scope.resetSteps();
                        $scope.selectPermWarning = true;
                    }

                    if(obj.checked == true){
                        if(obj.permissionCode == 'PERMISSION02' || obj.permissionCode == 'PERMISSION03' || obj.permissionCode == 'PERMISSION04'){
                            angular.forEach($scope.getFolderPermissions, function(val, key){
                                if(val.permissionCode == 'PERMISSION01'){
                                    val.checked = true;
                                }
                            });
                        }
                    }

                    if(obj.permissionCode == 'PERMISSION01'){
                        angular.forEach($scope.getFolderPermissions, function(val, key){
                            if(val.permissionCode == 'PERMISSION02' || val.permissionCode == 'PERMISSION03' || val.permissionCode == 'PERMISSION04'){
                                if(val.checked == true){
                                    obj.checked = true;
                                }                                 
                            }
                        });
                    }
                    
                });              
            }



            $scope.permissionChangeEdit = function(obj){

                $timeout(function(){
                    if(obj.permissionCode == 'PERMISSION07' && obj.checked == true){
                        $scope.resetEditPermissions();
                        $scope.selectPermWarningEdit = true;
                    }

                    if(obj.checked == true){
                        if(obj.permissionCode == 'PERMISSION02' || obj.permissionCode == 'PERMISSION03' || obj.permissionCode == 'PERMISSION04'){
                            angular.forEach($scope.getFolderPermissions, function(val, key){
                                if(val.permissionCode == 'PERMISSION01'){
                                    val.checked = true;
                                }
                            });
                        }
                    }

                    if(obj.permissionCode == 'PERMISSION01'){
                        angular.forEach($scope.getFolderPermissions, function(val, key){
                            if(val.permissionCode == 'PERMISSION02' || val.permissionCode == 'PERMISSION03' || val.permissionCode == 'PERMISSION04'){
                                if(val.checked == true){
                                    obj.checked = true;
                                }                                 
                            }
                        });
                    }
                    
                }); 

                $timeout(function(){
                    $scope.checkEditPermInputChange();
                },500);    

            }

            $scope.permissionChangeOk = function(){
                 $scope.resetSteps();
                 $scope.resetEditPermissions();
                 $scope.shareFolderStepThree = true;
                 $scope.editPermissionStep1 = true;
            }

            $scope.confirmFolderShare = function(){

                $scope.shareFolderErrorMsg = '';
                $scope.ajaxLoader = true;

                var foldersListCSV = [];
                var selectedPermsCSV = [];

                angular.forEach($scope.getSelectedFolders, function(val, key){
                    if(val.folderId!=""){
                        foldersListCSV.push(val.folderId);
                    }
                });

                 angular.forEach($scope.getFolderPermissions, function(val, key){
                    if(val.checked == true)
                        selectedPermsCSV.push(val.permissionCode);
                });

                 if($scope.localObj.adminCheck == true){
                        selectedPermsCSV.push('ADMIN_PERM');
                 }

                var params = {
                        "totselectedUsersFolderIds" : foldersListCSV.join(','),
                        "SelectedPermissions" : selectedPermsCSV.join(',')
                }

                var postDataEncoded = $.param(params);

                $http({
                    method: 'POST',
                    url: globalVariables.addUsersInEAToFolders,
                    data: postDataEncoded,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status, headers, config) {   

                        if(data.error == true){
                            $scope.shareFolderErrorMsg = data.message;
                        } else {                              
                            $scope.closeModal(); 
                        }       

                        $scope.ajaxLoader = false;            

                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.ajaxLoader = false;
                        $scope.shareFolderErrorMsg = globalVariables.permsNotAvailableError;
                });                
            }

            $scope.getSelectedFolderDetails = function(){                

                $scope.getSelectedFolders = [];
                $scope.sltFolderLevels = [];

                if($scope.enteredStep2 == true){

                    angular.forEach(
                        angular.element('.productsContainerBody input[type=checkbox]:checked'),
                        function(val,key){

                            var elem = angular.element(val).parents('li:eq(0)');
                            var getJson = {
                                                'folderId' : elem.attr('id'),
                                                'folderName' : elem.attr('ftName'),
                                                'folderLevel' : elem.attr('ftLevel'),
                                                'fullFolderPath' : elem.attr('ftPath')

                                          };
                            $scope.getSelectedFolders.push(getJson);
                            $scope.sltFolderLevels.push( parseInt(getJson.folderLevel) );
                        }
                    );    

                } else {
                    $scope.getSelectedFolders.push($scope.currSelectedFolderInviteShare);
                    $scope.sltFolderLevels.push( parseInt($scope.currSelectedFolderInviteShare["folderLevel"]) );
                }             
                
            }


            $scope.changeAdminFn = function(){
            
                $timeout(function(){
                
                     if( $scope.localObj.adminCheck ){

                    angular.forEach($scope.getFolderPermissions, function(val,key){
                      if(val.permissionCode !== "PERMISSION06" && val.permissionCode !== "PERMISSION07"){ // neither 6 nor 7
                           val.checked = true;
                           val.disabled = true;
                      }
                    });

                  }else{

                    angular.forEach($scope.getFolderPermissions, function(val,key){
                      if(val.permissionCode !== "PERMISSION06" && val.permissionCode !== "PERMISSION07"){ // neither 6 nor 7
                           val.checked = false;
                           val.disabled = false;
                      }
                    });
                  }
                  
                }, 300);           
              
            }

            function renderRequestPermissionsStep1(){
              $scope.ajaxLoader = false;
              $scope.editPermCopy = {};

              angular.forEach($scope.getFolderPermissions.permissionPaneContents, function(val, key){
                if(val.isLoggedInUserCanEdit && val.isSet){
                    val.checked = true;                  
                 } else {
                    val.checked = false;
                 }
                 val.disabled = false;
              });

              angular.copy($scope.getFolderPermissions, $scope.editPermCopy);

              $scope.addPermTooltips();                            
              
              $scope.hideAdmin = true;
              for( var i=0; i<$scope.modalData.folders.length; i++ ){
                if( $scope.modalData.folders[i]['folderLevel'] === 2 ){
                  $scope.hideAdmin = false;
                }
              }
            }


           $scope.changeAdminFnEdit = function(){                
                $timeout(function(){

                    // if admincheckbox is checked
                    if( $scope.localObj.adminCheckPerm ){
                      //except permission07, check all checboxes and disabled them
                      angular.forEach($scope.getFolderPermissions.permissionPaneContents,function(val,key){
                        if(val.permissionCode !== "PERMISSION06" && val.permissionCode !== "PERMISSION07"){
                           val.checked = true;
                           val.disabled = true;
                        }
                      });
                    }else{ // else (admincheckbox is unchecked)
                      // if NOT isFolderAdmin
                      if( !$scope.getFolderPermissions.isFolderAdmin ){
                        //re-render the entire permission step
                        renderRequestPermissionsStep1();
                      }else{// if isFolderAdmin
                        //show error message - requestRemoveAdminMsg

                        //except permission07 - uncheck all checkboxes and enable
                        angular.forEach($scope.getFolderPermissions.permissionPaneContents, function(val,key){
                          if(val.permissionCode !== "PERMISSION06" && val.permissionCode !== "PERMISSION07"){
                            val.checked = false;
                            val.disabled = false;
                            
                          }
                        });
                      }
                    }

                    $timeout(function(){
                        $scope.checkEditPermInputChange();
                    },500);

                }, 200);
            }

            $scope.checkEditPermInputChange = function(){

                $scope.permEditDataChanged = false;

                 angular.forEach($scope.getFolderPermissions.permissionPaneContents,function(val,key){
                    angular.forEach($scope.editPermCopy.permissionPaneContents,function(valCopy,keyCopy){
                        if(val.permissionCode == valCopy.permissionCode){
                            if(val.checked !== undefined){
                                if(val.checked !== valCopy.checked){
                                    $scope.permEditDataChanged = true;
                                    return;
                                }
                            }
                        }
                    })
                 });

            }

            $scope.setPermissionLayout = function(){ // inviteuser + share folder - permissions related
                $scope.localObj.adminCheck = false; // dummy
                
                if($scope.sltFolderLevels.indexOf(2) === -1){
                    $scope.hideAdmin = true;
                } else {
                    $scope.hideAdmin = false;
                }
                
                var isOnlyLevel3 = true;
                if( $scope.sltFolderLevels.indexOf(1) !== -1 || $scope.sltFolderLevels.indexOf(2) !== -1 ){
                  isOnlyLevel3 = false;
                }
                
                angular.forEach($scope.getFolderPermissions, function(val,key){
                    val.checked = false;
                    if( isOnlyLevel3 && (val.permission === "PERMISSION09" || val.permission === "PERMISSION08" || val.permission === "PERMISSION07") ){
                        val.disabled = true;
                    }
                    if( val.permission === "PERMISSION06" ){
                        val.disabled = true;
                        val.checked = true;
                    }
                })

                

                $timeout(function(){
                    $element.find('.selectPermissionsDatatable').find('span.icon_lock_grey')
                            .addClass('vmf-tooltip')
                            .attr('data-toggle','tooltip')
                            .tooltip({container:'body', placement:'right'});
                },500);                

            }




            $scope.getPermissions= function(){

                $scope.shareFolderErrorMsg = '';
                $scope.ajaxLoader = true;
                $scope.hideAdmin = true;

                $http({
                        method: 'POST',
                        url: globalVariables.getPermissionsUrl,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).
                    success(function(data, status, headers, config) {                       

                        if(data.error == true) {

                            $scope.shareFolderErrorMsg = data.message;

                        } else if(data == null || data == undefined || data == ''){

                            $scope.shareFolderErrorMsg = globalVariables.emptyDataMessage;

                        } else {
                            $scope.getFolderPermissions = data;                            

                            angular.forEach($scope.getFolderPermissions,function(val,key){
                                if(val.permission == "PERMISSION06"){
                                    val.checked = true;
                                    val.disabled = true; 
                                } else {
                                    val.checked = false;
                                    val.disabled = false;
                                }
                            });

                            $scope.setPermissionLayout();
                        }             

                        $scope.ajaxLoader = false;
                        
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.ajaxLoader = false;
                        $scope.shareFolderErrorMsg = globalVariables.permsNotAvailableError;
                });
            }

            // Share / Invite step 2           

            $scope.shareFoldersStep2 = function(fromStep){
                $scope.resetSteps();
                $scope.shareFolderStepTwo = true;
                $scope.folderSelFlag = false;                

                $scope.enteredStep2 = true;

                if($scope.inviteShareInit == undefined)
                    $scope.inviteShareInit = true; // To initialize stuff only once. 

                if($scope.folderContent.length == 0){
                    $scope.getFolderTree('shareFolderFT');                    
                }


                var getCurrElem;

                if($scope.modalData.operationScope.id == 'shareFolderInner' || $scope.modalData.operationScope.id == 'shareFolderMain'){
                    getCurrElem = angular.element('#shareFolderFt');
                } else if ($scope.modalData.operationScope.id == 'inviteNewUserInner' || $scope.modalData.operationScope.id == 'inviteNewUserMain'){
                    getCurrElem = angular.element('#inviteUserFt');
                }

                if($scope.modalData.operationScope.id == 'inviteNewUserMain' || 
                   $scope.modalData.operationScope.id == 'shareFolderMain'){
                   $scope.inviteShareInit = false;
                }

                if($scope.modalData.operationScope.id == 'shareFolderInner' || $scope.modalData.operationScope.id == 'shareFolderMain'){
                    if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : share-folder-select-folders");
                } else {
                    if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : invite-user-select-folders");
                }

                if(getCurrElem.find('input[type="checkbox"]:checked').length >= 1){
                    $scope.folderSelFlag = true;
                }
                
            }

            $scope.subscribe('folderTreeChange', function(){
              $timeout(function(){
                var getCurrElem;

                if($scope.modalData.operationScope.id == 'shareFolderInner' || $scope.modalData.operationScope.id == 'shareFolderMain'){
                    getCurrElem = angular.element('#shareFolderFt');
                } else if ($scope.modalData.operationScope.id == 'inviteNewUserInner' || $scope.modalData.operationScope.id == 'inviteNewUserMain'){
                    getCurrElem = angular.element('#inviteUserFt');
                }

                if($scope.inviteShareInit == true){
                    getCurrElem.find('#'+$scope.modalData.folders[0]['folderId']).find('input[type=checkbox]').prop('checked',true);

                    $scope.folderSelFlag = true;
                    $scope.inviteShareInit = false;
                }

                getCurrElem.on('change', 'input[type="checkbox"]', function(){
                    if($(this).parents('.foldertreeUl').find('input[type="checkbox"]:checked').length >=1){
                        $scope.$apply(function(){
                          $scope.folderSelFlag = true;
                        });
                    } else {
                        $scope.$apply(function(){
                          $scope.folderSelFlag = false;
                        });
                    }
                    inviteMultipleFoldersChanged = true;
                });
                
              }, 500);
            });
            
            var inviteMultipleFoldersChanged = false; // initlializing this variable as false on popupload; will be updated if any folderselection made in step2

            $scope.inviteUserStep1Continue = function(){

                var getSelectedFolderLength;

                if( inviteMultipleFoldersChanged ){
                
                  $scope.shareFoldersStep2(); // show step2 for sure, when some changes werer there in foldertree
                
                }else{
                  getSelectedFolderLength = $('#inviteUserFt input[type="checkbox"]:checked').length;

                  if(($scope.inviteShareInit == true || getSelectedFolderLength >= 1) && $scope.modalData.operationScope.id == 'inviteNewUserInner'){
                    $scope.shareFoldersStep3();
                  }else{
                    $scope.shareFoldersStep2();
                  }
                }
            }


             $scope.inviteUserStep3Back = function(){

                 var getSelectedFolderLength = $('#inviteUserFt input[type="checkbox"]:checked').length;

                if(($scope.inviteShareInit == true || getSelectedFolderLength >= 1) && $scope.modalData.operationScope.id == 'inviteNewUserInner')
                    $scope.shareFoldersStep1(); 
                else 
                    $scope.shareFoldersStep2('step3');
            }

              $scope.shareFolderStep1Continue = function(){

                 var getSelectedFolderLength = $('#shareFolderFt input[type="checkbox"]:checked').length;

                if(($scope.inviteShareInit == true || getSelectedFolderLength >= 1) && $scope.modalData.operationScope.id == 'shareFolderInner')
                    $scope.shareFoldersStep3(); 
                else 
                    $scope.shareFoldersStep2();
            }


             $scope.shareFolderStep3Back = function(){

                 var getSelectedFolderLength = $('#shareFolderFt input[type="checkbox"]:checked').length;

                if(($scope.inviteShareInit == true || getSelectedFolderLength >= 1) && $scope.modalData.operationScope.id == 'shareFolderInner')
                    $scope.shareFoldersStep1(); 
                else 
                    $scope.shareFoldersStep2('step3');
            }


            $scope.getUserDetails = function(){

                $scope.shareFolderErrorMsg = '';
                $scope.ajaxLoader = true;

                $http({
                        method: 'POST',
                        url: globalVariables.getUsersUrl,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).
                    success(function(data, status, headers, config) {                       

                        if(data.error == true){

                            $scope.shareFolderErrorMsg = data.message;

                        } else if(data == null || data == undefined || data == ''){

                            $scope.shareFolderErrorMsg = globalVariables.emptyDataMessage;

                        } else {

                             $scope.getUsersData = data.userPaneContents;

                            angular.forEach($scope.getUsersData, function(value, key) {
                                  value.checked = false;
                                  value.selected = false;
                            });

                        }                    

                        $scope.ajaxLoader = false;
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.ajaxLoader = false;
                        $scope.shareFolderErrorMsg = globalVariables.commonAjaxErrorMessage;
                });

            }


            // Invite Users Loop

            $scope.localObj.txtEmail = '';
            $scope.localObj.txtFName = '';
            $scope.localObj.txtLName = '';
            $scope.localObj.filterTextInput = '';
            $scope.emailValid = true;
            $scope.inviteUserArr = [];
            $scope.dupEmailValid = true;

            $scope.InviteUsersAdd = function(){

                if($scope.localObj.txtEmail.length !== 0){
                    if( /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test($scope.localObj.txtEmail) ){
                        $scope.emailValid = true;                        
                    } else {
                        $scope.emailValid = false;
                    }
                }
                
                $scope.dupEmailValid = true;
            
                angular.forEach($scope.inviteUserArr,function(val, key){
                    if($scope.localObj.txtEmail == val.email){
                        $scope.dupEmailValid = false;
                        return false;
                    }
                }); 
                
                $timeout(function(){                
                    if($scope.dupEmailValid == true &&  $scope.emailValid == true){
                        $scope.addIviteUserToArr();
                    }                   
                },400);
                
            }

            $scope.addIviteUserToArr = function(){

                var inviteObj = { 
                                    fName : $scope.localObj.txtFName,
                                    lName : $scope.localObj.txtLName,
                                    email : $scope.localObj.txtEmail
                                }

                $scope.inviteUserArr.push(inviteObj);

                $scope.localObj.txtEmail = '';
                $scope.localObj.txtFName = '';
                $scope.localObj.txtLName = '';
            }

            $scope.removeInviteUser = function(getObj){
                var getIndex = $scope.inviteUserArr.indexOf(getObj);
                $scope.inviteUserArr.splice(getIndex, 1);    
            }

            $scope.AddUser = function(){
                angular.forEach($scope.getUsersData,function(val, key){
                    if(val.selected == true)
                        if(val.checked == false)
                            val.checked = true;

                    val.selected = false;
                });

                $scope.localObj.selectAll = false;
                $scope.checkUsersShare();
            }

            $scope.removeUser = function(){
                 angular.forEach($scope.getUsersData,function(val, key){
                    if(val.selected == true)
                        if(val.checked == true)
                            val.checked = false;

                    val.selected = false;
                });

                $scope.checkUsersShare();
            } 

            $scope.filterAllUsers = function(obj){
                return obj.checked == false;
            }

            $scope.shareFldrAddBtnDisabled = true;
            $scope.shareFldrRemoveBtnDisabled = true;

            $scope.checkUsersShare = function(){

                $timeout(function(){

                    var selectedCount = 0;
                    var checkedCount = 0;
                    var selectedAndChecked = 0;

                    angular.forEach($scope.getUsersData,function(val, key){

                        if(val.selected == true && val.checked == false){
                             selectedCount++;
                        }
                         if(val.checked == true){
                            checkedCount++;
                         }

                         if(val.checked == true && val.selected == true){
                            selectedAndChecked++;
                         }

                    });


                    if(selectedCount >= 1){
                        $scope.shareFldrAddBtnDisabled = false;
                    } else {
                        $scope.shareFldrAddBtnDisabled = true;
                    }

                    if(selectedAndChecked >= 1){
                        $scope.shareFldrRemoveBtnDisabled = false;
                    } else {
                        $scope.shareFldrRemoveBtnDisabled = true;
                    }



                },200);
                
            }

            $scope.filterSelectedUsers = function(obj){
                return obj.checked == true;
            }            

            $scope.filterUser = function(){
                $scope.localObj.filterText = $scope.localObj.filterTextInput;
            }
            $scope.keyPress = function(e){
        	if(e == 13){
					$scope.filterUser();
        	  }
           }

           
             $scope.checkSltAll = function(){
              //  $scope.localObj.selectAll = !$scope.localObj.selectAll;
                
                $scope.filteredResults = $filter('filter')($scope.getUsersData,$scope.localObj.filterText);             
                
                angular.forEach($scope.getUsersData,function(val, key){ 
                    angular.forEach($scope.filteredResults,function(valFiltered, keyFiltered){
                        if(valFiltered.email == val.email){
                            if($scope.localObj.selectAll == true && val.checked !== true){
                                val.selected = true;
                            } else {
                                val.selected = false;
                            }
                        }
                    }); 
                }); 
                $scope.checkUsersShare();
            }


            // End - Share foler tree functionalities 


            // Start - move folder tree functionalities

            $scope.subscribe('getFolderTreePaths',function(data){
                     $scope.getFolderPaths();
            });

             $scope.subscribe('getFolderTreePathsCreate',function(data){
                     $scope.getFolderPathsCreate();
            });

            // Find Folder Initialization Start

            $scope.changeRadio = function(selectedFldrObj){
               $scope.findFolderGetSltRadio = selectedFldrObj.fullFolderPath;
               $scope.selectedFolderObj = selectedFldrObj;

            }

            $scope.ftFindFolder = function(getFtInstanceId){

                var pubData = {
                                'folderObj' :  $scope.selectedFolderObj,
                                'ftInstanceId' : getFtInstanceId
                              }

                $scope.publish('findFolderEvt', pubData);
                $scope.closeModal();
            }

            $scope.findFolderSearch = function(){

                $scope.findFolderErrorMsg = '';
                $scope.ajaxLoader = true;
                $scope.txtFolderName = '';
                $scope.findFolderGetSltRadio;
                $scope.findFolderGetSltRadio = null;
                $scope.findFolderData = null;

                var postData = { 'folderName' : $scope.txtFindFolderSearch };

                var postDataEncoded = $.param(postData);

                $http({
                        method: 'POST',
                        url: globalVariables.findFolderSearchUrl,
                        data: postDataEncoded,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).
                    success(function(data, status, headers, config) {

                        if(data == '' || data === null || data === undefined){
                            $scope.findFolderErrorMsg = globalVariables.findFolderEmptyMessage;
                            if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : find-folder : no-results");
                        } else if(data.error === true){
                            $scope.findFolderErrorMsg = data.message;
                        } else if(data.findFolderWithPathList == null){
                            $scope.findFolderErrorMsg = globalVariables.findFolderEmptyMessage;
                            if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : find-folder : no-results");
                        }
                        else{
                            $scope.findFolderData = data.findFolderWithPathList;                            
                        }

                        $scope.ajaxLoader = false;
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.ajaxLoader = false;
                        $scope.findFolderErrorMsg = globalVariables.commonAjaxErrorMessage;
                });


            }

            // Find Folder Initialization End


            $scope.getFolderPathsCreate = function(){

                $scope.createFolderErrorMsg = '';
                $scope.ajaxLoader = true;
                $scope.txtFolderName = '';

                $scope.folderPathsUrl = globalVariables.folderPathsUrl;

                 $http({
                        method: 'POST',
                        url: $scope.folderPathsUrl,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).
                    success(function(data, status, headers, config) {
                            $scope.createfldrPathsData = data.folderPathList;

                            angular.forEach($scope.createfldrPathsData,function(val,key){
                                $scope.createfldrPathsData[key]["value"] = $scope.createfldrPathsData[key]["folderId"];
                                $scope.createfldrPathsData[key]["text"] = $scope.createfldrPathsData[key]["fullFolderPath"];
                            });

                            var preSelectIndex = "";
                            if($scope.modalData.folders.length >= 1){

                                angular.forEach($scope.createfldrPathsData,function(val,key){
                                    if(val.fullFolderPath == $scope.modalData.folders[0]['fullFolderPath']) {
                                        $scope.createfldrPathsOption = $scope.createfldrPathsData[key];
                                        preSelectIndex = key;
                                      }
                                });  

                            }                   
                            $element.find('.folderPathsDropdown').append( $compile('<div vmf-select-list dtitle="" list="createfldrPathsData" model="createfldrPathsOption" sortby="false" showtitle="true" pre-select-ind="' + preSelectIndex + '"></div>')($scope) );
                            $scope.ajaxLoader = false;
                        }).
                        error(function(data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            $scope.ajaxLoader = false;
                            $scope.createFolderErrorMsg = globalVariables.commonAjaxErrorMessage;
                     }); 
                    
                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : create-folder");
            }

            $scope.moveFolderParentId = '';            

            $scope.getFolderPaths = function(){

                $scope.moveFolderErrorMsg = '';
                $scope.moveFolderstep1 = true;
                $scope.moveFolderstep2 = false;
                $scope.ajaxLoader = true;
                $scope.folderPathsOption = null;
                $scope.folderPathsUrl = globalVariables.folderPathsUrl;

                var currId = $scope.modalData.folders[0]['folderId'];
                $scope.moveFolderParentId = $('#'+currId).parents('li:eq(0)').attr('id');

                 $http({
                        method: 'POST',
                        url: $scope.folderPathsUrl,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).
                        success(function(data, status, headers, config) {
                            $scope.folderPathsData = data.folderPathList;
                            $scope.finalFolderPathsData = [];
                            angular.forEach($scope.folderPathsData,function(val,key){
                                $scope.folderPathsData[key]["value"] = $scope.folderPathsData[key]["folderId"];
                                $scope.folderPathsData[key]["text"] = $scope.folderPathsData[key]["fullFolderPath"];
                                if($scope.folderPathsData[key].fullFolderPath !== $scope.modalData.folders[0]['fullFolderPath'] && $scope.folderPathsData[key].folderId !== $scope.moveFolderParentId && $scope.folderPathsData[key].fullFolderPath.indexOf($scope.modalData.folders[0]['fullFolderPath']) == -1) {
                                    $scope.finalFolderPathsData.push($scope.folderPathsData[key]);
                                }
                            });
                            $element.find('.folderPathsDropdown').append( $compile('<div vmf-select-list dtitle="" list="finalFolderPathsData" model="folderPathsOption" sortby="false" showtitle="true"></div>')($scope) );
                            $scope.ajaxLoader = false;
                        }).
                        error(function(data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            $scope.ajaxLoader = false;
                            $scope.moveFolderErrorMsg = globalVariables.commonAjaxErrorMessage;
                     });   

            }

            $scope.filterMoveFldrPaths = function(obj){
                if(obj.fullFolderPath !== $scope.modalData.folders[0]['fullFolderPath'] 
                    && obj.folderId !== $scope.moveFolderParentId
                    && obj.fullFolderPath.indexOf($scope.modalData.folders[0]['fullFolderPath']) == -1){

                    return true;

                } else {

                    return false;
                    
                }
            }

            $scope.moveFolderContinue = function(){
                $scope.moveFolderstep1 = false;
                $scope.moveFolderstep2 = true;
                angular.forEach($scope.finalFolderPathsData,function(val,key){
                    if($scope.finalFolderPathsData[key]["folderId"] === $scope.folderPathsOption) {
                        $scope.targetFullFolderPath = $scope.finalFolderPathsData[key]["fullFolderPath"];
                    }
                });
                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : move-folder : step-2");
            }

            $scope.moveFolderGoBack = function(){
                $scope.moveFolderstep1 = true;
                $scope.moveFolderstep2 = false;
                $scope.folderPathsOption = null;
                $scope.targetFullFolderPath = null;
            }

            $scope.createFolderConfirm = function(){  

                $scope.createFolderErrorMsg = '';
                $scope.createFolderConfirmUrl = globalVariables.createFolderConfirmUrl;
                $scope.ajaxLoader = true;

                // $scope.createFolderConfirmPostData = {
                //     'selectedFolderId' :  $scope.modalData.folders[0]['folderId'],
                //     'newFolderName' : $scope.txtFolderName
                // }

                $scope.createFolderConfirmPostData = {
                    'selectedFolderId' :  $scope.createfldrPathsOption,
                    'newFolderName' : $scope.txtFolderName
                }

                var postDataEncoded = $.param($scope.createFolderConfirmPostData);

                $http({
                        method: 'POST',
                        url: $scope.createFolderConfirmUrl,
                        data: postDataEncoded,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).
                    success(function(data, status, headers, config) {        

                        if(data !== null && data.error === true){
                            $scope.createFolderErrorMsg = $scope.moveFolderErrorMsg = angular.element('<span />').html(data.message).text().replace(/\\/gi, '');
                        } else {
                            $scope.publish('refreshFolderTree',{fromAction : 'moveFolder'}); 
                            $scope.closeModal(); 
                        }
                        $scope.ajaxLoader = false;
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.ajaxLoader = false;
                        $scope.createFolderErrorMsg = globalVariables.commonAjaxErrorMessage;
                 });          
 
            }

            $scope.renameFolderConfirm = function(){

                $scope.renameFolderErrorMsg = '';
                $scope.renameFolderConfirmUrl = globalVariables.renameFolderConfirmUrl;
                $scope.ajaxLoader = true;

                var renameFolderConfirmPostData = {
                    'selectedFolderId' :  $scope.modalData.folders[0]['folderId'],
                    'newFolderName' : $scope.renameTxtFolderName
                }

                var postDataEncoded = $.param(renameFolderConfirmPostData);

                $http({
                        method: 'POST',
                        url: $scope.renameFolderConfirmUrl,
                        data: postDataEncoded,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).
                    success(function(data, status, headers, config) {        

                        if(data !== null && data.error === true){
                            $scope.renameFolderErrorMsg = angular.element('<span />').html(data.message).text().replace(/\\/gi, '');
                        } else {
                            $scope.publish('refreshFolderTree',{fromAction : 'moveFolder'}); 
                            $scope.closeModal(); 
                        }
                        $scope.ajaxLoader = false;
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.ajaxLoader = false;
                        $scope.renameFolderErrorMsg = globalVariables.commonAjaxErrorMessage;
                 });    

            }

            $scope.moveFolderConfirm = function(){

                $scope.moveFolderErrorMsg = '';
                $scope.moveFolderConfirmUrl = globalVariables.moveFolderConfirmUrl;
                $scope.ajaxLoader = true;

                var moveFolderConfirmPostData = {

                    'selectedFolderId' :  $scope.modalData.folders[0]['folderId'],
                    'targetFullFolderPath' : $scope.targetFullFolderPath

                }

                var postDataEncoded = $.param(moveFolderConfirmPostData);

                $http({
                        method: 'POST',
                        url: $scope.moveFolderConfirmUrl,
                        data: postDataEncoded,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).
                    success(function(data, status, headers, config) {        

                        if(data !== null && data.error === true){
                            $scope.moveFolderErrorMsg = $scope.moveFolderErrorMsg = angular.element('<span />').html(data.message).text().replace(/\\/gi, '');
                        } else {
                            $scope.publish('refreshFolderTree',{fromAction : 'moveFolder'}); 
                            $scope.closeModal(); 
                        }
                        $scope.ajaxLoader = false;
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.ajaxLoader = false;
                        $scope.moveFolderErrorMsg = globalVariables.commonAjaxErrorMessage;
                 });          
 
            }

            // End - Move folder tree functionalities

            $scope.DeleteFolderConfirm = function() {

                $scope.deleteFolderErrorMsg = '';
                $scope.deleteFolderUrl = globalVariables.deleteFolderUrl+ '&selectedFolderId=' + $scope.modalData.folders[0]['folderId'];
                $scope.ajaxLoader = true;

                $http({
                        method: 'POST',
                        url: $scope.deleteFolderUrl,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).
                    success(function(data, status, headers, config) {        

                        if(data !== null && data.error === true){
                            $scope.deleteFolderErrorMsg = data.message;
                        } else {
                            $scope.publish('refreshFolderTree',{fromAction : 'deleteFolder'}); 
                            $scope.closeModal(); 
                        }
                        $scope.ajaxLoader = false;
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.ajaxLoader = false;
                        $scope.deleteFolderErrorMsg = globalVariables.commonAjaxErrorMessage;
                });                   
            };

            $scope.closeModal = function(){
                 //  Manually hide the modal.
                $element.modal('hide');
                close(null, 500);
            }

    }
]);

folderTreeApp.directive("vmfFolderOptions", ['$compile', '$timeout', '$document', '$rootScope', "ModalService",  "$http", "globalData",
    function($compile, $timeout, $document, $rootScope, ModalService, $http, globalData) {
        return {
            restrict: "A",
            scope: {
                thisTree: "=",
                folderLevelOptions: "=folderOptions",
                completeFolderStack: "=",
                folderDataFtype: "="
            },
            require: '?vmfFolderTree',
            link: function(scope, lElement, lAttrs, TreeCtrl) {

                scope.getTableType = globalData.tableType;
                scope.globalVars = globalVariables;
                //console.log("parentIndex" + scope.parentIndex);
                //TreeCtrl.testFn(lElement);

                scope.folderLevelOptions = [{
                        "text": scope.globalVars.folderOps.invite,
                        "disabledClass": "enabled",
                        "id" : "inviteNewUserInner"
                    }, {
                        "text": scope.globalVars.folderOps.share,
                        "disabledClass": "enabled",
                        "id" : "shareFolderInner"
                    }, {
                        "text": scope.globalVars.folderOps.create,
                        "disabledClass": "enabled",
                        "id" : "createFolderInner"
                    }, {
                        "text": scope.globalVars.folderOps.del,
                        "disabledClass": "enabled",
                        "id" : "deleteFolderInner"
                    }, {
                        "text": scope.globalVars.folderOps.rename,
                        "disabledClass": "enabled",
                        "id" : "renameFolderInner"
                    }, {
                        "text": scope.globalVars.folderOps.move,
                        "disabledClass": "enabled",
                        "id" : "moveFolderInner"
                    }, {
                        "text": scope.globalVars.folderOps.request,
                        "disabledClass": "enabled",
                        "id" : "requestPermissionInner"
                    }, {
                        "text": scope.globalVars.folderOps.exportCsv,
                        "disabledClass": "disabled",
                        "id" : "exportToCsvInner"
                    }];

                scope.dropDownString = '<span class="actionEach" ng-click="showOptions($event,folderDataFtype)">&nbsp;</span>';
                scope.dropDownOptionsString = '<div class="actionEachBox">' +
                    '<div class="midWrapper">' +
                    '<div class="innerWrapper">' +
                    '<ul>' +
                    '<li ng-repeat="option in folderLevelOptions" ng-class="{first:$first,last:$last}" ng-click="optionsAction($event,this)">' +
                    '<a class="{{option.disabledClass}} {{option.id}}" href="javascript:void(0);">{{option.text}}</a>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                lElement.on("mouseenter", function(event) {
                    if($(this).hasClass("disabled")){
                        $(this).css("cursor","default");
                    }

                    if (!lElement.find(".actionEach").length) {
                        lElement.append($compile(scope.dropDownString)(scope));
                        lElement.addClass("highlight");
                        lElement.addClass("highlightActive");
                    }else{
                      lElement.find(".actionEach").removeClass('hidden');
                    }

                    if (!angular.element(".actionEachBox").length) {
                        //lElement.append($compile(scope.dropDownOptionsString)(scope));
                        $(document.body).append($compile(scope.dropDownOptionsString)(scope)); /* adding options-menu to the body- to come out of folder tree box */
                        lElement.addClass("highlight");
                        lElement.addClass("highlightActive");
                    }

                    lElement.not(".disabled").addClass("highlightActive");
                });

                lElement.on("mouseleave", function(event) { /*suryapavan*/

                    //checked folder's options should be removed
                    if (lElement.find(".folderSelector").hasClass("selected") || lElement.hasClass("nonCheckBox") || angular.element(".actionEachBox").hasClass("folderSelected")) {
                        lElement.addClass("highlight");
                        lElement.find(".actionEach").remove();
                    } else if ( !lElement.closest('li').hasClass("menuOpen") ) {
                        lElement.find(".actionEach").remove();
                        lElement.removeClass("highlight");
                    } else if (angular.element(".actionEachBox").hasClass("rightClicked")) {
                        lElement.find(".actionEach").remove();
                    }

                    lElement.removeClass("highlightActive");
                });

                lElement.on("mousedown", function(event) {
                    event.stopPropagation();
                    //scope.thisTree.find(".actionAllBox").removeClass("optionsOpen");
                    
                    //scope.selectedFolderLi = $(event.target).closest('li');
                    angular.element(".actionEachBox").data('folder-id', $(event.target).closest('li').attr('id'));

                    scope.rightClickFlag = false;
                    if (event.which === 3) {

                        $(document).off("contextmenu").on("contextmenu", lElement, function() {
                            event.stopPropagation();
                            return false;
                        });

                        scope.rightClickFlag = true;
                        scope.rightClickXPos = event.pageX;
                        scope.rightClickYPos = event.pageY;

                        lElement.find(".actionEach").trigger('click').addClass('hidden');
                    }

                });

                scope.showOptions = function(getEvent, getFType){
                    
                    // while opening folder-actions-dropdown, close all other dropdowns and close filters dropdown
                    scope.publish('closeAllDropdowns', getEvent);
                    scope.publish('closeAllFilters');

                    getEvent.stopPropagation();

                    var getPermValFromDom = $(lElement).parent().attr('ftPerm');
                    var getElemPath = $(lElement).parent().attr('ftPath');

                    // closing the existing optionsmenu, before opening/sending-api-call to the new options
                    angular.element(".actionEachBox").removeAttr('style').addClass('hidden');

                    if(!getPermValFromDom){

                        var getFolderId = $(lElement).parent().attr('id');

                        var params = { 
                           'selectedFolderId' : getFolderId
                        };

                        var paramsEncoded = $.param(params);
                
                        $http({
                            method: 'POST',
                            url: globalVariables.getFolderMinPermUrl,
                            data: paramsEncoded,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).
                        success(function(data, status, headers, config) { 
                            var  accessPerms = ''; 

                            if (data.manage) {
                                accessPerms = "MANAGE";
                            } else if (data.view) {
                                accessPerms = "VIEW";
                            } else if (!(data.view)) {
                                accessPerms = "NONE";
                            }

                            $(lElement).parent().attr('ftPerm',accessPerms);
                            scope.publish('FolderPermissionsSet',data);
                            globalData.permissionObject[getElemPath] = data;

                            scope.showOptionsRender(getEvent , getFType , accessPerms);   

                        }).
                        error(function(data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });

                    } else {
                        scope.showOptionsRender(getEvent , getFType , getPermValFromDom);
                    }

                }

                scope.showOptionsRender = function(event, fType, permVal) {

                    var $actionEachBox = angular.element(".actionEachBox"),
                        $targetEl = $(event.target);

                    // remove actionEach for all other rows
                    scope.thisTree.find(".actionEach").not(event.target).remove();

                    // remove hightlight class for all other rows
                    /* TODO ... */

                    // remove menuOpen for all other LIs
                    scope.thisTree.find("li.menuOpen").removeClass('menuOpen').not(".selected").find(".highlight").removeClass("highlight");

                    // actionEachBox - add-optionsopen
                    $actionEachBox.addClass("optionsOpen flagClass");

                    // add menuOpen for current LI
                    $targetEl.closest('li').addClass('menuOpen');

                    /* permissions related stuff - START */
                    $timeout(function(){
                      if(permVal == 'MANAGE'){
                  
                        if(fType == 'ROOT'){                        
                            $actionEachBox.find('a').removeClass('enabled').addClass('disabled');
                        
                            if(globalData.tableType == "viewLicense"){
                                $actionEachBox.find('.createFolderInner , .exportToCsvInner').removeClass('disabled').addClass('enabled');
                            } else {
                                $actionEachBox.find('.createFolderInner , .exportToCsvInner').removeClass('enabled').addClass('disabled');
                            }
                            
                        } else if (fType == "ASP" || fType == "CPL" || fType == "VCE") {
                            
                            $actionEachBox.find('a').removeClass('enabled').addClass('disabled');
                            
                            $actionEachBox.find('.renameFolderInner , .inviteNewUserInner, .shareFolderInner').removeClass('disabled').addClass('enabled');
                            
                            if(globalData.tableType == "viewLicense"){
                                $actionEachBox.find('.exportToCsvInner').removeClass('disabled').addClass('enabled');
                            } else {
                                $actionEachBox.find('.exportToCsvInner').removeClass('enabled').addClass('disabled');
                            }
                            
                        } else {
                        
                            $actionEachBox.find('a').removeClass('disabled').addClass('enabled');
                            
                            if(globalData.tableType == "viewLicense"){
                                $actionEachBox.find('.exportToCsvInner').removeClass('disabled').addClass('enabled');
                            } else {
                                $actionEachBox.find('.exportToCsvInner').removeClass('enabled').addClass('disabled');
                            }
                            
                        }
                        
                        $actionEachBox.find('.inviteNewUserInner, .shareFolderInner').removeClass('disabled').addClass('enabled');
                  
                      } else {
                          $actionEachBox.find('a').removeClass('enabled').addClass('disabled');
                      }

                      if(globalData.tableType == "viewLicense"){
                          $actionEachBox.find('.exportToCsvInner').removeClass('disabled').addClass('enabled');
                      }

                      $actionEachBox.find('.requestPermissionInner').removeClass('disabled').addClass('enabled');
                    }, 10)
                    /* permissions related stuff - END */

                    var position = {};

                    // get top/left positions - based on the $targetEl's position

                    var tempflag = false; // temp flag to make element available before we take the positions
                    if( $targetEl.hasClass('hidden') ){
                      $targetEl.removeClass('hidden');
                      tempflag = true;
                    }
                    position = {
                      top: $targetEl.offset().top + $targetEl.height() - 7,
                      left: $targetEl.offset().left + $targetEl.outerWidth() - $actionEachBox.outerWidth(true) + 12
                    };

                    if( tempflag ){
                      $targetEl.addClass('hidden');
                    }

                    /*check the condition to verify if the context menu will fit downwards - ottherwise, show it upwards*/

                    // get contextMenu height
                    var cmenuHeight = $actionEachBox.outerHeight();

                    // topPosition = position.top
                    var getTopPos = position.top;

                    // get windowHeight
                    var winHeight = $(window).height();

                    // get element's offset - top 
                    var getInvTopPos = $targetEl.offset().top;

                    var rtClickedClass = ""; // variable that holds the class to be given for actionEachBox - which specifies whether it is opened via rt-click or normal-click

                    if(scope.rightClickFlag == true){
                      rtClickedClass = "rightClicked";
                      position = {
                          top: scope.rightClickYPos,
                          left: scope.rightClickXPos
                      };
                        getInvTopPos = false; // this variable to be used only in normal click; hence updating with false
                    }

                    if (getTopPos + cmenuHeight > winHeight + $(window).scrollTop() > 0) {
                        position.top = (getInvTopPos)? (getInvTopPos - cmenuHeight) : (getTopPos - cmenuHeight);
                    }

                    $actionEachBox.css(position).addClass(rtClickedClass).removeClass('hidden');
                    event.stopPropagation();

                };

                 scope.getClickPosition = function(event) {

                    var parentPosition = scope.getPosition(event.currentTarget);
                    var windowWidth = angular.element(window).width();
                    var windowHeight = angular.element(window).height();
                    //var xPosition = event.clientX - parentPosition.x;
                    //var xPosition = (windowWidth - event.clientX) > (angular.element(".actionEachBox").width()) ? event.clientX - parentPosition.x : 330;
                    //var xPosition = (lElement.width() - (scope.rightClickXPos - parentPosition.x)) > (angular.element(".actionEachBox").width()) ? scope.rightClickXPos - parentPosition.x : 210;
                    //var yPosition = (windowHeight - parentPosition.y) > (angular.element(".actionEachBox").height()) ? "0" : -(angular.element(".actionEachBox").height()) + 20;
                    //var yPosition = event.clientY - parentPosition.y - ) ;

                    var getScrollOffsetPos = event.currentTarget.offsetTop - $('.foldertreeUl ').scrollTop();


                    var getWrapWidth = $('.foldertreeUl').width();

                    if(scope.rightClickXPos >= getWrapWidth - 200){

                        return false;

                    } else {
                        xPosition = scope.rightClickXPos - 80;
                    }

                    var yPosition = "25"; // keep y consistent for now

                    scope.position.left = xPosition + "px";
                    scope.position.top = yPosition + "px";
                    return true;

                };

                scope.getPosition = function(element) {

                    var xPosition = 0;
                    var yPosition = 0;

                    while (element) {
                        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                        element = element.offsetParent;
                    }
                    return {
                        x: xPosition,
                        y: yPosition
                    };

                };

                lElement.bind("click", function(event) {
                    var $actionEachBox = angular.element(".actionEachBox");
                    if (lElement.parents(".folderTreeWrapper").hasClass("withoutCheckBox")) {


                        if (!lElement.find(".folderSelector").hasClass("disabledColor")) {
                            if (lElement.hasClass("nonCheckBox")) {
                                lElement.removeClass("nonCheckBox");
                            } else {

                                lElement.addClass("tempClass");
                                scope.anchors = lElement.parents(".withoutCheckBox").find(".folderSelector").not(".disabledColor").parents("a");
                                scope.anchors.removeClass("highlight highlightActive nonCheckBox");

                                for (var anchorIndex = 0; anchorIndex < scope.anchors.length; anchorIndex++) {

                                    if (scope.anchors.eq(anchorIndex).hasClass("tempClass")) {
                                        scope.anchors.eq(anchorIndex).addClass("highlight nonCheckBox");
                                        lElement.removeClass("tempClass");
                                        event.stopPropagation();
                                    }
                                }
                            }
                        }else{
                            return false;
                        }

                        // $scope.anchors.not(".tempClass").removeClass("highlight").find("actionEach").remove();

                    } else {
                        if ($actionEachBox.hasClass("optionsOpen")) {
                            angular.element(".actionEachBox.optionsOpen").parent().removeClass("highlight").find(".actionEach").remove();
                            $actionEachBox.removeClass("optionsOpen flagClass rightClicked");
                        }
                        scope.availableFolders = scope.thisTree.find(".folderSelector").not(".disabledColor");

                        scope.allow = false;

                        if (scope.thisTree.find(event.target).hasClass("highlight") && !scope.thisTree.find(event.target).find(".folderSelector").hasClass("disabledColor")) {
                            scope.allow = true;
                        }

                        if (!scope.thisTree.find(event.target).hasClass("highlight") && !scope.thisTree.find(event.target).parents("a").find(".folderSelector").hasClass("disabledColor")) {
                            scope.allow = true;
                        }


                        if (scope.allow) {

                            if (!scope.thisTree.find(".innerWrapper").find(event.target).length) {

                                if (lElement.find("input").attr("checked")) {

                                    $actionEachBox.removeClass("folderSelected");
                                    lElement.find(".folderSelector").removeClass("selected");
                                    lElement.find("input").attr("checked", false);
                                    scope.thisTree.find("input").eq(0).attr("checked", false).parents("label").removeClass("selected");
                                } else {

                                    $actionEachBox.removeClass("optionsOpen flagClass rightClicked");
                                    lElement.addClass("highlight").find(".folderSelector").addClass("selected");
                                    lElement.find("input").attr("checked", true);

                                    scope.allSelected = 0;
                                    angular.forEach(scope.availableFolders, function(value, index) {
                                        if (index !== 0 && !angular.element(value).hasClass("selected")) {
                                            scope.allSelected++;
                                        }
                                    });

                                    if (!scope.allSelected) {
                                        angular.element(scope.availableFolders[0]).addClass("selected").find("input").attr("checked", true);
                                    }

                                    //scope.setCurrentFolder(lElement);
                                }

                                //scope.folderSelectdCallBack(scope.thisTree.find(".folderSelector.selected"));
                            }
                            //console.log("folder level check box "+lElement.find("input").attr("checked"));

                            return false;
                        } else {
                            event.stopPropagation();
                        }
                    }
                });

                scope.optionsAction = function(event, optionScope) {

                    var actionBoxFolderId = angular.element(".actionEachBox").data('folder-id');
                    
                    if($(event.target).hasClass('disabled')){
                        event.stopPropagation();
                        return false;
                    }

                    if (optionScope.option.id === "exportToCsvInner") {
                        
                        scope.publish('sendExportToCsvAPI', {
                            'selectedFolders': actionBoxFolderId, 
                            'reportFor': 'licenseKeysFromContextMenu'
                        });

                        event.stopPropagation();
                    } else {

                        if (optionScope.option.disabledClass !== "disabled") {

                            scope.required = {
                                operationScope: {},
                                folders: []
                            };

                            scope.completeFolderStack.forEach(function(folder) {
                                if (folder.folderId === actionBoxFolderId) {
                                    scope.required.folders.push(folder);
                                }
                            });

                            scope.required.operationScope = optionScope.option;

                           if(optionScope.option.id == "deleteFolderInner"){

                                 scope.modalInst = ModalService.showModal({
                                                        templateUrl: '/vmf/m/components/folderTree/template/deleteFolder.tpl.html',
                                                        controller: "folderTreeController"
                                                    }).then(function(modal) {
                                                        modal.element.modal({backdrop: 'static'});
                                                         _this.createModal(scope.required, scope.completeFolderStack);
                                                    });
                                                    
                                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : delete-folder");

                            }

                            if(optionScope.option.id == "moveFolderInner"){
                                 
                                 scope.modalInst = ModalService.showModal({
                                                        templateUrl: '/vmf/m/components/folderTree/template/moveFolder.tpl.html',
                                                        controller: "folderTreeController"
                                                    }).then(function(modal) {
                                                        modal.element.modal({backdrop: 'static'});
                                                         _this.createModal(scope.required, scope.completeFolderStack);
                                                         _this.publishGetFolderPath();
                                                    }); 
                                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : move-folder");
                            }

                            if(optionScope.option.id == "createFolderInner"){
                                 
                                 scope.modalInst = ModalService.showModal({
                                                        templateUrl: '/vmf/m/components/folderTree/template/createFolder.tpl.html',
                                                        controller: "folderTreeController"
                                                    }).then(function(modal) {
                                                        modal.element.modal({backdrop: 'static'});
                                                         _this.createModal(scope.required, scope.completeFolderStack);
                                                         _this.publishGetFolderPathCreate();
                                                    }); 
                            }

                            if(optionScope.option.id == "renameFolderInner"){
                                 
                                 scope.modalInst = ModalService.showModal({
                                                        templateUrl: '/vmf/m/components/folderTree/template/renameFolder.tpl.html',
                                                        controller: "folderTreeController"
                                                    }).then(function(modal) {
                                                        modal.element.modal({backdrop: 'static'});
                                                         _this.createModal(scope.required, scope.completeFolderStack);
                                                    }); 
                                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : rename-folder");
                            }

                            if(optionScope.option.id == "inviteNewUserInner"){

                                scope.modalInstance = ModalService.showModal({
                                    templateUrl: '/vmf/m/components/folderTree/template/inviteUser.tpl.html',
                                    controller: "folderTreeController"
                                }).then(function(modal) {
                                    modal.element.modal({backdrop: 'static'});
                                    _this.createModal(scope.required, scope.completeFolderStack);                             
                                });

                            }

                            if(optionScope.option.id == 'shareFolderInner'){
                                scope.modalInstance = ModalService.showModal({
                                    templateUrl: '/vmf/m/components/folderTree/template/shareFolder.tpl.html',
                                    controller: "folderTreeController"
                                }).then(function(modal) {
                                    modal.element.modal({backdrop: 'static'});
                                    _this.createModal(scope.required, scope.completeFolderStack);  
                                    _this.getUsers();                             
                                });
                                if(typeof riaLinkmy !="undefined") riaLinkmy("my-licenses : share-folder");
                            }

                             if(optionScope.option.id == 'requestPermissionInner'){
                                scope.modalInstance = ModalService.showModal({
                                    templateUrl: '/vmf/m/components/folderTree/template/requestPermission.tpl.html',
                                    controller: "folderTreeController"
                                }).then(function(modal) {
                                    modal.element.modal({backdrop: 'static'});
                                    _this.createModal(scope.required, scope.completeFolderStack);  
                                    _this.publishEditFolderPermissions();                          
                                });
                            }

                        } else {
                            return false;
                        }
                    }

                    angular.element(".actionEachBox").removeClass("optionsOpen");

                    event.stopPropagation();

                };

            }
        };
    }
]);
