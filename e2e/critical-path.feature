Feature: Guest checkout
  Scenario: Guest can browse and prepare a purchase
    Given a guest is on the ReactFood menu
    When they search for "Mac" and add Mac & Cheese to the cart
    Then the cart count increases
    And the guest can open checkout without creating an account

Feature: Admin meal management
  Scenario: Admin can create a meal safely
    Given an authenticated admin is on the meals management screen
    When they submit a valid meal form once
    Then the meal appears in the current menu
    And deleting a meal requires confirmation
