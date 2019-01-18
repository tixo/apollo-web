define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {

    function initType() {
        seajs.use('../../app/common/ajax', function (ajax) {
            ajax.post('interest/info/findInterestTree', {}, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {

                    if (result.length > 0) {
                        var zNodes = [];
                        $.each(result, function (index, d) {
                            if (0 == d.pId) {
                                zNodes.push(d);
                            }
                        });
                        console.log(zNodes);
                        var setting_tree = {
                            check: {
                                enable: true,
                                chkStyle: "radio",
                                radioType: "all"
                            },
                            data: {
                                simpleData: {
                                    idKey: "id", //主键id
                                    pIdKey: "pId",
                                    name: "name",
                                    enable: true
                                }
                            },
                            callback: {
                                onCheck: zTreeOnCheck,
                                onClick: zTreeOnClick
                            }
                        };

                        function createTree() {
                            var temp = document.getElementById("dropdown-menu-display");
                            if (null == temp) {
                                var dom = document.body;
                                var div = document.createElement("div");
                                div.id = "dropdown-menu-display";
                                div.className = "dropdown-menu";
                                var ul = document.createElement("ul");
                                ul.id = "dropdown-menu-tree-fun";
                                ul.className = "ztree";
                                div.appendChild(ul);
                                dom.appendChild(div);
                            }
                        };

                        function init_tree(data) {
                            createTree();
                            var ztree = $.fn.zTree.init($("#dropdown-menu-tree-fun"), setting_tree,
                                data);
                            // 选中某个节点
                            var orgKey = $("#parentId").val();
                            var nodes = ztree.getNodeByParam("orgKey", orgKey, null);
                            if (null != nodes) {
                                nodes.checked = true;
                                var name = nodes.name;
                                $("#pName").val(name);
                            }
                        }

                        // 树选中事件
                        function zTreeOnCheck(event, treeId, treeNode) {
                            console.log(treeNode);
                            var id = treeNode.id;
                            var name = treeNode.name;
                            $("#pName").val(name);
                            $("#parentId").val(id);
                            $("#dropdown-menu-display").hide();


                            $("#url").rules("remove");      

                            $('#view_url').attr('style','display:none;');
                        };

                        function zTreeOnClick(event, treeId, treeNode) {
                            if (treeNode.nocheck == false) {
                                zTreeOnCheck(event, treeId, treeNode);
                            }
                        }

                        init_tree(zNodes);

                        function CPos(x, y) {
                            this.x = x;
                            this.y = y;
                        }
                        //获取目标元素的位置
                        function GetObjPos(ATarget) {
                            var target = ATarget;
                            var pos = new CPos(target.offsetLeft, target.offsetTop);
                            var target = target.offsetParent;
                            while (target) {
                                pos.x += target.offsetLeft;
                                pos.y += target.offsetTop;
                                target = target.offsetParent
                            }
                            var input = $("#parentIdName");
                            var height = input.outerHeight();
                            pos.y = pos.y + height;
                            return pos;
                        }

                        $('#pName').on('click', function () {
                            var obj = document.getElementById("pName");

                            var input = $("#pName");
                            var width = input.outerWidth();
                            var height = input.outerHeight();
                            var pos = GetObjPos(obj);
                            //初始化之後 ztree樹自動展開
                            var treeObj = $.fn.zTree.getZTreeObj("dropdown-menu-tree-fun");
                            treeObj.expandAll(true);
                            //初始化树
                            if (null != obj) {
                                $('#dropdown-menu-display').css('left', pos.x + 'px').css('top',
                                    pos.y + height + 'px').css('width', width - 2 + 'px');
                                //ztree樹div
                                $("#dropdown-menu-display").slideToggle(1);
                            }
                        });
                    }
                }
            });

        });
        // $("#nationName").val(nation[0].value);
    }

    /**
     * 数据保存
     * @param {*} params 
     */
    function save(params) {
        seajs.use('../../../app/common/ajax', function (ajax) {
            ajax.post('interest/info/save', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('保存兴趣点信息成功', './index.html');
                }
            });

        });
    }

    /**
     * 数据更新
     * @param {*} params 
     */
    function update(params) {
        seajs.use('../../../app/common/ajax', function (ajax) {
            ajax.post('interest/info/update', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('更新兴趣点信息成功', './index.html');
                }
            });

        });
    }

    exports.initValidation = function () {
        //表单验证
        $("#populationForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                name: {
                    required: true,
                    maxlength: 128
                },
                type: {
                    required: true
                },
                description: {
                    maxlength: 512
                },
                url: {
                    required: true,
                    maxlength: 512                    
                }
            },
            messages: {}
        });
        // initDownload();

        initType();

        $('#clear').on('click',function(){
            if(!$.isEmpty($('#parentId').val())){
                console.log('clear1');
                $('#view_url').removeAttr('style');

                $("#url").rules("remove");  
                $("#url").rules("add",{required:true,length:512});      
            }

            $('#pName').val('');
            $('#parentId').val('');


        });

        $('#uploaderPhoto').uploader({
            url: top.fhzxApolloApi + '/user/info/upload',
            headers:top.authorization,
            limitFilesCount: 1,
            filters: {
                // 只允许上传图片
                mime_types: [{
                    title: '图片',
                    extensions: 'jpg,gif,png'
                }],
                // 最大上传文件为 10MB
                max_file_size: '10mb',
                // 不允许上传重复文件
                prevent_duplicates: false
            },
            deleteActionOnDone: function (file, doRemoveFile) {
                doRemoveFile();
            },

            responseHandler: function (responseObject, file) {
                var response = JSON.parse(responseObject.response);
                console.log(response);
                // 当服务器返回的文本内容包含 `'error'` 文本时视为上传失败
                if (1 == response.code) {
                    this.removeFile(file);
                    $('#icon').val(response.data);
                } else {
                    return 'error';
                }
            }
        });
    }
})