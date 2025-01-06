# Sprint Backlog - Week 1 (Weeks 1-3)

## Sprint Goal:
Deliver core functionality for account management, food entry management, calorie threshold management, and basic expenditure tracking.

## User Stories for Week 1:

### Account Management (User Stories 1-2)
1. **As a user, I want to register an account by providing my name, email, and password, so that I can access the application securely.**
   - Tasks:
     - Frontend: Design and implement the user registration page.
     - Frontend: Create form validation for name, email, and password.
     - Backend: Set up user registration logic to store data securely.
     - Backend: Hash passwords before storing in the database.
     - Frontend: Display appropriate error or success messages.
   
2. **As a user, I want to log in to my account using my email and password, so that I can access my personalized dashboard.**
   - Tasks:
     - Frontend: Design and implement the login page.
     - Frontend: Create form validation for email and password.
     - Backend: Set up user authentication logic.
     - Frontend: Use session management to store the logged-in user's information.
     - Frontend: Display appropriate error or success messages.

**Estimated Points for Week 1:** 5 points

---

### Add a New Food Entry (User Stories 3-4)
3. **As a user, I want to add a food entry with details like date, time, food name, and calorie value, so that I can track my dietary intake.**
   - Tasks:
     - Frontend: Create a form to add food entries.
     - Frontend: Implement form validation for food name, date, and calorie value.
     - Backend: Implement logic to handle and store food entries.
     - Backend: Ensure proper sanitization of input before storing in the database.

4. **As a user, I want to view all my food entries in a list format, so that I can review my daily consumption.**
   - Tasks:
     - Frontend: Fetch and display food entries from the database.
     - Frontend: Implement pagination or infinite scroll for large lists.
     - Backend: Ensure food entries are fetched based on the logged-in user.

**Estimated Points for Week 1:** 3 points

---

## Sprint Planning for Week 1:

- **Total Points for Week 1:** 8 points
- **Team Members Assigned:** 4 members
- **Estimated Time:** 3 weeks

---

## Sprint Backlog for Week 2

## Sprint Goal:
Focus on calorie threshold management, expenditure tracking, and generating weekly summary reports.

## User Stories for Week 2:

### Calorie Threshold Management (User Stories 5-6)
5. **As a user, I want to receive a warning when my daily calorie intake exceeds 2,500 calories, so that I can monitor my calorie consumption.**
   - Tasks:
     - Backend: Implement logic to track daily calorie intake.
     - Frontend: Display warning message when the daily calorie threshold is exceeded.
     - Backend: Store daily calorie intake data in the database.

6. **As a user, I want to view the days when my daily calorie threshold was exceeded, so that I can identify patterns in my dietary habits.**
   - Tasks:
     - Backend: Query and fetch the relevant data for days when the threshold was exceeded.
     - Frontend: Display this data on the user’s dashboard in a list or graph format.

**Estimated Points for Week 2:** 4 points

---

### Monthly Expenditure Tracking (User Stories 7-8)
7. **As a user, I want to add the price of each food item when entering it, so that I can track my monthly expenditure.**
   - Tasks:
     - Frontend: Add price field in the food entry form.
     - Backend: Modify the food entry logic to include price data.

8. **As a user, I want to receive a warning when my monthly expenditure exceeds €1,000, so that I can control my spending.**
   - Tasks:
     - Backend: Implement logic to calculate and track total expenditure for the month.
     - Frontend: Display warning message when expenditure exceeds €1,000.

**Estimated Points for Week 2:** 4 points

---

### Weekly Summary Notification (User Story 9)
9. **As a user, I want to see a report with daily calorie totals, days the calorie limit was exceeded, and total expenditure for the week, so that I can track my weekly progress.**
   - Tasks:
     - Backend: Aggregate data for calorie totals and expenditure for the week.
     - Frontend: Create a report layout to display the aggregated data.
     - Frontend: Implement logic to dynamically display the weekly summary.

**Estimated Points for Week 2:** 3 points

---

## Sprint Planning for Week 2:

- **Total Points for Week 2:** 11 points
- **Team Members Assigned:** 4 members
- **Estimated Time:** 3 weeks

---

## Sprint Backlog for Week 3

## Sprint Goal:
Complete food entry filtering and implement admin role features.

## User Stories for Week 3:

### Food Entry Filtering (User Story 10)
10. **As a user, I want to filter my food entries by specifying a date range, so that I can focus on specific periods.**
   - Tasks:
     - Frontend: Implement date range picker.
     - Backend: Modify query logic to filter food entries by date range.
     - Frontend: Display filtered food entries based on the selected date range.

**Estimated Points for Week 3:** 2 points

---

### Admin Role Features (User Stories 11-12)
11. **As an admin, I want to view and manage all user food entries (create, update, delete), so that I can oversee data effectively.**
   - Tasks:
     - Frontend: Design and implement an admin interface to view all user food entries.
     - Frontend: Create functionality for food entry management.
     - Backend: Implement create, update, and delete functionalities for food entries.

12. **As an admin, I want to access a report showing statistics like entries added in the last 7 days, average calories per user, and users exceeding the spending limit, so that I can monitor application usage and user behavior.**
   - Tasks:
     - Backend: Implement logic to generate statistics.
     - Frontend: Create a report view for the admin to see these statistics.

**Estimated Points for Week 3:** 6 points

---

## Sprint Planning for Week 3:

- **Total Points for Week 3:** 8 points
- **Team Members Assigned:** 4 members
- **Estimated Time:** 3 weeks

---

## Summary of Sprint Backlog:

- **Total Points for Week 1:** 8 points
- **Total Points for Week 2:** 11 points
- **Total Points for Week 3:** 8 points
- **Overall Progress:** Aiming to complete key features while ensuring basic functionality is delivered first.
