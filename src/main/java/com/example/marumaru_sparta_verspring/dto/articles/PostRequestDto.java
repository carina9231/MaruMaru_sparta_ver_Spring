package com.example.marumaru_sparta_verspring.dto.articles;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
public class PostRequestDto {
    @NotBlank(message = "제목은 필수입니다.")
    private String title;
    @NotBlank(message = "내용은 필수입니다.")
    private String content;
    private MultipartFile img;
    private Long idx;

    public PostRequestDto(String title, String content){
        this.title = title;
        this.content = content;
    }
}
