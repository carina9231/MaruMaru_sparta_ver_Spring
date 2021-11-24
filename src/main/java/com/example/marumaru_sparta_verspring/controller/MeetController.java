package com.example.marumaru_sparta_verspring.controller;

import com.example.marumaru_sparta_verspring.domain.posts.Meet;
import com.example.marumaru_sparta_verspring.dto.MeetRequestDto;
import com.example.marumaru_sparta_verspring.service.MeetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
public class MeetController {

    private final MeetService meetService;
//    private final S3Uploader s3Uploader;

    @PostMapping("/meets")
    public Meet saveMeet(@RequestBody MeetRequestDto meetRequestDto) {
        return meetService.saveMeet(meetRequestDto);
    }

//    @PostMapping("/upload")
//    public String upload(@RequestParam("data") MultipartFile multipartFile) throws IOException {
//        return s3Uploader.upload(multipartFile, "static");
//    }
}
