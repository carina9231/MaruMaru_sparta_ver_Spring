let url_list = window.location.href.split('/')
const id = url_list[url_list.length - 1].replace(/[^0-9.]/g, '')

$(document).ready(function () {
    bsCustomFileInput.init();
    if (localStorage.getItem('token')) {
        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            jqXHR.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));

        });
    } else {
        alert('로그인을 해주세요')
        location.replace('/user/login')
    }
    show_post(id)
});

function showModal() {
    $('#update-modal').modal('show')
}


function show_post(id) {
    $.ajax({
        type: "GET",
        url: `/posts/detail`,
        data: {id: id},
        success: function (response) {
            console.log(response)
            const title = response["title"];
            const contents = response["content"];
            const username = response["username"];
            const img = response["img"];
            const number = response["idx"];

            $("#idx").val(number);
            $("#author_box").text(username);
            $("#title_box").text(title);
            $("#contents_box_span").text(contents);
            $("#content-img").attr("src", img)

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

function update_img() {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = document.createElement("upfile");
        img.setAttribute("src", event.target.result);
        document.querySelector("img#ucontent-img").appendChild(img);
    };
    reader.readAsDataURL(event.target.files[0]);
}

function update_post() {
    if (confirm("수정 하시겠습니까?") == false) {
        $('#modalClose').click();
    } else {
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
            url: `/posts/detail`,
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
    }

}

function delete_post() {
    const idx = $("#idx").val();
    const result = confirm("정말로 삭제 하시겠습니까?");
    if (result) {
        $.ajax({
            type: "DELETE",
            url: `/posts/detail`,
            data: {id: idx},
            success: function (response) {
                window.location.href = `/show-post`
            },
            error: function (request, status, error) {
                alert(error);
            }
        });
    } else {
        return false;
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
                                    <i class="fa fa-comment fa"></i> 작성자: ${e.user['username']}
                                    <input hidden value="${e['idx']}">
                                        <div class="h-auto dropdown">
                                          <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                            Edit
                                          </a>
                                           
                                          <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                            <li><a class="dropdown-item" href="#" onclick="comment_update_input(${e['idx']})">수정</a></li>
                                            <li><a class="dropdown-item" href="#" onclick="comment_delete(${e['idx']})">삭제</a></li>
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
    const comment_input = $("#comment_content").val();
    if (comment_input.length == 0) {
        alert("댓글을 입력해주세요!");
        return;
    }
    const g_idx = $("#idx").val();
    $.ajax({
        type: "POST",
        url: `/posts/comment`,
        data: JSON.stringify({
            postid: g_idx,
            comment: comment_input
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            console.log(response)
            let comment_text = ""
            const arr_comment = response.reverse();
            arr_comment.forEach((e) => {
                comment_text += `
                            <div class="card mb-2">
                                <div class="card-header bg-light">
                                    <i class="fa fa-comment fa"></i> 작성자: ${e.user['username']}
                                    <input hidden value="${e['idx']}">
                                        <div class="h-auto dropdown">
                                          <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                            Edit
                                          </a>
                                           
                                          <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                            <li><a class="dropdown-item" href="#" onclick="comment_update_input(${e['idx']})">수정</a></li>
                                            <li><a class="dropdown-item" href="#" onclick="comment_delete(${e['idx']})">삭제</a></li>
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
            $("#comment_content").val("")
            $(`#comment_list`).html(comment_text)

        },
        error: function (request, status, error) {
            alert(error);
        }
    });
}

function comment_update_input(id){
    $("#comment_input_"+id).toggleClass('d-none')
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
            url: `/posts/comment`,
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
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
    const result = confirm("댓글을 삭제 하시겠습니까?");

    if (result) {
        $.ajax({
            type: "DELETE",
            url: `/posts/comment`,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({commentid:id}),
            success: function (response) {
                window.location.reload();
            },
            error: function (request, status, error) {
                console.log(error);
            }
        })
    }
}
