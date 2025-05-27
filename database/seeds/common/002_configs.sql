-- Seed application configuration settings

INSERT INTO configs (CONFIG_NAME, CONFIG_VALUE) VALUES
    ('APP_NAME', 'RefURL'),
    ('APP_VERSION', '1.0.0'),
    ('APP_DESCRIPTION', 'REF URL Shortener Service'),
    ('MAX_URL_LENGTH', '2048'),
    ('MIN_SHORT_CODE_LENGTH', '4'),
    ('MAX_SHORT_CODE_LENGTH', '10'),
    ('DEFAULT_EXPIRY_DAYS', '30'),
    ('ALLOW_CUSTOM_CODES', 'true'),
    ('REQUIRE_REGISTRATION', 'false'),
    ('ANALYTICS_ENABLED', 'true'),
    ('RATE_LIMIT_PER_HOUR', '100'),
    ('RATE_LIMIT_PER_DAY', '1000'),
    ('MAINTENANCE_MODE', 'false'),
    ('REGISTRATION_ENABLED', 'true'),
    ('EMAIL_VERIFICATION_REQUIRED', 'false'),
    ('DEFAULT_THEME', 'light'),
    ('CONTACT_EMAIL', 'contact@ref.si'),
    ('PRIVACY_POLICY_URL', 'https://url.ref.si/privacy'),
    ('TERMS_OF_SERVICE_URL', 'https://url.ref.si/terms'),
    ('SUPPORT_URL', 'https://url.ref.si/support');
