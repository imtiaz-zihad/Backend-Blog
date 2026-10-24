import { email } from "better-auth";
import { prisma } from "../lib/prisma.js";
import { UserRole } from "../middlewares/auth.js";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Admin 2",
      email: "admin2@gmail.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };
    // check user exits on db
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("user already exits");
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Origin: "http://localhost:4000",
        },
        body: JSON.stringify(adminData),
      },
    );

    const result = await signUpAdmin.json();

    if(signUpAdmin.ok){
        await prisma.user.update({
            where:{
                email: adminData.email
            },
            data:{
                emailVerified: true
            }
        })
    }

    console.log("Status:", signUpAdmin.status);
    console.log("Response:", result);

   
    console.log(signUpAdmin);
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
