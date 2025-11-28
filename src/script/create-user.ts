import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

async function createUser() {
  await connectToDatabase();
  const hashed = await bcrypt.hash("Admin@123", 10);

  await User.findOneAndUpdate(
    { email: "admin@admin.com" },
    { name: "Admin", email: "admin@admin.com", password: hashed },
    { upsert: true }
  );
  console.log("User created with secure password");
  process.exit();
}

createUser();
