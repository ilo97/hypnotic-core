# Team Coordination Guide

## 1. Using the Kanban Board (`tasks` table)
- **Status Meanings:**
    - `backlog`: Tasks ready to be picked up.
    - `in-progress`: Actively being worked on.
    - `review`: Task finished, waiting for Project Manager or Lead approval.
    - `done`: Task completed and verified.
- **Assignment:** Always check your assigned tasks. If you finish one, don't wait—look at the backlog or check with the Project Manager.

## 2. Communication
- **Updates:** Use `send_message` to the Lead or Project Manager if you are blocked or have significant updates.
- **Results:** When calling `finish_task`, provide a detailed `result` summary. This is crucial for teammates to understand what was done without reading all the code.
- **Shared Files:** Place all shared assets, prototypes, and documents in `/home/team/shared/`. Organize by folder.

## 3. Weekly Planning
- Wöchentliche Planning-Sessions (Virtual or via message updates).
- Project Manager provides a status report to the Founder.

## 4. Quality Gate
- Before moving a task to `review`, ensure it meets the requirements and doesn't break existing features.
- Performance is a priority (Creative Coding goal: 60 FPS).
