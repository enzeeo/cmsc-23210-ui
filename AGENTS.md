# Project Instructions

## Project Goal
- Build a simple website that can be deployed on GitHub.
- The website should have two pages.
- The first page is a terms and conditions page.
- The second page is a webpage with a link.

## Page Requirements

### Page 1: Terms and Conditions
- Show terms and conditions text.
- Include a text input where the user must enter their name before pressing a button.
- Include an `Accept` button.
- Include a `Reject` button.
- The terms and conditions will later be inputted as a PDF use a placeholder for now
- The user must scroll to the bottom of the terms and conditions before they can write their name and press accept or reject. 
- The terms and conditions page should be centered and have a blurred out background.
- This blurred background will be the same background as the second link page. 

### Page 2: Link Page
- Both `Accept` and `Reject` should send the user to the same second page.
- The second page should contain a link.

## Tracking Requirements
- Store exactly what the user typed in the name field.
- Track which button the user pressed: `Accept` or `Reject`.
- Track the time when the button was pressed.

## Deployment Requirements
- The site should be deployable on GitHub Pages.
- Prefer a free solution.

## Recommended Free Setup
- Use GitHub Pages for hosting the website.
- Use Google Sheets plus Google Apps Script as the free tracking backend.
- The frontend should send the typed name, the selected button, and a timestamp to the Google Apps Script endpoint.

## Current Confirmed Decisions
- Free solution is preferred.
- The typed name should be stored exactly as entered.
- `Accept` and `Reject` both go to the same second page.

## Coding Style
- Do not use abbreviations in variable names, function names, or class names unless they are universally accepted.
- Prefer full, descriptive English words.
- Write beginner-friendly code.
- Use explicit logic instead of clever shortcuts.
- Use type hints where the language supports them.
- Replace unexplained numeric literals with named constants.

## Communication Rules
- Ask concise clarification questions when requirements are unclear.
- State assumptions explicitly before proceeding when assumptions are necessary.
- Confirm major design choices before introducing new dependencies, abstractions, or major refactors.
- Keep responses minimal and easy to scan.
