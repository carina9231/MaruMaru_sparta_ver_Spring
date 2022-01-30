package com.example.marumaru_sparta_verspring.domain.meets;

import com.example.marumaru_sparta_verspring.dto.meets.MeetRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;


class MeetTest {
    @Nested
    @DisplayName("이벤트 객체 생성")
    class CreateMeet{
        private String title;
        private String content;

        @BeforeEach
        void setup() {
            title = "테스트 입니다";
            content = "hello world";

        }

        @Test
        @DisplayName("이벤트 객체 정상")
        void createProduct_Normal() {
            MeetRequestDto requestDto = new MeetRequestDto();
            Meet meet = new Meet();

            requestDto.setTitle(title);
            requestDto.setContent(content);

            meet.setTitle(requestDto.getTitle());
            meet.setContent(requestDto.getContent());

            assertEquals(meet.getTitle(), "테스트 입니다");
            assertEquals(meet.getContent(), "hello world");


        }

    }



}