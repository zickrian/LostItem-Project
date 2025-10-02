# Lost Item Project

## WAJIB LOGIN Policy
Users **CANNOT** see anything without logging in. All features are protected and require authentication.

## Tech Stack
- **Frontend:** React
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL)

## Complete Feature Descriptions
- **User Authentication:** Allows users to create accounts, log in, and manage their profiles.
- **Item Listing:** Users can list lost items with descriptions and images.
- **Search Functionality:** Users can search for lost items based on categories and keywords.
- **Notifications:** Users receive notifications when items matching their preferences are listed.

## Database Schema for Supabase (PostgreSQL)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Authentication Implementation Examples
1. **Sign Up:**
   ```javascript
   const { user, error } = await supabase.auth.signUp({
       email: 'example@example.com',
       password: 'password'
   });
   ```

2. **Log In:**
   ```javascript
   const { user, error } = await supabase.auth.signIn({
       email: 'example@example.com',
       password: 'password'
   });
   ```

## Protected Routes Explanation
All routes that require user authentication will check if the user is logged in. If not, they will be redirected to the login page. Example:
```javascript
const ProtectedRoute = ({ component: Component, ...rest }) => {
    const user = supabase.auth.user();
    return (
        <Route
            {...rest}
            render={props =>
                user ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};
```

## Complete Project Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/zickrian/LostItem-Project.git
   cd LostItem-Project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase:**
   - Create a Supabase account and project.
   - Configure your database schema as outlined above.

4. **Run the project:**
   ```bash
   npm start
   ```

5. **Access the application:**
   Open `http://localhost:3000` in your browser.

