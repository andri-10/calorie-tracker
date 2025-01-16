package com.grupi2.calorie_tracker.security;

import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    private static final long JWT_EXPIRATION = 86400000; 
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    @Autowired
    private UserRepository userRepository;

    public String generateToken(String email) {
        User user = userRepository.findByEmail(email);

        return Jwts.builder()
                .setSubject(email)
                .claim("role", "ROLE_" + user.getRole().name())
                .claim("userId", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + JWT_EXPIRATION))
                .signWith(key)
                .compact();
    }

    public String generateToken(Authentication authentication) {
        return generateToken(authentication.getName());
    }

    public String getUserEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}