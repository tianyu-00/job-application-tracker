# Job Application Tracker

A full-stack job application tracking platform built with React, Vite, Node.js, Express, Playwright, and PostgreSQL. The goal is to simplify the job search process by allowing users to submit job URLs and automatically extract useful job information.

## Features

### Frontend

- [x] Submit job URL
- [x] Display scraped job information
- [x] Manage saved jobs

### Backend

- [x] Scrape job websites
- [x] Get job information
- [x] Store jobs in database
- [ ] Export database to spreadsheet

### Job Information

For now, we'll collect:

- Job title
- Company
- Location
- Description

More information will be added later.

## Thought Process

- Frontend sends job URL
- Express receives request
- Route validates input
- Controller decides scraper type
- Scraper registry selects the correct scraper
- Playwright opens the browser
- Scraper extracts the job information
- Returns structured JSON
- API responds to frontend
- Store the data in the database

Indeed will be the first supported website, with other job boards added later.

## Docs

- [Playwright](https://playwright.dev/docs/intro)
- [Playwright Navigations](https://playwright.dev/docs/navigations)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Actionability](https://playwright.dev/docs/actionability)
- [Playwright Evaluating](https://playwright.dev/docs/evaluating)
- [Playwright Debugging](https://playwright.dev/docs/debug)
- [shadcn/ui + Vite](https://ui.shadcn.com/docs/installation/vite)
