# Genshin Impact GAS daily check-in

This is a Google Apps Script project for daily check-in of Genshin Impact.
It takes settings from a Google Spreadsheet, checks in, and sends
a notification to email.

## How to use

1. Create a new Google Spreadsheet.
2. Open the script editor from the menu `Tools > Script editor`.
3. Copy and paste the contents of `main.js` into the editor.
4. Set configurations in the spreadsheet.
    1. Run method `createConfigSheet` from the menu `Run > createConfigSheet`.
    2. Allow permissions.
    3. Turn back to the spreadsheet and open the sheet `Config`.
    4. Fill in the sheet with your information.
        a. `Email` (B2): Your email address.
        b. `Comment` (A3 and below): Comment for each account (used in email).
        c. `ltuid` (B3 and below): `ltuid` of each account.
        d. `ltoken` (C3 and below): `ltoken` of each account.
        `ltuid` and `ltoken` can be obtained from the cookie of the checkin page.
5. Run method `run_me_daily` manually and check if it works.
    1. Run method `run_me_daily` from the menu `Run > run_me_daily`.
    2. Allow permissions.
    3. Check if you receive an email.
6. Set up a trigger to run the script daily.
    1. Open the trigger setting from the menu `Edit > Current project's triggers`.
    2. Click `+ Add Trigger`.
    3. Set `run_me_daily` as the function to run.
    4. Set `Time-driven` as the event source.
    5. Set `Day timer` as the type of time based trigger.
    6. Set the time you want to run the script.
    7. Click `Save`.
