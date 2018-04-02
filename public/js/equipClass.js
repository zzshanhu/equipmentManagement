var vm = new Vue({
    el:'body',
    data:{
        totalEquipment:[{url:'img/equip1.jpg',name:'传感器1'},
            {url:'img/equip2.jpg',name:'传感器2'},
            {url:'img/equip3.jpg',name:'传感器3'},
            {url:'img/equip4.jpg',name:'传感器4'},
            {url:'img/equip5.jpg',name:'传感器5'},
            {url:'img/equip6.jpg',name:'传感器6'},
            {url:'img/equip7.jpg',name:'传感器7'},
            {url:'img/equip8.jpg',name:'传感器8'}],
        loadData:'',
        startNum:0,
        endNum:3,
    },
    methods:{
        nextInfo:function () {
            var This = this;
            if(This.loadData.length-This.endNum<3){
                $('.nextBtn').html('已是最后一页');
                $('.nextBtn').attr("disabled","disabled");
            }
            else {
                $('.prevBtn').show();
                $('.prevBtn').html('上一页');
                $('.prevBtn').removeAttr("disabled","disabled");
            }
            This.startNum += 3;
            This.endNum += 3;
        },
        prevInfo:function () {
            var This = this;
            if(This.startNum == 0){
                This.startNum = 0;
                $('.prevBtn').html('已是第一页')
                $('.prevBtn').attr("disabled","disabled");
            }else {
                $('.nextBtn').show();
                $('.nextBtn').html('下一页');
                $('.nextBtn').removeAttr("disabled","disabled");
                This.startNum -= 3;
                This.endNum -= 3;
            }
        },
        borrowBtn:function () {
            console.log(111);
            $('#borrowModal').modal('show');
        }
    },
    created(){
            var This = this;
            $.ajax({
            url:'/lazyLoad',
            type:'GET',
            dataType:'JSON',
        }).done(function (data) {
            console.log(data.lazyData);
            console.log(data.lazyData[1].equipArr)
/*            var nowEquipname=nowEquipArr[0].equipName;
            for(var i=0;i<nowEquipArr.length;i++){
                   if(nowEquipname==nowEquipArr[i]){

                   }
            }*/

            This.loadData = data.lazyData;
        })
        if(This.startNum == 0) {
            $('.prevBtn').hide();
        }
        if(This.loadData.length-This.endNum<3){
                $('.nextBtn').hide();
        }
        /*if(This.loadData.length>=3){
                This.nextInfo();
                This.prevInfo();
        }else {
                This.startNum = 0;
                This.endNum = This.loadData.length;
        }*/
        var No = $('.showEquipmentRow').attr('equipNo');
        console.log(No);
    }
});
// 申请模态框
$('.showEquipment').on('click','borrowbtn',function () {
    console.log(1111)
    $('#borrowModal').modal('show');
})


