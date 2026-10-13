# Execution Scripts (Layer 3)

This folder contains **deterministic Python scripts** that do the actual work.

Guidelines:
- Each script should be focused, testable, and well-commented.
- Load configuration from `../.env` (use `python-dotenv`).
- Scripts handle: API calls, data processing, file operations, database interactions.
- Never embed business logic that belongs in a directive — scripts are tools, not decision-makers.
