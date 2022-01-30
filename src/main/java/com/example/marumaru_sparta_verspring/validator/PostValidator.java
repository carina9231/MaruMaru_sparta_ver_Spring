package com.example.marumaru_sparta_verspring.validator;

import com.example.marumaru_sparta_verspring.dto.articles.PostRequestDto;
import org.hibernate.validator.internal.constraintvalidators.hv.URLValidator;
import org.springframework.stereotype.Component;

@Component
public class PostValidator {
    public static void validatePostInput(PostRequestDto requestDto, Long userId) {
        if (userId == null || userId <= 0) {
            System.out.println(userId);
            throw new IllegalArgumentException("회원 Id 가 유효하지 않습니다.");
        }

        if (requestDto.getTitle() == null || requestDto.getTitle().isEmpty()) {
            throw new IllegalArgumentException("저장할 수 있는 상품명이 없습니다.");
        }

        if (requestDto.getContent() == null || requestDto.getContent().isEmpty()) {
            throw new IllegalArgumentException("저장할 수 있는 상품설명이 없습니다.");
        }

        if (requestDto.getImg()!=null && !MyURLValidator.isValidUrl(requestDto.getImg().toString())) {
            throw new IllegalArgumentException("상품 이미지 URL 포맷이 맞지 않습니다.");
        }
    }
}
