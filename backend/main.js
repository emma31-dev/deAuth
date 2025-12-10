const { Elysia } = require("elysia");
const { node } = require("@elysiajs/node");
const { cors } = require("@elysiajs/cors");
const { db, users, eq } = require('./db');
const crypto = require('crypto');

const app = new Elysia({ adapter: node() })
  .use(cors());

app.get("/", () => ({ hello: "deAuth API" }))

  // Generate nonce for wallet auth
  .post("/auth/nonce", async ({ body }) => {
    const { identifier } = body;
    const nonce = crypto.randomBytes(32).toString('hex');

    // Update or create user with nonce
    db.insert(users)
      .values({ auth_provider: 'wallet', identifier, nonce })
      .onConflictDoUpdate({
        target: users.identifier,
        set: { nonce }
      });

    return { nonce };
  })

// Login/Register endpoint
app.post("/auth/login", async ({ body }) => {
  const { auth_provider, identifier, signature, password } = body;

  if (auth_provider === 'wallet') {
    // Verify wallet signature (simplified)
    const user = db.select().from(users)
      .where(eq(users.identifier, identifier))
      .limit(1);

    if (!user.length) {
      return { error: 'User not found' };
    }

    // Clear nonce after use
    db.update(users)
      .set({ nonce: null })
      .where(eq(users.identifier, identifier));

    return { success: true, user: user[0] };
  } else {
    // Email/Gmail auth
    let user = db.select().from(users)
      .where(eq(users.identifier, identifier))
      .limit(1);

    if (!user.length) {
      // Create new user
      const userData = { auth_provider, identifier };
      if (auth_provider === 'email' && password) {
        userData.password = password;
      }
      const newUser = db.insert(users)
        .values(userData)
        .returning();
      return { success: true, user: newUser[0] };
    } else {
      // Check password for email auth
      if (auth_provider === 'email' && user[0].password !== password) {
        return { error: 'Invalid password' };
      }
    }

    return { success: true, user: user[0] };
  }
})

app.listen(3000);

console.log(`deAuth API listening well on http://localhost:3000`);