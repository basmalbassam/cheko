-- 5 RESTAURANT LOCATIONS
--   R1 (24.7136, 46.6753) — Full menu  — ids   1-30
--   R2 (24.6877, 46.7219) — Full menu  — ids  31-60
--   R3 (24.7500, 46.7200) — Full menu  — ids  61-90
--   R4 (24.7200, 46.6500) — No Breakfast — ids  91-112
--   R5 (24.6600, 46.7000) — No Breakfast — ids 113-134

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (18, 'Tomato Basil Soup', 'Slow-roasted vine tomatoes blended with fresh basil, garlic, and a swirl of cream. Velvety smooth and deeply flavourful, served with crusty sourdough on the side.', 22, 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=640&h=480&fit=crop', 200, 'Soups', 24.75, 46.72)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (19, 'Miso Soup', 'Traditional Japanese white miso broth with clear miso broth, silken tofu, wakame seaweed, and enoki mushrooms. Light, clean, and deeply umami.', 20, 'https://images.unsplash.com/photo-1680137248903-7af5d51a3350?w=640&h=480&fit=crop', 150, 'Soups', 24.6877, 46.7219)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (20, 'Thai Red Curry Soup', 'A vibrant orange-red coconut broth, loaded with tender chicken, sliced red peppers, and kaffir lime leaves. Aromatic, mildly spicy, and rich with Thai flavours.', 26, 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=640&h=480&fit=crop', 350, 'Soups', 24.8, 46.75)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (21, 'Cream of Mushroom', 'A silky mushroom velouté, topped with a single sautéed mushroom slice, accompanied by rustic bread croutons. Rich, earthy, and elegantly presented.', 24, 'https://images.unsplash.com/photo-1608376630927-d064ac74866e?w=640&h=480&fit=crop', 300, 'Soups', 24.72, 46.63)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (22, 'Pumpkin Soup', 'A velvety smooth pumpkin soup, topped with crumbled feta cheese, toasted pumpkin seeds, and a dusting of smoked paprika. Naturally sweet, warmly spiced, and beautifully comforting.', 23, 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=640&h=480&fit=crop', 200, 'Soups', 24.75, 46.72)
    ON CONFLICT (id) DO NOTHING;

-- ───── SUSHI ─────
INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (23, 'Tuna Roll', 'Plump sushi rolls topped with fresh slices of ruby-red tuna, vibrant tobiko roe, creamy avocado, and delicate microgreens, served with a drizzle of spicy mayo. Premium, indulgent, and visually stunning.', 42, 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=640&h=480&fit=crop', 320, 'Sushi', 24.7136, 46.6753)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (24, 'Sushi Platter', 'A curated selection of premium nigiri and maki rolls featuring salmon, tuna, ebi, and cucumber. Perfectly seasoned sushi rice with fresh wasabi and pickled ginger.', 65, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=640&h=480&fit=crop', 480, 'Sushi', 24.6877, 46.7219)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (25, 'Avocado Tuna Roll', 'Sushi rolls topped with silky fresh tuna and creamy avocado, generously drizzled with spicy mayo, garnished with sliced spring onions, sesame seeds, and a dusting of chili flakes. Bold, creamy, and impossible to resist.', 45, 'https://images.unsplash.com/photo-1768326119762-20c2a9f5c1f2?w=640&h=480&fit=crop', 350, 'Sushi', 24.8, 46.75)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (26, 'Salmon Cream Roll', 'A stunning cross-section of a salmon roll revealing a generous cream cheese and tuna filling, wrapped in seasoned rice and topped with fresh salmon, spring onions, and a drizzle of sweet soy sauce.', 50, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=640&h=480&fit=crop', 400, 'Sushi', 24.75, 46.72)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (27, 'Salmon Nigiri', 'Hand-pressed sushi rice topped with lightly torched salmon, wrapped with a nori band and garnished with fresh herbs and a dot of mayo, served on a stone plate with pickled ginger, wasabi, soy sauce, and chili flakes on the side.', 38, 'https://images.unsplash.com/photo-1680675228874-9b9963812b7c?w=640&h=480&fit=crop', 300, 'Sushi', 24.6877, 46.7219)
    ON CONFLICT (id) DO NOTHING;

-- ───── RICE ─────
INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (28, 'Wok Fried Rice', 'A generous mound of golden fried rice loaded with green peas, sweet corn, diced carrots, and tender chicken pieces, served with fresh baby carrots and cucumber sticks on the side. Hearty, flavourful, and satisfying.', 45, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=640&h=480&fit=crop', 550, 'Rice', 24.8, 46.75)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (29, 'Seafood Rice', 'A vibrant bowl of golden spiced rice packed with juicy prawns, mixed vegetables, and red chili, topped generously with fresh coriander and lemon wedges. Bold, aromatic, and full of flavour.', 60, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=640&h=480&fit=crop', 600, 'Rice', 24.7136, 46.6753)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (30, 'Chicken Biryani', 'Fragrant saffron-tinted basmati rice piled high in a traditional copper handi, studded with tomatoes, caramelized onions, and fresh curry leaves, served with a rich brown gravy on the side. Aromatic, spiced, and deeply satisfying.', 48, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=640&h=480&fit=crop', 650, 'Rice', 24.75, 46.72)
    ON CONFLICT (id) DO NOTHING;
