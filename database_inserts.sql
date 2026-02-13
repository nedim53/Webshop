-- ============================================
-- Neptis Webshop - Kreativni INSERT upiti
-- ============================================
-- Svaka tabela ima po 10 interesantnih inserta
-- ============================================

-- ============================================
-- 1. USERS_WEBSHOP - Kreativni korisnici
-- ============================================
INSERT INTO users_webshop (username, password_hash, is_admin, first_name, last_name, email, city, country, phone) VALUES
('artemis_moon', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5K5K5K5K5K', false, 'Artemis', 'Luna', 'artemis.luna@starlight.com', 'Sarajevo', 'Bosna i Hercegovina', '+38761234567'),
('neptun_waves', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5K5K5K5K5K', false, 'Neptun', 'Valović', 'neptun.valovic@ocean.com', 'Split', 'Hrvatska', '+38591234567'),
('phoenix_rising', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5K5K5K5K5K', true, 'Phoenix', 'Fireborn', 'phoenix.admin@neptis.com', 'Zagreb', 'Hrvatska', '+38591234568'),
('aurora_borealis', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5K5K5K5K5K', false, 'Aurora', 'Nordic', 'aurora.nordic@northernlights.no', 'Oslo', 'Norveška', '+4712345678'),
('cosmic_dreamer', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5K5K5K5K5K', false, 'Cosmic', 'Stardust', 'cosmic.stardust@galaxy.com', 'Belgrade', 'Srbija', '+381601234567'),
('zen_master', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5K5K5K5K5K', false, 'Zen', 'Meditation', 'zen.meditation@peace.com', 'Ljubljana', 'Slovenija', '+38640123456'),
('viking_warrior', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5K5K5K5K5K', false, 'Ragnar', 'Thorsson', 'ragnar.thorsson@valhalla.se', 'Stockholm', 'Švedska', '+46701234567'),
('dragon_whisperer', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5K5K5K5K5K', false, 'Draco', 'Mystic', 'draco.mystic@magic.com', 'Mostar', 'Bosna i Hercegovina', '+38762123456'),
('ocean_depths', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5K5K5K5K5K', false, 'Marina', 'Abyss', 'marina.abyss@deepsea.com', 'Dubrovnik', 'Hrvatska', '+38591234569'),
('starlight_wanderer', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5K5K5K5K5K', false, 'Stella', 'Nebula', 'stella.nebula@cosmos.com', 'Podgorica', 'Crna Gora', '+38267123456');

-- ============================================
-- 2. PRODUCTS_WEBSHOP - Kreativni proizvodi
-- ============================================
INSERT INTO products_webshop (name, description, price, image_url, quantity, date_posted, status, seller_id) VALUES
('Magični Kristalni Prsten', 'Prsten sa autentičnim kvarcnim kristalom koji donosi pozitivnu energiju. Ručno izrađen od srebra 925.', 89.99, 'https://images.neptis.com/products/magic-ring.jpg', 15, '2024-01-15 10:30:00', 'approved', 1),
('Vikingski Čašica za Medovinu', 'Autentična drvena čaša ukrašena runskim simbolima. Idealna za tradicionalne ceremonije.', 45.50, 'https://images.neptis.com/products/viking-cup.jpg', 8, '2024-01-16 14:20:00', 'approved', 7),
('Aurora Borealis LED Lampica', 'LED lampica koja simulira sjaj sjeverne svjetlosti. Promjenjive boje i intenzitet.', 129.99, 'https://images.neptis.com/products/aurora-lamp.jpg', 12, '2024-01-17 09:15:00', 'approved', 4),
('Zen Meditacijski Jastuk', 'Ergonomičan jastuk napunjen lavandom i eukaliptusom za opuštanje i meditaciju.', 34.99, 'https://images.neptis.com/products/zen-pillow.jpg', 25, '2024-01-18 11:45:00', 'approved', 6),
('Dragon Scale Kožna Torba', 'Ručno izrađena torba od prave kože sa ukrasom koji podsjeća na zmajsku ljusku.', 199.99, 'https://images.neptis.com/products/dragon-bag.jpg', 5, '2024-01-19 16:30:00', 'pending', 8),
('Cosmic Star Map Poster', 'Personalizovana mapa zvijezda za datum rođenja. Print visoke rezolucije na premium papiru.', 24.99, 'https://images.neptis.com/products/star-map.jpg', 50, '2024-01-20 13:00:00', 'approved', 5),
('Neptunova Trina', 'Ukrasna trina sa motivom morskih valova i školjki. Srebro sa plavim akvamarinom.', 67.50, 'https://images.neptis.com/products/neptune-necklace.jpg', 18, '2024-01-21 10:20:00', 'approved', 2),
('Phoenix Fire Aromatična Svijeća', 'Svijeća sa notama vanilije, cimeta i drveta. Gorit će 40 sati i ispuniti prostor toplinom.', 19.99, 'https://images.neptis.com/products/phoenix-candle.jpg', 30, '2024-01-22 15:10:00', 'approved', 3),
('Ocean Depths Akvarijum Set', 'Kompletan set za mali akvarijum sa LED osvjetljenjem i filterom. Uključuje sve potrebno.', 299.99, 'https://images.neptis.com/products/aquarium-set.jpg', 3, '2024-01-23 12:30:00', 'rejected', 9),
('Starlight Projector', 'Projektor koji stvara magičnu atmosferu zvijezda na stropu. Bluetooth kontrolisan.', 79.99, 'https://images.neptis.com/products/starlight-projector.jpg', 20, '2024-01-24 14:45:00', 'approved', 10);

-- ============================================
-- 3. CARTS_WEBSHOP - Korpe korisnika
-- ============================================
-- Napomena: user_id mora biti UNIQUE, tako da svaki korisnik može imati samo jednu korpu
INSERT INTO carts_webshop (user_id, created_at, updated_at) VALUES
(1, '2024-02-01 08:15:00', '2024-02-05 18:30:00'),  -- cart_id = 1 (Artemis)
(2, '2024-02-02 10:20:00', '2024-02-06 14:45:00'),  -- cart_id = 2 (Neptun)
(4, '2024-02-03 12:00:00', '2024-02-03 12:00:00'),  -- cart_id = 3 (Aurora)
(5, '2024-02-04 09:30:00', '2024-02-07 16:20:00'),  -- cart_id = 4 (Cosmic)
(6, '2024-02-05 11:45:00', '2024-02-08 10:15:00'),  -- cart_id = 5 (Zen)
(7, '2024-02-06 13:20:00', '2024-02-09 19:00:00'),  -- cart_id = 6 (Viking)
(8, '2024-02-07 15:10:00', '2024-02-10 11:30:00'),  -- cart_id = 7 (Dragon)
(9, '2024-02-08 16:40:00', '2024-02-11 13:45:00'),  -- cart_id = 8 (Ocean)
(10, '2024-02-09 14:25:00', '2024-02-12 15:10:00'); -- cart_id = 9 (Starlight)
-- Napomena: Phoenix (user_id=3) je admin i možda ne treba korpu, ili možete dodati kasnije

-- ============================================
-- 4. CART_ITEMS_WEBSHOP - Stavke u korpama
-- ============================================
-- Napomena: cart_id odgovara ID-ovima iz carts_webshop (1-9)
INSERT INTO cart_items_webshop (cart_id, product_id, quantity) VALUES
(1, 1, 2),   -- Artemis (cart_id=1) ima 2 magična prstena
(1, 7, 1),   -- Artemis (cart_id=1) ima 1 Neptunovu trinu
(2, 2, 1),   -- Neptun (cart_id=2) ima 1 vikingsku čašicu
(2, 3, 1),   -- Neptun (cart_id=2) ima 1 Aurora lampicu
(3, 4, 3),   -- Aurora (cart_id=3) ima 3 zen jastuka
(3, 6, 1),   -- Aurora (cart_id=3) ima 1 cosmic star map
(4, 5, 1),   -- Cosmic (cart_id=4) ima 1 dragon torbu
(4, 10, 2),  -- Cosmic (cart_id=4) ima 2 starlight projektora
(5, 8, 5),   -- Zen (cart_id=5) ima 5 phoenix svijeća
(5, 4, 2),   -- Zen (cart_id=5) ima 2 zen jastuka
(6, 2, 2),   -- Viking (cart_id=6) ima 2 vikingske čašice
(6, 1, 1),   -- Viking (cart_id=6) ima 1 magični prsten
(7, 5, 1),   -- Dragon (cart_id=7) ima 1 dragon torbu
(7, 8, 3),   -- Dragon (cart_id=7) ima 3 phoenix svijeće
(8, 3, 1),   -- Ocean (cart_id=8) ima 1 Aurora lampicu
(8, 7, 2),   -- Ocean (cart_id=8) ima 2 Neptunove trine
(9, 6, 1),   -- Starlight (cart_id=9) ima 1 star map
(9, 10, 1);  -- Starlight (cart_id=9) ima 1 starlight projektor

-- ============================================
-- 5. ORDERS_WEBSHOP - Narudžbe
-- ============================================
INSERT INTO orders_webshop (customer_name, address, phone, email, status, date_created, date_decided) VALUES
('Artemis Luna', 'Zmaja od Bosne 15, Sarajevo 71000', '+38761234567', 'artemis.luna@starlight.com', 'completed', '2024-01-25 10:00:00', '2024-01-25 14:30:00'),
('Neptun Valović', 'Riva 22, Split 21000', '+38591234567', 'neptun.valovic@ocean.com', 'accepted', '2024-01-26 11:15:00', '2024-01-26 16:00:00'),
('Aurora Nordic', 'Karl Johans gate 1, Oslo 0162', '+4712345678', 'aurora.nordic@northernlights.no', 'pending', '2024-01-27 09:30:00', NULL),
('Cosmic Stardust', 'Knez Mihailova 15, Belgrade 11000', '+381601234567', 'cosmic.stardust@galaxy.com', 'completed', '2024-01-28 13:45:00', '2024-01-28 18:20:00'),
('Zen Meditation', 'Prešernova cesta 10, Ljubljana 1000', '+38640123456', 'zen.meditation@peace.com', 'accepted', '2024-01-29 15:20:00', '2024-01-29 20:10:00'),
('Ragnar Thorsson', 'Drottninggatan 5, Stockholm 11151', '+46701234567', 'ragnar.thorsson@valhalla.se', 'rejected', '2024-01-30 08:00:00', '2024-01-30 12:00:00'),
('Draco Mystic', 'Mostarska 25, Mostar 88000', '+38762123456', 'draco.mystic@magic.com', 'completed', '2024-02-01 16:30:00', '2024-02-01 19:45:00'),
('Marina Abyss', 'Stradun 7, Dubrovnik 20000', '+38591234569', 'marina.abyss@deepsea.com', 'pending', '2024-02-02 10:15:00', NULL),
('Stella Nebula', 'Njegoševa 12, Podgorica 81000', '+38267123456', 'stella.nebula@cosmos.com', 'accepted', '2024-02-03 14:00:00', '2024-02-03 17:30:00'),
('Artemis Luna', 'Zmaja od Bosne 15, Sarajevo 71000', '+38761234567', 'artemis.luna@starlight.com', 'completed', '2024-02-04 11:45:00', '2024-02-04 15:20:00');

-- ============================================
-- 6. ORDER_ITEMS_WEBSHOP - Stavke narudžbi
-- ============================================
INSERT INTO order_items_webshop (order_id, product_id, quantity, price_at_order_time) VALUES
-- Order 1: Artemis - Magični prsten i Neptunova trina
(1, 1, 1, 89.99),
(1, 7, 1, 67.50),

-- Order 2: Neptun - Vikingska čašica
(2, 2, 1, 45.50),

-- Order 3: Aurora - Zen jastuk i Star map
(3, 4, 2, 34.99),
(3, 6, 1, 24.99),

-- Order 4: Cosmic - Dragon torba i Starlight projektor
(4, 5, 1, 199.99),
(4, 10, 1, 79.99),

-- Order 5: Zen - Phoenix svijeće
(5, 8, 3, 19.99),

-- Order 6: Ragnar - Vikingska čašica (rejected)
(6, 2, 1, 45.50),

-- Order 7: Draco - Dragon torba i Phoenix svijeće
(7, 5, 1, 199.99),
(7, 8, 2, 19.99),

-- Order 8: Marina - Aurora lampica
(8, 3, 1, 129.99),

-- Order 9: Stella - Star map i Starlight projektor
(9, 6, 1, 24.99),
(9, 10, 1, 79.99),

-- Order 10: Artemis (drugi) - Magični prsten
(10, 1, 1, 89.99);

-- ============================================
-- KRAJ INSERT UPITA
-- ============================================
-- Provjerite podatke:
-- SELECT COUNT(*) FROM users_webshop;
-- SELECT COUNT(*) FROM products_webshop;
-- SELECT COUNT(*) FROM carts_webshop;
-- SELECT COUNT(*) FROM cart_items_webshop;
-- SELECT COUNT(*) FROM orders_webshop;
-- SELECT COUNT(*) FROM order_items_webshop;
-- ============================================

