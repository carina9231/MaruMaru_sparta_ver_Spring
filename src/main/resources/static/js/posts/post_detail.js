let url_list = window.location.href.split('/')
const id = url_list[url_list.length - 1].replace(/[^0-9.]/g, '')

$(document).ready(function () {
    bsCustomFileInput.init();
    show_post(id)
    userLikeCheck(id);
});

function showModal() {
    $('#update-modal').modal('show')
}

function userLikeCheck(id){
    $.ajax({
        type: "GET",
        url: `/api/posts/like/user`,
        data: {id: id},
        success:function(result){
            //눌렀으면 꽉찬 엄지로
            if(result){
                $("#like").attr("class","fas fa-thumbs-up")
            }
        },
        error: function (request, status, error) {
            alert(error);
        }
    })
}
function show_post(id) {
    $.ajax({
        type: "GET",
        url: `/api/posts/detail`,
        data: {id: id},
        success: function (response) {
            const title = response["title"];
            const contents = response["content"];
            const username = response["user"]["nickname"];
            const img = response["img"];
            const number = response["idx"];
            const likes = response["likes"];

            //이미지
            if(img==null){
                $("#content-img").remove();
            }
            else{
                $("#content-img").attr("src", img)
            }

            $("#idx").val(number);
            $("#author_box").text(username);
            $("#title_box").text(title);
            $("#contents_box_span").text(contents);
            $("#like-count").text(likes.length);


            $("#update-title").val(title);
            $("#update-content").text(contents);
            $("#ucontent-img").attr("src", img)


            show_comment(response['comments'])
        },
        error: function (request, status, error) {
            alert(error);
        }
    })
}
function update_img(event) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = document.createElement("img");
        img.setAttribute("src", event.target.result);
        $("#ucontent-img").attr("src",img.src);
        // document.querySelector("img#ucontent-img").appendChild(img);
    };
    reader.readAsDataURL(event.target.files[0]);
}

function update_post() {
    if (localStorage.getItem('token')) {
        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            jqXHR.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));

        });

        let content = $('#update-content').val();
        let title = $('#update-title').val();
        let file = null;
        let fileInput = document.getElementsByClassName("upfile");

        if (fileInput.length > 0) {
            file = $('#upfile')[0].files[0]
        }

        var data = {
            title:title,
            content: content,
            idx: id
        };

        const formData = new FormData();
        formData.append("img", file);
        formData.append("key", new Blob([JSON.stringify(data)] , {type: "application/json"}));


        $.ajax({
            type: "PUT",
            url: `/api/posts/detail`,
            processData: false,
            contentType: false,
            data: formData,
            success: function (response) {

                window.location.reload();
            },
            error: function (request, status, error) {
                alert(error);
            }
        });
    } else {
        alert('로그인을 해주세요')
        location.replace('/user/login')
    }
}

function delete_post() {
    if (localStorage.getItem('token')) {
        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            jqXHR.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));

        });

        const idx = $("#idx").val();
        const result = confirm("정말로 삭제 하시겠습니까?");
        if (result) {
            $.ajax({
                type: "DELETE",
                url: `/api/posts/detail`,
                data: {id: idx},
                success: function (response) {
                    if(response!="success")
                        alert(response)
                    window.location.href = `/show-post`
                },
                error: function (request, status, error) {
                    alert(error);
                }
            });
        } else {
            return false;
        }

    } else {
        alert('로그인을 해주세요')
        location.replace('/user/login')
    }

}

function checking_user(){
    if (localStorage.getItem('token')) {
        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            jqXHR.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
        });
        if (confirm("수정 하시겠습니까?") == false) {
            $('#modalClose').click();
        } else {
            $.ajax({
                type: "GET",
                url: `/api/posts/check`,

                data: {id: id},
                success: function (response) {
                    if (response) {
                        showModal();
                    } else {
                        alert("작성자만 수정할 수 있습니다.")
                    }

                },
                error: function (request, status, error) {
                    alert(error);
                }
            });
        }
    } else {
        alert('로그인을 해주세요')
        location.replace('/user/login')
    }
}

function show_comment(comments) {
    let comment_text = ""
    const arr_comment = comments.reverse();
    arr_comment.forEach((e) => {
        comment_text += `
                            &nbsp;
                            <div class="card mb-2">
                                <div class="card-header bg-light">
                                    <i class="fa fa-comment fa"></i> 작성자: ${e.user['nickname']}
                                    <input hidden value="${e['idx']}">
                                        <div class="h-auto dropdown">
                                          <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                            Edit
                                          </a>
                                           
                                          <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                            <li><a class="dropdown-item" onclick="comment_update_input(${e['idx']})">수정</a></li>
                                            <li><a class="dropdown-item" onclick="comment_delete(${e['idx']})">삭제</a></li>
                                          </ul>
                                        </div>
                                </div>
                                <div class="card-body">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">
                                            <div class="comment_wrote">${e.comment}</div>
                                               <!--수정 댓글-->
                                               
                                             <div id="comment_input_${e['idx']}" class="d-none">
                                                <input id="comment_upvalue_${e['idx']}" type="text"  class="form-control">
                                                <button onclick="comment_update(${e['idx']})" type="button" class="h-auto btn btn-dark mt-3">수정</button>
                                             </div>
                                             
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        `
    })
    $(`#comment_list`).html(comment_text)
}

//댓글 업로드
function comment_upload() {
    if (localStorage.getItem('token')) {
        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            jqXHR.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
        });

        const comment_input = $("#comment_content").val();
        if (comment_input.length == 0) {
            alert("댓글을 입력해주세요!");
            return;
        }
        const g_idx = $("#idx").val();
        $.ajax({
            type: "POST",
            url: `/api/posts/comment`,
            data: JSON.stringify({
                postid: g_idx,
                comment: comment_input
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                window.location.reload();
            },
            error: function (request, status, error) {
                alert(error);
            }
        });

    } else {
        alert('로그인을 해주세요')
        location.replace('/user/login')
    }
}

function comment_update_input(id){
    if (localStorage.getItem('token')) {
        $("#comment_input_"+id).toggleClass('d-none')

    } else {
        alert('로그인을 해주세요')
        location.replace('/user/login')
    }
}
//댓글 수정
function comment_update(id) {
    const result = confirm("수정 하시겠습니까?");

    if(result){
        data ={
            commentid:id,
            comment:$("#comment_upvalue_"+id).val()
        }
        $.ajax({
            type: "PUT",
            url: `/api/posts/comment`,
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if(response!="success")
                    alert(response)
                window.location.reload();
            },
            error: function (request, status, error) {
                console.log(error);
            }
        })
    }
    else{
        comment_update_input(id)
    }

}

//댓글 삭제
function comment_delete(id) {
    if (localStorage.getItem('token')) {
        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            jqXHR.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
        });

        const result = confirm("댓글을 삭제 하시겠습니까?");

        if (result) {
            $.ajax({
                type: "DELETE",
                url: `/api/posts/comment`,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({commentid:id}),
                success: function (response) {
                    if(response!="success")
                        alert(response)
                    window.location.reload();
                },
                error: function (request, status, error) {
                    console.log(error);
                }
            })
        }
    } else {
        alert('로그인을 해주세요')
        location.replace('/user/login')
    }
}


//좋아요 표시 바꾸기
function likeChange(){
    //빈 엄지 : far
    if($("#like").hasClass("far")){
        $("#like").attr("class","fas fa-thumbs-up")
    }else{
        $("#like").attr("class","far fa-thumbs-up")
    }
}
//좋아요
function likeClick(){
    if (!localStorage.getItem('token')) {
        alert('로그인을 해주세요')
    }
    else{
        let idx = id;
        let status="up";

        //좋아요 취소할 때
        if($("#like").hasClass("fas")){
            status="down"
        }
        data={
            idx:idx,
            status:status
        }
        $.ajax({
            type: "POST",
            url: `/api/posts/like`,
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $("#like-count").text(response['likes'].length)
                likeChange();
            },
            error: function (request, status, error) {
                console.log(error);
            }
        })
    }
}
