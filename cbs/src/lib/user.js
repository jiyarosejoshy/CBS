// "use server";

// import connectDB from "@/lib/db";
// import { User } from "@/models/User";
// import { redirect } from "next/navigation";
// import { hash } from "bcryptjs";
// // import { CredentialsSignin } from "next-auth";
// import { signIn } from "@/auth";

// const login = async (formData) => {
//   const email = formData.get("email") ;
//   const password = formData.get("password") ;

//   try {
//     await signIn("credentials", {
//       redirect: false,
//       callbackUrl: "/",
//       email,
//       password,
//     });
//   } catch (error) {
//     const someError = error ;
//     return someError.cause;
//   }
//   redirect("/user/dashboard");
// };

// const register = async (formData) => {
//   const firstName = formData.get("firstname")
//   const lastName = formData.get("lastname");
//   const email = formData.get("email");
//   const password = formData.get("password");

//   if (!firstName || !lastName || !email || !password) {
//     throw new Error("Please fill all fields");
//   }

//   await connectDB();

//   // existing user
//   const existingUser = await User.findOne({ email });
//   if (existingUser) throw new Error("User already exists");

//   const hashedPassword = await hash(password, 12);

//   await User.create({ firstName, lastName, email, password: hashedPassword });
//   console.log(`User created successfully 🥂`);
//   redirect("/");
// };

// const fetchAllUsers = async () => {
//   await connectDB();
//   const users = await User.find({});
//   return users;
// };

// export { register, login, fetchAllUsers };