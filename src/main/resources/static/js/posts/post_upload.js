$(document).ready(function () {
    bsCustomFileInput.init();

    if (localStorage.getItem('token')) {
        console.log('로그인 토큰 있음')
        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            jqXHR.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));

        });
    } else {
        alert('로그인을 해주세요')
        location.replace('/show-post')
    }
});

function post_upload() {
    let title = $("#title_box").val()
    let content = $("#contents_box").val()

    const formData = new FormData();

    formData.append("title",title);
    formData.append("content",content);
    // 파일명 출력
    if (typeof $("#file")[0].files[0] != 'undefined') {
        formData.append("img", $("#file")[0].files[0]);
    }

    if ($("#title_box").val().length == 0) {
        alert("제목을 입력하세요!");
        $("#title_box").focus();
        return false;
    }
    if ($("#contents_box").val().length == 0) {
        alert("내용을 입력하세요!");
        $("#contents_box").focus();
        return false;
    } else {
        $.ajax({
            type: "POST",
            url: "/api/posts",
            processData: false,
            contentType: false,
            data: formData,
            success: function (response) {
                alert("게시글 작성 성공!")
                location.replace('/show-post')
            },
            error: function(err){
                console.log("err:", err)
            }
        })
    }

}