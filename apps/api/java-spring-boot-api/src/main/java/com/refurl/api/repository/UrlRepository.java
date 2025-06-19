package com.refurl.api.repository;

import com.refurl.api.model.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
    Optional<Url> findByShortCode(String shortCode);
    List<Url> findByOwnerId(Long ownerId);
    boolean existsByShortCode(String shortCode);

    @Modifying
    @Query("UPDATE Url u SET u.clicks = u.clicks + 1, u.clicksAt = CURRENT_TIMESTAMP WHERE u.id = :id")
    void incrementClicks(Long id);
} 