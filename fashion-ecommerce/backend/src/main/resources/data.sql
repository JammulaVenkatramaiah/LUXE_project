-- Insert Categories
INSERT INTO categories (name, description, image_url, slug) VALUES
('Men', 'Premium mens clothing collection', 'https://via.placeholder.com/400x300?text=Men', 'men'),
('Women', 'Elegant womens fashion collection', 'https://via.placeholder.com/400x300?text=Women', 'women'),
('Kids', 'Trendy kids wear collection', 'https://via.placeholder.com/400x300?text=Kids', 'kids'),
('Accessories', 'Premium accessories and more', 'https://via.placeholder.com/400x300?text=Accessories', 'accessories'),
('Shoes', 'Latest footwear collection', 'https://via.placeholder.com/400x300?text=Shoes', 'shoes');

-- Insert Sample Products
INSERT INTO products (name, description, price, discount_price, category_id, brand, stock_quantity, rating, is_featured, image_url) VALUES
('Premium Cotton T-Shirt', 'High quality 100% cotton t-shirt with modern design', 49.99, 39.99, 1, 'StyleBrand', 150, 4.5, TRUE, 'https://placehold.co/400x500?text=T-Shirt'),
('Slim Fit Jeans', 'Comfortable and stylish slim fit jeans for men', 89.99, 74.99, 1, 'DenimMax', 200, 4.3, TRUE, 'https://placehold.co/400x500?text=Jeans'),
('Classic Black Blazer', 'Elegant blazer perfect for formal occasions', 199.99, 149.99, 1, 'FormalWear', 80, 4.7, FALSE, 'https://placehold.co/400x500?text=Blazer'),
('Elegant Summer Dress', 'Light and breathable summer dress with floral pattern', 79.99, 59.99, 2, 'ElegantLine', 120, 4.6, TRUE, 'https://placehold.co/400x500?text=Dress'),
('Designer Handbag', 'Premium leather handbag with gold accents', 249.99, 199.99, 2, 'LuxuryBags', 50, 4.8, TRUE, 'https://placehold.co/400x500?text=Handbag'),
('Kids Colorful Hoodie', 'Comfortable hoodie for kids with fun prints', 44.99, 34.99, 3, 'KidsFashion', 180, 4.4, FALSE, 'https://placehold.co/400x500?text=Hoodie'),
('Stylish Sneakers', 'Modern sporty sneakers for everyday wear', 129.99, 99.99, 5, 'SportStyle', 150, 4.5, TRUE, 'https://placehold.co/400x500?text=Sneakers'),
('Silk Scarf', 'Luxurious silk scarf with elegant patterns', 59.99, 44.99, 4, 'AccessoryCo', 200, 4.7, FALSE, 'https://placehold.co/400x500?text=Scarf'),
('Leather Belt', 'Premium leather belt with designer buckle', 69.99, 54.99, 4, 'AccessoryCo', 150, 4.6, FALSE, 'https://placehold.co/400x500?text=Belt'),
('Wool Coat', 'Warm and elegant wool coat for winter', 299.99, 249.99, 2, 'CoatCollection', 60, 4.8, TRUE, 'https://placehold.co/400x500?text=Coat');

-- Insert Users (password is 'password123')
INSERT INTO users (name, email, password, phone, address, city, state, postal_code, country, role, is_active) VALUES
('Admin User', 'admin@fashion.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00dmxs.TVuHOnu', '9876543210', '123 Admin Street', 'New York', 'NY', '10001', 'USA', 'ADMIN', TRUE),
('John Doe', 'john@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00dmxs.TVuHOnu', '9123456780', '456 Main Street', 'Los Angeles', 'CA', '90001', 'USA', 'USER', TRUE),
('Jane Smith', 'jane@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00dmxs.TVuHOnu', '9234567891', '789 Oak Avenue', 'Chicago', 'IL', '60601', 'USA', 'USER', TRUE),
('Mike Wilson', 'mike@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00dmxs.TVuHOnu', '9345678902', '321 Pine Road', 'Houston', 'TX', '77001', 'USA', 'USER', TRUE);
