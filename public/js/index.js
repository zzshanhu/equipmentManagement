let vm = new Vue({
    el:'body',
    data:{
        borrowFeedback:[],
        equipmentallFeedback:[],
        equipmentoneFeedback:[],
        equipLastArr:[],
        selected:'',
        flag:true,
        remianNum:'',
        inputNum:'',
        nowEquipName:''
    },
    methods:{
        getborrowFeedback:function(){
            var This = this;
            $.ajax({
                url: 'getmsg/getBorrowInfo',
                type: 'GET',
                dataType: 'JSON',
            }).done(function(userdetails) {
                This.borrowFeedback = userdetails.returnObj;
            })
        },
        getequimentall:function () {
            var This = this;
            $.ajax({
                url: 'getmsg/getEqupmentall',
                type: 'GET',
                dataType: 'JSON',
            }).done(function(equipmentall) {
                This.equipmentallFeedback = equipmentall.returnObj;
                console.log(This.equipmentallFeedback)
            })
        },
        getEquipNoName:function (selected) {
            var This = this;
            $.ajax({
                url: 'getmsg/getEqupmentone',
                type: 'GET',
                dataType: 'JSON',
                data:{equipNo:selected}
            }).done(function(equipmentone) {
                This.equipmentoneFeedback = equipmentone.returnObj;
                var equiponeArray = This.equipmentoneFeedback;
                console.log(equiponeArray);
                var newArr=[];
                var EquipNameObj={};
                var equipLastArr=[];
               for(let i=0;i<equiponeArray.length;i++) {
                   if (newArr.indexOf(equiponeArray[i].equipName) == '-1') {
                       newArr.push(equiponeArray[i].equipName);
                   }
                   if (i == equiponeArray.length - 1) {
                       let nowNum = 0;
                       for (let k = 0; k < newArr.length; k++) {
                           for (let j = 0; j < equiponeArray.length; j++) {
                               if (equiponeArray[j].equipName ==newArr[k]) {
                                   nowNum++;
                               }
                               if(j==equiponeArray.length-1){
                                   EquipNameObj={nowEquipName:newArr[k],num:nowNum}
                                   equipLastArr.push(EquipNameObj);
                                   nowNum=0;
                               }
                           }

                       }
                   }
               }
               This.equipLastArr = equipLastArr;
                console.log(equipLastArr)
            })
        },
        getCanBorroeNum:function (data) {
            var This = this;
            This.nowEquipName=data.split('|')[0];
            This.remianNum = data.replace(/[^0-9]/ig,"");
        },
        refermsg:function () {
            var This = this;
            if(This.flag == true){
                This.inputNum = $('#inputNum').val();
                if(This.inputNum>This.remianNum){
                    return;
                }
                var inputDate = $('#inputDate').val();
                var userTel= $('#userTel').val();
                $.ajax({
                    url:'reserveBorrow',
                    type:'POST',
                    dataType:'JSON',
                    data:{
                        selectNo:This.selected,
                        inputNum:This.inputNum,
                        inputDate:inputDate,
                        userTel:userTel,
                        nowEquipName:This.nowEquipName
                    },
                    complete:function () {
                        $('#returnModal').modal('hide');
                    }
                }).done(function (result) {
                    console.log(result);
                })
            }
            if(This.flag == false){
                var attrArray = [];
                console.log($('#noteForm2').serialize());
                if(!$('.inputReturnDate').val()){
                    alert('归还时间不能为空，请按规定格式填写');
                    return ;
                }
                $.ajax({
                    url:'reserveReturn',
                    type:'POST',
                    dataType:'JSON',
                    data:{returnInfor:$('#noteForm2').serialize()},
                    complete:function () {
                        $('#returnModal').modal('hide');
                    }
                }).done(function (data) {
                    if(data=='1'){
                        alert('申请成功，请在规定时间到实验设备管理处归还设备，逾期将影响您的信用积分！');
                    }else {
                        alert("未知错误，请刷新后重新操作！");
                    }
                })
            }
        },
        borrowApply:function () {
            var This = this;
            $('#noteForm2')[0].reset();
            This.flag = true;
        },
        returnApply:function () {
            var This = this;
            $('#noteForm1')[0].reset();
            This.flag = false;
            $.ajax({
                url: 'getmsg/getBorrowInfo',
                type: 'GET',
                dataType: 'JSON',
            }).done(function(userdetails) {
                This.borrowFeedback = userdetails.returnObj;
            })
        },
        checkNum:function () {
            var This = this;
            console.log(This._data);
            let inputNum = $('#inputNum').val();
            if(inputNum>This._data.remianNum){
                $('.inputborrowNum').addClass('alert alert-warning');
                $('.referBtn').attr("disabled","disabled");
            }
            if(inputNum<=This._data.remianNum){
                $('.inputborrowNum').removeClass('alert alert-warning');
                $('.referBtn').removeAttr("disabled","disabled");
            }
        },
        getClassInfo:function (e) {
            var $url='equipClassInfo?id='+e.target.id;
            console.log($url);
           window.location.href=$url;
        }
    }
})

// 轮播图
jQuery(function($){
    $('.vmcarousel-centered-infitine').vmcarousel({
        centered: true,
        start_item: 1,
        autoplay: true,
        infinite: true
    });
});

//    实验公约模态框
$('.treatyList').on('click','li',function () {
    $('#myModal').modal('show');
})
$(function () {
    $('#id_ad_search').click(function(){
        var name = $('#id_name').val();
        $.ajax({
            url:'/test',
            data:{name:name},
            complete:function () {
                $('#myModal').modal('hide');
            }
        })
    });
});

//    公告模态框
$('.noticeMsg').on('click','li',function () {
    $('#noticeModal').modal('show');
})
$(function () {
    $('#id_ad_search').click(function(){
        var name = $('#id_name').val();
        $.ajax({
            url:'/test',
            data:{name:name},
            complete:function () {
                $('#noticeModal').modal('hide');
            }
        })
    });
});
//   申请反馈模态框
$('.return').click(function () {
    $('#borrowModal').modal('show');
})
$('#borrowModalTitle').click((function () {
    $('.borrowModal').show();
    $('.returnModal').hide();
    $('#borrowModalTitle').addClass('active');
    $('#returnModalTitle').removeClass('active');

}))
$('#returnModalTitle').click((function () {
    $('.borrowModal').hide();
    $('.returnModal').show();
    $('#returnModalTitle').addClass('active');
    $('#borrowModalTitle').removeClass('active');
}))
$(function () {
    $('#id_ad_search').click(function(){
        var name = $('#id_name').val();
        $.ajax({
            url:'/test',
            data:{name:name},
            complete:function () {
                $('#borrowModal').modal('hide');
            }
        })
    });
});

//    我要申请模态框
$('.borrow').click(function () {
    $('#applicationModal').modal('show');
    $('#borrowApplyTitle').addClass('active');
})
$('#borrowApplyTitle').click((function () {
    $('.borrowApply').show();
    $('.returnApply').hide();
    $('#borrowApplyTitle').addClass('active');
    $('#returnApplyTitle').removeClass('active');

}))
$('#returnApplyTitle').click((function () {
    $('.borrowApply').hide();
    $('.returnApply').show();
    $('#returnApplyTitle').addClass('active');
    $('#borrowApplyTitle').removeClass('active');
}))


//    建议反馈模态框
$('.suggest').click(function () {
    $('#suggestModal').modal('show');
})

//写建议模态框
$('.writeTreaty').click(function () {
    $('#writeTreatyModal').modal('show');
})

$('.reset').click(function () {
    $('#noteForm')[0].reset();
})
Vue.filter('time', function (value) {
    return new Date(value).toLocaleDateString().replace(/年|月/g, "-").replace(/日/g, " ");
})
//发送建议信息
$('.suggestInfoBtn').on('click',function() {
    var This = this;
    var suggestInfo=$('#suggestInfo').val();
    $.ajax({
        url: 'sendSuggestInfo',
        type: 'POST',
        dataType: 'text',
        data: {suggestInfo:suggestInfo}
    })
        .done(function(data) {
             if(data=='1'){
                 alert('感谢您的建议/意见，我们期待给您提供更好的服务~')
             }
        });
});

$('.treatyList').mouseover(function () {
    $('.treatyList').css('overflow-y','scroll');
})
$('.treatyList').mouseout(function () {
    $('.treatyList').css('overflow-y','hidden');
})
console.log($('.suggestBack').children())
