/*Folder Tree controller code*/
app.controller("folderTreeController", ["$scope","$http",
    function($scope, $http) {
        $scope.globalVars = globalVariables;
        $scope.rootName1 = {
            'value': '2',
            'text': 'License Folders',
            'disabled': false,
            'checked': false
        };

        $scope.rootName2 = {
            'value': '2',
            'text': 'License Folders222',
            'disabled': false,
            'checked': false
        };


        $scope.getFolderTree = function(){

            $scope.getFodlerUrl = 'http://localhost:3001/dev/json/getFolderTree.json';

            $http.get($scope.getFodlerUrl).
              success(function(data, status, headers, config) {
                
                $scope.folderStructure = data;

              }).
              error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

        }


          $scope.getFolderTree();

   //      $scope.folderStructure = {
			// "folderContent": [
   //                                  {
   //                                      "status": "ACTIVE",
   //                                      "folderType": "ROOT",
   //                                      "fullFolderPath": "HOME",
   //                                      "rootFolderId": 0,
   //                                      "folderId": "5006433",
   //                                      "folderName": "HOME",
   //                                      "parentFolderId": "0",
   //                                      "folderLevel": 1,
   //                                      "folderAccess": "NONE",
   //                                      "isLeaf": false,
   //                                      "hasSubFolders": true
   //                                  },
   //                                  {
   //                                      "status": "ACTIVE",
   //                                      "folderType": "ORDER",
   //                                      "fullFolderPath": "HOME\\Order_11331759",
   //                                      "rootFolderId": 0,
   //                                      "folderId": "1000181371",
   //                                      "folderName": "Order_11331759",
   //                                      "parentFolderId": "5006433",
   //                                      "folderLevel": 2,
   //                                      "folderAccess": "VIEW",
   //                                      "isLeaf": true
   //                                  },
   //                                  {
   //                                      "status": "ACTIVE",
   //                                      "folderType": "ORDER",
   //                                      "fullFolderPath": "HOME\\Order_11607290",
   //                                      "rootFolderId": 0,
   //                                      "folderId": "1000536688",
   //                                      "folderName": "Order_11607290",
   //                                      "parentFolderId": "5006433",
   //                                      "folderLevel": 2,
   //                                      "folderAccess": "VIEW",
   //                                      "isLeaf": false,
   //                                      "hasSubFolders": true
   //                                  },
   //                                  {
   //                                      "status": "ACTIVE",
   //                                      "folderType": "ORDER",
   //                                      "fullFolderPath": "HOME\\Order_11811130",
   //                                      "rootFolderId": 0,
   //                                      "folderId": "1000946244",
   //                                      "folderName": "Order_11811130",
   //                                      "parentFolderId": "5006433",
   //                                      "folderLevel": 2,
   //                                      "folderAccess": "VIEW",
   //                                      "isLeaf": false,
   //                                      "hasSubFolders": true
   //                                  },
   //                                  {
   //                                      "status": "ACTIVE",
   //                                      "folderType": "USER",
   //                                      "fullFolderPath": "HOME\\IBM",
   //                                      "rootFolderId": 5006433,
   //                                      "folderId": "5831512",
   //                                      "folderName": "IBM",
   //                                      "parentFolderId": "5006433",
   //                                      "folderLevel": 2,
   //                                      "folderAccess": "NONE",
   //                                      "isLeaf": false,
   //                                      "hasSubFolders": true
   //                                  },
   //                                  {
   //                                      "status": "ACTIVE",
   //                                      "folderType": "USER",
   //                                      "fullFolderPath": "HOME\\Technology Guarantee Program",
   //                                      "rootFolderId": 0,
   //                                      "folderId": "1000611269",
   //                                      "folderName": "Technology Guarantee Program",
   //                                      "parentFolderId": "5006433",
   //                                      "folderLevel": 2,
   //                                      "folderAccess": "VIEW",
   //                                      "isLeaf": false,
   //                                      "hasSubFolders": true
   //                                  }
   //                              ]
   //              };

        $scope.folderStructure2 = {
            "folderContent": [{
                    "status": "INACTIVE",
                    "folderType": "ROOT",
                    "fullFolderPath": "HOME222",
                    "rootFolderId": 0,
                    "folderId": "1000",
                    "folderName": "HOME222",
                    "parentFolderId": "0",
                    "folderLevel": 1,
                    "folderAccess": "NONE",
                    "isLeaf": true,
                    "hasSubFolders": true,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Delete Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Rename Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Move Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Request Permission",
                        "disabled": false
                    }, {
                        "text": "Export to csv",
                        "disabledClass": "disabled"
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Home Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Home vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Home Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Home Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Home Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Home Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\African Region",
                    "rootFolderId": 0,
                    "folderId": "1001",
                    "folderName": "African Region",
                    "parentFolderId": "1000",
                    "folderLevel": 2,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": true,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My African Region Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'African Region vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My African Region Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My African Region Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My African Region Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My African Region Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Business Testing",
                    "rootFolderId": 0,
                    "folderId": "1002",
                    "folderName": "Business Testing",
                    "parentFolderId": "1000",
                    "folderLevel": 2,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Business Testing Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Business Testing vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Business Testing Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Business Testing Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Business Testing Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Business Testing Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\HORIZON VIEW",
                    "rootFolderId": 0,
                    "folderId": "1003",
                    "folderName": "HORIZON VIEW",
                    "parentFolderId": "1000",
                    "folderLevel": 2,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My HORIZON VIEW Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'HORIZON VIEW vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My HORIZON VIEW Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My HORIZON VIEW Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My HORIZON VIEW Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My HORIZON VIEW Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "INACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Human Resources",
                    "rootFolderId": 0,
                    "folderId": "1004",
                    "folderName": "Human Resources",
                    "parentFolderId": "1000",
                    "folderLevel": 2,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Delete Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Rename Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Move Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Request Permission",
                        "disabled": false
                    }, {
                        "text": "Export to csv",
                        "disabledClass": "disabled"
                    }],
                    "accessable": false,
                    "checked": false,
                    "content": [{
                            "product": 'My Human Resources Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Human Resources vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Human Resources Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Human Resources Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Human Resources Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Human Resources Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Jasons Keys",
                    "rootFolderId": 0,
                    "folderId": "1005",
                    "folderName": "Jasons Keys",
                    "parentFolderId": "1000",
                    "folderLevel": 2,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": true,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Jasons Keys Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Jasons Keys vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Jasons Keys Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Jasons Keys Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Jasons Keys Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Jasons Keys Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Marketing",
                    "rootFolderId": 0,
                    "folderId": "1006",
                    "folderName": "Marketing",
                    "parentFolderId": "1000",
                    "folderLevel": 2,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": true,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Marketing Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Marketing vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Marketing Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Marketing Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Marketing Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Marketing Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\VMworld test folder",
                    "rootFolderId": 0,
                    "folderId": "1007",
                    "folderName": "VMworld test folder",
                    "parentFolderId": "1000",
                    "folderLevel": 2,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": true,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My VMworld test folder Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'VMworld test folder vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\African Region\\Sub-African Region 1",
                    "rootFolderId": 0,
                    "folderId": "1008",
                    "folderName": "Sub-African Region 1",
                    "parentFolderId": "1001",
                    "folderLevel": 3,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Sub-African Region 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Sub-African Region 1 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\African Region\\Sub-African Region 2",
                    "rootFolderId": 0,
                    "folderId": "1009",
                    "folderName": "Sub-African Region 2",
                    "parentFolderId": "1001",
                    "folderLevel": 3,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Sub-African Region 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Sub-African Region 2 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\African Region\\Sub-African Region 3",
                    "rootFolderId": 0,
                    "folderId": "1010",
                    "folderName": "Sub-African Region 3",
                    "parentFolderId": "1001",
                    "folderLevel": 3,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Sub-African Region 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Sub-African Region 3 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-African Region 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Jasons Keys\\Test Folder 1",
                    "rootFolderId": 0,
                    "folderId": "1011",
                    "folderName": "Test Folder 1",
                    "parentFolderId": "1005",
                    "folderLevel": 3,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Delete Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Rename Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Move Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Request Permission",
                        "disabled": false
                    }, {
                        "text": "Export to csv",
                        "disabledClass": "disabled"
                    }],
                    "accessable": false,
                    "checked": false,
                    "content": [{
                            "product": 'My Test Folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Test Folder 1 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Jasons Keys\\Test Folder 2",
                    "rootFolderId": 0,
                    "folderId": "1012",
                    "folderName": "Test Folder 2",
                    "parentFolderId": "1005",
                    "folderLevel": 3,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": true,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Test Folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Test Folder 2 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Jasons Keys\\Test Folder 2\\Test Sub Folder",
                    "rootFolderId": 0,
                    "folderId": "1013",
                    "folderName": "Test Sub Folder",
                    "parentFolderId": "1012",
                    "folderLevel": 4,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": true,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Delete Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Rename Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Move Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Request Permission",
                        "disabled": false
                    }, {
                        "text": "Export to csv",
                        "disabledClass": "disabled"
                    }],
                    "accessable": false,
                    "checked": false,
                    "content": [{
                            "product": 'My Test Sub Folder Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Test Sub Folder vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "INACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Jasons Keys\\Test Folder 2\\Test Sub Folder\\Test Sub Folder 1",
                    "rootFolderId": 0,
                    "folderId": "1014",
                    "folderName": "Test Sub Folder 1",
                    "parentFolderId": "1013",
                    "folderLevel": 4,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Delete Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Rename Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Move Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Request Permission",
                        "disabled": false
                    }, {
                        "text": "Export to csv",
                        "disabledClass": "disabled"
                    }],
                    "accessable": false,
                    "checked": false,
                    "content": [{
                            "product": 'My Test Sub Folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Test Sub Folder 1 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Jasons Keys\\Test Folder 2\\Test Sub Folder\\Test Sub Folder 2",
                    "rootFolderId": 0,
                    "folderId": "1015",
                    "folderName": "Test Sub Folder 2",
                    "parentFolderId": "1013",
                    "folderLevel": 4,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Test Sub Folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Test Sub Folder 2 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Test Sub Folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Marketing\\Sub-Marketing 1",
                    "rootFolderId": 0,
                    "folderId": "1016",
                    "folderName": "Sub-Marketing 1",
                    "parentFolderId": "1006",
                    "folderLevel": 3,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Sub-Marketing 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Sub-Marketing 1 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Marketing\\Sub-Marketing 2",
                    "rootFolderId": 0,
                    "folderId": "1017",
                    "folderName": "Sub-Marketing 2",
                    "parentFolderId": "1006",
                    "folderLevel": 3,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Sub-Marketing 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Sub-Marketing 2 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\Marketing\\Sub-Marketing 3",
                    "rootFolderId": 0,
                    "folderId": "1018",
                    "folderName": "Sub-Marketing 3",
                    "parentFolderId": "1006",
                    "folderLevel": 3,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My Sub-Marketing 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'Sub-Marketing 3 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My Sub-Marketing 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\VMworld test folder\\Sub-Sub-VMworld test folder 1",
                    "rootFolderId": 0,
                    "folderId": "1019",
                    "folderName": "Sub-Sub-VMworld test folder 1",
                    "parentFolderId": "1007",
                    "folderLevel": 3,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My VMworld test folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'VMworld test folder 1 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 1 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\VMworld test folder\\Sub-Sub-VMworld test folder 2",
                    "rootFolderId": 0,
                    "folderId": "1020",
                    "folderName": "Sub-Sub-VMworld test folder 2",
                    "parentFolderId": "1007",
                    "folderLevel": 3,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My VMworld test folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'VMworld test folder 2 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 2 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }, {
                    "status": "ACTIVE",
                    "folderType": "ORDER",
                    "fullFolderPath": "HOME\\VMworld test folder\\Sub-Sub-VMworld test folder 3",
                    "rootFolderId": 0,
                    "folderId": "1021",
                    "folderName": "Sub-Sub-VMworld test folder 3",
                    "parentFolderId": "1007",
                    "folderLevel": 3,
                    "folderAccess": "VIEW",
                    "isLeaf": true,
                    "hasSubFolders": false,
                    "folderOptions": [{
                        "text": "Invite New User",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Share Folder",
                        "disabledClass": "disabled"
                    }, {
                        "text": "Create Folder",
                        "disabled": false
                    }, {
                        "text": "Delete Folder",
                        "disabled": false
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
                    }],
                    "accessable": true,
                    "checked": false,
                    "content": [{
                            "product": 'My VMworld test folder 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '3-Medium',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'VMworld test folder 3 vSphere ESXi 5.1',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '2-High',
                            "lastUpdated": '2013-12-12'
                        }, {
                            "product": 'My VMworld test folder 3 Portal',
                            "supportRequest": '434534534534',
                            "status": 'Open',
                            "severity": '4-Low',
                            "lastUpdated": '2013-12-12'
                        }

                    ]
                }

            ]
        };
    
	
	}
]);

app.service('folderDataService', [function() {

    this.allFolders = [];
}]);
