import re
from playwright.sync_api import sync_playwright, Page, expect

def verify_sidebar(page: Page):
    """
    This script verifies that the new sidebar is correctly implemented
    in the app layout after logging in.
    """
    # 1. Arrange: Go to the login page.
    page.goto("http://localhost:3000/login")

    # 2. Act: Fill in the login form and submit.
    # Using get_by_placeholder as it's a good user-facing locator.
    page.get_by_placeholder("email@example.com").fill("test@test.com")
    page.get_by_placeholder("••••••••").fill("password")

    # Click the login button
    login_button = page.get_by_role("button", name=re.compile("log in", re.IGNORECASE))
    login_button.click()

    # 3. Assert: Wait for navigation and confirm the new layout.
    # We expect to be on the app's dashboard page.
    expect(page).to_have_url(re.compile(".*/app"))

    # We expect to see the "Dashboard" heading from our new layout.
    dashboard_heading = page.get_by_role("heading", name="Dashboard")
    expect(dashboard_heading).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/sidebar_styling_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_sidebar(page)
        browser.close()
