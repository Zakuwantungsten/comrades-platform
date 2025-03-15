import User from "./User.js";

const  test = async () => {
  try {
    const user = await User.findOne({ email: "nassor@example.com" });

    if (!user) {
      console.error("User not found!");
      return;
    }

    console.log("Stored Hashed Password:", user.password);

    const isMatch = await user.comparePassword("123456"); 
    console.log("Password Match:", isMatch); 
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

test()
console.log("Test completed.");