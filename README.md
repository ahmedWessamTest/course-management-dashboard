# Course Management Dashboard

Short description

- A lightweight admin dashboard for managing courses: list, create, edit, and view course details.

**Technologies Used:**

- **Framework:** Angular (v21+)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (dev dependency)
- **Icons:** @lucide/angular
- **Testing:** Vitest

**Features Implemented:**

- Courses list page with table-builder component
- Course details page and editable course form (create / update)
- Route guards and resolvers for course data
- Confirmation dialog and notification toasts
- Reusable shared components (buttons, inputs, badges, modal)

**How to run the project:**

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
# or
ng serve
```

3. Open the app in your browser at `http://localhost:4200/`.

**Mock API:**

- The app is configured to use a mock API. The API base URL is defined in [src/environments/environment.ts](src/environments/environment.ts#L1-L3) and currently points to a MockAPI instance (`https://6a3c23bee4a07f202e167a6f.mockapi.io`).
W

**Assumptions:**

- Node.js and `npm` are installed on the machine.
- The developer has internet access (used by the hosted mock API) or will configure a local mock API.

**Bonus / Notable Items:**

- Uses `@lucide/angular` for icons.
