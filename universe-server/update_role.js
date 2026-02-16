// Update user roles to ensure 'student' is present
console.log("Updating user roles for multirole@test.com...");
const result = db.users.updateOne(
    { email: "multirole@test.com" },
    { $addToSet: { roles: "student" } }
);
console.log("Update Result:", result);

// Verify the update
const user = db.users.findOne({ email: "multirole@test.com" });
printjson(user);
