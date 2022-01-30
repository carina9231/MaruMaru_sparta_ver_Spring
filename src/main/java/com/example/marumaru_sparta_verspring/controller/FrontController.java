package com.example.marumaru_sparta_verspring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class FrontController {
    @GetMapping("/meets")
    public String getPageMeetList(){
        return "meets/meet_list";
    }

    @GetMapping("/meet")
    public String getPageMeetPost(){
        return "meets/meet_upload";
    }

    @GetMapping("/meet/{id}")
    public String getPageMeet(){
        return "meets/meet_detail";
    }

    @GetMapping("/show-post")
    public String getPagePostList(){
        return "posts/post_list";
    }

    @GetMapping("/posts")
    public String getPagePosting(){
        return "posts/post_upload";
    }

    @GetMapping("/posts/detail/{idx}")
    public String getPostDetail(){
        return "posts/post_detail";
    }

    @GetMapping("/user/login")
    public String login() {
        return "user/login";
    }

    @GetMapping("/user/profile")
    public String getUserProfile() {
        return "user/user_profile";
    }

    @GetMapping("/user/profile/modify")
    public String getUserProfileModify() {
        return "user/user_profile_upload";
    }

    @GetMapping("/user/post")
    public String getUserPosted() {
        return "user/user_post";
    }

    @GetMapping("/profiles") //프로필 리스트
    public String getPageProfiles(){
        return "profile/profile_list";
    }

    @GetMapping("/profileup") //프로필 작성
    public String getPageProfileUp(){
        return "profile/profile_upload";
    }

    @GetMapping("/profile/detail/{idx}") //프로필 상세
    public String getPageProfileDetail(){
        return "profile/profile_detail";
    }

    @GetMapping("/profile/modify/{idx}") //프로필 수정
    public String getProfileModify(){ return "profile/profile_detail_upload"; }

    @GetMapping("/meet-change/{id}")
    public String getPageMeetUpload(){
        return "meets/meet_detail_upload";
    }

    @GetMapping("/map")
    public String getMapping(){
        return "maps/locate_map";
    }
}
