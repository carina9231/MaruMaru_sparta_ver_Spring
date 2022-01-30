package com.example.marumaru_sparta_verspring.validator;

import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;

public class MyURLValidator {
    public static boolean isValidUrl(String url)
    {
        try {
            new URL(url).toURI();
            return true;
        }
        catch (URISyntaxException exception) {
            return false;
        }
        catch (MalformedURLException exception) {
            return false;
        }
    }
}
