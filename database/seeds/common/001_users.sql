-- Seed initial users for RefURL application

INSERT INTO users (email, name, password) VALUES
    ('admin@url.ref.si', 'System Administrator', 'dummypassword'),
    ('refsi@refsi.si', 'Refsi', 'dummypassword');
