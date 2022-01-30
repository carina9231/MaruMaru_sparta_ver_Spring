package com.example.marumaru_sparta_verspring.domain.meets;

import com.example.marumaru_sparta_verspring.domain.Timestamped;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;


@Entity
@Getter
@Setter
public class Meet extends Timestamped {

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private Long idx;
    private Long userId;
    private String username;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String content;
    private String imgUrl ="/img/no-pic.png";
    @Column(columnDefinition = "int default 0")
    private int view;
    private String address;
    private String date;  // 이벤트 개최날짜

    @OneToMany(mappedBy = "meet", cascade = CascadeType.ALL)
    private List<MeetComment> comments;
}
