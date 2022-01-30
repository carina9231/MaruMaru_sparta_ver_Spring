package com.example.marumaru_sparta_verspring.domain.articles;

import com.example.marumaru_sparta_verspring.domain.user.User;
import com.example.marumaru_sparta_verspring.domain.user.UserRole;
import com.example.marumaru_sparta_verspring.dto.articles.PostRequestDto;
import com.example.marumaru_sparta_verspring.repository.PostRepository;
import org.junit.jupiter.api.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import static org.junit.jupiter.api.Assertions.*;

class PostTest {
    @BeforeAll
    static void beforeAll() {
        System.out.println("## BeforeAll Annotation 호출 ##");
        System.out.println();
    }

    @AfterAll
    static void afterAll() {
        System.out.println("## afterAll Annotation 호출 ##");
        System.out.println();
    }

    @BeforeEach
    void beforeEach() {
        System.out.println("## beforeEach Annotation 호출 ##");
        System.out.println();
    }

    @AfterEach
    void afterEach() {
        System.out.println("## afterEach Annotation 호출 ##");
        System.out.println();
    }

    @Test
    void test1() {
        System.out.println("## test1 시작 ##");
        System.out.println();
    }

    @Test
    @DisplayName("Test Case 2!!!")
    void test2() {
        System.out.println("## test2 시작 ##");
        System.out.println();
    }

    @Test
    @Disabled  // Disabled Annotation : 테스트를 실행하지 않게 설정하는 어노테이션
    void test3() {
        System.out.println("## test3 시작 ##");
        System.out.println();
    }

    /*--------------Post 성공, 실패 테스트----------------*/
    @Nested
    @DisplayName("게시글 객체 생성")
    class CreateUserProduct {

        private Long userId;
        private String title;
        private String content;
        private MultipartFile img;
        private User user;

        @BeforeEach
        void setup() {
            title = "제목이야 제목테스트";
            content = "테스트 내용이지롱";
            user = new User("Test", "123", UserRole.USER, "nicname");
            user.setId(123456L);
        }

        @Test
        @DisplayName("Post 생성 정상 테스트")
        void CreatePost() {
            System.out.println("## Create Post 시작 ##");
            System.out.println();

            PostRequestDto postRequestDto = new PostRequestDto();
            postRequestDto.setTitle(title);
            postRequestDto.setContent(content);

            Post post = new Post(postRequestDto, user);

            assertEquals(post.getImg(), "/img/no-pic.png");
            assertEquals(post.getTitle(), title);
        }

        @Nested
        @DisplayName("실패 케이스")
        class FailCases {
            @Nested
            @DisplayName("회원 Id")
            class userId {
                @Test
                @DisplayName("null")
                void fail1() {
                    // given
                    user.setId(null);

                    PostRequestDto requestDto = new PostRequestDto(
                            title,
                            content
                    );

                    // when
                    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
                        new Post(requestDto, user);
                    });

                    // then
                    assertEquals("회원 Id 가 유효하지 않습니다.", exception.getMessage());
                }

                @Test
                @DisplayName("마이너스")
                void fail2() {
                    // given
                    userId = -100L;
                    user.setId(userId);
                    PostRequestDto requestDto = new PostRequestDto(
                            title,
                            content
                    );

                    // when
                    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
                        new Post(requestDto, user);
                    });

                    // then
                    assertEquals("회원 Id 가 유효하지 않습니다.", exception.getMessage());
                }
            }

            @Nested
            @DisplayName("상품명")
            class Title {
                @Test
                @DisplayName("null")
                void fail1() {
                    // given
                    title = null;

                    PostRequestDto requestDto = new PostRequestDto(
                            title,
                            content
                    );

                    // when
                    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
                        new Post(requestDto, user);
                    });

                    // then
                    assertEquals("저장할 수 있는 상품명이 없습니다.", exception.getMessage());
                }

                @Test
                @DisplayName("빈 문자열")
                void fail2() {
                    // given
                    String title = "";

                    PostRequestDto requestDto = new PostRequestDto(
                            title,
                            content
                    );

                    // when
                    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
                        new Post(requestDto, user);
                    });

                    // then
                    assertEquals("저장할 수 있는 상품명이 없습니다.", exception.getMessage());
                }
            }

            /*@Nested
            @DisplayName("상품 이미지 URL")
            class Image {
                @Test
                @DisplayName("null")
                void fail1() {
                    // given
                    img = null;

                    PostRequestDto requestDto = new PostRequestDto(
                            title,
                            content
                    );

                    // when
                    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
                        new Post(requestDto, user);
                    });

                    // then
                    assertEquals("상품 이미지 URL 포맷이 맞지 않습니다.", exception.getMessage());
                }
            }*/
        }
    }
}