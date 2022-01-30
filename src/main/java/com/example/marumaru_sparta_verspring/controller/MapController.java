package com.example.marumaru_sparta_verspring.controller;

import com.example.marumaru_sparta_verspring.domain.meets.Meet;
import com.example.marumaru_sparta_verspring.service.MeetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;


@RequiredArgsConstructor
@RestController
public class MapController {
    private final MeetService meetService;

    @GetMapping("/MapCoordinate/{idx}")
    public String getCoordinate(@PathVariable("idx") Long idx) {
        return meetService.getMeet(idx).getAddress();
    };
}
