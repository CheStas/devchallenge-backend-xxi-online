## Start
```bash
 docker-compose up --build
```

## Covered corner cases
- Do not create a category if it already exists with the given title.
- There are 4 independent models, each running in a separate process. It's easy to update (choose a better) model for the given task.
- The file is stored in a database, could be reused to regenerate transcribe and etc
- It's easy to update the priority of the task.
- Names and Location are comma separated all names and locations occurrences in the text
- If a category is removed, updated or a new one added - for each call category classification task is running

## Test
```bash
 pnpm i
 pnpm run test
```

### Other
- Once the application is started, you can visit [http://localhost:8080/admin/queues/queue/](http://localhost:8080/admin/queues/queue/) to review queue logs and errors, retry jobs, etc.
