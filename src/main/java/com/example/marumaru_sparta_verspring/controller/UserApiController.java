package com.example.marumaru_sparta_verspring.controller;

import com.example.marumaru_sparta_verspring.dto.user.JwtResponse;
import com.example.marumaru_sparta_verspring.dto.user.SignupRequestDto;
import com.example.marumaru_sparta_verspring.dto.user.SocialLoginDto;
import com.example.marumaru_sparta_verspring.dto.user.UserDto;
import com.example.marumaru_sparta_verspring.repository.UserRepository;
import com.example.marumaru_sparta_verspring.service.UserService;
import com.example.marumaru_sparta_verspring.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class UserApiController {

    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserService userService;
    private final UserRepository userRepository;


    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> createAuthenticationToken(@RequestBody UserDto userDto) throws Exception{
        authenticate(userDto.getUsername(), userDto.getPassword());
        final UserDetails userDetails = userDetailsService.loadUserByUsername(userDto.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.ok(new JwtResponse(token, userDetails.getUsername()));
    }

    @PostMapping(value = "/login/kakao")
    public ResponseEntity<?> createAuthenticationTokenByKakao(@RequestBody SocialLoginDto socialLoginDto) throws Exception {
        String username = userService.kakaoLogin(socialLoginDto.getToken());
        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        final String token = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.ok(new JwtResponse(token, userDetails.getUsername()));
    }

    @PostMapping(value = "/signup")
    public ResponseEntity<?> createUser(@RequestBody SignupRequestDto userDto) throws Exception {
        userService.registerUser(userDto);
        authenticate(userDto.getUsername(), userDto.getPassword());
        final UserDetails userDetails = userDetailsService.loadUserByUsername(userDto.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.ok(new JwtResponse(token, userDetails.getUsername()));
    }

    @PostMapping("/signup/check-dup")
    public String checkUsername(@RequestBody UserDto userDto) {
        String exists;
        try {
            userService.checkExist(userDto);
        } catch (IllegalArgumentException e) {
            exists = "true";
            return exists;
        }
        exists =  "FALSE";
        return exists;
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }


}
