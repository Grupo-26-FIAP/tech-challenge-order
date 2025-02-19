Feature: Order list retrieval

  Scenario: Verify that the system retrieves all orders
    Given the system is running
    When I request the list of all orders
    Then the system should return the list of orders with HTTP code 200
