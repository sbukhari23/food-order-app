import type { Meal } from './types';

export const meals: Meal[] = [
  ['m1','Mac & Cheese',8.99,'Creamy cheddar cheese mixed with perfectly cooked macaroni, topped with crispy breadcrumbs. A classic comfort food.','images/mac-and-cheese.jpg','Comfort'],
  ['m2','Margherita Pizza',12.99,'A classic pizza with fresh mozzarella, tomatoes, and basil on a thin and crispy crust.','images/margherita-pizza.jpg','Italian'],
  ['m3','Caesar Salad',7.99,'Romaine lettuce tossed in Caesar dressing, topped with croutons and parmesan shavings.','images/caesar-salad.jpg','Salads'],
  ['m4','Spaghetti Carbonara',10.99,'Al dente spaghetti with a creamy sauce made from egg yolk, pecorino cheese, pancetta, and pepper.','images/spaghetti-carbonara.jpg','Italian'],
  ['m5','Veggie Burger',9.99,'A juicy veggie patty served on a whole grain bun with lettuce, tomato, and a tangy sauce.','images/veggie-burger.jpg','Burgers'],
  ['m6','Grilled Chicken Sandwich',10.99,'Tender grilled chicken breast with avocado, bacon, lettuce, and honey mustard on a toasted bun.','images/grilled-chicken-sandwich.jpg','Sandwiches'],
  ['m7','Steak Frites',17.99,'Succulent steak cooked to your preference, served with crispy golden fries and herb butter.','images/steak-frites.jpg','Mains'],
  ['m8','Sushi Roll Platter',15.99,'An assortment of fresh sushi rolls including California, Spicy Tuna, and Eel Avocado.','images/sushi-roll-platter.jpg','Asian'],
  ['m9','Chicken Curry',13.99,'Tender pieces of chicken simmered in a rich and aromatic curry sauce, served with basmati rice.','images/chicken-curry.jpg','Asian'],
  ['m10','Vegan Buddha Bowl',11.99,'A hearty bowl filled with quinoa, roasted veggies, avocado, and a tahini dressing.','images/vegan-buddha-bowl.jpg','Vegan'],
  ['m11','Seafood Paella',19.99,'A Spanish delicacy filled with saffron-infused rice, shrimp, mussels, and chorizo.','images/seafood-paella.jpg','Spanish'],
  ['m12','Pancake Stack',8.99,'Fluffy pancakes stacked high, drizzled with maple syrup and topped with fresh berries.','images/pancake-stack.jpg','Breakfast'],
  ['m13','Miso Ramen',12.99,'A warming bowl of ramen with miso broth, tender pork, soft-boiled egg, and green onions.','images/miso-ramen.jpg','Asian'],
  ['m14','Beef Tacos',9.99,'Three soft tortillas filled with seasoned beef, fresh salsa, cheese, and sour cream.','images/beef-tacos.jpg','Mexican'],
  ['m15','Chocolate Brownie',5.99,'A rich and fudgy brownie, topped with a scoop of vanilla ice cream and chocolate sauce.','images/chocolate-brownie.jpg','Desserts'],
  ['m16','Lobster Bisque',14.99,'A creamy soup made from lobster stock, aromatic vegetables, and a touch of brandy.','images/lobster-bisque.jpg','Mains'],
  ['m17','Mushroom Risotto',13.99,'Creamy Arborio rice cooked with a medley of wild mushrooms and finished with parmesan.','images/mushroom-risotto.jpg','Italian'],
  ['m18','Eggplant Parmesan',11.99,'Layers of breaded eggplant, marinara sauce, and melted mozzarella and parmesan cheeses.','images/eggplant-parmesan.jpg','Italian'],
  ['m19','Lemon Cheesecake',6.99,'A creamy cheesecake with a tangy lemon flavor, served on a crumbly biscuit base.','images/lemon-cheesecake.jpg','Desserts'],
  ['m20','Falafel Wrap',8.99,'Crispy falafels wrapped in a warm pita with lettuce, tomatoes, and a tahini sauce.','images/falafel-wrap.jpg','Vegan'],
].map(([id, name, price, description, image, category]) => ({ id: id as string, name: name as string, price: price as number, description: description as string, image: image as string, category: category as string }));

export const categories = [...new Set(meals.map((meal) => meal.category))];
