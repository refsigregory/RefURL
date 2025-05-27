-- Seed sample URLs for demonstration

INSERT INTO urls (owner, original_url, short_code, title, clicks) VALUES
    -- Admin user URLs (user id: 1)
    (1, 'https://ref.si', 'refsi', 'Refsi', 0),
    (1, 'https://url.ref.si', 'url', 'REF URL Shortener', 1),

    -- Demo user URLs (user id: 2)
    (2, 'https://portfolio.ref.si', 'portfolio', 'Portfolio', 0),
    (2, 'https://ref.si/files/cv.pdf', 'download-cv', 'Download My CV', 0),
    
    -- Public URLs (no owner)
    (NULL, 'https://www.frenlog.com', 'frenlog', 'FrenLog!', 0);
