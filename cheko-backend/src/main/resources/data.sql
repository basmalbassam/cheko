-- ───── BREAKFAST ─────
INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (1, 'Avocado Toast', 'Toasted sourdough topped with smashed avocado, a perfectly poached egg, chili flakes, and a drizzle of olive oil. A fresh and energizing start to your day.', 32, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=640&h=480&fit=crop', 420, 'Breakfast', 24.7136, 46.6753)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (2, 'Fluffy Pancakes', 'A golden stack of thick, fluffy pancakes served with warm maple syrup and a dusting of powdered sugar. Soft on the inside, lightly crisp on the edges.', 28, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=640&h=480&fit=crop', 520, 'Breakfast', 24.6877, 46.7219)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (3, 'Blueberry Pancakes', 'Buttermilk pancakes stacked high and topped with fresh blueberries. Sweet, fruity, and irresistible.', 30, 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=640&h=480&fit=crop', 540, 'Breakfast', 24.8, 46.75)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (4, 'Eggs Benedict', 'A perfectly poached egg with a gloriously runny yolk, layered over silky smoked salmon on a toasted muffin, smothered in rich hollandaise sauce and finished with a crack of black pepper and dried herbs.', 35, 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=640&h=480&fit=crop', 480, 'Breakfast', 24.72, 46.63)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (5, 'Crispy Waffles', 'Two golden Belgian waffles with perfectly defined deep pockets and a crisp, lightly caramelized exterior, with fresh blueberries and a side of warm maple syrup.', 27, 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=640&h=480&fit=crop', 510, 'Breakfast', 24.75, 46.72)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (6, 'French Toast', 'Triangle-cut French toast slices , golden and caramelized on the outside with a soft custardy interior, served with whipped cream and fresh strawberries.', 29, 'https://images.unsplash.com/photo-1588484588657-0bbbee05132f?w=640&h=480&fit=crop', 530, 'Breakfast', 24.6877, 46.7219)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (7, 'Golden Fried Eggs', 'farm-fresh eggs fried in butter until the whites are set and the yolks are still gloriously runny, served on rustic toasted bread with a sprinkle of sea salt.', 22, 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=640&h=480&fit=crop', 300, 'Breakfast', 24.7136, 46.6753)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (8, 'Smoothie Bowl', 'A thick and creamy acai smoothie bowl loaded with granola, sliced banana, fresh kiwi, chia seeds, and a drizzle of honey. Nutritious, vibrant, and filling.', 25, 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=640&h=480&fit=crop', 350, 'Breakfast', 24.8, 46.75)
    ON CONFLICT (id) DO NOTHING;

-- ───── DRINKS ─────
INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (9, 'Americano', 'A bold shot of espresso diluted with hot water, strong, and unapologetically rich — the purist choice for true coffee lovers.', 8, 'https://images.unsplash.com/photo-1587985782608-20062892559d?w=640&h=480&fit=crop', 5, 'Drinks', 24.75, 46.72)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (10, 'Flat White', 'A double ristretto espresso topped with velvety microfoam milk, served in a small ceramic cup with a delicate latte art rosette. Intense, creamy, and perfectly balanced — the coffee lover''s daily ritual.', 12, 'https://images.unsplash.com/photo-1611564494260-6f21b80af7ea?w=640&h=480&fit=crop', 120, 'Drinks', 24.6877, 46.7219)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (11, 'Chinese Black Tea', 'A ruby-red tea, served alongside a handcrafted clay teapot on a bamboo tray. Earthy, smooth, and ceremonial — brewed the traditional way for a mindful, unhurried moment.', 6, 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=640&h=480&fit=crop', 2, 'Drinks', 24.72, 46.63)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (12, 'Herbal Tea', 'A golden floral tea blooming with a dried chrysanthemum, lavender buds, and rose hips. Fragrant, healing, and beautifully wild.', 7, 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=640&h=480&fit=crop', 5, 'Drinks', 24.7136, 46.6753)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (13, 'Fresh Orange Juice', 'Bright, sun-coloured orange juice served in a chiselled crystal glass, garnished with two fresh orange wedges. Naturally sweet, pulpy, and vibrantly refreshing — squeezed to order and served chilled.', 14, 'https://images.unsplash.com/photo-1641659735894-45046caad624?w=640&h=480&fit=crop', 110, 'Drinks', 24.75, 46.72)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (14, 'Lemon Mint Cooler', 'A tall glass of freshly squeezed lemonade packed with ice and vibrant mint leaves, surrounded by whole and halved lemons on a rustic wooden board. Ice-cold, zesty, and incredibly refreshing.', 13, 'https://images.unsplash.com/photo-1507281549113-040fcfef650e?w=640&h=480&fit=crop', 90, 'Drinks', 24.6877, 46.7219)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (15, 'Soft Drinks', 'A chilled lineup of classic fizzy favourites — Coca-Cola, Diet Coke, Fanta, and Sprite — served ice-cold in the can. Pick your flavour and enjoy the perfect refreshing sip alongside your meal.', 6, 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=640&h=480&fit=crop', 140, 'Drinks', 24.7136, 46.6753)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (16, 'Mocktail Trio', 'Three vibrant alcohol-free cocktails lined up on a warm wooden bar — a creamy pineapple cherry blend, a crisp lime mojito with fresh mint, and a bold dragon fruit cooler. Festive, fruity, and completely refreshing.', 18, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=640&h=480&fit=crop', 150, 'Drinks', 24.72, 46.63)
    ON CONFLICT (id) DO NOTHING;

-- ───── SOUPS ─────
INSERT INTO menu (id, name, description, price, image, calorie, category, lat, lng)
VALUES (17, 'Ramen Bowl', 'Ramen bowl, packed with springy noodles, a jammy soft-boiled egg, sweet corn, spiced minced meat, crisp bok choy, fresh lettuce, and spring onions in a rich savoury broth. A complete, satisfying bowl.', 28, 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=640&h=480&fit=crop', 450, 'Soups', 24.7136, 46.6753)
    ON CONFLICT (id) DO NOTHING;

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
