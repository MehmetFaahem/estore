# Setup Instructions

1. **Clone the Repository:**
   ```bash
   https://github.com/MehmetFaahem/estore.git
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Application:**
   ```bash
   npm run dev
   ```

# Test Instructions

- **Total 27 Tests**
- **Total 4 Test Suites**
    - All Api Calls
    - Cart Functionality
    - Product Fetching
    - Searching

- **Run Tests:**
   ```bash
   npm run test
   ```

# Features Implemented   
- **Product Search**: Users can search for products using a search bar. The search results are fetched from an API.
- **Cart Management**: Users can add, remove, and update product quantities in their shopping cart. Discounts are applied to specific products.
- **Product Filters**: Users can filter products by category, price range, and stock availability.
- **Responsive UI Components**: Utilizes Radix UI components for building accessible and responsive UI elements like checkboxes, progress bars, and collapsible sections.

# Technical Decisions and Reasoning

- **Next.js Framework**: Chosen for its server side rendering capabilities and ease of building dynamic web applications.
- **Zustand used instead of Redux for State Management**: Used for managing global state, particularly for cart and filter operations, due to its simplicity and performance.
- **Tailwind CSS**: Selected for styling due to its utility first approach, allowing for rapid UI development.
- **Jest and Testing Library**: Used for testing components and hooks to ensure reliability and maintainability of the codebase.

# Assumptions Made

- **Product Data**: Assumed to be static and fetched from a local API endpoint. This can be extended to fetch from a remote server.
- **Discount Logic**: Applied a 10% discount to products containing "HuluLulu" in their description, assuming this is a promotional offer.
- **Environment Configuration**: Assumed that environment variables are set up correctly for API base URLs and other configurations.

# Future Improvements

- **Authentication and User Accounts**: Implement user authentication and accounts to allow users to save their shopping carts and track order history.

- **Product Pagination**: Enhance the product listing page with sorting options and pagination to improve user experience.

- **Dynamic Product Data**: Integrate with a real backend service to fetch live product data and handle CRUD operations.

- **Improved UI/UX**: Enhance the design and accessibility of the application using advanced Tailwind CSS features and animations.

- **Error Handling**: Implement comprehensive error handling to provide meaningful feedback to users in case of issues.

- **Performance Optimization**: Analyze and optimize the application's performance, particularly in terms of API calls and state management.

- **Additional Testing**: Expand test coverage to include more edge cases and integration tests.